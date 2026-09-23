import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Identity } from '../identity';
export const UPSTREAM='https://pem-monarcas-estudos.tacyohenrique07.chatgpt.site';
export const configured=()=>Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.IDENTITY_HMAC_KEY);
export async function supabaseSession(){
 const jar=await cookies();
 return createServerClient(process.env.SUPABASE_URL!,process.env.SUPABASE_ANON_KEY!,{
  cookies:{getAll:()=>jar.getAll(),setAll:values=>{
   try{values.forEach(({name,value,options})=>jar.set(name,value,options));}
   catch{/* Server Components cannot refresh cookies; route handlers can. */}
  }}
 });
}
export async function getIdentity():Promise<Identity|null>{
 if(configured()){
  try {const db=await supabaseSession();const {data:{user}}=await db.auth.getUser();if(user){const {data:profile}=await db.from('profiles').select('active,role,display_name').eq('id',user.id).maybeSingle();if(!profile?.active)return null;return {id:user.id,kind:'student',label:profile.display_name,role:profile.role};}} catch {return null;}
 }
 const token=(await cookies()).get('pem_session')?.value;
 if(!token||process.env.LEGACY_AUTH_ENABLED==='false')return null;
 try{const r=await fetch(`${UPSTREAM}/api/data`,{headers:{cookie:`pem_session=${token}`},cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)return null;const d=await r.json();if(typeof d.userKey!=='string')return null;return {id:`legacy-${d.userKey}`,kind:'legacy',label:'Estudante',legacyKey:d.userKey};}catch{return null;}
}
