/** Inventory course screenshots and PDF titles without copying private PDFs into Git. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const privateRoot = resolve(root, '..', 'analise', 'acervo');
const imageRoot = resolve(privateRoot, 'organizacao');
const manifest = resolve(privateRoot, 'manifest.json');
const output = resolve(privateRoot, 'curriculum-map.json');
const assadRoot = resolve(root, '..', 'conteudos assad');
const prefix = 'CONTEUDOS FERRETO PARA ALIMENTAR IA/';
const normal = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const courseImages = [
 ['Português','portugues organizacao','0046',['Figuras de Linguagem']],
 ['Português','portugues organizacao','0047',['Termos da Sintaxe 2','Orações Coordenadas','Orações Subordinadas Substantivas','Orações Subordinadas Adjetivas','Orações Subordinadas Adverbiais','Orações Reduzidas','Funções do Que e do Se','Regência Verbal e Nominal']],
 ['Português','portugues organizacao','0048',['Pronome','Numeral, Artigo e Interjeição','Preposição','Conjunção','Verbo','Sujeito','Predicado','Termos da Sintaxe 1']],
 ['Português','portugues organizacao','0049',['Fonética e Fonologia','Acentuação','Ortografia','Morfologia','Classes Gramaticais','Substantivo','Adjetivo','Advérbio']],
 ['Português','portugues organizacao','0050',['Crase','Concordância Verbal','Concordância Nominal','Pontuação','Denotação e Conotação','Semântica','Funções da Linguagem','Variação Linguística']],
 ['Sociologia','sociologia organizacao','0051',['Teoria da Sociologia','Sociologia do Brasil','Sociologia Temática','Trabalho e Produção','Poder, Estado e Cidadania','Temas Contemporâneos','Outras Ciências Sociais']],
 ['Filosofia','filosofia organizacao','0052',['Filosofia Antiga','Filosofia Medieval','Filosofia Moderna','Filosofia Contemporânea']],
 ['Geografia','geografia organizacao','0053',['América','Europa','Rússia e CEI','África','Japão, Índia e Tigres Asiáticos','China','Oriente Médio','Oceania e Regiões Polares','Análise de Gráficos e Mapas','Habilidades ENEM']],
 ['Geografia','geografia organizacao','0054',['Geografia Agrária','Fontes de Energia','Indústria','Transportes','Fases do Capitalismo','Geopolítica','Globalização','Regionalização do Brasil']],
 ['Geografia','geografia organizacao','0055',['Astronomia e Cartografia','Atmosfera','Geologia','Hidrosfera','Biosfera','Meio Ambiente','Demografia','Urbanização']],
 ['História','historia e historiadobrasil organizacao','0056',['Brasil Pré-Colonial','Brasil Colonial','Brasil Império','Brasil República']],
 ['História','historia e historiadobrasil organizacao','0057',['Antiguidade Oriental','Antiguidade Clássica','Idade Média','Idade Moderna','Idade Contemporânea']],
 ['Biologia','biologia organizacao','0058',['Introdução à Biologia','Bioquímica','Biologia Molecular e Engenharia Genética','Citologia','Bioenergética','Núcleo e Divisão Celular','Reprodução Humana','Embriologia Animal']],
 ['Biologia','biologia organizacao','0059',['Histologia Animal','Fisiologia Animal','Genética','Origem da Vida','Evolução','Taxionomia','Microbiologia','Botânica','Zoologia','Ecologia']],
 ['Química','quimica organizacao','0060',['Funções Nitrogenadas','Outras Funções','Propriedades Físicas e Químicas de Compostos Orgânicos','Isomeria','Gases','Radioatividade','Química Ambiental','Água','Reações Orgânicas']],
 ['Química','quimica organizacao','0061',['Termoquímica','Cinética','Equilíbrio Químico','Eletroquímica','Propriedades Coligativas','Introdução à Química Orgânica','Hidrocarbonetos','Funções Oxigenadas','Funções Nitrogenadas','Outras Funções','Propriedades Físicas e Químicas de Compostos Orgânicos','Isomeria']],
 ['Química','quimica organizacao','0062',['Química Básica','Átomo','Tabela Periódica','Ligações Químicas','Nox, Oxidação e Redução','Funções Inorgânicas','Estequiometria','Soluções']],
 ['Física','fisica organizacao','0063',['Estática','Hidrostática','Hidrodinâmica','Termologia','Ondulatória','Movimento Harmônico Simples','Óptica','Eletrostática','Eletrodinâmica','Eletromagnetismo','Física Moderna','Análise Dimensional','Gráficos']],
 ['Física','fisica organizacao','0064',['Física Básica','Cinemática','Dinâmica','Gravitação','Estática','Hidrostática','Hidrodinâmica','Termologia']],
 ['Matemática','matematica organização','0065',['Probabilidade','Introdução às Funções','Função Afim','Função Quadrática','Exponencial','Logaritmos','Trigonometria','Matemática Comercial e Financeira','Binômio de Newton','Matrizes','Determinantes','Sistemas Lineares']],
 ['Matemática','matematica organização','0066',['Binômio de Newton','Matrizes','Determinantes','Sistemas Lineares','Geometria Analítica','Cônicas','Módulo','Números Complexos','Polinômios','Equações Algébricas']],
 ['Matemática','matematica organização','0067',['Matemática Básica','Conjuntos','Progressões','Geometria Plana','Geometria de Posição','Geometria Espacial','Estatística','Análise Combinatória']],
];
// The captures overlap. Order below follows the visible course list, not file numbers.
const courseTracks = {
 'Português':[['0049','0048','0047','0050','0046']],
 'Sociologia':[['0051']], 'Filosofia':[['0052']],
 'Geografia':[['0055','0054','0053']],
 'História':[['0057'],['0056']],
 'Biologia':[['0058','0059']], 'Química':[['0062','0061','0060']],
 'Física':[['0064','0063']], 'Matemática':[['0067','0065','0066']],
};
// Assad's chart is a separate, non-official frequency estimate through ENEM 2025.
// Only direct topic matches are attached; broad categories remain separate.
const assadCharts = [
 ['Matemática','Matemática Financeira',2.5,'1-50'],['Matemática','Análise Combinatória',3.2,'1-50'],
 ['Matemática','Probabilidade',5.6,'1-50'],['Matemática','Estatística',13.1,'1-50'],
 ['Biologia','Botânica',5.3,'1-50'],['Biologia','Citologia',7.0,'1-50'],
 ['Biologia','Ecologia',35.2,'1-50'],['Biologia','Bioquímica',9.6,'1-50'],
 ['Biologia','Genética',11.3,'1-50'],
 ['Física','Estática',2.0,'1-50'],['Física','Hidrostática',3.8,'1-50'],
 ['Física','Eletrodinâmica',18.6,'1-50'],['Física','Ondulatória',17.3,'1-50'],
 ['Física','Dinâmica',9.2,'1-50'],['Física','Cinemática',9.7,'1-50'],
 ['Física','Termologia',15.3,'1-50'],
 ['Química','Cinética',1.6,'51-100'],['Química','Ligações Químicas',3.0,'51-100'],
 ['Química','Soluções',4.1,'51-100'],['Química','Química Ambiental',4.1,'51-100'],
 ['Química','Radioatividade',5.3,'51-100'],['Química','Equilíbrio Químico',5.5,'51-100'],
 ['Química','Termoquímica',5.9,'51-100'],['Química','Eletroquímica',7.8,'51-100'],
 ['Química','Estequiometria',13.9,'51-100'],
 ['História','Brasil República',27.8,'101-151'],['História','Brasil Colonial',16.3,'101-151'],
 ['História','Brasil Império',14.4,'101-151'],['História','Idade Contemporânea',10.5,'101-151'],
 ['Geografia','Geopolítica',11.9,'101-151'],['Geografia','Geografia Agrária',16.7,'101-151'],
];
const assadProgressSource = 'conteudos assad/MAPA DE PROGRESSO COMPETITIVO - COM LINKS.pdf';
const assadProgressTopics = [
 ['Português','Literatura',18],['Português','Progressão temática e organização textual',18],
 ['Português','Gêneros Textuais',18],['História','Idade Antiga',19],
 ['Redação','Estrutura do Enem',76],['Redação','Planejamento Textual',76],
 ['Redação','Coesão e Clareza',78],['Redação','Gramática e Vocabulário',78],
 ['Redação','Engenharia Argumentativa',78],['Redação','Intervenção',81],
 ['Redação','Autonomia e Autocorreção',81],
 ];
const progressAliases = new Map([
 ['História|Idade Antiga','Idade Antiga','exact'],
 ['Português|Gênero Textual','Gêneros Textuais','same_topic'],
 ['Português|Literatura-Realismo','Literatura','broader_topic'],
].map(([key,title,matchType])=>{const [subject,topic]=key.split('|');return [`${subject}|${normal(topic)}`,{title,matchType}];}));
function proposedRedacaoGroup(topic){
 const title=normal(topic);
 if(/^100 redacoes/.test(title))return null; // examples, not a lesson in the Assad sequence
 if(/conclusao|agentes da conclusao/.test(title))return 'Intervenção';
 if(/coesao|operadores argumentativos/.test(title))return 'Coesão e Clareza';
 if(/gramaticais|virgula|crase/.test(title))return 'Gramática e Vocabulário';
 if(/planejamento|teses/.test(title))return 'Planejamento Textual';
 if(/argumentacao|desenvolvimento|autoria/.test(title))return 'Engenharia Argumentativa';
 if(/introducao|redacao do enem|temas|banca|grade especifica|estudando a redacao/.test(title))
  return 'Estrutura do Enem';
 return null;
}
const area = {
 'Português':'Linguagens, Códigos e suas Tecnologias', 'Filosofia':'Ciências Humanas e suas Tecnologias',
 'Sociologia':'Ciências Humanas e suas Tecnologias', 'Geografia':'Ciências Humanas e suas Tecnologias',
 'História':'Ciências Humanas e suas Tecnologias', 'Biologia':'Ciências da Natureza e suas Tecnologias',
 'Química':'Ciências da Natureza e suas Tecnologias', 'Física':'Ciências da Natureza e suas Tecnologias',
 'Matemática':'Matemática e suas Tecnologias', 'Redação':'Redação',
};
const renameSubject = {Fisica:'Física',Quimica:'Química',Historia:'História'};
const prerequisites = {
 'Matemática|Função Afim':['Introdução às Funções'], 'Matemática|Função Quadrática':['Introdução às Funções'],
 'Matemática|Exponencial':['Introdução às Funções'], 'Matemática|Logaritmos':['Exponencial'],
 'Matemática|Determinantes':['Matrizes'], 'Matemática|Sistemas Lineares':['Matrizes'],
 'Física|Dinâmica':['Cinemática'], 'Química|Tabela Periódica':['Átomo'],
 'Química|Ligações Químicas':['Tabela Periódica'], 'Química|Eletroquímica':['Nox, Oxidação e Redução'],
 'Química|Hidrocarbonetos':['Introdução à Química Orgânica'],
 'Biologia|Biologia Molecular e Engenharia Genética':['Citologia','Bioquímica'],
 'Biologia|Genética':['Núcleo e Divisão Celular'],
 'Português|Orações Coordenadas':['Sujeito','Predicado'],
 'Português|Orações Subordinadas Substantivas':['Orações Coordenadas'],
};
const aliases = new Map([
 ['Português|Sintaxe do Período Simples Sujeito','Sujeito'],
 ['Português|Funções das plavras QUE e SE','Funções do Que e do Se'],
 ['Português|Período Composto Orações Coordenadas','Orações Coordenadas'],
 ['Português|Período Composto Subordinadas Adjetivas','Orações Subordinadas Adjetivas'],
 ['Português|Período Composto Subordinadas Adverbiais','Orações Subordinadas Adverbiais'],
 ['Português|Período Composto Subordinadas Substantivas','Orações Subordinadas Substantivas'],
 ['História|Brasil Colônia','Brasil Colonial'],
 ['História|Idade Antiga',null],
 ['Geografia|Hidrografia','Hidrosfera'],
 ['Geografia|Habilidades ENEM','Habilidades ENEM'],
 ['Matemática|Conjuntos grafico','Conjuntos'],
 ['Matemática|Matemática grafico','Matemática Básica'],
 ['Química|Funções Nitrogenadas','Funções Nitrogenadas'],
 ['Química|Prop. Físicas e Químicas dos Compostos Orgânicos','Propriedades Físicas e Químicas de Compostos Orgânicos'],
].map(([key,value])=>{const [subject,topic]=key.split('|');return [`${subject}|${normal(topic)}`,value];}));

function pdfTitle(path,subject){
 let name=basename(path,'.pdf').replace(/^[a-f0-9]{8}-[a-f0-9-]{27,}-/i,'');
 name=name.replace(/^[^-]+-/,match=>/^(Biologia|Filosofia|Geografia|Matemática|Física|Química)-$/i.test(match)?'':match);
 name=name.replace(/^(?:Física_\(Prof\._Coelho\)|Gramática_\(prof\._Noslen\)|Interpretação_de_Texto_\(prof\._Noslen\)|História_do_Brasil_\(prof\._Dalton\)|História_Geral_\(prof\._Marcondes\))-/, '');
 name=name.replace(/-Roteiro_da_aula$/i,'').replace(/_/g,' ').replace(/\s+/g,' ').trim();
 if(subject==='Geografia'&&/Habilidades ENEM|enem-habilidades/i.test(name))return 'Habilidades ENEM';
 return name;
}

const raw=readFileSync(manifest);const entries=JSON.parse(raw.toString('utf8')).items;
const screenshots=courseImages.map(([subject,folder,suffix,topics])=>{
 const path=resolve(imageRoot,folder,`IMG-20260922-WA${suffix}.jpg`);
 if(!existsSync(path))throw Error(`Missing course screenshot ${suffix}`);
 return {subject,image:`${folder}/IMG-20260922-WA${suffix}.jpg`,topics};
});
const indexed=new Map();
for(const [subject,tracks] of Object.entries(courseTracks))for(const [trackIndex,images] of tracks.entries()){
 let position=0;
 for(const suffix of images){
  const shot=screenshots.find(s=>s.subject===subject&&s.image.endsWith(`WA${suffix}.jpg`));
  if(!shot)throw Error(`Missing ordered screenshot ${subject} ${suffix}`);
  for(const title of shot.topics){
   const key=`${subject}|${normal(title)}`;
   const record=indexed.get(key)||{subject,title,images:[],studyOrder:{track:trackIndex+1,position:++position,source:'visible_course_screenshots'}};
   if(!indexed.has(key))indexed.set(key,record);
   if(!record.images.includes(shot.image))record.images.push(shot.image);
  }
 }
}
const chartByTopic=new Map(assadCharts.map(([subject,title,percent,part])=>[
 `${subject}|${normal(title)}`,{percent,source:`MAPA DE INCIDENCIAS_compressed-${part}.docx`,period:'até ENEM 2025',kind:'estimativa_Assad'}
]));
const extractionIndex=JSON.parse(readFileSync(resolve(privateRoot,'extracted','index.json'),'utf8'));
const progressRecord=extractionIndex.documents[assadProgressSource];
if(!progressRecord||progressRecord.status!=='extracted')throw Error('Assad progress map extraction missing');
const progressDocument=JSON.parse(readFileSync(resolve(privateRoot,'extracted',progressRecord.file),'utf8'));
if(progressDocument.sha256!==progressRecord.sha256||progressDocument.source!==assadProgressSource)
 throw Error('Assad progress map identity mismatch');
for(const [subject,title,page] of assadProgressTopics){
 if(!area[subject]||!normal(progressDocument.pages.find(item=>item.page===page)?.text||'').includes(normal(title)))
  throw Error(`Assad progress topic not found on page ${page}: ${title}`);
}
const progressByTopic=new Map(assadProgressTopics.map(([subject,title,page])=>[
 `${subject}|${normal(title)}`,{title,source:assadProgressSource,page}
]));
if(new Set(assadCharts.map(([subject,title])=>`${subject}|${normal(title)}`)).size!==assadCharts.length)
 throw Error('Duplicate Assad topic');
for(const [, , percent, part] of assadCharts){
 if(!(percent>=0&&percent<=100)||!existsSync(resolve(assadRoot,`MAPA DE INCIDENCIAS_compressed-${part}.docx`)))
  throw Error(`Invalid Assad incidence source ${part}`);
}
const groups=[...indexed.values()].map(group=>({
 ...group,prerequisites:prerequisites[`${group.subject}|${group.title}`]||null,
 prerequisiteStatus:prerequisites[`${group.subject}|${group.title}`]?'proposta_pendente_professor':'nao_mapeado',
 enemArea:area[group.subject],enemIncidence:chartByTopic.get(`${group.subject}|${normal(group.title)}`)||null,
}));
for(const group of groups)for(const before of group.prerequisites||[]){
 if(!indexed.has(`${group.subject}|${normal(before)}`))throw Error(`Missing proposed prerequisite for ${group.subject}: ${before}`);
}
const documents=entries.filter(item=>item.extension==='.pdf'&&item.path.startsWith(prefix)).map(item=>{
 const subject=renameSubject[item.subject]||item.subject;
 const topic=pdfTitle(item.path,subject);
 const family=subject==='Biologia'?topic.match(/^(Botânica|Ecologia|Fisiologia Animal|Histologia Animal|Zoologia) -/i)?.[1]:null;
 const key=`${subject}|${normal(topic)}`;
 const alias=aliases.has(key)?aliases.get(key):family||
  (subject==='Português'&&normal(topic).includes('crase')?'Crase':undefined)||
  (subject==='Química'&&normal(topic).includes('funcoes nitrogenadas')?'Funções Nitrogenadas':undefined);
 const matches=alias===null?[]:groups.filter(group=>group.subject===subject&&normal(group.title)===normal(alias||topic));
 const progressAlias=progressAliases.get(key)||
  (subject==='Redação'&&proposedRedacaoGroup(topic)?{title:proposedRedacaoGroup(topic),matchType:'proposed_from_pdf_title'}:null);
 const progressGroup=progressAlias?progressByTopic.get(`${subject}|${normal(progressAlias.title)}`):null;
 return {source:item.path,subject,topic,courseGroup:matches.length===1?matches[0].title:null,
  matchStatus:matches.length===1?'screenshot_title_or_explicit_alias':'requires_review',
  assadProgress:progressGroup?{...progressGroup,matchType:progressAlias.matchType}:null,
  enemArea:area[subject],enemIncidence:matches.length===1?matches[0].enemIncidence:null,publication:'private-unreviewed'};
});
if(screenshots.length!==22||documents.length!==183)throw Error(`Unexpected corpus: ${screenshots.length} screenshots, ${documents.length} PDFs`);
if(groups.length!==165||groups.some(group=>!group.studyOrder||group.images.length===0))throw Error('Incomplete course order');
if(documents.some(doc=>!doc.enemArea)||new Set(documents.map(doc=>doc.source)).size!==documents.length)throw Error('Area or source path missing');
if(!relative(root,output).startsWith('..')||isAbsolute(relative(root,output)))throw Error('Private map must stay outside the repository');
const result={version:2,manifestSha256:createHash('sha256').update(raw).digest('hex'),
 source:'22 private course screenshots, 183 private PDF filenames, Assad incidence chart and progress map',
 limitations:'Study order is only the visible course sequence; supplemental Assad topics have a separate order. Incidence is an attributed estimate, not Inep data. Prerequisites are proposals.',
 summary:{screenshots:screenshots.length,courseGroups:groups.length,documents:documents.length,
  matchedDocuments:documents.filter(doc=>doc.courseGroup).length,unmatchedDocuments:documents.filter(doc=>!doc.courseGroup).length,
  groupsWithDirectIncidence:groups.filter(group=>group.enemIncidence).length,
  assadProgressTopics:assadProgressTopics.length,assadProgressDocumentLinks:documents.filter(doc=>doc.assadProgress).length},
 screenshots:screenshots.map(({image,subject})=>({image,subject})),
 progressTopics:assadProgressTopics.map(([subject,title,page])=>({subject,title,page,source:assadProgressSource})),
 incidenceReferences:assadCharts.map(([subject,title,percent,part])=>({subject,title,percent,source:`MAPA DE INCIDENCIAS_compressed-${part}.docx`,period:'até ENEM 2025',kind:'estimativa_Assad'})),
 groups,documents};
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.summary));
