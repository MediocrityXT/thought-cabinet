from __future__ import annotations

import os
import re
from typing import Dict

from config_store import API_CONFIG_PATH

DEFAULT_BASE_URL = "https://api.chatanywhere.tech/v1/chat/completions"
DEFAULT_API_KEY = "sk-xxxx"
REQUIRED_KEYS = ("BASE_URL", "API_KEY")
LINE_PATTERN = re.compile(r"^([A-Z_]+)\s*:\s*(.*)$")


def _strip_yaml_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        inner = value[1:-1]
        if value[0] == "'":
            return inner.replace("''", "'")
        return inner
    return value


def _yaml_quote(value: str) -> str:
    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def render_api_config(base_url: str, api_key: str) -> str:
    return f"BASE_URL: {_yaml_quote(base_url)}\nAPI_KEY: {_yaml_quote(api_key)}\n"


def parse_api_config(content: str) -> Dict[str, str]:
    parsed: Dict[str, str] = {}
    for raw_line in content.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        match = LINE_PATTERN.match(line)
        if not match:
            raise ValueError(f"Invalid api.yaml line: {raw_line}")
        key, raw_value = match.groups()
        parsed[key] = _strip_yaml_quotes(raw_value)

    missing = [key for key in REQUIRED_KEYS if key not in parsed]
    if missing:
        raise ValueError(f"Missing required keys in api.yaml: {', '.join(missing)}")

    base_url = parsed["BASE_URL"].strip()
    api_key = parsed["API_KEY"].strip()
    if not base_url:
        raise ValueError("BASE_URL in api.yaml cannot be empty")
    if not api_key:
        raise ValueError("API_KEY in api.yaml cannot be empty")
    return {"baseUrl": base_url, "apiKey": api_key}


def ensure_api_config(path: str = API_CONFIG_PATH) -> str:
    directory = os.path.dirname(path)
    try:
        if directory:
            os.makedirs(directory, exist_ok=True)
        if not os.path.exists(path):
            with open(path, "w", encoding="utf-8") as file:
                file.write(render_api_config(DEFAULT_BASE_URL, DEFAULT_API_KEY))
    except OSError as exc:
        raise OSError(f"Cannot create api config at {path}: {exc}") from exc
    return path


def read_api_config(path: str = API_CONFIG_PATH) -> Dict[str, str]:
    ensure_api_config(path)
    try:
        with open(path, "r", encoding="utf-8") as file:
            content = file.read()
    except OSError as exc:
        raise OSError(f"Cannot read api config at {path}: {exc}") from exc
    return parse_api_config(content)


def write_api_config(base_url: str, api_key: str, path: str = API_CONFIG_PATH) -> Dict[str, str]:
    normalized_base_url = base_url.strip()
    normalized_api_key = api_key.strip()
    if not normalized_base_url:
        raise ValueError("BASE_URL cannot be empty")
    if not normalized_api_key:
        raise ValueError("API_KEY cannot be empty")
    ensure_api_config(path)
    try:
        with open(path, "w", encoding="utf-8") as file:
            file.write(render_api_config(normalized_base_url, normalized_api_key))
    except OSError as exc:
        raise OSError(f"Cannot write api config at {path}: {exc}") from exc
    return {"baseUrl": normalized_base_url, "apiKey": normalized_api_key}
