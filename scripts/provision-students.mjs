// Input is a private JSON array outside the repository. Never log student identifiers.
import {readFileSync,existsSync} from 'node:fs';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHmac,randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {parseRoster,selectClassBackup} from './roster-input.mjs';

async function main(){
 const args=process.argv.slice(2);const input=args.find(arg=>!arg.startsWith('--'));
 if(!input)throw Error('Uso: node scripts/provision-students.mjs CAMINHO_PRIVADO.json [--apply]');
 const root=fileURLToPath(new URL('..',import.meta.url));const path=resolve(input);const rel=relative(root,path);
 if(rel!== '..'&&!rel.startsWith(`..${sep}`)&&!isAbsolute(rel))throw Error('A lista privada deve ficar fora do repositório.');
 const inputRows=JSON.parse(readFileSync(path,'utf8'));const rows=inputRows.length===41?parseRoster(inputRows):selectClassBackup(inputRows);
 console.log('Lista validada: 41 matrículas únicas, somente turma 3A DS.');
 if(!args.includes('--apply')){console.log('Simulação local: nenhuma conta criada. Use --apply após configurar e validar o ambiente.');return;}
 const env=new URL('../.env.local',import.meta.url);if(existsSync(env))process.loadEnvFile(env);
 if(process.env.SUPABASE_URL!=='https://jfvfckkulpcqvhkjwgvy.supabase.co')throw Error('Projeto inesperado. Importação interrompida.');
 if(!process.env.SUPABASE_SERVICE_ROLE_KEY||(process.env.IDENTITY_HMAC_KEY?.length||0)<32)throw Error('Credenciais do servidor incompletas.');
 const hash=value=>createHmac('sha256',process.env.IDENTITY_HMAC_KEY).update(value).digest('hex');
 const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const known=new Map();let page=1;
 for(;;){const {data,error}=await db.auth.admin.listUsers({page,perPage:1000});if(error)throw Error('Não foi possível consultar as contas.');for(const user of data.users)known.set(user.email,user);if(data.users.length<1000)break;page++;}
 let created=0,existing=0;
 for(const row of rows){
  const id=hash(row.matricula);const email=`${id}@alunos.pem.invalid`;
  let user=known.get(email);
  if(user && user.app_metadata?.pem_identifier!==id)throw Error('Conta existente sem vínculo confirmado com esta importação. Revisão necessária.');
  if(!user){const result=await db.auth.admin.createUser({email,password:randomBytes(48).toString('base64url'),email_confirm:true,app_metadata:{pem_identifier:id}});if(result.error||!result.data.user)throw Error('Falha ao criar conta. Retome a importação após verificar o serviço.');user=result.data.user;created++;}else existing++;
  const profile=await db.from('profiles').upsert({id:user.id,role:'student'},{onConflict:'id',ignoreDuplicates:true});
  if(profile.error)throw Error('Falha ao preparar perfil. Retome a importação; contas existentes serão preservadas.');
  const roster=await db.from('roster').upsert({identifier:id,matricula:row.matricula,nome:row.nome,turma:row.turma,user_id:user.id},{onConflict:'identifier',ignoreDuplicates:true});
  if(roster.error)throw Error('Falha ao preparar cadastro. Retome a importação; senhas existentes não serão alteradas.');
 }
 console.log(`Importação concluída: ${created} contas criadas; ${existing} contas existentes preservadas. Nenhuma senha ou código foi distribuído.`);
}
main().catch(error=>{console.error(error instanceof SyntaxError?'JSON inválido.':error.message);process.exitCode=1;});
