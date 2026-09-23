-- Run on PEM only. Synthetic fixtures are rolled back, including on failure.
begin;
insert into auth.users(id) values
 ('00000000-0000-4000-a000-00000000ee01'),
 ('00000000-0000-4000-a000-00000000ee02'),
 ('00000000-0000-4000-a000-00000000ee05');
insert into public.profiles(id) select id from auth.users
 where id in ('00000000-0000-4000-a000-00000000ee01','00000000-0000-4000-a000-00000000ee02');
insert into public.profiles(id,role) values ('00000000-0000-4000-a000-00000000ee05','admin');
insert into public.progress(user_id,data) values
 ('00000000-0000-4000-a000-00000000ee01','{"test":"A"}'),
 ('00000000-0000-4000-a000-00000000ee02','{"test":"B"}');
insert into public.essays(id,user_id,theme,body) values
 ('00000000-0000-4000-a000-00000000ee03','00000000-0000-4000-a000-00000000ee01','Teste','Texto fictício A'),
 ('00000000-0000-4000-a000-00000000ee04','00000000-0000-4000-a000-00000000ee02','Teste','Texto fictício B');
insert into public.generations(id,user_id,kind,request_hash,neurons,status) values
 ('00000000-0000-4000-a000-00000000ee06','00000000-0000-4000-a000-00000000ee01','chat','p07-audit-a',1,'complete'),
 ('00000000-0000-4000-a000-00000000ee07','00000000-0000-4000-a000-00000000ee02','chat','p07-audit-b',1,'complete');
insert into public.documents(id,title,sha256,subject,version,reviewed,authorized,scope) values
 ('00000000-0000-4000-a000-00000000ee10','P07 approved','p07-audit-approved','test','1',true,true,'class'),
 ('00000000-0000-4000-a000-00000000ee11','P07 unreviewed','p07-audit-unreviewed','test','1',false,true,'class'),
 ('00000000-0000-4000-a000-00000000ee12','P07 unauthorized','p07-audit-unauthorized','test','1',true,false,'class'),
 ('00000000-0000-4000-a000-00000000ee13','P07 private','p07-audit-private','test','1',true,true,'private');
insert into public.chunks(document_id,page,ordinal,body)
 select id,1,1,'pemaudituniquefixture' from public.documents where sha256 like 'p07-audit-%';
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-a000-00000000ee01',true);
do $$ begin
 if (select count(*) from public.progress) <> 1 then raise exception 'Progress isolation failed'; end if;
 if (select count(*) from public.essays) <> 1 then raise exception 'Essay isolation failed'; end if;
 if (select count(*) from public.profiles) <> 1 then raise exception 'Profile isolation failed'; end if;
 if (select count(*) from public.generations) <> 1 then raise exception 'Generation isolation failed'; end if;
 if (select count(*) from public.documents where sha256 like 'p07-audit-%') <> 1 then raise exception 'Document authorization failed'; end if;
 if (select count(*) from public.chunks where body='pemaudituniquefixture') <> 1 then raise exception 'Chunk authorization failed'; end if;
 if (select count(*) from public.search_chunks('pemaudituniquefixture',null)) <> 1 then raise exception 'Search bypassed document RLS'; end if;
 if has_column_privilege('authenticated','public.profiles','role','UPDATE') then raise exception 'Role escalation possible'; end if;
 if has_table_privilege('authenticated','public.admin_access','SELECT') then raise exception 'Admin allowlist exposed'; end if;
 if has_table_privilege('authenticated','public.roster','SELECT') then raise exception 'Roster exposed'; end if;
 if has_table_privilege('anon','public.profiles','SELECT') then raise exception 'Anonymous profile access'; end if;
 update public.progress set data='{}' where user_id='00000000-0000-4000-a000-00000000ee02';
 if found then raise exception 'Cross-owner update allowed'; end if;
 begin
  update public.progress set user_id='00000000-0000-4000-a000-00000000ee05' where user_id='00000000-0000-4000-a000-00000000ee01';
  raise exception 'Ownership reassignment allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.essays(user_id,theme,body) values('00000000-0000-4000-a000-00000000ee02','Forbidden','Forbidden');
  raise exception 'Cross-owner insert allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-a000-00000000ee05',true);
do $$ begin
 if private.is_admin() then raise exception 'Admin role bypassed allowlist'; end if;
 if (select count(*) from public.profiles) <> 1 then raise exception 'Unlisted admin read other profiles'; end if;
end $$;
reset role;
insert into public.admin_access(identifier,matricula,user_id)
 values('p07-audit-admin','999999999905','00000000-0000-4000-a000-00000000ee05');
set local role authenticated;
do $$ begin
 if private.is_admin() then raise exception 'Unactivated admin authorized'; end if;
end $$;
reset role;
update public.admin_access set activated_at=now() where user_id='00000000-0000-4000-a000-00000000ee05';
set local role authenticated;
do $$ begin
 if (select count(*) from public.profiles where id in ('00000000-0000-4000-a000-00000000ee01','00000000-0000-4000-a000-00000000ee02')) <> 2 then raise exception 'Admin profile access failed'; end if;
 if exists(select 1 from public.progress) or exists(select 1 from public.essays) then raise exception 'Admin received private student data'; end if;
end $$;
reset role;
delete from public.admin_access where user_id='00000000-0000-4000-a000-00000000ee05';
set local role authenticated;
do $$ begin
 if private.is_admin() then raise exception 'Revoked admin retained access'; end if;
 if (select count(*) from public.profiles) <> 1 then raise exception 'Revoked admin read other profiles'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-a000-00000000ee01',true);
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
 if exists(select 1 from public.generations) or exists(select 1 from public.documents) or exists(select 1 from public.chunks) then raise exception 'Deactivated account retained content'; end if;
 if exists(select 1 from public.search_chunks('pemaudituniquefixture',null)) then raise exception 'Deactivated account retained search'; end if;
end $$;
reset role;
select 'PASS: isolation, activated admin allowlist/revocation, role protection, document/search visibility, sharing and deactivation' as result;
rollback;
