import { HelpCircle, Target } from 'lucide-react';
import { Planner } from '@/pages/Planner';
import type { Evaluation, PlannerBoard, PlannerFeedbackCreate } from '@/lib/types';

interface WarRoomProps {
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

const tooltipText = '🪜 目标树把大项目拆解为可执行的子任务\n📋 点击任务卡片查看任务简报\n⏱️ "我有时间"按钮自动匹配适合的任务\n💬 执行反馈帮助 AI 持续优化计划';

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex cursor-help">
      <HelpCircle className="h-3.5 w-3.5 text-star-dust/60 transition-colors group-hover:text-cyan" />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 whitespace-pre-line rounded-xl border border-white/10 bg-elevated px-3 py-2 text-xs leading-5 text-star-dust opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

export function WarRoom({
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
}: WarRoomProps) {
  return (
    <div className="flex h-full flex-col bg-deep text-white">
      <header className="border-b border-white/5 bg-panel/70 px-5 py-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">战术指挥室</h1>
                <Tooltip text={tooltipText} />
              </div>
              <p className="text-sm text-star-dust">指挥、评估、排程，放在同一张战术桌上。</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald/10 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" />
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-emerald">当前焦点</div>
                <div className="text-sm font-medium text-white">
                  {evaluations.find((item) => item.id === selectedGoalId)?.idea ?? '未选择项目'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="custom-scrollbar min-h-0 flex-1 overflow-auto">
        <Planner
          board={board}
          evaluations={evaluations}
          loading={loading}
          submitting={submitting}
          selectedGoalId={selectedGoalId}
          onSelectGoal={onSelectGoal}
          onSelectNode={onSelectNode}
          onAssign={onAssign}
          onSendFeedback={onSendFeedback}
          onSendChat={onSendChat}
        />
      </main>
    </div>
  );
}
