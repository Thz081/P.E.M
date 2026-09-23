import {z} from 'zod';
import {json,readJson} from '@/lib/server/http';
import {adminDb,adminIdentifier,identifier} from '@/lib/server/admin';
import {configured} from '@/lib/server/session';
import {rateLimit} from '@/lib/server/security';

const input=z.object({matricula:z.string().regex(/^\d{5,12}$/),code:z.string().min(12).max(80),senha:z.string().min(10).max(128),area:z.enum(['student','admin']).default('student')}).strict();
export async function POST(req:Request){
 if(!configured())return json({error:'A ativação pessoal ainda está sendo preparada. Você pode explorar a demonstração.'},503);
 try{
  const data=input.parse(await readJson(req,2000));const id=data.area==='admin'?adminIdentifier(data.matricula):identifier(data.matricula);
  if(!await rateLimit(`activation:${data.area}`,id,5,900))return json({error:'Aguarde 15 minutos antes de tentar novamente.'},429);
  const db=adminDb(),table=data.area==='admin'?'admin_access':'roster',now=new Date().toISOString();
  const {data:row,error}=await db.from(table).update({code_consumed_at:now}).eq('identifier',id).eq('code_hash',identifier(data.code.trim())).is('code_consumed_at',null).gt('code_expires_at',now).select('user_id').maybeSingle();
  if(error||!row)return json({error:'Código inválido, expirado ou já utilizado.'},400);
  const result=await db.auth.admin.updateUserById(row.user_id,{password:data.senha,email_confirm:true});
  if(result.error)return json({error:'Não foi possível definir a senha. Peça um novo código ao responsável.'},503);
  await db.from(table).update({activated_at:now,code_hash:null}).eq('identifier',id);
  if(data.area==='student')await db.from('reset_requests').update({resolved_at:now}).eq('identifier',id);
  return json({ok:true});
 }catch{return json({error:'Confira a matrícula, o código e uma senha com pelo menos 10 caracteres.'},400);}
}
