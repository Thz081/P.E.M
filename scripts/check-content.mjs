import fs from 'node:fs';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('content/catalog.json','utf8')),base=JSON.parse(fs.readFileSync('content/baseline.json','utf8'));
for(const key of ['lessons','quiz','cards','materials'])assert.ok(data[key].length>=base[key],`${key}: conteúdo perdido`);
assert.equal(data.enemLearning.units.length,base.enemUnits);assert.ok(data.enemLearning.videos.length>=base.videos);assert.ok(data.enemLearning.questions.length>=base.enemQuestions);
for(const url of base.materialLinks)assert.ok(data.materials.some(m=>m.url===url),`Link perdido: ${url}`);
for(const q of data.lessons){assert.ok(q.options[q.answer]);assert.equal(q.text.length>=2,true);}
for(const q of data.enemLearning.questions){assert.equal(q.options.length,5);assert.ok(q.options[q.answer]);assert.ok(q.feedback&&q.exam&&q.page);}
const forbidden=[/CASA MONARCAS/i,/oráculo gil/i,/ete gamificada/i,/C:\\Users\\/i];
for(const dir of ['src','content','public'])for(const file of fs.readdirSync(dir,{recursive:true})){const full=`${dir}/${file}`;if(!fs.statSync(full).isFile()||! /\.(json|tsx?|css|md)$/.test(full))continue;const text=fs.readFileSync(full,'utf8');for(const pattern of forbidden)assert.ok(!pattern.test(text),`Referência proibida em ${full}`);}
console.log('PASS: baseline integral, 25 links, alternativas, origem ENEM e identidade MONARCAS.');
