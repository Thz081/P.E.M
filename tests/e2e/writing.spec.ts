import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

for(const width of [1280,390]) test(`writing versions survive reload, compare, export and delete (${width}px)`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:844});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/demonstracao/redacao');
 await expect(page.locator('.writing-lessons details')).toHaveCount(8);
 await page.getByRole('button',{name:'Escrever e revisar',exact:true}).click();
 await page.getByRole('button',{name:'Salvar versão',exact:true}).click();
 await expect(page.getByText('Preencha o tema e escreva seu texto.')).toBeVisible();
 await page.getByLabel('Tema da redação').fill('P06: leitura');
 await page.getByLabel('Seu texto',{exact:true}).fill('Primeira versão sintética.');
 await page.getByRole('button',{name:'Salvar versão',exact:true}).click();
 await expect(page.getByText('Versão salva neste navegador.',{exact:true})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Minhas versões',exact:true}).click();
 await page.getByRole('button',{name:'Abrir',exact:true}).click();
 await expect(page.getByLabel('Seu texto',{exact:true})).toHaveValue('Primeira versão sintética.');
 await page.getByLabel('Seu texto',{exact:true}).fill('Segunda versão revisada.');
 await page.getByRole('button',{name:'Minhas versões',exact:true}).click();
 await page.getByRole('button',{name:'Comparar',exact:true}).click();
 await expect(page.locator('.comparison article').first()).toContainText('Primeira versão sintética.');
 await expect(page.locator('.comparison article').last()).toContainText('Segunda versão revisada.');
 await page.getByRole('button',{name:'Escrever e revisar',exact:true}).click();
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'Exportar texto',exact:true}).click();
 const download=await pending;expect(download.suggestedFilename()).toBe('minhas-redacoes-pem.json');
 const file=testInfo.outputPath('writing.json');await download.saveAs(file);
 const data=JSON.parse(await readFile(file,'utf8'));
 expect(data.text).toBe('Segunda versão revisada.');expect(data.versions[0].text).toBe('Primeira versão sintética.');
 await expect(page.getByRole('button',{name:'Pedir feedback ao tutor'})).toBeDisabled();
 await page.getByRole('button',{name:'Minhas versões',exact:true}).click();
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Excluir',exact:true}).click();
 await expect(page.getByRole('button',{name:'Abrir',exact:true})).toBeVisible();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Excluir',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Seu primeiro rascunho começa aqui.'})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Minhas versões',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Seu primeiro rascunho começa aqui.'})).toBeVisible();
 expect(errors).toEqual([]);
});

test('writing handles malformed local versions and failed deletion without losing the saved version',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/demonstracao');
 await page.evaluate(()=>localStorage.setItem('pem-v2-writing-demo',JSON.stringify([null,{},
  {id:'synthetic',theme:'Versão preservada',text:'Texto sintético.',date:'2026-09-22T12:00:00Z'}])));
 await page.goto('/demonstracao/redacao');
 await page.getByRole('button',{name:'Minhas versões',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Versão preservada'})).toBeVisible();
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Blocked','QuotaExceededError');};});
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Excluir',exact:true}).click();
 await expect(page.getByText('Não foi possível excluir. A versão foi mantida; tente novamente.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Abrir',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});

test('public login and professor guide use the demo without private data',async({page})=>{
 await page.goto('/');await page.getByLabel('Matrícula',{exact:true}).fill('visitante');
 await page.getByLabel('Senha',{exact:true}).fill('monarcas');
 await page.getByRole('button',{name:'Entrar para estudar'}).click();
 await expect(page).toHaveURL(/\/demonstracao$/);
 await page.getByRole('link',{name:'Visão do professor'}).click();
 await expect(page.getByRole('heading',{name:'Professor, sinta-se parte da turma.'})).toBeVisible();
 await expect(page.getByText('Esta é uma visita guiada.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Sair da demonstração'}).click();
 await expect(page).toHaveURL(/\/$/);
 await page.goto('/estudar');await expect(page).toHaveURL(/\/$/);
});
