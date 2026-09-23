# P.E.M — entrada para Codex ou Claude
## Atualização em andamento — 23/09/2026 (prevalece sobre 22/09 abaixo)
- Marco posterior: teste real de contas separado passou (1/1, 33,6s) após corrigir redirect /admin. scripts/provision-admins.mjs aplicado para as duas pessoas indicadas; Supabase confirma 41 alunos, 2 perfis admin, 2 códigos admin e 2 códigos aluno pendentes. Códigos em ../analise/codigos-acesso-inicial-20260923.json (privado, não imprimir/commitar), expiram 24/09 00h14 Brasília. Nenhuma conta ativada ainda. O usuário deve entregar a Erick apenas os códigos dele.
- Usuário autorizou avançar em mais funcionalidades antes de nova estabilização e publicação. Produção antiga permanece intacta; PDF final do Claude em C:/Users/Th7/Downloads/P.E.M - Guia para o Professor.pdf foi lido e revisado visualmente (7 páginas); atualizar só após o site mudar.
- Backup.alunos.json privado na pasta Downloads contém 517 registros de várias turmas e campos sensíveis. A importação filtrou SOMENTE 41 registros de 3A DS, projetando apenas nome/turma/matrícula. Migração 202609230001_separate_admin_access.sql aplicada; Supabase confirmado com41 matrículas distintas,41 nomes,0 ativadas. Não copiar backup/senhas para o Git.
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
