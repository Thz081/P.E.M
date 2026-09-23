# P17 — fila privada de revisão visual/OCR

## Andamento em 23/09/2026

`scripts/apply_ocr_review.py` usa Poppler/Tesseract em português para tentar OCR apenas nas páginas sinalizadas; `scripts/confirm_ocr_review.py` registra decisões após inspeção da página renderizada. O texto, os trechos e o controle ficam fora do Git. A extração nunca altera `authorized: false` nem libera a fonte para o tutor.

O piloto real examinou 12 capas/divisórias de dois PDFs do Assad, registradas como sem conteúdo de estudo para OCR. Das 25 páginas de Biologia processadas por OCR, 24 são candidatas aguardando conferência visual e uma foi marcada `ocr-needs-correction`: na página 2 de Bioenergética, subscritos e fórmulas químicas saíram incorretos. Nenhuma dessas 25 páginas foi aprovada para a IA. A fila privada atual tem **311 páginas pendentes**: 286 sem tentativa de OCR, 24 aguardando revisão visual e uma exigindo correção. Zero erro de ferramenta nesse piloto. Seis testes de retomada, identidade do PDF, remoção de capa, bloqueio de fórmula incorreta e preservação de privacidade passaram; lint e reconstrução da fila também passaram.

Com WSL Ubuntu e `tesseract-ocr`, `tesseract-ocr-por` e `poppler-utils` instalados, o comando para continuar um lote curto é `python3 scripts/apply_ocr_review.py --queue ../analise/acervo/extracted/ocr-queue.json --limit 20`. `--limit` conta tentativas novas. Renderize e confira cada página antes de usar `confirm_ocr_review.py`; texto OCR de gráficos, equações e fórmulas pode estar errado mesmo quando tem muitos caracteres. Depois de cada decisão visual, rode `node scripts/build-ocr-queue.mjs` para atualizar a fila.

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

O sinal inicial (`menos de 80 caracteres`) **não prova** necessidade de OCR: páginas vazias, capa ou figuras sem texto exigem revisão visual. P17 permanece aberta até concluir a revisão das 311 páginas, corrigir os trechos com fórmulas e validar a reexecução integral sem retrabalho.
