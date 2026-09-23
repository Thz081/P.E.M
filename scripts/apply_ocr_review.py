"""Run selective OCR on the private P17 queue; keep every result pending visual review.

Requires pdftoppm, tesseract and the requested Tesseract language pack. Example:
python scripts/apply_ocr_review.py --queue ../analise/acervo/extracted/ocr-queue.json --limit 5

The script never publishes text. It improves private extraction and checkpoints by PDF
SHA-256/page. Sparse OCR stays open for manual review; successful OCR also requires a
human quality check before any source can be authorized for the tutor.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PENDING_STATUSES = {"check-image-or-ocr", "ocr-pending-review", "needs-visual-review", "ocr-needs-correction"}
ATTEMPTED_STATUSES = {"ocr-pending-review", "needs-visual-review", "ocr-needs-correction"}


def write_json(path: Path, value: object) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def chunks(text: str, words: int = 300, overlap: int = 40):
    tokens = text.split()
    for start in range(0, len(tokens), words - overlap):
        yield " ".join(tokens[start:start + words])
        if start + words >= len(tokens):
            break


def find_tool(name: str) -> str:
    location = shutil.which(name)
    if not location:
        raise RuntimeError(f"Missing {name}; install it before OCR")
    return location


def verify_language(tesseract: str, lang: str) -> None:
    installed = subprocess.run([tesseract, "--list-langs"], capture_output=True, text=True, check=True)
    languages = set(installed.stdout.splitlines())
    missing = set(lang.split("+")) - languages
    if missing:
        raise RuntimeError(f"Missing Tesseract language data: {', '.join(sorted(missing))}")


def run_ocr(pdf: Path, page: int, dpi: int, lang: str, pdftoppm: str, tesseract: str) -> str:
    with tempfile.TemporaryDirectory(prefix="pem-ocr-") as folder:
        prefix = Path(folder) / "page"
        subprocess.run([pdftoppm, "-f", str(page), "-l", str(page), "-singlefile", "-r", str(dpi),
                        "-png", str(pdf), str(prefix)], check=True, capture_output=True, timeout=120)
        image = prefix.with_suffix(".png")
        if not image.exists():
            raise RuntimeError("Page render produced no image")
        output = subprocess.run([tesseract, str(image), "stdout", "-l", lang], check=True,
                                capture_output=True, text=True, timeout=120)
        return re.sub(r"[ \t]+", " ", output.stdout.replace("\x00", "")).strip()


def update_page(document: dict, page_number: int, text: str) -> bool:
    page = next((item for item in document["pages"] if item["page"] == page_number), None)
    if page is None:
        raise ValueError("Page missing from extracted document")
    if page["review"] not in PENDING_STATUSES:
        raise ValueError("Page is not open for OCR")
    if len(text) <= len(page["text"]):
        return False
    existing = [part for part in document["chunks"] if part["page"] == page_number]
    if any(part.get("authorized") for part in existing):
        raise ValueError("Authorized chunks cannot be replaced by OCR")
    page["text"] = text
    page["review"] = "ocr-pending-review"
    document["chunks"] = [part for part in document["chunks"] if part["page"] != page_number]
    for number, body in enumerate(chunks(text)):
        document["chunks"].append({"id": f"{document['sha256'][:20]}-{page_number}-{number}",
                                   "page": page_number, "body": body, "review": "pending", "authorized": False})
    document["chunks"].sort(key=lambda part: (part["page"], part["id"]))
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue", type=Path, required=True)
    parser.add_argument("--root", type=Path, help="Root relative to PDF paths in the manifest")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--lang", default="por")
    parser.add_argument("--dpi", type=int, default=200)
    parser.add_argument("--min-ocr-chars", type=int, default=20)
    parser.add_argument("--retry-sparse", action="store_true")
    args = parser.parse_args()
    if args.limit < 0 or args.dpi < 72 or args.min_ocr_chars < 1:
        parser.error("Invalid limit, DPI or minimum character count")

    queue_path = args.queue.resolve(strict=True)
    if queue_path.is_relative_to(REPO):
        raise ValueError("The private queue must remain outside the repository")
    extracted = queue_path.parent
    index_path = extracted / "index.json"
    queue, index = read_json(queue_path), read_json(index_path)
    root = (args.root or extracted.parent.parent.parent).resolve(strict=True)
    review_dir = extracted.parent / "review"
    if review_dir.resolve().is_relative_to(REPO):
        raise ValueError("The private review file must remain outside the repository")
    review_dir.mkdir(parents=True, exist_ok=True)
    review_path = review_dir / "ocr-review.json"
    review = read_json(review_path) if review_path.exists() else {"version": 1, "pages": {}}
    if queue.get("version") != 1 or review.get("version") != 1:
        raise ValueError("Unsupported queue or review version")

    pdftoppm, tesseract = find_tool("pdftoppm"), find_tool("tesseract")
    verify_language(tesseract, args.lang)
    checked_sources = set()
    attempted = 0
    for entry in queue["queue"]:
        source, digest, number = entry["source"], entry["sha256"], entry["page"]
        key = f"{digest}:{number}"
        record = index["documents"].get(source)
        if not record or record.get("sha256") != digest or record.get("status") != "extracted":
            raise ValueError(f"Queue/index mismatch for {source}")
        document_path = (extracted / record["file"]).resolve(strict=True)
        if not document_path.is_relative_to(extracted):
            raise ValueError("Extracted document path escapes its private directory")
        document = read_json(document_path)
        if document.get("sha256") != digest or document.get("source") != source:
            raise ValueError(f"Extracted document mismatch for {source}")
        page = next((item for item in document["pages"] if item["page"] == number), None)
        if not page or page["review"] not in PENDING_STATUSES:
            continue
        previous = review["pages"].get(key, {})
        if page["review"] == "ocr-pending-review" and previous.get("status") != "ocr-pending-review":
            review["pages"][key] = {"status": "ocr-pending-review", "sha256": digest,
                                    "characters": len(page["text"]), "reason": "recovered-from-document"}
            write_json(review_path, review)
        if page["review"] == "ocr-pending-review" and record.get("chunks") != len(document["chunks"]):
            record["chunks"] = len(document["chunks"])
            write_json(index_path, index)
        if page["review"] in ATTEMPTED_STATUSES and not (args.retry_sparse and page["review"] == "needs-visual-review"):
            continue
        pdf = (root / source).resolve(strict=True)
        if not pdf.is_relative_to(root):
            raise ValueError("PDF path escapes the manifest root")
        if source not in checked_sources:
            if sha256(pdf) != digest:
                raise ValueError(f"PDF changed since extraction: {source}")
            checked_sources.add(source)

        attempted += 1
        try:
            text = run_ocr(pdf, number, args.dpi, args.lang, pdftoppm, tesseract)
            applied = len(text) >= args.min_ocr_chars and update_page(document, number, text)
            status = "ocr-pending-review" if applied else "needs-visual-review"
            if applied:
                write_json(document_path, document)
                record["chunks"] = len(document["chunks"])
                write_json(index_path, index)
            else:
                page["review"] = status
                write_json(document_path, document)
            review["pages"][key] = {"status": status, "sha256": digest,
                                    "characters": len(text), "attemptedAt": datetime.now(timezone.utc).isoformat()}
        except (OSError, subprocess.SubprocessError, ValueError) as exc:
            review["pages"][key] = {"status": "error", "sha256": digest,
                                    "reason": type(exc).__name__, "attemptedAt": datetime.now(timezone.utc).isoformat()}
            status = "error"
        write_json(review_path, review)
        print(f"{attempted}: {entry['subject']} | page {number} | {status}", flush=True)
        if args.limit and attempted >= args.limit:
            break

    states = {"ocr-pending-review": 0, "ocr-needs-correction": 0,
              "needs-visual-review": 0, "unprocessed": 0, "error": 0}
    for entry in queue["queue"]:
        status = review["pages"].get(f"{entry['sha256']}:{entry['page']}", {}).get("status")
        states[status if status in states else "unprocessed"] += 1
    print(f"OCR checkpoint saved. {json.dumps(states, ensure_ascii=False)}; all results await visual review.")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
