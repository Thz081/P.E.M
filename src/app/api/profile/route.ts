import {z} from 'zod';
import {student} from '@/lib/server/security';
import {supabaseSession} from '@/lib/server/session';
import {json,readJson} from '@/lib/server/http';
const input=z.object({display_name:z.string().trim().min(1).max(80),avatar:z.enum(['dragon','phoenix','owl','book'])}).strict();
export async function GET(){
 const user=await student();if(!user)return json({error:'Entre com sua conta pessoal.'},401);
 const db=await supabaseSession();const {data,error}=await db.from('profiles').select('display_name,avatar').eq('id',user.id).single();
 return error?json({error:'Não foi possível carregar o perfil.'},503):json({profile:data});
}
export async function PATCH(req:Request){
 try{
  const user=await student();if(!user)return json({error:'Entre com sua conta pessoal.'},401);
  const value=input.parse(await readJson(req,2000));const db=await supabaseSession();
  const {data,error}=await db.from('profiles').update(value).eq('id',user.id).select('display_name,avatar').single();
  return error?json({error:'Não foi possível salvar o perfil.'},503):json({profile:data});
 }catch{return json({error:'Confira o apelido e o avatar.'},400);}
}
