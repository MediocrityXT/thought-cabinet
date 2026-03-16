import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clock, FileText, Highlighter, Link2, MessageSquare, Plus, Send, Sparkles, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation, ConversationMetadata, Material } from '@/lib/types';

interface ExtractedNote {
  id: string;
  content: string;
  source: string;
}

interface RefineryProps {
  materials: Material[];
  conversationMetas: ConversationMetadata[];
  activeConversation: Conversation | null;
  submitting: boolean;
  onAddMaterial: (sourceUrl: string) => Promise<void>;
  onSelectConversation: (id: string) => Promise<void>;
  onSendMessage: (content: string) => Promise<void>;
  onExtractNote: (content: string, source: string) => Promise<void>;
}

export function Refinery({
  materials,
  conversationMetas,
  activeConversation,
  submitting,
  onAddMaterial,
  onSelectConversation,
  onSendMessage,
  onExtractNote,
}: RefineryProps) {
  const [url, setUrl] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [localExtracts, setLocalExtracts] = useState<ExtractedNote[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeMaterial = materials[0] ?? null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation]);

  const extractedNotes = useMemo(() => {
    const summaryNotes = activeMaterial?.summary
      .split(/[。\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 4)
      .map((item, summaryIndex) => ({ id: `summary-${summaryIndex}`, content: item, source: activeMaterial.title })) ?? [];
    return [...localExtracts, ...summaryNotes];
  }, [activeMaterial, localExtracts]);

  async function handleProcess() {
    if (!url.trim()) {
      return;
    }
    await onAddMaterial(url.trim());
    setUrl('');
  }

  async function handleSendMessage() {
    if (!inputMessage.trim()) {
      return;
    }
    await onSendMessage(inputMessage.trim());
    setInputMessage('');
  }

  async function handleExtract() {
    if (!selectedText) {
      return;
    }
    const source = activeMaterial?.title ?? '用户选择';
    await onExtractNote(selectedText, source);
    setLocalExtracts((items) => [{ id: String(Date.now()), content: selectedText, source }, ...items]);
    setSelectedText('');
  }

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="border-b border-white/5 bg-panel p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-star-dust" />
            <input
              type="text"
              placeholder="粘贴 URL 或输入文本..."
              className="w-full rounded-lg border border-white/10 bg-elevated py-3 pl-12 pr-4 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && void handleProcess()}
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-star-dust transition-colors hover:bg-white/10 hover:text-white">
            <Clock className="h-4 w-4" />
            <span className="text-sm">稍后阅读</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-star-dust transition-colors hover:bg-white/10 hover:text-white">
            <Upload className="h-4 w-4" />
            <span className="text-sm">上传</span>
          </button>
          <button
            onClick={handleProcess}
            disabled={submitting || !url.trim()}
            className="flex items-center gap-2 rounded-lg bg-gradient-cyan-purple px-6 py-3 font-medium text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>开始精炼</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="custom-scrollbar w-[55%] overflow-auto border-r border-white/5" onMouseUp={() => {
          const selection = window.getSelection()?.toString().trim();
          if (selection && selection.length > 10) {
            setSelectedText(selection);
          }
        }}>
          <div className="p-6">
            {activeMaterial ? (
              <>
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold text-white">{activeMaterial.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-star-dust">
                    <span>来源: {activeMaterial.sourceUrl}</span>
                    <span>•</span>
                    <span>预计阅读: {Math.max(3, Math.round(activeMaterial.content.length / 220))} 分钟</span>
                  </div>
                </div>

                <div className="max-w-none whitespace-pre-line text-white/90">{activeMaterial.content}</div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-panel/50 p-8 text-center">
                <Sparkles className="mx-auto mb-4 h-8 w-8 text-purple" />
                <h2 className="mb-2 text-lg font-medium text-white">还没有待精炼材料</h2>
                <p className="text-sm text-star-dust">贴一个 URL，系统会把摘要、对话和提炼结果一起写入 vault。</p>
              </div>
            )}

            {selectedText ? (
              <div className="fixed bottom-32 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-cyan/30 bg-elevated px-4 py-2 shadow-glow-cyan animate-slide-up">
                <span className="max-w-xs truncate text-sm text-star-dust">{selectedText.slice(0, 30)}...</span>
                <button
                  onClick={() => void handleExtract()}
                  className="flex items-center gap-1 rounded px-3 py-1 text-sm text-cyan transition-colors hover:bg-cyan/20"
                >
                  <Highlighter className="h-3.5 w-3.5" />
                  提取
                </button>
                <button onClick={() => setSelectedText('')} className="p-1 text-star-dust hover:text-white">
                  ×
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-[45%] flex-col bg-panel/50">
          <div className="flex-1 overflow-hidden">
            <div className="border-b border-white/5 px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple" />
                <span className="text-sm font-medium text-white">AI 助手</span>
              </div>
              <div className="flex gap-2 overflow-auto pb-1">
                {conversationMetas.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => void onSelectConversation(conversation.id)}
                    className={cn(
                      'whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
                      activeConversation?.id === conversation.id
                        ? 'border-cyan/30 bg-cyan/10 text-cyan'
                        : 'border-white/10 bg-white/5 text-star-dust hover:text-white',
                    )}
                  >
                    {conversation.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-auto p-4">
              {(activeConversation?.messages ?? []).map((message, index) => (
                <div key={`${message.timestamp}-${index}`} className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                    message.role === 'assistant' ? 'bg-purple/20' : 'bg-cyan/20',
                  )}>
                    {message.role === 'assistant' ? <Sparkles className="h-4 w-4 text-purple" /> : <MessageSquare className="h-4 w-4 text-cyan" />}
                  </div>
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                    message.role === 'assistant' ? 'border border-purple/20 bg-elevated text-white/90' : 'bg-cyan/10 text-white',
                  )}>
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-white/5 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="提问或讨论..."
                  className="flex-1 rounded-lg border border-white/10 bg-elevated px-4 py-2.5 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && void handleSendMessage()}
                />
                <button onClick={() => void handleSendMessage()} className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-cyan-purple transition-all hover:brightness-110">
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[40%] flex-col border-t border-white/5">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan" />
                <span className="text-sm font-medium text-white">结晶提取</span>
              </div>
              <span className="text-xs text-star-dust">{extractedNotes.length} 条笔记</span>
            </div>

            <div className="custom-scrollbar flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {extractedNotes.map((note) => (
                  <div key={note.id} className="group rounded-lg border border-white/5 bg-elevated p-3 transition-colors hover:border-cyan/30">
                    <p className="mb-1 text-sm text-white/90">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-star-dust">来源: {note.source}</span>
                      <button className="text-xs text-cyan opacity-0 transition-opacity hover:underline group-hover:opacity-100">编辑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-white/5 p-4">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-cyan-purple px-4 py-2.5 font-medium text-white transition-all hover:brightness-110">
                <Check className="h-4 w-4" />
                生成永久笔记
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-elevated px-4 py-2.5 text-white transition-colors hover:bg-surface">
                <Plus className="h-4 w-4" />
                加入待办
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
