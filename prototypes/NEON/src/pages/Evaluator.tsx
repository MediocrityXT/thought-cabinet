import { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  Target, 
  Shuffle, 
  Lightbulb,
  Save,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  impact: number;
  feasibility: number;
  domain: string;
  status: 'idea' | 'evaluating' | 'active' | 'archived';
}

interface VCAssessment {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  roastComment: string;
  scores: {
    innovation: number;
    market: number;
    feasibility: number;
    team: number;
  };
}

const sampleProjects: Project[] = [
  { id: '1', title: 'AI 个人理财助手', impact: 75, feasibility: 80, domain: '产品', status: 'evaluating' },
  { id: '2', title: '分布式笔记系统', impact: 90, feasibility: 60, domain: '技术', status: 'active' },
  { id: '3', title: 'Web3 社交平台', impact: 85, feasibility: 40, domain: '产品', status: 'idea' },
  { id: '4', title: '自动化测试框架', impact: 60, feasibility: 90, domain: '技术', status: 'idea' },
  { id: '5', title: '知识图谱可视化', impact: 70, feasibility: 70, domain: '设计', status: 'evaluating' },
];

const sampleAssessment: VCAssessment = {
  strengths: ['市场需求明确', '技术可行性高', '用户痛点清晰'],
  weaknesses: ['竞争激烈', '差异化不明显', '获客成本高'],
  opportunities: ['AI 技术成熟', '用户意识觉醒', '政策利好'],
  threats: ['大厂入局', '经济下行', '监管风险'],
  roastComment: '"这只是个 Feature，不是 Product。市场上已经有 50+ 同类产品，你的差异化在哪里？除非你能解决"让用户坚持记账"这个痛点，否则就是又一个被遗忘的 App。"',
  scores: {
    innovation: 3,
    market: 4,
    feasibility: 4,
    team: 3,
  },
};

const serendipityPairs = [
  { a: 'React Hooks', b: '建筑设计模式' },
  { a: 'AI 神经网络', b: '古代哲学' },
  { a: '音乐理论', b: '代码架构' },
];

export function Evaluator() {
  const [ideaInput, setIdeaInput] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [,] = useState<Project | null>(null);
  const [serendipityIndex, setSerendipityIndex] = useState(0);
  const [showSerendipityResult, setShowSerendipityResult] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw matrix
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Center lines
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, rect.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(rect.width, centerY);
    ctx.stroke();

    // Draw quadrant labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('难但有价值', centerX * 0.5, centerY * 0.5);
    ctx.fillText('高优先级', centerX * 1.5, centerY * 0.5);
    ctx.fillText('搁置', centerX * 0.5, centerY * 1.5);
    ctx.fillText('快速胜利', centerX * 1.5, centerY * 1.5);

    // Draw projects
    sampleProjects.forEach((project) => {
      const x = (project.feasibility / 100) * rect.width;
      const y = rect.height - (project.impact / 100) * rect.height;

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(project.title, x, y - 12);
    });
  }, []);

  const handleAssess = () => {
    if (!ideaInput.trim()) return;
    setShowAssessment(true);
  };

  const handleNewSerendipity = () => {
    setShowSerendipityResult(false);
    setSerendipityIndex((prev) => (prev + 1) % serendipityPairs.length);
  };

  return (
    <div className="h-full overflow-auto custom-scrollbar p-6 animate-fade-in">
      {/* Matrix */}
      <div className="bg-panel border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan" />
            <h2 className="text-lg font-semibold text-white">价值四象限</h2>
          </div>
          <span className="text-sm text-star-dust">拖拽项目调整优先级</span>
        </div>
        
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-[400px] rounded-lg bg-deep-blue"
          />
          
          {/* Axis Labels */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-star-dust">
            影响力 ↑
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-star-dust">
            可行性 →
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* VC Assessment */}
        <div className="bg-panel border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-amber" />
            <h2 className="text-lg font-semibold text-white">毒舌 VC</h2>
          </div>

          {!showAssessment ? (
            <div className="space-y-4">
              <textarea
                placeholder="描述你的想法..."
                className="w-full h-32 bg-elevated border border-white/10 rounded-lg p-4 text-white placeholder:text-star-dust focus:outline-none focus:border-amber resize-none"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
              />
              <div className="flex items-center gap-2">
                {['App 点子', '商业想法', '技术方案'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setIdeaInput(tag + ': ')}
                    className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-star-dust hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAssess}
                disabled={!ideaInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-amber-rose text-white rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                开始评估
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up">
              {/* SWOT */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald/5 border border-emerald/20 rounded-lg p-3">
                  <div className="text-xs font-medium text-emerald mb-2">优势</div>
                  <ul className="space-y-1">
                    {sampleAssessment.strengths.map((item, i) => (
                      <li key={i} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose/5 border border-rose/20 rounded-lg p-3">
                  <div className="text-xs font-medium text-rose mb-2">劣势</div>
                  <ul className="space-y-1">
                    {sampleAssessment.weaknesses.map((item, i) => (
                      <li key={i} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cyan/5 border border-cyan/20 rounded-lg p-3">
                  <div className="text-xs font-medium text-cyan mb-2">机会</div>
                  <ul className="space-y-1">
                    {sampleAssessment.opportunities.map((item, i) => (
                      <li key={i} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-lg p-3">
                  <div className="text-xs font-medium text-amber mb-2">威胁</div>
                  <ul className="space-y-1">
                    {sampleAssessment.threats.map((item, i) => (
                      <li key={i} className="text-xs text-white/80">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Roast Comment */}
              <div className="bg-rose/5 border border-rose/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose text-lg">💬</span>
                  <span className="text-sm font-medium text-rose">毒舌评语</span>
                </div>
                <p className="text-sm text-white/90 italic">{sampleAssessment.roastComment}</p>
              </div>

              {/* Scores */}
              <div className="flex items-center justify-around py-3">
                {Object.entries(sampleAssessment.scores).map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={cn(
                            "w-4 h-4 rounded-sm",
                            star <= score ? "bg-amber" : "bg-white/10"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-star-dust capitalize">
                      {key === 'innovation' ? '创新性' : 
                       key === 'market' ? '市场' : 
                       key === 'feasibility' ? '可行性' : '团队'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 px-4 py-2 bg-emerald/20 text-emerald rounded-lg text-sm hover:bg-emerald/30 transition-colors">
                  立项为项目
                </button>
                <button className="flex-1 px-4 py-2 bg-amber/20 text-amber rounded-lg text-sm hover:bg-amber/30 transition-colors">
                  加入待评估
                </button>
                <button 
                  onClick={() => { setShowAssessment(false); setIdeaInput(''); }}
                  className="px-4 py-2 bg-white/5 text-star-dust rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  重新评估
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Serendipity Engine */}
        <div className="bg-panel border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-purple" />
              <h2 className="text-lg font-semibold text-white">灵感碰撞机</h2>
            </div>
            <button 
              onClick={handleNewSerendipity}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-star-dust" />
            </button>
          </div>

          <div className="text-center py-6">
            <p className="text-sm text-star-dust mb-6">今日随机组合</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="px-6 py-4 bg-cyan/10 border border-cyan/30 rounded-xl">
                <span className="text-cyan font-medium">{serendipityPairs[serendipityIndex].a}</span>
              </div>
              <span className="text-2xl text-star-dust">×</span>
              <div className="px-6 py-4 bg-purple/10 border border-purple/30 rounded-xl">
                <span className="text-purple font-medium">{serendipityPairs[serendipityIndex].b}</span>
              </div>
            </div>

            {!showSerendipityResult ? (
              <button
                onClick={() => setShowSerendipityResult(true)}
                className="px-6 py-3 bg-gradient-cyan-purple text-white rounded-lg font-medium hover:brightness-110 transition-all"
              >
                探索关联
              </button>
            ) : (
              <div className="bg-elevated rounded-xl p-4 text-left animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber" />
                  <span className="text-sm font-medium text-white">跨界灵感</span>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  {serendipityPairs[serendipityIndex].a} 与 {serendipityPairs[serendipityIndex].b} 的共同哲学：
                </p>
                <ul className="space-y-2 text-sm text-star-dust">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan">1.</span>
                    <span>组合优于继承 — 模块化的思维方式</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan">2.</span>
                    <span>声明式表达 — 关注"是什么"而非"怎么做"</span>
                  </li>
                </ul>
                <div className="flex items-center gap-2 mt-4">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors">
                    <Save className="w-3.5 h-3.5" />
                    保存为笔记
                  </button>
                  <button 
                    onClick={handleNewSerendipity}
                    className="px-3 py-1.5 bg-white/5 text-star-dust rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    下一个组合
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* History */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-star-dust mb-3">历史碰撞</p>
            <div className="space-y-2">
              {serendipityPairs.slice(0, serendipityIndex).map((pair, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-star-dust">
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
