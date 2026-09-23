-- Additive platform schema. Apply to the dedicated PEM project only.
create extension if not exists vector with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default 'Estudante' check (length(display_name)<=80),
 role text not null default 'student' check(role in ('student','admin')),
 active boolean not null default true,
 avatar text not null default 'dragon' check(avatar in ('dragon','phoenix','owl','book')),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin' and active);
$$;
revoke all on function private.is_admin() from public,anon;
grant execute on function private.is_admin() to authenticated,service_role;
create policy profile_read on public.profiles for select to authenticated using(id=(select auth.uid()) or (select private.is_admin()));
create policy profile_edit on public.profiles for update to authenticated using(id=(select auth.uid()) and active) with check(id=(select auth.uid()));
grant select on public.profiles to authenticated;
grant update(display_name,avatar) on public.profiles to authenticated;

create table public.roster (
 identifier text primary key,
 matricula text not null unique,
 user_id uuid not null unique references auth.users(id) on delete cascade,
 activated_at timestamptz,
 code_hash text,
 code_expires_at timestamptz,
 code_consumed_at timestamptz
);
alter table public.roster enable row level security;
revoke all on public.roster from anon,authenticated;
create table public.reset_requests(identifier text primary key references public.roster(identifier),requested_at timestamptz not null default now(),resolved_at timestamptz);
alter table public.reset_requests enable row level security;
revoke all on public.reset_requests from anon,authenticated;

create table public.progress(user_id uuid primary key references auth.users(id) on delete cascade,data jsonb not null default '{}' check(octet_length(data::text)<=250000),revision bigint not null default 0,updated_at timestamptz not null default now());
alter table public.progress enable row level security;
create policy progress_owner on public.progress for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update,delete on public.progress to authenticated;

create table public.essays(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,theme text not null check(length(theme) between 1 and 250),body text not null check(length(body) between 1 and 15000),parent_id uuid,created_at timestamptz not null default now());
create index essays_owner on public.essays(user_id,created_at desc);
create table public.essay_shares(essay_id uuid not null references public.essays(id) on delete cascade,recipient uuid not null references auth.users(id) on delete cascade,owner_id uuid not null references auth.users(id) on delete cascade,created_at timestamptz not null default now(),primary key(essay_id,recipient));
alter table public.essays enable row level security;
alter table public.essay_shares enable row level security;
create index essay_share_recipient on public.essay_shares(recipient,essay_id);
create policy share_read on public.essay_shares for select to authenticated using(owner_id=(select auth.uid()) or recipient=(select auth.uid()));
-- Writes go through server after checking essay ownership; no direct authenticated write grant.
grant select on public.essay_shares to authenticated;
create policy essay_read on public.essays for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.essay_shares s where s.essay_id=id and s.recipient=(select auth.uid())));
create policy essay_insert on public.essays for insert to authenticated with check(user_id=(select auth.uid()));
create policy essay_delete on public.essays for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,delete on public.essays to authenticated;

create table public.documents(id uuid primary key default gen_random_uuid(),title text not null,sha256 text not null unique,subject text not null,version text not null,reviewed boolean not null default false,authorized boolean not null default false,scope text not null default 'private' check(scope in ('private','class')),source_url text);
create table public.chunks(id uuid primary key default gen_random_uuid(),document_id uuid not null references public.documents(id) on delete cascade,page integer not null check(page>0),ordinal integer not null,body text not null check(length(body)<=5000),embedding extensions.vector(1024),fts tsvector generated always as(to_tsvector('portuguese',body)) stored,unique(document_id,page,ordinal));
alter table public.documents enable row level security;
alter table public.chunks enable row level security;
create policy docs_class on public.documents for select to authenticated using(reviewed and authorized and scope='class' and exists(select 1 from public.profiles where id=(select auth.uid()) and active));
create policy chunks_class on public.chunks for select to authenticated using(exists(select 1 from public.documents d where d.id=document_id));
grant select on public.documents,public.chunks to authenticated;
create index chunks_document on public.chunks(document_id);
create index chunks_fts on public.chunks using gin(fts);
create index chunks_vector on public.chunks using hnsw(embedding extensions.vector_cosine_ops);
create function public.search_chunks(query_text text, query_embedding extensions.vector(1024))
returns table(id uuid,title text,page integer,body text,source_url text,score double precision)
language sql stable security invoker set search_path='' as $$
 with semantic as (select c.id,row_number() over(order by c.embedding OPERATOR(extensions.<=>) query_embedding) r from public.chunks c where c.embedding is not null and query_embedding is not null order by c.embedding OPERATOR(extensions.<=>) query_embedding limit 20),
 lexical as(select c.id,row_number() over(order by ts_rank(c.fts,websearch_to_tsquery('portuguese',query_text)) desc) r from public.chunks c where c.fts @@ websearch_to_tsquery('portuguese',query_text) order by ts_rank(c.fts,websearch_to_tsquery('portuguese',query_text)) desc limit 20),
 ranked as(select coalesce(s.id,l.id) id,coalesce(1.0/(60+s.r),0)+coalesce(1.0/(60+l.r),0) score from semantic s full join lexical l on s.id=l.id)
 select c.id,d.title,c.page,c.body,d.source_url,r.score::double precision from ranked r join public.chunks c on c.id=r.id join public.documents d on d.id=c.document_id order by r.score desc limit 5;
$$;
revoke all on function public.search_chunks(text,extensions.vector) from public,anon;
grant execute on function public.search_chunks(text,extensions.vector) to authenticated;

create table public.rate_limits(key text primary key,count integer not null,expires_at timestamptz not null);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon,authenticated;
create function public.take_rate_limit(bucket text,max_count integer,seconds integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.rate_limits as r values(bucket,1,now()+make_interval(secs=>seconds)) on conflict(key) do update set count=case when r.expires_at<now() then 1 else r.count+1 end,expires_at=case when r.expires_at<now() then now()+make_interval(secs=>seconds) else r.expires_at end returning count into n;
 return n<=max_count;
end;$$;
revoke all on function public.take_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.take_rate_limit(text,integer,integer) to service_role;

create table public.generations(id uuid primary key,user_id uuid not null references auth.users(id) on delete cascade,kind text not null check(kind in ('chat','essay','embedding')),request_hash text not null,neurons integer not null check(neurons>0),status text not null default 'running' check(status in ('running','complete','failed')),created_at timestamptz not null default now(),lease_until timestamptz not null default now()+interval '100 seconds',output jsonb);
alter table public.generations enable row level security;
create policy generation_owner on public.generations for select to authenticated using(user_id=(select auth.uid()));
grant select on public.generations to authenticated;
create index generations_quota on public.generations(created_at,user_id,kind);
create function public.reserve_generation(p_id uuid,p_user uuid,p_kind text,p_hash text,p_neurons integer) returns text language plpgsql security invoker set search_path='' as $$
declare current_day timestamptz:=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'; current_week timestamptz:=date_trunc('week',now() at time zone 'UTC') at time zone 'UTC'; old public.generations;
begin
 perform pg_advisory_xact_lock(782026);
 select * into old from public.generations where id=p_id;
 if found then if old.user_id=p_user and old.request_hash=p_hash and old.kind=p_kind then return old.status;else return 'conflict';end if;end if;
 if p_kind not in ('chat','essay','embedding') or p_neurons<1 or p_neurons>8500 then return 'invalid';end if;
 if not exists(select 1 from public.profiles where id=p_user and active) then return 'unauthorized';end if;
 if (select count(*) from public.generations where status='running' and lease_until>now())>=2 then return 'busy';end if;
 if (select count(*) from public.generations where created_at>=current_day and kind<>'embedding')>=100 then return 'daily';end if;
 if coalesce((select sum(neurons) from public.generations where created_at>=current_day),0)+p_neurons>8500 then return 'budget';end if;
 if p_kind='chat' and (select count(*) from public.generations where user_id=p_user and kind='chat' and created_at>=current_day)>=3 then return 'student';end if;
 if p_kind='essay' and (select count(*) from public.generations where user_id=p_user and kind='essay' and created_at>=current_week)>=2 then return 'student';end if;
 insert into public.generations(id,user_id,kind,request_hash,neurons) values(p_id,p_user,p_kind,p_hash,p_neurons);
 return 'reserved';
end;$$;
revoke all on function public.reserve_generation(uuid,uuid,text,text,integer) from public,anon,authenticated;
grant execute on function public.reserve_generation(uuid,uuid,text,text,integer) to service_role;
grant all on public.profiles,public.roster,public.reset_requests,public.progress,public.essays,public.essay_shares,public.documents,public.chunks,public.rate_limits,public.generations to service_role;
