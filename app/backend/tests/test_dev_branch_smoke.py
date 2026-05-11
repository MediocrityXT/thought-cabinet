from __future__ import annotations

import shutil
import subprocess
import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main  # noqa: E402
from config_store import default_sample_vault_path, load_config, save_config  # noqa: E402

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"


class DevBranchApiSmokeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.original_config = load_config()
        config = load_config()
        config["vault"]["activePath"] = default_sample_vault_path()
        save_config(config)

    def tearDown(self) -> None:
        save_config(self.original_config)

    def test_health_and_workspace_endpoints_match_frontend_bootstrap_contract(self) -> None:
        with TestClient(main.app) as client:
            health_response = client.get("/api/health")
            self.assertEqual(health_response.status_code, 200)

            health_payload = health_response.json()
            self.assertEqual(health_payload["status"], "ok")
            self.assertIsInstance(health_payload["health"], int)
            self.assertIn("updatedAt", health_payload)

            workspace_response = client.get("/api/workspace")
            self.assertEqual(workspace_response.status_code, 200)

            workspace = workspace_response.json()
            self.assertIn("settings", workspace)
            self.assertIn("overview", workspace)
            self.assertIn("graph", workspace)
            self.assertIn("notes", workspace)
            self.assertIn("tasks", workspace)
            self.assertIn("evaluations", workspace)
            self.assertIn("materials", workspace)
            self.assertIn("conversationMetas", workspace)

            note_count = len(workspace["notes"])
            self.assertEqual(workspace["settings"]["vault"]["noteCount"], note_count)
            self.assertEqual(workspace["overview"]["stats"]["totalNotes"], note_count)
            self.assertEqual(len(workspace["graph"]["nodes"]), note_count)
            self.assertGreaterEqual(note_count, 10)
            self.assertTrue(workspace["settings"]["vault"]["gitInitialized"])
            self.assertTrue(workspace["settings"]["vault"]["isObsidian"])
            self.assertTrue(workspace["tasks"])
            self.assertTrue(workspace["evaluations"])
            self.assertTrue(workspace["materials"])
            self.assertTrue(workspace["conversationMetas"])
            self.assertIsNotNone(workspace["activeConversation"])
            self.assertEqual(health_payload["health"], workspace["overview"]["health"])


class FrontendBuildSmokeTests(unittest.TestCase):
    def test_frontend_build_generates_production_bundle(self) -> None:
        dist_dir = FRONTEND_DIR / "dist"
        if dist_dir.exists():
            shutil.rmtree(dist_dir)

        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=FRONTEND_DIR,
            check=False,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            self.fail(f"Frontend build failed.\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}")

        self.assertTrue((dist_dir / "index.html").exists())
        assets_dir = dist_dir / "assets"
        self.assertTrue(assets_dir.exists())
        self.assertTrue(any(assets_dir.glob("*.js")))
        self.assertTrue(any(assets_dir.glob("*.css")))

        shutil.rmtree(dist_dir)


if __name__ == "__main__":
    unittest.main()
