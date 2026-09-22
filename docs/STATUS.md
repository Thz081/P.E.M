# Estado atual — 22/09/2026

Entrada curta: CHECKPOINT.md. Uma missão por entrega; backlog em tasks/todo.md.

Produção pem-monarcas.vercel.app intacta. Next.js somente local, branch codex/plataforma-estudos. Código anterior ainda contém alterações não commitadas; conferir git status.

Últimas verificações registradas: typecheck, build, baseline, quatro testes unitários, quatro E2E e dois testes Python passaram; npm audit sem vulnerabilidades. Screenshots desktop/mobile conferidos em ../analise/pem-*.png.

P07a entregue: migração 002 revogou grants padrão amplos. Teste SQL com duas identidades sintéticas passou para isolamento, proteção de papel, compartilhamento, revogação e desativação. Fixtures desfeitas por rollback. Relatório: MISSAO-P07a.md. Autenticação ponta a ponta ainda não validada.

Supabase PEM jfvfckkulpcqvhkjwgvy, migrações 001 e 002 aplicadas. Chave secreta/HMAC pendentes; nenhum aluno provisionado. IA não operacional; endpoints protegidos retornam indisponibilidade. Nenhuma promoção na Vercel.

Extração privada com checkpoint: 58 documentos/508 páginas/zero erros no último índice conferido. Não confundir extração com revisão ou RAG pronto. Ver ../analise/acervo/extracted/index.json antes de retomar.

P08a concluída em 22/09/2026. Próximas missões permanecem no Kanban; P09/P11 dependem da configuração das contas.

### Evidências P08a

- Alterações: somente tests/e2e/p08a.spec.ts, CHECKPOINT.md, docs/STATUS.md e tasks/todo.md. Nenhuma falha funcional encontrada no escopo; código anterior preservado.
- Ambiente: Next dev em http://localhost:4180, Playwright com Edge/Chromium, 1280×844 e 390×844. Browser plugin not available; usada a suíte Playwright existente conforme a skill frontend-testing-debugging.
- Fluxo: demonstração → Matemática → primeira aula → nota sintética com acentos e duas linhas, marcação e resposta → material estudado → reload → início → Continuar → reload → download. JSON baixado e lido do disco: nome, formato, data válida e progresso integral iguais ao armazenamento, sem notas de outros acessos.
- Isolamento: chaves locais sintéticas de aluno/legado não lidas nem sobrescritas; nenhuma chamada a /api/progress ou /api/essays pela demo; novo contexto de navegador sem progresso. Os testes existentes também confirmaram recusa de APIs privadas e IA sem autenticação.
- QA: título/URL corretos, conteúdo visível, sem overlay de erro, sem overflow horizontal na aula. Screenshots desktop/mobile inspecionados: ../analise/p08a-1280.png e ../analise/p08a-390.png (fora do repositório).
- Console: 404 de /favicon.ico confirmado e excluído explicitamente da asserção; pendência cosmética fora do escopo. Nenhum outro erro de console ou pageerror no fluxo P08a.
- Comandos aprovados: npm run typecheck; npm test (4/4); npm run check:content; npm run test:e2e (6/6, 18,7 s). Screenshots opcionais com PEM_QA_SCREENSHOT_DIR=../analise. Não houve dependência nova.
- Durante a preparação: primeira execução atingiu 30 s pela compilação fria; o teste também recarregava antes de concluir a navegação de Continuar. Corrigida a sincronização do teste com URL e nota visível antes do reload; execução final integral passou.
- Limites: não valida sincronização/autenticação de contas reais nem isolamento de segurança entre pessoas que compartilham o mesmo perfil de navegador. A demo usa um espaço local comum nesse perfil. Build não repetido (nenhuma alteração no aplicativo); Firefox/Safari não testados. Nada publicado.
- Commit da missão: `test: verify P08a local persistence export and demo isolation`; implementação anterior não commitada continua fora desta entrega.
