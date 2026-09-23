'use client';
import {useEffect,useState,useRef,useCallback} from 'react';
import {emptyProgress,parseProgress,type Progress} from '@/lib/progress';
import type {Identity} from '@/lib/identity';
export function useProgress(user:Identity){
 const key=`pem-v2-progress-${user.id}`;
 const [progress,setProgress]=useState<Progress>(emptyProgress),[ready,setReady]=useState(false),[saved,setSaved]=useState('Carregando seu espaço…');
 const revision=useRef(0),changed=useRef(false),blocked=useRef(false),sending=useRef(false),latest=useRef(progress),generation=useRef(0);
 useEffect(()=>{let alive=true;setReady(false);blocked.current=false;changed.current=false;revision.current=0;
  async function load(){let local=emptyProgress;let pending=false;let localRevision=0;try{const raw=JSON.parse(localStorage.getItem(key)||'null');local=parseProgress(raw?.progress||raw);pending=!!raw?.pending;localRevision=raw?.revision||0;}catch{}
   if(!alive)return;setProgress(local);latest.current=local;revision.current=localRevision;changed.current=pending;
   if(user.kind==='student')try{const r=await fetch('/api/progress');if(!r.ok)throw Error();const remote=await r.json();if(!alive)return;if(pending&&remote.revision!==localRevision){blocked.current=true;setSaved('Conflito entre cópias. Seus dados locais foram preservados; exporte antes de reconciliar.');}else{revision.current=remote.revision;if(!pending&&remote.progress){local=parseProgress(remote.progress);setProgress(local);latest.current=local;localStorage.setItem(key,JSON.stringify({progress:local,revision:remote.revision,pending:false}));}setSaved(pending?'Sincronização pendente':'Sincronizado com sua conta');}}
   catch{if(alive){blocked.current=true;setSaved('Sem sincronização · cópia neste navegador');}}
   else setSaved(user.kind==='demo'?'Demonstração · dados deste navegador':'Salvo neste navegador');
   if(alive)setReady(true);
  }void load();return()=>{alive=false;};
 },[key,user.kind]);
 const update=useCallback((p:Progress)=>{latest.current=p;generation.current++;setProgress(p);changed.current=true;try{localStorage.setItem(key,JSON.stringify({progress:p,revision:revision.current,pending:user.kind==='student'}));setSaved('Salvo neste navegador');}catch{setSaved('Falha ao salvar. Exporte suas anotações.');}},[key,user.kind]);
 useEffect(()=>{if(!ready||user.kind!=='student')return;const timer=setInterval(async()=>{if(!changed.current||blocked.current||sending.current)return;sending.current=true;const sentGeneration=generation.current;try{const r=await fetch('/api/progress',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({progress:latest.current,revision:revision.current})});const result=await r.json();if(!r.ok){blocked.current=true;setSaved(result.error||'Sem sincronização · cópia local mantida');return;}revision.current=result.revision;changed.current=sentGeneration!==generation.current;localStorage.setItem(key,JSON.stringify({progress:latest.current,revision:revision.current,pending:changed.current}));setSaved(changed.current?'Salvo localmente; sincronização pendente':'Sincronizado com sua conta');}catch{blocked.current=true;setSaved('Sem sincronização · cópia local mantida');}finally{sending.current=false;}},1500);return()=>clearInterval(timer);},[ready,user.kind,key]);
 return {progress,update,ready,saved,setSaved};
}
