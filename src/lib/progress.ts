export type Progress = {read:Record<string,boolean>;notes:Record<string,string>;answers:Record<string,number>;lastLesson?:string;materials:Record<string,boolean>};
export const emptyProgress:Progress={read:{},notes:{},answers:{},materials:{}};
export function daysUntil(date:string,now=new Date()){
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 return Math.max(0,Math.round((Date.parse(date+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000));
}
export function parseProgress(value:unknown):Progress{
 if(!value||typeof value!=='object')return structuredClone(emptyProgress);
 const x=value as Partial<Progress>;
 const record=<T>(v:unknown,type:string):Record<string,T>=>!v||typeof v!=='object'?{}:Object.fromEntries(Object.entries(v).filter(([k,val])=>k.length<150&&typeof val===type));
 return {read:record<boolean>(x.read,'boolean'),notes:record<string>(x.notes,'string'),answers:record<number>(x.answers,'number'),materials:record<boolean>(x.materials,'boolean'),lastLesson:typeof x.lastLesson==='string'?x.lastLesson:undefined};
}
