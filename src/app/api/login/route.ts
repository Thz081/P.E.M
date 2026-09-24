import {configured,UPSTREAM,supabaseSession} from '@/lib/server/session';
import {json,readJson} from '@/lib/server/http';
import {adminDb,adminEmail,adminIdentifier,identifier,technicalEmail} from '@/lib/server/admin';
import {rateLimit} from '@/lib/server/security';
import {cookies} from 'next/headers';
export async function POST(req:Request){
 try{
   const invalid='Confira a matrícula e a senha.';
  const {matricula,senha,area='student'}=await readJson(req,1500);
  if(area!=='student'&&area!=='admin')return json({error:'Área de acesso inválida.'},400);
  if(!/^\d{5,12}$/.test(String(matricula))||typeof senha!=='string'||senha.length>128)return json({error:'Confira a matrícula e a senha.'},400);
  if(area==='admin'){
   if(!configured())return json({error:'A administração ainda não está configurada.'},503);
   const {data:access,error:lookupError}=await adminDb().from('admin_access').select('user_id,activated_at').eq('identifier',adminIdentifier(matricula)).maybeSingle();
   if(lookupError)return json({error:'Não foi possível conferir o acesso agora. Tente novamente.'},503);
    if(!access?.activated_at)return json({error:invalid},401);
    if(!await rateLimit('login:admin',access.user_id,5,900))return json({error:invalid},401);
    const db=await supabaseSession();const {error}=await db.auth.signInWithPassword({email:adminEmail(matricula),password:senha});
    if(error)return json({error:invalid},401);
   (await cookies()).delete('pem_session');return json({ok:true,area:'admin'});
  }
  if(configured()){
   const {data:roster,error:lookupError}=await adminDb().from('roster').select('user_id').eq('identifier',identifier(matricula)).maybeSingle();
   if(lookupError)return json({error:'Não foi possível conferir o acesso agora. Tente novamente.'},503);
    if(roster){
     if(!await rateLimit('login:student',roster.user_id,10,900))return json({error:invalid},401);
     const db=await supabaseSession();const {error}=await db.auth.signInWithPassword({email:technicalEmail(matricula),password:senha});
     if(error)return json({error:invalid},401);
    (await cookies()).delete('pem_session');
    return json({ok:true});
   }
  }
  if(process.env.LEGACY_AUTH_ENABLED==='false')return json({error:'O acesso pessoal está em manutenção. A demonstração continua disponível.'},503);
  const r=await fetch(`${UPSTREAM}/api/login`,{method:'POST',headers:{'Content-Type':'application/json',Origin:UPSTREAM},body:JSON.stringify({matricula,senha}),signal:AbortSignal.timeout(10000)});
  if(r.ok&&configured())await (await supabaseSession()).auth.signOut();
   const out=json(r.ok?{ok:true}:{error:invalid},r.ok?200:401);
  for(const cookie of r.headers.getSetCookie())if(cookie.startsWith('pem_session='))out.headers.append('Set-Cookie',process.env.NODE_ENV==='development'?cookie.replace(/;\s*Secure/gi,''):cookie);
  return out;
 }catch{return json({error:'Não foi possível entrar agora. Tente novamente.'},400);}
}
