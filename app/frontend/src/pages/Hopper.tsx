import { useMemo } from 'react';
import { HelpCircle, PackagePlus } from 'lucide-react';
import { Refinery } from '@/pages/Refinery';
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

const tooltipText = '📥 支持投入 URL、纯文本、想法或事实\n📚 所有投料先进入左侧阅读队列\n💬 通过右侧对话逐步提炼要点\n📝 精炼完成后一键发布为永久笔记';

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

  return (
    <div className="flex min-h-full flex-col bg-deep text-white">
      <header className="border-b border-white/5 bg-panel/70 px-5 py-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
              <PackagePlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">投料口</h1>
                <Tooltip text={tooltipText} />
              </div>
              <p className="text-sm text-star-dust">把 URL、文本、想法、事实先投进来，再慢慢精炼成可引用的认知材料。</p>
            </div>
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

      <main className="min-h-0 flex-1 overflow-hidden">
        <Refinery {...props} />
      </main>
    </div>
  );
}

export default Hopper;
