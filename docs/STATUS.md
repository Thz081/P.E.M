# Estado atual — 23/09/2026
## P11 concluída
Ativação e recuperação passaram em E2E real (1/1, 35,8 s): concorrência, expiração, uso único, código inválido, não enumeração, limite de tentativas, pedido de recuperação, emissão pelo admin, troca de senha e recusa da senha/código antigos. O teste recebeu timeout individual de ações e teardown resiliente; zero fixtures sintéticas ficaram no Supabase. Typecheck e lint passaram. Regressão completa: 11 E2E passaram em 55,6 s e 1 IA real foi pulado porque a IA permanece off. P10 e P11 concluídas; Kanban: 6/26 concluídas, 20 abertas.

## Verificação mais recente
Branch `codex/plataforma-estudos` enviada em `1b8bd39`, PR draft #1; CI remota `PEM quality` passou. Preview Vercel pronto, porém o conector negou acesso à URL e o QA remoto está pendente. Produção antiga preservada. No Supabase há 41 contas de aluno de 3A DS e duas contas admin separadas; quatro códigos privados emitidos, nenhuma ativação. O E2E de redirecionamento admin/aluno passou 1/1. Filtro de fontes do tutor: tipos, lint, 9 unitários e build passaram; teste com modelo real ainda pendente, IA off. Guia PDF de 7 páginas revisado localmente, sem upload no Drive devido a 403.

## 23/09 — trabalho em andamento
Marco posterior: E2E real de duas contas de aluno mais conta admin separada passou 1/1 após corrigir redirect. Admins definitivos2 e alunos41 no Supabase;4 códigos iniciais pendentes em arquivo privado fora do repo, expiram 24/09 00h14 Brasília. Ainda nenhum acesso real ativado. Testes completos não foram repetidos após só a correção de redirect; os outros10 E2E haviam passado na execução imediatamente anterior.
Backup privado filtrado:41 estudantes 3A DS com nome/matrícula/turma importados; nenhuma senha ou código do backup reutilizado. Banco confirmou41 distintos/41 nomes/0 ativados. Acesso separado aluno/admin para dois responsáveis em implementação, migração aplicada; script dry-run passou, importação dos dois admins ainda pendente.

Login legado preservado para matrículas não cadastradas. IA: resposta real com fonte passou; pergunta sem base mostrou citação irrelevante, então filtro de concordância lexical+semântica foi adicionado; falta teste real após esse filtro. IA segue desativada. Cloudflare reservou7200/8500 neurônios em23/09 na última consulta.

Tipos, lint,8 unitários e build passaram após implementação inicial. E2E sobre build:10 passaram,1 falha em redirect aluno /admin,1 IA pulado; correção feita, nova execução pendente. Produção antiga intacta. PDF final do Claude em Downloads revisado visualmente; atualizar após mudança efetiva no site. Guia ainda sem upload no Drive por403 da pasta.

## Fechamento atualizado — prevalece sobre histórico abaixo
Produção antiga preservada. Nova versão NÃO publicada. Retomada exata em ../CONTEXTO.md. Autorização ampliada para múltiplas missões por dependência, priorizando estabilidade.

Validação final: build, lint66 arquivos, tipos, conteúdo, 8 unitários, 2 Python, audit zero e diff-check passaram. PEM_REAL_AUTH_TESTS=1 npm run test:e2e sobre produção local com IA off: 11 passaram, 1 IA pulado, 50,8s. Contas fictícias em Supabase real validaram ativação concorrente/expirada, login, admin, perfil, isolamento, compartilhamento/revogação/exclusão/desativação/logout. Fixtures removidas.

Perfil, admin, recuperação e redações no banco implementados; favicon corrigido. Contador dos dois dias implementado no início e ENEM. Nenhum aluno real/admin definitivo cadastrado. Credenciais locais presentes e conexões validadas, sem revelar valores.

Extração:185 PDFs/1868 páginas/2296 trechos;323 páginas exigem revisão/OCR. Piloto2docs/6embeddings indexado. IA falhou503 após um sucesso com fonte; feedback real não validado. Manter flags off. Ledger de orçamento aplicado remotamente.

Faltam transição login/progresso legado, preview Vercel, configuração de ambientes, revisão/commit/CI e rollback. Vercel produção READY baseline5e1982b consultada com teamId vazio; equipe explícita403. Sem push/deploy.

Guia completo em GUIA-PROFESSOR.txt. Upload para pasta correta do Drive recusado403 insufficientParentPermissions; guia somente local. Recursos futuros identificados como planejados.

## Histórico anterior

Entrada curta: CHECKPOINT.md. Uma missão por entrega; backlog em tasks/todo.md.

Produção pem-monarcas.vercel.app intacta. Next.js somente local, branch codex/plataforma-estudos. Código anterior ainda contém alterações não commitadas; conferir git status.

Últimas verificações registradas: typecheck, build, baseline, quatro testes unitários, quatro E2E e dois testes Python passaram; npm audit sem vulnerabilidades. Screenshots desktop/mobile conferidos em ../analise/pem-*.png.

P07a entregue: migração 002 revogou grants padrão amplos. Teste SQL com duas identidades sintéticas passou para isolamento, proteção de papel, compartilhamento, revogação e desativação. Fixtures desfeitas por rollback. Relatório: MISSAO-P07a.md. Autenticação ponta a ponta ainda não validada.

Supabase PEM jfvfckkulpcqvhkjwgvy, migrações 001 e 002 aplicadas. Chave secreta/HMAC pendentes; nenhum aluno provisionado. IA não operacional; endpoints protegidos retornam indisponibilidade. Nenhuma promoção na Vercel.

Extração privada com checkpoint: 58 documentos/508 páginas/zero erros no último índice conferido. Não confundir extração com revisão ou RAG pronto. Ver ../analise/acervo/extracted/index.json antes de retomar.

P08a concluída em 22/09/2026. Próximas missões permanecem no Kanban; P09/P11 dependem da configuração das contas.

### Evidências P08a

- Alterações: somente tests/e2e/p08a.spec.ts, CHECKPOINT.md, docs/STATUS.md e tasks/todo.md. Nenhuma falha funcional encontrada no escopo; código anterior preservado.
- Ambiente: Next dev em http://localhost:4180, Playwright com Edge/Chromium, 1280×844 e 390×844. Browser plugin not available; usada a suíte Playwright existente conforme a skill frontend-testing-debugging.
- Fluxo: demonstração → Matemática → primeira aula → nota sintética com acentos e duas linhas, marcação e resposta → material estudado → reload → início → Continuar → reload → download. JSON baixado e lido do disco: nome, formato, data válida e progresso integral iguais ao armazenamento, sem notas de outros acessos.
- Isolamento: chaves locais sintéticas de aluno/legado não lidas nem sobrescritas; nenhuma chamada a /api/progress ou /api/essays pela demo; novo contexto de navegador sem progresso. Os testes existentes também confirmaram recusa de APIs privadas e IA sem autenticação.
- QA: título/URL corretos, conteúdo visível, sem overlay de erro, sem overflow horizontal na aula. Screenshots desktop/mobile inspecionados: ../analise/p08a-1280.png e ../analise/p08a-390.png (fora do repositório).
- Console: 404 de /favicon.ico confirmado e excluído explicitamente da asserção; pendência cosmética fora do escopo. Nenhum outro erro de console ou pageerror no fluxo P08a.
- Comandos aprovados: npm run typecheck; npm test (4/4); npm run check:content; npm run test:e2e (6/6, 18,7 s). Screenshots opcionais com PEM_QA_SCREENSHOT_DIR=../analise. Não houve dependência nova.
- Durante a preparação: primeira execução atingiu 30 s pela compilação fria; o teste também recarregava antes de concluir a navegação de Continuar. Corrigida a sincronização do teste com URL e nota visível antes do reload; execução final integral passou.
- Limites: não valida sincronização/autenticação de contas reais nem isolamento de segurança entre pessoas que compartilham o mesmo perfil de navegador. A demo usa um espaço local comum nesse perfil. Build não repetido (nenhuma alteração no aplicativo); Firefox/Safari não testados. Nada publicado.
- Commit da missão: `test: verify P08a local persistence export and demo isolation`; implementação anterior não commitada continua fora desta entrega.
