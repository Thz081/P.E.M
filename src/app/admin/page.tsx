import {redirect} from 'next/navigation';
import {admin} from '@/lib/server/security';
import {Admin} from '@/components/admin';
import {getIdentity} from '@/lib/server/session';
export default async function AdminPage(){
 const user=await admin();
 if(!user){const identity=await getIdentity();redirect(identity?.role==='student'?'/estudar':'/');}
 if(user.role!=='admin')redirect('/estudar');
 return <Admin/>;
}
