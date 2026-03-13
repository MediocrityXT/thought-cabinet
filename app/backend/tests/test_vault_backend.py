from __future__ import annotations

import shutil
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main  # noqa: E402
from config_store import load_config, save_config  # noqa: E402


class VaultBackendTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        self.original_config = load_config()
        await main.startup_event()

    async def asyncTearDown(self) -> None:
        save_config(self.original_config)

    async def test_sample_vault_bootstrap_has_ten_notes(self) -> None:
        settings = await main.get_settings()
        notes = await main.list_notes(None, None, None)

        self.assertTrue(settings.vault.isObsidian)
        self.assertTrue(settings.vault.gitInitialized)
        self.assertEqual(settings.vault.noteCount, 10)
        self.assertEqual(len(notes), 10)

    async def test_create_empty_vault_and_write_note(self) -> None:
        created = await main.create_vault(main.VaultCreateRequest(name="unit-test-vault"))
        vault_path = Path(created.path)

        try:
            note = await main.create_note(
                main.NoteCreate(
                    title="单元测试笔记",
                    content="这是一条用于验证 vault 写入与 git 初始化的测试内容。",
                    domain="测试",
                    tags=["unit", "vault"],
                )
            )

            note_path = vault_path / f"{note.id}.md"

            self.assertTrue((vault_path / ".git").exists())
            self.assertTrue((vault_path / ".obsidian").exists())
            self.assertTrue(note_path.exists())
        finally:
            save_config(self.original_config)
            shutil.rmtree(vault_path, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
