import {test, expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

for (const width of [1280, 390]) {
 test(`P08a: reload, JSON and demo isolation (${width}px)`, async ({page, browser}, testInfo) => {
  await page.setViewportSize({width, height:844});
  const errors:string[]=[];
  const privateRequests:string[]=[];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('console', message=>{
   if(message.type()==='error') errors.push(`${message.text()} ${message.location().url}`);
  });
  page.on('request', request=>{if(/\/api\/(progress|essays)/.test(request.url())) privateRequests.push(request.url());});
  await page.goto('/demonstracao');
  await expect(page.locator('main')).toHaveAttribute('aria-busy','false');
  await expect(page).toHaveTitle(/P.E.M|MONARCAS/i);
  // Synthetic account and legacy data must not be read or overwritten by demo.
  const foreign = {
   'pem-v2-progress-p08a-student': JSON.stringify({progress:{notes:{private:'PRIVATE_P08A'},read:{private:true}},revision:7,pending:true}),
   'pem-progress-p08a-legacy': JSON.stringify({'read-private':true}),
   'pem-note-p08a-legacy-private': 'PRIVATE_LEGACY_P08A',
  };
  await page.evaluate(values=>{for(const [key,value] of Object.entries(values)) localStorage.setItem(key,value);},foreign);
  await page.goto('/demonstracao/materias');
  await expect(page.locator('main')).toHaveAttribute('aria-busy','false');
  await page.getByRole('button',{name:/MATEMÁTICA|Matemática/}).click();
  await page.locator('.lesson-list button').first().click();
  await expect(page.getByLabel('Suas anotações')).toHaveValue('');
  const note='P08a: revisão sintética — ângulos, ação e memória.\nSegunda linha.';
  await page.getByLabel('Suas anotações').fill(note);
  await page.getByLabel('Consigo explicar este assunto').check();
  await page.locator('.options button').first().click();
  await page.goto('/demonstracao/biblioteca');
  await expect(page.locator('main')).toHaveAttribute('aria-busy','false');
  await page.getByRole('checkbox').first().check();
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.goto('/demonstracao');
  await page.reload();
  await expect(page.locator('.home-stats')).toContainText('1 etapas revisadas por você');
  await page.getByRole('link',{name:/Continuar:/}).click();
  await expect(page).toHaveURL(/\/demonstracao\/materias\?aula=/);
  await expect(page.getByLabel('Suas anotações')).toHaveValue(note);
  await page.reload();
  await expect(page.getByLabel('Suas anotações')).toHaveValue(note);
  await expect(page.getByLabel('Consigo explicar este assunto')).toBeChecked();
  await expect(page.locator('.answer-feedback')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(process.env.PEM_QA_SCREENSHOT_DIR) await page.screenshot({path:`${process.env.PEM_QA_SCREENSHOT_DIR}/p08a-${width}.png`});
  await page.goto('/demonstracao');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Baixar minhas anotações e progresso'}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('meus-estudos-pem.json');
  const path=testInfo.outputPath('progress.json');
  await download.saveAs(path);
  const raw=await readFile(path,'utf8');
  const exported=JSON.parse(raw);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('pem-v2-progress-demo')!).progress);
  expect(exported.format).toBe('pem-progress-v1');
  expect(Number.isNaN(Date.parse(exported.exportedAt))).toBe(false);
  expect(exported.progress).toEqual(stored);
  expect(Object.values(exported.progress.notes)).toEqual([note]);
  expect(Object.values(exported.progress.read)).toEqual([true]);
  expect(Object.values(exported.progress.answers)).toEqual([0]);
  expect(Object.values(exported.progress.materials)).toEqual([true]);
  expect(exported.progress.lastLesson).toBeTruthy();
  expect(raw).not.toContain('PRIVATE');
  expect(await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),Object.keys(foreign))).toEqual(foreign);
  expect(privateRequests).toEqual([]);
  expect(errors).toEqual([]);
  // A separate browser context must start with no demo progress.
  const isolated=await browser.newContext();
  try {
   const fresh=await isolated.newPage();
   await fresh.goto(new URL('/demonstracao',page.url()).href);
   await expect(fresh.locator('main')).toHaveAttribute('aria-busy','false');
   await expect(fresh.locator('.home-stats')).toContainText('0 etapas revisadas por você');
   await expect(fresh.getByRole('link',{name:/Continuar:/})).toHaveCount(0);
   expect(await fresh.evaluate(()=>localStorage.getItem('pem-v2-progress-demo'))).toBeNull();
  } finally {await isolated.close();}
 });
}
