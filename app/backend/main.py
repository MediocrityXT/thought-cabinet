from __future__ import annotations

import json
import os
import re
import subprocess
from datetime import datetime, timedelta
from typing import Any, Dict, List, Literal, Optional
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from api_config import ensure_api_config, read_api_config
from config_store import API_CONFIG_PATH, MODULE_KEYS, default_blank_vault_path, default_sample_vault_path, load_config, save_config
from db import MarkdownDB
from llm import llm_completion

ThemeName = Literal[
    "NEON",
    "ZEN",
    "EPOCH",
    "GLITCH",
    "SKY",
    "AURA",
    "AUGURY",
    "LIBRARY",
    "ATELIER",
    "PRISM",
    "FORGE",
    "VOID",
    "HOME",
    "WARROOM",
]
ModuleName = Literal["dashboard", "refinery", "organizer", "evaluator", "blueprint", "planner"]
NoteType = Literal["known", "unknown", "gap"]
TaskPriority = Literal["low", "medium", "high"]
TaskStatus = Literal["todo", "in_progress", "done"]
TaskCategory = Literal["review", "focus", "alert", "quick_win"]
EvaluationStatus = Literal["idea", "evaluating", "active", "archived"]
MaterialStatus = Literal["unread", "reading", "refined"]
MessageRole = Literal["user", "assistant", "system"]
PlannerNodeStatus = Literal["todo", "in_progress", "done", "blocked"]
PlannerFeedbackStatus = Literal["started", "progress", "blocked", "done", "adjusted"]
PlannerEnergy = Literal["low", "medium", "high"]


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


class ThemeConfig(BaseModel):
    activeTheme: ThemeName


class ModuleModels(BaseModel):
    dashboard: str = ""
    refinery: str = ""
    organizer: str = ""
    evaluator: str = ""
    blueprint: str = ""
    planner: str = ""


class LLMSettings(BaseModel):
    baseUrl: str
    apiKey: str
    defaultModel: str
    moduleModels: ModuleModels
    apiConfigPath: str = API_CONFIG_PATH


class RefinerySettings(BaseModel):
    defaultPrompt: str


class RefinerySettingsUpdate(BaseModel):
    defaultPrompt: str


class VaultSummary(BaseModel):
    name: str
    path: str
    isObsidian: bool
    gitInitialized: bool
    noteCount: int
    appDataPath: str


class SettingsPayload(BaseModel):
    activeTheme: ThemeName
    vault: VaultSummary
    availableVaults: List[VaultSummary]
    llm: LLMSettings


class WorkspaceSnapshot(BaseModel):
    settings: SettingsPayload
    overview: DashboardOverview
    graph: BlueprintGraph
    notes: List[Note]
    tasks: List[Task]
    evaluations: List[Evaluation]
    materials: List[Material]
    conversationMetas: List[ConversationMetadata]
    activeConversation: Optional[Conversation] = None


class SettingsUpdate(BaseModel):
    activeTheme: Optional[ThemeName] = None
    llm: Optional[LLMSettings] = None
    activeVaultPath: Optional[str] = None


class VaultCreateRequest(BaseModel):
    name: str


class VaultSelectRequest(BaseModel):
    path: str


class NoteMetadata(BaseModel):
    id: str
    title: str
    domain: str
    type: NoteType
    tags: List[str] = Field(default_factory=list)
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class Note(NoteMetadata):
    content: str


class NoteCreate(BaseModel):
    title: str
    content: str
    domain: str = "General"
    type: NoteType = "known"
    tags: List[str] = Field(default_factory=list)


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    append: bool = False
    domain: Optional[str] = None
    type: Optional[NoteType] = None
    tags: Optional[List[str]] = None


class Task(BaseModel):
    id: str
    title: str
    domain: str
    timeEstimate: int
    priority: TaskPriority
    status: TaskStatus
    category: TaskCategory
    impactScore: Optional[int] = None
    progress: Optional[int] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class TaskCreate(BaseModel):
    title: str
    domain: str
    timeEstimate: int
    priority: TaskPriority = "medium"
    status: TaskStatus = "todo"
    category: TaskCategory = "quick_win"
    impactScore: Optional[int] = None
    progress: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    domain: Optional[str] = None
    timeEstimate: Optional[int] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    category: Optional[TaskCategory] = None
    impactScore: Optional[int] = None
    progress: Optional[int] = None


class AssessmentScores(BaseModel):
    innovation: int
    market: int
    feasibility: int
    team: int


class Assessment(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]
    roastComment: str
    scores: AssessmentScores


class Evaluation(BaseModel):
    id: str
    idea: str
    impact: int
    feasibility: int
    domain: str
    status: EvaluationStatus
    assessment: Assessment
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class EvaluationCreate(BaseModel):
    idea: str


class Material(BaseModel):
    id: str
    title: str
    sourceUrl: str
    content: str
    summary: str
    report: str = ""
    status: MaterialStatus
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class MaterialCreate(BaseModel):
    input: str
    title: Optional[str] = None
    kind: Optional[Literal["url", "text"]] = None


class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    report: Optional[str] = None
    summary: Optional[str] = None
    status: Optional[MaterialStatus] = None


class ConversationMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: str


class ConversationMetadata(BaseModel):
    id: str
    title: str
    updatedAt: Optional[str] = None


class Conversation(ConversationMetadata):
    contextId: Optional[str] = None
    messages: List[ConversationMessage]
    content: str = ""


class ConversationCreate(BaseModel):
    initialMessage: str
    contextId: Optional[str] = None


class MessageCreate(BaseModel):
    role: MessageRole
    content: str


class RefinerySession(BaseModel):
    material: Material
    conversation: Conversation
    settings: RefinerySettings


class DashboardStats(BaseModel):
    totalNotes: int
    pendingReview: int
    highValue: int
    cognitiveGaps: int


class ProgressEvent(BaseModel):
    id: str
    type: Literal["cognitive", "task", "system"]
    title: str
    description: str
    timestamp: str
    score: Optional[int] = None


class DashboardOverview(BaseModel):
    vaultPath: str
    health: int
    stats: DashboardStats
    recentProgress: List[ProgressEvent]
    reviewQueue: List[Task]
    focusProjects: List[Task]
    cognitiveAlerts: List[Task]
    quickWins: List[Task]


class GraphNode(BaseModel):
    id: str
    label: str
    type: NoteType
    domain: str
    tags: List[str] = Field(default_factory=list)


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str


class BlueprintGraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class PlannerNode(BaseModel):
    id: str
    title: str
    detail: str
    status: PlannerNodeStatus
    ddl: Optional[str] = None
    parentId: Optional[str] = None
    depth: int
    timeEstimate: int
    taskId: Optional[str] = None


class PlannerBrief(BaseModel):
    evaluationId: str
    nodeId: str
    title: str
    minimumOutcome: str
    contextSummary: str
    docLinks: List[str]
    prerequisiteNotes: List[ConversationMetadata]
    relatedTaskIds: List[str]


class PlannerFeedback(BaseModel):
    id: str
    evaluationId: str
    nodeId: str
    taskId: Optional[str] = None
    status: PlannerFeedbackStatus
    progressNote: str
    blocker: Optional[str] = None
    nextSuggestion: str
    actualMinutes: Optional[int] = None
    createdAt: Optional[str] = None


class PlannerFeedbackCreate(BaseModel):
    nodeId: str
    taskId: Optional[str] = None
    status: PlannerFeedbackStatus
    progressNote: str
    blocker: Optional[str] = None
    actualMinutes: Optional[int] = None


class PlannerScheduleBlock(BaseModel):
    id: str
    title: str
    reason: str
    startsAt: str
    endsAt: str
    energy: PlannerEnergy
    nodeId: str


class PlannerHeatmapCell(BaseModel):
    domain: str
    rate: int
    tasks: int


class PlannerSchedule(BaseModel):
    evaluationId: str
    blocks: List[PlannerScheduleBlock]
    heatmap: List[PlannerHeatmapCell]
    summary: str


class PlannerAssignment(BaseModel):
    evaluationId: str
    selectedNode: PlannerNode
    brief: PlannerBrief
    rationale: str


class PlannerAssignRequest(BaseModel):
    evaluationId: Optional[str] = None
    minutes: int


class PlannerChatRequest(BaseModel):
    message: str


class PlannerBoard(BaseModel):
    evaluationId: str
    goalTitle: str
    goalDdl: Optional[str] = None
    activeNodeId: Optional[str] = None
    nodes: List[PlannerNode]
    brief: PlannerBrief
    schedule: PlannerSchedule
    feedback: List[PlannerFeedback]


app = FastAPI(title="ThoughtCabinet Core API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_tags(tags: Optional[List[str]]) -> List[str]:
    if not tags:
        return []
    return list(dict.fromkeys(tag.strip().lower() for tag in tags if tag.strip()))


def validate_item_id(item_id: str) -> str:
    if not item_id:
        raise HTTPException(status_code=400, detail="Item id is required")
    if "/" in item_id or "\\" in item_id:
        raise HTTPException(status_code=400, detail="Item id cannot contain path separators")
    if item_id in {".", ".."} or item_id.startswith("."):
        raise HTTPException(status_code=400, detail="Item id cannot be a relative path reference")
    if ":" in item_id:
        raise HTTPException(status_code=400, detail="Item id contains unsupported characters")
    return item_id


def infer_domain(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["react", "rust", "ai", "rag", "api", "database"]):
        return "技术"
    if any(word in lowered for word in ["product", "app", "market", "用户", "增长"]):
        return "产品"
    if any(word in lowered for word in ["design", "ui", "品牌", "视觉"]):
        return "设计"
    if any(word in lowered for word in ["finance", "商业", "business"]):
        return "商业"
    return "General"


def generate_assessment_seed(idea: str) -> Dict[str, Any]:
    signal = sum(ord(char) for char in idea)
    innovation = 2 + signal % 4
    market = 2 + (signal // 7) % 4
    feasibility = 2 + (signal // 11) % 4
    team = 2 + (signal // 13) % 4
    impact = min(95, 40 + innovation * 8 + market * 7)
    feasibility_score = min(95, 35 + feasibility * 10 + team * 6)
    domain = infer_domain(idea)

    if impact >= 80 and feasibility_score >= 75:
        roast = "这次不像玩具，至少有成为项目的资格。问题不在创意，而在你能不能收紧范围并持续交付。"
        status: EvaluationStatus = "active"
    elif impact >= 75:
        roast = "方向有野心，但现在还是一张漂亮草图。先拆到一周可验证的粒度，再谈产品化。"
        status = "evaluating"
    else:
        roast = "目前更像功能点，不像产品。若不能说明用户、频率和替代方案，就不值得重投入。"
        status = "idea"

    return {
        "idea": idea,
        "impact": impact,
        "feasibility": feasibility_score,
        "domain": domain,
        "status": status,
        "assessment": {
            "strengths": [
                "切入点足够具体，容易解释给团队或自己未来的版本听。",
                "可以先用低成本 MVP 验证，而不是一次性上完整系统。",
                "如果执行稳定，长期会形成知识和任务的复利。",
            ],
            "weaknesses": [
                "差异化仍需要更尖锐的用户价值陈述。",
                "一旦范围扩大，交付速度会明显下降。",
                "如果过度依赖 AI 自动化，输出质量会波动。",
            ],
            "opportunities": [
                "个人知识管理和 AI 工作流仍在持续增长。",
                "可以从现有笔记与待办流程切入，迁移成本较低。",
                "一旦形成稳定使用习惯，留存比单次工具更强。",
            ],
            "threats": [
                "通用工具很多，功能堆叠很容易被替代。",
                "过早复杂化会消耗执行耐心。",
                "价值如果无法量化，决策会持续摇摆。",
            ],
            "roastComment": roast,
            "scores": {
                "innovation": innovation,
                "market": market,
                "feasibility": feasibility,
                "team": team,
            },
        },
    }


def refinery_settings() -> RefinerySettings:
    return RefinerySettings(defaultPrompt=load_config()["refinery"]["defaultPrompt"])


def _extract_json_object(raw: str) -> Dict[str, Any]:
    candidate = raw.strip()
    try:
        parsed = json.loads(candidate)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    start = candidate.find("{")
    end = candidate.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise HTTPException(status_code=502, detail="LLM response does not contain a JSON object")
    try:
        parsed = json.loads(candidate[start : end + 1])
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to parse JSON from LLM response: {exc}") from exc
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=502, detail="LLM JSON payload must be an object")
    return parsed


def _llm_completion(module: ModuleName, messages: List[Dict[str, str]], temperature: float = 0.3) -> str:
    return llm_completion(module, messages, temperature)


def _normalize_score(value: Any, fallback: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        number = fallback
    return max(1, min(5, number))


def _normalize_percent(value: Any, fallback: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        number = fallback
    return max(0, min(100, number))


def _normalize_string_list(value: Any, fallback: List[str]) -> List[str]:
    if isinstance(value, list):
        normalized = [str(item).strip() for item in value if str(item).strip()]
        if normalized:
            return normalized[:5]
    return fallback


def synthesize_refinery_report(title: str, summary: str, raw_excerpt: str) -> str:
    excerpt = raw_excerpt.replace("\n", " ").strip()
    if len(excerpt) > 180:
        excerpt = f"{excerpt[:180]}..."
    return (
        "> [!IMPORTANT] 30 秒速读报告\n"
        f"> 核心论点：{summary or f'{title} 需要被压缩成一条可验证判断。'}\n"
        f"> 关键证据：{excerpt or '当前只有链接或简短输入，建议在对话中补齐上下文。'}\n"
        "> 争议点：这条材料最容易被忽略的是适用边界与反例。\n"
        "> 下一步值得讨论的问题：它最值得沉淀成哪条事实或观点？"
    )


def build_refinery_prompt(material_body: str) -> str:
    return f"{material_body.strip()}\n\n---\n\n{refinery_settings().defaultPrompt}"


def synthesize_material(payload: MaterialCreate) -> Dict[str, str]:
    normalized_input = payload.input.strip()
    if not normalized_input:
        raise HTTPException(status_code=400, detail="Material input is required")

    inferred_kind = payload.kind or ("url" if re.match(r"^https?://", normalized_input, flags=re.IGNORECASE) else "text")
    if inferred_kind == "url":
        parsed = urlparse(normalized_input)
        host = parsed.netloc or "source"
        title_hint = payload.title or parsed.path.strip("/").replace("-", " ").title() or host
        source_url = normalized_input
        raw_context = (
            f"Source URL: {source_url}\n"
            f"Title hint: {title_hint}\n"
            "The article body is not available locally. Generate a cautious first-pass report, "
            "explicitly acknowledging that the content is inferred from the link metadata."
        )
    else:
        title_hint = payload.title or normalized_input.splitlines()[0][:28] or f"Text Capture {datetime.now().strftime('%H:%M')}"
        source_url = "text://clipboard"
        raw_context = normalized_input

    completion = _llm_completion(
        "refinery",
        messages=[
            {
                "role": "system",
                "content": (
                    "你是 ThoughtCabinet 的知识精炼助手。请严格返回 JSON 对象，不要输出 markdown 代码块。"
                    '字段必须包含 title, summary, report, content, status。'
                    "其中 report 必须是 Markdown callout，status 只能是 unread/reading/refined。"
                ),
            },
            {
                "role": "user",
                "content": (
                    f"kind: {inferred_kind}\n"
                    f"title_hint: {title_hint}\n"
                    f"source_url: {source_url}\n"
                    f"default_prompt: {refinery_settings().defaultPrompt}\n\n"
                    "请输出一份用于知识精炼流程的材料。content 需为完整 Markdown，且应包含原始上下文和“30 秒速读报告”。\n\n"
                    f"source_context:\n{raw_context}"
                ),
            },
        ],
        temperature=0.35,
    )
    parsed_json = _extract_json_object(completion)
    title = str(parsed_json.get("title", "")).strip() or title_hint
    summary = str(parsed_json.get("summary", "")).strip() or f"{title} 已生成短文本报告，可以直接进入对话精炼。"
    report = str(parsed_json.get("report", "")).strip() or synthesize_refinery_report(title, summary, raw_context)
    content = str(parsed_json.get("content", "")).strip()
    if not content:
        if inferred_kind == "url":
            body = (
                f"# {title}\n\n"
                f"- Source: {source_url}\n"
                f"- Captured: {now_iso()}\n\n"
                "## Raw Context\n\n"
                "当前尚未抓取正文，先基于链接标题和来源建立初始阅读上下文。\n\n"
                f"{report}\n"
            )
        else:
            body = (
                f"# {title}\n\n"
                f"- Source: {source_url}\n"
                f"- Captured: {now_iso()}\n\n"
                f"{normalized_input}\n\n"
                f"{report}\n"
            )
        content = body
    elif report not in content:
        content = f"{content.rstrip()}\n\n{report}\n"
    status = str(parsed_json.get("status", "unread")).strip().lower()
    if status not in {"unread", "reading", "refined"}:
        status = "unread"
    prompt_source = normalized_input if inferred_kind == "text" else f"# {title}\n\n- Source: {source_url}\n\n{summary}\n\n{report}"
    return {
        "title": title,
        "sourceUrl": source_url,
        "summary": summary,
        "report": report,
        "content": content,
        "prompt": build_refinery_prompt(prompt_source),
        "status": status,
    }


def generate_assessment(idea: str) -> Dict[str, Any]:
    seed = generate_assessment_seed(idea)
    completion = _llm_completion(
        "evaluator",
        messages=[
            {
                "role": "system",
                "content": (
                    "你是产品评估助手。输出严格 JSON 对象，不要 markdown，不要代码块。"
                    "字段: impact(0-100), feasibility(0-100), domain, status(idea|evaluating|active|archived),"
                    "assessment={strengths[], weaknesses[], opportunities[], threats[], roastComment, scores={innovation,market,feasibility,team}(1-5)}。"
                ),
            },
            {
                "role": "user",
                "content": f"idea: {idea}\n请返回中文评估结果。",
            },
        ],
        temperature=0.45,
    )
    payload = _extract_json_object(completion)
    raw_assessment = payload.get("assessment", {})
    if not isinstance(raw_assessment, dict):
        raw_assessment = {}
    raw_scores = raw_assessment.get("scores", {})
    if not isinstance(raw_scores, dict):
        raw_scores = {}

    seed_assessment = seed["assessment"]
    seed_scores = seed_assessment["scores"]
    status = str(payload.get("status", seed["status"])).strip()
    if status not in {"idea", "evaluating", "active", "archived"}:
        status = seed["status"]

    return {
        "idea": idea,
        "impact": _normalize_percent(payload.get("impact"), seed["impact"]),
        "feasibility": _normalize_percent(payload.get("feasibility"), seed["feasibility"]),
        "domain": str(payload.get("domain", "")).strip() or infer_domain(idea),
        "status": status,
        "assessment": {
            "strengths": _normalize_string_list(raw_assessment.get("strengths"), seed_assessment["strengths"]),
            "weaknesses": _normalize_string_list(raw_assessment.get("weaknesses"), seed_assessment["weaknesses"]),
            "opportunities": _normalize_string_list(raw_assessment.get("opportunities"), seed_assessment["opportunities"]),
            "threats": _normalize_string_list(raw_assessment.get("threats"), seed_assessment["threats"]),
            "roastComment": str(raw_assessment.get("roastComment", "")).strip() or seed_assessment["roastComment"],
            "scores": {
                "innovation": _normalize_score(raw_scores.get("innovation"), seed_scores["innovation"]),
                "market": _normalize_score(raw_scores.get("market"), seed_scores["market"]),
                "feasibility": _normalize_score(raw_scores.get("feasibility"), seed_scores["feasibility"]),
                "team": _normalize_score(raw_scores.get("team"), seed_scores["team"]),
            },
        },
    }


def generate_refinery_reply(message: str, context_title: Optional[str], report: Optional[str] = None, prompt: Optional[str] = None) -> str:
    context = context_title or "当前上下文"
    messages: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": (
                "你是 ThoughtCabinet 的 Socratic 精炼助手。请使用中文，回答简洁、具体、可执行。"
                "优先帮助用户把材料压缩成可验证的事实、可复用的观点或可发布的永久笔记。"
            ),
        }
    ]
    if prompt:
        messages.append(
            {
                "role": "system",
                "content": f"当前精炼 Prompt 与材料上下文如下：\n{prompt}",
            }
        )
    elif report:
        messages.append({"role": "assistant", "content": report})
    messages.append(
        {
            "role": "user",
            "content": f"上下文标题：{context}\n用户消息：{message}",
        }
    )
    return _llm_completion("refinery", messages=messages, temperature=0.55)


def create_refinery_conversation(context_id: str, initial_message: str = "请基于短文本报告继续精炼这份材料。") -> Conversation:
    material = MarkdownDB.get("materials", context_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    created = MarkdownDB.create(
        "conversations",
        {
            "title": material["title"],
            "contextId": context_id,
            "messages": [
                {"role": "assistant", "content": material.get("report", material.get("summary", "")), "timestamp": now_iso()},
                {
                    "role": "assistant",
                    "content": generate_refinery_reply(
                        initial_message,
                        material.get("title"),
                        material.get("report"),
                        material.get("prompt"),
                    ),
                    "timestamp": now_iso(),
                },
            ],
        },
        "# AI Refinery Conversation\n\n自动生成的精炼会话。",
    )
    return Conversation(**created)


def current_settings() -> SettingsPayload:
    config = load_config()
    config_path = str(config.get("llm", {}).get("apiConfigPath", API_CONFIG_PATH))
    try:
        api_config = read_api_config(config_path)
    except (ValueError, OSError) as exc:
        raise HTTPException(status_code=500, detail=f"Invalid api config at {config_path}: {exc}") from exc
    return SettingsPayload(
        activeTheme=config["activeTheme"],
        vault=VaultSummary(**MarkdownDB.get_vault_summary()),
        availableVaults=[VaultSummary(**item) for item in MarkdownDB.list_available_vaults()],
        llm=LLMSettings(
            baseUrl=api_config["baseUrl"],
            apiKey=api_config["apiKey"],
            defaultModel=config["llm"]["defaultModel"],
            moduleModels=ModuleModels(**config["llm"]["moduleModels"]),
            apiConfigPath=config_path,
        ),
    )


def build_dashboard() -> DashboardOverview:
    notes = MarkdownDB.list("notes")
    tasks = MarkdownDB.list("tasks")
    evaluations = MarkdownDB.list("evaluations")
    summary = MarkdownDB.get_vault_summary()

    review_queue = [Task(**task) for task in tasks if task.get("category") == "review" and task.get("status") != "done"][:5]
    focus_projects = [Task(**task) for task in tasks if task.get("category") == "focus"][:5]
    cognitive_alerts = [Task(**task) for task in tasks if task.get("category") == "alert"][:5]
    quick_wins = [Task(**task) for task in tasks if task.get("category") == "quick_win" and int(task.get("timeEstimate", 0)) <= 30][:6]

    progress_events: List[ProgressEvent] = []
    for note in notes[:3]:
        progress_events.append(
            ProgressEvent(
                id=f"note-{note['id']}",
                type="cognitive",
                title=note["title"],
                description=f"{note.get('domain', 'General')} 领域新增认知节点",
                timestamp=note.get("updatedAt") or note.get("createdAt") or now_iso(),
                score=min(100, 50 + len(note.get("tags", [])) * 10),
            )
        )
    for task in tasks:
        if task.get("status") == "done" and len(progress_events) < 6:
            progress_events.append(
                ProgressEvent(
                    id=f"task-{task['id']}",
                    type="task",
                    title=task["title"],
                    description=f"完成任务，影响分 {task.get('impactScore', 70)}",
                    timestamp=task.get("updatedAt") or task.get("createdAt") or now_iso(),
                    score=task.get("impactScore", 70),
                )
            )
    if len(progress_events) < 6:
        progress_events.append(
            ProgressEvent(
                id="system-sync",
                type="system",
                title="Vault 已完成一次索引同步",
                description="系统已刷新仪表板、待办队列和认知缺口视图。",
                timestamp=now_iso(),
            )
        )

    high_value = sum(1 for item in evaluations if item.get("impact", 0) >= 75 and item.get("status") != "archived")
    gaps = sum(1 for item in notes if item.get("type") == "gap")
    health = max(82, 100 - max(0, len(cognitive_alerts) * 2) - max(0, gaps - 2))

    return DashboardOverview(
        vaultPath=summary["path"],
        health=health,
        stats=DashboardStats(
            totalNotes=len(notes),
            pendingReview=len(review_queue),
            highValue=high_value,
            cognitiveGaps=gaps,
        ),
        recentProgress=sorted(progress_events, key=lambda item: item.timestamp, reverse=True)[:6],
        reviewQueue=review_queue,
        focusProjects=focus_projects,
        cognitiveAlerts=cognitive_alerts,
        quickWins=quick_wins,
    )


def build_blueprint_graph() -> BlueprintGraph:
    notes = MarkdownDB.list("notes")
    nodes = [
        GraphNode(
            id=note["id"],
            label=note["title"],
            type=note.get("type", "known"),
            domain=note.get("domain", "General"),
            tags=note.get("tags", []),
        )
        for note in notes
    ]
    edges: List[GraphEdge] = []
    for index, left in enumerate(notes):
        for right in notes[index + 1 :]:
            overlap = sorted(set(left.get("tags", [])) & set(right.get("tags", [])))
            if overlap:
                edges.append(GraphEdge(source=left["id"], target=right["id"], label=f"共享: {', '.join(overlap[:2])}"))
            elif left.get("domain") == right.get("domain") and len(edges) < len(notes) * 2:
                edges.append(GraphEdge(source=left["id"], target=right["id"], label="同领域"))
    return BlueprintGraph(nodes=nodes, edges=edges[:24])


def planner_goal_ddl(evaluation: Dict[str, Any]) -> str:
    anchor_raw = evaluation.get("updatedAt") or evaluation.get("createdAt") or now_iso()
    anchor = datetime.fromisoformat(anchor_raw)
    horizon = 10 + max(7, 100 - int(evaluation.get("feasibility", 60))) // 6
    return (anchor + timedelta(days=horizon)).isoformat(timespec="seconds")


def planner_feedback_items(evaluation_id: str) -> List[PlannerFeedback]:
    items = []
    for entry in MarkdownDB.list("planner_feedback"):
        if entry.get("evaluationId") != evaluation_id:
            continue
        items.append(PlannerFeedback(**entry))
    return sorted(items, key=lambda item: item.createdAt or "", reverse=True)


def planner_related_tasks(evaluation: Dict[str, Any]) -> List[Dict[str, Any]]:
    tasks = MarkdownDB.list("tasks")
    domain = evaluation.get("domain", "General")
    related = [task for task in tasks if task.get("domain") == domain]
    if related:
        return related
    return tasks[:6]


def planner_nodes(evaluation: Dict[str, Any]) -> List[PlannerNode]:
    related_tasks = planner_related_tasks(evaluation)
    goal_ddl = planner_goal_ddl(evaluation)
    goal = PlannerNode(
        id=f"{evaluation['id']}:goal",
        title=evaluation["idea"],
        detail=f"{evaluation.get('domain', 'General')} 总目标，影响 {evaluation.get('impact', 0)} / 可行 {evaluation.get('feasibility', 0)}。",
        status="in_progress" if any(task.get("status") == "in_progress" for task in related_tasks) else "todo",
        ddl=goal_ddl,
        depth=0,
        timeEstimate=sum(int(task.get("timeEstimate", 20)) for task in related_tasks[:4]) or 120,
    )

    branches = [
        PlannerNode(
            id=f"{evaluation['id']}:scope",
            title=evaluation.get("assessment", {}).get("opportunities", ["验证范围"])[0],
            detail="先确认这件事为什么值得做，以及最小验证边界。",
            status="done" if related_tasks and related_tasks[0].get("status") == "done" else "todo",
            ddl=(datetime.fromisoformat(goal_ddl) - timedelta(days=9)).isoformat(timespec="seconds"),
            parentId=goal.id,
            depth=1,
            timeEstimate=45,
        ),
        PlannerNode(
            id=f"{evaluation['id']}:build",
            title=evaluation.get("assessment", {}).get("strengths", ["实现主路径"])[0],
            detail="把核心交付链路做通，优先处理最关键的产出。",
            status="in_progress" if any(task.get("status") == "in_progress" for task in related_tasks) else "todo",
            ddl=(datetime.fromisoformat(goal_ddl) - timedelta(days=5)).isoformat(timespec="seconds"),
            parentId=goal.id,
            depth=1,
            timeEstimate=90,
        ),
        PlannerNode(
            id=f"{evaluation['id']}:risk",
            title=evaluation.get("assessment", {}).get("threats", ["收敛风险"])[0],
            detail="处理最大的阻塞项，否则计划会持续漂移。",
            status="blocked" if any(task.get("status") == "todo" and task.get("priority") == "high" for task in related_tasks) else "todo",
            ddl=(datetime.fromisoformat(goal_ddl) - timedelta(days=2)).isoformat(timespec="seconds"),
            parentId=goal.id,
            depth=1,
            timeEstimate=60,
        ),
    ]

    leaves: List[PlannerNode] = []
    branch_cycle = [branches[0].id, branches[1].id, branches[1].id, branches[2].id]
    for index, task in enumerate(related_tasks[:8]):
        status = task.get("status", "todo")
        leaves.append(
            PlannerNode(
                id=f"{evaluation['id']}:task:{task['id']}",
                title=task["title"],
                detail=f"{task.get('domain', 'General')} · {task.get('category', 'quick_win')}",
                status="done" if status == "done" else "in_progress" if status == "in_progress" else "todo",
                ddl=(datetime.fromisoformat(goal_ddl) - timedelta(days=max(1, 8 - index))).isoformat(timespec="seconds"),
                parentId=branch_cycle[index % len(branch_cycle)],
                depth=2,
                timeEstimate=int(task.get("timeEstimate", 25)),
                taskId=task["id"],
            )
        )

    return [goal, *branches, *leaves]


def planner_brief_from_nodes(evaluation: Dict[str, Any], nodes: List[PlannerNode], node_id: Optional[str] = None) -> PlannerBrief:
    target = next((node for node in nodes if node.id == node_id), None)
    if not target:
        target = next((node for node in nodes if node.depth == 2 and node.status != "done"), nodes[0])

    note_pool = MarkdownDB.list("notes")
    material_pool = MarkdownDB.list("materials")
    note_links: List[ConversationMetadata] = []
    domain = evaluation.get("domain", "General")
    for item in note_pool:
        if item.get("domain") == domain and len(note_links) < 2:
            note_links.append(ConversationMetadata(id=item["id"], title=item["title"], updatedAt=item.get("updatedAt")))
    for item in material_pool:
        if len(note_links) >= 4:
            break
        note_links.append(ConversationMetadata(id=item["id"], title=item["title"], updatedAt=item.get("updatedAt")))

    doc_links = []
    if "scope" in target.id:
        doc_links = ["obsidian://open?vault=active&file=.thoughtcabinet/tasks", "https://en.wikipedia.org/wiki/Minimum_viable_product"]
    elif "build" in target.id:
        doc_links = ["obsidian://open?vault=active&file=.thoughtcabinet/evaluations", "https://12factor.net/"]
    else:
        doc_links = ["obsidian://open?vault=active&file=.thoughtcabinet/planner_feedback", "https://en.wikipedia.org/wiki/Risk_management"]

    return PlannerBrief(
        evaluationId=evaluation["id"],
        nodeId=target.id,
        title=target.title,
        minimumOutcome=f"最小交付：在 {target.timeEstimate} 分钟内，把“{target.title}”推进到一个可验证的小结果。",
        contextSummary=f"这一步属于“{evaluation['idea']}”目标树中的第 {target.depth + 1} 层节点，当前状态为 {target.status}，DDL 为 {target.ddl or '未指定'}。",
        docLinks=doc_links,
        prerequisiteNotes=note_links,
        relatedTaskIds=[node.taskId for node in nodes if node.parentId == target.parentId and node.taskId][:4],
    )


def planner_schedule(evaluation: Dict[str, Any], nodes: List[PlannerNode]) -> PlannerSchedule:
    anchor = datetime.now().replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    active_nodes = [node for node in nodes if node.depth >= 1 and node.status != "done"][:5]
    blocks = []
    for index, node in enumerate(active_nodes):
        start = anchor + timedelta(hours=index * 3)
        duration = max(30, node.timeEstimate)
        blocks.append(
            PlannerScheduleBlock(
                id=f"block-{node.id}",
                title=node.title,
                reason=f"因为 {node.status} 且靠近 DDL，所以安排在 {start.strftime('%m-%d %H:%M')} 开始。",
                startsAt=start.isoformat(timespec="seconds"),
                endsAt=(start + timedelta(minutes=duration)).isoformat(timespec="seconds"),
                energy="high" if duration >= 60 else "medium" if duration >= 40 else "low",
                nodeId=node.id,
            )
        )

    tasks = planner_related_tasks(evaluation)
    by_domain: Dict[str, Dict[str, int]] = {}
    for task in tasks:
        bucket = by_domain.setdefault(task.get("domain", "General"), {"total": 0, "delayed": 0})
        bucket["total"] += 1
        if task.get("priority") == "high" and task.get("status") != "done":
            bucket["delayed"] += 1
    heatmap = [
        PlannerHeatmapCell(
            domain=domain,
            rate=0 if values["total"] == 0 else round(values["delayed"] / values["total"] * 100),
            tasks=values["total"],
        )
        for domain, values in by_domain.items()
    ]

    return PlannerSchedule(
        evaluationId=evaluation["id"],
        blocks=blocks,
        heatmap=sorted(heatmap, key=lambda item: item.rate, reverse=True),
        summary=f"AI 已根据 DDL、节点状态和阻塞风险，给 “{evaluation['idea']}” 生成未来一周的战术排程预览。",
    )


def build_planner_board(evaluation_id: Optional[str] = None, active_node_id: Optional[str] = None) -> PlannerBoard:
    evaluations = MarkdownDB.list("evaluations")
    if not evaluations:
        raise HTTPException(status_code=404, detail="No evaluations available for planner")
    evaluation = next((item for item in evaluations if item["id"] == evaluation_id), evaluations[0])
    nodes = planner_nodes(evaluation)
    brief = planner_brief_from_nodes(evaluation, nodes, active_node_id)
    feedback = planner_feedback_items(evaluation["id"])
    schedule = planner_schedule(evaluation, nodes)
    return PlannerBoard(
        evaluationId=evaluation["id"],
        goalTitle=evaluation["idea"],
        goalDdl=planner_goal_ddl(evaluation),
        activeNodeId=brief.nodeId,
        nodes=nodes,
        brief=brief,
        schedule=schedule,
        feedback=feedback,
    )


def planner_assignment_for_minutes(minutes: int, evaluation_id: Optional[str] = None) -> PlannerAssignment:
    board = build_planner_board(evaluation_id=evaluation_id)
    unfinished = [node for node in board.nodes if node.depth >= 1 and node.status != "done"]
    selected = next((node for node in unfinished if node.timeEstimate <= minutes), None)
    if not selected and unfinished:
        selected = sorted(unfinished, key=lambda node: node.timeEstimate)[0]
    if not selected:
        selected = board.nodes[0]
    brief = planner_brief_from_nodes({"id": board.evaluationId, "idea": board.goalTitle}, board.nodes, selected.id)
    rationale = (
        f"你有 {minutes} 分钟，AI 优先选择了时间成本 {selected.timeEstimate} 分钟、"
        f"状态为 {selected.status} 的节点，以降低启动摩擦并贴近当前 DDL。"
    )
    return PlannerAssignment(
        evaluationId=board.evaluationId,
        selectedNode=selected,
        brief=brief,
        rationale=rationale,
    )


def planner_feedback_suggestion(status: PlannerFeedbackStatus, progress_note: str, blocker: Optional[str]) -> str:
    if status == "blocked":
        return f"先拆掉阻塞项：{blocker or '把当前卡点写成一个可验证问题'}，然后缩小到 15 分钟内能推进的一步。"
    if status == "done":
        return "把这次产出沉淀成一条可复用笔记，并推进下一个已解锁节点。"
    if status == "adjusted":
        return "AI 已记录你的计划调整，下一步建议重新校准 DDL 和最近三个节点的优先级。"
    if "文档" in progress_note or "资料" in progress_note:
        return "既然上下文已补齐，下一步直接进入最小交付动作，不要继续停留在收集材料。"
    return "继续保持当前推进节奏，并在下一次 check-in 时补充实际产出和偏差原因。"


def create_planner_feedback(evaluation_id: str, payload: PlannerFeedbackCreate) -> PlannerFeedback:
    created = MarkdownDB.create(
        "planner_feedback",
        {
            "evaluationId": evaluation_id,
            "nodeId": payload.nodeId,
            "taskId": payload.taskId,
            "status": payload.status,
            "progressNote": payload.progressNote,
            "blocker": payload.blocker,
            "nextSuggestion": planner_feedback_suggestion(payload.status, payload.progressNote, payload.blocker),
            "actualMinutes": payload.actualMinutes,
        },
        (
            f"# Planner Feedback\n\n"
            f"- Evaluation: {evaluation_id}\n"
            f"- Node: {payload.nodeId}\n"
            f"- Status: {payload.status}\n"
            f"- Minutes: {payload.actualMinutes or 0}\n\n"
            f"## Progress\n\n{payload.progressNote}\n\n"
            f"## Blocker\n\n{payload.blocker or 'None'}\n"
        ),
    )
    return PlannerFeedback(**created)


def commit_all_in_vault(vault_path: str, message: str) -> None:
    MarkdownDB._ensure_git_repo(vault_path)  # type: ignore[attr-defined]
    subprocess.run(["git", "-C", vault_path, "add", "."], check=False, capture_output=True, text=True)
    status = subprocess.run(["git", "-C", vault_path, "status", "--porcelain"], check=False, capture_output=True, text=True)
    if status.stdout.strip():
        subprocess.run(["git", "-C", vault_path, "commit", "-m", message], check=False, capture_output=True, text=True)


def bootstrap_sample_vaults() -> None:
    sample_path = default_sample_vault_path()
    blank_path = default_blank_vault_path()
    MarkdownDB.ensure_vault(sample_path, create_obsidian=True)
    MarkdownDB.ensure_vault(blank_path, create_obsidian=True)

    sample_notes = [
        ("tech/react-rendering", {"title": "React 渲染边界", "domain": "技术", "type": "known", "tags": ["react", "performance"]}, "# React 渲染边界\n\nReact 在组件边界内追踪状态变化，真正影响性能的通常不是框架本身，而是状态范围、渲染粒度和依赖管理。记录这些边界，有助于后续诊断慢渲染、重复请求与错误缓存。"),
        ("tech/rag-evaluation", {"title": "RAG 评测笔记", "domain": "技术", "type": "known", "tags": ["ai", "rag", "evaluation"]}, "# RAG 评测笔记\n\n做检索增强时，答案质量常被模型表现掩盖。真正应该追踪的是召回率、上下文命中、引用稳定性和失败样本。没有评测闭环，再漂亮的演示也无法指导系统改进。"),
        ("design/interface-motion", {"title": "界面动效节奏", "domain": "设计", "type": "known", "tags": ["design", "motion"]}, "# 界面动效节奏\n\n动效不是装饰，而是状态传递。加载、切换和确认这三种动作，如果节奏统一，用户会更容易理解界面的层级变化。反过来，随意加动画只会放大噪音，干扰任务完成。"),
        ("business/pricing-notes", {"title": "定价实验碎片", "domain": "商业", "type": "unknown", "tags": ["pricing", "business"]}, "# 定价实验碎片\n\n同一功能在不同定价层级下，会暴露出完全不同的购买理由。用户愿意付费，不代表他们认同全部价值。记录成交原因、放弃原因和替代方案，才可能形成可靠的商业判断。"),
        ("science/sleep-and-focus", {"title": "睡眠与专注关系", "domain": "科学", "type": "known", "tags": ["science", "health"]}, "# 睡眠与专注关系\n\n专注并不只由意志决定。睡眠不足时，切换成本和拖延概率会一起上升。把任务难度、睡眠质量和完成率并排记录，可以比主观自责更快找到真正影响执行的变量。"),
        ("philosophy/decision-fatigue", {"title": "决策疲劳笔记", "domain": "哲学", "type": "gap", "tags": ["philosophy", "decision"]}, "# 决策疲劳笔记\n\n很多所谓拖延，并不是不想做，而是每次开始前都要重新判断价值、路径和顺序。把高频决策流程外化为模板，能减少心理摩擦，也能让执行不再依赖当天的情绪状态。"),
        ("product/task-loops", {"title": "任务闭环设计", "domain": "产品", "type": "known", "tags": ["product", "workflow"]}, "# 任务闭环设计\n\n一个系统要帮助用户推进任务，至少需要发现、判断、执行、复盘四个阶段。如果界面只展示列表，而不解释下一步为何重要，用户就会停留在整理而不是行动。"),
        ("writing/knowledge-distillation", {"title": "知识蒸馏写作", "domain": "写作", "type": "known", "tags": ["writing", "knowledge"]}, "# 知识蒸馏写作\n\n写作最有价值的部分，不是重复原文，而是把复杂材料压缩成未来仍可调用的判断。每一篇永久笔记都应该回答三个问题：这是什么、为什么重要、以后何时会再次用到。"),
        ("career/feedback-journal", {"title": "反馈日志模板", "domain": "职业", "type": "unknown", "tags": ["career", "feedback"]}, "# 反馈日志模板\n\n收到反馈时，人容易只记住情绪最强的那一句。建立反馈日志后，可以把事件、建议、证据和后续行动拆开记录。长期看，这比一次次临时反思更能形成稳定的成长素材。"),
        ("finance/cashflow-review", {"title": "现金流复盘清单", "domain": "理财", "type": "gap", "tags": ["finance", "review"]}, "# 现金流复盘清单\n\n理财执行常常输在复盘不稳定。收入结构、固定支出、试验性开销和意外事件，如果不按月回顾，很难判断问题是预算失效，还是目标本身就不切实际。"),
    ]

    for item_id, metadata, content in sample_notes:
        MarkdownDB.ensure("notes", item_id, metadata, content, vault_path=sample_path, track=False)

    seeds = {
        "tasks": [
            {"id": "review-react-rendering", "metadata": {"title": "Review React 渲染边界", "domain": "技术", "timeEstimate": 30, "priority": "medium", "status": "todo", "category": "review", "impactScore": 72, "progress": 0}, "content": "- 对照 profiler 结果\n- 标记可拆分组件"},
            {"id": "focus-vault-integration", "metadata": {"title": "完成 Vault 接入设计", "domain": "产品", "timeEstimate": 120, "priority": "high", "status": "in_progress", "category": "focus", "impactScore": 94, "progress": 58}, "content": "- 接 Obsidian vault\n- 挂 git 历史\n- 打通设置面板"},
            {"id": "alert-finance-gap", "metadata": {"title": "补现金流复盘知识缺口", "domain": "理财", "timeEstimate": 45, "priority": "high", "status": "todo", "category": "alert", "impactScore": 80, "progress": 0}, "content": "- 比较月度复盘模板\n- 写一版自己的版本"},
            {"id": "quick-distill-note", "metadata": {"title": "提炼知识蒸馏写作笔记", "domain": "写作", "timeEstimate": 20, "priority": "low", "status": "todo", "category": "quick_win", "impactScore": 60, "progress": 0}, "content": "- 写一条为什么这条判断重要"},
        ],
        "evaluations": [
            {"id": "eval-agent-notes", "metadata": generate_assessment_seed("面向 Obsidian 的 AI 笔记管家"), "content": "# Evaluation\n\n需要验证真实用户是否愿意让系统代为整理。"},
            {"id": "eval-reading-workbench", "metadata": generate_assessment_seed("沉浸式阅读精炼工作台"), "content": "# Evaluation\n\n核心风险在于是否足够高频和可复用。"},
        ],
        "materials": [
            {"id": "material-rag-future", "metadata": {"title": "为什么 RAG 仍然重要", "sourceUrl": "https://example.com/rag", "summary": "文章讨论了长上下文不能完全替代检索增强。", "status": "reading"}, "content": "# 为什么 RAG 仍然重要\n\n文章强调检索、引用和评测依旧是可靠系统的核心。"},
        ],
        "conversations": [
            {"id": "conversation-rag", "metadata": {"title": "RAG 精炼对话", "contextId": "material-rag-future", "messages": [{"role": "assistant", "content": "这篇材料的重点不是模型参数，而是证据链。", "timestamp": now_iso()}]}, "content": "# Conversation\n\n初始精炼对话。"},
        ],
    }

    for collection, items in seeds.items():
        for item in items:
            MarkdownDB.ensure(collection, item["id"], item["metadata"], item["content"], vault_path=sample_path, track=False)

    commit_all_in_vault(sample_path, "bootstrap sample vault")

    config = load_config()
    if not os.path.exists(config["vault"]["activePath"]):
        config["vault"]["activePath"] = sample_path
        save_config(config)


@app.on_event("startup")
async def startup_event() -> None:
    config = load_config()
    ensure_api_config(str(config.get("llm", {}).get("apiConfigPath", API_CONFIG_PATH)))
    bootstrap_sample_vaults()
    MarkdownDB.ensure_vault(MarkdownDB.active_vault_path(), create_obsidian=False)


@app.get("/api/health")
async def health() -> Dict[str, Any]:
    overview = build_dashboard()
    return {"status": "ok", "health": overview.health, "updatedAt": now_iso()}


@app.get("/api/settings", response_model=SettingsPayload)
async def get_settings() -> SettingsPayload:
    return current_settings()


@app.put("/api/settings", response_model=SettingsPayload)
async def update_settings(payload: SettingsUpdate) -> SettingsPayload:
    config = load_config()
    llm_config = config.setdefault("llm", {})
    if payload.activeTheme is not None:
        config["activeTheme"] = payload.activeTheme
    if payload.activeVaultPath:
        MarkdownDB.switch_vault(payload.activeVaultPath)
        config = load_config()
        llm_config = config.setdefault("llm", {})
    if payload.llm is not None:
        config_path = str(llm_config.get("apiConfigPath", API_CONFIG_PATH))
        config["llm"] = {
            "defaultModel": payload.llm.defaultModel,
            "moduleModels": payload.llm.moduleModels.model_dump(),
            "apiConfigPath": config_path,
        }
    save_config(config)
    return current_settings()


@app.get("/api/vaults", response_model=List[VaultSummary])
async def list_vaults() -> List[VaultSummary]:
    return [VaultSummary(**item) for item in MarkdownDB.list_available_vaults()]


@app.post("/api/vaults/create", response_model=VaultSummary, status_code=201)
async def create_vault(payload: VaultCreateRequest) -> VaultSummary:
    return VaultSummary(**MarkdownDB.create_empty_vault(payload.name))


@app.post("/api/vaults/select", response_model=VaultSummary)
async def select_vault(payload: VaultSelectRequest) -> VaultSummary:
    return VaultSummary(**MarkdownDB.switch_vault(payload.path))


@app.get("/api/dashboard/overview", response_model=DashboardOverview)
async def dashboard_overview() -> DashboardOverview:
    return build_dashboard()


@app.get("/api/workspace", response_model=WorkspaceSnapshot)
async def workspace_snapshot() -> WorkspaceSnapshot:
    conversations = MarkdownDB.list("conversations")
    conversation_metas = [
        ConversationMetadata(id=item["id"], title=item["title"], updatedAt=item.get("updatedAt"))
        for item in conversations
    ]
    active = Conversation(**conversations[0]) if conversations else None
    return WorkspaceSnapshot(
        settings=current_settings(),
        overview=build_dashboard(),
        graph=build_blueprint_graph(),
        notes=[Note(**item) for item in MarkdownDB.list("notes")],
        tasks=[Task(**item) for item in MarkdownDB.list("tasks")],
        evaluations=[Evaluation(**item) for item in MarkdownDB.list("evaluations")],
        materials=[Material(**item) for item in MarkdownDB.list("materials")],
        conversationMetas=conversation_metas,
        activeConversation=active,
    )


@app.get("/api/blueprint/graph", response_model=BlueprintGraph)
async def blueprint_graph() -> BlueprintGraph:
    return build_blueprint_graph()


@app.get("/api/config/theme", response_model=ThemeConfig)
async def get_theme() -> ThemeConfig:
    return ThemeConfig(activeTheme=load_config()["activeTheme"])


@app.put("/api/config/theme", response_model=ThemeConfig)
async def update_theme(theme: ThemeConfig) -> ThemeConfig:
    config = load_config()
    config["activeTheme"] = theme.activeTheme
    save_config(config)
    return ThemeConfig(activeTheme=config["activeTheme"])


@app.get("/api/notes", response_model=List[Note])
async def list_notes(
    domain: Optional[str] = None,
    note_type: Optional[NoteType] = Query(default=None, alias="type"),
    search: Optional[str] = None,
) -> List[Note]:
    notes = MarkdownDB.list("notes")
    filtered = []
    for note in notes:
        if domain and note.get("domain") != domain:
            continue
        if note_type and note.get("type") != note_type:
            continue
        if search:
            haystack = f"{note.get('title', '')}\n{note.get('content', '')}".lower()
            if search.lower() not in haystack:
                continue
        filtered.append(Note(**note))
    return filtered


@app.post("/api/notes", response_model=Note, status_code=201)
async def create_note(note: NoteCreate) -> Note:
    created = MarkdownDB.create(
        "notes",
        {"title": note.title, "domain": note.domain, "type": note.type, "tags": normalize_tags(note.tags)},
        note.content,
    )
    return Note(**created)


@app.get("/api/notes/{id}", response_model=Note)
async def get_note(id: str) -> Note:
    id = validate_item_id(id)
    note = MarkdownDB.get("notes", id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return Note(**note)


@app.put("/api/notes/{id}", response_model=Note)
async def update_note(id: str, note_update: NoteUpdate) -> Note:
    id = validate_item_id(id)
    note = MarkdownDB.get("notes", id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    metadata = {key: value for key, value in note.items() if key not in {"id", "content"}}
    content = note.get("content", "")
    if note_update.title is not None:
        metadata["title"] = note_update.title
    if note_update.domain is not None:
        metadata["domain"] = note_update.domain
    if note_update.type is not None:
        metadata["type"] = note_update.type
    if note_update.tags is not None:
        metadata["tags"] = normalize_tags(note_update.tags)
    if note_update.content is not None:
        content = f"{content.rstrip()}\n\n{note_update.content}" if note_update.append and content else note_update.content
    updated = MarkdownDB.save("notes", id, metadata, content)
    return Note(**updated)


@app.get("/api/tasks", response_model=List[Task])
async def list_tasks(status: Optional[TaskStatus] = None, category: Optional[TaskCategory] = None) -> List[Task]:
    tasks = MarkdownDB.list("tasks")
    filtered = []
    for task in tasks:
        if status and task.get("status") != status:
            continue
        if category and task.get("category") != category:
            continue
        filtered.append(Task(**task))
    return filtered


@app.post("/api/tasks", response_model=Task, status_code=201)
async def create_task(task: TaskCreate) -> Task:
    created = MarkdownDB.create("tasks", task.model_dump(), f"# {task.title}\n")
    return Task(**created)


@app.put("/api/tasks/{id}", response_model=Task)
async def update_task(id: str, task_update: TaskUpdate) -> Task:
    id = validate_item_id(id)
    task = MarkdownDB.get("tasks", id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    metadata = {key: value for key, value in task.items() if key not in {"id", "content"}}
    for key, value in task_update.model_dump(exclude_none=True).items():
        metadata[key] = value
    updated = MarkdownDB.save("tasks", id, metadata, task.get("content", ""))
    return Task(**updated)


@app.get("/api/evaluations", response_model=List[Evaluation])
async def list_evaluations() -> List[Evaluation]:
    return [Evaluation(**item) for item in MarkdownDB.list("evaluations")]


@app.post("/api/evaluations", response_model=Evaluation, status_code=201)
async def create_evaluation(payload: EvaluationCreate) -> Evaluation:
    data = generate_assessment(payload.idea)
    created = MarkdownDB.create("evaluations", data, f"# Evaluation for {payload.idea}\n\n请继续验证用户、频率和替代方案。")
    return Evaluation(**created)


@app.get("/api/planner/board", response_model=PlannerBoard)
async def get_planner_board(
    evaluationId: Optional[str] = Query(default=None),
    activeNodeId: Optional[str] = Query(default=None),
) -> PlannerBoard:
    return build_planner_board(evaluation_id=evaluationId, active_node_id=activeNodeId)


@app.post("/api/planner/assign", response_model=PlannerAssignment)
async def assign_planner_task(payload: PlannerAssignRequest) -> PlannerAssignment:
    return planner_assignment_for_minutes(payload.minutes, payload.evaluationId)


@app.get("/api/planner/goals/{evaluationId}/brief", response_model=PlannerBrief)
async def get_planner_brief(evaluationId: str, nodeId: Optional[str] = Query(default=None)) -> PlannerBrief:
    board = build_planner_board(evaluation_id=evaluationId, active_node_id=nodeId)
    return board.brief


@app.get("/api/planner/goals/{evaluationId}/feedback", response_model=List[PlannerFeedback])
async def get_planner_feedback(evaluationId: str) -> List[PlannerFeedback]:
    _ = build_planner_board(evaluation_id=evaluationId)
    return planner_feedback_items(evaluationId)


@app.post("/api/planner/goals/{evaluationId}/feedback", response_model=PlannerFeedback, status_code=201)
async def add_planner_feedback(evaluationId: str, payload: PlannerFeedbackCreate) -> PlannerFeedback:
    _ = build_planner_board(evaluation_id=evaluationId, active_node_id=payload.nodeId)
    return create_planner_feedback(evaluationId, payload)


@app.get("/api/planner/goals/{evaluationId}/schedule", response_model=PlannerSchedule)
async def get_planner_schedule(evaluationId: str) -> PlannerSchedule:
    board = build_planner_board(evaluation_id=evaluationId)
    return board.schedule


@app.post("/api/planner/goals/{evaluationId}/chat", response_model=PlannerBoard)
async def chat_with_planner(evaluationId: str, payload: PlannerChatRequest) -> PlannerBoard:
    board = build_planner_board(evaluation_id=evaluationId)
    create_planner_feedback(
        evaluationId,
        PlannerFeedbackCreate(
            nodeId=board.activeNodeId or board.nodes[0].id,
            taskId=next((node.taskId for node in board.nodes if node.id == board.activeNodeId), None),
            status="adjusted",
            progressNote=payload.message,
            blocker=None,
            actualMinutes=None,
        ),
    )
    return build_planner_board(evaluation_id=evaluationId, active_node_id=board.activeNodeId)


@app.get("/api/refinery/materials", response_model=List[Material])
async def list_materials() -> List[Material]:
    return [Material(**item) for item in MarkdownDB.list("materials")]


@app.get("/api/refinery/settings", response_model=RefinerySettings)
async def get_refinery_settings() -> RefinerySettings:
    return refinery_settings()


@app.put("/api/refinery/settings", response_model=RefinerySettings)
async def update_refinery_settings(payload: RefinerySettingsUpdate) -> RefinerySettings:
    config = load_config()
    config["refinery"]["defaultPrompt"] = payload.defaultPrompt
    save_config(config)
    return refinery_settings()


@app.get("/api/refinery/materials/{id}", response_model=Material)
async def get_material(id: str) -> Material:
    id = validate_item_id(id)
    material = MarkdownDB.get("materials", id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return Material(**material)


@app.put("/api/refinery/materials/{id}", response_model=Material)
async def update_material(id: str, payload: MaterialUpdate) -> Material:
    id = validate_item_id(id)
    material = MarkdownDB.get("materials", id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    metadata = {key: value for key, value in material.items() if key not in {"id", "content"}}
    content = material.get("content", "")
    for key, value in payload.model_dump(exclude_none=True).items():
        if key == "content":
            content = value
        else:
            metadata[key] = value
    updated = MarkdownDB.save("materials", id, metadata, content)
    return Material(**updated)


@app.post("/api/refinery/materials", response_model=Material, status_code=201)
async def add_material(payload: MaterialCreate) -> Material:
    synthesized = synthesize_material(payload)
    created = MarkdownDB.create(
        "materials",
        {
            "title": synthesized["title"],
            "sourceUrl": synthesized["sourceUrl"],
            "summary": synthesized["summary"],
            "report": synthesized["report"],
            "prompt": synthesized["prompt"],
            "status": synthesized["status"],
        },
        synthesized["content"],
    )
    return Material(**created)


@app.post("/api/refinery/intake", response_model=RefinerySession, status_code=201)
async def intake_refinery_material(payload: MaterialCreate) -> RefinerySession:
    material = await add_material(payload)
    conversation = create_refinery_conversation(material.id)
    return RefinerySession(material=material, conversation=conversation, settings=refinery_settings())


@app.get("/api/refinery/conversations", response_model=List[ConversationMetadata])
async def list_conversations() -> List[ConversationMetadata]:
    items = MarkdownDB.list("conversations")
    return [ConversationMetadata(id=item["id"], title=item["title"], updatedAt=item.get("updatedAt")) for item in items]


@app.get("/api/refinery/conversations/{id}", response_model=Conversation)
async def get_conversation(id: str) -> Conversation:
    id = validate_item_id(id)
    conversation = MarkdownDB.get("conversations", id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return Conversation(**conversation)


@app.post("/api/refinery/conversations", response_model=Conversation, status_code=201)
async def start_conversation(payload: ConversationCreate) -> Conversation:
    if payload.contextId and MarkdownDB.get("materials", payload.contextId):
        return create_refinery_conversation(payload.contextId, payload.initialMessage)
    context_title = None
    if payload.contextId:
        note = MarkdownDB.get("notes", payload.contextId)
        context_title = note.get("title") if note else None
    created = MarkdownDB.create(
        "conversations",
        {
            "title": f"精炼对话 {datetime.now().strftime('%m-%d %H:%M')}",
            "contextId": payload.contextId,
            "messages": [
                {"role": "user", "content": payload.initialMessage, "timestamp": now_iso()},
                {"role": "assistant", "content": generate_refinery_reply(payload.initialMessage, context_title), "timestamp": now_iso()},
            ],
        },
        "# AI Refinery Conversation\n\n自动生成的精炼会话。",
    )
    return Conversation(**created)


@app.post("/api/refinery/conversations/{id}/messages", response_model=Conversation)
async def send_message(id: str, payload: MessageCreate) -> Conversation:
    id = validate_item_id(id)
    conversation = MarkdownDB.get("conversations", id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = list(conversation.get("messages", []))
    messages.append({"role": payload.role, "content": payload.content, "timestamp": now_iso()})
    if payload.role == "user":
        context_id = conversation.get("contextId")
        context_item = MarkdownDB.get("materials", context_id) if context_id else None
        if not context_item and context_id:
            context_item = MarkdownDB.get("notes", context_id)
        messages.append(
            {
                "role": "assistant",
                "content": generate_refinery_reply(
                    payload.content,
                    context_item.get("title") if context_item else None,
                    context_item.get("report") if context_item else None,
                    context_item.get("prompt") if context_item else None,
                ),
                "timestamp": now_iso(),
            }
        )
    metadata = {key: value for key, value in conversation.items() if key not in {"id", "content"}}
    metadata["messages"] = messages
    updated = MarkdownDB.save("conversations", id, metadata, conversation.get("content", ""))
    return Conversation(**updated)


@app.post("/api/refinery/conversations/{id}/reset", response_model=Conversation)
async def reset_refinery_conversation(id: str) -> Conversation:
    id = validate_item_id(id)
    conversation = MarkdownDB.get("conversations", id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    material = MarkdownDB.get("materials", conversation.get("contextId", ""))
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    metadata = {key: value for key, value in conversation.items() if key not in {"id", "content"}}
    metadata["messages"] = [
        {"role": "assistant", "content": material.get("report", material.get("summary", "")), "timestamp": now_iso()},
        {
            "role": "assistant",
            "content": generate_refinery_reply(
                "请基于短文本报告继续精炼这份材料。",
                material.get("title"),
                material.get("report"),
                material.get("prompt"),
            ),
            "timestamp": now_iso(),
        },
    ]
    updated = MarkdownDB.save("conversations", id, metadata, conversation.get("content", ""))
    return Conversation(**updated)


@app.post("/api/refinery/conversations/{id}/publish-note", response_model=Note, status_code=201)
async def publish_refinery_note(id: str) -> Note:
    id = validate_item_id(id)
    conversation = MarkdownDB.get("conversations", id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    material = MarkdownDB.get("materials", conversation.get("contextId", ""))
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    transcript = "\n".join(
        f"- {message['role']}: {message['content']}"
        for message in conversation.get("messages", [])
        if message.get("content")
    )
    body = (
        f"# {material['title']}\n\n"
        f"## Source\n\n{material.get('sourceUrl', 'unknown')}\n\n"
        f"## Short Report\n\n{material.get('report', material.get('summary', ''))}\n\n"
        f"## Refinery Conversation\n\n{transcript}\n"
    )
    note = MarkdownDB.create(
        "notes",
        {
            "title": material["title"],
            "domain": infer_domain(body),
            "type": "known",
            "tags": normalize_tags(["refinery", material.get("title", ""), material.get("sourceUrl", "")]),
        },
        body,
    )

    material_metadata = {key: value for key, value in material.items() if key not in {"id", "content"}}
    material_metadata["status"] = "refined"
    MarkdownDB.save("materials", material["id"], material_metadata, material.get("content", ""))
    return Note(**note)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
