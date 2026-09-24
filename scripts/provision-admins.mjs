// Provision exactly two separate operator identities after the student roster exists.
// Codes are written only to a private file outside the repository, never to stdout.
import {existsSync,writeFileSync} from 'node:fs';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHmac,randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';

async function main(){
 const args=process.argv.slice(2);const values=args.filter(arg=>!arg.startsWith('--'));
 if(values.length!==3)throw Error('Uso: node scripts/provision-admins.mjs MATRICULA_1 MATRICULA_2 ARQUIVO_PRIVADO_DE_CODIGOS.json [--apply]');
 const [first,second,outputName]=values;
 if(!/^\d{5,12}$/.test(first)||!/^\d{5,12}$/.test(second)||first===second)throw Error('Informe duas matrículas distintas e válidas.');
 const root=fileURLToPath(new URL('..',import.meta.url)),output=resolve(outputName),rel=relative(root,output);
 if(rel!== '..'&&!rel.startsWith(`..${sep}`)&&!isAbsolute(rel))throw Error('O arquivo de códigos deve ficar fora do repositório.');
 if(existsSync(output))throw Error('O arquivo de saída já existe. Escolha outro caminho privado para não substituir códigos anteriores.');
 const env=new URL('../.env.local',import.meta.url);if(existsSync(env))process.loadEnvFile(env);
 if(process.env.SUPABASE_URL!=='https://jfvfckkulpcqvhkjwgvy.supabase.co'||!process.env.SUPABASE_SERVICE_ROLE_KEY||(process.env.IDENTITY_HMAC_KEY?.length||0)<32)throw Error('Ambiente do projeto PEM incompleto ou inesperado.');
 const hash=value=>createHmac('sha256',process.env.IDENTITY_HMAC_KEY).update(value).digest('hex');
 const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const matriculas=[first,second];
 const {data:students,error:rosterError}=await db.from('roster').select('matricula').in('matricula',matriculas);
 if(rosterError||students?.length!==2)throw Error('Os dois responsáveis devem constar no cadastro validado do 3A DS.');
 const {data:current,error:accessError}=await db.from('admin_access').select('matricula');
 if(accessError||current?.some(row=>!matriculas.includes(row.matricula)))throw Error('Existe acesso administrativo fora da dupla autorizada. Revisão necessária.');
 console.log('Duas matrículas autorizadas encontradas no cadastro; nenhuma outra conta administrativa permitida por este script.');
 if(!args.includes('--apply')){console.log('Simulação concluída; nenhuma conta/código criado.');return;}
 const known=new Map();let page=1;
 for(;;){const {data,error}=await db.auth.admin.listUsers({page,perPage:1000});if(error)throw Error('Não foi possível consultar as contas.');for(const user of data.users)known.set(user.email,user);if(data.users.length<1000)break;page++;}
 const expiresAt=new Date(Date.now()+86400000).toISOString(),entries=[];
 for(const matricula of matriculas){
  const identifier=hash(`admin:${matricula}`),email=`${identifier}@admin.pem.invalid`;
  let user=known.get(email);
  if(user&&user.app_metadata?.pem_admin_identifier!==identifier)throw Error('Conta administrativa preexistente sem vínculo confirmado.');
  if(!user){const created=await db.auth.admin.createUser({email,password:randomBytes(48).toString('base64url'),email_confirm:true,app_metadata:{pem_admin_identifier:identifier}});if(created.error||!created.data.user)throw Error('Falha ao criar conta administrativa. Reexecute com novo arquivo após verificar o serviço.');user=created.data.user;}
  const profile=await db.from('profiles').upsert({id:user.id,role:'admin'},{onConflict:'id',ignoreDuplicates:true});if(profile.error)throw Error('Falha no perfil administrativo.');
  const access=await db.from('admin_access').upsert({identifier,matricula,user_id:user.id},{onConflict:'identifier',ignoreDuplicates:true});if(access.error)throw Error('Falha no vínculo administrativo.');
  const {data:verified}=await db.from('admin_access').select('user_id').eq('identifier',identifier).single();if(verified?.user_id!==user.id)throw Error('Vínculo administrativo divergente.');
  const code=randomBytes(18).toString('base64url');
  const issued=await db.from('admin_access').update({code_hash:hash(code),code_expires_at:expiresAt,code_consumed_at:null}).eq('identifier',identifier);
  if(issued.error)throw Error('Falha ao emitir código de ativação administrativa.');
  const studentCode=randomBytes(18).toString('base64url');
  const studentIssued=await db.from('roster').update({code_hash:hash(studentCode),code_expires_at:expiresAt,code_consumed_at:null}).eq('matricula',matricula).is('activated_at',null).select('identifier').maybeSingle();
  if(studentIssued.error||!studentIssued.data)throw Error('Falha ao emitir código do acesso de aluno.');
  entries.push({matricula,studentCode,adminCode:code});
 }
 writeFileSync(output,JSON.stringify({expiresAt,entries},null,2),{mode:0o600,flag:'wx'});
 console.log('Dois pares de contas de aluno/administração preparados. Quatro códigos de uso único gravados somente no arquivo privado indicado.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
