import { useState } from 'react';
import { 
  Search, 
  Folder, 
  Tag, 
  Puzzle, 
  Mic, 
  Paperclip, 
  Zap,
  X,
  Check,
  Archive,
  ListTodo,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  domain: string;
  tags: string[];
  createdAt: string;
  wordCount: number;
}

interface Domain {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

const domains: Domain[] = [
  { id: 'all', name: '全部', icon: '📁', count: 247, color: 'cyan' },
  { id: 'tech', name: '技术', icon: '💻', count: 89, color: 'cyan' },
  { id: 'business', name: '商业', icon: '💼', count: 45, color: 'amber' },
  { id: 'creative', name: '创意', icon: '🎨', count: 32, color: 'purple' },
  { id: 'science', name: '科学', icon: '🔬', count: 56, color: 'emerald' },
  { id: 'philosophy', name: '哲学', icon: '🤔', count: 25, color: 'rose' },
];

const notes: Note[] = [
  {
    id: '1',
    title: '优化数据库查询性能',
    content: '通过添加索引和优化查询语句，将响应时间从 2s 降低到 100ms...',
    domain: '技术',
    tags: ['database', 'performance'],
    createdAt: '2天前',
    wordCount: 156,
  },
  {
    id: '2',
    title: 'Web3 支付的技术架构',
    content: '去中心化支付系统的核心组件包括...',
    domain: '技术',
    tags: ['web3', 'blockchain'],
    createdAt: '3天前',
    wordCount: 89,
  },
  {
    id: '3',
    title: '产品设计的心理学原理',
    content: '认知负荷理论在产品设计中的应用...',
    domain: '创意',
    tags: ['design', 'psychology'],
    createdAt: '1周前',
    wordCount: 234,
  },
];

const mergeSuggestions = [
  {
    id: '1',
    title: 'Web3 支付',
    count: 5,
    notes: ['笔记1摘要...', '笔记2摘要...', '笔记3摘要...'],
    lastUpdated: '3天前',
  },
];

const tinderCards = [
  { id: '1', title: '关于区块链在供应链中的应用...', domain: '未分类', wordCount: 45, date: '2个月前' },
  { id: '2', title: 'React 19 新特性速览', domain: '未分类', wordCount: 120, date: '1个月前' },
  { id: '3', title: '团队管理的一些想法', domain: '未分类', wordCount: 67, date: '3周前' },
];

export function Organizer() {
  const [activeDomain, setActiveDomain] = useState('all');
  const [showTinder, setShowTinder] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [capsuleExpanded, setCapsuleExpanded] = useState(false);
  const [capsuleInput, setCapsuleInput] = useState('');
  const [aiTag, setAiTag] = useState<string | null>(null);

  const handleTinderSwipe = () => {
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleCapsuleInput = (value: string) => {
    setCapsuleInput(value);
    // Simulate AI tagging
    if (value.length > 10) {
      const tags = ['💡 Idea', '📋 Todo', '📝 Note', '😤 吐槽'];
      setAiTag(tags[Math.floor(Math.random() * tags.length)]);
    } else {
      setAiTag(null);
    }
  };

  return (
    <div className="h-full flex animate-fade-in">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-panel/50 flex flex-col">
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-star-dust" />
            <input
              type="text"
              placeholder="搜索笔记..."
              className="w-full bg-elevated border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-star-dust focus:outline-none focus:border-cyan transition-colors"
            />
          </div>
        </div>

        {/* Domains */}
        <div className="flex-1 overflow-auto px-2 custom-scrollbar">
          <div className="space-y-1">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all",
                  activeDomain === domain.id
                    ? `bg-${domain.color}/10 text-${domain.color} border-l-2 border-${domain.color}`
                    : "text-star-dust hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <span>{domain.icon}</span>
                  <span>{domain.name}</span>
                </div>
                <span className={cn(
                  "text-xs",
                  activeDomain === domain.id ? `text-${domain.color}` : "text-star-dust"
                )}>
                  {domain.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-6 px-3">
            <div className="flex items-center gap-2 text-xs text-star-dust mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>常用标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['react', 'ai', 'product', 'design', 'backend'].map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-white/5 rounded-md text-xs text-star-dust hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setShowTinder(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-rose/10 border border-rose/20 rounded-lg text-rose text-sm hover:bg-rose/20 transition-colors"
          >
            <span className="text-lg">💳</span>
            <span>Idea Tinder (12 待清理)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Merge Suggestions */}
        {mergeSuggestions.length > 0 && (
          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-amber/10 to-rose/10 border border-amber/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Puzzle className="w-4 h-4 text-amber" />
              <span className="text-sm font-medium text-white">碎片拼接建议</span>
            </div>
            <p className="text-sm text-star-dust mb-3">
              发现 <span className="text-amber font-medium">5 条</span> 关于 "Web3 支付" 的笔记可以合并
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-amber/20 text-amber rounded-lg text-sm hover:bg-amber/30 transition-colors">
                查看建议
              </button>
              <button className="px-3 py-1.5 bg-white/5 text-star-dust rounded-lg text-sm hover:bg-white/10 transition-colors">
                忽略
              </button>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="bg-panel border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-elevated transition-all group cursor-pointer"
              >
                <h3 className="text-white font-medium mb-2 group-hover:text-cyan transition-colors">
                  {note.title}
                </h3>
                <p className="text-sm text-star-dust line-clamp-2 mb-4">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-star-dust">
                    <span className="flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      {note.domain}
                    </span>
                    <span>{note.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {note.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-xs text-star-dust">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Thought Capsule */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        capsuleExpanded ? "w-[600px]" : "w-[400px]"
      )}>
        <div className={cn(
          "bg-elevated border border-cyan/30 rounded-full flex items-center gap-3 transition-all",
          capsuleExpanded ? "p-4 rounded-2xl" : "px-5 py-3"
        )}>
          <Zap className="w-5 h-5 text-cyan" />
          <input
            type="text"
            placeholder="记录闪念..."
            className="flex-1 bg-transparent text-white placeholder:text-star-dust focus:outline-none"
            value={capsuleInput}
            onChange={(e) => handleCapsuleInput(e.target.value)}
            onFocus={() => setCapsuleExpanded(true)}
          />
          {aiTag && (
            <span className="px-2 py-1 bg-purple/20 text-purple rounded-full text-xs animate-fade-in">
              {aiTag}
            </span>
          )}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Mic className="w-4 h-4 text-star-dust" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Paperclip className="w-4 h-4 text-star-dust" />
            </button>
            <button className="p-2 bg-cyan/20 text-cyan rounded-full hover:bg-cyan/30 transition-colors">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Idea Tinder Modal */}
      {showTinder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Idea Tinder</h2>
                <p className="text-star-dust text-sm">快速清理未分类笔记</p>
              </div>
              <button 
                onClick={() => setShowTinder(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-star-dust" />
              </button>
            </div>

            {/* Card Stack */}
            <div className="relative h-[400px] flex items-center justify-center">
              {currentCardIndex < tinderCards.length ? (
                <div 
                  className="w-80 h-96 bg-panel border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-up"
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="h-full flex flex-col">
                    <p className="text-lg text-white leading-relaxed flex-1">
                      {tinderCards[currentCardIndex].title}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-star-dust">
                        <span>📁 {tinderCards[currentCardIndex].domain}</span>
                        <span>🕐 {tinderCards[currentCardIndex].date}</span>
                      </div>
                      <div className="text-xs text-star-dust">
                        字数: {tinderCards[currentCardIndex].wordCount}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">清理完成!</h3>
                  <p className="text-star-dust">所有笔记已分类</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {currentCardIndex < tinderCards.length && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  onClick={() => handleTinderSwipe()}
                  className="w-14 h-14 bg-rose/20 border border-rose/30 rounded-full flex items-center justify-center hover:bg-rose/30 transition-colors"
                >
                  <Archive className="w-6 h-6 text-rose" />
                </button>
                <button 
                  onClick={() => handleTinderSwipe()}
                  className="w-14 h-14 bg-amber/20 border border-amber/30 rounded-full flex items-center justify-center hover:bg-amber/30 transition-colors"
                >
                  <ListTodo className="w-6 h-6 text-amber" />
                </button>
                <button 
                  onClick={() => handleTinderSwipe()}
                  className="w-14 h-14 bg-emerald/20 border border-emerald/30 rounded-full flex items-center justify-center hover:bg-emerald/30 transition-colors"
                >
                  <Check className="w-6 h-6 text-emerald" />
                </button>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-star-dust">
              <span className="flex items-center gap-1.5">
                <span className="text-rose">👈</span> 归档
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber">👆</span> 待办
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald">👉</span> 保留
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
