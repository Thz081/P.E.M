import { cookies } from 'next/headers';
import {configured,supabaseSession} from '@/lib/server/session';
import {json,sameOrigin} from '@/lib/server/http';
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origem inválida'},403);if(configured()){const db=await supabaseSession();await db.auth.signOut();}(await cookies()).delete('pem_session');return json({ok:true});}
