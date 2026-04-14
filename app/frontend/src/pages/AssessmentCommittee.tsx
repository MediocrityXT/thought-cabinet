import { HelpCircle, Scale } from 'lucide-react';
import { Evaluator } from './Evaluator';
import type { Evaluation, Note } from '@/lib/types';

interface AssessmentCommitteeProps {
  evaluations: Evaluation[];
  notes: Note[];
  creating: boolean;
  onCreateEvaluation: (idea: string) => Promise<Evaluation>;
  onSaveSerendipity: (content: string) => Promise<void>;
  onPromoteToPlanner: (evaluationId: string) => void;
}

const tooltipText = '⚖️ 从影响力和可行性两个维度审视想法\n🎯 高价值+可行 → 执行；低可行 → 先补缺口\n🎲 灵感碰撞机随机组合笔记激发跨界思考\n🚀 评估通过后一键送入战术指挥室';

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

export function AssessmentCommittee({
  evaluations,
  notes,
  creating,
  onCreateEvaluation,
  onSaveSerendipity,
  onPromoteToPlanner,
}: AssessmentCommitteeProps) {
  return (
    <div className="flex h-full flex-col bg-deep text-white">
      <header className="border-b border-white/5 bg-panel/70 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">评估委员会</h1>
              <Tooltip text={tooltipText} />
            </div>
            <p className="text-sm text-star-dust">多角度审视想法的价值与可行性，决定它应该进入执行、拆解、搁置还是归档。</p>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        <Evaluator
          evaluations={evaluations}
          notes={notes}
          creating={creating}
          onCreateEvaluation={onCreateEvaluation}
          onSaveSerendipity={onSaveSerendipity}
          onPromoteToPlanner={onPromoteToPlanner}
        />
      </main>
    </div>
  );
}

export default AssessmentCommittee;
