# ThoughtCabinet Next Plan

## Goal

当前阶段不优先继续堆新页面，而是把 ThoughtCabinet 从“模块齐全但很多仍是 demo/启发式逻辑”的状态，推进成一个真正可连续使用的认知操作系统。

产品核心目标：

1. 帮助人类整理自己的认知，减少认知负担，并按领域及内部联系构建知识体系。
2. 帮助人在认知缺乏的地方继续深挖。
3. 在认知混乱时，用已有事实和推论稳定认知；在旧论据站不住脚时，及时更新旧认知。
4. 实现 `idea -> 实践 -> 新事实 -> 认知更新` 的闭环。

---

## Core Product Positioning

### 与 Karpathy / AK 的 LLM Knowledge Base 思路的关系

AK 的方案更偏向“为 LLM 整理领域知识，让 LLM 以后在该领域里做研究、问答、输出 markdown/slides 更强”。

这个方向有很强借鉴意义，但不是 ThoughtCabinet 的最终中心。

### 我们借鉴 AK 的地方

1. `raw -> compiled` 的双层结构是对的。
2. LLM 不只是聊天助手，而应该是知识编译器、知识维护器、知识 lint 工具。
3. 输出应该回流系统，而不是一次性对话后消失。
4. “知识健康检查”应该是系统常态能力，而不是附加功能。
5. 小中型知识库可以先依赖结构化 wiki / 索引 / 简单 search tool，而不是一上来就重 RAG。

### AK 方案没有解决、而我们必须解决的地方

1. 不解决执行层，不覆盖 `idea -> project -> task -> feedback`。
2. 不区分“事实”和“观点”的层级。
3. 不系统解决 stale / duplicate / conflict。
4. 不提供“环境变化 -> 旧推论失效 -> 认知更新”的链路。
5. 更适合 research KB，不足以支撑个人认知与决策系统。

---

## Knowledge Model

### 关键原则

在 ThoughtCabinet 中，`事实` 和 `观点` 不是同级内容。

- `事实 Facts`：有来源、有时间、有证据强度，是引用资料和外部世界状态。
- `观点 Claims`：由事实推导出的判断、理论、经验法则、结论，是认知体系的一等公民。

### 正常工作流应当是

1. 用户不断把新的想法、观察、观点、材料投入系统。
2. 系统同步记录或定位相关证据和事实。
3. LLM 替用户抽取关键事实，并据此生成候选观点/推论。
4. 观点被纳入认知体系，事实作为引用资料链接到观点。
5. 当用户产生新的 idea 时，系统使用过去已验证的观点与经验去评估价值与可行性。
6. 当未来事实不确定时，系统基于已有认知做先验决策。
7. 当现实环境变化导致关键事实改变时，系统提醒相关观点、决策、项目需要复核。
8. 执行反馈再回流，形成新的事实与认知更新。

---

## Next Stage Summary

下一阶段优先做“闭环可用”，而不是继续做大规模架构翻修。

重点是把系统从：

- 材料/笔记/任务/评估/计划的松散页面集合

推进到：

- `Raw input -> Facts -> Claims -> Ideas -> Projects -> Tasks -> Feedback -> Updated Claims`

的真实闭环。

### 实施策略

- 保留当前单壳 NEON 工作台，不在本阶段先做路由重构。
- 先把 `origin/main` 最新 Refinery 改动合入。
- 再冻结共享合同层，按 `1 个主集成者 + 4 个并行 sub-agent` 拆分。

---

## Important Architectural Terms

### 合同层是什么意思

合同层指模块之间已经约定好的接口和数据契约，包括：

- 前端 `types`
- 前端 API client
- 后端请求/响应结构
- 共享持久化对象字段
- frontmatter 里的关联字段
- 各状态枚举和主键关联方式

它的目的，是让多个 sub-agent 能并行开发，而不用互相猜接口。

### 单壳 SPA 是什么意思

当前前端更接近一个“单壳单页应用”：

- 有一个统一 shell
- 在同一个界面中切换 `Dashboard / Refinery / Organizer / Evaluator / Blueprint / Planner`
- 不是按独立 URL 页面拆分

也就是说它更像一个工作台，而不是一个按路由拆开的多页面系统。

### 共享持久化对象是做什么的

共享持久化对象是跨模块共同依赖、不能只存在内存里的中间状态，例如：

- `analysis_jobs`
- `compiler_runs`
- `organizer_suggestions`
- `knowledge_links`
- `blueprint_boards`
- `planner_state`
- `artifacts`

它们的作用，是让模块之间形成真实链路，而不是每次页面打开时临时推导一遍。

---

## Current Repo Reality

### 现状判断

当前项目不是“缺模块页面”，而是六大模块大多都有页面和基础 API，但很多能力仍然是 demo/启发式逻辑，尤其体现在：

- Organizer 深度不足
- Blueprint 主要还是可视化
- Dashboard 缺真实后台任务
- Planner 仍有较多运行时拼装逻辑
- Refinery 正在快速演进，已经是高冲突区

### 远端 main 最新变化

`origin/main` 相比当前工作分支新增 7 个提交，集中在 Refinery：

- `a31c1ce feat(refinery): switch to inline markdown editing`
- `9ad2178 feat(refinery): support full markdown material updates`
- `df48aaf feat(refinery): add editable report controls`
- `4eb7c94 feat(refinery): support editable report and reset`
- `f0e9ea4 feat(refinery): rebuild queue and publish workspace`
- `c14b0a4 feat(refinery): add intake prompt and publish api`
- `7d7f008 fix(neon): stop workspace request loop`

这批改动影响的共享文件包括：

- `app/backend/main.py`
- `app/backend/config_store.py`
- `app/openapi.yaml`
- `app/frontend/src/lib/api.ts`
- `app/frontend/src/lib/types.ts`
- `app/frontend/src/pages/Refinery.tsx`
- `app/frontend/src/themes/neon/index.tsx`

### 这意味着什么

1. Refinery 不再是“从 0 做 intake/publish/editable report”，上游已经做了第一版。
2. 共享文件冲突风险变高。
3. 任何后续并行开发都必须先完成 shared contracts 的主集成。
4. Windows / `api.yaml` / OpenAI-format 调用的改动，需要与 upstream Refinery 合并后再继续扩展。

---

## Proposed Core Data Model

下一阶段建议新增或显式结构化以下对象：

- `RawItem`
- `Fact`
- `Claim`
- `Idea`
- `DecisionRecord`
- `ProjectFeedback`
- `analysis_jobs`
- `organizer_suggestions`
- `knowledge_links`
- `blueprint_boards`
- `planner_state`
- `artifacts`

### Claim 状态建议

- `active`
- `weak`
- `contested`
- `stale`
- `superseded`

### 关系字段建议

- `sourceRawId`
- `sourceMaterialId`
- `sourceConversationId`
- `supportingFactIds`
- `opposingFactIds`
- `assumptionIds`
- `relatedClaimIds`
- `evaluationId`
- `plannerNodeId`
- `artifactType`
- `evidenceIds`

---

## Parallel Workstreams

### 0. Main Integrator / Shared Contracts

主集成者独占这些高冲突文件：

- `app/backend/main.py`
- `app/backend/config_store.py`
- `app/openapi.yaml`
- `app/frontend/src/lib/api.ts`
- `app/frontend/src/lib/types.ts`
- `app/frontend/src/themes/neon/index.tsx`

职责：

1. 合并 `origin/main` 与当前分支。
2. 保留 upstream 最新 Refinery 能力。
3. 保留当前 Windows 启动、`api.yaml`、OpenAI-format LLM 配置。
4. 冻结共享合同和共享持久化对象。
5. 把后端大文件按领域拆开，降低后续冲突。

### 1. Sub-agent A：Refinery -> Facts / Claims 编译流

在最新 upstream Refinery 基础上继续深化，不重复造现有 intake/publish/editor。

职责：

1. intake 支持 URL 和 raw text。
2. 在发布时同时生成：
   - markdown
   - structured facts
   - structured claims
   - evidence links
3. 对话中允许显式标注：
   - 事实
   - 观点
   - 假设
4. 发布结果可回查 raw/source，而不是只有 prose。

### 2. Sub-agent B：Organizer + Cognitive Integrity

职责：

1. 自动分类 notes / facts / claims。
2. 识别并持久化：
   - duplicate
   - conflict
   - stale
   - unsupported
3. 当事实变化时，自动找出受影响的 claims / ideas / decisions。
4. 生成 review tasks：
   - merge facts
   - merge claims
   - refresh stale claim
   - challenge claim
   - fill missing evidence

### 3. Sub-agent C：Evaluator + Decision Records + Planner

职责：

1. Evaluator 主要基于 claims 做判断，而不是直接扫 note 文本。
2. 评估输出必须包含：
   - supporting claims
   - assumptions
   - unknown future facts
   - validation tasks
3. Planner 改为持久化 `planner_state`。
4. Planner chat 真正修改 plan，而不只是追加日志。
5. 新建 `DecisionRecord`，记录“当时为什么这么判断”。

### 4. Sub-agent D：Dashboard + Blueprint + Alerts

职责：

1. Dashboard 显示真实认知健康度，而不是只看 notes/tasks 计数。
2. 新增：
   - Fact Health
   - Claim Health
   - Environment Change Alerts
   - Decision Drift Alerts
3. Blueprint 改成双层图：
   - facts graph
   - claims graph
4. `Analyze` 任务刷新 integrity checks、claim status、impact graph。
5. Detective wall 的 board 和 connection 持久化。

---

## Test Priorities

1. `Refinery intake -> publish -> fact/claim generation`
2. `Fact change -> affected claims become stale/contested`
3. `Idea evaluation -> planner assignment -> feedback -> new facts`
4. `Dashboard/Blueprint` 对 stale/conflict/impact 变化的展示
5. Windows/macOS 启动与 smoke test
6. `api.yaml` 配置与 latest upstream Refinery 的兼容性

---

## Important References

### Repo / Architecture References

- [README.md](D:\AllCode\thought-cabinet\README.md)
- [app/backend/main.py](D:\AllCode\thought-cabinet\app\backend\main.py)
- [app/backend/config_store.py](D:\AllCode\thought-cabinet\app\backend\config_store.py)
- [app/backend/db.py](D:\AllCode\thought-cabinet\app\backend\db.py)
- [app/openapi.yaml](D:\AllCode\thought-cabinet\app\openapi.yaml)
- [app/frontend/src/themes/neon/index.tsx](D:\AllCode\thought-cabinet\app\frontend\src\themes\neon\index.tsx)
- [app/frontend/src/pages/Refinery.tsx](D:\AllCode\thought-cabinet\app\frontend\src\pages\Refinery.tsx)
- [app/frontend/src/pages/Organizer.tsx](D:\AllCode\thought-cabinet\app\frontend\src\pages\Organizer.tsx)
- [app/frontend/src/pages/Evaluator.tsx](D:\AllCode\thought-cabinet\app\frontend\src\pages\Evaluator.tsx)
- [app/frontend/src/pages\Blueprint.tsx](D:\AllCode\thought-cabinet\app\frontend\src\pages\Blueprint.tsx)
- [app/frontend/src/pages/Planner.tsx](D:\AllCode\thought-cabinet\app\frontend\src\pages\Planner.tsx)
- [app/frontend/src/lib/api.ts](D:\AllCode\thought-cabinet\app\frontend\src\lib\api.ts)
- [app/frontend/src/lib/types.ts](D:\AllCode\thought-cabinet\app\frontend\src\lib\types.ts)

### Git References

- Current branch commit:
  - `62e3c59 Add Windows dev launcher and YAML LLM config`
- Latest upstream planner/base:
  - `aa460cb feat(planner): build tactical wall workspace`
- Latest upstream refinery line:
  - `a31c1ce feat(refinery): switch to inline markdown editing`
  - `9ad2178 feat(refinery): support full markdown material updates`
  - `df48aaf feat(refinery): add editable report controls`
  - `4eb7c94 feat(refinery): support editable report and reset`
  - `f0e9ea4 feat(refinery): rebuild queue and publish workspace`
  - `c14b0a4 feat(refinery): add intake prompt and publish api`
  - `7d7f008 fix(neon): stop workspace request loop`

### External / Product Thinking References

- User-provided AK / Karpathy X post:
  - “LLM Knowledge Bases”, Apr 3, 2026, 4:42 AM
- Secondary public writeups referenced during planning:
  - https://academy.dair.ai/blog/llm-knowledge-bases-karpathy
  - https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an/

### Key Product Interpretation Notes

- AK 的方案强在 research KB，不覆盖执行层。
- ThoughtCabinet 的核心不是“帮 LLM 学领域知识”，而是“帮人维护可更新的认知系统”。
- 因此我们必须把 `事实` 与 `观点` 分层，并解决：
  - stale
  - duplicate
  - conflict
  - unsupported
  - environment change impact
  - idea -> practice -> cognition feedback loop


