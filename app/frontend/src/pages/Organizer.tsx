import { useDeferredValue, useMemo, useState } from 'react';
import { Archive, Check, Folder, ListTodo, Mic, Paperclip, Puzzle, Search, Sparkles, Tag, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Note } from '@/lib/types';

interface OrganizerProps {
  notes: Note[];
  saving: boolean;
  onCreateNote: (payload: { title: string; content: string; domain: string; type: Note['type']; tags: string[] }) => Promise<void>;
}

const domainColors: Record<string, string> = {
  全部: 'cyan',
  技术: 'cyan',
  商业: 'amber',
  创意: 'purple',
  科学: 'emerald',
  哲学: 'rose',
};

const domainClassMap = {
  cyan: 'bg-cyan/10 text-cyan border-l-2 border-cyan',
  amber: 'bg-amber/10 text-amber border-l-2 border-amber',
  purple: 'bg-purple/10 text-purple border-l-2 border-purple',
  emerald: 'bg-emerald/10 text-emerald border-l-2 border-emerald',
  rose: 'bg-rose/10 text-rose border-l-2 border-rose',
};

const countClassMap = {
  cyan: 'text-cyan',
  amber: 'text-amber',
  purple: 'text-purple',
  emerald: 'text-emerald',
  rose: 'text-rose',
};

function inferTag(value: string) {
  if (value.length < 10) {
    return null;
  }
  const lowered = value.toLowerCase();
  if (lowered.includes('todo') || lowered.includes('待办') || lowered.includes('需要')) {
    return '📋 Todo';
  }
  if (lowered.includes('idea') || lowered.includes('想法') || lowered.includes('如果')) {
    return '💡 Idea';
  }
  if (lowered.includes('note') || lowered.includes('总结') || lowered.includes('阅读')) {
    return '📝 Note';
  }
  return '🧠 Insight';
}

export function Organizer({ notes, saving, onCreateNote }: OrganizerProps) {
  const [activeDomain, setActiveDomain] = useState('全部');
  const [search, setSearch] = useState('');
  const [showTinder, setShowTinder] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [capsuleExpanded, setCapsuleExpanded] = useState(false);
  const [capsuleInput, setCapsuleInput] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const deferredSearch = useDeferredValue(search);

  const domains = useMemo(() => {
    const counts = new Map<string, number>();
    for (const note of notes) {
      counts.set(note.domain, (counts.get(note.domain) ?? 0) + 1);
    }
    return [
      { id: 'all', name: '全部', icon: '📁', count: notes.length, color: 'cyan' },
      ...Array.from(counts.entries()).map(([domain, count]) => ({
        id: domain,
        name: domain,
        icon: domain === '技术' ? '💻' : domain === '商业' ? '💼' : domain === '创意' ? '🎨' : domain === '科学' ? '🔬' : '🤔',
        count,
        color: domainColors[domain] ?? 'cyan',
      })),
    ];
  }, [notes]);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((left, right) => right[1] - left[1]).slice(0, 5).map(([tag]) => tag);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (activeDomain !== '全部' && note.domain !== activeDomain) {
        return false;
      }
      if (deferredSearch) {
        const haystack = `${note.title}\n${note.content}\n${note.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(deferredSearch.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [activeDomain, deferredSearch, notes]);

  const mergeSuggestion = useMemo(() => {
    const tagGroups = new Map<string, Note[]>();
    for (const note of notes) {
      for (const tag of note.tags) {
        const group = tagGroups.get(tag) ?? [];
        group.push(note);
        tagGroups.set(tag, group);
      }
    }
    const match = Array.from(tagGroups.entries()).sort((left, right) => right[1].length - left[1].length).find(([, items]) => items.length >= 2);
    return match ? { tag: match[0], items: match[1] } : null;
  }, [notes]);

  const tinderCards = useMemo(() => notes.slice(0, 3).map((note) => ({
    id: note.id,
    title: note.title || note.content.slice(0, 48),
    domain: note.domain,
    wordCount: note.content.split(/\s+/).filter(Boolean).length,
    date: note.updatedAt ?? note.createdAt ?? '',
  })), [notes]);

  async function handleCapsuleSubmit() {
    if (!capsuleInput.trim()) {
      return;
    }
    const aiTag = inferTag(capsuleInput);
    const noteType = aiTag?.includes('Todo') ? 'gap' : aiTag?.includes('Idea') ? 'unknown' : 'known';
    const title = capsuleInput.slice(0, 24).trim();
    await onCreateNote({
      title,
      content: capsuleInput.trim(),
      domain: activeDomain === '全部' ? 'General' : activeDomain,
      type: noteType,
      tags: [],
    });
    setCapsuleInput('');
    setCapsuleExpanded(false);
  }

  return (
    <div className="flex h-full animate-fade-in">
      <aside className="flex w-64 flex-col border-r border-white/5 bg-panel/50">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-star-dust" />
            <input
              type="text"
              placeholder="搜索笔记..."
              className="w-full rounded-lg border border-white/10 bg-elevated py-2 pl-10 pr-4 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-auto px-2">
          <div className="space-y-1">
            {domains.map((domain) => {
              const color = domain.color as keyof typeof domainClassMap;
              const active = activeDomain === domain.name;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.name)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all',
                    active ? domainClassMap[color] : 'text-star-dust hover:bg-white/5 hover:text-white',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span>{domain.icon}</span>
                    <span>{domain.name}</span>
                  </div>
                  <span className={cn('text-xs', active ? countClassMap[color] : 'text-star-dust')}>{domain.count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 px-3">
            <div className="mb-3 flex items-center gap-2 text-xs text-star-dust">
              <Tag className="h-3.5 w-3.5" />
              <span>常用标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <span key={tag} className="cursor-pointer rounded-md bg-white/5 px-2 py-1 text-xs text-star-dust transition-colors hover:bg-white/10 hover:text-white">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/5 p-4">
          <button
            onClick={() => setShowTinder(true)}
            className="w-full rounded-lg border border-rose/20 bg-rose/10 px-3 py-2 text-sm text-rose transition-colors hover:bg-rose/20"
          >
            <span className="mr-2 text-lg">💳</span>
            Idea Tinder ({tinderCards.length} 待清理)
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        {mergeSuggestion ? (
          <div className="mx-6 mt-4 rounded-xl border border-amber/30 bg-gradient-to-r from-amber/10 to-rose/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Puzzle className="h-4 w-4 text-amber" />
              <span className="text-sm font-medium text-white">碎片拼接建议</span>
            </div>
            <p className="mb-3 text-sm text-star-dust">
              发现 <span className="font-medium text-amber">{mergeSuggestion.items.length} 条</span> 关于 &quot;{mergeSuggestion.tag}&quot; 的笔记可以合并
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-lg bg-amber/20 px-3 py-1.5 text-sm text-amber transition-colors hover:bg-amber/30">查看建议</button>
              <button className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-star-dust transition-colors hover:bg-white/10">忽略</button>
            </div>
          </div>
        ) : null}

        <div className="custom-scrollbar flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="group cursor-pointer rounded-xl border border-white/5 bg-panel p-5 text-left transition-all hover:border-white/10 hover:bg-elevated"
              >
                <h3 className="mb-2 font-medium text-white transition-colors group-hover:text-cyan">{note.title}</h3>
                <p className="mb-4 line-clamp-3 text-sm leading-6 text-star-dust">
                  {note.content.replace(/\n+/g, ' ')}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-star-dust">
                    <span className="flex items-center gap-1">
                      <Folder className="h-3.5 w-3.5" />
                      {note.domain}
                    </span>
                    <span>{note.updatedAt ?? note.createdAt ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-white/5 px-2 py-0.5 text-xs text-star-dust">#{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className={cn('fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-300', capsuleExpanded ? 'w-[600px]' : 'w-[400px]')}>
        <div className={cn('flex items-center gap-3 border border-cyan/30 bg-elevated transition-all', capsuleExpanded ? 'rounded-2xl p-4' : 'rounded-full px-5 py-3')}>
          <Zap className="h-5 w-5 text-cyan" />
          <input
            type="text"
            placeholder="记录闪念..."
            className="flex-1 bg-transparent text-white placeholder:text-star-dust focus:outline-none"
            value={capsuleInput}
            onChange={(event) => setCapsuleInput(event.target.value)}
            onFocus={() => setCapsuleExpanded(true)}
            onKeyDown={(event) => event.key === 'Enter' && void handleCapsuleSubmit()}
          />
          {inferTag(capsuleInput) ? <span className="rounded-full bg-purple/20 px-2 py-1 text-xs text-purple animate-fade-in">{inferTag(capsuleInput)}</span> : null}
          <div className="flex items-center gap-1">
            <button className="rounded-full p-2 transition-colors hover:bg-white/10">
              <Mic className="h-4 w-4 text-star-dust" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-white/10">
              <Paperclip className="h-4 w-4 text-star-dust" />
            </button>
            <button
              onClick={() => void handleCapsuleSubmit()}
              disabled={saving || !capsuleInput.trim()}
              className="rounded-full bg-cyan/20 p-2 text-cyan transition-colors hover:bg-cyan/30 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showTinder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex items-center justify-between px-4">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-white">Idea Tinder</h2>
                <p className="text-sm text-star-dust">快速清理未分类笔记</p>
              </div>
              <button onClick={() => setShowTinder(false)} className="rounded-lg p-2 transition-colors hover:bg-white/10">
                <X className="h-5 w-5 text-star-dust" />
              </button>
            </div>

            <div className="relative flex h-[400px] items-center justify-center">
              {currentCardIndex < tinderCards.length ? (
                <div className="h-96 w-80 rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl animate-slide-up">
                  <div className="flex h-full flex-col">
                    <p className="flex-1 text-lg leading-relaxed text-white">{tinderCards[currentCardIndex].title}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-star-dust">
                        <span>📁 {tinderCards[currentCardIndex].domain}</span>
                        <span>🕐 {tinderCards[currentCardIndex].date}</span>
                      </div>
                      <div className="text-xs text-star-dust">字数: {tinderCards[currentCardIndex].wordCount}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald/20">
                    <Check className="h-10 w-10 text-emerald" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-white">清理完成!</h3>
                  <p className="text-star-dust">所有笔记已分类</p>
                </div>
              )}
            </div>

            {currentCardIndex < tinderCards.length ? (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button onClick={() => setCurrentCardIndex((value) => value + 1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-rose/30 bg-rose/20 transition-colors hover:bg-rose/30">
                  <Archive className="h-6 w-6 text-rose" />
                </button>
                <button onClick={() => setCurrentCardIndex((value) => value + 1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-amber/30 bg-amber/20 transition-colors hover:bg-amber/30">
                  <ListTodo className="h-6 w-6 text-amber" />
                </button>
                <button onClick={() => setCurrentCardIndex((value) => value + 1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald/30 bg-emerald/20 transition-colors hover:bg-emerald/30">
                  <Check className="h-6 w-6 text-emerald" />
                </button>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-star-dust">
              <span className="flex items-center gap-1.5"><span className="text-rose">👈</span> 归档</span>
              <span className="flex items-center gap-1.5"><span className="text-amber">👆</span> 待办</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald">👉</span> 保留</span>
            </div>
          </div>
        </div>
      ) : null}

      {selectedNote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-panel shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between border-b border-white/5 px-6 py-5">
              <div>
                <h3 className="text-2xl font-semibold text-white">{selectedNote.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-star-dust">
                  <span className="flex items-center gap-1">
                    <Folder className="h-4 w-4" />
                    {selectedNote.domain}
                  </span>
                  <span>{selectedNote.updatedAt ?? selectedNote.createdAt ?? ''}</span>
                </div>
              </div>
              <button onClick={() => setSelectedNote(null)} className="rounded-lg p-2 transition-colors hover:bg-white/10">
                <X className="h-5 w-5 text-star-dust" />
              </button>
            </div>

            <div className="custom-scrollbar max-h-[70vh] overflow-auto px-6 py-6">
              {selectedNote.tags.length ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="whitespace-pre-wrap text-sm leading-7 text-white/90">{selectedNote.content}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
