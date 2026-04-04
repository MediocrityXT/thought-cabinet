import { useMemo } from 'react';
import { BookOpenText, Link2, PackagePlus, Sparkles } from 'lucide-react';
import { Refinery } from '@/pages/Refinery';
import { cn } from '@/lib/utils';
import type { Conversation, Material, Note, RefinerySettings } from '@/lib/types';

interface HopperProps {
  materials: Material[];
  activeConversation: Conversation | null;
  settings: RefinerySettings | null;
  submitting: boolean;
  onAddMaterial: (input: string) => Promise<void>;
  onOpenMaterial: (materialId: string) => Promise<void>;
  onSendMessage: (content: string) => Promise<void>;
  onResetConversation: () => Promise<void>;
  onPublishNote: () => Promise<void>;
  onSavePrompt: (defaultPrompt: string) => Promise<void>;
  onSaveMaterialMarkdown: (markdown: string) => Promise<void>;
  notes?: Note[];
}

const captureKinds = [
  { label: 'URL', description: '粘贴文章、论文或网页链接' },
  { label: 'Text', description: '直接输入文本片段或段落' },
  { label: 'Idea', description: '记录尚未成熟的想法' },
  { label: 'Fact', description: '捕捉刚学到的事实或证据' },
];

function HopperSnapshot({
  title,
  subtitle,
  emptyText,
  items,
}: {
  title: string;
  subtitle: string;
  emptyText: string;
  items: Array<{ id: string; title: string; detail: string; summary: string; tone: string }>;
}) {
  return (
    <section className="rounded-3xl border border-white/8 bg-panel/80 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan" />
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-star-dust">{subtitle}</p>
        </div>
      </div>

      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/5 bg-elevated/80 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="line-clamp-1 text-sm font-medium text-white">{item.title}</h4>
                <span className={cn('rounded-full border px-2 py-0.5 text-[11px]', item.tone)}>{item.detail}</span>
              </div>
              <p className="text-xs leading-5 text-star-dust">{item.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-elevated/40 p-4 text-sm text-star-dust">
          {emptyText}
        </div>
      )}
    </section>
  );
}

export function Hopper(props: HopperProps) {
  const queueSummary = useMemo(() => {
    const total = props.materials.length;
    const refined = props.materials.filter((material) => material.status === 'refined').length;
    const pending = total - refined;
    return [
      { label: '总输入', value: String(total) },
      { label: '待精炼', value: String(pending) },
      { label: '已发布', value: String(refined) },
    ];
  }, [props.materials]);

  const snapshotItems = useMemo(() => {
    const materialItems = props.materials.slice(0, 3).map((material) => ({
      id: material.id,
      title: material.title,
      detail: material.status === 'refined' ? '已发布到 Vault' : '仍在阅读队列',
      summary: material.summary,
      tone:
        material.status === 'refined'
          ? 'border-emerald/30 bg-emerald/10 text-emerald'
          : 'border-amber/30 bg-amber/10 text-amber',
    }));

    const noteItems = (props.notes ?? []).slice(0, 2).map((note) => ({
      id: note.id,
      title: note.title,
      detail: `${note.domain} · ${note.type}`,
      summary: note.content.slice(0, 90).replace(/\n+/g, ' '),
      tone:
        note.type === 'known'
          ? 'border-cyan/30 bg-cyan/10 text-cyan'
          : note.type === 'gap'
            ? 'border-rose/30 bg-rose/10 text-rose'
            : 'border-purple/30 bg-purple/10 text-purple',
    }));

    return [...materialItems, ...noteItems].slice(0, 4);
  }, [props.materials, props.notes]);

  return (
    <div className="flex min-h-full flex-col bg-deep text-white">
      <header className="border-b border-white/5 bg-panel/70 px-5 py-4 backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
                <PackagePlus className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Hopper</h1>
                <p className="text-sm text-star-dust">把 URL、文本、idea、fact 先投进来，再慢慢精炼成可引用的认知材料。</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-star-dust">
              Hopper 的重点不是“马上整理完”，而是先把输入放进阅读队列，保留上下文，并通过问答逐步提炼成事实、观点和永久笔记。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {queueSummary.map((item) => (
              <div key={item.label} className="min-w-24 rounded-2xl border border-white/5 bg-elevated/80 px-4 py-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-star-dust">{item.label}</div>
                <div className="mt-1 text-2xl font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 gap-4 p-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-3xl border border-white/8 bg-panel/80 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-cyan" />
              <div>
                <h2 className="text-sm font-semibold text-white">输入类型</h2>
                <p className="text-xs text-star-dust">Hopper 接受多种输入，不要求一开始就整理完。</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {captureKinds.map((kind) => (
                <div key={kind.label} className="rounded-2xl border border-white/5 bg-elevated/80 p-4">
                  <div className="mb-1 text-sm font-medium text-white">{kind.label}</div>
                  <p className="text-xs leading-5 text-star-dust">{kind.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/8 bg-panel/80 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenText className="h-4 w-4 text-purple" />
              <div>
                <h2 className="text-sm font-semibold text-white">阅读队列</h2>
                <p className="text-xs text-star-dust">所有投料都会先进入这里，等你有空再处理。</p>
              </div>
            </div>
            <div className="space-y-3">
              {props.materials.slice(0, 5).map((material) => (
                <button
                  key={material.id}
                  onClick={() => void props.onOpenMaterial(material.id)}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3 text-left transition-all hover:border-cyan/20',
                    material.status === 'refined' ? 'border-emerald/20 bg-emerald/10' : 'border-white/5 bg-elevated/80',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="line-clamp-1 text-sm font-medium text-white">{material.title}</span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[11px]',
                        material.status === 'refined'
                          ? 'border-emerald/30 bg-emerald/10 text-emerald'
                          : 'border-amber/30 bg-amber/10 text-amber',
                      )}
                    >
                      {material.status === 'refined' ? '已发布' : '待精炼'}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-5 text-star-dust">{material.summary}</p>
                </button>
              ))}
              {!props.materials.length ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-elevated/40 p-4 text-sm text-star-dust">
                  这里会显示阅读队列。你可以先扔一个 URL、文本、idea 或 fact 进来。
                </div>
              ) : null}
            </div>
          </section>

          <HopperSnapshot
            title="笔记快照"
            subtitle="从现有 materials / notes 里取一个很小的样本，方便快速确认系统状态。"
            emptyText="目前还没有可展示的快照。等你发布几条材料或笔记后，这里会自动出现摘要。"
            items={snapshotItems}
          />
        </aside>

        <section className="min-h-0 overflow-hidden rounded-3xl border border-white/8 bg-panel/60 backdrop-blur-md">
          <Refinery {...props} />
        </section>
      </main>

      <footer className="border-t border-white/5 bg-panel/70 px-5 py-3 text-xs leading-5 text-star-dust">
        Hopper 只是入口壳层；真正的精炼、对话和发布仍然交给现有 Refinery 完成。
      </footer>
    </div>
  );
}

export default Hopper;
