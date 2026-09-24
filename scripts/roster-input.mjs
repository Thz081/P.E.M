export function parseRoster(value){
 if(!Array.isArray(value)||value.length!==41)throw Error('O arquivo deve conter exatamente 41 registros da turma 3A DS.');
 const ids=new Set();
 return value.map(row=>{
  if(!row||row.turma!=='3A DS'||typeof row.matricula!=='string'||!/^\d{5,12}$/.test(row.matricula)||ids.has(row.matricula)||typeof row.nome!=='string'||!row.nome.trim()||row.nome.trim().length>120)throw Error('Turma, matrícula, nome ou duplicidade inválida. Nenhum registro foi importado.');
  ids.add(row.matricula);return {matricula:row.matricula,turma:'3A DS',nome:row.nome.trim()};
 });
}
export function selectClassBackup(value){
 if(!Array.isArray(value))throw Error('Backup inválido.');
 return parseRoster(value.filter(row=>row?.turma==='3A DS'));
}
