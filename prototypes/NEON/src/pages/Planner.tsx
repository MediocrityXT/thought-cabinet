import { useState } from 'react';
import { 
  Target, 
  Clock, 
  Play, 
  CheckCircle2, 
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  duration: number;
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  contextReady: boolean;
}

interface LadderStep {
  id: string;
  title: string;
  completed: boolean;
  unlocked: boolean;
  dependencies: string[];
}

interface ProcrastinationData {
  domain: string;
  rate: number;
  tasks: number;
}

const timeSlots = [
  { label: '15分', minutes: 15 },
  { label: '30分', minutes: 30 },
  { label: '1小时', minutes: 60 },
  { label: '2小时', minutes: 120 },
];

const capsuleTasks: Task[] = [
  { id: '1', title: '阅读 "Rust 所有权机制" 第 3 章', duration: 25, domain: '技术', difficulty: 'medium', contextReady: true },
  { id: '2', title: '整理今日闪念笔记', duration: 15, domain: '个人', difficulty: 'easy', contextReady: true },
  { id: '3', title: '回复 pending 的代码审查', duration: 20, domain: '工作', difficulty: 'medium', contextReady: true },
];

const ladderSteps: LadderStep[] = [
  { id: '1', title: '写操作系统', completed: false, unlocked: true, dependencies: [] },
  { id: '2', title: '环境搭建', completed: true, unlocked: true, dependencies: ['1'] },
  { id: '3', title: '基础理论', completed: false, unlocked: true, dependencies: ['1'] },
  { id: '4', title: '安装 GCC', completed: true, unlocked: true, dependencies: ['2'] },
  { id: '5', title: '配置 QEMU', completed: false, unlocked: true, dependencies: ['2'] },
  { id: '6', title: '内存管理', completed: false, unlocked: false, dependencies: ['3'] },
  { id: '7', title: '进程调度', completed: false, unlocked: false, dependencies: ['3'] },
  { id: '8', title: '文件系统', completed: false, unlocked: false, dependencies: ['6', '7'] },
];

const procrastinationData: ProcrastinationData[] = [
  { domain: '技术', rate: 15, tasks: 12 },
  { domain: '商业', rate: 35, tasks: 8 },
  { domain: '创意', rate: 20, tasks: 6 },
  { domain: '科学', rate: 45, tasks: 9 },
  { domain: '哲学', rate: 60, tasks: 5 },
  { domain: '健康', rate: 70, tasks: 14 },
  { domain: '学习', rate: 25, tasks: 10 },
];

export function Planner() {
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTab, setActiveTab] = useState<'capsule' | 'ladder' | 'heatmap'>('capsule');
  const [focusMode, setFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);

  const getRateColor = (rate: number) => {
    if (rate <= 20) return 'bg-emerald';
    if (rate <= 40) return 'bg-cyan';
    if (rate <= 60) return 'bg-amber';
    return 'bg-rose';
  };

  const startFocus = (task: Task) => {
    setFocusTask(task);
    setFocusTimeLeft(task.duration * 60);
    setFocusMode(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (focusMode && focusTask) {
    return (
      <div className="fixed inset-0 bg-deep z-50 flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full border-4 border-cyan/30 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full border-4 border-cyan border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-4xl font-mono text-cyan">{formatTime(focusTimeLeft)}</span>
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">{focusTask.title}</h2>
          <p className="text-star-dust mb-8">保持专注，不要分心</p>
          <button 
            onClick={() => setFocusMode(false)}
            className="px-6 py-3 bg-rose/20 text-rose rounded-lg hover:bg-rose/30 transition-colors"
          >
            结束专注
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        {[
          { id: 'capsule', label: '30分钟胶囊', icon: Clock },
          { id: 'ladder', label: '阶梯生成器', icon: Target },
          { id: 'heatmap', label: '拖延分析', icon: Flame },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
              activeTab === id
                ? "bg-cyan/10 text-cyan border border-cyan/30"
                : "text-star-dust hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {activeTab === 'capsule' && (
          <div className="max-w-3xl mx-auto">
            {/* Time Selector */}
            <div className="text-center mb-8">
              <p className="text-star-dust mb-4">我有</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                {timeSlots.map(({ label, minutes }) => (
                  <button
                    key={minutes}
                    onClick={() => setSelectedTime(minutes)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                      selectedTime === minutes
                        ? "bg-gradient-cyan-purple text-white shadow-glow-cyan"
                        : "bg-white/5 text-star-dust hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-star-dust">空闲时间</p>
            </div>

            {/* Recommended Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">推荐任务</h3>
                <span className="text-sm text-star-dust">基于当前能量水平和上下文</span>
              </div>

              {capsuleTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-panel border border-white/5 rounded-xl p-5 hover:border-cyan/30 hover:bg-elevated transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium mb-2 group-hover:text-cyan transition-colors">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-star-dust">
                        <span className="flex items-center gap-1">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            task.difficulty === 'easy' ? 'bg-emerald' : 
                            task.difficulty === 'medium' ? 'bg-amber' : 'bg-rose'
                          )} />
                          {task.difficulty === 'easy' ? '简单' : task.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                        <span>⏱️ {task.duration}分钟</span>
                        <span>📁 {task.domain}</span>
                        {task.contextReady && (
                          <span className="text-emerald">✓ 上下文完整</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => startFocus(task)}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      开始
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 p-4 bg-panel/50 border border-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-star-dust">
                <CheckCircle2 className="w-4 h-4 text-emerald" />
                <span>本周已完成 12 个时间胶囊</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ladder' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">写操作系统</h2>
                <p className="text-sm text-star-dust">已拆解为 50 个可执行步骤</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-star-dust">进度:</span>
                <span className="text-cyan font-medium">
                  {ladderSteps.filter(s => s.completed).length}/{ladderSteps.length}
                </span>
              </div>
            </div>

            {/* Skill Tree */}
            <div className="relative">
              {/* Tree Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '400px' }}>
                {/* Connection lines */}
                <line x1="50%" y1="40" x2="25%" y2="120" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="50%" y1="40" x2="75%" y2="120" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="25%" y1="160" x2="15%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="25%" y1="160" x2="35%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                <line x1="75%" y1="160" x2="65%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="75%" y1="160" x2="85%" y2="240" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

              {/* Tree Levels */}
              <div className="space-y-16">
                {/* Level 1 - Root */}
                <div className="flex justify-center">
                  <div className="w-48 p-4 bg-purple/10 border border-purple/30 rounded-xl text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-white font-medium">写操作系统</div>
                    <div className="text-xs text-star-dust mt-1">终极目标</div>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="flex justify-around">
                  {[
                    { title: '环境搭建', completed: true },
                    { title: '基础理论', completed: false },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-40 p-4 rounded-xl text-center transition-all",
                        item.completed 
                          ? "bg-emerald/10 border border-emerald/30" 
                          : "bg-cyan/10 border border-cyan/30"
                      )}
                    >
                      <div className={cn("text-xl mb-2", item.completed ? "text-emerald" : "text-cyan")}>
                        {item.completed ? '✓' : '○'}
                      </div>
                      <div className="text-white font-medium text-sm">{item.title}</div>
                    </div>
                  ))}
                </div>

                {/* Level 3 */}
                <div className="flex justify-around">
                  {[
                    { title: '安装 GCC', completed: true },
                    { title: '配置 QEMU', completed: false },
                    { title: '内存管理', completed: false, locked: true },
                    { title: '进程调度', completed: false, locked: true },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-32 p-3 rounded-xl text-center transition-all",
                        item.completed 
                          ? "bg-emerald/10 border border-emerald/30" 
                          : item.locked
                            ? "bg-white/5 border border-white/10 opacity-50"
                            : "bg-cyan/10 border border-cyan/30"
                      )}
                    >
                      <div className={cn("text-lg mb-1", item.completed ? "text-emerald" : item.locked ? "text-star-dust" : "text-cyan")}>
                        {item.completed ? '✓' : item.locked ? <Lock className="w-4 h-4 mx-auto" /> : '○'}
                      </div>
                      <div className="text-white font-medium text-xs">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Focus */}
            <div className="mt-12 p-4 bg-cyan/10 border border-cyan/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <div className="text-sm text-star-dust">当前推荐</div>
                  <div className="text-white font-medium">配置 QEMU 模拟器环境</div>
                </div>
                <button className="ml-auto px-4 py-2 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors">
                  开始执行
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">拖延症热力图</h2>
                <p className="text-sm text-star-dust">分析任务滞留模式，优化执行策略</p>
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-panel border border-white/5 rounded-xl p-6 mb-6">
              <div className="space-y-4">
                {procrastinationData.map(({ domain, rate, tasks }) => (
                  <div key={domain} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-star-dust">{domain}</div>
                    <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                      <div 
                        className={cn("h-full transition-all duration-500", getRateColor(rate))}
                        style={{ width: `${rate}%` }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                        {rate}%
                      </span>
                    </div>
                    <div className="w-16 text-right text-xs text-star-dust">
                      {tasks} 任务
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald" />
                  <span className="text-xs text-star-dust">优秀 (0-20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan" />
                  <span className="text-xs text-star-dust">良好 (20-40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber" />
                  <span className="text-xs text-star-dust">警告 (40-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-rose" />
                  <span className="text-xs text-star-dust">危险 (60%+)</span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose/10 border border-rose/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-rose" />
                  <h3 className="text-white font-medium">需要关注</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  你在"健康"相关任务上拖延率高达 70%，建议重新审视目标或寻求外部监督。
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-rose/20 text-rose rounded-lg text-sm hover:bg-rose/30 transition-colors">
                    调整目标
                  </button>
                  <button className="px-3 py-1.5 bg-white/5 text-star-dust rounded-lg text-sm hover:bg-white/10 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>

              <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald" />
                  <h3 className="text-white font-medium">表现优秀</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  "技术"领域任务执行率很高，拖延率仅 15%。继续保持这个节奏！
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-emerald/20 text-emerald rounded-lg text-sm hover:bg-emerald/30 transition-colors">
                    查看统计
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
