# P.E.M — entrada para Codex ou Claude
## Estado confirmado até 24/09/2026 às 09:51 (Brasília)
### Entrega estável, PDF sem data e próximo ciclo
- Produção atualizada no domínio `https://pem-monarcas.vercel.app`. A release inicial foi `2681d52`; a estabilização posterior da oficina de redação e do teste remoto entrou pela PR #2. O `main` atual está publicado e passou a suíte no domínio oficial. Rollback preservado: commit `5e1982b`, deployment `dpl_65QCMoeuWgmEfoKiu7XH16kpDPYe`.
- P25/P26: relatório de segurança concluído antes da publicação. Cinco achados da candidata anterior foram tratados: criação ilimitada de buckets, redações sem cota, enumeração por mensagens, senha inicial fraca e cópia local após logout. Migrações remotas `20260923235816_release_security_limits` e `20260923235909_release_query_indexes` aplicadas.
- Evidência local final: tipos, lint, conteúdo, 11 unitários, 8 testes Python, audit com zero vulnerabilidades, build e 10 E2E públicos passaram; IA real ficou pulada/desligada. E2E real de contas passou em 55,3 s e cobriu senha fraca, ativação concorrente, login separado, admin, RLS, perfil, progresso, redações, compartilhamento, recuperação, revogação e limpeza local.
- Evidência remota: CI `quality` verde; produção READY; desktop e mobile conferidos; roteiro com 9 etapas; contador 45/52 em 24/09; sem overflow, 5xx ou erros de runtime. A suíte final no domínio oficial ficou 10/10 verde, com contas reais e IA opt-in puladas; corrigiu-se a origem fixa do teste e um clique que podia ocorrer antes da hidratação na oficina de redação.
- P15: `docs/GUIA-PROFESSOR.txt` e PDF final correspondem à versão pública. Às 09:50 de 24/09, o PDF foi atualizado sem data na capa, conferido em 9 páginas e reenviado ao mesmo arquivo no Drive (355 KB), substituindo a versão datada e preservando o link/ID. O guia orienta “Explorar demonstração” ou `visitante` / `monarcas`, descreve o que existe e separa claramente IA, OCR, questões extras e simulado planejados.
- Supabase permanece com 41 alunos reais e duas identidades administrativas separadas; nenhuma fixture sintética ficou no banco. A proteção de senhas vazadas é recurso de plano pago e segue indisponível; a aplicação exige 12 caracteres com maiúscula, minúscula, número e símbolo.
- Kanban: **17/26 concluídas, 9 abertas**. Próximo bloco é P16/P17. IA permanece desligada até P18–P21 passarem por curadoria e benchmark reais.

### Análise do que falta e plano da próxima semana
O release estável do site e a entrega do guia estão concluídos; isso não significa que o backlog de produto acabou. Permanecem nove missões: P16 mapa curricular (37 vínculos pendentes e revisão de pré-requisitos/categorias); P17 OCR (fila 311 páginas, 286 sem tentativa, 24 já processadas aguardam inspeção e uma precisa corrigir fórmulas); P18 curadoria/índice e benchmark de 30 perguntas; P19 tutor com fontes e segurança contra injeção; P20 feedback de redação; P21 fallback gratuito; P22 mais 40 questões revisadas; P23 simulado; P24 relatório PDF.

Ordem recomendada para a próxima semana: (1) fechar a revisão pedagógica de P16 sem inventar vínculos; (2) continuar P17 em lotes retomáveis, conferir visualmente cada OCR e manter textos privados fora do Git; (3) iniciar P18 somente com páginas/fontes autorizadas e criar/rodar o benchmark de 30 perguntas; (4) decidir P19/P20 com base no benchmark e em diagnóstico do 503 já observado, mantendo a IA desligada até aprovação real; (5) avançar P22 em paralelo apenas se as fontes do caderno estiverem disponíveis e cada questão puder ser revisada; (6) planejar P23/P24 após regras, conteúdo e aceite do simulado estarem definidos. P21 só entra se houver provedor permitido e orçamento gratuito confirmado. Não prometer concluir as nove na semana: P17 ainda tem centenas de páginas a revisar.

Modelo/cota: Luna médio para classificação, lotes e documentação; Sol médio somente para OCR ambíguo, revisão pedagógica ou depuração; Astra apenas diante de questão crítica de segurança/arquitetura. Com 6% da janela de 5 horas e 7% semanal informados pelo usuário, esta sessão limita-se à análise e sincronização de contexto. Não fazer ingestão em massa nem chamadas reais pagas à IA neste ciclo.

Pedido posterior para a próxima semana: reposicionar o produto como plataforma de estudos ENEM, retirar do site a narrativa/identidade da Ordem da Fênix e a Taça, remover a visita guiada para professores e preservar a demonstração do estudante visitante. Antes de apagar, inventariar rotas, links, assets, dados e documentação; preservar histórico interno e avaliar migração/backup. Também ampliar bastante o conteúdo por matéria, aprofundar resumos e substituir o “resumo gráfico” incompleto de WhatsApp por material original ou autorizado. Ferretto é referência de formato, não autorização de cópia.

Operação pendente, fora da contagem de missões: cada um dos dois responsáveis precisa ativar por conta própria seus logins separados de aluno/admin e escolher as próprias senhas. O plano Supabase Free não oferece verificação de senhas vazadas; a senha forte obrigatória é a mitigação disponível. Não há teste real de tutor/feedback aprovado e IA segue desligada.

Este bloco prevalece sobre as próximas ações descritas nos marcos datados abaixo. As seções antigas são histórico da execução e não representam tarefas atuais quando contradizem este estado.

## Atualização de prioridade em 23/09/2026 — acervo antes da publicação
- A pedido do usuário, P25/P26 passam a ser a porta de segurança/publicação depois de avançar nas funcionalidades; P15 recebe revisão final da versão publicada. Isso não dispensa preview, rollback nem autorização real antes de promover.
- P16 em andamento: `scripts/build-curriculum.mjs` leu 22 imagens de organização, 183 títulos de PDFs, gráfico de incidência e mapa de progresso do Assad. Mapa privado em `../analise/acervo/curriculum-map.json`: 165 grupos em ordem visível de estudo, 146 vínculos diretos, 37 pendências, 30 correspondências diretas com incidência e 11 tópicos suplementares de progresso. Esses tópicos referenciam 29 PDFs pendentes (26 propostas de Redação, 3 de Linguagens/História); 8 ainda sem referência suplementar. Não há trimestre da turma; propostas e pré-requisitos aguardam revisão. Evidência em `docs/MAPA-CURRICULAR.md`. Kanban continua 14/26.
- Verificação P16: duas execuções do gerador produziram SHA-256 idêntico `95b28d27ebba6dc1bd85ed6b4c9119d1fe3527bd3378fbada06394f81ca1e304`; `node --check`, lint e `git diff --check` passaram. Os arquivos privados continuam fora do Git. P16 e P17 não foram fechadas.
- P17, linha de base: `scripts/build-ocr-queue.mjs` conferiu índice e arquivos extraídos e gerou fila privada e determinística inicial de 323 páginas, sem textos originais no Git. Biologia concentrava 183. Relatório `docs/TRIAGEM-P17.md`.
- P17 avançou com OCR seletivo real: Poppler/Tesseract português em WSL, 12 capas/divisórias revisadas e retiradas da fila; 25 páginas de Biologia processadas, 24 aguardam conferência visual e uma precisa corrigir fórmulas. Fila atual 311 (286 sem tentativa). `apply_ocr_review.py` mantém página/trechos/índice coerentes; `confirm_ocr_review.py` exige decisão visual. Seis testes sintéticos, lint e reconstrução real da fila passaram. Fonte continua privada e não autorizada para IA. Detalhes `docs/TRIAGEM-P17.md`; P17 aberta.

## Marco de 23/09/2026 — P07 concluída após auditoria final
- Astra médio encontrou divergência: a API exigia admin na lista ativada, mas RLS aceitava somente o papel. Corrigida por `20260923163411_require_activated_admin_allowlist.sql`, aplicada no Supabase PEM. Teste reproduziu a falha antes e passou depois; revogação funciona com token ainda válido.
- SQL ampliado e E2E real (53,1 s) passaram: isolamento, privilégio de admin, metadados sem escalada, docs/trechos/busca autorizados e conta desativada. Tipos/lint passaram. Zero fixtures; 41 registros de aluno e duas contas admin preservados. Cinco migrações locais alinhadas às versões remotas após conferir hashes do conteúdo. Relatório: `docs/REVISAO-P07.md`.
- Kanban **14/26 concluídas, 12 abertas**. P25/P26 são a porta obrigatória antes da publicação; preparar segurança, preview e rollback com Sol médio e reservar Astra alto para a decisão final, se necessário. Aviso de senhas vazadas desativado ainda pendente em P25. Produção antiga preservada e IA desligada. Não anunciar nova versão nem PDF atualizado.

## Marco de 23/09/2026 — revisão UI concluída; P07 em auditoria

- Revisão adicional P04/P05/P06/P08 com GPT-6 Sol médio concluída: ajuda do login separada, guia do professor encaminha à demonstração sem prometer upload no Drive, avatar imediato no cabeçalho, link oficial do Inep no contador. Tipos/lint/build, cinco E2E focados e revisão visual de 12 telas desktop/mobile passaram. Evidência: `docs/REVISAO-UI-P04-P08.md`.
- P07: catálogo do Supabase confirmou 12/12 tabelas públicas com RLS e zero SELECT para `anon`; teste SQL ampliado e executado com rollback passou isolamento, admin, compartilhamento, revogação e desativação. E2E real de contas passou; zero fixtures persistiram. Advisors têm avisos informativos de tabelas internas sem políticas e aviso de proteção contra senhas vazadas desativada, registrado para P25. P07 **ainda aberta** até auditoria final de autorização em GPT-6 Astra médio; detalhes em `docs/REVISAO-P07.md`.
- Commit `8da1700` enviado à branch; CI remoto `PEM quality` passou e o status Vercel do commit ficou verde. A prévia ainda não teve QA remoto. Kanban 13/26 concluídas e 13 abertas. Produção Vercel permanece no baseline antigo; IA real desligada. PDF na pasta PEM não deve ser anunciado como guia atualizado até a publicação e revisão correspondente.

## Marco de 23/09/2026 — QA P04/P05/P06/P08 concluído
- `npm run check:content`: baseline e contagens preservadas, 25 links e validações de questões/fontes ENEM passaram. `npm test`: 11 unitários passaram.
- Regressão Playwright: 11 E2E passaram em 1,2 min; IA real pulada por estar desligada. Cobriu contas reais sintéticas e RLS funcional, P08a desktop/mobile (persistência, exportação JSON, isolamento), navegação demo, proteção privada, responsividade, oficina de redação e guia do professor. Capturas revisadas em `%TEMP%\pem-qa-p04-p08`; sem overflow ou erro de renderização visível.
- Kanban principal: 13/26 concluídas, 13 abertas. P04/P05/P06/P08 marcadas somente após aceite verificado. Próximo passo recomendado pelo usuário: GPT-6 Sol médio para revisar e corrigir UI/comportamentos. P07 continua pedindo GPT-6 Sol alto e revisão Astra médio. Produção permanece no baseline antigo.

## Marco de 23/09/2026 — P13/P14 corrigidas e verificadas (estado vigente)
- P13: conta Supabase só descobre a chave antiga após consulta ao servidor legado com a matrícula da própria conta autenticada. Chave de outro aluno e chave arbitrária no navegador não autorizam importação. Original local preservado, persistência local confirmada antes da marca de importação e importação suspensa em conflito. Serviço antigo respondeu autenticamente para matrícula de teste real do titular (somente resultado booleano registrado, sem segredo).
- P14: lista/exportação paginadas por ID; E2E real inseriu 201 versões sintéticas, comprovou 200+1 páginas, 201 IDs únicos e 201 versões no JSON. Falha da segunda página mostra erro e não entrega exportação parcial. Compartilhamento, revogação e exclusão continuam cobertos.
- Validação: tipos, lint, build, 11 unitários e regressão E2E completa (11 passaram em 1,2 min; IA real pulada por estar desligada). Teste de contas limpou as fixtures. Kanban 9/26 concluídas, 17 abertas. Próximo bloco P04/P05/P06/P08, Luna médio para QA repetitivo e Sol médio para correções. Produção antiga preservada até P25/P26.

## Revisão anterior de 23/09/2026 — P13/P14 reabertas (resolvida no marco acima)
- A revisão de `eb3f2b7` encontrou dois casos não cobertos: importação de dados antigos sem prova de titularidade e exportação de redações truncada após 200 versões. Relatório e testes de aceite em `docs/REVISAO-P13-P14.md`.
- Correção imediata: removida a descoberta de identidade antiga no localStorage. Somente `legacyKey` autenticada pelo servidor pode selecionar dados; contas Supabase ficam sem importação até existir vínculo comprovado. Nenhum dado antigo foi removido.
- Validação da mitigação: tipos, lint e build passaram; E2E real de contas passou em 43,7 s, incluindo recusa de importação sem vínculo, preservação local, conflito, perfil e compartilhamento/exclusão. Não foi repetida a suíte inteira nem o caso de 201 redações. IA off; produção preservada.
- Contagem corrigida: 7/26 concluídas, 19 abertas. Próximo modelo: Sol médio para concluir as correções P13/P14, depois revisão dirigida; só então Luna médio para P04/P05/P06/P08. Marcas anteriores de conclusão estão superadas.

## Marco de 23/09/2026 — P14 concluída
- Redações privadas passaram no Supabase real: versão persistida, download JSON com conteúdo inspecionado, isolamento, compartilhamento/revogação entre duas contas, destinatário impedido de excluir e exclusão pelo dono. A API agora responde 404 quando o usuário não possui o texto solicitado.
- Build, tipos e lint verdes; regressão completa: 11 E2E passaram em 1,1 min e somente IA real foi pulada por estar desligada. Kanban: 9/26 concluídas, 17 abertas. Próximo passo é revisão conjunta P13/P14 no GPT-6 Astra médio; depois P04/P05/P06/P08.

## Marco de 23/09/2026 — P13 concluída
- Perfil e persistência passaram no Supabase real: sincronização e isolamento entre contas, conflito sem sobrescrever a cópia local, apelido/avatar após reload, logout e importação explícita do único conjunto legado detectado no navegador. A importação preserva os originais, limita o payload a 200 KB e grava marca contra repetição.
- Build, tipos e lint verdes; regressão completa: 11 E2E passaram em 1,1 min e somente IA real foi pulada por permanecer desligada. Kanban principal: 8/26 concluídas, 18 abertas. Próximo foco P14 no GPT-6 Sol médio; depois, revisão conjunta P13/P14 no Astra médio.

## Marco de 23/09/2026 — P12 concluída
- Painel admin passou no Supabase real: durante o E2E exibiu 41 alunos provisionados + 2 fixtures, todas as 43 linhas com nome e turma 3A DS; contagem de ativadas, busca, recuperação e código funcionaram. Aluno/público bloqueados, admin separado de progresso e zero fixtures ao final. Typecheck/lint verdes. A ativação pessoal dos dois responsáveis permanece como operação do titular.
- Kanban naquele marco: 7/26 concluídas, 19 abertas. O estado atual está no marco P13 acima.

## Marco de 23/09/2026 — P11 concluída e modelos por missão
- P11 concluída após E2E real (35,8 s): ativação concorrente/expirada/inválida, uso único, não enumeração, rate limit, recuperação, troca de senha, recusa da senha anterior e do código reutilizado. `playwright.config.ts` ganhou limites por ação/navegação/expectativa; o teardown reserva tempo e não deixa fixtures. Supabase confirmado com zero usuários sintéticos após o teste.
- Regressão final da etapa: 11 E2E passaram em 55,6 s; somente IA real pulada por estar desligada. P10 também concluída com CI/proteção da main verificadas. Kanban principal: 6/26 missões concluídas, 20 abertas. `tasks/todo.md` recomenda GPT-6 Luna para lotes/rotina, GPT-6 Sol para desenvolvimento e GPT-6 Astra para arquitetura/revisões críticas. GPT-6 Sol médio é a recomendação atual para P12/P13; preços de API não equivalem necessariamente à porcentagem da cota do Codex.
- CI do commit `eae78c2` passou e proteção de `main` está ativa. Mudanças de P11/modelos ainda precisam de commit/CI. Próxima missão: P12, sem promover produção antes de P25/P26.

## Estado verificado em 23/09/2026 — leia antes das notas históricas
- Branch `codex/plataforma-estudos`: migração pública commitada e enviada em `1b8bd39`; PR draft #1 aberto. CI `PEM quality` passou no GitHub. Preview Vercel criado, mas a leitura da URL pelo conector foi negada; QA de preview ainda pendente. Produção `pem-monarcas.vercel.app` segue no baseline antigo `5e1982b`.
- Turma 3A DS: 41 alunos importados com nome, turma e matrícula; dois administradores autorizados têm contas de aluno e admin separadas. Quatro códigos de ativação estão apenas no arquivo privado `../analise/codigos-acesso-inicial-20260923.json`, expiram 24/09 00h14 Brasília. Nenhuma conta ativada; outros 39 alunos ainda não receberam código.
- Correção do redirecionamento aluno em `/admin` validada em E2E real (1/1). Filtro de fontes do tutor passou em tipos, lint, 9 testes unitários e build; **teste real do filtro e feedback de redação continuam pendentes**. IA permanece desligada.
- Kanban principal: 4 de 26 missões fechadas por seus critérios completos; 22 ainda abertas, várias parcialmente implementadas. P07a/P08a são subetapas concluídas. Próxima etapa: publicar a correção de filtro na branch, repetir CI e testar preview com acesso antes de qualquer promoção.

## Atualização em andamento — 23/09/2026 (prevalece sobre 22/09 abaixo)
- Marco posterior: teste real de contas separado passou (1/1, 33,6s) após corrigir redirect /admin. scripts/provision-admins.mjs aplicado para as duas pessoas indicadas; Supabase confirma 41 alunos, 2 perfis admin, 2 códigos admin e 2 códigos aluno pendentes. Códigos em ../analise/codigos-acesso-inicial-20260923.json (privado, não imprimir/commitar), expiram 24/09 00h14 Brasília. Nenhuma conta ativada ainda. O usuário deve entregar a Erick apenas os códigos dele.
- Usuário autorizou avançar em mais funcionalidades antes de nova estabilização e publicação. Produção antiga permanece intacta; PDF final do Claude em C:/Users/Th7/Downloads/P.E.M - Guia para o Professor.pdf foi lido e revisado visualmente (7 páginas); atualizar só após o site mudar.
- Backup.alunos.json privado na pasta Downloads contém 517 registros de várias turmas e campos sensíveis. A importação filtrou SOMENTE 41 registros de 3A DS, projetando apenas nome/turma/matrícula. Migração 20260923030613_separate_admin_access.sql aplicada; Supabase confirmado com41 matrículas distintas,41 nomes,0 ativadas. Não copiar backup/senhas para o Git.
- Login agora roteia matriculas da nova lista para Supabase e outras para backend legado (quando habilitado). Teste com matrícula fictícia fora da lista recebeu resposta do legado. Acesso administrativo separado em implementação; usuário designou duas pessoas presentes na lista, mas códigos finais ainda NÃO emitidos.
- Teste real IA: resposta fundamentada com fonte passou; pergunta sem base revelou risco de citação irrelevante. Adicionado filtro que exige concordância de busca semântica e lexical; ainda NÃO testado ponta a ponta. IA off. Orçamento Cloudflare do dia23:7200/8500 neurônios reservados na última consulta; não repetir testes pagos até avaliar cota.
- Estado de teste após mudança admin: tipos/lint/8 unitários/build passaram. Suíte real com10 E2E aprovados,1 falha de redirecionamento aluno em /admin,1 IA pulado. Redirecionamento corrigido; repetição pendente. NÃO publicar antes disso.
- Falta script de dois acessos reais aplicar e validar depois do E2E; códigos de aluno/admin serão gravados somente em arquivo privado fora do repo, sem exibição. Restante do backlog continua em tasks/todo.md.

## Fechamento mais recente — prevalece sobre o histórico abaixo
- Retomada exata em CONTEXTO.md. Produção antiga preservada; nenhuma publicação/commit/push novo. Migração e recursos estão no working tree.
- Build de produção, lint66 arquivos, tipos, conteúdo, 8 unitários, 2 Python e audit zero passaram. Sobre npm start com IA off: 11 E2E passaram com contas temporárias no Supabase real, 1 teste IA pulado (não aprovado).
- Perfil/admin/ativação/recuperação/redações compartilháveis implementados e testados. Falta lista correta41 alunos e admin definitivo; não cadastrar por inferência.
- Favicon corrigido. Contador real dos dois dias ENEM já existe no início e ENEM, calendário Brasília.
- Piloto IA indexado: 2 documentos/6 embeddings. Chamadas de geração falharam503; feedback real ainda não validado. IA fica off.
- Bloqueios para publicação: transição do login/progresso legado, preview Vercel/ambientes, revisão pública/commit/CI e rollback. Vercel leitura funciona com teamId vazio; equipe explícita403. Produção baseline5e1982b confirmada READY.
- Guia completo docs/GUIA-PROFESSOR.txt pronto. Upload para pasta correta Drive falhou403 insufficientParentPermissions. Guia ainda apenas local; não anunciar envio concluído.

## Histórico da implementação
Atualizado em 22/09/2026. Leia este arquivo antes de alterar o projeto.

## Acordo de trabalho vigente
- Autorização ampliada em 22/09: seguir as implementações do Kanban por dependência, corrigir diretamente, testar e registrar cada etapa. Não limitar a execução à P08a.
- Respostas curtas, sem omitir dúvidas, limitações ou falhas relevantes.
- Não reiniciar o projeto nem reescrever tudo; o usuário não alterou os arquivos.
- Usuário renovou a cota; consulta de 22/09 mostrou 100% semanal e 98% da janela de 5 horas disponíveis (valores variam com o uso).
- Troca de ferramenta não ocorreu; este checkpoint permite nova conversa.
- Ao terminar cada missão, atualizar este arquivo, docs/STATUS.md e tasks/todo.md.
- Backlog completo: tasks/todo.md; plano: tasks/plan.md; protocolo: docs/HANDOFF.md.

## Produção e trabalho local
- Produção: https://pem-monarcas.vercel.app — preservar domínio, QR e conteúdo.
- GitHub: Thz081/P.E.M; branch local codex/plataforma-estudos.
- Baseline anterior: 5e1982b513194d7699af168315542ad8e394a1cb.
- Backup antigo: ../output/PEM-producao-baseline.zip, fora deste repositório.
- Nova versão Next.js ainda NÃO publicada; backend antigo continua necessário.
- Há implementação anterior não commitada: conferir git status antes de qualquer ação.
- Stack local: Next 16, React 19, TypeScript, Tailwind, shadcn, AI Elements.
- npm ci; npm run dev → http://localhost:4180. Node 22.
- Não enviar node_modules, .next, .env.local, PDFs ou dados de alunos em pacotes.

## Implementado e validado até aqui
- Conteúdo preservado: 46 aulas, 52 questões, 61 flashcards, 25 monitorias.
- ENEM: 9 etapas, 29 vídeos, 15 questões conferidas; contador com fonte Inep.
- Login redesenhado; MONARCAS; demo aluno/professor; leitura, notas e exportação.
- Redação: 8 lições e versões locais; ainda sem avaliação real por IA.
- Demo local: botão de visita ou visitante / monarcas; não é conta privada.
- P08a concluída: notas/progresso após reload, download JSON e isolamento demo validados em 1280×844 e 390×844. Nenhuma correção no aplicativo necessária.
- Verificações P08a: tipos, conteúdo, 4 testes unitários e 6 E2E passaram. Build passou na execução anterior; não repetido nesta missão de testes.
- Console P08a: 404 conhecido de favicon.ico, fora do escopo; nenhum outro erro nos fluxos testados. Detalhes em docs/STATUS.md.
- npm audit: zero vulnerabilidades na execução registrada; não substitui auditoria completa.
- Missão P07a: permissões SQL e RLS testadas com duas identidades fictícias e rollback.
- Teste tests/rls-isolation.sql passou: isolamento, papel, compartilhamento, revogação e desativação.

## Serviços e dependências
- Supabase PEM gratuito: jfvfckkulpcqvhkjwgvy; migrações 001 e 002 aplicadas.
- Nenhum aluno real provisionado. Usuário configurou service_role e Cloudflare no .env.local; HMAC foi gerado localmente. Conexão privilegiada Supabase e consulta de modelos Cloudflare passaram; não exibir valores.
- Segredos somente no ambiente; nunca no chat, Git, logs ou ZIP.
- Cloudflare conectado anteriormente, mas integração de geração/embeddings não pronta.
- IA está indisponível por decisão explícita; endpoints recusam visitantes e não inventam respostas.
- Manter orçamento gratuito, cotas, privacidade e fallback sem serviços pagos.

## Acervo e próxima missão
- Originais fora do código: ../CONTEUDOS FERRETO PARA ALIMENTAR IA e ../conteudos assad.
- Inventário: ../analise/acervo/manifest.json; 183 PDFs Ferretto, 22 imagens de organização.
- Extração privada retomável: scripts/prepare_acervo.py --manifest ../analise/acervo/manifest.json.
- Extração completa conferida: 185 PDFs (183 Ferretto + 2 outros), 1.868 páginas, 2.296 trechos, zero erros/duplicatas SHA; nova execução não reextraiu arquivos. Há 323 páginas sinalizadas para revisão visual/OCR.
- Extração NÃO significa revisão, OCR concluído, embeddings ou publicação autorizada.
- P08a entregue com tests/e2e/p08a.spec.ts; isolamento validado apenas com dados locais sintéticos e contextos separados, sem autenticação real.
- Trabalho em curso após P08a: favicon e robustez da redação corrigidos; painel /admin, recuperação, perfil e redações no banco implementados. E2E real com duas contas temporárias passou (ativação concorrente/expirada, login, admin, perfil, isolamento, compartilhamento/revogação/exclusão/desativação); fixtures removidas. Não confundir com importação da turma real.
- Piloto IA em implementação, ainda NÃO liberado: provedor Cloudflare, validação de citações/feedback sem nota e migração ai_budget_ledger aplicada. Lote privado revisado: ../analise/acervo/review/pilot-reviewed.json (6 páginas de 2 PDFs); ainda falta indexar e testar geração. Continuar a partir do código e logs de teste, atualizando STATUS/Kanban ao fechar etapas.
- Histórico longo opcional: ../CONTEXTO-COMPLETO-PEM.md; o código e testes prevalecem sobre textos antigos.
