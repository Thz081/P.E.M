'use client';
import {useEffect,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

type Entry={identifier:string;matricula:string;nome:string;turma:string;activated_at:string|null;code_expires_at:string|null;code_consumed_at:string|null};
type RequestEntry={identifier:string;requested_at:string};
export function Admin(){
 const [roster,setRoster]=useState<Entry[]>([]),[requests,setRequests]=useState<RequestEntry[]>([]);
 const [search,setSearch]=useState(''),[status,setStatus]=useState('Carregando a turma…'),[busy,setBusy]=useState(true);
 const [issued,setIssued]=useState<{matricula:string;code:string;expires:string}|null>(null);
 async function load(signal?:AbortSignal){
  setBusy(true);setIssued(null);
  try{
   const response=await fetch('/api/admin',{cache:'no-store',signal});const data=await response.json();
   if(!response.ok)throw Error(data.error||'Não foi possível carregar a turma.');
   setRoster(data.roster);setRequests(data.requests);setStatus(data.roster.length?'Turma atualizada.':'Nenhum aluno provisionado.');
  }catch(error){if(!signal?.aborted){setRoster([]);setRequests([]);setStatus(error instanceof Error?error.message:'Falha ao carregar.');}}
  finally{if(!signal?.aborted)setBusy(false);}
 }
 useEffect(()=>{const controller=new AbortController();void load(controller.signal);return()=>controller.abort();},[]);
 async function issue(entry:Entry){
  setBusy(true);setIssued(null);setStatus('Gerando código individual…');
  try{
   const response=await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier:entry.identifier})});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Não foi possível gerar o código.');
   setIssued({matricula:entry.matricula,code:data.code,expires:data.expires});
   setRoster(current=>current.map(row=>row.identifier===entry.identifier?{...row,code_expires_at:data.expires,code_consumed_at:null}:row));
   setStatus('Código gerado. Entregue individualmente ao titular da matrícula.');
  }catch(error){setStatus(error instanceof Error?error.message:'Falha ao gerar código.');}
  finally{setBusy(false);}
 }
 return <main id="main" className="main-content">
  <button className="text-link" onClick={async()=>{await fetch('/api/logout',{method:'POST'});location.href='/';}}>Sair da administração</button>
  <header className="page-heading"><p className="eyebrow">ADMINISTRAÇÃO · 3º A DS</p><h1>Acompanhar os acessos.</h1><p>Gerencie ativação e recuperação da turma. Os textos e as anotações pessoais não aparecem neste painel.</p></header>
  <div className="controls"><Input aria-label="Buscar matrícula" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar matrícula"/><Button variant="outline" disabled={busy} onClick={()=>void load()}>Atualizar turma</Button></div>
  <p role="status">{status}</p>
  <p className="muted">{roster.length} matrículas · {roster.filter(row=>row.activated_at).length} ativadas · {requests.length} pedidos de recuperação</p>
  {issued&&<section className="paper" aria-label="Código individual gerado"><h2>Matrícula {issued.matricula}</h2><p>Copie agora: este código não poderá ser consultado novamente.</p><p><code>{issued.code}</code></p><p>Válido até {new Date(issued.expires).toLocaleString('pt-BR')}. Uso único; substitui o código anterior.</p><Button variant="outline" onClick={()=>setIssued(null)}>Ocultar código</Button></section>}
  <div className="resource-list">{roster.filter(row=>row.matricula.includes(search.trim())).map(row=>{
   const reset=requests.find(request=>request.identifier===row.identifier);
   const codeValid=!row.code_consumed_at&&row.code_expires_at&&Date.parse(row.code_expires_at)>Date.now();
   return <div key={row.identifier}><span><h2>Matrícula {row.matricula}</h2><p>{row.nome} · {row.turma}</p><p>{row.activated_at?'Conta ativada':'Aguardando ativação'}{codeValid?' · Código válido':''}</p>{reset&&<p>Recuperação solicitada em {new Date(reset.requested_at).toLocaleString('pt-BR')}</p>}</span><Button disabled={busy} onClick={()=>void issue(row)}>{row.activated_at?'Gerar código de recuperação':'Gerar código de ativação'}</Button></div>;
  })}</div>
 </main>;
}
