# P07 — isolamento e superfície de autorização (revisão em andamento)

Auditoria local e do projeto Supabase PEM em 23/09/2026. Nenhuma migração nova foi necessária até este ponto.

- As 12 tabelas do schema `public` têm RLS ligado. `anon` não tem SELECT em nenhuma delas. `admin_access`, `roster`, `reset_requests`, `rate_limits` e `ai_budget_daily` não dão acesso direto a `authenticated`.
- As funções privilegiadas `private.is_admin` e `private.is_active` ficam em schema não exposto. Nenhuma função `SECURITY DEFINER` está no schema `public` ou executável por `anon`. As funções públicas de reserva/limite só podem ser executadas pelo serviço; a busca de trechos é `SECURITY INVOKER`.
- As políticas de progresso, redações, compartilhamentos e gerações combinam dono/destinatário com conta ativa. A conta admin pode consultar perfis, mas não progresso nem redações alheias. Apenas `display_name` e `avatar` são atualizáveis pelo usuário no perfil; `role` e `active` não são.
- `tests/rls-isolation.sql` passou de novo no banco real com rollback. O teste agora inclui isolamento de perfis, escopo de admin e ausência de acesso direto à allowlist/roster. Compartilhamento, revogação e desativação passaram. Zero identidades sintéticas permaneceram; allowlist real mantém duas contas. E2E real de contas também passou nesta revisão (55,1 s), cobrindo autenticação e isolamento pela aplicação.
- Advisors: cinco avisos informativos de RLS sem política referem-se a tabelas internas deliberadamente inacessíveis ao cliente. Há um aviso de proteção contra senhas vazadas desativada, a tratar em P25; duas chaves estrangeiras sem índice de cobertura são oportunidades de desempenho, não exposição de dados.

P07 permanece aberta até a auditoria final de autorização com GPT-6 Astra médio prevista no Kanban. A proteção contra senhas vazadas e a prévia de produção não foram verificadas como corrigidas.

Referências: [RLS e grants](https://supabase.com/docs/guides/database/postgres/row-level-security), [advisor de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), [advisor de RLS sem política](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
