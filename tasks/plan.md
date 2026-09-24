# Plano do P.E.M
Prioridade vigente em 24/09/2026: release estável publicada, PDF do professor atualizado e verificado no Drive. Próxima semana: reposicionar o produto como plataforma de estudos para o ENEM, remover do site a narrativa/identidade da Ordem da Fênix e a Taça, retirar a visita guiada de professor e manter a demonstração de visitante; depois revisar P16, avançar OCR P17, expandir e curar conteúdos/resumos por matéria e benchmark P18, seguidos por P19/P20 e P22 conforme fontes e cota. Auditar e substituir materiais incompletos (incluindo o “resumo gráfico” que é uma captura de WhatsApp), preferindo conteúdo original e fontes abertas/autorizadas; Ferretto serve como referência de formato, não como autorização para copiar. P21 depende de provedor gratuito autorizado. P23/P24 vêm após definição pedagógica e de acessibilidade do simulado. P25/P26/P15 estão concluídas para a versão atual; repetem-se somente se houver mudança que vá a novo release. Estado e evidências atuais em ../CHECKPOINT.md e todo.md. Os marcos abaixo são plano geral, sujeito a essa prioridade atualizada.

Objetivo: transformar a monitoria MONARCAS em um caminho de estudo por matéria, com sequência de conteúdos e incidência para o ENEM, redação e tutor fundamentado. Custo: gratuito. A produção e o QR continuam no mesmo endereço. O clone desta pasta é a aplicação; acervos originais e documentos da Ordem ficam fora dele.

## Método de trabalho

O quadro oficial está em `tasks/todo.md`. Toda tarefa tem identificador, prioridade, critério de aceite e evidência. A sequência é **A fazer → Em andamento → Em teste → Concluído**; impedimentos ficam explícitos. Implementar uma parte utilizável, testar, registrar evidência, fazer commit e seguir. Máximo de duas tarefas em andamento por pessoa. Não criar tarefas duplicadas em outras ferramentas.

Uma tarefa não está concluída porque existe código: precisa funcionar no caminho real e ter limitações documentadas. Não marcar integrações externas concluídas com mocks. Falha em teste volta para em andamento. Não publicar para cumprir prazo se dados ou autenticação estiverem em risco.

## Sprints

1. **Base e experiência**: preservação, migração da UI, dados, demonstração, oficina de redação, regressão e CI.
2. **Contas reais**: Supabase, matrículas, ativação, recuperação, admin, perfil, sincronização, exportação e compartilhamento.
3. **Conhecimento**: inventário, extração retomável, mapa por assunto e prioridades, curadoria, recuperação híbrida e testes.
4. **Tutor e redação**: geração com fontes, cotas, falhas, qualidade e privacidade. Pontuação condicionada à calibração.
5. **Prática ampliada**: lote de questões conferidas, simulados, cronômetro, resultados e PDF; revisão final e publicação.

## Decisões

- Next.js/TypeScript/Tailwind/shadcn; AI Elements para markdown de IA.
- Supabase Free (projeto PEM separado); Cloudflare Workers AI Free; Python local para processamento em lote.
- Uma conta por matrícula; papel admin verificado no banco, nunca por uma segunda senha fixa.
- Acervo extraído não é automaticamente conteúdo revisado ou publicável.
- RAG recupera trechos relevantes; não precisa carregar o acervo inteiro numa conversa.
- Nenhuma chave no GitHub. Nenhum fallback pago nem rotação de contas para contornar limites.
- IA desligável sem quebrar estudo, biblioteca ou demonstração.

## Publicação

Branch `codex/plataforma-estudos` → CI → prévia → regressão/login/isolamento → revisão → promoção no mesmo projeto Vercel. Migrações aditivas. Cópia de produção externa em `../output/PEM-producao-baseline.zip`. O backend antigo permanece até migração completa. Sem push direto em main.

## Continuidade entre agentes

Leia `AGENTS.md`, este plano, `tasks/todo.md`, `docs/STATUS.md`, `docs/HANDOFF.md` e o contexto local `../CONTEXTO-COMPLETO-PEM.md`. Compare Git antes de editar. Ao parar, escreva o que mudou, testes/comandos/resultados, decisões, pendências, arquivos e próximo passo exato. O próximo agente pode propor alternativas; deve registrar motivo e preservar dados/contratos. Nunca transportar senhas no handoff.
