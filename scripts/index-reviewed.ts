import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {createHash,randomUUID,randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {embed} from '../src/lib/ai-provider';

const schema=z.object({version:z.string().min(1),documents:z.array(z.object({
 source:z.string(),sha256:z.string().regex(/^[a-f0-9]{64}$/),title:z.string().min(1).max(200),subject:z.string(),
 reviewed:z.literal(true),authorized:z.literal(true),review:z.string().min(20),authorization:z.string().min(20),
 chunks:z.array(z.object({page:z.number().int().positive(),ordinal:z.number().int().nonnegative(),body:z.string().min(30).max(5000)})).min(1),
})).min(1)});
async function main(){
 const args=process.argv.slice(2);const input=args.find(value=>!value.startsWith('--'));if(!input)throw Error('Informe o JSON privado revisado; --apply para indexar.');
 const file=resolve(input);const relation=relative(process.cwd(),file);
 if(!relation.startsWith('..')&&!isAbsolute(relation))throw Error('Mantenha os conteúdos privados fora do repositório.');
 const reviewed=schema.parse(JSON.parse(readFileSync(file,'utf8')));
 const total=reviewed.documents.reduce((count,doc)=>count+doc.chunks.length,0);if(total>50)throw Error('Divida a revisão em lotes de até 50 trechos.');
 const root=resolve('..');
 for(const doc of reviewed.documents){
  const source=resolve(root,doc.source);const rel=relative(root,source);if(rel.startsWith('..')||isAbsolute(rel))throw Error('Fonte fora do acervo local.');
  if(createHash('sha256').update(readFileSync(source)).digest('hex')!==doc.sha256)throw Error('Fonte alterada desde a revisão.');
  if(new Set(doc.chunks.map(chunk=>`${chunk.page}:${chunk.ordinal}`)).size!==doc.chunks.length)throw Error('Trechos duplicados no lote.');
 }
 console.log(`Lote validado: ${reviewed.documents.length} documentos, ${total} trechos revisados.`);
 if(!args.includes('--apply'))return;
 process.loadEnvFile('.env.local');
 if(process.env.SUPABASE_URL!=='https://jfvfckkulpcqvhkjwgvy.supabase.co')throw Error('Projeto inesperado.');
 const db=createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const fixture=randomUUID();let userId:string|undefined;
 const cacheFile=file+'.embeddings.json';const cache:Record<string,number[]>=existsSync(cacheFile)?JSON.parse(readFileSync(cacheFile,'utf8')):{};
 try{
  const user=await db.auth.admin.createUser({email:`index-${fixture}@alunos.pem.invalid`,password:randomBytes(32).toString('hex'),email_confirm:true,app_metadata:{pem_index_fixture:fixture}});
  if(user.error||!user.data.user)throw Error('Não foi possível preparar a sessão de indexação.');userId=user.data.user.id;
  const profile=await db.from('profiles').insert({id:userId});if(profile.error)throw Error('Perfil de indexação indisponível.');
  for(const doc of reviewed.documents){
   const record=await db.from('documents').upsert({title:doc.title,sha256:doc.sha256,subject:doc.subject,version:reviewed.version,reviewed:false,authorized:false,scope:'private'},{onConflict:'sha256'}).select('id').single();
   if(record.error)throw Error('Não foi possível preparar documento.');const documentId=record.data.id;
   for(const chunk of doc.chunks){
    const key=createHash('sha256').update('@cf/baai/bge-m3:'+chunk.body).digest('hex');let vector=cache[key];
    if(!Array.isArray(vector)||vector.length!==1024||!vector.every(Number.isFinite)){
     const generation=randomUUID();const reservation=await db.rpc('reserve_generation',{p_id:generation,p_user:userId,p_kind:'embedding',p_hash:key,p_neurons:20});
     if(reservation.error||reservation.data!=='reserved')throw Error('Cota de indexação indisponível; retome depois.');
     try{vector=await embed(chunk.body);cache[key]=vector;writeFileSync(cacheFile,JSON.stringify(cache));await db.from('generations').update({status:'complete'}).eq('id',generation);}
     catch{await db.from('generations').update({status:'failed'}).eq('id',generation);throw Error('Embedding indisponível; checkpoint preservado.');}
    }
    const saved=await db.from('chunks').upsert({document_id:documentId,...chunk,embedding:vector},{onConflict:'document_id,page,ordinal'});
    if(saved.error)throw Error('Não foi possível guardar trecho.');
   }
   // Never expose rows left over from a previous, broader revision.
   const stored=await db.from('chunks').select('id,page,ordinal').eq('document_id',documentId);if(stored.error)throw Error('Não foi possível conferir o documento.');
   const allowed=new Set(doc.chunks.map(chunk=>`${chunk.page}:${chunk.ordinal}`));
   const stale=stored.data.filter(chunk=>!allowed.has(`${chunk.page}:${chunk.ordinal}`));
   if(stale.length)throw Error('Há trechos de outra revisão; documento mantido privado até reconciliação.');
   const published=await db.from('documents').update({reviewed:true,authorized:true,scope:'class'}).eq('id',documentId);if(published.error)throw Error('Não foi possível liberar o lote revisado.');
  }
  console.log('Lote indexado com embeddings reais. Originais privados; acesso aos trechos exige conta ativa.');
 }finally{if(userId){const check=await db.auth.admin.getUserById(userId);if(check.data.user?.app_metadata?.pem_index_fixture!==fixture)throw Error('Não foi possível confirmar a fixture de indexação.');const cleanup=await db.auth.admin.deleteUser(userId);if(cleanup.error)throw Error('Limpeza da fixture pendente.');}}
}
main().catch(()=>{console.error('Indexação interrompida. Confira formato, credenciais e cota. Conteúdo e segredos não são registrados nos logs.');process.exitCode=1;});
