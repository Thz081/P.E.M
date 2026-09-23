import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseRoster,selectClassBackup} from '../scripts/roster-input.mjs';
const roster=()=>Array.from({length:41},(_,i)=>({matricula:String(900000+i),turma:'3A DS',nome:`Aluno ${i}`}));
test('roster import accepts only the exact class and rejects partial, duplicate or numeric identifiers',()=>{
 assert.equal(parseRoster(roster()).length,41);
 assert.throws(()=>parseRoster(roster().slice(1)));
 const duplicate=roster();duplicate[1]=duplicate[0];assert.throws(()=>parseRoster(duplicate));
 const wrong=roster();wrong[0].turma='3B';assert.throws(()=>parseRoster(wrong));
 assert.throws(()=>parseRoster([{matricula:900000,turma:'3A DS'},...roster().slice(1)]));
 assert.deepEqual(selectClassBackup([...roster(),{matricula:'111111',turma:'Outra',nome:'Fora'}])[0],{matricula:'900000',turma:'3A DS',nome:'Aluno 0'});
 const missing=roster();delete (missing[0] as {nome?:string}).nome;assert.throws(()=>parseRoster(missing));
});
