from __future__ import annotations

from typing import Any, List

from fastapi import APIRouter


def build_router(core: Any) -> APIRouter:
    router = APIRouter()
    router.add_api_route(
        "/api/planner/board",
        core.get_planner_board,
        methods=["GET"],
        response_model=core.PlannerBoard,
    )
    router.add_api_route(
        "/api/planner/assign",
        core.assign_planner_task,
        methods=["POST"],
        response_model=core.PlannerAssignment,
    )
    router.add_api_route(
        "/api/planner/goals/{evaluationId}/brief",
        core.get_planner_brief,
        methods=["GET"],
        response_model=core.PlannerBrief,
    )
    router.add_api_route(
        "/api/planner/goals/{evaluationId}/feedback",
        core.get_planner_feedback,
        methods=["GET"],
        response_model=List[core.PlannerFeedback],
    )
    router.add_api_route(
        "/api/planner/goals/{evaluationId}/feedback",
        core.add_planner_feedback,
        methods=["POST"],
        response_model=core.PlannerFeedback,
        status_code=201,
    )
    router.add_api_route(
        "/api/planner/goals/{evaluationId}/schedule",
        core.get_planner_schedule,
        methods=["GET"],
        response_model=core.PlannerSchedule,
    )
    router.add_api_route(
        "/api/planner/goals/{evaluationId}/chat",
        core.chat_with_planner,
        methods=["POST"],
        response_model=core.PlannerBoard,
    )
    return router
