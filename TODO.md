# ThoughtCabinet TODO

这份 TODO 只记录当前最值得解决的产品风险，以及针对这些风险的可落地方案。  
目标不是继续堆功能，而是让 ThoughtCabinet 真正配得上 README 里写的那条闭环：

`构建认知 -> 产生 Idea -> 进行实践 -> 更新认知`

---

## P0: 先让系统能跑通一条完整闭环

> **排序理由：** 当前所有 LLM 集成仍是 stub，Fact/Claim 模型尚不存在于代码中。在 LLM 真正接入之前，"可信度"问题是设计层面的，而非实现层面的。相反，如果系统连一条最短闭环都跑不通、普通用户坚持不下来，其他所有战略都没有落地环境。因此：**先可用，再可信，最后可扩展。**

### 1. 模块多、概念玄、流程长，普通人根本坚持不下来

> 原 P1 #3，提升至 P0。理由：没有用户留存，一切认知模型改进都无法验证。

#### 问题本质

- 现在的系统对作者自己很有吸引力，但对普通用户来说认知负担太重。
- "事实 / 观点 / 迷雾 / 连线板 / 评估委员会 / 战术指挥室"这些概念都成立，但不适合一次性全部暴露。
- 如果第一次使用时就要求用户理解整个理论体系，留存会很差。
- 当前代码有 6 个模块页面（Dashboard / Refinery / Organizer / Evaluator / Blueprint / Planner），而 README 只定义了 4 个核心模块。模块映射关系不清晰会让新用户更困惑。

#### 解决方向

- 保留底层模型复杂度，但把表层体验改成"渐进揭示"。
- 默认只暴露最短主路径：
  - Capture（投料）
  - Decide（决策）
  - Do（执行）
  - Review（复盘）
- 复杂概念只在用户真的需要时出现。

#### TODO

- 重新设计默认日常流：
  - `今天想法/材料进来`
  - `系统先帮你整理`
  - `你只决定保留/推进/搁置`
  - `系统给出今天该做什么`
  - `执行后做一句话反馈`
- 给四模块做"新手模式"：
  - Hopper: 只看到输入框和阅读队列
  - Blueprint: 默认只显示"我知道什么 / 我缺什么"
  - Committee: 默认只显示"值不值得做"
  - War Room: 默认只显示"现在做什么"
- 折叠底层术语，把专业概念换成普通语言：
  - `Fact` -> 可验证信息
  - `Claim` -> 当前判断
  - `stale` -> 可能过期
  - `conflict` -> 有冲突
- 增加"今天模式 / Daily Mode"：
  - 只展示 3 个最相关事项
  - 一个输入入口
  - 一个当前判断
  - 一个下一步动作
- 增加"自动草稿优先"策略：
  - 默认由系统先生成整理结果
  - 用户只负责确认和修改
- 做一轮真正的 drop-off 观察：
  - 第一次输入后是否回访
  - 是否完成第一次评估
  - 是否完成第一次任务反馈
  - 卡死在哪一步
- 增加"最小价值闭环"目标：
  - 第一次使用 5 分钟内必须完成一次完整闭环

#### 验收标准

- 新用户第一次使用时，不需要理解全部理论也能完成一次闭环。
- 日常高频路径不超过 3 次主要决策。
- 用户可以长期只用"轻模式"，而系统底层仍然保留结构化能力。

---

### 2. 没有机制保证"实践结果真的能回流修正认知"

> 原 P0 #2，保持 P0。理由：闭环是产品核心承诺，缺了它系统退化为收藏夹。

#### 问题本质

- 当前闭环的最脆弱环节是执行反馈。
- 如果用户懒得手动填反馈，系统就无法知道：
  - 这个项目实际做了什么
  - 原来的判断是否成立
  - 哪些观点被现实验证或推翻
- 闭环一旦断掉，系统就会退化成收藏夹 + 项目列表。
- OpenAPI 中 Planner 的 feedback 端点已定义（`POST /planner/goals/{evaluationId}/feedback`），但缺乏"从反馈到认知更新"的回流机制。

#### 解决方向

- 不能把"认知更新"完全建立在用户手写总结上。
- 要把反馈拆成：
  - 自动采集
  - 低摩擦确认
  - 周期性复盘
- 系统需要主动追问"结果是什么"，而不是等待用户自觉输入。

#### TODO

- 给 War Room 增加"任务结束最小反馈协议"：
  - 完成了什么
  - 没完成什么
  - 新出现了什么事实
  - 哪个旧观点被支持/削弱/推翻
- 设计极低摩擦的反馈方式：
  - 一键选择状态
  - 一句话总结
  - 贴链接/贴截图/贴 commit
  - 语音转文字
- 引入"被动回流"数据源：
  - Git commit / branch / diff
  - 新增文档或输出文件
  - Planner 任务完成记录
  - Evaluator 评估后项目状态变化
- 让系统自动生成候选反馈：
  - "你刚才完成了这 3 个任务，是否意味着这个假设被验证？"
  - "你提交了代码但没有写反馈，要不要让我先生成一版复盘草稿？"
- 增加"认知回流队列"：
  - 所有执行结果先进入待审核队列
  - 用户只需要确认哪些事实和观点应被更新
- 增加"长期未回流提醒"：
  - 某个项目推进很多，但认知层没有任何更新
  - 某条 claim 持续被用于决策，但最近没有新证据
- 在 Blueprint 中显示：
  - 哪些观点最近被现实支持
  - 哪些观点最近被现实削弱
  - 哪些项目还没有产生可回流结果

#### 验收标准

- 用户即使不写长反馈，系统也能通过低摩擦输入和被动信号生成回流候选。
- 每个活跃项目最终都能指向至少一条新的事实、观点修正或"不成立"的记录。
- 系统能明确提醒"执行很多，但没有认知更新"的断裂状态。

---

## P1: 建立认知可信基础设施

> **排序理由：** Fact/Claim/UserStatement 是认知模型的核心骨架，但当前 LLM 集成完全是 stub。这意味着"LLM 编造事实"在短期内不是运行时风险，而是数据模型设计问题。先把数据模型和系统级护栏一起建好，等 LLM 真正接入时才能直接落地。

### 3. LLM 会编造事实，会扭曲用户观点

> 原 P0 #1，调整至 P1。理由：LLM 集成仍是 stub，当前阶段应优先建好数据模型和护栏，而非在没有真实 LLM 调用的情况下做运行时防护。

#### 问题本质

- 现在系统默认相信 LLM 的整理结果，但 LLM 可能把原文中没有的内容写成事实。
- LLM 也可能把用户原本模糊、犹豫、带条件的观点，整理成过度确定的结论。
- 如果不做防护，系统积累的不是认知，而是"看起来很有条理的错误"。

#### 解决方向

- 把"事实"和"观点"彻底拆开，不允许 LLM 直接把整理结果写成最终真相。
- 把"用户原话"也当成独立对象保存，禁止被 LLM 静默改写。
- 所有 LLM 生成内容都先进入候选态，必须带证据、来源和状态。

#### TODO

- 引入 3 类核心对象：
  - `Fact`
  - `Claim`
  - `UserStatement`
- 所有 `Fact` 必须包含：
  - `source`
  - `capturedAt`
  - `evidenceQuote`
  - `evidenceLocation`
  - `confidence`
  - `verificationStatus`
- 所有 `Claim` 必须包含：
  - `supportingFactIds`
  - `opposingFactIds`
  - `assumptionIds`
  - `status`
  - `owner`
- 所有用户输入都先保存原文，不允许只保留 LLM 整理后的版本。
- 在 Hopper / Refinery 中加入"逐条确认"模式：
  - 这是事实
  - 这是观点
  - 这是我说过的话，但 AI 改写了
  - 这条不对，丢弃
- 给 LLM 增加更严格的输出约束：
  - 事实必须指向证据
  - 没证据时只能输出"推测"或"待验证"
  - 不允许把用户语气改成更强结论
- 增加"原文对照视图"：
  - 左边原文/原话
  - 右边候选 fact/claim
  - 中间显示差异
- 增加"认知健康检查"：
  - unsupported claim
  - conflicting claim
  - stale fact
  - duplicated fact

#### 验收标准

- 任意一条事实都能回溯到具体来源。
- 任意一条观点都能看到它依赖了哪些事实。
- 任意一段用户原话都能看到 LLM 是否改写，以及改写前后差异。
- 没有证据的内容不会以"已确认事实"状态进入系统。

---

### 4. 增加系统级护栏，而不是靠单点功能补洞

> 原 P2 #5，提升至 P1。理由：统一状态机、Review Queue、Traceability 是 Fact/Claim 模型的基础设施，应与 #3 同期建设。

#### TODO

- 增加统一对象状态：
  - `draft`
  - `candidate`
  - `verified`
  - `contested`
  - `stale`
  - `archived`
- 增加统一 Review Queue：
  - 待确认事实
  - 待确认观点
  - 待回流反馈
  - 待处理冲突
- 增加统一 Traceability：
  - 每个对象都能回答"它从哪里来""被什么用过""影响了什么"
- 增加统一 Health Dashboard：
  - 未确认比例
  - 过期比例
  - 冲突比例
  - 长期未回流项目
  - 未处理导入笔记

---

## P2: 补齐外部知识库与长期记忆接入

### 5. 没有对接 Obsidian，也没有提供 OpenClaw 接口

> 原 P1 #4，保持 P2。理由：当前系统已经基于 Obsidian-compatible vault 工作（`VaultSummary.isObsidian` 已存在），基本读写能力已有。深度导入和外部系统接口可以在核心闭环验证后再做。

#### 问题本质

- 当前系统还没有真正接住用户已有的知识资产。
- 如果不能导入现有 Obsidian vault，用户会觉得迁移成本太高。
- 如果不能接 OpenClaw 这类 lifetime cognition / memory 系统，ThoughtCabinet 就仍然是一个孤立工作台。

#### 解决方向

- 把"接入已有知识库"作为一级能力，而不是以后再说的扩展功能。
- 第一阶段先解决"只读导入 + 结构化拆分"。
- 第二阶段再做"双向同步"和"长期记忆系统接口"。

#### TODO

- 做 Obsidian Vault Importer：
  - 指定 vault 路径
  - 扫描 markdown、frontmatter、links、tags
  - 建立 note graph
- 设计"已有知识拆分器"：
  - 从旧笔记中提取：
    - `Skill`
    - `Fact`
    - `Claim`
    - `Idea`
    - `Project`
  - 所有拆分结果都必须保留回链到原始 note
- 做导入模式区分：
  - 只读导入
  - 人工确认后纳入结构化对象
  - 后续双向同步
- 在 Blueprint 中显示：
  - 原始 Obsidian 笔记层
  - 结构化 fact/claim 层
  - 两层之间的映射关系
- 给 Hopper 增加"从已有笔记继续精炼"的入口，而不只是新输入。
- 设计 OpenClaw 接口层：
  - 导出 ThoughtCabinet 的 fact/claim/project/feedback
  - 导入 OpenClaw 的长期记忆条目
  - 允许把 War Room / Committee 的结果写回到 lifetime memory
- 先定义一个稳定的 adapter 协议：
  - `list_memories`
  - `upsert_memory`
  - `link_memory_to_fact`
  - `link_memory_to_claim`
  - `list_related_context`
- 在实现细节明确前，先按"OpenClaw 是外部长时记忆系统"这个假设设计接口，不把具体实现写死。

#### 验收标准

- 用户能导入完整 Obsidian vault，并看到结构化拆分候选。
- 任意一个结构化 fact/claim 都能回链到原始 Obsidian note。
- ThoughtCabinet 可以把关键认知对象通过稳定接口暴露给外部 lifetime memory 系统。

---

## 推荐实施顺序

1. 先做新手模式 / Daily Mode + 最短闭环体验，解决"坚持不下来"。
2. 再做 War Room 的低摩擦反馈与认知回流队列，解决"闭环断裂"。
3. 然后做 `Fact / Claim / UserStatement` 数据模型 + 系统级护栏，解决"可信度"。
4. 最后做 Obsidian importer 和 OpenClaw adapter，解决"接不住已有知识资产"。

如果前 2 步没有完成，ThoughtCabinet 仍然更像一个很酷的概念原型，而不是一个能长期托管认知的系统。

---

## 工程任务清单（基于 OpenAPI Spec 与代码现状）

> 以下任务从 `app/openapi.yaml` 定义的 API 合同出发，对照 `app/backend/main.py` 的实际实现和前端类型，拆解为可被 agent 直接执行的工程单元。每个任务标注依赖关系和涉及文件。

### E0: 合同层对齐（前置，阻塞所有后续工作）

#### E0.1 — OpenAPI ↔ 后端路由一致性审计

- **目标：** 确保 `openapi.yaml` 中定义的每条路径都在 `main.py` 中有对应路由，参数、请求体、响应体一一匹配；反之亦然，后端不应有 spec 未声明的路由。
- **当前差距：** 后端存在 `GET /api/workspace` 路由（返回 `WorkspaceSnapshot`），但 openapi.yaml 中未定义此端点。需决定：补入 spec 还是从后端移除。
- **涉及文件：** `app/openapi.yaml`, `app/backend/main.py`
- **产出：** 差异报告 + 修复 PR（选择以 openapi.yaml 为准或以后端为准，统一后锁定）。

#### E0.2 — 前端 types.ts ↔ OpenAPI schemas 一致性审计

- **目标：** 确保 `app/frontend/src/lib/types.ts` 中的每个 interface/type 与 openapi.yaml 的 `components/schemas` 完全同构。
- **当前差距：** 前端有 `WorkspaceSnapshot` 类型，openapi.yaml 中无对应 schema；`AssessmentScores` 和 `Assessment` 在前端独立定义，openapi.yaml 中内联在 `Evaluation` 里。需统一。
- **涉及文件：** `app/frontend/src/lib/types.ts`, `app/openapi.yaml`
- **产出：** 补齐缺失 schema 或删除冗余类型，确保双向同构。

#### E0.3 — 前端 api.ts ↔ OpenAPI operationId 一致性审计

- **目标：** 确保 `app/frontend/src/lib/api.ts` 中的每个函数都对应一个 openapi.yaml 的 operationId，调用路径、HTTP method、参数完全匹配。
- **涉及文件：** `app/frontend/src/lib/api.ts`, `app/openapi.yaml`
- **产出：** 差异报告 + 修复。

---

### E1: Refinery / 投料口（对应 OpenAPI `/refinery/*` 路由组）

#### E1.1 — Refinery intake 真实 LLM 接入

- **目标：** 将 `POST /refinery/intake` 从 stub 逻辑改为真实调用 LLM，基于用户粘贴的 URL/文本生成 report 和 summary。
- **当前状态：** 端点存在，`RefineryIntakeRequest` / `RefinerySession` schema 已定义，但后端返回确定性/规则结果。
- **涉及文件：** `app/backend/main.py`（intake handler）, `app/backend/api_config.py`（LLM 调用配置）
- **依赖：** E0.1（确保路由合同锁定）

#### E1.2 — Conversation 对话真实 LLM 接入

- **目标：** 将 `POST /refinery/conversations/{id}/messages` 从 stub 改为真实 LLM 对话，支持上下文感知的 refinery 问答。
- **当前状态：** 端点存在，消息追加逻辑有，但 AI 响应是确定性的。
- **涉及文件：** `app/backend/main.py`（sendMessage handler）
- **依赖：** E0.1

#### E1.3 — Publish 流程增加 Fact/Claim 提取

- **目标：** 在 `POST /refinery/conversations/{id}/publish-note` 执行时，除了生成 Note，还同时提取并持久化 Fact 和 Claim 对象。
- **前置条件：** 需要先有 Fact/Claim 数据模型（见 E3.1）。
- **涉及文件：** `app/backend/main.py`, `app/backend/db.py`, `app/openapi.yaml`（可能需要扩展 publish 响应）
- **依赖：** E3.1

---

### E2: Planner / 战术指挥室（对应 OpenAPI `/planner/*` 路由组）

#### E2.1 — Planner board 持久化

- **目标：** 当前 `GET /planner/board` 的 `PlannerNode` 树在运行时拼装。改为从持久化的 `planner_state` 文件/目录读取，支持跨会话保持。
- **当前状态：** `PlannerBoard` / `PlannerNode` schema 完整，但数据生命周期不明确。
- **涉及文件：** `app/backend/main.py`, `app/backend/db.py`
- **依赖：** E0.1

#### E2.2 — Planner feedback → 认知回流管线

- **目标：** `POST /planner/goals/{evaluationId}/feedback` 写入反馈后，系统自动检测是否有 Fact/Claim 需要更新，生成回流候选放入 Review Queue。
- **当前状态：** `PlannerFeedback` / `PlannerFeedbackCreate` schema 完整，端点存在，但反馈只是存储，不触发任何下游动作。
- **涉及文件：** `app/backend/main.py`, 新增回流逻辑模块
- **依赖：** E3.1, E3.3

#### E2.3 — Planner chat 真实修改计划

- **目标：** `POST /planner/goals/{evaluationId}/chat` 不再只追加日志，而是让 LLM 真正修改 `PlannerNode` 树结构（新增/删除/重排节点）。
- **涉及文件：** `app/backend/main.py`
- **依赖：** E1.1（LLM 基础设施）, E2.1

#### E2.4 — Planner assign 真实 AI 推荐

- **目标：** `POST /planner/assign` 基于用户给出的可用时间（minutes），由 LLM 从当前 board 中选择最合适的下一个任务并生成 brief。
- **当前状态：** `PlannerAssignRequest` / `PlannerAssignment` schema 完整，端点存在但返回 stub。
- **涉及文件：** `app/backend/main.py`
- **依赖：** E1.1, E2.1

---

### E3: 核心数据模型扩展（OpenAPI 中尚未定义，需新增）

#### E3.1 — 新增 Fact / Claim / UserStatement schema 与 CRUD 端点

- **目标：** 在 openapi.yaml 中新增 `Fact`, `Claim`, `UserStatement` 三个 schema，并定义对应的 CRUD 路由（`/facts`, `/claims`, `/statements`）。同步在后端 `main.py` 和前端 `types.ts` / `api.ts` 中实现。
- **字段参考：** 见本文档 P1 #3 的 TODO 清单。
- **涉及文件：** `app/openapi.yaml`, `app/backend/main.py`, `app/backend/db.py`, `app/frontend/src/lib/types.ts`, `app/frontend/src/lib/api.ts`
- **依赖：** E0.1, E0.2

#### E3.2 — 新增统一对象状态枚举

- **目标：** 在 openapi.yaml 中定义 `ObjectStatus` 枚举（`draft` / `candidate` / `verified` / `contested` / `stale` / `archived`），用于 Fact、Claim 以及其他需要生命周期管理的对象。
- **涉及文件：** `app/openapi.yaml`, `app/frontend/src/lib/types.ts`
- **依赖：** E3.1

#### E3.3 — 新增 Review Queue 端点

- **目标：** 定义 `GET /review-queue`（返回待确认事实、待确认观点、待回流反馈、待处理冲突的聚合列表）和 `POST /review-queue/{id}/resolve`（确认/驳回/合并一条 review item）。
- **涉及文件：** `app/openapi.yaml`, `app/backend/main.py`, `app/frontend/src/lib/types.ts`, `app/frontend/src/lib/api.ts`
- **依赖：** E3.1

---

### E4: Evaluator / 评估委员会（对应 OpenAPI `/evaluations` 路由组）

#### E4.1 — Evaluation 真实 LLM 多视角分析

- **目标：** `POST /evaluations` 提交 idea 后，不再返回硬编码 assessment，而是调用 LLM（可配置多模型）生成 SWOT、scores 和 roastComment。
- **当前状态：** `Evaluation` schema 包含完整 `assessment` 子对象（strengths/weaknesses/opportunities/threats/scores），端点存在但返回 stub。
- **涉及文件：** `app/backend/main.py`
- **依赖：** E1.1（LLM 基础设施）

#### E4.2 — Evaluation 关联 Fact/Claim 作为评估依据

- **目标：** 评估输出中增加 `supportingClaimIds`, `relevantFactIds` 字段，让评估结论可回溯到具体认知依据。
- **涉及文件：** `app/openapi.yaml`（扩展 `Evaluation` schema）, `app/backend/main.py`, `app/frontend/src/lib/types.ts`
- **依赖：** E3.1

---

### E5: Blueprint / 认知蓝图（对应 OpenAPI `/blueprint/*` 路由组）

#### E5.1 — Blueprint 双层图：Fact 层 + Claim 层

- **目标：** 当前 `GET /blueprint/graph` 返回的 `GraphNode` 只有 `known/unknown/gap` 类型。扩展为支持 `fact` / `claim` / `idea` 节点类型，`GraphEdge` 增加 `supports` / `opposes` / `depends` / `derives` 等边类型。
- **涉及文件：** `app/openapi.yaml`（扩展 `GraphNode.type` 和 `GraphEdge.label` 枚举）, `app/backend/main.py`, `app/frontend/src/lib/types.ts`
- **依赖：** E3.1

#### E5.2 — Blueprint 战争迷雾与连线板持久化

- **目标：** 实现 DESIGN 中描述的"战争迷雾"（未纳入体系但相关的内容灰显）和"连线板"（用户手动钉住节点并建立连线）。连线板状态需持久化到 vault 的 `.thoughtcabinet/` 目录。
- **涉及文件：** `app/backend/main.py`, `app/backend/db.py`, 新增前端交互组件
- **依赖：** E5.1

---

### E6: Dashboard / 指挥舱（对应 OpenAPI `/dashboard/*` 路由组）

#### E6.1 — Dashboard 真实认知健康度指标

- **目标：** 当前 `GET /dashboard/overview` 返回的 `DashboardStats` 只有 `totalNotes` / `pendingReview` / `highValue` / `cognitiveGaps`。新增 Fact Health（过期事实占比）、Claim Health（无证据/冲突观点占比）、长期未回流项目数。
- **涉及文件：** `app/openapi.yaml`（扩展 `DashboardStats`）, `app/backend/main.py`, `app/frontend/src/lib/types.ts`
- **依赖：** E3.1

#### E6.2 — Dashboard 认知警报流

- **目标：** `DashboardOverview.cognitiveAlerts` 从 stub 改为真实数据源，显示：环境变化告警、决策漂移告警、长期未回流项目。
- **涉及文件：** `app/backend/main.py`
- **依赖：** E3.1, E3.3

---

### E7: 基础设施

#### E7.1 — 后端 main.py 按领域拆分

- **目标：** 当前 `main.py` 约 1700 行，包含所有模型定义和路由。按领域拆分为独立模块（`routes/refinery.py`, `routes/planner.py`, `routes/evaluator.py`, `routes/blueprint.py`, `routes/dashboard.py`, `models/`），降低合并冲突。
- **涉及文件：** `app/backend/main.py` → 多个新文件
- **依赖：** 无，但应在其他工程任务之前完成以减少冲突。

#### E7.2 — LLM 调用抽象层

- **目标：** 在后端建立统一的 LLM 调用接口（读取 `config.json` 中的 baseUrl / apiKey / moduleModels），支持 OpenAI-compatible API。所有模块的 LLM 调用都通过此层，不各自直接 HTTP 请求。
- **涉及文件：** `app/backend/api_config.py`（已有雏形）, 新增 `app/backend/llm.py`
- **依赖：** 无

#### E7.3 — Playwright E2E 冒烟测试

- **目标：** 用 Python Playwright 编写最小冒烟测试：启动前后端 → 加载首页 → 验证 Dashboard 渲染 → 创建一条 Material → 验证出现在 Refinery 列表。
- **涉及文件：** 新增 `app/backend/tests/e2e_smoke.py`
- **依赖：** 无

---

### 工程任务依赖图（简化）

```
E0.1 ──┬── E0.2 ──┬── E3.1 ──┬── E3.2
       │          │          ├── E3.3 ── E2.2
       │          │          ├── E1.3
       │          │          ├── E4.2
       │          │          ├── E5.1 ── E5.2
       │          │          ├── E6.1
       │          │          └── E6.2
       ├── E1.1 ──┼── E1.2
       │          ├── E4.1
       │          ├── E2.3
       │          └── E2.4
       └── E2.1 ──┘

E7.1 (独立，建议最先执行)
E7.2 (独立，E1.1 的前置)
E7.3 (独立)
```

### 建议执行路径

1. **第一波（基础设施 + 合同锁定）：** E7.1, E7.2, E0.1, E0.2, E0.3 — 可并行
2. **第二波（LLM 接入 + 数据模型）：** E1.1, E1.2, E3.1, E3.2, E2.1 — E7.2 完成后可并行
3. **第三波（闭环管线）：** E3.3, E2.2, E1.3, E2.3, E2.4 — 依赖第二波
4. **第四波（智能层）：** E4.1, E4.2, E5.1, E5.2, E6.1, E6.2 — 依赖第三波
5. **贯穿全程：** E7.3 — 从第一波开始就维护，每波结束扩展覆盖
