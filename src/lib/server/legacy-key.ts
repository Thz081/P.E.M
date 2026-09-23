// The old service owns the HMAC secret. Ask it to authenticate the matrícula
// associated with the new account instead of trusting a browser storage key.
export async function verifiedLegacyKey(matricula:string,upstream:string,fetcher:typeof fetch=fetch):Promise<string|null>{
 if(!/^\d{5,12}$/.test(matricula))return null;
 try{
  const login=await fetcher(`${upstream}/api/login`,{method:'POST',headers:{'Content-Type':'application/json',Origin:upstream},body:JSON.stringify({matricula,senha:matricula}),signal:AbortSignal.timeout(8000),cache:'no-store'});
  if(!login.ok)return null;
  const session=login.headers.getSetCookie().find(cookie=>cookie.startsWith('pem_session='))?.split(';')[0];
  if(!session)return null;
  const data=await fetcher(`${upstream}/api/data`,{headers:{cookie:session},signal:AbortSignal.timeout(8000),cache:'no-store'});
  if(!data.ok)return null;
  const value=await data.json();
  return typeof value.userKey==='string'&&/^[a-f0-9]{64}$/.test(value.userKey)?value.userKey:null;
 }catch{return null;}
}
