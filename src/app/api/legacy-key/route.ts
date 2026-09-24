import {json} from '@/lib/server/http';
import {student} from '@/lib/server/security';
import {adminDb} from '@/lib/server/admin';
import {verifiedLegacyKey} from '@/lib/server/legacy-key';
import {UPSTREAM} from '@/lib/server/session';

export async function GET(){
 const user=await student();if(!user)return json({error:'Entre com sua conta pessoal.'},401);
 const {data:roster,error}=await adminDb().from('roster').select('matricula').eq('user_id',user.id).maybeSingle();
 if(error)return json({error:'Não foi possível conferir sua matrícula.'},503);
 if(!roster)return json({legacyKey:null});
 return json({legacyKey:await verifiedLegacyKey(roster.matricula,UPSTREAM)});
}
