'use client';
import {useEffect,useState} from 'react';
import {daysUntil} from '@/lib/progress';
import {INEP} from '@/lib/content';
export function Countdown(){const [days,setDays]=useState<number[]>([]);useEffect(()=>{const tick=()=>setDays([daysUntil('2026-11-08'),daysUntil('2026-11-15')]);tick();const id=setInterval(tick,60000);return()=>clearInterval(id);},[]);return <section className="countdown" aria-label="Contagem para o ENEM"><div><span className="eyebrow">ENEM 2026</span><h2>Um dia de cada vez.</h2><a href={INEP} target="_blank" rel="noopener noreferrer">Datas de aplicação regular · fonte: Inep ↗</a></div><div className="count-item"><strong>{days[0]??'—'}</strong><span>dias para o 1º dia<br/><b>8 de novembro</b></span></div><div className="count-item"><strong>{days[1]??'—'}</strong><span>dias para o 2º dia<br/><b>15 de novembro</b></span></div><small>Horário de Brasília. Após cada data, o contador permanece em zero.</small></section>;}
