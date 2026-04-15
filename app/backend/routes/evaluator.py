from __future__ import annotations

from typing import List

from fastapi import APIRouter

import main as core

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
