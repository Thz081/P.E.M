-- Aggregate usage survives deletion of temporary users and contains no messages.
create table public.ai_budget_daily (
 day date primary key,
 neurons integer not null default 0 check(neurons>=0),
 calls integer not null default 0 check(calls>=0)
);
alter table public.ai_budget_daily enable row level security;
revoke all on public.ai_budget_daily from public,anon,authenticated;
grant select,insert,update on public.ai_budget_daily to service_role;
insert into public.ai_budget_daily(day,neurons,calls)
 select (created_at at time zone 'UTC')::date,sum(neurons),count(*) filter(where kind<>'embedding')
 from public.generations group by 1;

create or replace function public.reserve_generation(p_id uuid,p_user uuid,p_kind text,p_hash text,p_neurons integer)
returns text language plpgsql security invoker set search_path='' as $$
declare current_day date:=(now() at time zone 'UTC')::date;
 current_week timestamptz:=date_trunc('week',now() at time zone 'UTC') at time zone 'UTC';
 old public.generations;
 budget public.ai_budget_daily;
begin
 perform pg_advisory_xact_lock(782026);
 select * into old from public.generations where id=p_id;
 if found then
  if old.user_id=p_user and old.request_hash=p_hash and old.kind=p_kind then return old.status;
  else return 'conflict';end if;
 end if;
 if p_kind not in ('chat','essay','embedding') or p_neurons<1 or p_neurons>8500 then return 'invalid';end if;
 if not exists(select 1 from public.profiles where id=p_user and active) then return 'unauthorized';end if;
 if (select count(*) from public.generations where status='running' and lease_until>now())>=2 then return 'busy';end if;
 insert into public.ai_budget_daily(day) values(current_day) on conflict do nothing;
 select * into budget from public.ai_budget_daily where day=current_day;
 if p_kind<>'embedding' and budget.calls>=100 then return 'daily';end if;
 if budget.neurons+p_neurons>8500 then return 'budget';end if;
 if p_kind='chat' and (select count(*) from public.generations where user_id=p_user and kind='chat' and created_at>=current_day::timestamp at time zone 'UTC')>=3 then return 'student';end if;
 if p_kind='essay' and (select count(*) from public.generations where user_id=p_user and kind='essay' and created_at>=current_week)>=2 then return 'student';end if;
 insert into public.generations(id,user_id,kind,request_hash,neurons) values(p_id,p_user,p_kind,p_hash,p_neurons);
 update public.ai_budget_daily set neurons=neurons+p_neurons,calls=calls+case when p_kind='embedding' then 0 else 1 end where day=current_day;
 return 'reserved';
end;$$;
revoke all on function public.reserve_generation(uuid,uuid,text,text,integer) from public,anon,authenticated;
grant execute on function public.reserve_generation(uuid,uuid,text,text,integer) to service_role;
