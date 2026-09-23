import {json,readJson} from '@/lib/server/http';
import {adminDb,identifier} from '@/lib/server/admin';
import {configured} from '@/lib/server/session';
import {rateLimit} from '@/lib/server/security';
export async function POST(req:Request){if(!configured())return json({error:'Recuperação pessoal em preparação.'},503);try{const {matricula}=await readJson(req,1000);if(!/^\d{5,12}$/.test(matricula))throw Error();const id=identifier(matricula);if(await rateLimit('recovery',id,2,3600)){const db=adminDb();const {data}=await db.from('roster').select('identifier').eq('identifier',id).maybeSingle();if(data)await db.from('reset_requests').upsert({identifier:id,requested_at:new Date().toISOString(),resolved_at:null});}return json({ok:true,message:'Se a matrícula estiver cadastrada, o responsável receberá o pedido. Solicite seu novo código a ele.'});}catch{return json({error:'Confira o formato da matrícula.'},400);}}
