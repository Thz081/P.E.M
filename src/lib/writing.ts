export type Draft = {id:string; theme:string; text:string; date:string; shared?:boolean};

export function parseDrafts(value:unknown):Draft[] {
 if(!Array.isArray(value)) return [];
 const ids=new Set<string>();
 return value.filter((item):item is Draft=>{
  if(!item || typeof item!=='object') return false;
  const valid=typeof item.id==='string' && item.id.length>0 && item.id.length<=100 &&
   typeof item.theme==='string' && item.theme.trim().length>0 && item.theme.length<=250 &&
   typeof item.text==='string' && item.text.trim().length>0 && item.text.length<=15000 &&
   typeof item.date==='string' && Number.isFinite(Date.parse(item.date)) && !ids.has(item.id);
  if(valid) ids.add(item.id);
  return valid;
 }).slice(0,30);
}
