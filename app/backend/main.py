from __future__ import annotations

import json
import os
import re
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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
NoteType = Literal["known", "unknown", "gap"]
TaskPriority = Literal["low", "medium", "high"]
TaskStatus = Literal["todo", "in_progress", "done"]
TaskCategory = Literal["review", "focus", "alert", "quick_win"]
EvaluationStatus = Literal["idea", "evaluating", "active", "archived"]
MaterialStatus = Literal["unread", "reading", "refined"]
MessageRole = Literal["user", "assistant", "system"]


class ThemeConfig(BaseModel):
    activeTheme: ThemeName


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


app = FastAPI(title="ThoughtCabinet Core API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONFIG_FILE = os.path.join(BASE_DIR, "data", "config.json")


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def load_config() -> Dict[str, Any]:
    if not os.path.exists(CONFIG_FILE):
        os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
        with open(CONFIG_FILE, "w", encoding="utf-8") as file:
            json.dump({"activeTheme": "NEON"}, file, ensure_ascii=False, indent=2)
    with open(CONFIG_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_config(config: Dict[str, Any]) -> Dict[str, Any]:
    os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as file:
        json.dump(config, file, ensure_ascii=False, indent=2)
    return config


def normalize_tags(tags: Optional[List[str]]) -> List[str]:
    if not tags:
        return []
    seen = set()
    normalized: List[str] = []
    for tag in tags:
        item = tag.strip().lower()
        if item and item not in seen:
            seen.add(item)
            normalized.append(item)
    return normalized


def infer_domain(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["react", "rust", "ai", "rag", "api", "database"]):
        return "技术"
    if any(word in lowered for word in ["product", "app", "market", "用户", "增长"]):
        return "产品"
    if any(word in lowered for word in ["design", "ui", "品牌", "视觉"]):
        return "设计"
    return "General"


def synthesize_material(payload: MaterialCreate) -> Dict[str, str]:
    parsed = urlparse(payload.sourceUrl)
    host = parsed.netloc or "source"
    title = payload.title or parsed.path.strip("/").replace("-", " ").title() or host
    summary = (
        f"{title} 主要讨论了信息提炼、证据链和落地行动三部分，"
        f"适合继续进入 Socratic 精炼流程。"
    )
    content = (
        f"# {title}\n\n"
        f"- Source: {payload.sourceUrl}\n"
        f"- Captured: {now_iso()}\n\n"
        "## 30 秒速读报告\n\n"
        "1. 核心论点：原文试图给出一个可执行的方法，而不是停留在概念层。\n"
        "2. 关键数据：需要进一步验证文中的样本、时间和适用边界。\n"
        "3. 争议点：结论看起来成立，但仍依赖上下文和团队能力。\n\n"
        "## 建议追问\n\n"
        "- 这篇材料和你现有的知识体系有什么冲突？\n"
        "- 哪一句话值得提炼成永久笔记？\n"
        "- 下一步要验证的数据是什么？\n"
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

    strengths = [
        "切入点明确，容易在 30 秒内解释清楚。",
        "可以先用轻量 MVP 验证，而不必一开始追求全栈完备。",
        "如果执行节奏稳定，复利效应会明显。",
    ]
    weaknesses = [
        "差异化还不够尖锐，用户为什么现在就要用它仍需证明。",
        "如果依赖太多 AI 自动化，输出质量可能不稳定。",
        "范围继续扩大就会拖慢交付速度。",
    ]
    opportunities = [
        "个人知识管理和 AI 工作流仍在快速增长。",
        "可从现有笔记或任务场景切入，降低迁移成本。",
        "如果能形成固定仪式，用户留存会更强。",
    ]
    threats = [
        "通用工具已经很多，功能堆叠很容易被替代。",
        "过早复杂化会消耗团队耐心。",
        "若核心价值无法量化，决策会不断摇摆。",
    ]

    if impact >= 80 and feasibility_score >= 75:
        roast = "这次不像玩具，至少有成为项目的资格。问题不在创意，而在你能不能把范围收紧后连续交付。"
        status: EvaluationStatus = "active"
    elif impact >= 75:
        roast = "方向有野心，但现在还是一张漂亮草图。先拆成能在一周内验收的版本，否则又会变成自我感动。"
        status = "evaluating"
    else:
        roast = "目前更像一个功能点，不是产品。除非你能指出明确用户、明确频率、明确替代方案，否则不值得重投入。"
        status = "idea"

    return {
        "idea": idea,
        "impact": impact,
        "feasibility": feasibility_score,
        "domain": domain,
        "status": status,
        "assessment": {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "opportunities": opportunities,
            "threats": threats,
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
        f"基于 {context_title or '当前上下文'}，我会先把你的问题拆成三个层次："
        "\n\n1. 原文到底在声称什么？"
        "\n2. 这个结论成立的条件是什么？"
        "\n3. 哪一部分值得变成你的永久笔记？"
    )
    if re.search(r"总结|summary|tl;dr", message, flags=re.IGNORECASE):
        return (
            f"{summary}\n\n"
            "简版结论：这条材料值得保留，但需要你补一条“为什么这对我重要”的个人判断。"
        )
    if re.search(r"区别|difference|比较", message, flags=re.IGNORECASE):
        return (
            f"{summary}\n\n"
            "比较建议：先写共同目标，再写约束差异，最后写适用场景。这样最容易沉淀成长期可复用的笔记。"
        )
    return (
        f"{summary}\n\n"
        f"你刚才提到“{message[:36]}”，下一步建议是把它改写成一句可验证的判断，再决定是否提取到笔记。"
    )


def build_dashboard() -> DashboardOverview:
    notes = MarkdownDB.list("notes")
    tasks = MarkdownDB.list("tasks")
    evaluations = MarkdownDB.list("evaluations")

    review_queue = [Task(**task) for task in tasks if task.get("category") == "review" and task.get("status") != "done"][:5]
    focus_projects = [Task(**task) for task in tasks if task.get("category") == "focus"][:5]
    cognitive_alerts = [Task(**task) for task in tasks if task.get("category") == "alert"][:5]
    quick_wins = [
        Task(**task)
        for task in tasks
        if task.get("category") == "quick_win" and int(task.get("timeEstimate", 0)) <= 30
    ][:6]

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
                title="知识体系完成一次增量同步",
                description="系统已刷新仪表板、待办队列和认知缺口视图。",
                timestamp=now_iso(),
            )
        )

    high_value = sum(1 for item in evaluations if item.get("impact", 0) >= 75 and item.get("status") != "archived")
    gaps = sum(1 for item in notes if item.get("type") == "gap")
    health = max(88, 100 - max(0, len(cognitive_alerts) * 2) - max(0, gaps - 3))

    return DashboardOverview(
        vaultPath=os.path.abspath(os.path.join(BASE_DIR, "..")),
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
            left_tags = set(left.get("tags", []))
            right_tags = set(right.get("tags", []))
            overlap = sorted(left_tags & right_tags)
            if overlap:
                edges.append(
                    GraphEdge(
                        source=left["id"],
                        target=right["id"],
                        label=f"共享: {', '.join(overlap[:2])}",
                    )
                )
            elif left.get("domain") == right.get("domain") and len(edges) < len(notes) * 2:
                edges.append(
                    GraphEdge(
                        source=left["id"],
                        target=right["id"],
                        label="同领域",
                    )
                )
    return BlueprintGraph(nodes=nodes, edges=edges[:24])


def seed_demo_data() -> None:
    seeds: Dict[str, List[Dict[str, Any]]] = {
        "notes": [
            {
                "id": "react-philosophy",
                "metadata": {
                    "title": "React 设计哲学",
                    "domain": "技术",
                    "type": "known",
                    "tags": ["react", "frontend", "architecture"],
                },
                "content": "# React 设计哲学\n\n组件化、声明式和数据流约束共同决定了系统可维护性。",
            },
            {
                "id": "hooks-revolution",
                "metadata": {
                    "title": "Hooks 的革新",
                    "domain": "技术",
                    "type": "known",
                    "tags": ["react", "hooks", "frontend"],
                },
                "content": "# Hooks 的革新\n\n状态逻辑复用从 mixin/HOC/render props 收敛到了函数组合。",
            },
            {
                "id": "frontend-performance-gap",
                "metadata": {
                    "title": "性能优化缺口",
                    "domain": "技术",
                    "type": "gap",
                    "tags": ["react", "performance", "profiling"],
                },
                "content": "# 性能优化缺口\n\n目前仍缺少对渲染瓶颈、缓存边界和监控策略的系统笔记。",
            },
            {
                "id": "server-components",
                "metadata": {
                    "title": "Server Components 调研",
                    "domain": "技术",
                    "type": "unknown",
                    "tags": ["react", "rsc", "nextjs"],
                },
                "content": "# Server Components 调研\n\n需要区分编译时边界、序列化限制和数据获取模型。",
            },
            {
                "id": "rag-systems",
                "metadata": {
                    "title": "RAG 系统设计要点",
                    "domain": "技术",
                    "type": "known",
                    "tags": ["ai", "rag", "retrieval"],
                },
                "content": "# RAG 系统设计要点\n\n检索质量、上下文压缩和评测闭环是三大核心变量。",
            },
            {
                "id": "web3-payments",
                "metadata": {
                    "title": "Web3 支付碎片",
                    "domain": "产品",
                    "type": "gap",
                    "tags": ["web3", "payments", "product"],
                },
                "content": "# Web3 支付碎片\n\n过去一周的零散记录显示出合并为专题笔记的价值。",
            },
            {
                "id": "design-psychology",
                "metadata": {
                    "title": "产品设计心理学原理",
                    "domain": "设计",
                    "type": "known",
                    "tags": ["design", "psychology", "ux"],
                },
                "content": "# 产品设计心理学原理\n\n认知负荷、峰终定律和反馈设计直接影响转化率。",
            },
        ],
        "tasks": [
            {
                "id": "review-db-performance",
                "metadata": {
                    "title": "评估数据库查询优化方案",
                    "domain": "技术/后端",
                    "timeEstimate": 45,
                    "priority": "high",
                    "status": "todo",
                    "category": "review",
                    "impactScore": 84,
                    "progress": 20,
                },
                "content": "- 比较索引策略\n- 确认慢查询来源",
            },
            {
                "id": "review-rust-note",
                "metadata": {
                    "title": "Review Rust 所有权机制笔记",
                    "domain": "技术/语言",
                    "timeEstimate": 30,
                    "priority": "medium",
                    "status": "todo",
                    "category": "review",
                    "impactScore": 72,
                    "progress": 0,
                },
                "content": "- 补齐生命周期例子\n- 增加和 Go 并发模型对照",
            },
            {
                "id": "focus-thoughtcabinet",
                "metadata": {
                    "title": "ThoughtCabinet 全栈交付",
                    "domain": "产品",
                    "timeEstimate": 120,
                    "priority": "high",
                    "status": "in_progress",
                    "category": "focus",
                    "impactScore": 95,
                    "progress": 62,
                },
                "content": "- 前端完成主题化\n- 后端完成聚合接口\n- 联调构建",
            },
            {
                "id": "focus-ai-workflow",
                "metadata": {
                    "title": "AI 工作流设计整理",
                    "domain": "设计",
                    "timeEstimate": 90,
                    "priority": "high",
                    "status": "in_progress",
                    "category": "focus",
                    "impactScore": 88,
                    "progress": 46,
                },
                "content": "- 明确 Refinery -> Note -> Task 闭环",
            },
            {
                "id": "alert-web3-gap",
                "metadata": {
                    "title": "补足 Web3 支付领域知识断层",
                    "domain": "技术",
                    "timeEstimate": 50,
                    "priority": "high",
                    "status": "todo",
                    "category": "alert",
                    "impactScore": 81,
                    "progress": 0,
                },
                "content": "- 阅读稳定币结算材料\n- 补全支付链路图",
            },
            {
                "id": "alert-distributed-gap",
                "metadata": {
                    "title": "分布式系统一致性理论补课",
                    "domain": "技术",
                    "timeEstimate": 40,
                    "priority": "medium",
                    "status": "todo",
                    "category": "alert",
                    "impactScore": 76,
                    "progress": 0,
                },
                "content": "- 对比 Paxos / Raft\n- 补齐 CAP 误区",
            },
            {
                "id": "quick-rust-ch3",
                "metadata": {
                    "title": "阅读 Rust 并发模型第 3 章",
                    "domain": "技术",
                    "timeEstimate": 25,
                    "priority": "medium",
                    "status": "todo",
                    "category": "quick_win",
                    "impactScore": 66,
                    "progress": 0,
                },
                "content": "- 提炼 3 条可迁移结论",
            },
            {
                "id": "quick-capsule-sort",
                "metadata": {
                    "title": "整理今日闪念笔记",
                    "domain": "个人",
                    "timeEstimate": 15,
                    "priority": "low",
                    "status": "todo",
                    "category": "quick_win",
                    "impactScore": 58,
                    "progress": 0,
                },
                "content": "- 归类、打标签、决定是否进入评估",
            },
            {
                "id": "done-react-doc",
                "metadata": {
                    "title": "完成 React 性能优化文档",
                    "domain": "工作",
                    "timeEstimate": 80,
                    "priority": "high",
                    "status": "done",
                    "category": "focus",
                    "impactScore": 89,
                    "progress": 100,
                },
                "content": "- 输出 15 条优化技巧和观测指标",
            },
        ],
        "evaluations": [
            {
                "id": "eval-finance-assistant",
                "metadata": generate_assessment("AI 个人理财助手"),
                "content": "# Evaluation\n\n需要验证高频使用场景和留存机制。",
            },
            {
                "id": "eval-distributed-notes",
                "metadata": generate_assessment("分布式笔记系统"),
                "content": "# Evaluation\n\n优势在架构深度，风险在需求边界过宽。",
            },
            {
                "id": "eval-testing-framework",
                "metadata": generate_assessment("自动化测试框架"),
                "content": "# Evaluation\n\n若能聚焦 Electron + Web 双端，会更容易形成差异化。",
            },
        ],
        "materials": [
            {
                "id": "rag-future",
                "metadata": {
                    "title": "为什么 RAG 是未来？",
                    "sourceUrl": "https://example.com/blog/rag-future",
                    "summary": "RAG 仍然是构建可靠 AI 应用的关键技术，重点在成本、实时性和可解释性。",
                    "status": "reading",
                },
                "content": "# 为什么 RAG 是未来？\n\n## 核心论点\n\n1. 长上下文不能替代高质量检索。\n2. RAG 让答案来源可追踪。\n3. 未来会是混合架构，而不是二选一。",
            },
            {
                "id": "react19-overview",
                "metadata": {
                    "title": "React 19 新特性速览",
                    "sourceUrl": "https://example.com/blog/react-19-overview",
                    "summary": "重点在 actions、server components 配套能力和表单工作流收敛。",
                    "status": "unread",
                },
                "content": "# React 19 新特性速览\n\n需要重点判断哪些能力适合真实生产环境。",
            },
        ],
        "conversations": [
            {
                "id": "conv-rag-deep-dive",
                "metadata": {
                    "title": "RAG 深挖对话",
                    "contextId": "rag-future",
                    "messages": [
                        {
                            "role": "assistant",
                            "content": "这篇材料核心在于：RAG 不是旧时代方案，而是长上下文时代的配套机制。",
                            "timestamp": now_iso(),
                        },
                        {
                            "role": "user",
                            "content": "用大白话解释一下中间遗忘。",
                            "timestamp": now_iso(),
                        },
                        {
                            "role": "assistant",
                            "content": "就是模型虽然看完了整篇文章，但越靠中间的信息越容易想不起来。",
                            "timestamp": now_iso(),
                        },
                    ],
                },
                "content": "# AI Refinery Conversation\n\n围绕 RAG 和长上下文的精炼对话。",
            }
        ],
    }

    for collection, items in seeds.items():
        for item in items:
            MarkdownDB.ensure(collection, item["id"], item["metadata"], item["content"])


@app.on_event("startup")
async def startup_event() -> None:
    load_config()
    seed_demo_data()


@app.get("/api/health")
async def health() -> Dict[str, Any]:
    overview = build_dashboard()
    return {"status": "ok", "health": overview.health, "updatedAt": now_iso()}


@app.get("/api/dashboard/overview", response_model=DashboardOverview)
async def dashboard_overview() -> DashboardOverview:
    return build_dashboard()


@app.get("/api/blueprint/graph", response_model=BlueprintGraph)
async def blueprint_graph() -> BlueprintGraph:
    return build_blueprint_graph()


@app.get("/api/config/theme", response_model=ThemeConfig)
async def get_theme() -> ThemeConfig:
    return ThemeConfig(**load_config())


@app.put("/api/config/theme", response_model=ThemeConfig)
async def update_theme(theme: ThemeConfig) -> ThemeConfig:
    config = save_config(theme.model_dump())
    return ThemeConfig(**config)


@app.get("/api/notes", response_model=List[Note])
async def list_notes(
    domain: Optional[str] = None,
    type: Optional[NoteType] = Query(default=None),
    search: Optional[str] = None,
) -> List[Note]:
    notes = MarkdownDB.list("notes")
    filtered = []
    for note in notes:
        if domain and note.get("domain") != domain:
            continue
        if type and note.get("type") != type:
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
        {
            "title": note.title,
            "domain": note.domain,
            "type": note.type,
            "tags": normalize_tags(note.tags),
        },
        note.content,
    )
    return Note(**created)


@app.get("/api/notes/{id}", response_model=Note)
async def get_note(id: str) -> Note:
    note = MarkdownDB.get("notes", id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return Note(**note)


@app.put("/api/notes/{id}", response_model=Note)
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
async def list_tasks(
    status: Optional[TaskStatus] = None,
    category: Optional[TaskCategory] = None,
) -> List[Task]:
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
    created = MarkdownDB.create(
        "evaluations",
        data,
        f"# Evaluation for {payload.idea}\n\n请继续验证用户、频率和替代方案。",
    )
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
                {
                    "role": "assistant",
                    "content": generate_refinery_reply(payload.initialMessage, context_title),
                    "timestamp": now_iso(),
                },
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
        context_title = None
        if context_id:
            context_item = MarkdownDB.get("materials", context_id) or MarkdownDB.get("notes", context_id)
            context_title = context_item.get("title") if context_item else None
        messages.append(
            {
                "role": "assistant",
                "content": generate_refinery_reply(payload.content, context_title),
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
