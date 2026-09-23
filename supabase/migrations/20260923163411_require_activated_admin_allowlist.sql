-- Match the server's admin() authorization even for an already issued JWT.
-- The private helper needs definer privileges to inspect the service-only allowlist.
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path='' as $$
 select exists(
  select 1 from public.profiles p
  join public.admin_access a on a.user_id=p.id
  where p.id=(select auth.uid()) and p.role='admin' and p.active
    and a.activated_at is not null
 );
$$;
revoke all on function private.is_admin() from public,anon;
grant execute on function private.is_admin() to authenticated,service_role;
