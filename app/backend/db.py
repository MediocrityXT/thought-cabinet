import os
import frontmatter
from datetime import datetime
from typing import Dict, Any, List, Optional
import uuid

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

class MarkdownDB:
    @staticmethod
    def _get_path(collection: str, item_id: str = None) -> str:
        if item_id:
            if not item_id.endswith(".md"):
                item_id += ".md"
            return os.path.join(DATA_DIR, collection, item_id)
        return os.path.join(DATA_DIR, collection)

    @classmethod
    def list(cls, collection: str) -> List[Dict[str, Any]]:
        path = cls._get_path(collection)
        items = []
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)
            return []
            
        for filename in os.listdir(path):
            if filename.endswith(".md"):
                item_id = filename.replace(".md", "")
                item = cls.get(collection, item_id)
                if item:
                    items.append(item)
        return sorted(
            items,
            key=lambda item: (
                item.get("updatedAt")
                or item.get("createdAt")
                or ""
            ),
            reverse=True,
        )

    @classmethod
    def get(cls, collection: str, item_id: str) -> Optional[Dict[str, Any]]:
        path = cls._get_path(collection, item_id)
        if not os.path.exists(path):
            return None
            
        post = frontmatter.load(path)
        data = post.metadata
        data["id"] = item_id
        data["content"] = post.content
        return data

    @classmethod
    def save(cls, collection: str, item_id: str, metadata: Dict[str, Any], content: str) -> Dict[str, Any]:
        path = cls._get_path(collection, item_id)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Ensure ID is in metadata but not in the final file content redundantly if we use filename
        metadata.pop("id", None)
        metadata.pop("content", None)
        
        # Update timestamps
        now = datetime.now().isoformat()
        if "createdAt" not in metadata:
            metadata["createdAt"] = now
        metadata["updatedAt"] = now

        post = frontmatter.Post(content, **metadata)
        with open(path, "wb") as f:
            frontmatter.dump(post, f)
            
        return cls.get(collection, item_id)

    @classmethod
    def append(cls, collection: str, item_id: str, new_content: str) -> Dict[str, Any]:
        item = cls.get(collection, item_id)
        if not item:
            raise FileNotFoundError(f"Item {item_id} not found in {collection}")
            
        content = item.get("content", "")
        # Add a newline if needed
        if content and not content.endswith("\n"):
            content += "\n"
        content += new_content
        
        metadata = {k: v for k, v in item.items() if k not in ["id", "content"]}
        return cls.save(collection, item_id, metadata, content)

    @classmethod
    def create(cls, collection: str, metadata: Dict[str, Any], content: str) -> Dict[str, Any]:
        item_id = str(uuid.uuid4())
        return cls.save(collection, item_id, metadata, content)

    @classmethod
    def exists(cls, collection: str, item_id: str) -> bool:
        return os.path.exists(cls._get_path(collection, item_id))

    @classmethod
    def ensure(cls, collection: str, item_id: str, metadata: Dict[str, Any], content: str) -> Dict[str, Any]:
        if cls.exists(collection, item_id):
            return cls.get(collection, item_id)  # type: ignore[return-value]
        return cls.save(collection, item_id, metadata, content)
