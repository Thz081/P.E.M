import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateEssay,validateTutor} from '../src/lib/ai-validation';
test('tutor rejects invented citations and gives an explicit insufficient-source response',()=>{
 const sources=[{id:'source',title:'Material revisado',page:2,body:'Texto de referência.'}];
 assert.throws(()=>validateTutor({answerable:true,text:'Fato [2]',citations:[2]},sources));
 assert.equal(validateTutor({answerable:true,text:'Fato com fonte separada',citations:[1]},sources).text,'Fato com fonte separada\n\n[1]');
 assert.equal(validateTutor({answerable:true,text:'Fato sem referência',citations:[]},sources).sources.length,0);
 assert.equal(validateTutor({answerable:true,text:'Fato [1]',citations:[1]},sources).sources[0].page,2);
 assert.equal(validateTutor({answerable:false,text:'Não sei.',citations:[]},sources).sources.length,0);
 assert.equal(validateTutor({answerable:false,text:null},sources).sources.length,0);
});
test('essay feedback requires three exact text excerpts and never accepts a score',()=>{
 const text='Uma frase sintética para revisão.';
 const value={summary:'Revise a argumentação.',priorities:[1,3,5].map(competency=>({competency,evidence:'Uma frase sintética',suggestion:'Explique o argumento.'}))};
 assert.match(validateEssay(value,text).feedback,/nenhuma nota/);
 assert.throws(()=>validateEssay({...value,score:900},text));
 assert.throws(()=>validateEssay({...value,summary:'Nota: 900 pontos'},text));
 assert.throws(()=>validateEssay({...value,priorities:value.priorities.slice(0,2)},text));
 assert.throws(()=>validateEssay(value,'Outro texto.'));
});
