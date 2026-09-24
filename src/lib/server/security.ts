import 'server-only';
import {getIdentity,supabaseSession} from './session';
import {adminDb,identifier} from './admin';
export async function student(){const user=await getIdentity();if(!user||user.kind!=='student'||user.role!=='student')return null;const db=await supabaseSession();const {data}=await db.from('profiles').select('role,active').eq('id',user.id).single();return data?.active&&data.role==='student'?user:null;}
export async function admin(){const user=await getIdentity();if(!user||user.kind!=='student'||user.role!=='admin')return null;const {data}=await adminDb().from('admin_access').select('user_id').eq('user_id',user.id).not('activated_at','is',null).maybeSingle();return data?user:null;}
export async function rateLimit(scope:string,key:string,count:number,seconds:number){const {data,error}=await adminDb().rpc('take_rate_limit',{bucket:identifier(`${scope}:${key}`),max_count:count,seconds});return !error&&data===true;}
export function strongPassword(value:unknown):value is string{return typeof value==='string'&&value.length>=12&&value.length<=128&&/[a-z]/.test(value)&&/[A-Z]/.test(value)&&/\d/.test(value)&&/[^A-Za-z0-9]/.test(value);}
