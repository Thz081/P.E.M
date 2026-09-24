-- Supabase default privileges include table-wide grants on newly created tables.
-- Reset them explicitly before applying the intended column/operation grants.
revoke all on public.profiles, public.progress, public.essays,
 public.essay_shares, public.documents, public.chunks, public.generations
 from anon, authenticated;

grant select on public.profiles to authenticated;
grant update(display_name, avatar) on public.profiles to authenticated;
grant select, insert, update, delete on public.progress to authenticated;
grant select, insert, delete on public.essays to authenticated;
grant select on public.essay_shares, public.documents, public.chunks,
 public.generations to authenticated;

create function private.is_active() returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and active);
$$;
revoke all on function private.is_active() from public, anon;
grant execute on function private.is_active() to authenticated, service_role;

-- Restrictive policies combine with owner policies. Deactivation also applies
-- to direct database calls made with a previously issued, unexpired JWT.
create policy progress_active on public.progress as restrictive for all
 to authenticated using((select private.is_active())) with check((select private.is_active()));
create policy essays_active on public.essays as restrictive for all
 to authenticated using((select private.is_active())) with check((select private.is_active()));
create policy shares_active on public.essay_shares as restrictive for select
 to authenticated using((select private.is_active()));
create policy generations_active on public.generations as restrictive for select
 to authenticated using((select private.is_active()));
