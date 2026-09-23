// Server/CLI only: never import this module from client components.
const models={text:'@cf/meta/llama-3.1-8b-instruct',embedding:'@cf/baai/bge-m3'} as const;
export const aiConfigured=()=>!!process.env.CLOUDFLARE_ACCOUNT_ID&&!!process.env.CLOUDFLARE_API_TOKEN;
export async function cloudflare(kind:keyof typeof models,input:Record<string,unknown>):Promise<Record<string,unknown>>{
 if(!aiConfigured())throw Error('Serviço de IA não configurado.');
 const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${models[kind]}`,{
  method:'POST',headers:{Authorization:`Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,'Content-Type':'application/json'},
  body:JSON.stringify(input),signal:AbortSignal.timeout(45000),
 });
 if(!response.ok){const error=Error('O serviço de IA está indisponível.');error.name=`ProviderHTTP${response.status}`;throw error;}
 const data=await response.json();if(!data.success||!data.result){const error=Error('O serviço de IA não retornou uma resposta válida.');error.name='InvalidProviderResponse';throw error;}
 return data.result;
}
export async function embed(text:string):Promise<number[]>{
 if(Buffer.byteLength(text,'utf8')>12000)throw Error('Trecho muito grande para indexação.');
 const result=await cloudflare('embedding',{text:[text]});const rows=result.data;
 const vector=Array.isArray(rows)?rows[0]:null;
 if(!Array.isArray(vector)||vector.length!==1024||!vector.every(value=>typeof value==='number'&&Number.isFinite(value))){const error=Error('Embedding inválido.');error.name='InvalidEmbedding';throw error;}
 return vector;
}
export async function generateJSON(system:string,payload:unknown,maxTokens=650,schema?:Record<string,unknown>):Promise<unknown>{
 const user=JSON.stringify(payload);
 // The reservation uses this byte ceiling as a conservative token upper bound.
 if(Buffer.byteLength(system+user,'utf8')>24000||maxTokens>900)throw Error('Conteúdo excede o limite desta análise.');
 const result=await cloudflare('text',{messages:[{role:'system',content:system},{role:'user',content:user}],max_tokens:maxTokens,temperature:0.1,response_format:schema?{type:'json_schema',json_schema:schema}:{type:'json_object'}});
 return typeof result.response==='string'?JSON.parse(result.response):result.response;
}
