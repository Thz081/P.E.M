import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {createHmac} from 'node:crypto';
export const adminDb=()=>createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
export function identifier(value:string){const key=process.env.IDENTITY_HMAC_KEY;if(!key||key.length<32)throw Error('Identificação ainda não configurada.');return createHmac('sha256',key).update(value).digest('hex');}
export const technicalEmail=(matricula:string)=>`${identifier(matricula)}@alunos.pem.invalid`;
export const adminIdentifier=(matricula:string)=>identifier(`admin:${matricula}`);
export const adminEmail=(matricula:string)=>`${adminIdentifier(matricula)}@admin.pem.invalid`;
