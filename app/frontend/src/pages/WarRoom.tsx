import { useMemo, useRef } from 'react';
import { ArrowDownToLine, Layers3, Sparkles } from 'lucide-react';
import { Dashboard } from '@/pages/Dashboard';
import { Planner } from '@/pages/Planner';
import type { DashboardOverview, Evaluation, PlannerBoard, PlannerFeedbackCreate } from '@/lib/types';

interface WarRoomProps {
  overview: DashboardOverview;
  vaultName: string;
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

export function WarRoom({
  overview,
  vaultName,
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
  const plannerAnchorRef = useRef<HTMLDivElement>(null);

  const openPlanner = useMemo(() => {
    return () => {
      plannerAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }, []);

  return (
    <div className="custom-scrollbar h-full overflow-auto bg-deep">
      <div className="mx-auto flex min-h-full max-w-[1700px] flex-col gap-8 p-6 lg:p-8">
        <section className="overflow-hidden rounded-[32px] border border-white/8 bg-panel/85 shadow-2xl">
          <div className="border-b border-white/5 bg-gradient-to-r from-cyan/10 via-purple/10 to-transparent px-6 py-5 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-star-dust">
                  <Layers3 className="h-4 w-4 text-cyan" />
                  War Room
                </div>
                <h1 className="font-display text-3xl font-semibold text-white lg:text-4xl">
                  指挥、评估、排程，放在同一张战术桌上
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-star-dust lg:text-base">
                  顶部先看系统健康、最近进展和快速胜利，下面继续把有价值的想法推进成可执行计划。
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald/10 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" />
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald">Current Focus</div>
                  <div className="text-sm font-medium text-white">
                    {evaluations.find((item) => item.id === selectedGoalId)?.idea ?? '未选择项目'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 pb-2 pt-4">
            <Dashboard overview={overview} vaultName={vaultName} onOpenPlanner={openPlanner} />
          </div>
        </section>

        <section
          ref={plannerAnchorRef}
          className="overflow-hidden rounded-[32px] border border-white/8 bg-panel/75 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 lg:px-8">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-star-dust">
                <Sparkles className="h-4 w-4 text-purple" />
                Tactical Execution
              </div>
              <h2 className="text-xl font-semibold text-white">从评估结果进入战术指挥室</h2>
            </div>
            <button
              onClick={openPlanner}
              className="flex items-center gap-2 rounded-xl border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/20"
            >
              <ArrowDownToLine className="h-4 w-4" />
              跳到计划区
            </button>
          </div>

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
        </section>
      </div>
    </div>
  );
}
