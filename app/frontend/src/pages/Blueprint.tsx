import { useEffect, useMemo, useRef, useState } from 'react';
import { Map, Pin, Plus, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlueprintGraph, Note } from '@/lib/types';

interface BlueprintProps {
  graph: BlueprintGraph;
  notes: Note[];
}

type ViewMode = 'fog' | 'wall';

type LayoutNode = BlueprintGraph['nodes'][number] & { x: number; y: number };

type BoardCard = Note & { x: number; y: number };
type BoardConnection = { id: string; from: string; to: string };

function cardPosition(index: number) {
  return {
    x: 48 + (index % 3) * 240,
    y: 56 + Math.floor(index / 3) * 180,
  };
}

export function Blueprint({ graph, notes }: BlueprintProps) {
  const [activeView, setActiveView] = useState<ViewMode>('fog');
  const [selectedDomain, setSelectedDomain] = useState('全部');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [layoutNodes, setLayoutNodes] = useState<LayoutNode[]>([]);
  const [boardNotes, setBoardNotes] = useState<BoardCard[]>([]);
  const [boardConnections, setBoardConnections] = useState<BoardConnection[]>([]);
  const [pinMode, setPinMode] = useState(false);
  const [pendingLinkId, setPendingLinkId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const domainOptions = useMemo(() => {
    const domains = Array.from(new Set(graph.nodes.map((node) => node.domain).concat(notes.map((note) => note.domain)))).filter(Boolean);
    return ['全部', ...domains];
  }, [graph.nodes, notes]);

  const visibleGraphNodes = useMemo(() => {
    return selectedDomain === '全部'
      ? graph.nodes
      : graph.nodes.filter((node) => node.domain === selectedDomain);
  }, [graph.nodes, selectedDomain]);

  const visibleGraphEdges = useMemo(() => {
    const ids = new Set(visibleGraphNodes.map((node) => node.id));
    return graph.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
  }, [graph.edges, visibleGraphNodes]);

  const visibleNotes = useMemo(() => {
    return selectedDomain === '全部' ? notes : notes.filter((note) => note.domain === selectedDomain);
  }, [notes, selectedDomain]);

  useEffect(() => {
    setBoardNotes(visibleNotes.slice(0, 4).map((note, index) => ({ ...note, ...cardPosition(index) })));
    setBoardConnections([]);
    setPendingLinkId(null);
  }, [selectedDomain, visibleNotes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeView !== 'fog') {
      return;
    }
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const targetCanvas = canvas;
    const targetParent = parent;
    const targetCtx = ctx;

    function paint() {
      const rect = targetParent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      targetCanvas.style.width = `${rect.width}px`;
      targetCanvas.style.height = `${rect.height}px`;
      targetCanvas.width = rect.width * dpr;
      targetCanvas.height = rect.height * dpr;
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      targetCtx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.max(120, Math.min(rect.width, rect.height) * 0.28);
      const nextNodes = visibleGraphNodes.map((node, index) => {
        const angle = (index / Math.max(visibleGraphNodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
        return {
          ...node,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius * 0.72,
        };
      });
      setLayoutNodes(nextNodes);

      const fogGradient = targetCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, rect.width * 0.6);
      fogGradient.addColorStop(0, 'rgba(12, 18, 28, 0.18)');
      fogGradient.addColorStop(1, 'rgba(10, 10, 15, 0.92)');
      targetCtx.fillStyle = fogGradient;
      targetCtx.fillRect(0, 0, rect.width, rect.height);

      visibleGraphEdges.forEach((edge) => {
        const fromNode = nextNodes.find((node) => node.id === edge.source);
        const toNode = nextNodes.find((node) => node.id === edge.target);
        if (!fromNode || !toNode) {
          return;
        }
        targetCtx.strokeStyle = 'rgba(0, 212, 255, 0.28)';
        targetCtx.lineWidth = 2;
        targetCtx.beginPath();
        targetCtx.moveTo(fromNode.x, fromNode.y);
        targetCtx.lineTo(toNode.x, toNode.y);
        targetCtx.stroke();

        if (edge.label) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          targetCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          targetCtx.font = '10px Inter';
          targetCtx.textAlign = 'center';
          targetCtx.fillText(edge.label, midX, midY - 6);
        }
      });

      nextNodes.forEach((node) => {
        const isHovered = hoveredNode === node.id;
        const glowSize = isHovered ? 32 : 22;
        const glowGradient = targetCtx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        const color = node.type === 'known' ? '0, 212, 255' : node.type === 'gap' ? '244, 63, 94' : '107, 114, 128';
        glowGradient.addColorStop(0, `rgba(${color}, 0.42)`);
        glowGradient.addColorStop(1, 'transparent');
        targetCtx.fillStyle = glowGradient;
        targetCtx.beginPath();
        targetCtx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        targetCtx.fill();

        targetCtx.fillStyle = node.type === 'known' ? '#00d4ff' : node.type === 'gap' ? '#f43f5e' : '#6b7280';
        targetCtx.beginPath();
        targetCtx.arc(node.x, node.y, isHovered ? 10 : 8, 0, Math.PI * 2);
        targetCtx.fill();

        targetCtx.fillStyle = 'rgba(255,255,255,0.92)';
        targetCtx.font = isHovered ? '14px Inter' : '12px Inter';
        targetCtx.textAlign = 'center';
        targetCtx.fillText(node.label, node.x, node.y + 26);

        if (node.type === 'gap') {
          targetCtx.fillStyle = '#f43f5e';
          targetCtx.font = '10px Inter';
          targetCtx.fillText('(认知缺口)', node.x, node.y + 42);
        }
      });
    }

    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, [activeView, hoveredNode, visibleGraphEdges, visibleGraphNodes]);

  function handleBoardNoteClick(noteId: string) {
    if (!pinMode) {
      return;
    }
    if (!pendingLinkId) {
      setPendingLinkId(noteId);
      return;
    }
    if (pendingLinkId === noteId) {
      setPendingLinkId(null);
      return;
    }
    const duplicate = boardConnections.some(
      (connection) =>
        (connection.from === pendingLinkId && connection.to === noteId) ||
        (connection.from === noteId && connection.to === pendingLinkId),
    );
    if (!duplicate) {
      setBoardConnections((connections) => [...connections, { id: `${pendingLinkId}-${noteId}`, from: pendingLinkId, to: noteId }]);
    }
    setPendingLinkId(null);
    setPinMode(false);
  }

  function addBoardNote(note: Note) {
    setBoardNotes((items) => {
      if (items.some((item) => item.id === note.id)) {
        return items;
      }
      return [...items, { ...note, ...cardPosition(items.length) }];
    });
  }

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {domainOptions.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs transition-colors',
                selectedDomain === domain ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/10 bg-white/5 text-star-dust hover:text-white',
              )}
            >
              {domain}
            </button>
          ))}
        </div>
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
                const hovered = layoutNodes.find((node) => Math.hypot(node.x - x, node.y - y) < 22);
                setHoveredNode(hovered?.id ?? null);
              }}
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
              <div className="mb-3 text-sm font-medium text-white">{selectedDomain} 覆盖</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-8"><span className="text-star-dust">已掌握</span><span className="text-cyan">{visibleGraphNodes.filter((node) => node.type === 'known').length}</span></div>
                <div className="flex justify-between gap-8"><span className="text-star-dust">认知缺口</span><span className="text-rose">{visibleGraphNodes.filter((node) => node.type === 'gap').length}</span></div>
                <div className="flex justify-between gap-8"><span className="text-star-dust">覆盖率</span><span className="text-white">{visibleGraphNodes.length ? Math.round((visibleGraphNodes.filter((node) => node.type === 'known').length / visibleGraphNodes.length) * 100) : 0}%</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="flex min-w-0 flex-1 flex-col bg-panel/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">理论连线板</h2>
                  <p className="text-sm text-star-dust">添加笔记卡片后，点亮图钉，再依次点击两张卡片即可连线。</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg bg-purple/20 px-4 py-2 text-sm text-purple transition-colors hover:bg-purple/30">
                    <Sparkles className="h-4 w-4" />
                    AI 推荐关联
                  </button>
                  <button
                    onClick={() => {
                      setPinMode((value) => !value);
                      setPendingLinkId(null);
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors',
                      pinMode ? 'bg-amber/20 text-amber hover:bg-amber/30' : 'bg-cyan/20 text-cyan hover:bg-cyan/30',
                    )}
                  >
                    <Pin className="h-4 w-4" />
                    {pinMode ? '退出连线' : '图钉连线'}
                  </button>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/5 bg-deep-blue">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                  {boardConnections.map((connection) => {
                    const from = boardNotes.find((note) => note.id === connection.from);
                    const to = boardNotes.find((note) => note.id === connection.to);
                    if (!from || !to) {
                      return null;
                    }
                    const startX = from.x + 192;
                    const startY = from.y + 56;
                    const endX = to.x;
                    const endY = to.y + 56;
                    const midX = (startX + endX) / 2;
                    return (
                      <polyline
                        key={connection.id}
                        points={`${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`}
                        fill="none"
                        stroke="rgba(244, 63, 94, 0.7)"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                {boardNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleBoardNoteClick(note.id)}
                    className={cn(
                      'absolute w-48 rounded-lg border border-white/10 bg-elevated p-4 text-left transition-all hover:border-cyan/30 hover:shadow-glow-cyan',
                      pendingLinkId === note.id ? 'ring ring-amber/60' : '',
                    )}
                    style={{ left: note.x, top: note.y }}
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <span className={cn('text-lg', pendingLinkId === note.id ? 'text-amber' : 'text-cyan')}>📌</span>
                      <h4 className="text-sm font-medium text-white">{note.title}</h4>
                    </div>
                    <p className="line-clamp-3 text-xs leading-5 text-star-dust">{note.content.replace(/\n+/g, ' ')}</p>
                  </button>
                ))}
              </div>
            </div>

            <aside className="custom-scrollbar w-80 overflow-auto border-l border-white/5 bg-panel/70 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">可添加笔记</h3>
                <p className="mt-1 text-xs text-star-dust">当前领域：{selectedDomain}</p>
              </div>
              <div className="space-y-3">
                {visibleNotes.map((note) => {
                  const exists = boardNotes.some((item) => item.id === note.id);
                  return (
                    <div key={note.id} className="rounded-lg border border-white/5 bg-elevated p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-medium text-white">{note.title}</h4>
                          <p className="mt-1 text-xs text-star-dust">{note.domain}</p>
                        </div>
                        <button
                          onClick={() => addBoardNote(note)}
                          disabled={exists}
                          className="flex items-center gap-1 rounded-md bg-cyan/10 px-2 py-1 text-xs text-cyan transition-colors hover:bg-cyan/20 disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                          {exists ? '已添加' : '加入'}
                        </button>
                      </div>
                      <p className="line-clamp-2 text-xs leading-5 text-star-dust">{note.content.replace(/\n+/g, ' ')}</p>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
