# P07 — isolamento e superfície de autorização (concluída)

Auditoria final com GPT-6 Astra médio no projeto Supabase PEM em 23/09/2026. A revisão encontrou e corrigiu uma divergência entre a autorização da aplicação e a do banco.

## Falha encontrada e corrigida

`admin()` no servidor exige papel admin, perfil ativo e registro ativado em `admin_access`. A função RLS `private.is_admin()` exigia apenas papel e perfil ativo. Uma conta com papel admin fora da lista (ou retirada dela depois do login) ainda conseguia ler os perfis dos demais diretamente pela API do banco. Não foi encontrada forma de um aluno alterar o próprio papel; o problema era a ausência da restrição/revogação da lista na camada SQL.

Reprodução sintética antes da correção: `admin_without_allowlist=true`; o teste ampliado falhou com `Admin role bypassed allowlist`. A migração `20260923163411_require_activated_admin_allowlist.sql` foi aplicada e faz a função consultar a lista ativada, com `search_path` vazio e acesso somente no schema privado. A mesma suíte passou após a correção.

## Evidência final

- SQL transacional com rollback: isolamento de perfis/progresso/redações/gerações; proibição de inserir em nome de outro ou reassociar o dono; compartilhamento e revogação; bloqueio de conta desativada; documentos privados/não revisados/não autorizados excluídos da leitura, dos trechos e da busca. Admin sem lista, sem ativação ou removido dela é recusado.
- E2E real ampliado passou em 53,1 s. Além dos fluxos da aplicação, usa clientes com chave pública e JWTs reais: admin autorizado vê os perfis das fixtures, mas não progresso/redações alheias nem a allowlist. Revogação e desativação retiram a leitura com o mesmo token e fazem `/api/admin` responder 403. Metadado de aluno com `role=admin` não concede privilégios, e UPDATE do papel é recusado (42501). Schema `private` inacessível por PostgREST (PGRST106).
- Tipos e lint passaram. Nenhum código do aplicativo mudou nesta auditoria; build e revisão de UI permanecem os do marco anterior, sem repetição desnecessária.
- Limpeza confirmada: zero usuários/documentos sintéticos; 41 registros da turma e duas contas na lista admin preservados.
- Cinco arquivos de migração foram alinhados aos nomes/versões efetivamente registrados pelo MCP no banco. Conteúdo verificado por hash após normalização de espaços antes de renomear; os cinco pares coincidiram. Não houve reaplicação das quatro migrações antigas.

- As 12 tabelas do schema `public` têm RLS ligado. `anon` não tem nenhum privilégio de tabela; `authenticated` não tem TRUNCATE, TRIGGER ou REFERENCES. `admin_access`, `roster`, `reset_requests`, `rate_limits` e `ai_budget_daily` não dão acesso direto a `authenticated`. Não há buckets Storage.
- As funções privilegiadas `private.is_admin` e `private.is_active` ficam em schema não exposto. Nenhuma função `SECURITY DEFINER` está no schema `public` ou executável por `anon`. As funções públicas de reserva/limite só podem ser executadas pelo serviço; a busca de trechos é `SECURITY INVOKER`.
- As políticas de progresso, redações, compartilhamentos e gerações combinam dono/destinatário com conta ativa. A conta admin pode consultar perfis, mas não progresso nem redações alheias. Apenas `display_name` e `avatar` são atualizáveis pelo usuário no perfil; `role` e `active` não são.
- `tests/rls-isolation.sql` passou de novo no banco real com rollback. O teste agora inclui isolamento de perfis, escopo de admin e ausência de acesso direto à allowlist/roster. Compartilhamento, revogação e desativação passaram. Zero identidades sintéticas permaneceram; allowlist real mantém duas contas. E2E real de contas também passou nesta revisão (55,1 s), cobrindo autenticação e isolamento pela aplicação.
- Advisors: cinco avisos informativos de RLS sem política referem-se a tabelas internas deliberadamente inacessíveis ao cliente. Há um aviso de proteção contra senhas vazadas desativada, a tratar em P25; duas chaves estrangeiras sem índice de cobertura são oportunidades de desempenho, não exposição de dados.

P07 concluída pelos critérios de isolamento, admin controlado e exposição das tabelas. A proteção contra senhas vazadas continua registrada em P25; o aviso não foi marcado como corrigido. A prévia, regressão de publicação e rollback permanecem em P25/P26. A produção Vercel não foi promovida.

Referências: [RLS e grants](https://supabase.com/docs/guides/database/postgres/row-level-security), [advisor de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), [advisor de RLS sem política](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
