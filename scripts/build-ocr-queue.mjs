/** Build a private, resumable review queue; never copies extracted text. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const extracted = resolve(root, '..', 'analise', 'acervo', 'extracted');
const index = JSON.parse(readFileSync(resolve(extracted, 'index.json'), 'utf8'));
const queue = [];
const bySubject = {};
const pendingReview = new Set(['check-image-or-ocr', 'ocr-pending-review', 'needs-visual-review', 'ocr-needs-correction']);

for (const [source, record] of Object.entries(index.documents).sort(([a], [b]) => a.localeCompare(b))) {
  if (record.status !== 'extracted') throw Error(`Extraction incomplete: ${source}`);
  const document = JSON.parse(readFileSync(resolve(extracted, record.file), 'utf8'));
  if (document.sha256 !== record.sha256 || document.source !== source) throw Error(`Index mismatch: ${source}`);
  let count = 0;
  for (const page of document.pages) {
    if (!pendingReview.has(page.review)) continue;
    queue.push({ source, sha256: record.sha256, page: page.page, subject: record.subject,
      extractedCharacters: page.text.length, status: page.review });
    count++;
  }
  if (count !== record.pages_needing_visual_review) throw Error(`Page count mismatch: ${source}`);
  bySubject[record.subject] = (bySubject[record.subject] || 0) + count;
}

queue.sort((a, b) => a.subject.localeCompare(b.subject) || a.source.localeCompare(b.source) || a.page - b.page);
const result = { version: 1, status: 'review-queue-only', pages: queue.length, bySubject, queue };
writeFileSync(resolve(extracted, 'ocr-queue.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ pages: result.pages, bySubject }));
