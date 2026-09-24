import {json,readJson} from '@/lib/server/http';
import {student} from '@/lib/server/security';
import {supabaseSession} from '@/lib/server/session';
import {parseProgress} from '@/lib/progress';
export async function GET(){const user=await student();if(!user)return json({error:'Entre com sua conta pessoal.'},401);const db=await supabaseSession();const {data,error}=await db.from('progress').select('data,revision').eq('user_id',user.id).maybeSingle();if(error)return json({error:'Não foi possível sincronizar.'},503);return json({progress:data?.data||null,revision:data?.revision??0});}
export async function PUT(req:Request){try{const user=await student();if(!user)return json({error:'Entre com sua conta pessoal.'},401);const body=await readJson(req,250000);const progress=parseProgress(body.progress);const revision=Number(body.revision);if(!Number.isInteger(revision)||revision<0)return json({error:'Revisão inválida.'},400);const db=await supabaseSession();const record={data:progress,revision:revision+1,updated_at:new Date().toISOString()};let error,changed;
 if(revision===0){const result=await db.from('progress').insert({...record,user_id:user.id}).select('revision');error=result.error;changed=result.data;}
 else{const result=await db.from('progress').update(record).eq('user_id',user.id).eq('revision',revision).select('revision');error=result.error;changed=result.data;}
 if(error||!changed?.length)return json({error:'Seu progresso mudou em outra aba. Recarregue para sincronizar; a cópia local foi preservada.'},409);return json({revision:revision+1});}catch{return json({error:'Não foi possível salvar.'},400);}}
