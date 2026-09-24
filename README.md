# P.E.M — Monarcas
## Versão pública atual
A migração para Next.js 16/React 19 está publicada em https://pem-monarcas.vercel.app. Estado e retomada: CHECKPOINT.md e CONTEXTO.md. O guia completo está em docs/GUIA-PROFESSOR.txt e o PDF final foi entregue na pasta compartilhada do P.E.M no Drive.

Node 22: npm ci; npm run dev (4180); npm run build e npm start para produção local. Configurar .env.local conforme .env.example, sem publicar segredos. IA permanece desligada até passar curadoria e benchmark reais. O login novo e a transição do acesso legado foram validados antes da publicação.

Validação: lint, typecheck, test, check:content, build e test:e2e. Contas reais: opt-in PEM_REAL_AUTH_TESTS=1 com fixtures removidas. IA real ainda não aprovada. A produção usa o projeto Vercel existente com preview, CI obrigatório e rollback conhecido; a configuração Other abaixo pertence somente à versão antiga.

## Referência histórica da produção antiga

Portal de estudos do 3º A DS: https://pem-monarcas.vercel.app

## Conteúdo

- 46 explicações em 12 disciplinas, com exemplos e exercícios.
- 52 questões autorais por matéria e 61 flashcards.
- 25 materiais de monitoria com seus links originais.
- ENEM: 9 etapas de fundamentos, 29 links de videoaulas de Pedro Assaad e 15 questões selecionadas do caderno fornecido pela turma, com resoluções do portal.
- Progresso e anotações guardados no navegador. Não há sincronização entre dispositivos.

O caderno completo de 1.000 questões foi indexado no ambiente de preparação; apenas as 15 questões conferidas estão disponíveis como quiz ENEM nesta versão. Os demais enunciados ainda precisam de revisão e preservação de imagens. Não há integração com IA nesta versão.

## Publicação

A Vercel acompanha a branch main. Um commit aprovado pela integração publica no mesmo domínio; o QR existente continua válido. Framework Other, Node.js 22, sem comando de build nem pasta de saída personalizada.

api/index.js contém a versão empacotada da interface e dos conteúdos. As rotas estão em vercel.json. A interface e os conteúdos novos são servidos pela Vercel. A autenticação e os arquivos originais ainda dependem do servidor anterior: ele precisa continuar ativo. Nenhuma matrícula ou segredo de sessão deve ser colocado neste repositório.

## Validação antes de atualizar

Verifique login, logout, proteção de /api/data, imagens, matérias, filtros, correção de exercícios, flashcards, anotações, ENEM e telas de celular. A publicação não altera o PDF já entregue. Para reverter, restaure uma versão anterior validada pelo histórico do GitHub ou pelos deployments da Vercel.

As questões do caderno mantêm identificação de ano/aplicação e página do arquivo fornecido. Videoaulas mantêm crédito e abrem nos canais originais. Explicações e comentários de revisão do portal não são apresentados como material oficial dos professores ou do Inep.
