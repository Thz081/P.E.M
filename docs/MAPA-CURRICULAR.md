# P16 — mapa curricular do acervo (rascunho verificável)

O script `node scripts/build-curriculum.mjs` leu as 22 capturas privadas de organização, os títulos dos 183 PDFs de estudo e o gráfico de incidência do mapa do Assad. Gerou `../analise/acervo/curriculum-map.json`, fora do Git, com 165 grupos de curso observados, disciplina, assunto, **ordem visível de estudo**, fonte da captura, área do ENEM e ligação de cada PDF. O arquivo registra 30 correspondências diretas com percentuais do Assad, sempre com fonte e período (`até ENEM 2025`). Duas execuções deram o mesmo SHA-256: `00399471e73d717071f904527942090dee0eea4954326d072088d82c12720f317`. Nenhum PDF, trecho ou imagem original entrou no repositório.

| Disciplina | PDFs ligados a um grupo visto nas capturas | PDFs no inventário |
|---|---:|---:|
| Biologia | 23 | 23 |
| Filosofia | 4 | 4 |
| Física | 15 | 15 |
| Geografia | 29 | 29 |
| História | 7 | 8 |
| Matemática | 20 | 20 |
| Português | 25 | 34 |
| Química | 23 | 23 |
| Redação | 0 | 27 |
| **Total** | **146** | **183** |

Os 37 sem vínculo direto incluem os 27 PDFs de redação, oito de interpretação e um de literatura sem captura equivalente, além de “Idade Antiga”, que abrange duas categorias mostradas separadamente. Todos continuam identificados por disciplina e assunto no JSON privado; nenhum foi classificado por adivinhação. O inventário registra sugestões de pré-requisito com estado `proposta_pendente_professor`. A sequência representa apenas o que aparece nas capturas, dividida em dois percursos para História Geral e História do Brasil; não há calendário ou trimestre da turma. As categorias amplas do gráfico do Assad ficam como referências separadas, sem distribuir seu percentual entre aulas específicas. A incidência de grupos sem correspondência direta permanece `null`.

As áreas seguem a [organização oficial do ENEM pelo Inep](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem). Os percentuais são **estimativas do material do Assad**, não estatísticas oficiais do Inep; o mapa não informa amostra nem método de cálculo. Este inventário **não publica nem autoriza** material para o tutor. P16 segue em andamento até revisar a ordem/áreas não mostradas, os pré-requisitos e as 37 ligações ambíguas; P18 cuidará da curadoria e da autorização de cada fonte.
