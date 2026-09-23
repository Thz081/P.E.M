"""Prepare a local, resumable PDF corpus. Never publishes or embeds documents.

Usage: python scripts/prepare_acervo.py --manifest ../analise/acervo/manifest.json
All outputs stay beside the private manifest, outside the application repository.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

VERSION = 1


def chunks(text: str, words: int = 300, overlap: int = 40):
    tokens = text.split()
    if words <= overlap or overlap < 0:
        raise ValueError("Overlap must be smaller than chunk size")
    for start in range(0, len(tokens), words - overlap):
        yield " ".join(tokens[start:start + words])
        if start + words >= len(tokens):
            break


def write_json(path: Path, value):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
    temp.replace(path)


def extract(source: Path, destination: Path, metadata: dict):
    from pypdf import PdfReader

    digest = hashlib.file_digest(source.open("rb"), "sha256").hexdigest()
    reader = PdfReader(source)
    if reader.is_encrypted and not reader.decrypt(""):
        raise ValueError("Encrypted PDF requires its owner's password")
    pages, sections = [], []
    for number, page in enumerate(reader.pages, 1):
        text = (page.extract_text() or "").replace("\x00", "")
        text = re.sub(r"[ \t]+", " ", text).strip()
        links = []
        for ref in page.get("/Annots", []):
            annotation = ref.get_object()
            action = annotation.get("/A")
            if action:
                action = action.get_object()
                uri = str(action.get("/URI", ""))
                if uri.startswith(("https://", "http://")):
                    links.append(uri)
        # A low text count is a review signal, not proof that OCR is necessary.
        review = "check-image-or-ocr" if len(text) < 80 else "pending"
        pages.append({"page": number, "text": text, "links": list(dict.fromkeys(links)), "review": review})
        for index, body in enumerate(chunks(text)):
            sections.append({"id": f"{digest[:20]}-{number}-{index}", "page": number,
                             "body": body, "review": "pending", "authorized": False})
    write_json(destination, {"pipeline_version": VERSION, "sha256": digest,
                             "source": metadata["path"], "subject": metadata["subject"],
                             "publication": "private-unreviewed", "pages": pages, "chunks": sections})
    return {"pages": len(pages), "chunks": len(sections), "sha256": digest,
            "pages_needing_visual_review": sum(p["review"] != "pending" for p in pages),
            "links": sum(len(p["links"]) for p in pages)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--worker", type=Path)
    args = parser.parse_args()
    if args.worker:
        job = json.loads(args.worker.read_text(encoding="utf-8"))
        result = extract(Path(job["source"]), Path(job["destination"]), job["metadata"])
        write_json(Path(job["result"]), result)
        return
    if not args.manifest:
        parser.error("--manifest is required")
    manifest = args.manifest.resolve()
    root = manifest.parent.parent.parent
    repo = Path(__file__).resolve().parent.parent
    output = manifest.parent / "extracted"
    if output.resolve().is_relative_to(repo):
        raise ValueError("Private output must remain outside the application repository")
    output.mkdir(parents=True, exist_ok=True)
    entries = json.loads(manifest.read_text(encoding="utf-8"))["items"]
    index_file = output / "index.json"
    index = json.loads(index_file.read_text(encoding="utf-8")) if index_file.exists() else {"documents": {}}
    processed = 0
    for item in entries:
        if item["extension"] != ".pdf":
            continue
        source = (root / item["path"]).resolve()
        if not source.is_relative_to(root):
            raise ValueError("Source outside manifest root")
        stamp = {"bytes": source.stat().st_size, "mtime_ns": source.stat().st_mtime_ns, "pipeline": VERSION}
        previous = index["documents"].get(item["path"], {})
        doc_id = hashlib.sha256(item["path"].encode()).hexdigest()[:24]
        target = output / (doc_id + ".json")
        if previous.get("stamp") == stamp and previous.get("status") == "extracted" and target.exists():
            continue
        job_path, result_path = output / (doc_id + ".job.json"), output / (doc_id + ".result.json")
        write_json(job_path, {"source": str(source), "destination": str(target), "result": str(result_path), "metadata": item})
        record = {"stamp": stamp, "file": target.name, "subject": item["subject"], "status": "error"}
        try:
            subprocess.run([sys.executable, str(Path(__file__).resolve()), "--worker", str(job_path)],
                           check=True, timeout=180, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            record.update(json.loads(result_path.read_text(encoding="utf-8")), status="extracted")
        except subprocess.TimeoutExpired:
            record["error"] = "Extraction timed out; retry or inspect this document separately."
        except subprocess.CalledProcessError:
            record["error"] = "Extraction failed; inspect this document separately."
        finally:
            job_path.unlink(missing_ok=True)
            result_path.unlink(missing_ok=True)
        index["documents"][item["path"]] = record
        index["updated_at"] = datetime.now(timezone.utc).isoformat()
        write_json(index_file, index)
        processed += 1
        print(f"{processed}: {item['subject']} | {source.name} | {record['status']} | {record.get('pages', 0)} pages", flush=True)
        if args.limit and processed >= args.limit:
            break
    print("Checkpoint saved. Extraction does not mean pedagogical review, publication or embeddings.", flush=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
