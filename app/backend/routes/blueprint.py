from __future__ import annotations

from typing import Any

from fastapi import APIRouter


def build_router(core: Any) -> APIRouter:
    router = APIRouter()
    router.add_api_route(
        "/api/blueprint/graph",
        core.blueprint_graph,
        methods=["GET"],
        response_model=core.BlueprintGraph,
    )
    return router
