# Quadro de trabalho — P.E.M

Sprint atual: **1 — base e experiência**, com preparação do Sprint 2. Atualização: 22/09/2026.

## Concluído

- [x] **P08a · P0 · Persistência, exportação e isolamento demo.** Notas, leitura, respostas, materiais e continuidade sobreviveram ao reload; download JSON conferido integralmente; chaves sintéticas de outros acessos preservadas e contexto separado vazio. Dois novos testes em tests/e2e/p08a.spec.ts (desktop/mobile); total de 6 E2E, 4 unitários, tipos e conteúdo passaram. Sem correções no aplicativo. Limites e evidências em docs/STATUS.md; commit desta entrega identificado no histórico por `test: verify P08a local persistence export and demo isolation`.

- [x] **P07a · P0 · Grants explícitos e isolamento SQL.** Migração 002 aplicada; tests/rls-isolation.sql passou com duas identidades sintéticas, compartilhamento/revogação/desativação e rollback. Relatório: docs/MISSAO-P07a.md. P07 completo ainda exige integração de contas.

- [x] **P01 · P0 · Cópia da produção.** Aceite: clone com commit de referência e archive externo; produção intacta. Evidência: branch codex/plataforma-estudos; arquivo ../output/PEM-producao-baseline.zip; baseline 5e1982b.
- [x] **P02 · P0 · Inventário inicial.** Aceite: contagem e caminhos relativos, sem publicar originais. Evidência: ../analise/acervo/manifest.json; 183 PDFs Ferretto e 22 imagens de organização extraídas de ZIPs.
- [x] **P03 · P0 · Projeto Supabase isolado.** Aceite: projeto PEM gratuito em São Paulo, diferente do projeto antigo. Evidência: jfvfckkulpcqvhkjwgvy ACTIVE_HEALTHY; custo consultado US$0/mês.

## Em teste

- [ ] **P04 · P0 · Migração do frontend e conteúdo.** Aceite: baseline 46/52/61/25/9/29/15 preservado, links e funções em desktop/mobile. Evidência parcial: build Next passou; faltam testes completos.
- [ ] **P05 · P1 · Demonstração e professor.** Aceite: navegação sem dados reais, entrada por botão/login público, guia alinhado ao que funciona. Evidência parcial: rotas escritas; QA pendente.
- [ ] **P06 · P1 · Oficina de redação.** Aceite: oito lições, escrita, versões, comparação, exportação/exclusão; não simular nota. Evidência parcial: implementado localmente; QA pendente.
- [ ] **P07 · P0 · Schema e RLS.** Aceite: isolamento real entre duas contas, admin controlado, nenhuma tabela exposta indevidamente. Evidência parcial: migration aplicada; teste RLS/advisors pendentes.

## Em andamento

- [ ] **P08 · P0 · Regressão e correções.** Dependência P04. Corrigir persistência/importação/continuidade, testar CLI+browser e guardar resultados.
- [ ] **P09 · P0 · Configuração de contas.** Dependência P03/P07. Chave secreta precisa ser salva pelo dono em .env.local; preparar importação somente 41 matrículas 3A DS.

## A fazer — Sprint 1/2

- [ ] **P10 · P0 · CI e proteção de branch.** Aceite: lint/tipos/conteúdo/testes/build/security no GitHub; falha impede merge; preview não substitui produção.
- [ ] **P11 · P0 · Ativação e recuperação.** Aceite: código individual expira/uso único, senha pessoal, rate limit, erros sem enumeração; teste concorrente e inválido.
- [ ] **P12 · P1 · Painel admin.** Aceite: lista 3A DS, estado ativado, códigos e pedidos de recuperação; aluno/demo recebem 403.
- [ ] **P13 · P1 · Perfil e persistência.** Aceite: progresso/anotações sincronizados sem sobrescrever conflito, apelido/avatar, logout, migração ligada à mesma conta.
- [ ] **P14 · P1 · Redações privadas.** Aceite: versões em banco, compartilhamento autenticado/revogável, exportação/exclusão; teste entre duas contas.
- [ ] **P15 · P1 · Guia do professor.** Aceite: documento amigável com link correto, demonstração e limitações reais; revisado visualmente.

## Backlog de produto — conhecimento e IA

- [ ] **P16 · P1 · Mapa curricular unificado.** Ler as 22 imagens e nomes dos PDFs; mapear matéria/assunto/pré-requisito/trimestre/ENEM. Sem inventar incidência.
- [ ] **P17 · P1 · Extração retomável dos 183 PDFs.** SHA/página/estado, OCR só quando necessário, logs sem textos privados, duplicatas identificadas; relançar sem retrabalho.
- [ ] **P18 · P1 · Curadoria e índice.** Revisar lotes prioritários, permissões, fontes/página, embeddings e busca híbrida. Acerto >=90% em 30 perguntas de referência.
- [ ] **P19 · P1 · Tutor.** Fontes válidas, ausência de base, conflito e injeção testados; mensagens privadas; AI Elements; cota/concorrência/idempotência/reserva.
- [ ] **P20 · P1 · Feedback de redação.** Rubrica Inep edição identificada, evidências textuais, três prioridades; nota desligada até benchmark; soma no servidor.
- [ ] **P21 · P2 · Fallback gratuito.** Apenas modelos/provedores autorizados com política compatível; falhas transitórias, tentativas limitadas e reserva de custo. Não contornar cotas usando várias contas.

## Backlog de produto — prática e publicação

- [ ] **P22 · P1 · Mais 40 questões conferidas.** 10 por disciplina do caderno, alternativas/figuras/origem/resolução completas; não chamar autorais de ENEM oficial.
- [ ] **P23 · P2 · Simulado.** Regras oficiais conferidas, temporizador persistente, cartão-resposta, encerramento, redação digitada no dia 1, respostas e recomendações. Nenhuma nota TRI inventada.
- [ ] **P24 · P2 · Relatório de simulado PDF.** Respostas, erros/acertos, resoluções e próximos estudos; exportação acessível e legível.
- [ ] **P25 · P0 antes de publicar · Segurança/regressão/rollback.** Varredura, zero regressões críticas, ensaio de restauração; revisar limites reais de hospedagem gratuita.
- [ ] **P26 · P0 antes de publicar · Promover prévia.** Somente versão validada no mesmo domínio; verificar QR/login/materiais públicos; manter rollback conhecido.

## Definição de pronto

Código salvo + teste correspondente passando + fluxo visível conferido + impacto e limitações registrados + sem segredos/arquivos privados no diff + commit identificável. “Publicado” só depois da checagem pública. “IA ativa” só depois de resposta real validada, nunca apenas pela existência de interface.
