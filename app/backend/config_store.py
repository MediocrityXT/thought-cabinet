from __future__ import annotations

import json
import os
from typing import Any, Dict

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
VAULTS_DIR = os.path.join(BASE_DIR, "vaults")
CONFIG_FILE = os.path.join(DATA_DIR, "config.json")
API_CONFIG_PATH = r"C:\Users\admin\api.yaml"
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
            "defaultModel": "gpt-4.1-mini",
            "moduleModels": {module: "" for module in MODULE_KEYS},
            "apiConfigPath": API_CONFIG_PATH,
        },
        "refinery": {
            "defaultPrompt": (
                "你是 ThoughtCabinet 的信息精炼助手。请先阅读前面拼接的原始材料，再输出一个 JSON 对象，"
                "严格遵守下面的 schema，不要输出额外解释：\n"
                "{\n"
                '  "coreArgument": "string",\n'
                '  "keyEvidence": ["string"],\n'
                '  "controversies": ["string"],\n'
                '  "nextQuestions": ["string"]\n'
                "}\n"
                "然后基于这个 JSON 继续和用户讨论，帮助用户把材料压缩成可发布的永久笔记。"
            ),
        },
    }


def with_defaults(config: Dict[str, Any]) -> Dict[str, Any]:
    merged = default_config()
    merged["activeTheme"] = config.get("activeTheme", merged["activeTheme"])
    merged["vault"].update(config.get("vault", {}))
    llm_config = config.get("llm", {})
    merged["llm"]["defaultModel"] = llm_config.get("defaultModel", merged["llm"]["defaultModel"])
    merged["llm"]["apiConfigPath"] = API_CONFIG_PATH
    merged["llm"]["moduleModels"].update(llm_config.get("moduleModels", {}))
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
