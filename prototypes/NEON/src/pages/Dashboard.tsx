import { StatCard } from '@/components/ui-custom/StatCard';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { ProgressTimeline } from '@/components/ui-custom/ProgressTimeline';
import { 
  FileText, 
  Clock, 
  Gem, 
  AlertTriangle, 
  Play,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: '总笔记', value: 1247, trend: 12, icon: <FileText className="w-5 h-5 text-cyan" />, color: 'cyan' as const },
  { label: '待评估', value: 23, trend: -5, icon: <Clock className="w-5 h-5 text-amber" />, color: 'amber' as const },
  { label: '高价值', value: 18, trend: 8, icon: <Gem className="w-5 h-5 text-purple" />, color: 'purple' as const },
  { label: '认知缺口', value: 7, icon: <AlertTriangle className="w-5 h-5 text-rose" />, color: 'rose' as const },
];

const timelineEvents = [
  {
    id: '1',
    type: 'cognitive' as const,
    title: 'RAG 技术的 5 个关键优化点',
    description: '从阅读材料中提取的核心认知',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    score: 85,
  },
  {
    id: '2',
    type: 'task' as const,
    title: '完成 React 性能优化文档',
    description: '整理了 15 个实用的优化技巧',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    score: 120,
  },
  {
    id: '3',
    type: 'system' as const,
    title: '知识体系自动补全',
    description: 'AI 发现并补充了 3 个关联概念',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

const reviewTasks = [
  { title: '优化数据库查询性能', domain: '技术/后端', timeEstimate: 45, priority: 'high' as const },
  { title: 'Review Rust 所有权机制笔记', domain: '技术/语言', timeEstimate: 30, priority: 'medium' as const },
  { title: '整理本周会议要点', domain: '工作/管理', timeEstimate: 20, priority: 'low' as const },
];

const focusProjects = [
  { title: 'ThoughtCabinet 2.0 开发', domain: '产品', timeEstimate: 120, priority: 'high' as const },
  { title: 'AI 工作流设计', domain: '设计', timeEstimate: 90, priority: 'high' as const },
];

const cognitiveAlerts = [
  { title: 'Web3 支付领域知识缺失', domain: '技术', timeEstimate: 0, priority: 'high' as const },
  { title: '分布式系统一致性理论', domain: '技术', timeEstimate: 0, priority: 'medium' as const },
];

const quickWins = [
  { title: '阅读 "Rust 并发模型" 第 3 章', domain: '技术', timeEstimate: 25, priority: 'medium' as const },
  { title: '整理今日闪念笔记', domain: '个人', timeEstimate: 15, priority: 'low' as const },
  { title: '回复 pending 的代码审查', domain: '工作', timeEstimate: 20, priority: 'high' as const },
];

export function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-1">
            欢迎回来，<span className="text-gradient-cyan-purple">指挥官</span>
          </h1>
          <p className="text-star-dust">你的认知系统运转正常，今日有 5 项待办任务</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-emerald text-sm font-medium">系统健康: 98%</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Progress */}
        <div className="bg-panel border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple" />
            <h2 className="text-lg font-semibold text-white">近期进展</h2>
          </div>
          <ProgressTimeline events={timelineEvents} />
        </div>

        {/* Activity Streams */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Review Queue */}
            <div className="bg-panel border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber" />
                  <h3 className="text-sm font-medium text-white">待办审批</h3>
                </div>
                <span className="tc-badge tc-badge-amber">{reviewTasks.length}</span>
              </div>
              <div className="space-y-3">
                {reviewTasks.map((task, i) => (
                  <TaskCard key={i} {...task} />
                ))}
              </div>
            </div>

            {/* Focus Projects */}
            <div className="bg-panel border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan" />
                  <h3 className="text-sm font-medium text-white">重点项目</h3>
                </div>
                <span className="tc-badge tc-badge-cyan">{focusProjects.length}</span>
              </div>
              <div className="space-y-3">
                {focusProjects.map((task, i) => (
                  <TaskCard key={i} {...task} />
                ))}
              </div>
            </div>

            {/* Cognitive Alerts */}
            <div className="bg-panel border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose" />
                  <h3 className="text-sm font-medium text-white">认知警报</h3>
                </div>
                <span className="tc-badge tc-badge-rose">{cognitiveAlerts.length}</span>
              </div>
              <div className="space-y-3">
                {cognitiveAlerts.map((alert, i) => (
                  <div 
                    key={i}
                    className="bg-elevated border border-rose/20 rounded-lg p-4 hover:border-rose/40 transition-all cursor-pointer"
                  >
                    <h4 className="text-white font-medium mb-2 text-sm">{alert.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-star-dust">{alert.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wins */}
      <div className="bg-gradient-to-r from-cyan/10 via-purple/10 to-cyan/10 border border-cyan/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-cyan" />
            <h2 className="text-lg font-semibold text-white">Quick Wins</h2>
            <span className="text-star-dust text-sm">减少启动困难，快速进入心流</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-star-dust">我有</span>
            {['15分', '30分', '1小时', '2小时'].map((time) => (
              <button
                key={time}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  time === '30分'
                    ? "bg-gradient-cyan-purple text-white shadow-glow-cyan"
                    : "bg-white/5 text-star-dust hover:bg-white/10 hover:text-white"
                )}
              >
                {time}
              </button>
            ))}
            <span className="text-sm text-star-dust">空闲</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {quickWins.map((task, i) => (
            <div 
              key={i}
              className="bg-panel/80 border border-white/5 rounded-lg p-4 hover:border-cyan/30 hover:bg-panel transition-all cursor-pointer group"
            >
              <h4 className="text-white font-medium mb-2 group-hover:text-cyan transition-colors">{task.title}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-star-dust">
                  <span>{task.domain}</span>
                  <span>⏱️ {task.timeEstimate}min</span>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 bg-cyan/10 text-cyan rounded-md text-xs hover:bg-cyan/20 transition-colors">
                  <Play className="w-3 h-3" />
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
