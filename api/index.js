const UPSTREAM='https://pem-monarcas-estudos.tacyohenrique07.chatgpt.site';
export default {
 async fetch(request) {
  const incoming=new URL(request.url);
  const path=incoming.searchParams.get('__pem_path') || incoming.pathname;
  const upstream=new URL(UPSTREAM); upstream.pathname=path.startsWith('/')?path:'/'+path;
  const headers=new Headers(request.headers);
  headers.delete('host'); headers.delete('content-length'); headers.delete('accept-encoding');
  if(!['GET','HEAD'].includes(request.method)){
   if(headers.get('origin')!==incoming.origin) return new Response('Origem inválida',{status:403});
   headers.set('origin',UPSTREAM);
  }
  try{
   const result=await fetch(upstream,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:await request.arrayBuffer(),redirect:'manual'});
   const out=new Headers(result.headers);
   out.delete('content-encoding');out.delete('content-length');
   const location=out.get('location');if(location?.startsWith(UPSTREAM))out.set('location',location.replace(UPSTREAM,incoming.origin));
   out.set('Cache-Control','no-store');
   return new Response(result.body,{status:result.status,headers:out});
  }catch{return new Response('Portal temporariamente indisponível. Tente novamente.',{status:502});}
 }
};