"""Record a human visual decision for one page in the private P17 OCR queue.

Use only after opening the rendered page. This confirms OCR handling, not source
publication or pedagogical authorization. Example:
python scripts/confirm_ocr_review.py --queue ../analise/acervo/extracted/ocr-queue.json \
  --source 'conteudos assad/1000 Questões.pdf' --page 1 --decision no-text \
  --note 'Capa conferida visualmente'
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path

from apply_ocr_review import PENDING_STATUSES, REPO, read_json, write_json


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue", type=Path, required=True)
    parser.add_argument("--source", required=True)
    parser.add_argument("--page", type=int, required=True)
    parser.add_argument("--decision", choices=["no-text", "ocr-verified", "needs-correction"], required=True)
    parser.add_argument("--note", required=True)
    args = parser.parse_args()
    if args.page < 1 or not args.note.strip():
        parser.error("Page must be positive and the visual observation must be recorded")
    queue_path = args.queue.resolve(strict=True)
    if queue_path.is_relative_to(REPO):
        raise ValueError("Private queue must stay outside the repository")
    extracted = queue_path.parent
    queue = read_json(queue_path)
    match = [item for item in queue["queue"] if item["source"] == args.source and item["page"] == args.page]
    if len(match) != 1:
        raise ValueError("Page not found exactly once in the private queue")
    entry = match[0]
    index_path = extracted / "index.json"
    index = read_json(index_path)
    record = index["documents"].get(args.source)
    if not record or record.get("sha256") != entry["sha256"]:
        raise ValueError("Queue/index mismatch")
    document_path = (extracted / record["file"]).resolve(strict=True)
    if not document_path.is_relative_to(extracted):
        raise ValueError("Extracted document path escapes its directory")
    document = read_json(document_path)
    if document.get("sha256") != entry["sha256"] or document.get("source") != args.source:
        raise ValueError("Document identity mismatch")
    page = next((item for item in document["pages"] if item["page"] == args.page), None)
    if page is None:
        raise ValueError("Page missing from extracted document")
    expected = PENDING_STATUSES if args.decision == "no-text" else {"ocr-pending-review"}
    if page["review"] not in expected:
        raise ValueError(f"Decision requires page status in {sorted(expected)}")
    if args.decision == "ocr-verified" and not page["text"].strip():
        raise ValueError("Cannot verify empty OCR text")

    status = {"no-text": "reviewed-no-ocr-needed", "ocr-verified": "ocr-verified",
              "needs-correction": "ocr-needs-correction"}[args.decision]
    if args.decision == "no-text":
        if any(part.get("authorized") for part in document["chunks"] if part["page"] == args.page):
            raise ValueError("Authorized chunks cannot be removed")
        page["text"] = ""
        document["chunks"] = [part for part in document["chunks"] if part["page"] != args.page]
    page["review"] = status
    if args.decision in {"needs-correction", "ocr-verified"}:
        for part in document["chunks"]:
            if part["page"] == args.page:
                part["review"] = status
    record["pages_needing_visual_review"] = sum(item["review"] in PENDING_STATUSES for item in document["pages"])
    record["chunks"] = len(document["chunks"])
    write_json(document_path, document)
    write_json(index_path, index)
    review_dir = extracted.parent / "review"
    review_dir.mkdir(parents=True, exist_ok=True)
    review_path = review_dir / "ocr-review.json"
    review = read_json(review_path) if review_path.exists() else {"version": 1, "pages": {}}
    review["pages"][f"{entry['sha256']}:{args.page}"] = {
        "status": status, "sha256": entry["sha256"], "note": args.note.strip(),
        "reviewedAt": datetime.now(timezone.utc).isoformat(), "publicationAuthorized": False,
    }
    write_json(review_path, review)
    print(f"Visual review recorded: {args.source} page {args.page} -> {status}")


if __name__ == "__main__":
    main()
