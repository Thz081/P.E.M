import 'server-only';
import {adminDb,identifier} from './admin';
import {json} from './http';
import {z} from 'zod';
export async function withGeneration(req:Request,userId:string,kind:'chat'|'essay',payload:unknown,work:()=>Promise<unknown>){
 const parsed=z.string().uuid().safeParse(req.headers.get('Idempotency-Key'));
 if(!parsed.success)return json({error:'Identificador da solicitação inválido.'},400);
 const id=parsed.data;const db=adminDb();const hash=identifier(JSON.stringify({version:1,kind,payload}));
 // At most 24 KB input, 900 output tokens, plus a 12 KB embedding. No paid models or automatic retries.
 const {data:reservation,error}=await db.rpc('reserve_generation',{p_id:id,p_user:userId,p_kind:kind,p_hash:hash,p_neurons:800});
 if(error)return json({error:'Não foi possível reservar a cota gratuita.'},503);
 if(reservation==='complete'){
  const {data}=await db.from('generations').select('output').eq('id',id).eq('user_id',userId).eq('request_hash',hash).single();
  return data?.output?json(data.output):json({error:'Resposta anterior indisponível.'},503);
 }
 if(reservation!=='reserved'){
  const messages:Record<string,string>={running:'Esta solicitação já está em processamento.',failed:'Esta solicitação falhou. Envie uma nova tentativa quando o serviço estiver disponível.',conflict:'Identificador já utilizado em outra solicitação.',student:'Sua cota de uso foi atingida. Continue com os conteúdos e exercícios.',busy:'O tutor está ocupado. Tente novamente em instantes.',budget:'A cota gratuita de hoje foi reservada. Volte amanhã.',daily:'O limite diário de solicitações foi atingido.'};
  return json({error:messages[reservation]||'Solicitação não autorizada.'},['running','failed','conflict'].includes(reservation)?409:429);
 }
 try{
  const output=await work();
  const saved=await db.from('generations').update({status:'complete',output}).eq('id',id).eq('user_id',userId);
  if(saved.error)throw Error('Não foi possível guardar a resposta.');
  return json(output);
 }catch(error){
  // Only the error class is recorded: never prompts, provider payloads or secrets.
  console.warn('AI request failed:',error instanceof Error?error.name:'UnknownError');
  await db.from('generations').update({status:'failed',output:{failure:error instanceof Error?error.name:'UnknownError'}}).eq('id',id).eq('user_id',userId);
  return json({error:'Não foi possível produzir uma resposta verificada. Seus estudos continuam disponíveis; tente mais tarde.'},503);
 }
}
