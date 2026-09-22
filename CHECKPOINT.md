# P.E.M — entrada para Codex ou Claude
Atualizado em 22/09/2026. Leia este arquivo antes de alterar o projeto.

## Acordo de trabalho vigente
- Uma missão do Kanban por entrega: implementar, testar, registrar e entregar.
- Respostas curtas, sem omitir dúvidas, limitações ou falhas relevantes.
- Não reiniciar o projeto nem reescrever tudo; o usuário não alterou os arquivos.
- Cota semanal informada pelo usuário: 10%, renovação esperada dia 24.
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
- Últimas verificações locais: tipos, build, conteúdo, 4 testes unitários e 4 E2E passaram.
- npm audit: zero vulnerabilidades na execução registrada; não substitui auditoria completa.
- Missão P07a: permissões SQL e RLS testadas com duas identidades fictícias e rollback.
- Teste tests/rls-isolation.sql passou: isolamento, papel, compartilhamento, revogação e desativação.

## Serviços e dependências
- Supabase PEM gratuito: jfvfckkulpcqvhkjwgvy; migrações 001 e 002 aplicadas.
- Nenhum aluno provisionado. Chave service_role e IDENTITY_HMAC_KEY ainda pendentes.
- Segredos somente no ambiente; nunca no chat, Git, logs ou ZIP.
- Cloudflare conectado anteriormente, mas integração de geração/embeddings não pronta.
- IA está indisponível por decisão explícita; endpoints recusam visitantes e não inventam respostas.
- Manter orçamento gratuito, cotas, privacidade e fallback sem serviços pagos.

## Acervo e próxima missão
- Originais fora do código: ../CONTEUDOS FERRETO PARA ALIMENTAR IA e ../conteudos assad.
- Inventário: ../analise/acervo/manifest.json; 183 PDFs Ferretto, 22 imagens de organização.
- Extração privada retomável: scripts/prepare_acervo.py --manifest ../analise/acervo/manifest.json.
- Último checkpoint conferido: 58 documentos, 508 páginas, zero erros; conferir índice para atualização.
- Extração NÃO significa revisão, OCR concluído, embeddings ou publicação autorizada.
- Próxima missão sugerida P08a: testar persistência local após recarregar, exportação e isolamento demo.
- Depois: P09/P11 contas reais quando chaves estiverem configuradas; seguir restante do Kanban.
- Histórico longo opcional: ../CONTEXTO-COMPLETO-PEM.md; o código e testes prevalecem sobre textos antigos.
