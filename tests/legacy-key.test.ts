import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifiedLegacyKey} from '../src/lib/server/legacy-key';

test('legacy key is accepted only after old login and authenticated data request',async()=>{
 const key='a'.repeat(64),calls:string[]=[];
 const fetcher:typeof fetch=async(input,init)=>{
  const url=String(input);calls.push(url);
  if(url.endsWith('/api/login')){
   assert.equal(init?.method,'POST');assert.deepEqual(JSON.parse(String(init?.body)),{matricula:'9999999',senha:'9999999'});
   assert.equal(new Headers(init?.headers).get('Origin'),'https://old.example');
   return new Response('{}',{headers:{'Set-Cookie':'pem_session=verified; HttpOnly; Path=/'}});
  }
  assert.equal(new Headers(init?.headers).get('cookie'),'pem_session=verified');
  return Response.json({userKey:key});
 };
 assert.equal(await verifiedLegacyKey('9999999','https://old.example',fetcher),key);
 assert.deepEqual(calls,['https://old.example/api/login','https://old.example/api/data']);
});

test('legacy key rejects login failure, invalid keys and invalid matrícula',async()=>{
 const denied:typeof fetch=async()=>new Response('{}',{status:401});
 assert.equal(await verifiedLegacyKey('9999999','https://old.example',denied),null);
 const invalid:typeof fetch=async(input)=>String(input).endsWith('/api/login')?new Response('{}',{headers:{'Set-Cookie':'pem_session=verified; HttpOnly'}}):Response.json({userKey:'another-user'});
 assert.equal(await verifiedLegacyKey('9999999','https://old.example',invalid),null);
 assert.equal(await verifiedLegacyKey('not-a-matricula','https://old.example',invalid),null);
});
