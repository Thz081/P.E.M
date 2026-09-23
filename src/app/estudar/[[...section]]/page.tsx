import {Portal} from '@/components/portal';
import {getIdentity} from '@/lib/server/session';
import {redirect} from 'next/navigation';
export default async function Study({params,searchParams}:{params:Promise<{section?:string[]}>;searchParams:Promise<{aula?:string}>}){const user=await getIdentity();if(!user)redirect('/');if(user.role==='admin')redirect('/admin');const {section}=await params;const {aula}=await searchParams;return <Portal section={section?.[0]||'inicio'} user={user} initialLesson={aula}/>;}
