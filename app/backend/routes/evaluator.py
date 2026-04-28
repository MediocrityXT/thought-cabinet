from __future__ import annotations

from typing import Any, List

from fastapi import APIRouter


def build_router(core: Any) -> APIRouter:
    router = APIRouter()
    router.add_api_route(
        "/api/evaluations",
        core.list_evaluations,
        methods=["GET"],
        response_model=List[core.Evaluation],
    )
    router.add_api_route(
        "/api/evaluations",
        core.create_evaluation,
        methods=["POST"],
        response_model=core.Evaluation,
        status_code=201,
    )
    return router
