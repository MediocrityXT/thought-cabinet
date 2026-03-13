from __future__ import annotations

import os
import re
import subprocess
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import frontmatter

from config_store import APP_FOLDER, INBOX_FOLDER, MODULE_KEYS, VAULTS_DIR, load_config, save_config

EXCLUDED_NOTE_DIRS = {".git", ".obsidian", APP_FOLDER, "__pycache__"}


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


class MarkdownDB:
    @staticmethod
    def active_vault_path() -> str:
        config = load_config()
        path = config["vault"]["activePath"]
        MarkdownDB.ensure_vault(path, create_obsidian=False)
        return path

    @staticmethod
    def list_available_vaults() -> List[Dict[str, Any]]:
        os.makedirs(VAULTS_DIR, exist_ok=True)
        vaults = []
        active_path = os.path.abspath(MarkdownDB.active_vault_path())
        for entry in sorted(Path(VAULTS_DIR).iterdir(), key=lambda item: item.name):
            if not entry.is_dir():
                continue
            vaults.append(MarkdownDB.get_vault_summary(str(entry)))
        if not any(os.path.abspath(item["path"]) == active_path for item in vaults):
            vaults.append(MarkdownDB.get_vault_summary(active_path))
        return vaults

    @staticmethod
    def get_vault_summary(vault_path: Optional[str] = None) -> Dict[str, Any]:
        root = Path(vault_path or MarkdownDB.active_vault_path())
        note_files = MarkdownDB._note_paths(str(root))
        return {
            "name": root.name,
            "path": str(root),
            "isObsidian": (root / ".obsidian").exists(),
            "gitInitialized": (root / ".git").exists(),
            "noteCount": len(note_files),
            "appDataPath": str(root / APP_FOLDER),
        }

    @staticmethod
    def switch_vault(vault_path: str) -> Dict[str, Any]:
        normalized = os.path.abspath(vault_path)
        MarkdownDB.ensure_vault(normalized, create_obsidian=False)
        config = load_config()
        config["vault"]["activePath"] = normalized
        save_config(config)
        return MarkdownDB.get_vault_summary(normalized)

    @staticmethod
    def create_empty_vault(name: str) -> Dict[str, Any]:
        slug = MarkdownDB._slugify(name) or "new-vault"
        path = os.path.join(VAULTS_DIR, slug)
        suffix = 2
        while os.path.exists(path):
            path = os.path.join(VAULTS_DIR, f"{slug}-{suffix}")
            suffix += 1
        MarkdownDB.ensure_vault(path, create_obsidian=True)
        MarkdownDB.switch_vault(path)
        return MarkdownDB.get_vault_summary(path)

    @staticmethod
    def ensure_vault(vault_path: str, create_obsidian: bool = True) -> None:
        root = Path(vault_path)
        root.mkdir(parents=True, exist_ok=True)
        if create_obsidian:
            (root / ".obsidian").mkdir(exist_ok=True)
        (root / INBOX_FOLDER).mkdir(exist_ok=True)
        for collection in ["tasks", "evaluations", "materials", "conversations"]:
            (root / APP_FOLDER / collection).mkdir(parents=True, exist_ok=True)
        MarkdownDB._ensure_git_repo(str(root))

    @staticmethod
    def _ensure_git_repo(vault_path: str) -> None:
        root = Path(vault_path)
        if not (root / ".git").exists():
            subprocess.run(["git", "-C", vault_path, "init"], check=False, capture_output=True, text=True)
        name = subprocess.run(
            ["git", "-C", vault_path, "config", "--get", "user.name"],
            check=False,
            capture_output=True,
            text=True,
        ).stdout.strip()
        email = subprocess.run(
            ["git", "-C", vault_path, "config", "--get", "user.email"],
            check=False,
            capture_output=True,
            text=True,
        ).stdout.strip()
        if not name:
            subprocess.run(["git", "-C", vault_path, "config", "user.name", "ThoughtCabinet"], check=False, capture_output=True, text=True)
        if not email:
            subprocess.run(["git", "-C", vault_path, "config", "user.email", "thoughtcabinet@local"], check=False, capture_output=True, text=True)

    @staticmethod
    def _git_commit(vault_path: str, relative_paths: List[str], message: str) -> None:
        if not relative_paths:
            return
        MarkdownDB._ensure_git_repo(vault_path)
        subprocess.run(["git", "-C", vault_path, "add", *relative_paths], check=False, capture_output=True, text=True)
        status = subprocess.run(
            ["git", "-C", vault_path, "status", "--porcelain", "--", *relative_paths],
            check=False,
            capture_output=True,
            text=True,
        )
        if not status.stdout.strip():
            return
        subprocess.run(["git", "-C", vault_path, "commit", "-m", message], check=False, capture_output=True, text=True)

    @staticmethod
    def _slugify(value: str) -> str:
        lowered = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", value.strip().lower())
        return re.sub(r"-{2,}", "-", lowered).strip("-")

    @staticmethod
    def _vault_root(vault_path: Optional[str] = None) -> Path:
        return Path(vault_path or MarkdownDB.active_vault_path())

    @staticmethod
    def _collection_dir(collection: str, vault_path: Optional[str] = None) -> Path:
        root = MarkdownDB._vault_root(vault_path)
        if collection == "notes":
            return root
        return root / APP_FOLDER / collection

    @staticmethod
    def _note_paths(vault_path: Optional[str] = None) -> List[Path]:
        root = MarkdownDB._vault_root(vault_path)
        items: List[Path] = []
        for path in root.rglob("*.md"):
            relative_parts = set(path.relative_to(root).parts)
            if relative_parts & EXCLUDED_NOTE_DIRS:
                continue
            items.append(path)
        return sorted(items)

    @staticmethod
    def _note_path(item_id: str, vault_path: Optional[str] = None) -> Path:
        root = MarkdownDB._vault_root(vault_path)
        relative = Path(item_id if item_id.endswith(".md") else f"{item_id}.md")
        return root / relative

    @staticmethod
    def _collection_path(collection: str, item_id: str, vault_path: Optional[str] = None) -> Path:
        relative = Path(item_id if item_id.endswith(".md") else f"{item_id}.md")
        return MarkdownDB._collection_dir(collection, vault_path) / relative

    @staticmethod
    def _relative_id(path: Path, root: Path) -> str:
        return path.relative_to(root).as_posix().removesuffix(".md")

    @staticmethod
    def _load_markdown(path: Path, item_id: str, collection: str, vault_path: Optional[str] = None) -> Dict[str, Any]:
        post = frontmatter.load(path)
        metadata = dict(post.metadata)
        stat = path.stat()
        created_at = metadata.get("createdAt") or datetime.fromtimestamp(stat.st_ctime).isoformat(timespec="seconds")
        updated_at = metadata.get("updatedAt") or datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds")
        tags = metadata.get("tags", [])
        if isinstance(tags, str):
            tags = [tag.strip().lower() for tag in tags.split(",") if tag.strip()]
        content = post.content.strip()
        title = metadata.get("title") or MarkdownDB._extract_title(path.stem, content)
        return {
            **metadata,
            "id": item_id,
            "title": title,
            "domain": metadata.get("domain", "General"),
            "type": metadata.get("type", "known"),
            "tags": tags or MarkdownDB._extract_tags(content),
            "createdAt": created_at,
            "updatedAt": updated_at,
            "content": content,
        }

    @staticmethod
    def _extract_title(stem: str, content: str) -> str:
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                return stripped.lstrip("#").strip()
        return stem.replace("-", " ").replace("_", " ").strip().title() or "Untitled"

    @staticmethod
    def _extract_tags(content: str) -> List[str]:
        return sorted(set(tag.lower() for tag in re.findall(r"#([A-Za-z0-9_\-/]+)", content)))

    @staticmethod
    def list(collection: str, vault_path: Optional[str] = None) -> List[Dict[str, Any]]:
        items: List[Dict[str, Any]] = []
        root = MarkdownDB._vault_root(vault_path)
        if collection == "notes":
            MarkdownDB.ensure_vault(str(root), create_obsidian=False)
            for path in MarkdownDB._note_paths(str(root)):
                item_id = MarkdownDB._relative_id(path, root)
                items.append(MarkdownDB._load_markdown(path, item_id, collection, str(root)))
        else:
            path = MarkdownDB._collection_dir(collection, str(root))
            path.mkdir(parents=True, exist_ok=True)
            for item_path in sorted(path.glob("*.md")):
                item_id = item_path.stem
                items.append(MarkdownDB._load_markdown(item_path, item_id, collection, str(root)))
        return sorted(items, key=lambda item: item.get("updatedAt") or item.get("createdAt") or "", reverse=True)

    @classmethod
    def get(cls, collection: str, item_id: str, vault_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
        root = cls._vault_root(vault_path)
        path = cls._note_path(item_id, str(root)) if collection == "notes" else cls._collection_path(collection, item_id, str(root))
        if not path.exists():
            return None
        relative_id = cls._relative_id(path, root) if collection == "notes" else path.stem
        return cls._load_markdown(path, relative_id, collection, str(root))

    @classmethod
    def save(
        cls,
        collection: str,
        item_id: str,
        metadata: Dict[str, Any],
        content: str,
        vault_path: Optional[str] = None,
        track: bool = True,
    ) -> Dict[str, Any]:
        root = cls._vault_root(vault_path)
        cls.ensure_vault(str(root), create_obsidian=False)
        path = cls._note_path(item_id, str(root)) if collection == "notes" else cls._collection_path(collection, item_id, str(root))
        path.parent.mkdir(parents=True, exist_ok=True)

        metadata = dict(metadata)
        metadata.pop("id", None)
        metadata.pop("content", None)
        metadata["createdAt"] = metadata.get("createdAt") or now_iso()
        metadata["updatedAt"] = now_iso()

        with open(path, "wb") as file:
            frontmatter.dump(frontmatter.Post(content.strip() + "\n", **metadata), file)

        relative_path = path.relative_to(root).as_posix()
        if track:
            cls._git_commit(str(root), [relative_path], f"{collection}: update {relative_path}")

        saved_id = cls._relative_id(path, root) if collection == "notes" else path.stem
        return cls.get(collection, saved_id, str(root))  # type: ignore[return-value]

    @classmethod
    def append(cls, collection: str, item_id: str, new_content: str, vault_path: Optional[str] = None) -> Dict[str, Any]:
        item = cls.get(collection, item_id, vault_path)
        if not item:
            raise FileNotFoundError(f"Item {item_id} not found in {collection}")
        content = item.get("content", "")
        if content and not content.endswith("\n"):
            content += "\n"
        content += new_content
        metadata = {key: value for key, value in item.items() if key not in {"id", "content"}}
        return cls.save(collection, item_id, metadata, content, vault_path=vault_path)

    @classmethod
    def create(
        cls,
        collection: str,
        metadata: Dict[str, Any],
        content: str,
        vault_path: Optional[str] = None,
        track: bool = True,
    ) -> Dict[str, Any]:
        if collection == "notes":
            title = metadata.get("title", "Untitled")
            root = cls._vault_root(vault_path)
            inbox = root / INBOX_FOLDER
            slug = cls._slugify(title) or f"note-{uuid.uuid4().hex[:8]}"
            item_id = f"{INBOX_FOLDER}/{slug}"
            counter = 2
            while cls.exists(collection, item_id, str(root)):
                item_id = f"{INBOX_FOLDER}/{slug}-{counter}"
                counter += 1
            return cls.save(collection, item_id, metadata, content, vault_path=str(root), track=track)
        item_id = str(uuid.uuid4())
        return cls.save(collection, item_id, metadata, content, vault_path=vault_path, track=track)

    @classmethod
    def exists(cls, collection: str, item_id: str, vault_path: Optional[str] = None) -> bool:
        root = cls._vault_root(vault_path)
        path = cls._note_path(item_id, str(root)) if collection == "notes" else cls._collection_path(collection, item_id, str(root))
        return path.exists()

    @classmethod
    def ensure(
        cls,
        collection: str,
        item_id: str,
        metadata: Dict[str, Any],
        content: str,
        vault_path: Optional[str] = None,
        track: bool = True,
    ) -> Dict[str, Any]:
        if cls.exists(collection, item_id, vault_path):
            return cls.get(collection, item_id, vault_path)  # type: ignore[return-value]
        return cls.save(collection, item_id, metadata, content, vault_path=vault_path, track=track)
