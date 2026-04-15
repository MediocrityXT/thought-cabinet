from __future__ import annotations

from typing import Any

from fastapi import APIRouter


def build_router(core: Any) -> APIRouter:
    router = APIRouter()
    router.add_api_route("/api/health", core.health, methods=["GET"])
    router.add_api_route(
        "/api/dashboard/overview",
        core.dashboard_overview,
        methods=["GET"],
        response_model=core.DashboardOverview,
    )
    router.add_api_route(
        "/api/workspace",
        core.workspace_snapshot,
        methods=["GET"],
        response_model=core.WorkspaceSnapshot,
    )
    return router
