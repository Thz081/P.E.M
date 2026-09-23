# CI e proteção da produção

Workflow: `.github/workflows/quality.yml`, job obrigatório `quality` do GitHub Actions (app 15368).

Executa em PRs para `main` e em pushes para `main` e `codex/**`: instalação pelo lockfile, lint, tipos, conteúdo, testes TypeScript e Python, auditoria de dependências, build e testes Playwright da demonstração. A CI não recebe segredos do banco; os testes com contas reais e IA exigem execução controlada à parte e não ficam aprovados por serem pulados na CI.

Proteção de `main` aplicada e confirmada pela API em 23/09/2026:

- PR obrigatório, sem exigir um segundo revisor humano no projeto individual.
- Check `quality` obrigatório, associado ao GitHub Actions; branch deve estar atualizada.
- Regras valem também para administradores.
- Force push e exclusão bloqueados; conversas de revisão precisam estar resolvidas.

A prévia automática de `codex/plataforma-estudos` não altera o domínio de produção. CI verde não substitui os testes da prévia, ambientes, autenticação real e rollback exigidos por P25/P26. Não promover enquanto esses critérios estiverem pendentes.

Evidência inicial: commit `a8278cc`, execução `35814203955` de `PEM quality` concluída com sucesso. A inclusão do gatilho de push para `main` será verificada pela próxima execução na branch; não fazer um push de teste na produção.

Para conferir as regras novamente, consultar `GET /repos/Thz081/P.E.M/branches/main/protection`. Credenciais devem ser obtidas pelo gerenciador Git local, nunca impressas nem armazenadas no repositório.
