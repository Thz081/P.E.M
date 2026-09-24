import type {Source} from './ai-validation';

const ignored=new Set(['ainda','algum','alguma','como','dessa','desse','deste','depois','exatamente','explique','fontes','ignore','material','onde','para','pergunta','porque','qual','quais','quero','responda','resposta','sobre','todos','todas','voce','vocês']);
function tokens(value:string){return new Set((value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[a-z0-9]+/g)||[]).filter(word=>word.length>=5&&!ignored.has(word)));}
export function relevantSources(question:string,sources:Source[]){
 const terms=tokens(question);
 return sources.filter(source=>{
  const evidence=tokens(`${source.title} ${source.body}`);
  return [...terms].some(term=>evidence.has(term));
 });
}
