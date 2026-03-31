import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenText, Eraser, FileCog, FileText, Link2, Save, Send, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation, Material, RefinerySettings } from '@/lib/types';

interface RefineryProps {
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
  onSaveReport: (report: string) => Promise<void>;
}

function PromptSheet({
  open,
  value,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  value: string;
  saving: boolean;
  onClose: () => void;
  onSave: (nextValue: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-white/10 bg-panel shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Refinery Prompt</h2>
            <p className="text-sm text-star-dust">修改默认的精炼 Prompt 结构</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/10">
            <X className="h-5 w-5 text-star-dust" />
          </button>
        </div>
        <div className="flex h-[calc(100%-84px)] flex-col gap-4 px-6 py-6">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="custom-scrollbar min-h-0 flex-1 rounded-2xl border border-white/10 bg-elevated px-4 py-4 text-sm leading-7 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
          />
          <button
            onClick={() => void onSave(draft)}
            disabled={saving || !draft.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-cyan-purple px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            保存 Prompt
          </button>
        </div>
      </div>
    </div>
  );
}

export function Refinery({
  materials,
  activeConversation,
  settings,
  submitting,
  onAddMaterial,
  onOpenMaterial,
  onSendMessage,
  onResetConversation,
  onPublishNote,
  onSavePrompt,
  onSaveReport,
}: RefineryProps) {
  const [input, setInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [promptOpen, setPromptOpen] = useState(false);
  const [reportDraft, setReportDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeMaterial = useMemo(
    () => materials.find((item) => item.id === activeConversation?.contextId) ?? materials[0] ?? null,
    [activeConversation?.contextId, materials],
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation]);

  useEffect(() => {
    setReportDraft(activeMaterial?.report ?? '');
  }, [activeMaterial?.id, activeMaterial?.report]);

  async function handleProcess() {
    if (!input.trim()) {
      return;
    }
    await onAddMaterial(input.trim());
    setInput('');
  }

  async function handleSendMessage() {
    if (!inputMessage.trim()) {
      return;
    }
    await onSendMessage(inputMessage.trim());
    setInputMessage('');
  }

  return (
    <>
      <div className="flex h-full flex-col animate-fade-in">
        <div className="border-b border-white/5 bg-panel p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-star-dust" />
              <input
                type="text"
                placeholder="粘贴 URL 或纯文本，回车直接开始精炼..."
                className="w-full rounded-lg border border-white/10 bg-elevated py-3 pl-12 pr-4 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && void handleProcess()}
              />
            </div>
            <button
              onClick={() => setPromptOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-star-dust transition-colors hover:border-cyan/20 hover:text-white"
            >
              <FileCog className="h-4 w-4" />
              <span className="text-sm">设置 Prompt</span>
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)_480px] overflow-hidden">
          <aside className="flex min-h-0 flex-col border-r border-white/5 bg-panel/80">
            <div className="border-b border-white/5 px-4 py-4">
              <div className="mb-1 flex items-center gap-2">
                <BookOpenText className="h-4 w-4 text-cyan" />
                <span className="text-sm font-medium text-white">稍后阅读</span>
              </div>
              <p className="text-xs text-star-dust">所有投料都会进入这里，未发布永久笔记前默认都在待消化状态。</p>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-auto p-3">
              {materials.map((material) => {
                const isActive = material.id === activeMaterial?.id;
                return (
                  <button
                    key={material.id}
                    onClick={() => void onOpenMaterial(material.id)}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-all',
                      isActive ? 'border-cyan/30 bg-cyan/10 shadow-glow-cyan' : 'border-white/5 bg-elevated/80 hover:border-cyan/20',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
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
                );
              })}
            </div>
          </aside>

          <section className="custom-scrollbar min-h-0 overflow-auto border-r border-white/5">
            <div className="p-6">
              {activeMaterial ? (
                <>
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan">Source</span>
                      <span className="text-xs text-star-dust">{activeMaterial.sourceUrl}</span>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-white">{activeMaterial.title}</h1>
                    <p className="text-sm leading-6 text-star-dust">{activeMaterial.summary}</p>
                  </div>

                  <div className="mb-6 rounded-2xl border border-purple/20 bg-purple/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple" />
                      <span className="text-sm font-medium text-white">30 秒速读报告</span>
                    </div>
                    <textarea
                      value={reportDraft}
                      onChange={(event) => setReportDraft(event.target.value)}
                      className="min-h-[220px] w-full rounded-xl border border-white/10 bg-panel/60 px-4 py-4 text-sm leading-7 text-white/90 focus:border-cyan focus:outline-none"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => void onSaveReport(reportDraft)}
                        disabled={submitting || !activeMaterial}
                        className="flex items-center gap-2 rounded-lg border border-cyan/20 bg-cyan/10 px-4 py-2 text-cyan transition-colors hover:bg-cyan/15 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        保存报告
                      </button>
                    </div>
                  </div>

                  <div className="whitespace-pre-line text-white/90">{activeMaterial.content}</div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-panel/50 p-8 text-center">
                  <Sparkles className="mx-auto mb-4 h-8 w-8 text-purple" />
                  <h2 className="mb-2 text-lg font-medium text-white">还没有待精炼材料</h2>
                  <p className="text-sm text-star-dust">贴一个 URL 或文本，系统会自动生成短报告、入队，并打开对话工坊。</p>
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-col bg-panel/50">
            <div className="border-b border-white/5 px-4 py-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan" />
                <span className="text-sm font-medium text-white">精炼对话</span>
              </div>
              <p className="text-xs text-star-dust">围绕短文本报告继续讨论；发布时会把报告和对话一起写进正式笔记。</p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => void onResetConversation()}
                  disabled={submitting || !activeConversation}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-star-dust transition-colors hover:border-rose/20 hover:text-white disabled:opacity-50"
                >
                  <Eraser className="h-4 w-4" />
                  清空对话
                </button>
              </div>
            </div>

            <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-auto p-4">
              {(activeConversation?.messages ?? []).map((message, index) => (
                <div key={`${message.timestamp}-${index}`} className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      message.role === 'assistant' ? 'bg-purple/20' : 'bg-cyan/20',
                    )}
                  >
                    {message.role === 'assistant' ? <Sparkles className="h-4 w-4 text-purple" /> : <Send className="h-4 w-4 text-cyan" />}
                  </div>
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl px-4 py-3 text-sm',
                      message.role === 'assistant' ? 'border border-purple/20 bg-elevated text-white/90' : 'bg-cyan/10 text-white',
                    )}
                  >
                    <div className="whitespace-pre-line leading-7">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-white/5 p-4">
              <div className="mb-3 flex gap-3">
                <button
                  onClick={() => void onPublishNote()}
                  disabled={submitting || !activeConversation}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-cyan-purple px-4 py-2.5 font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  生成永久笔记
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="继续围绕短报告讨论..."
                  className="flex-1 rounded-lg border border-white/10 bg-elevated px-4 py-2.5 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && void handleSendMessage()}
                />
                <button
                  onClick={() => void handleSendMessage()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-cyan-purple transition-all hover:brightness-110"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <PromptSheet
        open={promptOpen}
        value={settings?.defaultPrompt ?? ''}
        saving={submitting}
        onClose={() => setPromptOpen(false)}
        onSave={async (nextValue) => {
          await onSavePrompt(nextValue);
          setPromptOpen(false);
        }}
      />
    </>
  );
}
