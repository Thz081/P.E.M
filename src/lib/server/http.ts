export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export async function readJson(req:Request,max=30000){
 if(!sameOrigin(req))throw new Error('Origem inválida.');
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw new Error('Formato inválido.');
 const reader=req.body?.getReader();if(!reader)throw new Error('Corpo vazio.');let text='',size=0;const decoder=new TextDecoder();
 for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('Texto muito grande.');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();return JSON.parse(text);
}
