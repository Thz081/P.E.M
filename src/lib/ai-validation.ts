import {z} from 'zod';
export type Source={id:string;title:string;page:number;body:string;source_url?:string|null};
export const tutorResult=z.object({answerable:z.boolean(),text:z.string().min(1).max(4000),citations:z.array(z.number().int().positive()).max(5)}).strict();
export function validateTutor(value:unknown,sources:Source[]){
 // A model refusal needs no free-form text; always render our verified fallback.
 if(value&&typeof value==='object'&&'answerable' in value&&value.answerable===false)return {text:'Não encontrei base suficiente nos materiais revisados para responder com segurança. Tente detalhar o assunto ou consulte a monitoria.',sources:[]};
 const result=tutorResult.parse(value);
 if(!result.answerable)return {text:'Não encontrei base suficiente nos materiais revisados para responder com segurança. Tente detalhar o assunto ou consulte a monitoria.',sources:[]};
 const citations=[...new Set(result.citations)];
 if(!citations.length)return {text:'Não encontrei base suficiente nos materiais revisados para responder com segurança. Tente detalhar o assunto ou consulte a monitoria.',sources:[]};
 const inline=[...result.text.matchAll(/\[(\d+)\]/g)].map(match=>Number(match[1]));
 if(citations.some(index=>!sources[index-1])||inline.some(index=>!citations.includes(index))){const error=Error('Referências não verificadas.');error.name=citations.some(index=>!sources[index-1])?'InvalidCitationIndex':'CitationMismatch';throw error;}
 // Some providers return the cited source numbers separately without inline markers.
 // Show those verified numbers next to the answer instead of discarding a grounded response.
 const text=inline.length?result.text:`${result.text}\n\n${citations.map(index=>`[${index}]`).join(' ')}`;
 return {text,sources:citations.map(index=>({number:index,id:sources[index-1].id,title:sources[index-1].title,page:sources[index-1].page}))};
}
export const essayResult=z.object({summary:z.string().min(1).max(700),priorities:z.array(z.object({competency:z.number().int().min(1).max(5),evidence:z.string().min(1).max(350),suggestion:z.string().min(1).max(700)}).strict()).length(3)}).strict();
export function validateEssay(value:unknown,text:string){
 const result=essayResult.parse(value);
 if(result.priorities.some(priority=>!text.includes(priority.evidence)))throw Error('O feedback contém um trecho que não está no texto.');
 if(/(?:nota|pontua[cç][aã]o|score)\s*(?:final|total|estimada|de|:|é|seria|=)*\s*\d|\d\s*pontos/i.test(JSON.stringify(result)))throw Error('Pontuação não habilitada.');
 return {feedback:`${result.summary}\n\n${result.priorities.map((priority,index)=>`${index+1}. **Competência ${priority.competency}**\n\n> ${priority.evidence}\n\n${priority.suggestion}`).join('\n\n')}\n\nFeedback formativo; nenhuma nota foi atribuída. Referência: Cartilha do Participante Inep 2026.`};
}
