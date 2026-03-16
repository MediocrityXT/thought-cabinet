import { useEffect, useMemo, useRef, useState } from 'react';
import { Link2, Map, Plus, Search, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlueprintGraph } from '@/lib/types';

interface BlueprintProps {
  graph: BlueprintGraph;
}

type ViewMode = 'fog' | 'wall';

export function Blueprint({ graph }: BlueprintProps) {
  const [activeView, setActiveView] = useState<ViewMode>('fog');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionLabel, setConnectionLabel] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nodes = useMemo(() => {
    return graph.nodes.map((node, index) => {
      const angle = (index / Math.max(graph.nodes.length, 1)) * Math.PI * 2;
      const radiusX = 220;
      const radiusY = 150;
      return {
        ...node,
        x: 420 + Math.cos(angle) * radiusX,
        y: 260 + Math.sin(angle) * radiusY,
      };
    });
  }, [graph.nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeView !== 'fog') {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const fogGradient = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 0, rect.width / 2, rect.height / 2, rect.width / 2);
    fogGradient.addColorStop(0, 'rgba(10, 10, 15, 0.3)');
    fogGradient.addColorStop(1, 'rgba(10, 10, 15, 0.9)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    graph.edges.forEach((edge) => {
      const fromNode = nodes.find((node) => node.id === edge.source);
      const toNode = nodes.find((node) => node.id === edge.target);
      if (!fromNode || !toNode) {
        return;
      }
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
      if (edge.label) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(edge.label, midX, midY - 5);
      }
    });

    nodes.forEach((node) => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNodes.includes(node.id);
      if (node.type === 'known' || isHovered) {
        const glowSize = isHovered ? 30 : 20;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        const color = node.type === 'known' ? '0, 212, 255' : node.type === 'gap' ? '244, 63, 94' : '107, 114, 128';
        gradient.addColorStop(0, `rgba(${color}, 0.4)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 10 : 8, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'known' ? '#00d4ff' : node.type === 'gap' ? '#f43f5e' : '#6b7280';
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = isHovered ? '14px Inter' : '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 25);
      if (node.type === 'gap') {
        ctx.fillStyle = '#f43f5e';
        ctx.font = '10px Inter';
        ctx.fillText('(认知缺口)', node.x, node.y + 40);
      }
    });
  }, [activeView, graph.edges, hoveredNode, nodes, selectedNodes]);

  function handleNodeClick(nodeId: string) {
    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes((items) => items.filter((item) => item !== nodeId));
      return;
    }
    if (selectedNodes.length < 2) {
      const next = [...selectedNodes, nodeId];
      setSelectedNodes(next);
      if (next.length === 2) {
        setShowConnectionModal(true);
      }
    }
  }

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4">
        {[
          { id: 'fog', label: '战争迷雾', icon: Map },
          { id: 'wall', label: '理论连线', icon: Search },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as ViewMode)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all',
              activeView === id ? 'border border-cyan/30 bg-cyan/10 text-cyan' : 'text-star-dust hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {activeView === 'fog' ? (
          <div className="relative h-full w-full">
            <canvas
              ref={canvasRef}
              className="h-full w-full cursor-pointer"
              onMouseMove={(event) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) {
                  return;
                }
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const hovered = nodes.find((node) => Math.hypot(node.x - x, node.y - y) < 20);
                setHoveredNode(hovered?.id ?? null);
              }}
              onClick={() => hoveredNode && handleNodeClick(hoveredNode)}
            />

            <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-panel/90 p-4">
              <div className="mb-3 text-sm font-medium text-white">图例</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-cyan" /><span className="text-xs text-star-dust">已掌握</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-gray-500" /><span className="text-xs text-star-dust">未知领域</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-rose" /><span className="text-xs text-star-dust">认知缺口</span></div>
              </div>
            </div>

            <div className="absolute right-4 top-4 rounded-lg border border-white/10 bg-panel/90 p-4">
              <div className="mb-3 text-sm font-medium text-white">知识覆盖</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-8"><span className="text-star-dust">已掌握</span><span className="text-cyan">{graph.nodes.filter((node) => node.type === 'known').length}</span></div>
                <div className="flex justify-between gap-8"><span className="text-star-dust">认知缺口</span><span className="text-rose">{graph.nodes.filter((node) => node.type === 'gap').length}</span></div>
                <div className="flex justify-between gap-8"><span className="text-star-dust">覆盖率</span><span className="text-white">{graph.nodes.length ? Math.round((graph.nodes.filter((node) => node.type === 'known').length / graph.nodes.length) * 100) : 0}%</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="custom-scrollbar relative h-full overflow-auto bg-panel/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">理论连线板</h2>
                <p className="text-sm text-star-dust">像侦探一样连接线索，构建理论</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-lg bg-purple/20 px-4 py-2 text-sm text-purple transition-colors hover:bg-purple/30">
                  <Sparkles className="h-4 w-4" />
                  AI 推荐关联
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-cyan/20 px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/30">
                  <Plus className="h-4 w-4" />
                  添加笔记
                </button>
              </div>
            </div>

            <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-white/5 bg-deep-blue">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              {nodes.slice(0, 6).map((note, index) => (
                <div
                  key={note.id}
                  className="absolute w-48 cursor-move rounded-lg border border-white/10 bg-elevated p-4 transition-all hover:border-cyan/30 hover:shadow-glow-cyan"
                  style={{ left: 60 + (index % 3) * 220, top: 60 + Math.floor(index / 3) * 180 }}
                >
                  <div className="mb-2 flex items-start gap-2">
                    <span className="text-amber">📌</span>
                    <h4 className="text-sm font-medium text-white">{note.label}</h4>
                  </div>
                  <p className="text-xs text-star-dust">{note.domain} · {note.tags.slice(0, 2).join(', ') || '无标签'}</p>
                </div>
              ))}

              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                {nodes.slice(0, 2).length === 2 ? (
                  <>
                    <line x1="150" y1="100" x2="370" y2="150" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="2" />
                    <line x1="150" y1="100" x2="260" y2="300" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="2" />
                  </>
                ) : null}
              </svg>
              <div className="absolute left-[220px] top-[110px] rounded-full border border-rose/30 bg-rose/20 px-3 py-1 text-xs text-rose">演进关系</div>
            </div>
          </div>
        )}
      </div>

      {showConnectionModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-96 rounded-xl border border-white/10 bg-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">建立关联</h3>
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setSelectedNodes([]);
                }}
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X className="h-5 w-5 text-star-dust" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan">{nodes.find((node) => node.id === selectedNodes[0])?.label}</div>
              <Link2 className="h-4 w-4 text-star-dust" />
              <div className="rounded-lg border border-purple/30 bg-purple/10 px-3 py-2 text-sm text-purple">{nodes.find((node) => node.id === selectedNodes[1])?.label}</div>
            </div>

            <input
              type="text"
              placeholder="描述关联关系..."
              className="mb-4 w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              value={connectionLabel}
              onChange={(event) => setConnectionLabel(event.target.value)}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setSelectedNodes([]);
                  setConnectionLabel('');
                }}
                className="flex-1 rounded-lg bg-cyan/20 px-4 py-2 text-sm text-cyan transition-colors hover:bg-cyan/30"
              >
                建立连接
              </button>
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  setSelectedNodes([]);
                }}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-star-dust transition-colors hover:bg-white/10"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
