import { useMemo } from 'react';
import { Bot, Link2, Map as MapIcon, Pin, TriangleAlert } from 'lucide-react';
import { Blueprint } from '@/pages/Blueprint';
import type { BlueprintGraph, Note } from '@/lib/types';

interface KnowledgeBlueprintProps {
  graph: BlueprintGraph;
  notes: Note[];
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
      hint: '把重复笔记收敛成“一个事实 + 一个观点”的结构。',
    });
  }

  const lonelyNodes = graph.nodes.filter((node) => !graph.edges.some((edge) => edge.source === node.id || edge.target === node.id));
  const lonelyNode = lonelyNodes[0];
  if (lonelyNode) {
    suggestions.push({
      kind: 'link',
      title: `建议连线：${lonelyNode.label}`,
      detail: `图中有概念节点暂时没有连接，适合手动补一条 supporting / related 关系。`,
      hint: '把它拖进 Detective Wall，看看能和哪条观点产生关系。',
    });
  }

  const gapNode = graph.nodes.find((node) => node.type === 'gap');
  if (gapNode) {
    suggestions.push({
      kind: 'conflict',
      title: `需要复核：${gapNode.label}`,
      detail: '这个节点被标成认知缺口，说明它要么证据不足，要么和现有认知存在冲突。',
      hint: '优先找 supporting facts 或 opposing facts，而不是先扩展新结论。',
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
        hint: '优先连接“概念页”和“结论页”。',
      },
      {
        kind: 'conflict',
        title: '冲突检查待补充',
        detail: '后续可根据 opposing facts、时间线或不同来源自动标记冲突。',
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
  const label = kind === 'merge' ? 'Merge' : kind === 'link' ? 'Link' : kind === 'conflict' ? 'Conflict' : 'Stale';

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] ${tone}`}>{label}</span>;
}

export function KnowledgeBlueprint({ graph, notes }: KnowledgeBlueprintProps) {
  const suggestions = useMemo(() => buildSuggestions(graph, notes), [graph, notes]);

  return (
    <div className="space-y-6 p-6">
      <section className="overflow-hidden rounded-[28px] border border-white/8 bg-panel/85 shadow-2xl">
        <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)] px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-cyan" />
                <span className="text-xs uppercase tracking-[0.3em] text-star-dust">Knowledge Blueprint</span>
              </div>
              <h1 className="text-2xl font-semibold text-white">认知蓝图</h1>
              <p className="max-w-2xl text-sm leading-6 text-star-dust">
                这层视图负责把事实、观点与关系画出来，同时提醒哪些地方还在战争迷雾里，哪些地方更适合拉线、合并或复核。
              </p>
            </div>

            <div className="grid gap-2 text-xs text-star-dust sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-elevated/70 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-white">
                  <TriangleAlert className="h-4 w-4 text-rose" />
                  战争迷雾
                </div>
                <p className="leading-5">未正式纳入认知体系，但值得继续探索的区域。</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-elevated/70 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-white">
                  <Pin className="h-4 w-4 text-cyan" />
                  Detective Wall
                </div>
                <p className="leading-5">允许手动钉住节点、补线、写下注释，先形成思考草图。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-h-[720px] border-r border-white/5">
            <Blueprint graph={graph} notes={notes} />
          </div>

          <aside className="border-t border-white/5 bg-deep/60 xl:border-t-0">
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple" />
                <h2 className="text-sm font-semibold text-white">整理建议</h2>
              </div>
              <p className="text-xs leading-5 text-star-dust">
                这些都是基于当前 notes / graph 的轻量提示，不是最终判定。它们的作用是帮你更快找到需要合并、补线、复核的地方。
              </p>

              <div className="space-y-3">
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

              <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Link2 className="h-4 w-4 text-cyan" />
                  连接提示
                </div>
                <p className="text-xs leading-5 text-star-dust">
                  如果一条观点背后没有支撑事实，先补 evidence；如果两条观点语义接近，先合并；如果新旧论据冲突，先标记再判断是否过期。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default KnowledgeBlueprint;
