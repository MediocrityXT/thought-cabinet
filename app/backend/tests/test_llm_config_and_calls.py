from __future__ import annotations

import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main  # noqa: E402
import llm  # noqa: E402
from api_config import DEFAULT_API_KEY, DEFAULT_BASE_URL, parse_api_config, read_api_config  # noqa: E402
from config_store import load_config, save_config  # noqa: E402


class FakeHTTPResponse:
    def __init__(self, body: str):
        self._body = body

    def __enter__(self) -> "FakeHTTPResponse":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        return None

    def read(self) -> bytes:
        return self._body.encode("utf-8")


class ApiConfigTests(unittest.TestCase):
    def test_read_api_config_creates_default_when_missing(self) -> None:
        path = Path(__file__).resolve().parent / "api-config-test.yaml"
        if path.exists():
            path.unlink()
        try:
            config = read_api_config(path)
            self.assertEqual(config["baseUrl"], DEFAULT_BASE_URL)
            self.assertEqual(config["apiKey"], DEFAULT_API_KEY)
        finally:
            if path.exists():
                path.unlink()

    def test_parse_api_config_rejects_missing_key(self) -> None:
        with self.assertRaises(ValueError):
            parse_api_config("BASE_URL: 'https://example.com/v1/chat/completions'")


class LLMFormattingTests(unittest.TestCase):
    @patch("llm.urlopen")
    @patch("llm.read_api_config")
    @patch("llm.load_config")
    def test_llm_completion_uses_openai_chat_completions_format(self, mock_load_config, mock_read_api_config, mock_urlopen) -> None:
        mock_load_config.return_value = {
            "llm": {
                "defaultModel": "gpt-test",
                "moduleModels": {"refinery": ""},
                "apiConfigPath": r"C:\Users\admin\api.yaml",
            }
        }
        mock_read_api_config.return_value = {
            "baseUrl": "https://api.chatanywhere.tech/v1/chat/completions",
            "apiKey": "sk-test",
        }
        mock_urlopen.return_value = FakeHTTPResponse('{"choices":[{"message":{"content":"ok"}}]}')

        result = main._llm_completion("refinery", [{"role": "user", "content": "hello"}], temperature=0.2)
        self.assertEqual(result, "ok")

        request = mock_urlopen.call_args[0][0]
        payload = json.loads(request.data.decode("utf-8"))
        self.assertEqual(request.full_url, "https://api.chatanywhere.tech/v1/chat/completions")
        self.assertEqual(payload["model"], "gpt-test")
        self.assertEqual(payload["messages"][0]["role"], "user")
        self.assertEqual(payload["messages"][0]["content"], "hello")
        self.assertEqual(request.get_header("Authorization"), "Bearer sk-test")

    @patch("llm.read_api_config")
    @patch("llm.load_config")
    def test_llm_completion_rejects_placeholder_api_key(self, mock_load_config, mock_read_api_config) -> None:
        mock_load_config.return_value = {
            "llm": {
                "defaultModel": "gpt-test",
                "moduleModels": {"refinery": ""},
                "apiConfigPath": r"C:\Users\admin\api.yaml",
            }
        }
        mock_read_api_config.return_value = {
            "baseUrl": "https://api.chatanywhere.tech/v1/chat/completions",
            "apiKey": "sk-xxxx",
        }
        with self.assertRaises(main.HTTPException) as context:
            main._llm_completion("refinery", [{"role": "user", "content": "hello"}])
        self.assertEqual(context.exception.status_code, 400)


class LLMFunctionParsingTests(unittest.TestCase):
    @patch("main._llm_completion")
    def test_synthesize_material_uses_llm_json_payload(self, mock_completion) -> None:
        mock_completion.return_value = json.dumps(
            {
                "title": "AI 观察",
                "summary": "核心观点已提取",
                "report": "> [!IMPORTANT] 30 秒速读报告\n> 核心论点：观点 A",
                "content": "# AI 观察\n\n## 原始上下文\n\n- 观点 A\n\n> [!IMPORTANT] 30 秒速读报告\n> 核心论点：观点 A",
                "status": "reading",
            },
            ensure_ascii=False,
        )
        result = main.synthesize_material(main.MaterialCreate(input="https://example.com/article", kind="url"))
        self.assertEqual(result["title"], "AI 观察")
        self.assertEqual(result["status"], "reading")

    @patch("main._llm_completion")
    def test_generate_assessment_uses_llm_json_payload(self, mock_completion) -> None:
        mock_completion.return_value = json.dumps(
            {
                "impact": 81,
                "feasibility": 74,
                "domain": "产品",
                "status": "evaluating",
                "assessment": {
                    "strengths": ["有清晰用户场景"],
                    "weaknesses": ["实现复杂度高"],
                    "opportunities": ["可快速试点"],
                    "threats": ["竞品较多"],
                    "roastComment": "先把范围收紧。",
                    "scores": {"innovation": 4, "market": 4, "feasibility": 3, "team": 3},
                },
            },
            ensure_ascii=False,
        )
        result = main.generate_assessment("测试项目")
        self.assertEqual(result["impact"], 81)
        self.assertEqual(result["assessment"]["scores"]["innovation"], 4)

    @patch("main._llm_completion")
    def test_generate_refinery_reply_uses_llm_output(self, mock_completion) -> None:
        mock_completion.return_value = "这是一条真实 LLM 回复。"
        result = main.generate_refinery_reply("请总结", "测试上下文")
        self.assertEqual(result, "这是一条真实 LLM 回复。")


class SettingsPersistenceTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        self.original_config = load_config()

    async def asyncTearDown(self) -> None:
        save_config(self.original_config)

    async def test_update_settings_does_not_write_api_yaml(self) -> None:
        payload = main.SettingsUpdate(
            llm=main.LLMSettings(
                baseUrl="https://api.chatanywhere.tech/v1/chat/completions",
                apiKey="sk-test-update",
                defaultModel="gpt-4.1-mini",
                moduleModels=main.ModuleModels(),
                apiConfigPath=r"C:\Users\admin\api.yaml",
            )
        )

        dummy_settings = main.SettingsPayload(
            activeTheme="NEON",
            vault=main.VaultSummary(
                name="dummy",
                path="D:\\tmp",
                isObsidian=False,
                gitInitialized=False,
                noteCount=0,
                appDataPath="D:\\tmp",
            ),
            availableVaults=[],
            llm=main.LLMSettings(
                baseUrl="https://api.chatanywhere.tech/v1/chat/completions",
                apiKey="sk-test-update",
                defaultModel="gpt-4.1-mini",
                moduleModels=main.ModuleModels(),
                apiConfigPath=r"C:\Users\admin\api.yaml",
            ),
        )
        with patch("main.current_settings", return_value=dummy_settings):
            await main.update_settings(payload)


if __name__ == "__main__":
    unittest.main()
