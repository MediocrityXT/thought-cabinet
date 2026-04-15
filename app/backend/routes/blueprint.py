from __future__ import annotations

from fastapi import APIRouter

import main as core

router = APIRouter()

router.add_api_route(
    "/api/blueprint/graph",
    core.blueprint_graph,
    methods=["GET"],
    response_model=core.BlueprintGraph,
)
