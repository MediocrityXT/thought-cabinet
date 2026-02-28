import { useState, useRef, useEffect } from 'react';
import { 
  Map, 
  Network, 
  Search,
  Plus,
  Link2,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'known' | 'unknown' | 'gap';
  domain: string;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

const sampleNodes: KnowledgeNode[] = [
  { id: '1', label: 'React', x: 300, y: 200, type: 'known', domain: '技术' },
  { id: '2', label: 'Hooks', x: 400, y: 280, type: 'known', domain: '技术' },
  { id: '3', label: '性能优化', x: 350, y: 380, type: 'gap', domain: '技术' },
  { id: '4', label: 'Context', x: 500, y: 250, type: 'known', domain: '技术' },
  { id: '5', label: 'Redux', x: 600, y: 300, type: 'known', domain: '技术' },
  { id: '6', label: 'Server Components', x: 450, y: 150, type: 'unknown', domain: '技术' },
  { id: '7', label: 'Suspense', x: 550, y: 200, type: 'unknown', domain: '技术' },
  { id: '8', label: 'Next.js', x: 650, y: 180, type: 'gap', domain: '技术' },
];

const sampleConnections: Connection[] = [
  { from: '1', to: '2', label: '包含' },
  { from: '1', to: '4', label: '包含' },
  { from: '2', to: '3', label: '需要' },
  { from: '4', to: '5', label: '替代' },
  { from: '1', to: '6', label: '演进' },
  { from: '6', to: '7', label: '配合' },
  { from: '6', to: '8', label: '实现' },
];

const wallNotes = [
  { id: '1', title: 'React 设计哲学', x: 50, y: 50, content: '组件化、声明式、单向数据流' },
  { id: '2', title: 'Hooks 的革新', x: 300, y: 100, content: '状态逻辑复用的新方式' },
  { id: '3', title: '性能优化策略', x: 150, y: 250, content: 'memo、useMemo、useCallback' },
];

export function Blueprint() {
  const [activeView, setActiveView] = useState<'fog' | 'network' | 'wall'>('fog');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionLabel, setConnectionLabel] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw knowledge graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeView !== 'fog') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw fog background
    const fogGradient = ctx.createRadialGradient(
      rect.width / 2, rect.height / 2, 0,
      rect.width / 2, rect.height / 2, rect.width / 2
    );
    fogGradient.addColorStop(0, 'rgba(10, 10, 15, 0.3)');
    fogGradient.addColorStop(1, 'rgba(10, 10, 15, 0.9)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw connections
    sampleConnections.forEach((conn) => {
      const fromNode = sampleNodes.find(n => n.id === conn.from);
      const toNode = sampleNodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) return;

      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();

      // Connection label
      if (conn.label) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(conn.label, midX, midY - 5);
      }
    });

    // Draw nodes
    sampleNodes.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNodes.includes(node.id);

      // Glow for known nodes
      if (node.type === 'known' || isHovered) {
        const glowSize = isHovered ? 30 : 20;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        const color = node.type === 'known' ? '0, 212, 255' : 
                     node.type === 'gap' ? '244, 63, 94' : '107, 114, 128';
        gradient.addColorStop(0, `rgba(${color}, 0.4)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 10 : 8, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'known' ? '#00d4ff' : 
                     node.type === 'gap' ? '#f43f5e' : '#6b7280';
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = isHovered ? '14px Inter' : '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 25);

      // Type indicator
      if (node.type === 'gap') {
        ctx.fillStyle = '#f43f5e';
        ctx.font = '10px Inter';
        ctx.fillText('(认知缺口)', node.x, node.y + 40);
      }
    });
  }, [activeView, hoveredNode, selectedNodes]);

  const handleNodeClick = (nodeId: string) => {
    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes(selectedNodes.filter(id => id !== nodeId));
    } else if (selectedNodes.length < 2) {
      const newSelection = [...selectedNodes, nodeId];
      setSelectedNodes(newSelection);
      if (newSelection.length === 2) {
        setShowConnectionModal(true);
      }
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* View Tabs */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
        {[
          { id: 'fog', label: '战争迷雾', icon: Map },
          { id: 'network', label: '知识图谱', icon: Network },
          { id: 'wall', label: '理论连线', icon: Search },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
              activeView === id
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
      <div className="flex-1 overflow-hidden relative">
        {activeView === 'fog' && (
          <div className="w-full h-full relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-pointer"
              onMouseMove={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const hovered = sampleNodes.find(node => {
                  const dx = node.x - x;
                  const dy = node.y - y;
                  return Math.sqrt(dx * dx + dy * dy) < 20;
                });
                setHoveredNode(hovered?.id || null);
              }}
              onClick={() => hoveredNode && handleNodeClick(hoveredNode)}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-panel/90 border border-white/10 rounded-lg p-4">
              <div className="text-sm font-medium text-white mb-3">图例</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan" />
                  <span className="text-xs text-star-dust">已掌握</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-xs text-star-dust">未知领域</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose" />
                  <span className="text-xs text-star-dust">认知缺口</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="absolute top-4 right-4 bg-panel/90 border border-white/10 rounded-lg p-4">
              <div className="text-sm font-medium text-white mb-3">知识覆盖</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-8">
                  <span className="text-star-dust">已掌握</span>
                  <span className="text-cyan">{sampleNodes.filter(n => n.type === 'known').length}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-star-dust">认知缺口</span>
                  <span className="text-rose">{sampleNodes.filter(n => n.type === 'gap').length}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-star-dust">覆盖率</span>
                  <span className="text-white">{Math.round((sampleNodes.filter(n => n.type === 'known').length / sampleNodes.length) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'wall' && (
          <div className="w-full h-full bg-panel/50 p-6 overflow-auto custom-scrollbar relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">理论连线板</h2>
                <p className="text-sm text-star-dust">像侦探一样连接线索，构建理论</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple/20 text-purple rounded-lg text-sm hover:bg-purple/30 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  AI 推荐关联
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors">
                  <Plus className="w-4 h-4" />
                  添加笔记
                </button>
              </div>
            </div>

            {/* Wall Canvas */}
            <div className="relative w-full h-[600px] bg-deep-blue rounded-xl border border-white/5 overflow-hidden">
              {/* Grid pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Notes */}
              {wallNotes.map((note) => (
                <div
                  key={note.id}
                  className="absolute bg-elevated border border-white/10 rounded-lg p-4 w-48 cursor-move hover:border-cyan/30 hover:shadow-glow-cyan transition-all"
                  style={{ left: note.x, top: note.y }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-amber">📌</span>
                    <h4 className="text-sm font-medium text-white">{note.title}</h4>
                  </div>
                  <p className="text-xs text-star-dust">{note.content}</p>
                </div>
              ))}

              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="150" y1="100" x2="350" y2="150" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="2" />
                <line x1="150" y1="100" x2="250" y2="300" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="2" />
              </svg>

              {/* Connection Label */}
              <div 
                className="absolute px-3 py-1 bg-rose/20 border border-rose/30 rounded-full text-xs text-rose"
                style={{ left: 220, top: 110 }}
              >
                演进关系
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-panel border border-white/10 rounded-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">建立关联</h3>
              <button 
                onClick={() => { setShowConnectionModal(false); setSelectedNodes([]); }}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5 text-star-dust" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-2 bg-cyan/10 border border-cyan/30 rounded-lg text-cyan text-sm">
                {sampleNodes.find(n => n.id === selectedNodes[0])?.label}
              </div>
              <Link2 className="w-4 h-4 text-star-dust" />
              <div className="px-3 py-2 bg-purple/10 border border-purple/30 rounded-lg text-purple text-sm">
                {sampleNodes.find(n => n.id === selectedNodes[1])?.label}
              </div>
            </div>

            <input
              type="text"
              placeholder="描述关联关系..."
              className="w-full bg-elevated border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-star-dust focus:outline-none focus:border-cyan mb-4"
              value={connectionLabel}
              onChange={(e) => setConnectionLabel(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setShowConnectionModal(false); setSelectedNodes([]); setConnectionLabel(''); }}
                className="flex-1 px-4 py-2 bg-cyan/20 text-cyan rounded-lg text-sm hover:bg-cyan/30 transition-colors"
              >
                建立连接
              </button>
              <button 
                onClick={() => { setShowConnectionModal(false); setSelectedNodes([]); }}
                className="px-4 py-2 bg-white/5 text-star-dust rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
