# Passagem entre Codex e Claude

## Estado vigente — 24/09/2026 às 09:51 (Brasília)

Produção estável em `https://pem-monarcas.vercel.app`, `main` no commit `08a1488`; Kanban em **17/26 concluídas, 9 abertas**. O guia do professor foi atualizado sem data na capa e reenviado ao mesmo arquivo do Drive às 09:50. A próxima sequência é P16 (validar o mapa curricular), P17 (OCR seletivo em lotes retomáveis e revisão visual), depois P18 (índice e benchmark). P19/P20 dependem de curadoria e diagnóstico do erro 503; IA continua desligada. P22 pode avançar com fontes autorizadas; P23/P24 aguardam regras e conteúdo. P21 só com provedor gratuito permitido. Consulte `../CHECKPOINT.md`, `../tasks/todo.md`, `../tasks/plan.md` e `STATUS.md`; os registros datados abaixo são histórico quando divergirem deste estado. Cota informada nesta revisão: 6% da janela de 5 horas e 7% semanal.

Pedido adicional do usuário para a próxima semana: reposicionar o produto como plataforma de estudos do ENEM; remover do produto público a narrativa/identidade da Ordem da Fênix e a Taça, aposentar a visita guiada de professor e manter a demonstração de visitante para estudantes. Inventariar rotas, navegação, assets, dados persistidos, guias e testes antes da remoção; preservar histórico interno e planejar backup/migração. Expandir muito conteúdo e resumos por matéria e retirar/substituir a captura incompleta de WhatsApp chamada “resumo gráfico”, usando material original ou autorizado. Não copiar Ferretto sem licença.

Comece por `../CHECKPOINT.md`. O contexto histórico opcional está em `../../CONTEXTO-COMPLETO-PEM.md` (local, fora do repo). O quadro oficial é `../tasks/todo.md` a partir desta pasta, e o plano é `../tasks/plan.md`.

Ao assumir:
1. Leia os arquivos de contexto e `STATUS.md`.
2. Confira `git status`, branch e último commit; não sobrescreva alterações de outro agente.
3. Escolha o primeiro item prioritário desbloqueado. Mova-o para em andamento.
4. Implemente uma parte pequena, teste, confira UI/API/dados e registre resultado.
5. Faça commit apenas dos arquivos públicos revisados. A publicação atual já ocorreu; preserve a proteção da `main` e use o fluxo de PR aprovado para mudanças futuras. Não publique diretamente em `main`.

Ao parar, atualize STATUS e o quadro com: tarefa, arquivos alterados, decisão, comando de teste e resultado, o que não foi testado, dependência externa e próximo passo. Não inclua chaves, senhas, matrículas completas ou textos dos alunos. Avise quando uma instrução deste documento ficou desatualizada e explique a mudança.

Codex e Claude podem discordar de decisões técnicas: registrem a alternativa, o motivo e como preservar compatibilidade. Não reinventem o projeto do zero a cada troca.
