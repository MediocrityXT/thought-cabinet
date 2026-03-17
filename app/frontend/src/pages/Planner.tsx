import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Flame, Lock, Play, Target, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Evaluation, Task } from '@/lib/types';

interface PlannerProps {
  tasks: Task[];
  evaluations: Evaluation[];
  selectedGoalId: string | null;
  onSelectGoal: (evaluationId: string) => void;
}

const timeSlots = [
  { label: '15分', minutes: 15 },
  { label: '30分', minutes: 30 },
  { label: '1小时', minutes: 60 },
  { label: '2小时', minutes: 120 },
];

type LadderNode = {
  id: string;
  title: string;
  subtitle: string;
  tone: 'root' | 'focus' | 'support' | 'locked';
};

export function Planner({ tasks, evaluations, selectedGoalId, onSelectGoal }: PlannerProps) {
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTab, setActiveTab] = useState<'capsule' | 'ladder' | 'heatmap'>('capsule');
  const [focusMode, setFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);

  const capsuleTasks = useMemo(() => tasks.filter((task) => task.timeEstimate <= selectedTime).slice(0, 3), [selectedTime, tasks]);
  const selectedGoal = useMemo(
    () => evaluations.find((evaluation) => evaluation.id === selectedGoalId) ?? evaluations[0] ?? null,
    [evaluations, selectedGoalId],
  );

  const ladderTree = useMemo(() => {
    if (!selectedGoal) {
      return null;
    }
    const relatedTasks = tasks.filter((task) => task.domain === selectedGoal.domain).slice(0, 4);
    const fallbackTasks = tasks.slice(0, 4);
    const leaves = (relatedTasks.length ? relatedTasks : fallbackTasks).slice(0, 4);

    return {
      root: {
        id: `root-${selectedGoal.id}`,
        title: selectedGoal.idea,
        subtitle: `${selectedGoal.domain} · 影响 ${selectedGoal.impact} / 可行 ${selectedGoal.feasibility}`,
        tone: 'root' as const,
      },
      branches: [
        {
          id: `market-${selectedGoal.id}`,
          title: selectedGoal.assessment.opportunities[0] ?? '市场验证',
          subtitle: '机会窗口',
          tone: 'focus' as const,
        },
        {
          id: `build-${selectedGoal.id}`,
          title: selectedGoal.assessment.strengths[0] ?? '产品实现',
          subtitle: '能力锚点',
          tone: 'support' as const,
        },
        {
          id: `risk-${selectedGoal.id}`,
          title: selectedGoal.assessment.threats[0] ?? '风险控制',
          subtitle: '主要阻力',
          tone: 'locked' as const,
        },
      ] satisfies LadderNode[],
      leaves: leaves.map((task, index) => ({
        id: task.id,
        title: task.title,
        subtitle: `${task.timeEstimate} 分钟 · ${task.domain}`,
        tone: index < 2 ? 'focus' as const : 'support' as const,
      })),
    };
  }, [selectedGoal, tasks]);
  const procrastinationData = useMemo(() => {
    const byDomain = new Map<string, { total: number; delayed: number }>();
    for (const task of tasks) {
      const current = byDomain.get(task.domain) ?? { total: 0, delayed: 0 };
      current.total += 1;
      if (task.priority === 'high' && task.status !== 'done') {
        current.delayed += 1;
      }
      byDomain.set(task.domain, current);
    }
    return Array.from(byDomain.entries()).map(([domain, value]) => ({
      domain,
      rate: value.total ? Math.round((value.delayed / value.total) * 100) : 0,
      tasks: value.total,
    }));
  }, [tasks]);

  useEffect(() => {
    if (!focusMode) {
      return;
    }
    const timer = window.setInterval(() => {
      setFocusTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [focusMode]);

  function getRateColor(rate: number) {
    if (rate <= 20) return 'bg-emerald';
    if (rate <= 40) return 'bg-cyan';
    if (rate <= 60) return 'bg-amber';
    return 'bg-rose';
  }

  function startFocus(task: Task) {
    setFocusTask(task);
    setFocusTimeLeft(task.timeEstimate * 60);
    setFocusMode(true);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (focusMode && focusTask) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep animate-fade-in">
        <div className="text-center">
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-cyan/30">
            <div className="absolute inset-0 rounded-full border-4 border-cyan border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-mono text-4xl text-cyan">{formatTime(focusTimeLeft)}</span>
          </div>
          <h2 className="mb-2 text-2xl font-medium text-white">{focusTask.title}</h2>
          <p className="mb-8 text-star-dust">保持专注，不要分心</p>
          <button onClick={() => setFocusMode(false)} className="rounded-lg bg-rose/20 px-6 py-3 text-rose transition-colors hover:bg-rose/30">结束专注</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4">
        {[
          { id: 'capsule', label: '30分钟胶囊', icon: Clock },
          { id: 'ladder', label: '阶梯生成器', icon: Target },
          { id: 'heatmap', label: '拖延分析', icon: Flame },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'capsule' | 'ladder' | 'heatmap')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all',
              activeTab === id ? 'border border-cyan/30 bg-cyan/10 text-cyan' : 'text-star-dust hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        {activeTab === 'capsule' ? (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <p className="mb-4 text-star-dust">我有</p>
              <div className="mb-4 flex items-center justify-center gap-3">
                {timeSlots.map(({ label, minutes }) => (
                  <button
                    key={minutes}
                    onClick={() => setSelectedTime(minutes)}
                    className={cn(
                      'rounded-full px-5 py-2.5 text-sm font-medium transition-all',
                      selectedTime === minutes ? 'bg-gradient-cyan-purple text-white shadow-glow-cyan' : 'bg-white/5 text-star-dust hover:bg-white/10 hover:text-white',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-star-dust">空闲时间</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">推荐任务</h3>
                <span className="text-sm text-star-dust">基于当前能量水平和上下文</span>
              </div>

              {capsuleTasks.map((task) => (
                <div key={task.id} className="group rounded-xl border border-white/5 bg-panel p-5 transition-all hover:border-cyan/30 hover:bg-elevated">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="mb-2 font-medium text-white transition-colors group-hover:text-cyan">{task.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-star-dust">
                        <span className="flex items-center gap-1">
                          <span className={cn('h-2 w-2 rounded-full', task.priority === 'low' ? 'bg-emerald' : task.priority === 'medium' ? 'bg-amber' : 'bg-rose')} />
                          {task.priority === 'low' ? '简单' : task.priority === 'medium' ? '中等' : '困难'}
                        </span>
                        <span>⏱️ {task.timeEstimate}分钟</span>
                        <span>📁 {task.domain}</span>
                        {task.status !== 'todo' ? <span className="text-emerald">✓ 上下文完整</span> : null}
                      </div>
                    </div>
                    <button onClick={() => startFocus(task)} className="flex items-center gap-2 rounded-lg bg-cyan/20 px-4 py-2 text-cyan transition-colors hover:bg-cyan/30">
                      <Play className="h-4 w-4" />
                      开始
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-white/5 bg-panel/50 p-4">
              <div className="flex items-center gap-2 text-star-dust">
                <CheckCircle2 className="h-4 w-4 text-emerald" />
                <span>本周已完成 {tasks.filter((task) => task.status === 'done').length} 个时间胶囊</span>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'ladder' ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedGoal?.idea ?? '任务阶梯'}</h2>
                <p className="text-sm text-star-dust">
                  {selectedGoal ? `从价值四象限项目拆解为 ${ladderTree?.leaves.length ?? 0} 个执行节点` : '先在价值四象限里创建或选择项目'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-star-dust">进度:</span>
                <span className="font-medium text-cyan">{tasks.filter((task) => task.status === 'done').length}/{tasks.length}</span>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {evaluations.map((evaluation) => (
                <button
                  key={evaluation.id}
                  onClick={() => onSelectGoal(evaluation.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    selectedGoal?.id === evaluation.id
                      ? 'border-cyan/30 bg-cyan/10 text-cyan'
                      : 'border-white/10 bg-white/5 text-star-dust hover:text-white',
                  )}
                >
                  {evaluation.idea}
                </button>
              ))}
            </div>

            <div className="relative min-h-[480px] rounded-2xl border border-white/5 bg-panel/40 p-6">
              {ladderTree ? (
                <>
                  <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    <polyline points="420,100 420,128 220,128 220,164" fill="none" stroke="rgba(0, 212, 255, 0.35)" strokeWidth="2" />
                    <polyline points="420,100 420,136 420,136 420,164" fill="none" stroke="rgba(0, 212, 255, 0.35)" strokeWidth="2" />
                    <polyline points="420,100 420,128 620,128 620,164" fill="none" stroke="rgba(168, 85, 247, 0.35)" strokeWidth="2" />
                    <polyline points="220,236 220,264 150,264 150,326" fill="none" stroke="rgba(0, 212, 255, 0.28)" strokeWidth="2" />
                    <polyline points="220,236 220,280 330,280 330,326" fill="none" stroke="rgba(0, 212, 255, 0.28)" strokeWidth="2" />
                    <polyline points="620,236 620,264 510,264 510,326" fill="none" stroke="rgba(168, 85, 247, 0.28)" strokeWidth="2" />
                    <polyline points="620,236 620,280 690,280 690,326" fill="none" stroke="rgba(244, 63, 94, 0.28)" strokeWidth="2" />
                  </svg>

                  <div className="flex justify-center">
                    <div className="w-72 rounded-xl border border-purple/30 bg-purple/10 p-4 text-center">
                      <div className="mb-2 text-2xl">🎯</div>
                      <div className="font-medium text-white">{ladderTree.root.title}</div>
                      <div className="mt-1 text-xs text-star-dust">{ladderTree.root.subtitle}</div>
                    </div>
                  </div>

                  <div className="mt-14 grid grid-cols-3 gap-8">
                    {ladderTree.branches.map((branch) => (
                      <div
                        key={branch.id}
                        className={cn(
                          'rounded-xl p-4 text-center',
                          branch.tone === 'focus'
                            ? 'border border-cyan/30 bg-cyan/10'
                            : branch.tone === 'support'
                              ? 'border border-emerald/30 bg-emerald/10'
                              : 'border border-rose/30 bg-rose/10',
                        )}
                      >
                        <div className={cn('mb-2 text-lg', branch.tone === 'focus' ? 'text-cyan' : branch.tone === 'support' ? 'text-emerald' : 'text-rose')}>
                          {branch.tone === 'locked' ? <Lock className="mx-auto h-4 w-4" /> : '○'}
                        </div>
                        <div className="text-sm font-medium text-white">{branch.title}</div>
                        <div className="mt-1 text-xs text-star-dust">{branch.subtitle}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 grid grid-cols-4 gap-6 px-4">
                    {ladderTree.leaves.map((leaf) => (
                      <div
                        key={leaf.id}
                        className={cn(
                          'rounded-xl p-3 text-center',
                          leaf.tone === 'focus' ? 'border border-cyan/30 bg-cyan/10' : 'border border-emerald/30 bg-emerald/10',
                        )}
                      >
                        <div className={cn('mb-1 text-lg', leaf.tone === 'focus' ? 'text-cyan' : 'text-emerald')}>{leaf.tone === 'focus' ? '△' : '✓'}</div>
                        <div className="text-xs font-medium text-white">{leaf.title}</div>
                        <div className="mt-1 text-[11px] text-star-dust">{leaf.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-star-dust">
                  先在价值四象限里创建项目，再来拆解任务树。
                </div>
              )}
            </div>

            <div className="mt-12 rounded-xl border border-cyan/30 bg-cyan/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20">
                  <Zap className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <div className="text-sm text-star-dust">当前推荐</div>
                  <div className="font-medium text-white">{ladderTree?.leaves[0]?.title ?? tasks.find((task) => task.status !== 'done')?.title ?? '暂无待办任务'}</div>
                </div>
                <button className="ml-auto rounded-lg bg-cyan/20 px-4 py-2 text-cyan transition-colors hover:bg-cyan/30">开始执行</button>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'heatmap' ? (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">拖延症热力图</h2>
                <p className="text-sm text-star-dust">分析任务滞留模式，优化执行策略</p>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-white/5 bg-panel p-6">
              <div className="space-y-4">
                {procrastinationData.map(({ domain, rate, tasks: count }) => (
                  <div key={domain} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-star-dust">{domain}</div>
                    <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/5">
                      <div className={cn('h-full transition-all duration-500', getRateColor(rate))} style={{ width: `${rate}%` }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white">{rate}%</span>
                    </div>
                    <div className="w-16 text-right text-xs text-star-dust">{count} 任务</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-emerald" /><span className="text-xs text-star-dust">优秀 (0-20%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-cyan" /><span className="text-xs text-star-dust">良好 (20-40%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-amber" /><span className="text-xs text-star-dust">警告 (40-60%)</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-rose" /><span className="text-xs text-star-dust">危险 (60%+)</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose/30 bg-rose/10 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose" />
                  <h3 className="font-medium text-white">需要关注</h3>
                </div>
                <p className="mb-4 text-sm text-white/80">
                  你在 &quot;{procrastinationData.sort((a, b) => b.rate - a.rate)[0]?.domain ?? 'General'}&quot; 相关任务上拖延率最高，建议重新拆解目标或补充前置上下文。
                </p>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg bg-rose/20 px-3 py-1.5 text-sm text-rose transition-colors hover:bg-rose/30">调整目标</button>
                  <button className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-star-dust transition-colors hover:bg-white/10">查看详情</button>
                </div>
              </div>

              <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald" />
                  <h3 className="font-medium text-white">表现优秀</h3>
                </div>
                <p className="mb-4 text-sm text-white/80">
                  &quot;{procrastinationData.sort((a, b) => a.rate - b.rate)[0]?.domain ?? 'General'}&quot; 领域任务执行表现最好，继续保持这个节奏。
                </p>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg bg-emerald/20 px-3 py-1.5 text-sm text-emerald transition-colors hover:bg-emerald/30">查看统计</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
