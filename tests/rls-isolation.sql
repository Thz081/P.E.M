-- Run on PEM only. Synthetic fixtures are rolled back, including on failure.
begin;
insert into auth.users(id) values
 ('00000000-0000-4000-a000-00000000ee01'),
 ('00000000-0000-4000-a000-00000000ee02');
insert into public.profiles(id) select id from auth.users
 where id in ('00000000-0000-4000-a000-00000000ee01','00000000-0000-4000-a000-00000000ee02');
insert into public.progress(user_id,data) values
 ('00000000-0000-4000-a000-00000000ee01','{"test":"A"}'),
 ('00000000-0000-4000-a000-00000000ee02','{"test":"B"}');
insert into public.essays(id,user_id,theme,body) values
 ('00000000-0000-4000-a000-00000000ee03','00000000-0000-4000-a000-00000000ee01','Teste','Texto fictício A'),
 ('00000000-0000-4000-a000-00000000ee04','00000000-0000-4000-a000-00000000ee02','Teste','Texto fictício B');
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-a000-00000000ee01',true);
do $$ begin
 if (select count(*) from public.progress) <> 1 then raise exception 'Progress isolation failed'; end if;
 if (select count(*) from public.essays) <> 1 then raise exception 'Essay isolation failed'; end if;
 if has_column_privilege('authenticated','public.profiles','role','UPDATE') then raise exception 'Role escalation possible'; end if;
 update public.progress set data='{}' where user_id='00000000-0000-4000-a000-00000000ee02';
 if found then raise exception 'Cross-owner update allowed'; end if;
end $$;
reset role;
insert into public.essay_shares(essay_id,recipient,owner_id) values
 ('00000000-0000-4000-a000-00000000ee04','00000000-0000-4000-a000-00000000ee01','00000000-0000-4000-a000-00000000ee02');
set local role authenticated;
do $$ begin
 if (select count(*) from public.essays) <> 2 then raise exception 'Authorized sharing failed'; end if;
 delete from public.essays where id='00000000-0000-4000-a000-00000000ee04';
 if found then raise exception 'Recipient deleted owner essay'; end if;
end $$;
reset role;
delete from public.essay_shares where essay_id='00000000-0000-4000-a000-00000000ee04';
set local role authenticated;
do $$ begin
 if (select count(*) from public.essays) <> 1 then raise exception 'Share revocation failed'; end if;
end $$;
reset role;
update public.profiles set active=false where id='00000000-0000-4000-a000-00000000ee01';
set local role authenticated;
do $$ begin
 if exists(select 1 from public.progress) or exists(select 1 from public.essays) then raise exception 'Deactivated account retained access'; end if;
end $$;
reset role;
select 'PASS: isolation, role protection, sharing, revocation and deactivation' as result;
rollback;
