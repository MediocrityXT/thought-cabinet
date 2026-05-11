from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi import HTTPException  # noqa: E402

import main  # noqa: E402


class ValidateItemIdTests(unittest.TestCase):
    """Unit tests for the validate_item_id security helper."""

    # --- valid IDs ---

    def test_simple_alphanumeric(self) -> None:
        self.assertEqual(main.validate_item_id("abc123"), "abc123")

    def test_uuid_style(self) -> None:
        item_id = "550e8400-e29b-41d4-a716-446655440000"
        self.assertEqual(main.validate_item_id(item_id), item_id)

    def test_slug_with_hyphens(self) -> None:
        self.assertEqual(main.validate_item_id("my-note-title"), "my-note-title")

    def test_slug_with_underscores(self) -> None:
        self.assertEqual(main.validate_item_id("my_note_title"), "my_note_title")

    def test_chinese_characters(self) -> None:
        self.assertEqual(main.validate_item_id("技术笔记"), "技术笔记")

    # --- invalid IDs ---

    def test_empty_string_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_forward_slash_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("foo/bar")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_backslash_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("foo\\bar")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_path_traversal_backslash(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("..\\etc\\passwd")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_single_dot_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id(".")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_double_dot_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("..")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_leading_dot_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id(".hidden")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_colon_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("C:file")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_windows_drive_path_rejected(self) -> None:
        with self.assertRaises(HTTPException) as ctx:
            main.validate_item_id("C:\\Users\\file")
        self.assertEqual(ctx.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()
