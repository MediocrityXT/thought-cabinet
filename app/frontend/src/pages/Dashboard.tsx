import { useState } from 'react';
import { AlertTriangle, Clock, FileText, Gem, Play, Sparkles, Zap } from 'lucide-react';
import { ProgressTimeline } from '@/components/ui-custom/ProgressTimeline';
import { StatCard } from '@/components/ui-custom/StatCard';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { cn } from '@/lib/utils';
import type { DashboardOverview } from '@/lib/types';

interface DashboardProps {
  overview: DashboardOverview;
  vaultName: string;
  onOpenPlanner: () => void;
}

const timeSlots = [
  { label: '15分', minutes: 15 },
  { label: '30分', minutes: 30 },
  { label: '1小时', minutes: 60 },
  { label: '2小时', minutes: 120 },
];

export function Dashboard({ overview, vaultName, onOpenPlanner }: DashboardProps) {
  const [selectedTime, setSelectedTime] = useState(30);
  const stats = [
    { label: '总笔记', value: overview.stats.totalNotes, trend: 12, icon: <FileText className="h-5 w-5 text-cyan" />, color: 'cyan' as const },
    { label: '待评估', value: overview.stats.pendingReview, trend: -5, icon: <Clock className="h-5 w-5 text-amber" />, color: 'amber' as const },
    { label: '高价值', value: overview.stats.highValue, trend: 8, icon: <Gem className="h-5 w-5 text-purple" />, color: 'purple' as const },
    { label: '认知缺口', value: overview.stats.cognitiveGaps, icon: <AlertTriangle className="h-5 w-5 text-rose" />, color: 'rose' as const },
  ];

  const quickWins = overview.quickWins.filter((task) => task.timeEstimate <= selectedTime).slice(0, 3);

  return (
    <div className="animate-fade-in space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold text-white">
            欢迎回来，<span className="text-gradient-cyan-purple">指挥官</span>
          </h1>
          <p className="text-star-dust">{vaultName} 正在同步，今日有 {overview.reviewQueue.length + overview.focusProjects.length} 项待推进事项</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-sm font-medium text-emerald">系统健康: {overview.health}%</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 100} />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-xl border border-cyan/20 bg-panel p-6 shadow-glow-cyan">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan" />
            <h2 className="text-lg font-semibold text-white">近期进展</h2>
          </div>
          <ProgressTimeline events={overview.recentProgress} />
        </div>

        <div className="rounded-xl border border-amber/20 bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber" />
              <h3 className="text-sm font-medium text-white">待办审批</h3>
            </div>
            <span className="tc-badge tc-badge-amber">{overview.reviewQueue.length}</span>
          </div>
          <div className="space-y-3">
            {overview.reviewQueue.slice(0, 3).map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-purple/20 bg-panel p-5 shadow-glow-purple">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple" />
              <h3 className="text-sm font-medium text-white">重点项目</h3>
            </div>
            <span className="tc-badge tc-badge-purple">{overview.focusProjects.length}</span>
          </div>
          <div className="space-y-3">
            {overview.focusProjects.slice(0, 3).map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-rose/20 bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose" />
              <h3 className="text-sm font-medium text-white">认知警报</h3>
            </div>
            <span className="tc-badge tc-badge-rose">{overview.cognitiveAlerts.length}</span>
          </div>
          <div className="space-y-3">
            {overview.cognitiveAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="cursor-pointer rounded-lg border border-rose/20 bg-elevated p-4 transition-all hover:border-rose/40">
                <h4 className="mb-2 text-sm font-medium text-white">{alert.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-star-dust">{alert.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-cyan/20 bg-gradient-to-r from-cyan/10 via-purple/10 to-cyan/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-cyan" />
            <h2 className="text-lg font-semibold text-white">Quick Wins</h2>
            <span className="text-sm text-star-dust">减少启动困难，快速进入心流</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-star-dust">我有</span>
            {timeSlots.map((time) => (
              <button
                key={time.minutes}
                onClick={() => setSelectedTime(time.minutes)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  selectedTime === time.minutes
                    ? 'bg-gradient-cyan-purple text-white shadow-glow-cyan'
                    : 'bg-white/5 text-star-dust hover:bg-white/10 hover:text-white',
                )}
              >
                {time.label}
              </button>
            ))}
            <span className="text-sm text-star-dust">空闲</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {quickWins.map((task) => (
            <div
              key={task.id}
              className="group cursor-pointer rounded-lg border border-white/5 bg-panel/80 p-4 transition-all hover:border-cyan/30 hover:bg-panel"
            >
              <h4 className="mb-2 font-medium text-white transition-colors group-hover:text-cyan">{task.title}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-star-dust">
                  <span>{task.domain}</span>
                  <span>⏱️ {task.timeEstimate}min</span>
                </div>
                <button
                  onClick={onOpenPlanner}
                  className="flex items-center gap-1 rounded-md bg-cyan/10 px-3 py-1 text-xs text-cyan transition-colors hover:bg-cyan/20"
                >
                  <Play className="h-3 w-3" />
                  开始
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
