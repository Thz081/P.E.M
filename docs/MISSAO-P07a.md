# P07a — permissões e isolamento do banco

Entrega local e aplicada apenas ao Supabase PEM. Produção Vercel não alterada.

Problema: grants padrão do Supabase permitiam UPDATE da coluna role apesar do grant restrito posterior. A migração 002 revoga privilégios amplos e concede apenas as operações previstas. Políticas restritivas retiram acesso ao progresso, redações, compartilhamentos e gerações de usuários desativados.

Validação executada: tests/rls-isolation.sql no projeto jfvfckkulpcqvhkjwgvy. Duas identidades sintéticas foram criadas dentro de transação e removidas por rollback. Passaram isolamento de progresso/redações, bloqueio de alteração de papel, bloqueio de edição alheia, leitura compartilhada, proibição de excluir texto recebido, revogação e desativação.

Privilégios conferidos: alteração de role=false, alteração de display_name=true, inserção direta em essay_shares=false. Antes dos testes havia zero perfis reais.

Limite: isto valida políticas SQL. Ativação, recuperação, sessões completas, concorrência de cotas e interfaces administrativas ainda exigem testes próprios. P07 completo permanece em teste.
