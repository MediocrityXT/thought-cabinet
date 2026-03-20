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

function PlannerNodeCard({
  node,
  active,
  onSelect,
}: {
  node: PlannerNode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5',
        active ? 'border-cyan bg-cyan/12 shadow-glow-cyan' : 'border-white/8 bg-panel/80 hover:border-cyan/30 hover:bg-elevated',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-cyan-purple opacity-70" />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className={cn('rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.22em]', statusTone(node.status))}>
              {node.status === 'todo' ? '待命' : node.status === 'in_progress' ? '执行中' : node.status === 'done' ? '完成' : '阻塞'}
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-star-dust">T+{node.timeEstimate}m</span>
          </div>
          <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-cyan">{node.title}</h3>
        </div>
        <ArrowRight className={cn('h-4 w-4 shrink-0 transition-transform', active ? 'text-cyan' : 'text-star-dust group-hover:translate-x-0.5 group-hover:text-cyan')} />
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-star-dust">{node.detail}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-star-dust">
        <span>DDL {formatDdl(node.ddl)}</span>
        {node.taskId ? <span className="text-white/70">Task linked</span> : <span>AI branch</span>}
      </div>
    </button>
  );
}

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
  const [feedbackStatus, setFeedbackStatus] = useState<PlannerFeedbackCreate['status']>('progress');
  const [progressNote, setProgressNote] = useState('');
  const [blocker, setBlocker] = useState('');
  const [actualMinutes, setActualMinutes] = useState('30');
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

  function submitFeedback() {
    if (!board || !board.activeNodeId || !progressNote.trim()) {
      return;
    }
    const currentNode = board.nodes.find((node) => node.id === board.activeNodeId);
    onSendFeedback({
      nodeId: board.activeNodeId,
      taskId: currentNode?.taskId,
      status: feedbackStatus,
      progressNote: progressNote.trim(),
      blocker: blocker.trim() || undefined,
      actualMinutes: Number.isNaN(Number(actualMinutes)) ? undefined : Number(actualMinutes),
    });
    setProgressNote('');
    setBlocker('');
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
                  <span className="rounded-full border border-purple/30 bg-purple/12 px-3 py-1 text-xs uppercase tracking-[0.3em] text-purple">Tactical Wall</span>
                  <span className="text-xs uppercase tracking-[0.28em] text-star-dust">{selectedGoal.domain}</span>
                </div>
                <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-white">{board.goalTitle}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-star-dust">
                  <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan" />总目标 DDL {formatDdl(board.goalDdl)}</span>
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
          <section className="space-y-6 rounded-[28px] border border-white/8 bg-panel/75 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-star-dust">
                  <Route className="h-4 w-4 text-cyan" />
                  National Focus Tree
                </div>
                <h2 className="text-xl font-semibold text-white">钢铁雄心式国策树</h2>
              </div>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin text-cyan" /> : null}
            </div>

            <div className="rounded-[24px] border border-white/8 bg-deep/80 p-6">
              {root ? (
                <div className="space-y-8">
                  <div className="mx-auto max-w-xl">
                    <PlannerNodeCard node={root} active={root.id === board.activeNodeId} onSelect={() => onSelectNode(root.id)} />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    {branches.map((node) => (
                      <PlannerNodeCard key={node.id} node={node} active={node.id === board.activeNodeId} onSelect={() => onSelectNode(node.id)} />
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {leaves.map((node) => (
                      <PlannerNodeCard key={node.id} node={node} active={node.id === board.activeNodeId} onSelect={() => onSelectNode(node.id)} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-white/8 bg-elevated/80 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm text-white">
                  <Bot className="h-4 w-4 text-cyan" />
                  AI 日程预览
                </div>
                <div className="space-y-3">
                  {board.schedule.blocks.map((block) => (
                    <div key={block.id} className={cn('rounded-2xl border p-4', energyTone(block.energy))}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-white">{block.title}</h3>
                        <span className="text-xs uppercase tracking-[0.22em]">{block.energy}</span>
                      </div>
                      <div className="mb-2 text-xs text-white/70">
                        {formatDdl(block.startsAt)} - {formatDdl(block.endsAt)}
                      </div>
                      <p className="text-sm leading-6 text-star-dust">{block.reason}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-star-dust">{board.schedule.summary}</p>
              </div>

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
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-cyan/18 bg-panel/75 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs uppercase tracking-[0.28em] text-star-dust">Mission Brief</div>
                  <h2 className="text-xl font-semibold text-white">{board.brief.title}</h2>
                </div>
                <button
                  onClick={() => board.activeNodeId && onSendFeedback({ nodeId: board.activeNodeId, taskId: activeNode?.taskId, status: 'started', progressNote: `开始执行：${board.brief.title}` })}
                  disabled={submitting || !board.activeNodeId}
                  className="flex items-center gap-2 rounded-xl bg-cyan/18 px-4 py-2 text-cyan transition-colors hover:bg-cyan/24 disabled:opacity-60"
                >
                  <Play className="h-4 w-4" />
                  开始执行
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan">Minimum Outcome</div>
                  <p className="text-sm leading-6 text-white">{board.brief.minimumOutcome}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-elevated/80 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-purple">Context Summary</div>
                  <p className="text-sm leading-6 text-star-dust">{board.brief.contextSummary}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-elevated/80 p-4">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-star-dust">文档与前置材料</div>
                  <div className="space-y-2">
                    {board.brief.docLinks.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-cyan transition-colors hover:border-cyan/20 hover:bg-cyan/10"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    {board.brief.prerequisiteNotes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/80">
                        {note.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/8 bg-panel/75 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-sm text-white">
                <MessageSquareText className="h-4 w-4 text-purple" />
                执行反馈流
              </div>

              <div className="mb-4 space-y-3">
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
                  rows={4}
                  placeholder="这次执行推进了什么，卡在哪里，是否需要 AI 调整后续节点？"
                  className="w-full rounded-2xl border border-white/8 bg-panel px-4 py-3 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                />
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
                <button
                  onClick={submitFeedback}
                  disabled={submitting || !board.activeNodeId}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-cyan-purple px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  提交执行反馈
                </button>
              </div>
            </section>
          </aside>
        </div>

        <section className="rounded-[28px] border border-white/8 bg-panel/75 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2 text-sm text-white">
            <Bot className="h-4 w-4 text-cyan" />
            计划讨论台
          </div>
          <div className="mb-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan"><Target className="h-4 w-4" />当前激活节点</div>
              <p className="text-sm leading-6 text-white">{activeNode?.title ?? '未选择'}</p>
            </div>
            <div className="rounded-2xl border border-purple/20 bg-purple/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-purple"><TriangleAlert className="h-4 w-4" />执行提醒</div>
              <p className="text-sm leading-6 text-white/85">
                {board.feedback[0]?.nextSuggestion ?? '如果你不确定下一步，点击上方 I have 30 min 让 AI 重新分配。'}
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
              placeholder="和 AI 讨论计划、日程或任务顺序，例如：把本周目标压缩到周三前，或者我明天只有 45 分钟。"
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
    </div>
  );
}
