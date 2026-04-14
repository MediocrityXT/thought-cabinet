import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MessageSquareText,
  Play,
  Route,
  Send,
  Target,
  TimerReset,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Evaluation, PlannerBoard, PlannerFeedbackCreate, PlannerNode, PlannerScheduleBlock } from '@/lib/types';

interface PlannerProps {
  board: PlannerBoard | null;
  evaluations: Evaluation[];
  loading: boolean;
  submitting: boolean;
  selectedGoalId: string | null;
  onSelectGoal: (evaluationId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onAssign: (minutes: number) => void;
  onSendFeedback: (payload: PlannerFeedbackCreate) => void;
  onSendChat: (message: string) => void;
}

const timeSlots = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '60 min', minutes: 60 },
  { label: '120 min', minutes: 120 },
];

function formatDdl(value?: string) {
  if (!value) {
    return '未设定';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatDdlFull(value?: string) {
  if (!value) {
    return '未设定';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function statusLabel(status: PlannerNode['status']) {
  switch (status) {
    case 'todo':
      return '待命';
    case 'in_progress':
      return '执行中';
    case 'done':
      return '完成';
    case 'blocked':
      return '阻塞';
    default:
      return status;
  }
}

function statusTone(status: PlannerNode['status']) {
  switch (status) {
    case 'done':
      return 'border-emerald/30 bg-emerald/10 text-emerald';
    case 'in_progress':
      return 'border-cyan/30 bg-cyan/10 text-cyan';
    case 'blocked':
      return 'border-rose/30 bg-rose/10 text-rose';
    default:
      return 'border-purple/30 bg-purple/10 text-purple';
  }
}

function energyTone(energy: PlannerScheduleBlock['energy']) {
  switch (energy) {
    case 'high':
      return 'border-cyan/30 bg-cyan/10 text-cyan';
    case 'medium':
      return 'border-purple/30 bg-purple/10 text-purple';
    default:
      return 'border-amber/30 bg-amber/10 text-amber';
  }
}

/* ── Tree node cards with depth-aware sizing ── */

function RootNodeCard({ node, active, onSelect }: { node: PlannerNode; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative w-full overflow-hidden rounded-[24px] border p-6 text-left transition-all duration-300 hover:-translate-y-0.5',
        active ? 'border-cyan bg-cyan/12 shadow-glow-cyan' : 'border-white/10 bg-panel/90 hover:border-cyan/30 hover:bg-elevated',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-cyan-purple opacity-70" />
      <div className="mb-3 flex items-center gap-3">
        <Target className="h-5 w-5 shrink-0 text-cyan" />
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-cyan/80">战略目标</span>
        <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-[0.22em]', statusTone(node.status))}>
          {statusLabel(node.status)}
        </span>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-cyan">{node.title}</h2>
      <p className="mb-4 line-clamp-3 text-sm leading-6 text-star-dust">{node.detail}</p>
      <div className="flex items-center gap-4 text-xs text-star-dust">
        <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-cyan" />截止 {formatDdlFull(node.ddl)}</span>
        <span>预估 {node.timeEstimate} 分钟</span>
        {node.taskId ? <span className="text-white/70">已关联任务</span> : null}
      </div>
    </button>
  );
}

function BranchNodeCard({ node, active, onSelect }: { node: PlannerNode; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5',
        active ? 'border-cyan bg-cyan/12 shadow-glow-cyan' : 'border-white/8 bg-panel/80 hover:border-cyan/30 hover:bg-elevated',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-cyan-purple opacity-60" />
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.22em]', statusTone(node.status))}>
            {statusLabel(node.status)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-purple/70">战术路径</span>
        </div>
        <ArrowRight className={cn('h-4 w-4 shrink-0 transition-transform', active ? 'text-cyan' : 'text-star-dust group-hover:translate-x-0.5 group-hover:text-cyan')} />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white transition-colors group-hover:text-cyan">{node.title}</h3>
      <p className="mb-3 line-clamp-2 text-sm leading-6 text-star-dust">{node.detail}</p>
      <div className="flex items-center justify-between text-xs text-star-dust">
        <span>DDL {formatDdl(node.ddl)}</span>
        <span>T+{node.timeEstimate}m</span>
      </div>
    </button>
  );
}

function LeafNodeCard({ node, active, onSelect }: { node: PlannerNode; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5',
        active ? 'border-cyan bg-cyan/12 shadow-glow-cyan' : 'border-white/8 bg-elevated/70 hover:border-cyan/30 hover:bg-elevated',
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={cn('rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]', statusTone(node.status))}>
          {statusLabel(node.status)}
        </span>
        <span className="text-[10px] text-star-dust">T+{node.timeEstimate}m</span>
      </div>
      <h4 className="mb-1 text-sm font-medium text-white transition-colors group-hover:text-cyan">{node.title}</h4>
      <p className="line-clamp-2 text-xs leading-5 text-star-dust">{node.detail}</p>
    </button>
  );
}

/* ── Modal: Mission Brief + Feedback ── */

function NodeBriefModal({
  board,
  activeNode,
  submitting,
  onSendFeedback,
  onClose,
}: {
  board: PlannerBoard;
  activeNode: PlannerNode;
  submitting: boolean;
  onSendFeedback: (payload: PlannerFeedbackCreate) => void;
  onClose: () => void;
}) {
  const [feedbackStatus, setFeedbackStatus] = useState<PlannerFeedbackCreate['status']>('progress');
  const [progressNote, setProgressNote] = useState('');
  const [blocker, setBlocker] = useState('');
  const [actualMinutes, setActualMinutes] = useState('30');

  function submitFeedback() {
    if (!progressNote.trim()) {
      return;
    }
    onSendFeedback({
      nodeId: activeNode.id,
      taskId: activeNode.taskId,
      status: feedbackStatus,
      progressNote: progressNote.trim(),
      blocker: blocker.trim() || undefined,
      actualMinutes: Number.isNaN(Number(actualMinutes)) ? undefined : Number(actualMinutes),
    });
    setProgressNote('');
    setBlocker('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/10 bg-panel shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-panel/95 px-6 py-4 backdrop-blur-md">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-star-dust">
              <Route className="h-3.5 w-3.5 text-cyan" />
              {activeNode.depth === 0 ? '战略目标' : activeNode.depth === 1 ? '战术路径' : '执行任务'}
            </div>
            <h2 className="text-lg font-semibold text-white">{activeNode.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-star-dust transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Mission Brief */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">任务简报</h3>
              <button
                onClick={() => onSendFeedback({ nodeId: activeNode.id, taskId: activeNode.taskId, status: 'started', progressNote: `开始执行：${board.brief.title}` })}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-cyan/18 px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/24 disabled:opacity-60"
              >
                <Play className="h-3.5 w-3.5" />
                开始执行
              </button>
            </div>

            <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan">最小交付</div>
              <p className="text-sm leading-6 text-white">{board.brief.minimumOutcome}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-elevated/80 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-purple">上下文摘要</div>
              <p className="text-sm leading-6 text-star-dust">{board.brief.contextSummary}</p>
            </div>

            {board.brief.docLinks.length > 0 || board.brief.prerequisiteNotes.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-elevated/80 p-4">
                <div className="mb-3 text-xs uppercase tracking-[0.22em] text-star-dust">文档与前置材料</div>
                <div className="space-y-2">
                  {board.brief.docLinks.map((link) => (
                    <a key={link} href={link} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-cyan transition-colors hover:border-cyan/20 hover:bg-cyan/10">
                      {link}
                    </a>
                  ))}
                  {board.brief.prerequisiteNotes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80">{note.title}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Feedback */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <MessageSquareText className="h-4 w-4 text-purple" />
              执行反馈流
            </div>

            {board.feedback.length > 0 ? (
              <div className="space-y-3">
                {board.feedback.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/8 bg-elevated/75 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className={cn('rounded-full border px-2 py-1 uppercase tracking-[0.2em]', statusTone(item.status === 'progress' ? 'in_progress' : item.status === 'blocked' ? 'blocked' : item.status === 'done' ? 'done' : 'todo'))}>
                        {item.status}
                      </span>
                      <span className="text-star-dust">{item.actualMinutes ? `${item.actualMinutes} min` : 'session'}</span>
                    </div>
                    <p className="text-sm leading-6 text-white/85">{item.progressNote}</p>
                    {item.blocker ? <p className="mt-2 text-sm text-rose">阻塞: {item.blocker}</p> : null}
                    <p className="mt-2 text-xs leading-5 text-star-dust">AI 建议: {item.nextSuggestion}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="space-y-3 rounded-2xl border border-white/8 bg-elevated/80 p-4">
              <select
                value={feedbackStatus}
                onChange={(event) => setFeedbackStatus(event.target.value as PlannerFeedbackCreate['status'])}
                className="w-full rounded-xl border border-white/8 bg-panel px-3 py-2 text-sm text-white focus:border-cyan focus:outline-none"
              >
                <option value="progress">进展反馈</option>
                <option value="blocked">阻塞反馈</option>
                <option value="done">完成反馈</option>
                <option value="adjusted">计划调整</option>
              </select>
              <textarea
                value={progressNote}
                onChange={(event) => setProgressNote(event.target.value)}
                rows={3}
                placeholder="这次执行推进了什么，卡在哪里？"
                className="w-full rounded-2xl border border-white/8 bg-panel px-4 py-3 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={blocker}
                  onChange={(event) => setBlocker(event.target.value)}
                  placeholder="可选：阻塞项"
                  className="w-full rounded-xl border border-white/8 bg-panel px-4 py-3 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                />
                <input
                  value={actualMinutes}
                  onChange={(event) => setActualMinutes(event.target.value)}
                  placeholder="实际耗时（分钟）"
                  className="w-full rounded-xl border border-white/8 bg-panel px-4 py-3 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                />
              </div>
              <button
                onClick={submitFeedback}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-cyan-purple px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                提交执行反馈
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Planner ── */

export function Planner({
  board,
  evaluations,
  loading,
  submitting,
  selectedGoalId,
  onSelectGoal,
  onSelectNode,
  onAssign,
  onSendFeedback,
  onSendChat,
}: PlannerProps) {
  const [selectedTime, setSelectedTime] = useState(30);
  const [showBrief, setShowBrief] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const selectedGoal = useMemo(
    () => evaluations.find((evaluation) => evaluation.id === (selectedGoalId ?? board?.evaluationId)) ?? evaluations[0] ?? null,
    [board?.evaluationId, evaluations, selectedGoalId],
  );
  const root = board?.nodes.find((node) => node.depth === 0) ?? null;
  const branches = board?.nodes.filter((node) => node.depth === 1) ?? [];
  const leaves = board?.nodes.filter((node) => node.depth === 2) ?? [];
  const activeNode = board?.nodes.find((node) => node.id === board.activeNodeId) ?? null;
  const completion = board?.nodes.length ? Math.round((board.nodes.filter((node) => node.status === 'done').length / board.nodes.length) * 100) : 0;

  function handleNodeClick(nodeId: string) {
    onSelectNode(nodeId);
    setShowBrief(true);
  }

  function submitChat() {
    if (!chatMessage.trim()) {
      return;
    }
    onSendChat(chatMessage.trim());
    setChatMessage('');
  }

  if (loading && !board) {
    return (
      <div className="flex h-full items-center justify-center bg-deep">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan/20 bg-panel px-5 py-4 text-white shadow-glow-cyan">
          <LoaderCircle className="h-5 w-5 animate-spin text-cyan" />
          <span>战术指挥室同步中...</span>
        </div>
      </div>
    );
  }

  if (!board || !selectedGoal) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-star-dust">
        先在价值四象限里选择一个项目，Planner 才能展开国策树与自动排程。
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.1),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_30%)] p-6 animate-fade-in">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* ── Project selector + Time assignment ── */}
        <section className="rounded-[28px] border border-white/8 bg-panel/80 p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {evaluations.map((evaluation) => (
                  <button
                    key={evaluation.id}
                    onClick={() => onSelectGoal(evaluation.id)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm transition-all',
                      board.evaluationId === evaluation.id
                        ? 'border-cyan/40 bg-cyan/12 text-cyan shadow-glow-cyan'
                        : 'border-white/8 bg-white/5 text-star-dust hover:border-cyan/20 hover:text-white',
                    )}
                  >
                    {evaluation.idea}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.28em] text-star-dust">{selectedGoal.domain}</span>
                </div>
                <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-white">{board.goalTitle}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-star-dust">
                  <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan" />总目标截止 {formatDdlFull(board.goalDdl)}</span>
                  <span className="flex items-center gap-2"><Target className="h-4 w-4 text-purple" />影响 {selectedGoal.impact} / 可行 {selectedGoal.feasibility}</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald" />完成度 {completion}%</span>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-cyan/30 bg-[radial-gradient(circle,rgba(0,212,255,0.22),rgba(8,16,32,0.94)_72%)] p-5 shadow-glow-cyan">
              <div className="mb-3 text-center text-xs uppercase tracking-[0.28em] text-star-dust">I Have Time</div>
              <button
                onClick={() => onAssign(selectedTime)}
                disabled={submitting}
                className="relative flex h-36 w-36 items-center justify-center rounded-full border border-cyan/35 bg-cyan/10 text-center text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                <span className="absolute inset-2 rounded-full border border-cyan/20 animate-ping" />
                <span className="absolute inset-0 rounded-full border border-cyan/30 animate-pulse" />
                <span className="relative">
                  <Zap className="mx-auto mb-2 h-5 w-5 text-cyan" />
                  <span className="block text-lg font-semibold">{selectedTime} min</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-star-dust">Auto Assign</span>
                </span>
              </button>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.minutes}
                    onClick={() => setSelectedTime(slot.minutes)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-xs transition-all',
                      selectedTime === slot.minutes
                        ? 'border-cyan/40 bg-cyan/12 text-cyan'
                        : 'border-white/8 bg-white/5 text-star-dust hover:text-white',
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── National Focus Tree ── */}
        <section className="space-y-6 rounded-[28px] border border-white/8 bg-panel/75 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-star-dust">
                <Route className="h-4 w-4 text-cyan" />
                国策树
              </div>
              <p className="text-xs text-star-dust/70">点击任意节点查看任务简报</p>
            </div>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin text-cyan" /> : null}
          </div>

          <div className="rounded-[24px] border border-white/8 bg-deep/80 p-6">
            {root ? (
              <div className="space-y-8">
                {/* Level 0: Strategic Goal */}
                <div className="mx-auto max-w-3xl">
                  <RootNodeCard node={root} active={root.id === board.activeNodeId} onSelect={() => handleNodeClick(root.id)} />
                </div>

                {/* Connector */}
                {branches.length > 0 ? (
                  <div className="flex justify-center">
                    <div className="h-8 w-px bg-gradient-to-b from-cyan/40 to-transparent" />
                  </div>
                ) : null}

                {/* Level 1: Tactical Paths */}
                {branches.length > 0 ? (
                  <div>
                    <div className="mb-3 text-center text-[10px] uppercase tracking-[0.3em] text-purple/60">战术路径</div>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {branches.map((node) => (
                        <BranchNodeCard key={node.id} node={node} active={node.id === board.activeNodeId} onSelect={() => handleNodeClick(node.id)} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Connector */}
                {leaves.length > 0 ? (
                  <div className="flex justify-center">
                    <div className="h-6 w-px bg-gradient-to-b from-purple/30 to-transparent" />
                  </div>
                ) : null}

                {/* Level 2: Execution Tasks */}
                {leaves.length > 0 ? (
                  <div>
                    <div className="mb-3 text-center text-[10px] uppercase tracking-[0.3em] text-star-dust/50">执行任务</div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {leaves.map((node) => (
                        <LeafNodeCard key={node.id} node={node} active={node.id === board.activeNodeId} onSelect={() => handleNodeClick(node.id)} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Status Tracking: Schedule + Heatmap + AI Chat ── */}
        <section className="rounded-[28px] border border-white/8 bg-panel/75 p-6 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-2 text-sm text-white">
            <Bot className="h-4 w-4 text-cyan" />
            状态跟踪
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            {/* AI Schedule */}
            <div className="rounded-[24px] border border-white/8 bg-elevated/80 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-white">
                <Zap className="h-4 w-4 text-cyan" />
                AI 日程预览
              </div>
              <div className="space-y-3">
                {board.schedule.blocks.map((block) => (
                  <div key={block.id} className={cn('rounded-2xl border p-4', energyTone(block.energy))}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-white">{block.title}</h3>
                      <span className="text-xs uppercase tracking-[0.22em]">{block.energy}</span>
                    </div>
                    <div className="mb-2 text-xs text-white/70">{formatDdl(block.startsAt)} - {formatDdl(block.endsAt)}</div>
                    <p className="text-sm leading-6 text-star-dust">{block.reason}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-star-dust">{board.schedule.summary}</p>
            </div>

            {/* Heatmap */}
            <div className="rounded-[24px] border border-white/8 bg-elevated/80 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-white">
                <TimerReset className="h-4 w-4 text-purple" />
                拖延热力图
              </div>
              <div className="space-y-3">
                {board.schedule.heatmap.map((cell) => (
                  <div key={cell.domain}>
                    <div className="mb-1 flex items-center justify-between text-xs text-star-dust">
                      <span>{cell.domain}</span>
                      <span>{cell.rate}% · {cell.tasks} tasks</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          cell.rate >= 60 ? 'bg-rose' : cell.rate >= 35 ? 'bg-amber' : cell.rate >= 20 ? 'bg-purple' : 'bg-cyan',
                        )}
                        style={{ width: `${Math.max(cell.rate, 6)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Chat / Status Info */}
          <div className="mb-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan"><Target className="h-4 w-4" />当前激活节点</div>
              <p className="text-sm leading-6 text-white">{activeNode?.title ?? '未选择'}</p>
            </div>
            <div className="rounded-2xl border border-purple/20 bg-purple/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-purple"><TriangleAlert className="h-4 w-4" />执行提醒</div>
              <p className="text-sm leading-6 text-white/85">
                {board.feedback[0]?.nextSuggestion ?? '点击上方节点卡片查看任务简报并开始执行。'}
              </p>
            </div>
            <div className="rounded-2xl border border-rose/20 bg-rose/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-rose"><AlertTriangle className="h-4 w-4" />计划偏差</div>
              <p className="text-sm leading-6 text-white/85">
                {board.schedule.heatmap[0] ? `${board.schedule.heatmap[0].domain} 领域当前拖延率最高，为 ${board.schedule.heatmap[0].rate}%。` : '暂无偏差数据。'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <textarea
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
              rows={3}
              placeholder="和 AI 讨论计划、日程或任务强度，例如：把本周目标压缩到周三前，或者帮我降低明天的任务强度。"
              className="min-h-[96px] flex-1 rounded-2xl border border-white/8 bg-deep px-4 py-3 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
            />
            <button
              onClick={submitChat}
              disabled={submitting}
              className="flex w-36 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-cyan-purple px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              提交给 AI
            </button>
          </div>
        </section>
      </div>

      {/* ── Modal: Brief + Feedback (appears when a node is clicked) ── */}
      {showBrief && activeNode ? (
        <NodeBriefModal
          board={board}
          activeNode={activeNode}
          submitting={submitting}
          onSendFeedback={onSendFeedback}
          onClose={() => setShowBrief(false)}
        />
      ) : null}
    </div>
  );
}
