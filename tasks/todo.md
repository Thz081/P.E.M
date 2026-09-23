# Quadro de trabalho — P.E.M
## Situação confirmada em 23/09 — prevalece sobre linhas históricas
- [x] Branch de trabalho enviada em `1b8bd39`, PR draft #1 e CI `PEM quality` verde. Produção antiga preservada; preview gerado, acesso de QA ainda negado pelo conector Vercel.
- [x] 41 alunos de 3A DS e duas contas admin separadas provisionados; quatro códigos privados emitidos para as duas pessoas indicadas. E2E da separação admin/aluno passou após correção do redirecionamento. Nenhuma ativação pessoal realizada.
- [x] Correção local do filtro de fontes: tipos, lint, 9 unitários e build passaram. Falta teste real de recuperação/resposta e feedback de redação; IA desligada.
- [ ] Concluir P10/P25/P26: enviar a correção, repetir CI, abrir e testar preview, validar ambientes, regressão e rollback antes de promover. Não atualizar PDF como versão publicada antes da publicação.
- [ ] Ativação pessoal dos dois responsáveis e emissão dos códigos dos outros 39 alunos, com entrega privada coordenada.

## Atualização 23/09 — andamento atual
- [x] P09: 41 contas de aluno importadas do backup filtrado 3A DS, nomes/matrículas/turma conferidos no banco; senhas do backup não usadas. Pendente para uso: emitir códigos individuais aos outros39 conforme responsável.
- [x] P12 parcial de contas: dois admins definitivos separados das contas de aluno, quatro códigos de uso único pendentes; E2E sintético separado passou. Painel ainda não testado após ativação real das duas pessoas.
- [x] P09 parcial: backup privado517 filtrado por turma,41 estudantes 3A DS importados com nome/turma/matrícula; banco confirmou41 distintos/0 ativados. Senhas do backup ignoradas.
- [ ] P12 ampliado: duas pessoas com conta de aluno e conta admin distintas. Migração e interface em implementação; script dry-run passou. Teste E2E falhou no redirect aluno /admin, corrigido, repetição pendente. Códigos reais ainda não emitidos.
- [ ] P19: piloto respondeu com fonte; busca sem fonte citou material irrelevante. Filtro de acordo semântico+lexical implementado, teste real pendente. IA desativada. Cota Cloudflare do dia quase no limite.
- [ ] P25/P26: nova estabilização e preview após fechar mudanças. Site público ainda é versão antiga. PDF final do professor em Downloads, atualização após publicação. Drive upload da pasta P.E.M segue403.

## Prioridades atualizadas no fechamento de 22/09
Esta seção prevalece sobre os estados históricos abaixo. Detalhes em ../CONTEXTO.md.

1. P25/P26: preservar produção antiga até validar login/progresso legado, preview/ambientes e rollback. Build e11 E2E locais passaram; não houve deploy.
2. P09/P11/P12/P13/P14: credenciais presentes; implementação e teste com contas reais temporárias passaram. Faltam lista correta41/admin definitivo e validação específica da migração/sincronização entre dispositivos.
3. P15: guia completo ../docs/GUIA-PROFESSOR.txt pronto; upload Drive falhou403 por falta de escrita na pasta. Resolver permissão, enviar e conferir. Atualizar disponibilidade após publicação.
4. P17/P18: extração185 PDFs concluída;323 páginas pendentes de revisão/OCR. Piloto2docs/6embeddings indexado, benchmark30 perguntas pendente.
5. P19/P20: geração real falhou503, feedback real não aprovado; IA off. Diagnosticar etapa sem expor dados/respeitando orçamento.
6. Depois P16 e P22–P24. Não abrir novas implementações antes de fechar estabilidade.

- [x] P08b: contador real dos dois dias ENEM no início e ENEM, Brasília, atualização por minuto/zero após prova; testes de limites passaram. Disponível localmente, publicação pendente.
- [x] P08c: build, lint, tipos, conteúdo, 8 unitários, 2 Python, 11 E2E com IA off e audit zero. Teste IA pulado nesta candidata, não aprovado.
- [ ] P10: workflow/lint preparados; CI remota e proteção de branch pendentes.
- [ ] Fechamento Git: migração completa ainda no working tree. Revisar arquivos públicos/segredos e registrar commit reproduzível, sem push main antes de P25/P26.

## Kanban histórico e critérios de aceite preservados

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
