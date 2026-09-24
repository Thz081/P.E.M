# Revisão P13/P14 — 23/09/2026

## Resolução posterior — 23/09/2026

Os dois achados abaixo foram corrigidos. P13 usa a matrícula obtida pelo servidor da conta Supabase, autentica no serviço antigo e só apresenta a importação se a chave devolvida coincidir com dados locais. Teste unitário cobre autenticação, cookie, resposta inválida e login recusado; chamada real ao serviço antigo para a matrícula autorizada confirmou o fluxo. E2E real cobre ausência de vínculo, chave alheia e importação com chave correspondente, com persistência e preservação dos originais.

P14 pagina por UUID estável e refaz a leitura completa ao exportar. E2E real criou 201 versões: páginas 200+1, 201 IDs únicos e 201 versões no arquivo. Falha simulada na segunda página produz erro, sem download parcial. Validação geral: tipos, lint, build, 11 unitários e 11 E2E aprovados; IA real pulada. O relatório abaixo fica como histórico do achado e seus critérios. Kanban voltou a 9/26, com 17 abertas.

Base revisada: `eb3f2b7`. Resultado: **alterações necessárias**. Os marcos anteriores de conclusão foram prematuros; testes verdes cobriam os fluxos usuais, mas não os casos abaixo. Não promover produção.

## P13 — vínculo da migração antiga (prioridade alta)

`src/components/portal.tsx` inferia a identidade antiga procurando uma única chave `pem-progress-*`/`pem-note-*` no navegador. A presença de somente uma chave não comprova titularidade: um aluno B poderia importar os dados deixados pelo aluno A num computador compartilhado. A marca de importação ainda era por conta, permitindo repetir a associação em outra conta.

Mitigação aplicada nesta revisão: retirar a descoberta e a alteração da identidade no cliente. A importação só usa `legacyKey` fornecida pela identidade autenticada pelo servidor; o fluxo legado existente continua disponível. Contas Supabase ainda não recebem esse vínculo e não oferecem importação. Os originais locais são preservados. A importação também aguarda o carregamento do progresso.

Falta para fechar P13: criar um vínculo verificável no servidor entre o UUID Supabase e a identidade antiga da mesma matrícula. O backend antigo gera `userKey` com HMAC da matrícula e segredo próprio (`../portal/worker.mjs`); não é o HMAC novo e não pode ser inferido de uma chave local ou cookie não verificado. Não confiar em `user_metadata` editável. Testar usuário correto, outro aluno no mesmo navegador, várias chaves, falha de armazenamento e importação durante carregamento/conflito. Só registrar conclusão da migração depois de preservar efetivamente a cópia de destino.

Teste atualizado: conta Supabase com um conjunto legado sem vínculo não recebe botão de importação; seu progresso remoto segue vazio; chaves originais permanecem e não há marca de importação.

## P14 — exportação incompleta acima de 200 versões (prioridade média)

`src/app/api/essays/route.ts` limita GET a 200 linhas. `src/components/writing.tsx` monta o download usando apenas `versions`, preenchido por esse GET. A versão 201 e posteriores ficam fora da lista e da exportação, sem indicação de truncamento. POST não estabelece um limite de 200 versões por conta. Constatação por revisão do código; o caso de 201 versões ainda não foi executado.

Falta para fechar P14: paginar a leitura com ordem determinística e disponibilizar exportação completa, com erro explícito se alguma página falhar. Preservar RLS e não recorrer ao service role para contornar acesso. Testar pelo menos 201 versões sintéticas, IDs únicos e conteúdo do arquivo; incluir falha de uma página e isolamento da segunda conta. Se houver alteração simultânea durante exportação, definir e comunicar o comportamento.

## Escopo e evidências

Após a mitigação: typecheck, lint e build passaram; E2E real de contas passou (43,7 s), com limpeza sintética no `finally`. Não foi repetida a suíte E2E inteira. O cenário de 201 versões está documentado como pendente, sem ser apresentado como teste executado.

Foram inspecionados o hook de progresso, rotas de progresso/perfil/redações/compartilhamento/logout, resolução de identidade, login legado, grants e políticas SQL locais, componentes e testes. O CAS de revisão, as verificações de proprietário e a restrição de escrita de compartilhamentos têm cobertura dos fluxos básicos no E2E existente. Isso não substitui P07/P25 nem prova ausência de todos os defeitos de concorrência.

Próxima execução recomendada: **GPT-6 Sol médio** para resolver os dois itens; revisão dirigida no Astra após as correções; só depois Luna médio para P04/P05/P06/P08. As demais funcionalidades implementadas não foram descartadas.
