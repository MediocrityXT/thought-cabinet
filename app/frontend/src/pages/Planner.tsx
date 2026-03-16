import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Flame, Lock, Play, Target, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface PlannerProps {
  tasks: Task[];
}

const timeSlots = [
  { label: '15分', minutes: 15 },
  { label: '30分', minutes: 30 },
  { label: '1小时', minutes: 60 },
  { label: '2小时', minutes: 120 },
];

export function Planner({ tasks }: PlannerProps) {
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTab, setActiveTab] = useState<'capsule' | 'ladder' | 'heatmap'>('capsule');
  const [focusMode, setFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);

  const capsuleTasks = useMemo(() => tasks.filter((task) => task.timeEstimate <= selectedTime).slice(0, 3), [selectedTime, tasks]);
  const ladderSteps = useMemo(() => tasks.slice(0, 8), [tasks]);
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
                <h2 className="text-xl font-semibold text-white">{ladderSteps[0]?.title ?? '任务阶梯'}</h2>
                <p className="text-sm text-star-dust">已拆解为 {ladderSteps.length} 个可执行步骤</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-star-dust">进度:</span>
                <span className="font-medium text-cyan">{tasks.filter((task) => task.status === 'done').length}/{tasks.length}</span>
              </div>
            </div>

            <div className="relative">
              <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ minHeight: '400px' }}>
                <line x1="50%" y1="40" x2="25%" y2="120" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="50%" y1="40" x2="75%" y2="120" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="25%" y1="160" x2="15%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="25%" y1="160" x2="35%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="75%" y1="160" x2="65%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="75%" y1="160" x2="85%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

              <div className="space-y-16">
                <div className="flex justify-center">
                  <div className="w-48 rounded-xl border border-purple/30 bg-purple/10 p-4 text-center">
                    <div className="mb-2 text-2xl">🎯</div>
                    <div className="font-medium text-white">{ladderSteps[0]?.title ?? '终极目标'}</div>
                    <div className="mt-1 text-xs text-star-dust">终极目标</div>
                  </div>
                </div>

                <div className="flex justify-around">
                  {ladderSteps.slice(1, 3).map((item) => (
                    <div key={item.id} className={cn('w-40 rounded-xl p-4 text-center transition-all', item.status === 'done' ? 'border border-emerald/30 bg-emerald/10' : 'border border-cyan/30 bg-cyan/10')}>
                      <div className={cn('mb-2 text-xl', item.status === 'done' ? 'text-emerald' : 'text-cyan')}>{item.status === 'done' ? '✓' : '○'}</div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-around">
                  {ladderSteps.slice(3, 7).map((item, index) => (
                    <div key={item.id} className={cn(
                      'w-32 rounded-xl p-3 text-center transition-all',
                      item.status === 'done' ? 'border border-emerald/30 bg-emerald/10' : index >= 2 ? 'border border-white/10 bg-white/5 opacity-50' : 'border border-cyan/30 bg-cyan/10',
                    )}>
                      <div className={cn('mb-1 text-lg', item.status === 'done' ? 'text-emerald' : index >= 2 ? 'text-star-dust' : 'text-cyan')}>
                        {item.status === 'done' ? '✓' : index >= 2 ? <Lock className="mx-auto h-4 w-4" /> : '○'}
                      </div>
                      <div className="text-xs font-medium text-white">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-xl border border-cyan/30 bg-cyan/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/20">
                  <Zap className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <div className="text-sm text-star-dust">当前推荐</div>
                  <div className="font-medium text-white">{tasks.find((task) => task.status !== 'done')?.title ?? '暂无待办任务'}</div>
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
