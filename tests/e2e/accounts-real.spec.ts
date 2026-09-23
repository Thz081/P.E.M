import {test,expect} from '@playwright/test';
import {createClient} from '@supabase/supabase-js';
import {createHmac,randomBytes,randomInt,randomUUID} from 'node:crypto';

// Explicit opt-in: uses the dedicated PEM service, real Auth and RLS, synthetic users only.
test('real accounts: activation race, expiry, login, admin, isolation and revocation',async({browser,request,baseURL})=>{
 test.skip(process.env.PEM_REAL_AUTH_TESTS!=='1','Requires explicit PEM_REAL_AUTH_TESTS=1 and server credentials.');
 test.setTimeout(180000);
 process.loadEnvFile('.env.local');
 expect(process.env.SUPABASE_URL==='https://jfvfckkulpcqvhkjwgvy.supabase.co').toBe(true);
 const db=createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const hash=(value:string)=>createHmac('sha256',process.env.IDENTITY_HMAC_KEY!).update(value).digest('hex');
 const fixture=randomUUID();const password=randomBytes(24).toString('base64url');
 const users:{id:string;matricula:string;identifier:string;code:string}[]=[];
 let operatorId:string|undefined;
 const contexts=[];
 const headers={origin:new URL(baseURL!).origin};
 try{
  for(let index=0;index<2;index++){
   const matricula=`99${randomInt(1000000000,9999999999)}`;const identifier=hash(matricula);const code=randomBytes(12).toString('base64url');
   const result=await db.auth.admin.createUser({email:`${identifier}@alunos.pem.invalid`,password:randomBytes(32).toString('base64url'),email_confirm:true,app_metadata:{pem_test_fixture:fixture}});
   expect(!result.error&&!!result.data.user).toBe(true);
   const id=result.data.user!.id;users.push({id,matricula,identifier,code});
   const profile=await db.from('profiles').insert({id,role:'student'});expect(!profile.error).toBe(true);
   const roster=await db.from('roster').insert({identifier,matricula,user_id:id,code_hash:hash(code),code_expires_at:new Date(Date.now()+3600000).toISOString()});expect(!roster.error).toBe(true);
  }
  const [a,b]=users;
  const operatorIdentifier=hash(`admin:${a.matricula}`),operatorCode=randomBytes(18).toString('base64url');
  const operator=await db.auth.admin.createUser({email:`${operatorIdentifier}@admin.pem.invalid`,password:randomBytes(32).toString('base64url'),email_confirm:true,app_metadata:{pem_test_fixture:fixture}});
  expect(!operator.error&&!!operator.data.user).toBe(true);operatorId=operator.data.user!.id;
  expect(!(await db.from('profiles').insert({id:operatorId,role:'admin'})).error).toBe(true);
  expect(!(await db.from('admin_access').insert({identifier:operatorIdentifier,matricula:a.matricula,user_id:operatorId,code_hash:hash(operatorCode),code_expires_at:new Date(Date.now()+3600000).toISOString()})).error).toBe(true);
  const activate=(user:typeof a)=>request.post('/api/activate',{headers,data:{matricula:user.matricula,code:user.code,senha:password}});
  const concurrent=await Promise.all([activate(a),activate(a)]);
  expect(concurrent.map(response=>response.status()).sort()).toEqual([200,400]);
  expect((await activate(a)).status()).toBe(400);
  await db.from('roster').update({code_expires_at:new Date(Date.now()-1000).toISOString()}).eq('identifier',b.identifier);
  expect((await activate(b)).status()).toBe(400);
  await db.from('roster').update({code_expires_at:new Date(Date.now()+3600000).toISOString()}).eq('identifier',b.identifier);
  expect((await activate(b)).status()).toBe(200);
  expect((await request.post('/api/activate',{headers,data:{matricula:a.matricula,code:operatorCode,senha:password,area:'admin'}})).status()).toBe(200);
  const ca=await browser.newContext({baseURL});contexts.push(ca);const pa=await ca.newPage();
  const cb=await browser.newContext({baseURL});contexts.push(cb);const pb=await cb.newPage();
  const cc=await browser.newContext({baseURL});contexts.push(cc);const pc=await cc.newPage();
  for(const [page,user] of [[pa,a],[pb,b]] as const){
   await page.goto('/');await page.getByLabel('Matrícula',{exact:true}).fill(user.matricula);
   await page.getByLabel('Senha',{exact:true}).fill(password);await page.getByRole('button',{name:'Entrar para estudar'}).click();
   await expect(page).toHaveURL(/\/estudar$/);await expect(page.locator('main')).toHaveAttribute('aria-busy','false');
  }
  await expect(pa.getByRole('link',{name:'Administração',exact:true})).toHaveCount(0);
  expect((await ca.request.get('/api/admin')).status()).toBe(403);
  await pc.goto('/');await pc.getByRole('button',{name:'Administração',exact:true}).click();
  await pc.getByLabel('Matrícula',{exact:true}).fill(a.matricula);await pc.getByLabel('Senha',{exact:true}).fill(password);
  await pc.getByRole('button',{name:'Entrar na administração'}).click();await expect(pc).toHaveURL(/\/admin$/);
  await expect(pc.getByRole('heading',{name:'Acompanhar os acessos.'})).toBeVisible();
  await expect(pc.getByRole('heading',{name:`Matrícula ${b.matricula}`,exact:true})).toBeVisible();
  expect((await cc.request.get('/api/progress')).status()).toBe(401);
  expect((await cb.request.get('/api/admin')).status()).toBe(403);
  await pb.goto('/admin');await expect(pb).toHaveURL(/\/estudar$/);
  await pb.getByRole('link',{name:'Meu perfil',exact:true}).click();
  await expect(pb.getByLabel('Apelido')).toBeEnabled();
  await pb.getByLabel('Apelido').fill('Estudante sintético');await pb.getByLabel('Avatar',{exact:true}).selectOption('phoenix');
  await pb.getByRole('button',{name:'Salvar perfil'}).click();await expect(pb.getByText('Perfil salvo na sua conta.')).toBeVisible();
  await pb.reload();await expect(pb.getByLabel('Apelido')).toHaveValue('Estudante sintético');await expect(pb.getByLabel('Avatar',{exact:true})).toHaveValue('phoenix');
  expect((await cb.request.patch('/api/profile',{headers,data:{display_name:'Tentativa',avatar:'book',role:'admin'}})).status()).toBe(400);
  const progress={read:{synthetic:true},notes:{synthetic:'Nota privada A'},answers:{},materials:{}};
  const save=await ca.request.put('/api/progress',{headers,data:{progress,revision:0}});expect(save.status()).toBe(200);
  expect((await ca.request.put('/api/progress',{headers,data:{progress,revision:0}})).status()).toBe(409);
  expect((await (await ca.request.get('/api/progress')).json()).progress).toEqual(progress);
  expect((await (await cb.request.get('/api/progress')).json()).progress).toBeNull();
  await pa.goto('/estudar/redacao');await pa.getByRole('button',{name:'Escrever e revisar',exact:true}).click();
  await pa.getByLabel('Tema da redação').fill('Tema sintético');await pa.getByLabel('Seu texto',{exact:true}).fill('Texto privado para testar isolamento.');
  await pa.getByRole('button',{name:'Salvar versão',exact:true}).click();await expect(pa.getByText('Versão salva na sua conta.',{exact:true})).toBeVisible();
  await pa.reload();await pa.getByRole('button',{name:'Minhas versões',exact:true}).click();await expect(pa.getByRole('heading',{name:'Tema sintético',exact:true})).toBeVisible();
  const essayId=(await (await ca.request.get('/api/essays')).json()).essays[0].id;
  expect((await (await cb.request.get('/api/essays')).json()).essays).toHaveLength(0);
  await pa.getByRole('button',{name:'Compartilhar ou revogar'}).click();await pa.getByLabel('Matrícula do destinatário').fill(b.matricula);
  await pa.getByRole('button',{name:'Compartilhar versão',exact:true}).click();await expect(pa.getByText('Versão compartilhada com o destinatário.')).toBeVisible();
  expect((await (await cb.request.get('/api/essays')).json()).essays).toHaveLength(1);
  await pb.goto('/estudar/redacao');await pb.getByRole('button',{name:'Minhas versões',exact:true}).click();await expect(pb.getByText('Compartilhada com você')).toBeVisible();
  await expect(pb.getByRole('button',{name:'Excluir',exact:true})).toHaveCount(0);
  // A recipient cannot delete the owner's essay.
  await cb.request.delete(`/api/essays?id=${essayId}`,{headers});
  expect((await (await ca.request.get('/api/essays')).json()).essays).toHaveLength(1);
  await pa.getByRole('button',{name:'Compartilhar ou revogar'}).click();await pa.getByLabel('Matrícula do destinatário').fill(b.matricula);
  await pa.getByRole('button',{name:'Revogar acesso',exact:true}).click();await expect(pa.getByText('Compartilhamento revogado.')).toBeVisible();
  expect((await (await cb.request.get('/api/essays')).json()).essays).toHaveLength(0);
  await pb.reload();await pb.getByRole('button',{name:'Minhas versões',exact:true}).click();await expect(pb.getByRole('heading',{name:'Tema sintético',exact:true})).toHaveCount(0);
  pa.once('dialog',dialog=>dialog.accept());await pa.getByRole('button',{name:'Excluir',exact:true}).click();await expect(pa.getByText('Versão excluída da sua conta.')).toBeVisible();
  expect((await request.post('/api/recovery',{headers,data:{matricula:b.matricula}})).status()).toBe(200);
  await pc.goto('/admin');
  await pc.getByRole('button',{name:'Atualizar turma'}).click();
  const row=pc.locator('.resource-list>div').filter({has:pc.getByRole('heading',{name:`Matrícula ${b.matricula}`,exact:true})});
  await expect(row).toContainText('Recuperação solicitada');
  await row.getByRole('button',{name:'Gerar código de recuperação'}).click();
  await expect(pc.getByRole('region',{name:'Código individual gerado'})).toBeVisible();
  await pc.getByRole('button',{name:'Ocultar código'}).click();
  await expect(pc.getByRole('region',{name:'Código individual gerado'})).toHaveCount(0);
  expect((await ca.request.post('/api/chat',{headers,data:{question:'Teste'}})).status()).toBe(503);
  await db.from('profiles').update({active:false}).eq('id',b.id);
  expect((await cb.request.get('/api/progress')).status()).toBe(401);
  await pb.goto('/estudar');await expect(pb).toHaveURL(/\/$/);
  expect((await ca.request.post('/api/logout',{headers})).status()).toBe(200);
  expect((await ca.request.get('/api/progress')).status()).toBe(401);
 }finally{
  for(const context of contexts)await context.close();
  if(operatorId){const current=await db.auth.admin.getUserById(operatorId);if(current.data.user?.app_metadata?.pem_test_fixture!==fixture)throw Error('Admin fixture ownership check failed.');await db.from('admin_access').delete().eq('user_id',operatorId);expect(!(await db.auth.admin.deleteUser(operatorId)).error).toBe(true);}
  for(const user of users){
   const current=await db.auth.admin.getUserById(user.id);
   if(current.data.user?.app_metadata?.pem_test_fixture!==fixture)throw Error('Fixture ownership check failed; cleanup stopped.');
   const resets=await db.from('reset_requests').delete().eq('identifier',user.identifier);expect(!resets.error).toBe(true);
   const roster=await db.from('roster').delete().eq('user_id',user.id);expect(!roster.error).toBe(true);
   const limits=await db.from('rate_limits').delete().in('key',['activation','recovery'].map(scope=>hash(`${scope}:${user.identifier}`)));expect(!limits.error).toBe(true);
   const deleted=await db.auth.admin.deleteUser(user.id);expect(!deleted.error).toBe(true);
  }
 }
});
