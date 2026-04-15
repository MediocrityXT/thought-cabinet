from __future__ import annotations

from typing import List

from fastapi import APIRouter

import main as core

router = APIRouter()

router.add_api_route(
    "/api/refinery/materials",
    core.list_materials,
    methods=["GET"],
    response_model=List[core.Material],
)
router.add_api_route(
    "/api/refinery/settings",
    core.get_refinery_settings,
    methods=["GET"],
    response_model=core.RefinerySettings,
)
router.add_api_route(
    "/api/refinery/settings",
    core.update_refinery_settings,
    methods=["PUT"],
    response_model=core.RefinerySettings,
)
router.add_api_route(
    "/api/refinery/materials/{id}",
    core.get_material,
    methods=["GET"],
    response_model=core.Material,
)
router.add_api_route(
    "/api/refinery/materials/{id}",
    core.update_material,
    methods=["PUT"],
    response_model=core.Material,
)
router.add_api_route(
    "/api/refinery/materials",
    core.add_material,
    methods=["POST"],
    response_model=core.Material,
    status_code=201,
)
router.add_api_route(
    "/api/refinery/intake",
    core.intake_refinery_material,
    methods=["POST"],
    response_model=core.RefinerySession,
    status_code=201,
)
router.add_api_route(
    "/api/refinery/conversations",
    core.list_conversations,
    methods=["GET"],
    response_model=List[core.ConversationMetadata],
)
router.add_api_route(
    "/api/refinery/conversations/{id}",
    core.get_conversation,
    methods=["GET"],
    response_model=core.Conversation,
)
router.add_api_route(
    "/api/refinery/conversations",
    core.start_conversation,
    methods=["POST"],
    response_model=core.Conversation,
    status_code=201,
)
router.add_api_route(
    "/api/refinery/conversations/{id}/messages",
    core.send_message,
    methods=["POST"],
    response_model=core.Conversation,
)
router.add_api_route(
    "/api/refinery/conversations/{id}/reset",
    core.reset_refinery_conversation,
    methods=["POST"],
    response_model=core.Conversation,
)
router.add_api_route(
    "/api/refinery/conversations/{id}/publish-note",
    core.publish_refinery_note,
    methods=["POST"],
    response_model=core.Note,
    status_code=201,
)
