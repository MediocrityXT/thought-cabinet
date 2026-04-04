import { useMemo } from 'react';
import { ArrowRight, Scale, ShieldCheck, Sparkles, Target } from 'lucide-react';
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

export function AssessmentCommittee({
  evaluations,
  notes,
  creating,
  onCreateEvaluation,
  onSaveSerendipity,
  onPromoteToPlanner,
}: AssessmentCommitteeProps) {
  const routingCards = useMemo(
    () => [
      {
        title: '高价值 + 高可行',
        detail: '优先进入 War Room，直接拆解成可执行任务。',
        tone: 'border-cyan/20 bg-cyan/10 text-cyan',
      },
      {
        title: '高价值 + 低可行',
        detail: '先补认知缺口，再讨论范围收缩与验证路径。',
        tone: 'border-amber/20 bg-amber/10 text-amber',
      },
      {
        title: '低价值 + 高可行',
        detail: '适合快速胜利，但通常不值得长期投入。',
        tone: 'border-purple/20 bg-purple/10 text-purple',
      },
      {
        title: '低价值 + 低可行',
        detail: '默认归档，只有在出现新事实时才重新评估。',
        tone: 'border-rose/20 bg-rose/10 text-rose',
      },
    ],
    [],
  );

  return (
    <div className="flex h-full flex-col gap-6 bg-deep px-6 py-6 animate-fade-in">
      <section className="rounded-[28px] border border-white/8 bg-panel/85 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em] text-star-dust">
              <Scale className="h-4 w-4 text-cyan" />
              Assessment Committee
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-3xl font-semibold text-white lg:text-4xl">
                多角度评估，把 Idea 送进真正该去的地方
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-star-dust lg:text-base">
                这里不是单纯打分，而是让多个视角同时审视一个想法：它值不值得做、难点在哪里、缺的认知是什么，以及最后应不应该进入 War Room。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm text-cyan">
                多模型讨论
              </div>
              <div className="rounded-full border border-purple/20 bg-purple/10 px-4 py-2 text-sm text-purple">
                四象限路由
              </div>
              <div className="rounded-full border border-emerald/20 bg-emerald/10 px-4 py-2 text-sm text-emerald">
                直达 War Room
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[520px] xl:grid-cols-2">
            {routingCards.map((card) => (
              <div key={card.title} className={`rounded-2xl border p-4 ${card.tone}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white">{card.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </div>
                <p className="text-xs leading-6 text-white/80">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-elevated/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-white">
              <ShieldCheck className="h-4 w-4 text-cyan" />
              评估原则
            </div>
            <p className="text-sm leading-6 text-star-dust">
              先看事实与已有观点，再看风险、成本和不确定性，最后决定是推进、拆解、搁置还是归档。
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-elevated/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-white">
              <Sparkles className="h-4 w-4 text-purple" />
              输出形式
            </div>
            <p className="text-sm leading-6 text-star-dust">
              结论不是一个孤立分数，而是一份能被 War Room 直接消费的结构化判断。
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-elevated/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-white">
              <Target className="h-4 w-4 text-emerald" />
              进入下一步
            </div>
            <p className="text-sm leading-6 text-star-dust">
              当想法落在高价值且可执行的区域时，系统会把它送去 War Room 做任务拆解和执行反馈。
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-0 flex-1 rounded-[28px] border border-white/5 bg-panel/60 shadow-2xl">
        <Evaluator
          evaluations={evaluations}
          notes={notes}
          creating={creating}
          onCreateEvaluation={onCreateEvaluation}
          onSaveSerendipity={onSaveSerendipity}
          onPromoteToPlanner={onPromoteToPlanner}
        />
      </section>
    </div>
  );
}

export default AssessmentCommittee;
