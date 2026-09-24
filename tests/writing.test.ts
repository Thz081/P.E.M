import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseDrafts} from '../src/lib/writing';

test('writing recovers valid versions without accepting malformed or duplicate records',()=>{
 const valid={id:'draft',theme:'Leitura',text:'Texto sintético.',date:'2026-09-22T12:00:00Z'};
 assert.deepEqual(parseDrafts([null,{},valid,{...valid},{...valid,id:'bad',text:8},{...valid,id:'date',date:'invalid'}]),[valid]);
 assert.deepEqual(parseDrafts({versions:[valid]}),[]);
 assert.equal(parseDrafts(Array.from({length:40},(_,i)=>({...valid,id:String(i)}))).length,30);
});
