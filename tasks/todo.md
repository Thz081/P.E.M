# Quadro de trabalho — P.E.M
## Estado atual — 23/09/2026

Contagem principal: 26 missões; **14 concluídas (P01–P14), 12 abertas (P15–P26)**. P13/P14 foram reabertas na revisão e fechadas após correção e testes reais; detalhes em ../docs/REVISAO-P13-P14.md. Subetapas não entram nessa contagem. Só fechar uma missão quando todos os critérios abaixo tiverem evidência; implementação parcial não equivale a entrega.

Atualização: revisão adicional UI concluída; auditoria final P07 no Astra médio encontrou e corrigiu falta da lista admin ativada na política SQL. Migração aplicada, SQL red/green e E2E real com JWT (53,1 s) passaram. Próximo bloco P25/P26, preparação no Sol médio e decisão final no Astra alto. Evidências em `../docs/REVISAO-UI-P04-P08.md` e `../docs/REVISAO-P07.md`.

Direção do usuário em 23/09: aproveitar a cota nas missões de produto antes da publicação. P25/P26 ficam como porta obrigatória da versão que for publicada; P15 recebe revisão final depois de fixar essa versão. Foco atual: P16/P17. P16 gerou mapa privado de 22 capturas, 165 grupos e 183 PDFs; 146 vínculos diretos, 37 pendentes, ordem visível de estudo e 30 incidências diretas do mapa do Assad. É estudo para ENEM, não trimestre da turma. Relatório em `../docs/MAPA-CURRICULAR.md`. A contagem de missões fechadas não mudou.

### Prioridade e modelo recomendado

Use o modelo mais leve que mantenha o critério de qualidade. `GPT-6 Luna` atende tarefas frequentes e bem delimitadas; `GPT-6 Sol` é o modelo principal para código e decisões do dia a dia; `GPT-6 Astra` fica reservado para análise profunda, arquitetura e aprovação de mudanças críticas. A recomendação segue o guia oficial de seleção da OpenAI e o catálogo vigente em 23/09/2026. Na API, GPT-6 Luna custa US$0,10/US$0,50 e GPT-6 Sol US$2/US$10 por milhão de tokens de entrada/saída; GPT-5.6 Sol custa US$4/US$20. O consumo percentual da cota do Codex pode usar outra métrica e não deve ser inferido diretamente do preço da API.

| Ordem | Missões | Prioridade operacional | Modelo recomendado |
|---:|---|---|---|
| 1 | P10 | CI e proteção de branch | **GPT-6 Luna baixo** para conferir execuções e documentação; **GPT-6 Sol baixo** para corrigir workflow |
| 2 | P11, P12 | Ativação, recuperação e painel admin | **GPT-6 Sol médio**; subir para **Sol alto** apenas em concorrência, Auth ou falha difícil |
| 3 | P13, P14 | Sincronização, perfil e redações privadas | **GPT-6 Sol médio**; **Astra médio** para revisar conflitos e isolamento antes de fechar |
| 4 | P04, P05, P06, P08 | Regressão de frontend, demonstração e oficina de redação | **Concluídas em 23/09 com GPT-6 Luna médio**; usar **GPT-6 Sol médio** para revisão adicional de UI/comportamentos |
| 5 | P07 | Schema, RLS e isolamento | **Concluída em 23/09**; correção e auditoria final com **GPT-6 Astra médio**, após verificações no Sol médio |
| 6 | P16, P17 | Mapa curricular, OCR e organização do acervo | **GPT-6 Luna médio/alto** para processamento em lote; **GPT-6 Sol médio** nos casos ambíguos |
| 7 | P18 | Curadoria, índice e benchmark de busca | **GPT-6 Sol alto** para construir; **GPT-6 Astra alto** para avaliar o benchmark e riscos de fonte |
| 8 | P19, P20, P21 | Tutor, feedback de redação e fallback | **GPT-6 Astra alto** para arquitetura, injeção e critérios; **GPT-6 Sol alto** para implementação e depuração |
| 9 | P22 | Conferir e cadastrar 40 questões | **GPT-6 Luna médio** para cadastro e checagens repetitivas; **GPT-6 Sol médio** para revisão pedagógica/fontes |
| 10 | P23, P24 | Simulado e relatório PDF | **GPT-6 Sol alto** para implementação integrada; **GPT-6 Astra médio/alto** para revisão final das regras e do relatório |
| 11 | P25, P26 | Segurança, preview, rollback e publicação | **GPT-6 Sol médio** para preparar/corrigir/testar; **GPT-6 Astra alto** só para a decisão final se ainda necessária |
| 12 | P15 | Atualizar, revisar e enviar guia/PDF da versão publicada | **GPT-6 Luna médio** para atualização mecânica; **GPT-6 Sol médio** para revisão editorial final |

Trocar modelo ou esforço somente ao chegar ao tipo de trabalho indicado. Para reduzir cota: usar Luna nas etapas repetitivas, Sol no desenvolvimento normal e Astra apenas nos pontos críticos. Se GPT-6 não estiver disponível, usar GPT-5.6 Sol no mesmo esforço como alternativa.

1. P10 concluída: workflow executa lint, tipos, conteúdo, testes TS/Python, audit, build e E2E; proteção da main exige o check `quality` atualizado e vale para admin, sem force push/exclusão. CI de a8278cc e eae78c2 passaram; preview continua separado da produção. Detalhes em ../docs/CI.md.
2. P11/P12 concluídas: E2E real passou para ativação/recuperação e painel. Admin listou 41 alunos reais + 2 fixtures temporárias, todas 3A DS com nome; estado, busca, pedido e código funcionaram. Aluno/público bloqueados e zero fixtures restantes. A ativação pessoal dos dois responsáveis continua operacional, pois cada titular deve escolher a senha. Quatro códigos privados iniciais expiram em 24/09 00h14 Brasília; outros 39 alunos ainda sem código.
3. P13 corrigida: matrícula da conta autenticada é verificada no serviço legado; só a chave correspondente autoriza importação local. Teste real cobre chave errada/certa e persistência, com originais preservados. Produção permanece no baseline antigo.
4. P04/P05/P06/P08 e revisão adicional UI concluídas. P07 também fechada após auditoria Astra médio, correção da lista admin na RLS e testes reais; detalhes no relatório P07. Nenhuma promoção de produção realizada.
5. P15: PDF final do professor revisado localmente (7 páginas), atualizar após a publicação. Drive segue com bloqueio de escrita 403; não anunciar upload.
6. P18/P19/P20: lote de 2 documentos/6 trechos indexado. Filtro de fontes passou em tipos/lint/9 unitários/build/conteúdo, mas teste com IA real e feedback de redação pendentes. IA off. Último orçamento Cloudflare: 7200/8500 neurônios reservados em 23/09 UTC.
7. P16/P17/P18 e P22–P24: currículo/curadoria/OCR, questões, simulado e relatório conforme critérios abaixo. Pode haver versão estável com IA desligada antes de concluir todo o backlog.

Concluído também: P07a, P08a, contador dos dois dias ENEM. Extração de 185 PDFs/1868 páginas/2296 trechos feita; 323 páginas ainda exigem revisão/OCR. Não confundir extração com acervo pronto para o tutor.

## Kanban histórico e critérios de aceite preservados

Sprint atual: **1 — base e experiência**, com preparação do Sprint 2. Atualização: 22/09/2026.

## Concluído

- [x] **P08a · P0 · Persistência, exportação e isolamento demo.** Notas, leitura, respostas, materiais e continuidade sobreviveram ao reload; download JSON conferido integralmente; chaves sintéticas de outros acessos preservadas e contexto separado vazio. Dois novos testes em tests/e2e/p08a.spec.ts (desktop/mobile); total de 6 E2E, 4 unitários, tipos e conteúdo passaram. Sem correções no aplicativo. Limites e evidências em docs/STATUS.md; commit desta entrega identificado no histórico por `test: verify P08a local persistence export and demo isolation`.

- [x] **P07a · P0 · Grants explícitos e isolamento SQL.** Migração 002 aplicada; tests/rls-isolation.sql passou com duas identidades sintéticas, compartilhamento/revogação/desativação e rollback. Relatório: docs/MISSAO-P07a.md. P07 completo ainda exige integração de contas.

- [x] **P01 · P0 · Cópia da produção.** Aceite: clone com commit de referência e archive externo; produção intacta. Evidência: branch codex/plataforma-estudos; arquivo ../output/PEM-producao-baseline.zip; baseline 5e1982b.
- [x] **P02 · P0 · Inventário inicial.** Aceite: contagem e caminhos relativos, sem publicar originais. Evidência: ../analise/acervo/manifest.json; 183 PDFs Ferretto e 22 imagens de organização extraídas de ZIPs.
- [x] **P03 · P0 · Projeto Supabase isolado.** Aceite: projeto PEM gratuito em São Paulo, diferente do projeto antigo. Evidência: jfvfckkulpcqvhkjwgvy ACTIVE_HEALTHY; custo consultado US$0/mês.

## Em teste

- [x] **P04 · P0 · Migração do frontend e conteúdo.** Conteúdo validado contra baseline integral, 25 links e questões ENEM com opções/origem; E2E funcional desktop/mobile e sem overflow.
- [x] **P05 · P1 · Demonstração e professor.** Botão/login público leva à demonstração; guia testado; navegação, materiais e tentativa de acesso privado não vazam dados reais nem autorizam APIs.
- [x] **P06 · P1 · Oficina de redação.** Oito lições, validação de campos, gravação/reload, reabertura, comparação, exportação e exclusão verificadas em 1280 e 390 px. Demo não exibe avaliação por IA nem nota.
- [x] **P07 · P0 · Schema e RLS.** Auditoria final corrigiu a lista admin ativada na função SQL. Isolamento real, escopo/revogação de admin, proibição de escalada e visibilidade de docs/busca passaram em SQL com rollback e E2E com JWT real. Catálogo e advisors conferidos; aviso de senhas registrado em P25. Migrações alinhadas ao histórico remoto; zero fixtures. Relatório em `../docs/REVISAO-P07.md`.

## Em andamento

- [x] **P08 · P0 · Regressão e correções.** `check:content`, 11 unitários e regressão completa com 11 E2E aprovados; IA real explicitamente pulada. P08a desktop/mobile validou persistência, exportação e isolamento demo. Screenshots fora do repositório em `%TEMP%\pem-qa-p04-p08`.
- [x] **P09 · P0 · Configuração de contas.** Credenciais configuradas; 41 registros de 3A DS importados com nome/turma/matrícula e conferidos no banco. Senhas antigas ignoradas. Ativação e entrega de códigos continuam em P11/P12.

## A fazer — Sprint 1/2

- [x] **P10 · P0 · CI e proteção de branch.** Workflow cobre lint/tipos/conteúdo/testes TS e Python/audit/build/E2E. `main` exige o check `quality` atualizado, inclusive para admin, e bloqueia force push/exclusão; preview não promove produção. CI remota passou nos commits a8278cc e eae78c2.
- [x] **P11 · P0 · Ativação e recuperação.** Código individual expira e é de uso único, senha pessoal e recuperação validadas, rate limit confirmado, respostas não enumeram matrículas e corrida concorrente deixa apenas uma ativação válida. E2E real passou em 35,8 s; limpeza confirmou zero fixtures sintéticas.
- [x] **P12 · P1 · Painel admin.** E2E real validou lista completa da 3A DS com nome, contagem/estado ativado, busca, pedido de recuperação e emissão/ocultação de código. Aluno e público recebem 403; conta admin não acessa progresso de aluno. Zero fixtures após o teste.
- [x] **P13 · P1 · Perfil e persistência.** Perfil/sincronização/conflito e migração vinculada à matrícula autenticada. Chave alheia recusada, chave correta importada e sincronizada no teste real; originais preservados. Importação local bloqueada em conflito.
- [x] **P14 · P1 · Redações privadas.** Banco, compartilhamento/revogação e exclusão reais; exportação paginada de 201 versões testada e falha na segunda página tratada sem arquivo parcial.
- [ ] **P15 · P1 · Guia do professor.** Aceite: documento amigável com link correto, demonstração e limitações reais; revisado visualmente.

## Backlog de produto — conhecimento e IA

- [ ] **P16 · P1 · Mapa curricular unificado.** 22 imagens lidas e 183 títulos vinculados em mapa privado: 165 grupos na ordem visível de estudo, 146 vínculos diretos e 37 pendências explícitas. Gráfico do Assad cruzado em 30 tópicos de correspondência direta; percentuais são estimativas até ENEM 2025, não estatística oficial. Categorias amplas permanecem separadas; pré-requisitos e ligações ambíguas pedem revisão pedagógica antes do `[x]`. Relatório `../docs/MAPA-CURRICULAR.md`.
- [ ] **P17 · P1 · Extração retomável dos 183 PDFs.** Extração prévia de 185 PDFs conferida; fila privada de 323 páginas para revisão visual/OCR criada e testada em duas execuções idênticas. Próximo: revisar páginas e aplicar OCR seletivo, validar qualidade e reexecução sem retrabalho. SHA/página/estado, logs sem textos privados, duplicatas identificadas. `../docs/TRIAGEM-P17.md`.
- [ ] **P18 · P1 · Curadoria e índice.** Revisar lotes prioritários, permissões, fontes/página, embeddings e busca híbrida. Acerto >=90% em 30 perguntas de referência.
- [ ] **P19 · P1 · Tutor.** Fontes válidas, ausência de base, conflito e injeção testados; mensagens privadas; AI Elements; cota/concorrência/idempotência/reserva.
- [ ] **P20 · P1 · Feedback de redação.** Rubrica Inep edição identificada, evidências textuais, três prioridades; nota desligada até benchmark; soma no servidor.
- [ ] **P21 · P2 · Fallback gratuito.** Apenas modelos/provedores autorizados com política compatível; falhas transitórias, tentativas limitadas e reserva de custo. Não contornar cotas usando várias contas.

## Backlog de produto — prática e publicação

- [ ] **P22 · P1 · Mais 40 questões conferidas.** 10 por disciplina do caderno, alternativas/figuras/origem/resolução completas; não chamar autorais de ENEM oficial.
- [ ] **P23 · P2 · Simulado.** Regras oficiais conferidas, temporizador persistente, cartão-resposta, encerramento, redação digitada no dia 1, respostas e recomendações. Nenhuma nota TRI inventada.
- [ ] **P24 · P2 · Relatório de simulado PDF.** Respostas, erros/acertos, resoluções e próximos estudos; exportação acessível e legível.
- [ ] **P25 · P0 antes de publicar · Segurança/regressão/rollback.** Varredura, zero regressões críticas, ensaio de restauração; revisar limites reais de hospedagem gratuita e o aviso Supabase de proteção contra senhas vazadas desativada.
- [ ] **P26 · P0 antes de publicar · Promover prévia.** Somente versão validada no mesmo domínio; verificar QR/login/materiais públicos; manter rollback conhecido.

## Definição de pronto

Código salvo + teste correspondente passando + fluxo visível conferido + impacto e limitações registrados + sem segredos/arquivos privados no diff + commit identificável. “Publicado” só depois da checagem pública. “IA ativa” só depois de resposta real validada, nunca apenas pela existência de interface.
