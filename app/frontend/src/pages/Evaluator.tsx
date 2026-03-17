import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, RefreshCw, Save, Scale, Shuffle, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Evaluation, Note } from '@/lib/types';

interface EvaluatorProps {
  evaluations: Evaluation[];
  notes: Note[];
  creating: boolean;
  onCreateEvaluation: (idea: string) => Promise<Evaluation>;
  onSaveSerendipity: (content: string) => Promise<void>;
  onPromoteToPlanner: (evaluationId: string) => void;
}

export function Evaluator({ evaluations, notes, creating, onCreateEvaluation, onSaveSerendipity, onPromoteToPlanner }: EvaluatorProps) {
  const [ideaInput, setIdeaInput] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [serendipityIndex, setSerendipityIndex] = useState(0);
  const [showSerendipityResult, setShowSerendipityResult] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const serendipityPairs = useMemo(() => {
    const notePairs = notes.slice(0, 6);
    if (notePairs.length >= 2) {
      return [
        { a: notePairs[0].title, b: notePairs[1].title },
        { a: notePairs[2]?.title ?? notePairs[0].title, b: notePairs[3]?.title ?? notePairs[1].title },
        { a: notePairs[4]?.title ?? notePairs[0].title, b: notePairs[5]?.title ?? notePairs[1].title },
      ];
    }
    return [
      { a: 'React Hooks', b: '建筑设计模式' },
      { a: 'AI 神经网络', b: '古代哲学' },
      { a: '音乐理论', b: '代码架构' },
    ];
  }, [notes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, rect.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(rect.width, centerY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('难但有价值', centerX * 0.5, centerY * 0.5);
    ctx.fillText('高优先级', centerX * 1.5, centerY * 0.5);
    ctx.fillText('搁置', centerX * 0.5, centerY * 1.5);
    ctx.fillText('快速胜利', centerX * 1.5, centerY * 1.5);

    evaluations.forEach((evaluation) => {
      const x = (evaluation.feasibility / 100) * rect.width;
      const y = rect.height - (evaluation.impact / 100) * rect.height;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Inter';
      ctx.fillText(evaluation.idea.slice(0, 12), x, y - 12);
    });
  }, [evaluations]);

  async function handleAssess() {
    if (!ideaInput.trim()) {
      return;
    }
    const created = await onCreateEvaluation(ideaInput.trim());
    setSelectedEvaluation(created);
    setShowAssessment(true);
    setIdeaInput('');
  }

  async function handleSaveInspiration() {
    const pair = serendipityPairs[serendipityIndex];
    await onSaveSerendipity(`${pair.a} × ${pair.b}\n\n1. 组合优于继承\n2. 声明式表达`);
  }

  const activeEvaluation = selectedEvaluation ?? evaluations[0] ?? null;

  return (
    <div className="custom-scrollbar h-full overflow-auto p-6 animate-fade-in">
      <div className="mb-6 rounded-xl border border-white/5 bg-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan" />
            <h2 className="text-lg font-semibold text-white">价值四象限</h2>
          </div>
          <span className="text-sm text-star-dust">拖拽项目调整优先级</span>
        </div>
        <div className="relative">
          <canvas ref={canvasRef} className="h-[400px] w-full rounded-lg bg-deep-blue" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-star-dust">影响力 ↑</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-star-dust">可行性 →</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/5 bg-panel p-6">
          <div className="mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber" />
            <h2 className="text-lg font-semibold text-white">毒舌 VC</h2>
          </div>

          {!showAssessment || !activeEvaluation ? (
            <div className="space-y-4">
              <textarea
                placeholder="描述你的想法..."
                className="h-32 w-full resize-none rounded-lg border border-white/10 bg-elevated p-4 text-white placeholder:text-star-dust focus:border-amber focus:outline-none"
                value={ideaInput}
                onChange={(event) => setIdeaInput(event.target.value)}
              />
              <div className="flex items-center gap-2">
                {['App 点子', '商业想法', '技术方案'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setIdeaInput(`${tag}: `)}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-star-dust transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                onClick={() => void handleAssess()}
                disabled={creating || !ideaInput.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-amber-rose px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                开始评估
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-emerald/20 bg-emerald/5 p-3">
                  <div className="mb-2 text-xs font-medium text-emerald">优势</div>
                  <ul className="space-y-1">
                    {activeEvaluation.assessment.strengths.map((item, index) => (
                      <li key={index} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-rose/20 bg-rose/5 p-3">
                  <div className="mb-2 text-xs font-medium text-rose">劣势</div>
                  <ul className="space-y-1">
                    {activeEvaluation.assessment.weaknesses.map((item, index) => (
                      <li key={index} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-3">
                  <div className="mb-2 text-xs font-medium text-cyan">机会</div>
                  <ul className="space-y-1">
                    {activeEvaluation.assessment.opportunities.map((item, index) => (
                      <li key={index} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber/20 bg-amber/5 p-3">
                  <div className="mb-2 text-xs font-medium text-amber">威胁</div>
                  <ul className="space-y-1">
                    {activeEvaluation.assessment.threats.map((item, index) => (
                      <li key={index} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-rose/20 bg-rose/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg text-rose">💬</span>
                  <span className="text-sm font-medium text-rose">毒舌评语</span>
                </div>
                <p className="text-sm italic text-white/90">{activeEvaluation.assessment.roastComment}</p>
              </div>

              <div className="flex items-center justify-around py-3">
                {Object.entries(activeEvaluation.assessment.scores).map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div className="mb-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={cn('h-4 w-4 rounded-sm', star <= score ? 'bg-amber' : 'bg-white/10')} />
                      ))}
                    </div>
                    <span className="text-xs capitalize text-star-dust">
                      {key === 'innovation' ? '创新性' : key === 'market' ? '市场' : key === 'feasibility' ? '可行性' : '团队'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => activeEvaluation && onPromoteToPlanner(activeEvaluation.id)}
                  className="flex-1 rounded-lg bg-emerald/20 px-4 py-2 text-sm text-emerald transition-colors hover:bg-emerald/30"
                >
                  立项为项目
                </button>
                <button className="flex-1 rounded-lg bg-amber/20 px-4 py-2 text-sm text-amber transition-colors hover:bg-amber/30">加入待评估</button>
                <button
                  onClick={() => {
                    setShowAssessment(false);
                    setSelectedEvaluation(null);
                  }}
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm text-star-dust transition-colors hover:bg-white/10"
                >
                  重新评估
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-purple" />
              <h2 className="text-lg font-semibold text-white">灵感碰撞机</h2>
            </div>
            <button
              onClick={() => {
                setShowSerendipityResult(false);
                setSerendipityIndex((value) => (value + 1) % serendipityPairs.length);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 text-star-dust" />
            </button>
          </div>

          <div className="py-6 text-center">
            <p className="mb-6 text-sm text-star-dust">今日随机组合</p>
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="rounded-xl border border-cyan/30 bg-cyan/10 px-6 py-4">
                <span className="font-medium text-cyan">{serendipityPairs[serendipityIndex].a}</span>
              </div>
              <span className="text-2xl text-star-dust">×</span>
              <div className="rounded-xl border border-purple/30 bg-purple/10 px-6 py-4">
                <span className="font-medium text-purple">{serendipityPairs[serendipityIndex].b}</span>
              </div>
            </div>

            {!showSerendipityResult ? (
              <button onClick={() => setShowSerendipityResult(true)} className="rounded-lg bg-gradient-cyan-purple px-6 py-3 font-medium text-white transition-all hover:brightness-110">
                探索关联
              </button>
            ) : (
              <div className="rounded-xl bg-elevated p-4 text-left animate-slide-up">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber" />
                  <span className="text-sm font-medium text-white">跨界灵感</span>
                </div>
                <p className="mb-4 text-sm text-white/90">
                  {serendipityPairs[serendipityIndex].a} 与 {serendipityPairs[serendipityIndex].b} 的共同哲学：
                </p>
                <ul className="space-y-2 text-sm text-star-dust">
                  <li className="flex items-start gap-2"><span className="text-cyan">1.</span><span>组合优于继承，模块化和结构化思维会反复出现。</span></li>
                  <li className="flex items-start gap-2"><span className="text-cyan">2.</span><span>声明式表达让复杂系统更容易理解和维护。</span></li>
                </ul>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => void handleSaveInspiration()}
                    className="flex items-center gap-1 rounded-lg bg-cyan/20 px-3 py-1.5 text-sm text-cyan transition-colors hover:bg-cyan/30"
                  >
                    <Save className="h-3.5 w-3.5" />
                    保存为笔记
                  </button>
                  <button
                    onClick={() => {
                      setShowSerendipityResult(false);
                      setSerendipityIndex((value) => (value + 1) % serendipityPairs.length);
                    }}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-star-dust transition-colors hover:bg-white/10"
                  >
                    下一个组合
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <p className="mb-3 text-xs text-star-dust">历史碰撞</p>
            <div className="space-y-2">
              {serendipityPairs.slice(0, serendipityIndex).map((pair, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-star-dust">
                  <span className="text-cyan">{pair.a}</span>
                  <span>×</span>
                  <span className="text-purple">{pair.b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
