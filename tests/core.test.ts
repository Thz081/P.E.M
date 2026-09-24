import {test} from 'node:test';
import assert from 'node:assert/strict';
import {daysUntil,parseProgress} from '../src/lib/progress';
import {readJson} from '../src/lib/server/http';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
test('all source files are valid UTF-8 without replacement characters',()=>{
 const decoder=new TextDecoder('utf-8',{fatal:true});
 function inspect(folder:string){for(const item of readdirSync(folder,{withFileTypes:true})){const file=join(folder,item.name);if(item.isDirectory())inspect(file);else {const text=decoder.decode(readFileSync(file));assert.ok(!text.includes('\uFFFD'),file);}}}
 inspect('src');
});
test('countdown uses Brasilia calendar at midnight boundaries and clamps past dates',()=>{assert.equal(daysUntil('2026-11-08',new Date('2026-11-08T01:00:00Z')),1);assert.equal(daysUntil('2026-11-08',new Date('2026-11-08T03:00:00Z')),0);assert.equal(daysUntil('2026-11-08',new Date('2026-11-10T03:00:00Z')),0);});
test('invalid local data does not become progress',()=>{assert.deepEqual(parseProgress(null).read,{});assert.deepEqual(parseProgress({read:{a:true,b:'false'},answers:{a:1,b:'1'}}).read,{a:true});assert.deepEqual(parseProgress({answers:{a:1,b:'1'}}).answers,{a:1});});
test('requests require exact origin and enforce streamed byte limit',async()=>{const create=(body:string,origin:string)=>new Request('https://pem.test/api/chat',{method:'POST',headers:{origin,'content-type':'application/json'},body});await assert.rejects(readJson(create('{}','https://hostile.test')));await assert.rejects(readJson(create('123456789','https://pem.test'),8));assert.deepEqual(await readJson(create('{"ok":true}','https://pem.test')),{ok:true});});
