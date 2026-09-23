'use client';
import {useEffect,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
export function Profile(){
 const [name,setName]=useState(''),[avatar,setAvatar]=useState('dragon'),[status,setStatus]=useState('Carregando perfil…'),[busy,setBusy]=useState(true),[ready,setReady]=useState(false);
 useEffect(()=>{const controller=new AbortController();void(async()=>{
  try{const response=await fetch('/api/profile',{signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.error);setName(data.profile.display_name);setAvatar(data.profile.avatar);setReady(true);setStatus('');}
  catch(error){if(!controller.signal.aborted)setStatus(error instanceof Error?error.message:'Não foi possível carregar o perfil.');}
  finally{if(!controller.signal.aborted)setBusy(false);}
 })();return()=>controller.abort();},[]);
 async function save(event:React.FormEvent){event.preventDefault();setBusy(true);try{const response=await fetch('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({display_name:name,avatar})});const data=await response.json();if(!response.ok)throw Error(data.error);setName(data.profile.display_name);setStatus('Perfil salvo na sua conta.');}catch(error){setStatus(error instanceof Error?error.message:'Não foi possível salvar.');}finally{setBusy(false);}}
 return <><header className="page-heading"><p className="eyebrow">SEU ESPAÇO</p><h1>Como você quer aparecer?</h1><p>Seu apelido e avatar ficam associados à sua conta.</p></header><form className="paper" onSubmit={save}><label htmlFor="display-name">Apelido</label><Input id="display-name" value={name} onChange={event=>setName(event.target.value)} maxLength={80} required disabled={!ready}/><label htmlFor="profile-avatar">Avatar</label><select id="profile-avatar" value={avatar} onChange={event=>setAvatar(event.target.value)} disabled={!ready}><option value="dragon">Dragão</option><option value="phoenix">Fênix</option><option value="owl">Coruja</option><option value="book">Livro</option></select><div className="controls"><Button disabled={busy||!ready}>Salvar perfil</Button></div><p role="status">{status}</p></form></>;
}
