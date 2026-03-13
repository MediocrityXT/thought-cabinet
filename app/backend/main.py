from __future__ import annotations

import json
import os
import re
import subprocess
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config_store import MODULE_KEYS, default_blank_vault_path, default_sample_vault_path, load_config, save_config
from db import MarkdownDB

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
    status: MaterialStatus
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class MaterialCreate(BaseModel):
    sourceUrl: str
    title: Optional[str] = None


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


app = FastAPI(title="ThoughtCabinet Core API", version="2.0.0")

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


def synthesize_material(payload: MaterialCreate) -> Dict[str, str]:
    parsed = urlparse(payload.sourceUrl)
    host = parsed.netloc or "source"
    title = payload.title or parsed.path.strip("/").replace("-", " ").title() or host
    summary = f"{title} 主要讨论了问题背景、证据链和可执行动作三部分，适合进入 Socratic 精炼流程。"
    content = (
        f"# {title}\n\n"
        f"- Source: {payload.sourceUrl}\n"
        f"- Captured: {now_iso()}\n\n"
        "## 30 秒速读报告\n\n"
        "1. 核心论点：作者试图给出可执行的工作流，而不是抽象口号。\n"
        "2. 关键数据：需要验证样本范围、时间窗口和适用前提。\n"
        "3. 争议点：结论是否可迁移到你的语境，还需要对照现有知识库。\n\n"
        "## 建议提问\n\n"
        "- 这篇材料和你已有哪条判断冲突？\n"
        "- 哪一句话值得萃取成永久笔记？\n"
        "- 下一步要补的证据是什么？\n"
    )
    return {"title": title, "summary": summary, "content": content, "status": "unread"}


def generate_assessment(idea: str) -> Dict[str, Any]:
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


def generate_refinery_reply(message: str, context_title: Optional[str]) -> str:
    summary = (
        f"基于 {context_title or '当前上下文'}，我会先把问题拆成三个层次："
        "\n\n1. 原文到底在声称什么？"
        "\n2. 这个结论成立的前提是什么？"
        "\n3. 哪一部分值得提炼成你的永久笔记？"
    )
    if re.search(r"总结|summary|tl;dr", message, flags=re.IGNORECASE):
        return f"{summary}\n\n简版结论：这条材料值得保留，但需要补一句“为什么这对我重要”。"
    if re.search(r"区别|difference|比较", message, flags=re.IGNORECASE):
        return f"{summary}\n\n比较建议：先写共同目标，再写约束差异，最后写适用边界。"
    return f"{summary}\n\n你刚才提到“{message[:36]}”，下一步建议把它改写成一句可验证判断。"


def current_settings() -> SettingsPayload:
    config = load_config()
    return SettingsPayload(
        activeTheme=config["activeTheme"],
        vault=VaultSummary(**MarkdownDB.get_vault_summary()),
        availableVaults=[VaultSummary(**item) for item in MarkdownDB.list_available_vaults()],
        llm=LLMSettings(
            baseUrl=config["llm"]["baseUrl"],
            apiKey=config["llm"]["apiKey"],
            defaultModel=config["llm"]["defaultModel"],
            moduleModels=ModuleModels(**config["llm"]["moduleModels"]),
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
            {"id": "eval-agent-notes", "metadata": generate_assessment("面向 Obsidian 的 AI 笔记管家"), "content": "# Evaluation\n\n需要验证真实用户是否愿意让系统代为整理。"},
            {"id": "eval-reading-workbench", "metadata": generate_assessment("沉浸式阅读精炼工作台"), "content": "# Evaluation\n\n核心风险在于是否足够高频和可复用。"},
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
    if payload.activeTheme is not None:
        config["activeTheme"] = payload.activeTheme
    if payload.activeVaultPath:
        MarkdownDB.switch_vault(payload.activeVaultPath)
        config = load_config()
    if payload.llm is not None:
        config["llm"] = {
            "baseUrl": payload.llm.baseUrl,
            "apiKey": payload.llm.apiKey,
            "defaultModel": payload.llm.defaultModel,
            "moduleModels": payload.llm.moduleModels.model_dump(),
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


@app.get("/api/notes/{id:path}", response_model=Note)
async def get_note(id: str) -> Note:
    note = MarkdownDB.get("notes", id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return Note(**note)


@app.put("/api/notes/{id:path}", response_model=Note)
async def update_note(id: str, note_update: NoteUpdate) -> Note:
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


@app.get("/api/refinery/materials", response_model=List[Material])
async def list_materials() -> List[Material]:
    return [Material(**item) for item in MarkdownDB.list("materials")]


@app.get("/api/refinery/materials/{id}", response_model=Material)
async def get_material(id: str) -> Material:
    material = MarkdownDB.get("materials", id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return Material(**material)


@app.post("/api/refinery/materials", response_model=Material, status_code=201)
async def add_material(payload: MaterialCreate) -> Material:
    synthesized = synthesize_material(payload)
    created = MarkdownDB.create(
        "materials",
        {
            "title": synthesized["title"],
            "sourceUrl": payload.sourceUrl,
            "summary": synthesized["summary"],
            "status": synthesized["status"],
        },
        synthesized["content"],
    )
    return Material(**created)


@app.get("/api/refinery/conversations", response_model=List[ConversationMetadata])
async def list_conversations() -> List[ConversationMetadata]:
    items = MarkdownDB.list("conversations")
    return [ConversationMetadata(id=item["id"], title=item["title"], updatedAt=item.get("updatedAt")) for item in items]


@app.get("/api/refinery/conversations/{id}", response_model=Conversation)
async def get_conversation(id: str) -> Conversation:
    conversation = MarkdownDB.get("conversations", id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return Conversation(**conversation)


@app.post("/api/refinery/conversations", response_model=Conversation, status_code=201)
async def start_conversation(payload: ConversationCreate) -> Conversation:
    context_title = None
    if payload.contextId:
        material = MarkdownDB.get("materials", payload.contextId) or MarkdownDB.get("notes", payload.contextId)
        context_title = material.get("title") if material else None
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
                "content": generate_refinery_reply(payload.content, context_item.get("title") if context_item else None),
                "timestamp": now_iso(),
            }
        )
    metadata = {key: value for key, value in conversation.items() if key not in {"id", "content"}}
    metadata["messages"] = messages
    updated = MarkdownDB.save("conversations", id, metadata, conversation.get("content", ""))
    return Conversation(**updated)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
