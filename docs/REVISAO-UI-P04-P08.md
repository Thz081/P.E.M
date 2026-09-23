# Revisão adicional de UI e comportamento — 23/09/2026

Revisão local no GPT-6 Sol médio. Produção Vercel continua no baseline antigo.

- Corrigidos os links de ajuda do login que ficavam visualmente colados em desktop/mobile.
- O acesso público do professor agora leva à visita guiada. A página não promete um PDF no Drive enquanto o envio estiver bloqueado por permissão 403; o CTA interno descreve os registros da turma.
- O avatar salvo no perfil aparece imediatamente no cabeçalho e depois de recarregar. A fonte do contador do ENEM aponta para o cronograma oficial do Inep; as datas de 8 e 15/11/2026 permanecem.
- Tipos, lint e build passaram após a alteração do aplicativo. Cinco E2E focados passaram, incluindo conta Supabase sintética, persistência do avatar e fluxo público do professor. O teste de contas removeu as fixtures.
- Revisão visual das seis rotas públicas em 1280×844 e 390×844: todas responderam 200, sem erro de console, overlay de erro ou rolagem horizontal. Menu móvel abriu, navegou para ENEM e fechou. Capturas e resumo em `%TEMP%\pem-ui-review`, fora do Git.

Limites: esta revisão não valida a prévia Vercel nem liga a IA. O guia PDF deve ser atualizado depois da publicação efetiva da nova versão.
