"""Check P17 checkpoint behavior without touching the private corpus."""
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "apply_ocr_review.py"
CONFIRM = SCRIPT.parent / "confirm_ocr_review.py"
SPEC = importlib.util.spec_from_file_location("apply_ocr_review", SCRIPT)
ocr = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ocr)


class OcrReviewTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="pem-ocr-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.extracted = self.root / "analise" / "acervo" / "extracted"
        self.extracted.mkdir(parents=True)
        self.pdf = self.root / "docs" / "sample.pdf"
        self.pdf.parent.mkdir()
        self.pdf.write_bytes(b"synthetic pdf identity for OCR pipeline test")
        self.digest = hashlib.sha256(self.pdf.read_bytes()).hexdigest()
        self.document_path = self.extracted / "sample.json"
        self.queue_path = self.extracted / "ocr-queue.json"
        self.source = "docs/sample.pdf"
        self.save(self.document_path, {"sha256": self.digest, "source": self.source,
                                       "pages": [{"page": 1, "text": "", "review": "check-image-or-ocr"}],
                                       "chunks": [], "publication": "private-unreviewed"})
        self.save(self.extracted / "index.json", {"documents": {
            self.source: {"sha256": self.digest, "file": "sample.json", "status": "extracted",
                          "chunks": 0, "pages_needing_visual_review": 1}}})
        self.save(self.queue_path, {"version": 1, "queue": [{"source": self.source,
                   "sha256": self.digest, "page": 1, "subject": "Teste"}]})

    @staticmethod
    def save(path, value):
        path.write_text(json.dumps(value), encoding="utf-8")

    def run_pipeline(self, text):
        args = [str(SCRIPT), "--queue", str(self.queue_path), "--root", str(self.root), "--limit", "1"]
        with patch.object(sys, "argv", args), patch.object(ocr, "find_tool", return_value="stub"), \
             patch.object(ocr, "verify_language"), patch.object(ocr, "run_ocr", return_value=text) as render:
            ocr.main()
            return render.call_count

    def test_applies_ocr_to_private_page_and_chunks_once(self):
        text = "Texto sintetico suficientemente longo para criar um trecho privado e revisar depois."
        self.assertEqual(self.run_pipeline(text), 1)
        document = json.loads(self.document_path.read_text(encoding="utf-8"))
        index = json.loads((self.extracted / "index.json").read_text(encoding="utf-8"))
        self.assertEqual(document["pages"][0]["review"], "ocr-pending-review")
        self.assertEqual(document["chunks"][0]["body"], text)
        self.assertFalse(document["chunks"][0]["authorized"])
        self.assertEqual(index["documents"][self.source]["chunks"], 1)
        self.assertEqual(self.run_pipeline("different OCR result"), 0)
        self.assertEqual(json.loads(self.document_path.read_text(encoding="utf-8")), document)

    def test_sparse_result_stays_open_for_visual_review(self):
        self.assertEqual(self.run_pipeline("x"), 1)
        document = json.loads(self.document_path.read_text(encoding="utf-8"))
        self.assertEqual(document["pages"][0]["review"], "needs-visual-review")
        self.assertEqual(document["chunks"], [])
        self.assertEqual(self.run_pipeline("still sparse"), 0)

    def test_changed_pdf_is_rejected_before_ocr(self):
        self.pdf.write_bytes(b"different source content")
        with self.assertRaisesRegex(ValueError, "PDF changed"):
            self.run_pipeline("would be wrong")
        self.assertEqual(json.loads(self.document_path.read_text(encoding="utf-8"))["pages"][0]["text"], "")

    def test_visual_rejection_removes_ocr_candidate_and_updates_index(self):
        self.run_pipeline("Synthetic cover title with enough characters to trigger OCR candidate.")
        subprocess.run([sys.executable, str(CONFIRM), "--queue", str(self.queue_path),
                        "--source", self.source, "--page", "1", "--decision", "no-text",
                        "--note", "Cover inspected in rendered image"], check=True, capture_output=True)
        document = json.loads(self.document_path.read_text(encoding="utf-8"))
        record = json.loads((self.extracted / "index.json").read_text(encoding="utf-8"))["documents"][self.source]
        self.assertEqual(document["pages"][0]["review"], "reviewed-no-ocr-needed")
        self.assertEqual(document["pages"][0]["text"], "")
        self.assertEqual(document["chunks"], [])
        self.assertEqual(record["chunks"], 0)
        self.assertEqual(record["pages_needing_visual_review"], 0)

    def test_formula_error_remains_pending_and_unauthorized(self):
        self.run_pipeline("A chemical formula with OCR errors, long enough to create a private chunk.")
        subprocess.run([sys.executable, str(CONFIRM), "--queue", str(self.queue_path),
                        "--source", self.source, "--page", "1", "--decision", "needs-correction",
                        "--note", "Formula visually disagrees with OCR"], check=True, capture_output=True)
        document = json.loads(self.document_path.read_text(encoding="utf-8"))
        record = json.loads((self.extracted / "index.json").read_text(encoding="utf-8"))["documents"][self.source]
        self.assertEqual(document["pages"][0]["review"], "ocr-needs-correction")
        self.assertEqual(document["chunks"][0]["review"], "ocr-needs-correction")
        self.assertFalse(document["chunks"][0]["authorized"])
        self.assertEqual(record["pages_needing_visual_review"], 1)

    def test_verified_ocr_stays_private(self):
        self.run_pipeline("Readable study explanation that was checked against the rendered page.")
        subprocess.run([sys.executable, str(CONFIRM), "--queue", str(self.queue_path),
                        "--source", self.source, "--page", "1", "--decision", "ocr-verified",
                        "--note", "Text compared with the rendered page"], check=True, capture_output=True)
        document = json.loads(self.document_path.read_text(encoding="utf-8"))
        record = json.loads((self.extracted / "index.json").read_text(encoding="utf-8"))["documents"][self.source]
        self.assertEqual(document["pages"][0]["review"], "ocr-verified")
        self.assertEqual(document["chunks"][0]["review"], "ocr-verified")
        self.assertFalse(document["chunks"][0]["authorized"])
        self.assertEqual(record["pages_needing_visual_review"], 0)


if __name__ == "__main__":
    unittest.main()
