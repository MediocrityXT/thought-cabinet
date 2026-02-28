import { useState, useRef, useEffect } from 'react';
import { 
  Link2, 
  Upload, 
  Clock, 
  Send, 
  Sparkles, 
  FileText, 
  Plus,
  Check,
  Highlighter,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  highlights?: string[];
}

interface ExtractedNote {
  id: string;
  content: string;
  source: string;
}

const sampleArticle = `# 为什么 RAG 是未来？

随着大型语言模型（LLM）的上下文窗口不断增加，人们开始质疑检索增强生成（RAG）技术的必要性。然而，RAG 仍然是构建可靠 AI 应用的关键技术。

## 上下文窗口的幻觉

虽然 GPT-4 支持 128K 上下文，但研究表明，模型在处理长上下文时存在"中间遗忘"现象——对文档中间部分的信息召回率显著下降。

## RAG 的核心优势

1. **成本控制**: 检索相关片段比处理整篇文档便宜 10-100 倍
2. **实时性**: 可以接入最新的数据源，无需重新训练
3. **可解释性**: 知道答案来自哪些文档，便于验证
4. **隐私保护**: 敏感数据无需发送到第三方 API

## 未来的融合趋势

RAG 不会消失，而是会与长上下文模型融合，形成"智能检索 + 精准理解"的混合架构。`;

const sampleConversation: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '这篇文章核心提出了 3 个观点：\n\n1. **上下文窗口存在"中间遗忘"问题** — 即使支持 128K，模型对文档中间部分的召回率仍然较低\n\n2. **RAG 在成本、实时性、可解释性上有不可替代的优势**\n\n3. **未来是 RAG + 长上下文的融合架构**，而非二选一',
  },
  {
    id: '2',
    role: 'user',
    content: '用大白话解释一下"中间遗忘"是什么现象？',
  },
  {
    id: '3',
    role: 'assistant',
    content: '好比你读一本 300 页的书，读完之后：\n\n- 开头几章记得很清楚 ✅\n- 结尾几章也还记得 ✅\n- 但中间 150-200 页讲了什么？一片模糊 😵\n\nLLM 也有同样的问题——虽然能"看"到整篇文档，但对中间部分的理解和记忆会明显下降。',
  },
];

export function Refinery() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setShowArticle] = useState(true);
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [inputMessage, setInputMessage] = useState('');
  const [extractedNotes, setExtractedNotes] = useState<ExtractedNote[]>([
    { id: '1', content: 'RAG 解决了 LLM 的"中间遗忘"问题', source: '第 2 节' },
    { id: '2', content: '检索成本比长上下文低 10-100 倍', source: '第 3 节' },
  ]);
  const [selectedText, setSelectedText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProcess = () => {
    if (!url) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowArticle(true);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个很好的问题！让我进一步解释...\n\nRAG 和长上下文各有适用场景：\n\n- **RAG 更适合**: 知识库问答、实时信息检索、大规模文档处理\n- **长上下文更适合**: 深度分析单篇长文、保持对话连贯性、复杂推理任务',
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString();
    if (selection && selection.length > 10) {
      setSelectedText(selection);
    }
  };

  const handleExtract = () => {
    if (!selectedText) return;
    const newNote: ExtractedNote = {
      id: Date.now().toString(),
      content: selectedText,
      source: '用户选择',
    };
    setExtractedNotes([...extractedNotes, newNote]);
    setSelectedText('');
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Hopper */}
      <div className="bg-panel border-b border-white/5 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-star-dust" />
            <input
              type="text"
              placeholder="粘贴 URL 或输入文本..."
              className="w-full bg-elevated border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-star-dust focus:outline-none focus:border-cyan transition-colors"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-star-dust hover:text-white transition-colors">
            <Clock className="w-4 h-4" />
            <span className="text-sm">稍后阅读</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-star-dust hover:text-white transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">上传</span>
          </button>
          <button 
            onClick={handleProcess}
            disabled={isProcessing || !url}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-cyan-purple text-white rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>开始精炼</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Source */}
        <div className="w-[55%] border-r border-white/5 overflow-auto custom-scrollbar">
          <div className="p-6">
            {/* Article Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">为什么 RAG 是未来？</h1>
              <div className="flex items-center gap-4 text-sm text-star-dust">
                <span>来源: example.com/blog/rag-future</span>
                <span>•</span>
                <span>预计阅读: 8 分钟</span>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-invert max-w-none"
              onMouseUp={handleTextSelection}
            >
              <div className="text-white/90 leading-relaxed whitespace-pre-line">
                {sampleArticle}
              </div>
            </div>

            {/* Selection Toolbar */}
            {selectedText && (
              <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-elevated border border-cyan/30 rounded-lg shadow-glow-cyan animate-slide-up">
                <span className="text-sm text-star-dust truncate max-w-xs">{selectedText.slice(0, 30)}...</span>
                <button 
                  onClick={handleExtract}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan/10 text-cyan rounded text-sm hover:bg-cyan/20 transition-colors"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  提取
                </button>
                <button 
                  onClick={() => setSelectedText('')}
                  className="p-1 text-star-dust hover:text-white"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Workshop */}
        <div className="w-[45%] flex flex-col bg-panel/50">
          {/* AI Chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <Sparkles className="w-4 h-4 text-purple" />
              <span className="text-sm font-medium text-white">AI 助手</span>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'assistant' ? 'bg-purple/20' : 'bg-cyan/20'
                  )}>
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-4 h-4 text-purple" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-cyan" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    message.role === 'assistant' 
                      ? 'bg-elevated border border-purple/20 text-white/90' 
                      : 'bg-cyan/10 text-white'
                  )}>
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="提问或讨论..."
                  className="flex-1 bg-elevated border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-star-dust focus:outline-none focus:border-cyan transition-colors"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gradient-cyan-purple rounded-lg flex items-center justify-center hover:brightness-110 transition-all"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Crystallization Area */}
          <div className="h-[40%] border-t border-white/5 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan" />
                <span className="text-sm font-medium text-white">结晶提取</span>
              </div>
              <span className="text-xs text-star-dust">{extractedNotes.length} 条笔记</span>
            </div>
            
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              <div className="space-y-2">
                {extractedNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="bg-elevated border border-white/5 rounded-lg p-3 group hover:border-cyan/30 transition-colors"
                  >
                    <p className="text-sm text-white/90 mb-1">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-star-dust">来源: {note.source}</span>
                      <button className="opacity-0 group-hover:opacity-100 text-cyan text-xs hover:underline transition-opacity">
                        编辑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5 flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-cyan-purple text-white rounded-lg font-medium hover:brightness-110 transition-all">
                <Check className="w-4 h-4" />
                生成永久笔记
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-elevated border border-white/10 text-white rounded-lg hover:bg-surface transition-colors">
                <Plus className="w-4 h-4" />
                加入待办
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
