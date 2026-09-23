# Retomada exata — 23/09/2026
## Foco vigente — P16/P17 antes do release gate
Usuário decidiu aproveitar a cota avançando produto/acervo; P25/P26 continuam indispensáveis imediatamente antes de qualquer publicação e P15 final vem com a versão publicada. P16 parcial: script `scripts/build-curriculum.mjs` conferiu 22 capturas, 183 títulos e o gráfico de incidência do Assad. Mapa privado fora do Git com 165 grupos na ordem visível de estudo, 146 vínculos diretos, 37 pendências e 30 incidências diretas atribuídas ao Assad (estimativas até ENEM 2025, não dados oficiais do Inep). Trimestre da turma não se aplica a este mapa; pré-requisitos propostos aguardam validação. `docs/MAPA-CURRICULAR.md`. P17 é o próximo foco. Kanban 14/26, 12 abertas; produção antiga preservada.

## Estado vigente — P07 concluída; próximo P25/P26
Auditoria final Astra médio encontrou falta de consulta à lista ativada na função RLS de admin. Migração `20260923163411_require_activated_admin_allowlist.sql` aplicada e testada: sem lista/ativação, revogado ou desativado não lê os demais perfis, inclusive com o mesmo JWT. SQL red/green, E2E real ampliado em 53,1 s, tipos/lint passaram. Isolamento e visibilidade de documentos/busca cobertos. Zero fixtures; 41 alunos e dois admins preservados. Nomes das cinco migrações locais alinhados ao histórico remoto após hashes iguais. `docs/REVISAO-P07.md` contém escopo e limites. Kanban **14/26 completas, 12 abertas**. Preparação P25/P26 no Sol médio; Astra alto para decisão final. Aviso de senhas vazadas desativado continua em P25. Produção antiga e IA off; guia PDF só atualizar após publicação efetiva.

## Estado vigente — revisão UI concluída; P07 requer auditoria final
GPT-6 Sol médio corrigiu ajuda do login, CTA público do professor, avatar no cabeçalho e fonte oficial do cronograma ENEM. Tipos/lint/build, cinco E2E focados e 12 capturas desktop/mobile passaram; relatório em `docs/REVISAO-UI-P04-P08.md`. P07 teve catálogo/advisors e SQL ampliado com rollback: 12 tabelas públicas com RLS, zero SELECT anônimo, admin não lê progresso/redação alheia; E2E real passou e não deixou fixtures. Relatório em `docs/REVISAO-P07.md`. Commit `8da1700` enviado; CI remoto e status Vercel verdes, sem QA da prévia. P07 continua aberta para auditoria final GPT-6 Astra médio. Kanban 13/26, 13 abertas. Produção antiga preservada; IA off; guia PDF aguarda versão publicada.

## Estado vigente — QA P04/P05/P06/P08 concluído
Conteúdo/baseline e 25 links passaram; 11 unitários; regressão E2E 11 passaram, IA real pulada. Demonstracão, guia, oficina de redação e P08a em desktop/mobile passaram em fluxos; capturas revisadas sem overflow/erro visível. Kanban 13/26 concluídas, 13 abertas. Próxima tarefa: revisão UI e comportamentos no GPT-6 Sol médio, solicitada pelo usuário; P07 requer depois Sol alto e Astra médio. Produção antiga mantida. Capturas locais em `%TEMP%\pem-qa-p04-p08`.

## Estado vigente — P13/P14 corrigidas
Migração antiga vinculada pela matrícula autenticada e confirmação do servidor legado; a chave presente no navegador só é aceita se corresponder à chave confirmada. Originais preservados; importação bloqueada durante conflito. Redações paginadas e exportação de 201 versões verificada no Supabase real, inclusive falha da segunda página. Tipos/lint/build, 11 unitários e regressão E2E: 11 aprovados, IA real pulada por estar off. Kanban 9/26 concluídas, 17 abertas. Próximo P04/P05/P06/P08 com Luna médio no QA e Sol médio em correções. Produção antiga preservada. Relatório de revisão e resolução em `docs/REVISAO-P13-P14.md`.

## Estado anterior — revisão P13/P14 exigia correções (resolvido acima)
P13/P14 foram reabertas: migração por chave única no navegador não comprova o titular; exportação omite redações além das 200 carregadas. Inferência insegura já retirada; originais preservados. Contas Supabase só poderão importar após vínculo verificável no servidor. Tipos/lint/build e E2E real de contas (43,7 s) passaram após mitigação. Relatório completo e critérios restantes: `docs/REVISAO-P13-P14.md`. Kanban corrigido: 7/26 concluídas, 19 abertas. Próximo: Sol médio nas correções, revisão dirigida, depois QA no Luna. Não promover produção nem interpretar os marcos antigos abaixo como aprovação atual.

## Último marco — P14 fechada
P14 passou no Supabase real: versão persistida, download JSON inspecionado, isolamento, compartilhamento autenticado e revogável entre duas contas, destinatário impedido de excluir e exclusão pelo dono. A API retorna 404 quando o texto não pertence ao solicitante. Build, tipos e lint verdes; regressão completa com 11 E2E aprovados em 1,1 min e IA real pulada. Kanban 9/26, 17 abertas. Próximo passo: revisão conjunta P13/P14 no GPT-6 Astra médio; depois P04/P05/P06/P08.

## Marco anterior — P13 fechada
P13 passou no Supabase real: sincronização e isolamento entre duas contas, conflito preservando a cópia local, perfil/avatar após reload, logout e importação explícita do único conjunto legado do navegador para a conta autenticada. Originais permanecem intactos, há limite de 200 KB e marca contra repetição. Build, tipos e lint verdes; regressão completa com 11 E2E aprovados em 1,1 min e IA real pulada por estar off. Kanban 8/26, 18 abertas. Próximo foco P14 no GPT-6 Sol médio; depois revisar P13/P14 no Astra médio.

## Marco anterior — P12 fechada
Painel admin passou em E2E real (35,4 s): lista 41 alunos reais + 2 fixtures temporárias, todas com nome/turma 3A DS, contagem e estado ativado, busca, recuperação e emissão/ocultação de código. Aluno/público bloqueados, admin sem progresso de aluno e zero fixtures restantes. Typecheck/lint verdes. Kanban 7/26 concluídas, 19 abertas. Próximo foco P13 com GPT-6 Sol médio; ativação pessoal dos dois responsáveis depende da senha escolhida por cada titular.

## Último marco — P11 fechada
P11 passou integralmente em E2E real (35,8 s) e está marcada concluída: corrida de ativação, expiração, código inválido/uso único, não enumeração, rate limit, recuperação e troca de senha. A primeira ampliação do teste revelou timeout do próprio Playwright; corrigidos limites individuais e limpeza com tempo reservado. Banco confirmado com zero fixtures sintéticas. Typecheck/lint verdes; regressão completa 11 E2E aprovados em 55,6 s e IA real pulada por estar off. P10 também concluída após CI/proteção da main. Kanban: 6 de 26 completas, 20 abertas. Próximo foco P12; usar GPT-6 Sol médio. Matriz completa Luna/Sol/Astra em tasks/todo.md.

## Estado mais recente — prevalece sobre o histórico abaixo
Branch `codex/plataforma-estudos` publicada em `1b8bd39`, PR draft #1 e CI `PEM quality` verde. Preview Vercel criado, mas acesso pelo conector negado; produção no baseline antigo `5e1982b`. 41 alunos 3A DS e dois administradores com contas distintas provisionados. Quatro códigos privados em `../analise/codigos-acesso-inicial-20260923.json`, expiração 24/09 00h14 Brasília. Nenhuma conta ativada. E2E de separação aluno/admin passou após correção do redirecionamento. Última correção local: filtro de fontes da IA, tipos/lint/9 unitários/build verdes; ainda falta teste real e publicação dessa correção na branch. IA desligada. PDF do professor revisado localmente, Drive 403.

## Continuação 23/09 — prevalece sobre o registro anterior
Marco posterior: redirect corrigido e E2E de contas separadas passou 1/1. Dois administradores definitivos provisionados após teste, além de41 alunos; banco confirmou2 admin e4 códigos pendentes. Códigos privados em ../analise/codigos-acesso-inicial-20260923.json, expiração 24/09 00h14 Brasília; jamais imprimir ou commitar. Usuário e Erick ainda precisam ativar separadamente conta aluno/admin. Nenhum outro estudante recebeu código. Script de admin não inclui matrículas no repositório. Próximo: revisão de arquivos públicos, CI em branch, preview, testes da atualização; IA off até teste real do filtro de fonte e redação.
Usuário pediu continuar implementações antes de estabilizar/publicar. PDF final do Claude em Downloads revisado (7 páginas, layout legível); será atualizado depois da atualização real do site. Backup.alunos.json em Downloads contém 517 registros sensíveis; somente41 de 3A DS foram projetados para nome/turma/matrícula e importados. Supabase confirmado:41 distintos/41 nomes/0 ativados. Migração separate_admin_access aplicada. Usuário quer duas pessoas com logins separados de aluno e admin; ambas constam no roster. scripts/provision-admins.mjs dry-run passou; aplicação real ainda não feita. O arquivo de códigos deve ficar em ../analise, nunca no repo/chat.
Login aluno faz roster lookup e usa backend legado para não cadastrados; teste fictício sem roster obteve401 do legado. Rotas/GUI admin separadas em implementação. Typecheck/lint/8 unitários/build passaram. Última E2E:10 passaram,1 falhou por redirect de aluno /admin para /; corrigido para /estudar, repetir teste. IA: normalização de citações fez pergunta real com fonte passar; pergunta sem base ainda retornou fonte irrelevante. Filtro lexical+semântico adicionado sem teste real. Flags IA off. Orçamento em 23/09:7200/8500 neurônios na última consulta. Código/produção ainda sem novo commit/deploy. Ler status atual antes de assumir.

Resultado final do envio do guia: upload falhou403 insufficientParentPermissions na pasta correta. Guia permanece local. Resolver escrita na pasta, enviar e verificar antes de anunciar disponibilidade no Drive.

## Decisão final desta sessão
Usuário autorizou todas as missões por dependência, mas priorizou estabilidade e organização ao chegar ao fim da cota. NÃO publicar se houver bloqueios. Produção continua antiga: https://pem-monarcas.vercel.app. Nova versão Next somente local, build validado, IA desligada. Não afirmar estabilidade absoluta.

## Estado verificado
- Branch codex/plataforma-estudos; último commit de missão anterior 8b984cc (P08a). A migração completa e os recursos seguintes estão no working tree, inclusive arquivos novos. Não apagar nem reiniciar. Conferir git status.
- Build de produção passou. Sobre npm start com AI_TUTOR_ENABLED=false e AI_ESSAY_ENABLED=false: PEM_REAL_AUTH_TESTS=1 npm run test:e2e → 11 passaram, 1 IA pulado, 50,8 s. Teste IA pulado NÃO significa aprovado.
- npm run lint: 66 arquivos; typecheck; npm test: 8; check:content; npm audit --omit=dev: zero; Python unittest: 2. Todos passaram. git diff --check sem erros.
- Contas reais com usuários fictícios no Supabase: ativação concorrente/expirada, login, admin, perfil, isolamento, compartilhamento/revogação/exclusão, desativação e logout passaram; fixtures removidas pelo finally.
- Favicon corrigido. Redação tolera armazenamento inválido/falhas, salva no banco para contas pessoais, compartilha/revoga. Perfil, recuperação e painel admin implementados.
- Contador já existe no início e ENEM: 08/11/2026 e 15/11/2026, calendário de Brasília, atualiza a cada minuto; testes unitários de virada/zero passam.

## Bloqueios antes de publicar
1. Login com Supabase configurado usa exclusivamente contas novas; a turma real ainda não foi provisionada. Não habilitar isso em produção e bloquear os acessos antigos por acidente. Falta validar compatibilidade/migração do login legado e progresso.
2. Fazer preview no projeto existente, conferir configuração/ambientes, login, conteúdo e retorno à versão anterior; só então promover. Não criar outro projeto/domínio.
3. Revisar arquivos públicos e segredos, registrar commit reproduzível; CI/proteção de branch e ensaio de rollback ainda pendentes.

## Hospedagem e acesso
Vercel projeto prj_l8X1waA0KpAQwvzknsAxtzSFhMQz, equipe team_jpNwcILNH2qic19yGxtMQ1lc. list_teams veio vazio. list_projects e list_deployments funcionam com teamId=""; com equipe explícita retorna 403. get_project tem incompatibilidade de schema (espera idOrName internamente). Não concluir que toda conexão está indisponível.
Produção confirmada READY: dpl_65QCMoeuWgmEfoKiu7XH16kpDPYe, commit 5e1982b513194d7699af168315542ad8e394a1cb, main, marcado rollbackCandidate. Nenhum push/deploy nesta sessão. Backend legado ainda necessário: https://pem-monarcas-estudos.tacyohenrique07.chatgpt.site.

## Credenciais e turma
Todas as seis variáveis necessárias estão presentes em .env.local; conexões privilegiada Supabase e modelos Cloudflare passaram. Não imprimir valores. HMAC gerado localmente e deve ser preservado. Nenhum aluno real/admin definitivo criado. Falta usuário indicar arquivo correto dos 41 alunos 3A DS e administrador. scripts/provision-students.mjs usa dry-run por padrão e arquivo fora do repo. Não escolher pessoas por inferência.

## IA: ponto exato da falha
- 185 PDFs, 1.868 páginas, 2.296 trechos, 323 páginas exigem revisão/OCR; zero erros de extração/duplicatas SHA. Fora do repo: ../analise/acervo/extracted/index.json.
- Piloto privado ../analise/acervo/review/pilot-reviewed.json: 2 PDFs, 6 páginas revisadas visualmente. scripts/index-reviewed.ts executado: 2 documentos, 6 embeddings bge-m3 de 1024 dimensões no Supabase. Cache privado ao lado do arquivo. Originais não publicados.
- Cloudflare llama-3.1-8b-instruct para geração. Primeiro teste respondeu com fonte e idempotência correta; chamadas seguintes retornaram 503. Último log seguro: AI request failed: Error. Causa ainda NÃO identificada: instrumentar etapa sem registrar prompts/segredos. Não continuar repetindo chamadas sem diagnóstico.
- Feedback de redação real ainda não passou. Nenhum benchmark de 30 perguntas concluído. Deixar AI_TUTOR_ENABLED e AI_ESSAY_ENABLED false.
- Migração 20260922213627_ai_budget_ledger.sql aplicada via ferramenta; agrega reservas que sobrevivem à exclusão de fixtures. Limite local 8500 neurônios/dia; reserva 800 por chat/redação, 20 por embedding. Consultar saldo antes de novos testes; falhas não reembolsadas. Não contornar cotas ou ativar pagamento.
- Arquivos: ai-provider.ts, ai-validation.ts, server/generation.ts, APIs chat/review, tests/ai.test.ts, tests/e2e/ai-real.spec.ts. Teste real opt-in PEM_REAL_AI_TESTS=1; servidor precisa flags true somente para teste controlado.

## Guia solicitado pelo usuário
docs/GUIA-PROFESSOR.txt: história da Ordem da Fênix, propósito, todas as áreas, roteiro de visita, acesso público visitante/monarcas da NOVA versão e roadmap. Futuros identificados como planejados, sem anunciar IA/simulado prontos. Nova versão ainda não publicada; guia explica essa diferença. Pasta Drive correta confirmada: 1lrIJeIJOaIbDXy7e8u0zuWW3F34b07C6. Há arquivo de acesso antigo na pasta: não reproduzir suas credenciais no Git nem substituir sem verificar. Consultar resultado do upload desta sessão/Drive antes de criar cópia duplicada.

## Próxima sequência
1. Ler CHECKPOINT, este contexto, STATUS, todo e git status.
2. Resolver transição do login/progresso legado e revisar candidato com IA off.
3. Commit público revisado, preview Vercel no mesmo projeto, QA público e rollback; promover só após passar.
4. Atualizar guia no Drive com disponibilidade verdadeira após publicação.
5. Provisionar turma/admin apenas após obter os dados corretos; depois curadoria/benchmark IA, mais questões e simulados.

Ambiente: Windows PowerShell; Node22. Python em C:/Users/Th7/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe. npm ci/build/start. Não misturar segredos, PDFs nem listas de alunos no repo. Servidor de validação parado ao fechar esta sessão; não presumir processos antigos ativos. Cota consultada no fechamento: 6% da janela5h e85% semanal restantes; valores mudam. Retomar pelo código e evidências, sem refazer o projeto.
