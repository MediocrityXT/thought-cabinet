import { useMemo } from 'react';
import { HelpCircle, Map as MapIcon } from 'lucide-react';
import { Blueprint } from '@/pages/Blueprint';
import type { BlueprintGraph, Note } from '@/lib/types';

interface KnowledgeBlueprintProps {
  graph: BlueprintGraph;
  notes: Note[];
}

const tooltipText = '🗺️ 已有笔记在图谱上高亮，未覆盖区域显示为迷雾\n📌 侦探墙模式可手动钉住节点、拉线、写注释\n🤖 右侧自动推荐合并、补线、复核等整理建议';

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

type SuggestionKind = 'merge' | 'link' | 'conflict' | 'stale';

interface SuggestionItem {
  kind: SuggestionKind;
  title: string;
  detail: string;
  hint: string;
}

function buildSuggestions(graph: BlueprintGraph, notes: Note[]): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  const domainCounts = new globalThis.Map<string, number>();
  for (const note of notes) {
    domainCounts.set(note.domain, (domainCounts.get(note.domain) ?? 0) + 1);
  }
  const mergeCandidate = Array.from(domainCounts.entries())
    .filter(([, count]) => count >= 3)
    .sort((left, right) => right[1] - left[1])[0];
  if (mergeCandidate) {
    suggestions.push({
      kind: 'merge',
      title: `建议合并：${mergeCandidate[0]} 主题簇`,
      detail: `当前有 ${mergeCandidate[1]} 条笔记分布在同一领域，适合先合并成一条更稳定的观点主线。`,
      hint: '把重复笔记收敛成"一个事实 + 一个观点"的结构。',
    });
  }

  const lonelyNodes = graph.nodes.filter((node) => !graph.edges.some((edge) => edge.source === node.id || edge.target === node.id));
  const lonelyNode = lonelyNodes[0];
  if (lonelyNode) {
    suggestions.push({
      kind: 'link',
      title: `建议连线：${lonelyNode.label}`,
      detail: `图中有概念节点暂时没有连接，适合手动补一条 supporting / related 关系。`,
      hint: '把它拖进侦探墙，看看能和哪条观点产生关系。',
    });
  }

  const gapNode = graph.nodes.find((node) => node.type === 'gap');
  if (gapNode) {
    suggestions.push({
      kind: 'conflict',
      title: `需要复核：${gapNode.label}`,
      detail: '这个节点被标成认知缺口，说明它要么证据不足，要么和现有认知存在冲突。',
      hint: '优先找支撑事实或反对事实，而不是先扩展新结论。',
    });
  }

  const staleNote = notes.find((note) => note.type === 'unknown' || note.type === 'gap');
  if (staleNote) {
    suggestions.push({
      kind: 'stale',
      title: `可能过期：${staleNote.title}`,
      detail: '当前仍处于未确认或待补强状态，适合在新的材料到来后重新提炼一次。',
      hint: '把旧观点和新事实放在一起对照，看看是否需要更新结论。',
    });
  }

  while (suggestions.length < 4) {
    const filler: SuggestionItem[] = [
      {
        kind: 'merge',
        title: '合并建议待补充',
        detail: '更多同领域笔记进入后，这里会自动出现可合并的碎片。',
        hint: '通常来自同一 domain 中高重复率的短笔记。',
      },
      {
        kind: 'link',
        title: '连线建议待补充',
        detail: '当图谱中出现更多孤立节点时，会提示你补上关联。',
        hint: '优先连接"概念页"和"结论页"。',
      },
      {
        kind: 'conflict',
        title: '冲突检查待补充',
        detail: '后续可根据反对事实、时间线或不同来源自动标记冲突。',
        hint: '适合用来提醒旧推论是否还成立。',
      },
      {
        kind: 'stale',
        title: '过期提醒待补充',
        detail: '当新事实进入并影响已有观点时，这里会提示复核。',
        hint: '重点看时效性和适用边界。',
      },
    ];
    suggestions.push(filler[suggestions.length]);
  }

  return suggestions.slice(0, 4);
}

function Badge({ kind }: { kind: SuggestionKind }) {
  const tone =
    kind === 'merge'
      ? 'border-amber/25 bg-amber/10 text-amber'
      : kind === 'link'
        ? 'border-cyan/25 bg-cyan/10 text-cyan'
        : kind === 'conflict'
          ? 'border-rose/25 bg-rose/10 text-rose'
          : 'border-purple/25 bg-purple/10 text-purple';
  const label = kind === 'merge' ? '合并' : kind === 'link' ? '连线' : kind === 'conflict' ? '冲突' : '过期';

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] tracking-wider ${tone}`}>{label}</span>;
}

export function KnowledgeBlueprint({ graph, notes }: KnowledgeBlueprintProps) {
  const suggestions = useMemo(() => buildSuggestions(graph, notes), [graph, notes]);

  return (
    <div className="flex h-full flex-col bg-deep text-white">
      <header className="border-b border-white/5 bg-panel/70 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
            <MapIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">认知蓝图</h1>
              <Tooltip text={tooltipText} />
            </div>
            <p className="text-sm text-star-dust">把事实、观点与关系画出来，看清哪些地方还在迷雾里、哪些适合合并或复核。</p>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 overflow-hidden xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-h-0 border-r border-white/5">
          <Blueprint graph={graph} notes={notes} />
        </div>

        <aside className="custom-scrollbar overflow-auto border-t border-white/5 bg-deep/60 xl:border-t-0">
          <div className="space-y-3 p-5">
            {suggestions.map((item) => (
              <article key={`${item.kind}-${item.title}`} className="rounded-2xl border border-white/8 bg-elevated/80 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-star-dust">{item.detail}</p>
                  </div>
                  <Badge kind={item.kind} />
                </div>
                <div className="rounded-xl border border-white/8 bg-panel/70 px-3 py-2 text-xs leading-5 text-star-dust">
                  {item.hint}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default KnowledgeBlueprint;
