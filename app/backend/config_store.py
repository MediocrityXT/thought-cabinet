from __future__ import annotations

import json
import os
from typing import Any, Dict

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
VAULTS_DIR = os.path.join(BASE_DIR, "vaults")
CONFIG_FILE = os.path.join(DATA_DIR, "config.json")
APP_FOLDER = ".thoughtcabinet"
INBOX_FOLDER = "inbox"
MODULE_KEYS = ["dashboard", "refinery", "organizer", "evaluator", "blueprint", "planner"]


def default_sample_vault_path() -> str:
    return os.path.join(VAULTS_DIR, "sample-obsidian-vault")


def default_blank_vault_path() -> str:
    return os.path.join(VAULTS_DIR, "blank-vault")


def default_config() -> Dict[str, Any]:
    return {
        "activeTheme": "NEON",
        "vault": {
            "activePath": default_sample_vault_path(),
            "appFolder": APP_FOLDER,
            "inboxFolder": INBOX_FOLDER,
        },
        "llm": {
            "baseUrl": "https://api.openai.com/v1",
            "apiKey": "",
            "defaultModel": "gpt-4.1-mini",
            "moduleModels": {module: "" for module in MODULE_KEYS},
        },
        "refinery": {
            "defaultPrompt": (
                "你是 ThoughtCabinet 的信息精炼助手。先根据材料生成一份短文本报告，"
                "包含：核心论点、关键数据、争议点、下一步值得讨论的问题。随后在对话中"
                "持续引用这份报告，帮助用户把材料压缩成可发布的永久笔记。"
            ),
        },
    }


def with_defaults(config: Dict[str, Any]) -> Dict[str, Any]:
    merged = default_config()
    merged["activeTheme"] = config.get("activeTheme", merged["activeTheme"])
    merged["vault"].update(config.get("vault", {}))
    merged["llm"].update({key: value for key, value in config.get("llm", {}).items() if key != "moduleModels"})
    merged["llm"]["moduleModels"].update(config.get("llm", {}).get("moduleModels", {}))
    merged["refinery"].update(config.get("refinery", {}))
    return merged


def load_config() -> Dict[str, Any]:
    if not os.path.exists(CONFIG_FILE):
        save_config(default_config())
    with open(CONFIG_FILE, "r", encoding="utf-8") as file:
        return with_defaults(json.load(file))


def save_config(config: Dict[str, Any]) -> Dict[str, Any]:
    os.makedirs(DATA_DIR, exist_ok=True)
    normalized = with_defaults(config)
    with open(CONFIG_FILE, "w", encoding="utf-8") as file:
        json.dump(normalized, file, ensure_ascii=False, indent=2)
    return normalized
