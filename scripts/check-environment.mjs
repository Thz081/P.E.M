import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';

const file=new URL('../.env.local',import.meta.url);
if(process.argv.includes('--init-hmac')){
 let text=existsSync(file)?readFileSync(file,'utf8'):'';
 const current=text.match(/^IDENTITY_HMAC_KEY=(.*)$/m);
 if(!current || !current[1].trim().replace(/^['"]|['"]$/g,'')){
  const entry=`IDENTITY_HMAC_KEY=${randomBytes(32).toString('hex')}`;
  text=current?text.replace(/^IDENTITY_HMAC_KEY=.*$/m,entry):`${text.trimEnd()}\n${entry}\n`;
  writeFileSync(file,text,{mode:0o600});
  console.log('Chave HMAC criada no ambiente local; valor não exibido. Preserve esta chave após provisionar contas.');
 }
}
if(existsSync(file))process.loadEnvFile(file);
const names=['SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','IDENTITY_HMAC_KEY','CLOUDFLARE_ACCOUNT_ID','CLOUDFLARE_API_TOKEN'];
for(const name of names)console.log(`${name}: ${process.env[name]?.trim()?'presente':'pendente'}`);
const auth=names.slice(0,4).every(name=>!!process.env[name]?.trim()) && (process.env.IDENTITY_HMAC_KEY?.length||0)>=32;
console.log(`Contas pessoais: ${auth?'configuração local presente; falta validar a conexão e os fluxos reais':'configuração incompleta'}`);
console.log('Presença de credenciais não significa integração validada. Nenhum segredo é exibido.');
if(process.argv.includes('--require-auth')&&!auth)process.exitCode=1;
