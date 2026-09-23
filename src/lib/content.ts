import catalog from '../../content/catalog.json';
export const lessons = catalog.lessons;
export type Lesson = (typeof lessons)[number];
export type Question = { id: string; subject: string; title: string; question: string; options: string[]; answer: number; feedback: string; source: string };
export const subjects = Object.keys(catalog.context.syllabus);
export const materials = catalog.materials;
export const monitors: Record<string,string> = catalog.context.monitors;
export const cards = catalog.cards as [string,string,string][];
export const questions: Question[] = catalog.quiz.map((raw,i) => {
  const q=raw as [string,string,string[],number,string,string?,string?];
  return {id:`trimestre-${i}`,subject:q[0],title:q[6]||q[0],question:q[1],options:q[2],answer:q[3],feedback:q[4],source:'Questão autoral · revisão do trimestre'};
});
export const enem = catalog.enemLearning;
export const DRIVE = 'https://drive.google.com/drive/folders/1lrIJeIJOaIbDXy7e8u0zuWW3F34b07C6?usp=sharing';
export const ORDER = 'https://drive.google.com/drive/folders/1lrFMfESd6D_F5FruSpGQcWEp9i5Pv8oF?usp=sharing';
export const INEP = 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/orientacoes/cronograma';
export const subjectName=(s:string)=>s.charAt(0)+s.slice(1).toLocaleLowerCase('pt-BR');
