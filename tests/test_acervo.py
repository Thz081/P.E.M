import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("prepare_acervo", Path(__file__).parents[1] / "scripts/prepare_acervo.py")
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)

class ChunksTest(unittest.TestCase):
    def test_full_coverage_and_overlap(self):
        words = [str(i) for i in range(801)]
        parts = list(pipeline.chunks(" ".join(words)))
        self.assertEqual(set(" ".join(parts).split()), set(words))
        self.assertEqual(parts[0].split()[-40:], parts[1].split()[:40])
        self.assertTrue(all(len(p.split()) <= 300 for p in parts))

    def test_empty_and_invalid_configuration(self):
        self.assertEqual(list(pipeline.chunks("")), [])
        with self.assertRaises(ValueError):
            list(pipeline.chunks("text", 40, 40))

if __name__ == "__main__":
    unittest.main()
