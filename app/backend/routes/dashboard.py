from __future__ import annotations

from fastapi import APIRouter

import main as core

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
