from __future__ import annotations

import json
from typing import Any, Dict, List, Literal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import HTTPException

from api_config import read_api_config
from config_store import API_CONFIG_PATH, load_config

ModuleName = Literal["dashboard", "refinery", "organizer", "evaluator", "blueprint", "planner"]


def _resolve_model(module: ModuleName) -> str:
    config = load_config()
    llm_config = config.get("llm", {})
    module_models = llm_config.get("moduleModels", {})
    if isinstance(module_models, dict):
        picked = str(module_models.get(module, "")).strip()
        if picked:
            return picked
    default_model = str(llm_config.get("defaultModel", "")).strip()
    return default_model or "gpt-4.1-mini"


def _llm_api_path() -> str:
    config = load_config()
    llm_config = config.get("llm", {})
    return str(llm_config.get("apiConfigPath", API_CONFIG_PATH))


def llm_completion(module: ModuleName, messages: List[Dict[str, str]], temperature: float = 0.3) -> str:
    config_path = _llm_api_path()
    try:
        api_config = read_api_config(config_path)
    except (ValueError, OSError) as exc:
        raise HTTPException(status_code=500, detail=f"Invalid api config at {config_path}: {exc}") from exc

    base_url = api_config["baseUrl"].strip()
    api_key = api_config["apiKey"].strip()
    if not api_key or api_key == "sk-xxxx":
        raise HTTPException(status_code=400, detail=f"API_KEY missing in {config_path}")

    payload: Dict[str, Any] = {
        "model": _resolve_model(module),
        "messages": messages,
        "temperature": temperature,
    }
    request = Request(
        base_url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=45) as response:
            response_text = response.read().decode("utf-8")
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        detail = body[:300] if body else str(exc)
        raise HTTPException(status_code=502, detail=f"LLM HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {exc.reason}") from exc

    try:
        response_json = json.loads(response_text)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"LLM response is not valid JSON: {exc}") from exc

    choices = response_json.get("choices")
    if not isinstance(choices, list) or not choices:
        raise HTTPException(status_code=502, detail="LLM response missing choices")

    first = choices[0] if isinstance(choices[0], dict) else {}
    message = first.get("message", {}) if isinstance(first, dict) else {}
    content = message.get("content") if isinstance(message, dict) else None
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and isinstance(item.get("text"), str):
                parts.append(item["text"])
        content = "\n".join(part for part in parts if part.strip())
    if not isinstance(content, str) or not content.strip():
        raise HTTPException(status_code=502, detail="LLM response content is empty")
    return content.strip()
