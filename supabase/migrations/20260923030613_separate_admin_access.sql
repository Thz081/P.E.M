-- Separate operator credentials from each person's student account.
-- Only the service role may provision or read this allowlist.
alter table public.roster add column nome text not null default 'Estudante' check(length(nome) between 1 and 120);
alter table public.roster add column turma text not null default '3A DS' check(turma='3A DS');

create table public.admin_access (
 identifier text primary key,
 matricula text not null unique check(matricula ~ '^[0-9]{5,12}$'),
 user_id uuid not null unique references auth.users(id) on delete cascade,
 activated_at timestamptz,
 code_hash text,
 code_expires_at timestamptz,
 code_consumed_at timestamptz
);
alter table public.admin_access enable row level security;
revoke all on public.admin_access from public,anon,authenticated;
grant select,insert,update,delete on public.admin_access to service_role;
