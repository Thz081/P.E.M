import {Portal} from '@/components/portal';
import {demoIdentity} from '@/lib/identity';
export default async function Demo({params,searchParams}:{params:Promise<{section?:string[]}>;searchParams:Promise<{aula?:string}>}){const {section}=await params;const {aula}=await searchParams;return <Portal section={section?.[0]||'inicio'} user={demoIdentity} initialLesson={aula}/>;}
