-- Keep the server-side limiter bounded instead of retaining expired buckets forever.
create or replace function public.take_rate_limit(bucket text,max_count integer,seconds integer)
returns boolean
language plpgsql
security invoker
set search_path=''
as $$
declare n integer;
begin
 if max_count < 1 or seconds < 1 then return false; end if;
 delete from public.rate_limits where expires_at < now();
 insert into public.rate_limits as r values(bucket,1,now()+make_interval(secs=>seconds))
 on conflict(key) do update
 set count=case when r.expires_at<now() then 1 else r.count+1 end,
     expires_at=case when r.expires_at<now() then now()+make_interval(secs=>seconds) else r.expires_at end
 returning count into n;
 return n<=max_count;
end;
$$;

revoke all on function public.take_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.take_rate_limit(text,integer,integer) to service_role;

-- A student can keep a useful history without creating unbounded persistent storage.
create or replace function private.enforce_essay_quota()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
declare
 existing_count bigint;
 existing_bytes bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,0));
 select count(*),coalesce(sum(octet_length(body)),0)
 into existing_count,existing_bytes
 from public.essays
 where user_id=new.user_id and id<>new.id;
 if (tg_op='INSERT' and existing_count>=500) or existing_bytes+octet_length(new.body)>5000000 then
  raise exception 'essay_quota_exceeded' using errcode='P0001';
 end if;
 return new;
end;
$$;

revoke all on function private.enforce_essay_quota() from public,anon,authenticated;
drop trigger if exists enforce_essay_quota on public.essays;
create trigger enforce_essay_quota
before insert or update of user_id,body on public.essays
for each row execute function private.enforce_essay_quota();
