# Passagem entre Codex e Claude

Comece por `../CHECKPOINT.md`. O contexto histórico opcional está em `../../CONTEXTO-COMPLETO-PEM.md` (local, fora do repo). O quadro oficial é `../tasks/todo.md` a partir desta pasta, e o plano é `../tasks/plan.md`.

Ao assumir:
1. Leia os arquivos de contexto e `STATUS.md`.
2. Confira `git status`, branch e último commit; não sobrescreva alterações de outro agente.
3. Escolha o primeiro item prioritário desbloqueado. Mova-o para em andamento.
4. Implemente uma parte pequena, teste, confira UI/API/dados e registre resultado.
5. Faça commit apenas dos arquivos públicos revisados. Não publique em main durante a migração.

Ao parar, atualize STATUS e o quadro com: tarefa, arquivos alterados, decisão, comando de teste e resultado, o que não foi testado, dependência externa e próximo passo. Não inclua chaves, senhas, matrículas completas ou textos dos alunos. Avise quando uma instrução deste documento ficou desatualizada e explique a mudança.

Codex e Claude podem discordar de decisões técnicas: registrem a alternativa, o motivo e como preservar compatibilidade. Não reinventem o projeto do zero a cada troca.
