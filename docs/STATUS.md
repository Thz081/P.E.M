# Estado atual — 24/09/2026
## Publicação estável, segurança e guia
- Nova versão publicada em `https://pem-monarcas.vercel.app`; rollback conhecido no commit `5e1982b` e deployment `dpl_65QCMoeuWgmEfoKiu7XH16kpDPYe`.
- Release inicial `2681d52` seguida da estabilização da PR #2: CI verde, QA desktop/mobile e suíte final 10/10 no domínio oficial, zero 5xx/runtime, demo bloqueada em APIs privadas e IA. A oficina de redação agora impede cliques antes da hidratação.
- Supabase atualizado com limpeza de rate limits, cota de 500 versões/5 MB de redações por aluno e índices de consulta. Teste transacional confirmou bloqueio da 501ª versão; migrações locais e remotas alinhadas.
- Segurança: mensagens de login/compartilhamento uniformizadas, throttle de login e compartilhamento, senha forte no primeiro acesso e escolha para apagar a cópia local ao sair.
- Regressão: tipos, lint, conteúdo, 11 unitários, 8 Python, audit, build, 10 E2E públicos e E2E real de contas aprovados. IA real continua desligada.
- Guia final do professor com 9 páginas revisado visualmente e entregue no Drive do P.E.M, substituindo o TXT antigo no mesmo arquivo, com login de demonstração e roteiro completo. Kanban em 17/26.

## Histórico de 23/09/2026
## P16 em andamento; prioridade de publicação movida para depois das funcionalidades
Mapa privado de 22 capturas, 165 grupos e 183 PDFs: 146 vínculos diretos, 37 lacunas, ordem visível de estudo, 30 incidências diretas do gráfico do Assad (estimativas, não dados oficiais) e 11 tópicos suplementares do mapa de progresso. Há 29 referências suplementares a PDFs pendentes (26 propostas de Redação) e 8 sem referência. Pré-requisitos são propostas para validação. Relatório `MAPA-CURRICULAR.md`. P25/P26 permanecem bloqueio obrigatório antes de promover produção; P15 final acompanha a versão publicada. Kanban 14/26.
P17 começou com fila privada e reproduzível de 323 páginas para revisão visual/OCR; 183 em Biologia. Ver `TRIAGEM-P17.md`.
Piloto P17: 12 capas/divisórias conferidas visualmente e retiradas da fila; OCR seletivo aplicado em 25 páginas de Biologia, com 24 aguardando conferência e uma marcada para corrigir fórmulas. Fila atual 311, incluindo 286 sem tentativa. Trechos privados continuam `authorized: false`. Ver `TRIAGEM-P17.md`.

## P07 concluída após correção de autorização
RLS de admin agora exige lista ativada, como a API; revogação vale mesmo com token existente. Falha reproduzida, migração aplicada e SQL/E2E real ampliados passaram (53,1 s), assim como tipos/lint. Documentos/busca e metadados de aluno também verificados; zero fixtures, 41 alunos e dois admins preservados. Migrações locais alinhadas ao histórico remoto por hash. Relatório `REVISAO-P07.md`. Kanban **14/26, 12 abertas**; P25/P26 seguem como porta antes da publicação. Aviso de senhas vazadas desativado permanece em P25. Produção antiga intacta.

## Revisão adicional concluída; P07 em auditoria
Login/professor/avatar/fonte ENEM corrigidos e verificados em desktop/mobile, cinco E2E focados, tipos/lint/build. P07: 12 tabelas públicas com RLS, nenhuma leitura anônima, isolamento SQL e E2E real passaram; falta auditoria final Astra médio. Advisor sinaliza proteção contra senhas vazadas desativada para P25. Commit `8da1700` enviado; CI remoto e status Vercel passaram, sem QA da prévia. Relatórios: `REVISAO-UI-P04-P08.md` e `REVISAO-P07.md`. Kanban 13/26; produção antiga preservada.

## QA P04/P05/P06/P08 concluído
Baseline/conteúdo preservado; 25 links conferidos; 11 testes unitários e 11 E2E passaram. A IA real foi pulada porque está desligada. Fluxos de demonstração, professor, oficina de redação e persistência/exportação/isolation foram verificados em desktop e mobile; as capturas foram revisadas sem overflow ou erro visível. Kanban 13/26 concluídas, 13 abertas. Revisão adicional de UI/comportamentos fica para GPT-6 Sol médio conforme pedido. Screenshots fora do repo em `%TEMP%\pem-qa-p04-p08`.

## P13/P14 corrigidas após revisão
Vínculo da migração verificado pelo servidor legado a partir da matrícula da conta Supabase; chave alheia recusada. Paginação por ID e exportação de 201 versões testadas no Supabase real; erro na segunda página não gera arquivo parcial. Tipos/lint/build e 11 testes unitários verdes; regressão 11 E2E aprovados e IA real pulada por estar off. Kanban: 9/26 concluídas, 17 abertas. Produção antiga preservada; próximo P04/P05/P06/P08.

## Revisão anterior: alterações necessárias em P13/P14 (resolvidas acima)
Conclusões anteriores superadas. P13 reaberta por migração sem prova de titularidade; P14 reaberta por exportação truncada em 200 versões. Descoberta insegura de chave local removida, importação depende de identidade antiga autenticada e originais preservados. Tipos/lint/build passaram; E2E real de contas passou em 43,7 s após mitigação. O caso de 201 redações segue pendente. Contagem: 7/26 concluídas, 19 abertas. Próximas correções no Sol médio descritas em `REVISAO-P13-P14.md`; produção permanece antiga.

## P14 concluída
Redações privadas validadas no Supabase real: versão no banco, download JSON com conteúdo conferido, isolamento, compartilhamento e revogação entre duas contas, bloqueio de exclusão pelo destinatário e exclusão pelo dono. A API retorna 404 quando o texto não pertence ao solicitante. Build, tipos e lint passaram; regressão completa teve 11 E2E aprovados em 1,1 min e somente IA real pulada. Kanban: 9/26 concluídas, 17 abertas. Revisão conjunta P13/P14 no Astra médio vem antes de P04/P05/P06/P08.

## P13 concluída
Perfil e persistência validados em E2E real: sincronização e isolamento entre contas, conflito sem sobrescrita da cópia local, apelido/avatar após reload, logout e importação explícita do único conjunto legado detectado no navegador. Os dados antigos são preservados; a importação tem limite de 200 KB e marca contra repetição. Build, tipos e lint passaram; regressão completa teve 11 E2E aprovados em 1,1 min e somente IA real pulada por estar desligada. Kanban: 8/26 concluídas, 18 abertas.

## P12 concluída
Painel administrativo validado em E2E real: lista completa da 3A DS (41 registros reais + 2 fixtures durante o teste), nomes/turma, estado e contagem de ativação, busca, pedido de recuperação, geração e ocultação de código. Aluno/público recebem 403 e admin não usa progresso de aluno. Teste passou em 35,4 s; zero fixtures ao final; tipos e lint passaram. Kanban: 7/26 concluídas, 19 abertas.

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
