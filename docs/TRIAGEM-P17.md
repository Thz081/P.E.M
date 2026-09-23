# P17 — fila privada de revisão visual/OCR

`node scripts/build-ocr-queue.mjs` validou SHA, fonte e contagem de páginas do índice dos 185 PDFs já extraídos. Gerou `../analise/acervo/extracted/ocr-queue.json` fora do Git, contendo apenas caminho privado, SHA, disciplina, número da página e tamanho do texto; nenhum trecho extraído foi copiado. Duas execuções resultaram no mesmo SHA-256 `f7354d536771ab7935405b63e4394799b4e1e3477dffae50c7951ac7206097da`.

| Disciplina | Páginas sinalizadas |
|---|---:|
| Biologia | 183 |
| História | 41 |
| Química | 23 |
| Geografia | 19 |
| Filosofia | 18 |
| Física | 14 |
| Matemática | 8 |
| Português | 4 |
| Redação | 2 |
| Outros dois PDFs | 11 |
| **Total** | **323** |

Próximo passo: inspecionar páginas sinalizadas, aplicar OCR somente onde há conteúdo em imagem e registrar resultado por SHA/página, preservando reexecução. O sinal atual (`menos de 80 caracteres`) **não prova** necessidade de OCR: páginas vazias, capa ou figuras sem texto exigem revisão visual. P17 permanece aberta até concluir essa revisão, verificar qualidade do texto e testar uma segunda execução sem retrabalho.
