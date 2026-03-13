import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertTriangle,
  Brain,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  FlaskConical,
  FolderTree,
  Gauge,
  Gem,
  Highlighter,
  LayoutDashboard,
  Link2,
  Map as MapIcon,
  MessageSquareText,
  Network,
  Play,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  TimerReset,
  X,
  Zap,
} from 'lucide-react';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  addMaterial,
  createVault,
  createEvaluation,
  getConversation,
  getWorkspaceSnapshot,
  listConversations,
  sendConversationMessage,
  startConversation,
  updateSettings,
} from '@/lib/api';
import { clamp, cn, formatRelativeTime } from '@/lib/utils';
import type {
  Conversation,
  ConversationMetadata,
  Evaluation,
  GraphNode,
  SettingsPayload,
  Material,
  Note,
  Task,
  ThemeName,
  VaultSummary,
} from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';

type ModuleId = 'dashboard' | 'refinery' | 'organizer' | 'evaluator' | 'blueprint' | 'planner';

type WorkspaceState = Awaited<ReturnType<typeof loadWorkspace>>;

const moduleItems: { id: ModuleId; label: string; short: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: '指挥舱', short: '舱', icon: LayoutDashboard },
  { id: 'refinery', label: '精炼厂', short: '炼', icon: FlaskConical },
  { id: 'organizer', label: '整理器', short: '整', icon: FolderTree },
  { id: 'evaluator', label: '评估局', short: '评', icon: Scale },
  { id: 'blueprint', label: '认知蓝图', short: '图', icon: MapIcon },
  { id: 'planner', label: '指挥室', short: '策', icon: Target },
];

async function loadWorkspace() {
  const [snapshot, conversationMetas] = await Promise.all([
    getWorkspaceSnapshot(),
    listConversations(),
  ]);
  const activeConversation = conversationMetas[0]
    ? await getConversation(conversationMetas[0].id)
    : null;

  return {
    ...snapshot,
    conversationMetas,
    activeConversation,
  };
}

function metricCards(tasks: WorkspaceState['overview']['stats']) {
  return [
    {
      label: '总笔记',
      value: tasks.totalNotes,
      icon: FileText,
      tone: 'text-cyan-200',
      accent: 'from-cyan-400/20 to-cyan-500/0',
    },
    {
      label: '待评估',
      value: tasks.pendingReview,
      icon: Clock3,
      tone: 'text-amber-200',
      accent: 'from-amber-300/20 to-amber-500/0',
    },
    {
      label: '高价值',
      value: tasks.highValue,
      icon: Gem,
      tone: 'text-fuchsia-200',
      accent: 'from-fuchsia-400/20 to-fuchsia-500/0',
    },
    {
      label: '认知缺口',
      value: tasks.cognitiveGaps,
      icon: AlertTriangle,
      tone: 'text-rose-200',
      accent: 'from-rose-400/20 to-rose-500/0',
    },
  ];
}

function deriveThoughtCapsuleTag(value: string) {
  if (value.length < 8) {
    return null;
  }
  const lowered = value.toLowerCase();
  if (lowered.includes('todo') || lowered.includes('修') || lowered.includes('做')) {
    return '📋 Todo';
  }
  if (lowered.includes('为什么') || lowered.includes('想法') || lowered.includes('产品')) {
    return '💡 Idea';
  }
  if (lowered.includes('文章') || lowered.includes('读') || lowered.includes('总结')) {
    return '📝 Note';
  }
  return '🧠 Insight';
}

function buildDomainStats(notes: Note[]) {
  const counts = new Map<string, number>();
  for (const note of notes) {
    counts.set(note.domain, (counts.get(note.domain) ?? 0) + 1);
  }
  return [{ domain: '全部', count: notes.length }, ...Array.from(counts.entries()).map(([domain, count]) => ({ domain, count }))];
}

function buildMergeSuggestions(notes: Note[]) {
  const counts = new Map<string, Note[]>();
  for (const note of notes) {
    for (const tag of note.tags) {
      const list = counts.get(tag) ?? [];
      list.push(note);
      counts.set(tag, list);
    }
  }
  return Array.from(counts.entries())
    .filter(([, list]) => list.length >= 2)
    .sort((left, right) => right[1].length - left[1].length)
    .slice(0, 3)
    .map(([tag, list]) => ({
      tag,
      notes: list,
    }));
}

function buildPlannerLadder(tasks: Task[]) {
  const focus = tasks.filter((task) => task.category === 'focus');
  return [
    { title: '定义模块边界', done: true, tone: 'done' },
    { title: '连接 OpenAPI 数据流', done: true, tone: 'done' },
    { title: focus[0]?.title ?? '主项目执行', done: false, tone: 'active' },
    { title: '打磨交互状态与移动端', done: false, tone: 'next' },
    { title: '回归构建和交付', done: false, tone: 'locked' },
  ];
}

function buildBlueprintLayout(nodes: GraphNode[]) {
  const radius = 190;
  return nodes.map((node, index) => {
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
    return {
      ...node,
      x: 50 + Math.cos(angle) * radius * 0.18 + (index % 2 === 0 ? 8 : -8),
      y: 50 + Math.sin(angle) * radius * 0.18 + (index % 3 === 0 ? 6 : -6),
    };
  });
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Sparkles;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-4 w-4 text-cyan-200" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}

function StatusBar({
  health,
  vaultName,
  vaultPath,
  refreshing,
  onRefresh,
  onOpenSettings,
}: {
  health: number;
  vaultName: string;
  vaultPath: string;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <header className="tc-panel-strong sticky top-0 z-30 mx-3 mt-3 flex flex-col gap-4 rounded-[24px] px-4 py-4 sm:mx-4 lg:mx-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Vault</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-200">
            <Database className="h-4 w-4 text-cyan-200" />
            <span className="truncate">{vaultName}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">{vaultPath}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">System health</p>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(60,230,180,0.9)]" />
            <span className="font-medium text-emerald-100">{health}% healthy</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
        >
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          刷新
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-300/10 px-4 py-2 text-sm text-fuchsia-100 transition hover:bg-fuchsia-300/20"
        >
          <Brain className="h-4 w-4" />
          Analyze
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
        >
          <Settings2 className="h-4 w-4" />
          设置
        </button>
      </div>
    </header>
  );
}

function SettingsDrawer({
  open,
  busy,
  settings,
  newVaultName,
  onClose,
  onThemeChange,
  onVaultChange,
  onNewVaultNameChange,
  onModelChange,
  onCreateVault,
  onSave,
}: {
  open: boolean;
  busy: boolean;
  settings: SettingsPayload | null;
  newVaultName: string;
  onClose: () => void;
  onThemeChange: (theme: ThemeName) => void;
  onVaultChange: (vault: VaultSummary) => void;
  onNewVaultNameChange: (value: string) => void;
  onModelChange: (module: keyof SettingsPayload['llm']['moduleModels'] | 'baseUrl' | 'apiKey' | 'defaultModel', value: string) => void;
  onCreateVault: () => void;
  onSave: () => void;
}) {
  if (!open || !settings) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(3,5,8,0.72)] backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-auto border-l border-white/10 bg-[#081019] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">Settings</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Vault 与 LLM 配置</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              在这里切换 active vault、新建空 vault，并指定 OpenAI 兼容接口的 base URL、API key、默认模型和模块级模型覆盖。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="tc-panel rounded-[24px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Theme</p>
            <select
              value={settings.activeTheme}
              onChange={(event) => onThemeChange(event.target.value as ThemeName)}
              className="mt-3 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            >
              {['NEON', 'ZEN', 'EPOCH', 'GLITCH', 'SKY', 'AURA', 'AUGURY', 'LIBRARY', 'ATELIER', 'PRISM', 'FORGE', 'VOID', 'HOME', 'WARROOM'].map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div className="tc-panel rounded-[24px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active vault</p>
            <select
              value={settings.vault.path}
              onChange={(event) => {
                const next = settings.availableVaults.find((vault) => vault.path === event.target.value);
                if (next) onVaultChange(next);
              }}
              className="mt-3 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            >
              {settings.availableVaults.map((vault) => (
                <option key={vault.path} value={vault.path}>
                  {vault.name}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {settings.vault.noteCount} notes · {settings.vault.gitInitialized ? 'git enabled' : 'git missing'} · {settings.vault.isObsidian ? 'obsidian' : 'plain markdown'}
            </p>
          </div>
        </div>

        <div className="mt-4 tc-panel rounded-[24px] p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={newVaultName}
              onChange={(event) => onNewVaultNameChange(event.target.value)}
              placeholder="新空 vault 名称，例如 product-lab"
              className="flex-1 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={onCreateVault}
              className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-emerald-300/18 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"
            >
              <Plus className="h-4 w-4" />
              新建空 vault
            </button>
          </div>
        </div>

        <div className="mt-4 tc-panel rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">OpenAI-compatible LLM</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-300">Base URL</span>
              <input
                value={settings.llm.baseUrl}
                onChange={(event) => onModelChange('baseUrl', event.target.value)}
                className="mt-2 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Default model</span>
              <input
                value={settings.llm.defaultModel}
                onChange={(event) => onModelChange('defaultModel', event.target.value)}
                className="mt-2 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm text-slate-300">API key</span>
            <input
              value={settings.llm.apiKey}
              onChange={(event) => onModelChange('apiKey', event.target.value)}
              className="mt-2 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        </div>

        <div className="mt-4 tc-panel rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Module model overrides</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {moduleItems.map((item) => (
              <label key={item.id} className="block">
                <span className="text-sm text-slate-300">{item.label}</span>
                <input
                  value={settings.llm.moduleModels[item.id]}
                  onChange={(event) => onModelChange(item.id, event.target.value)}
                  placeholder="留空则继承 default model"
                  className="mt-2 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={busy}
            className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-5 py-3 text-sm text-cyan-100 disabled:opacity-60"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  activeModule,
  onChange,
}: {
  activeModule: ModuleId;
  onChange: (next: ModuleId) => void;
}) {
  return (
    <>
      <aside className="tc-panel-strong fixed bottom-3 left-3 right-3 z-30 hidden rounded-[26px] px-3 py-3 lg:top-3 lg:flex lg:w-[92px] lg:flex-col lg:justify-between lg:rounded-[32px]">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(79,229,255,0.22),rgba(179,107,255,0.22))]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <nav className="space-y-2">
            {moduleItems.map(({ id, label, icon: Icon }) => {
              const active = id === activeModule;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(id)}
                  className={cn(
                    'group relative flex h-14 w-14 items-center justify-center rounded-[20px] transition',
                    active ? 'bg-cyan-300/12 text-cyan-100' : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="pointer-events-none absolute left-[72px] rounded-full border border-white/10 bg-slate-950/95 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">NEON</p>
        </div>
      </aside>

      <nav className="tc-panel-strong mx-3 mt-3 grid grid-cols-6 rounded-[24px] p-2 lg:hidden">
        {moduleItems.map(({ id, short }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'rounded-[18px] px-2 py-3 text-center text-sm transition',
              activeModule === id ? 'bg-cyan-300/12 text-cyan-100' : 'text-slate-400',
            )}
          >
            {short}
          </button>
        ))}
      </nav>
    </>
  );
}

function DashboardModule({
  overview,
}: {
  overview: WorkspaceState['overview'];
}) {
  return (
    <div className="space-y-6">
      <div className="tc-panel rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200">Command Center</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">认知系统运转正常</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              仪表板已经映射到真实后端聚合数据。你现在看到的指标、任务流和 Quick Wins 都来自同一套数据源。
            </p>
          </div>
          <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100">Health Score</p>
            <p className="mt-2 text-3xl font-semibold text-white">{overview.health}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards(overview.stats).map(({ label, value, icon: Icon, tone, accent }) => (
          <div
            key={label}
            className="tc-panel relative overflow-hidden rounded-[24px] p-5"
          >
            <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-b', accent)} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <Icon className={cn('h-5 w-5', tone)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1.85fr]">
        <div className="tc-panel rounded-[28px] p-6">
          <SectionTitle icon={Gauge} title="近期进展" subtitle="认知补全和任务完成流" />
          <div className="space-y-4">
            {overview.recentProgress.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(79,229,255,0.9)]" />
                <div className="flex-1 rounded-[18px] border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{item.title}</p>
                    <span className="text-xs text-slate-500">{formatRelativeTime(item.timestamp)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  {item.score ? <p className="mt-3 text-xs uppercase tracking-[0.24em] text-cyan-200">impact {item.score}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TaskStream title="待办审批" icon={Clock3} tasks={overview.reviewQueue} accent="amber" />
          <TaskStream title="重点项目" icon={Zap} tasks={overview.focusProjects} accent="cyan" />
          <TaskStream title="认知警报" icon={AlertTriangle} tasks={overview.cognitiveAlerts} accent="rose" />
        </div>
      </div>

      <div className="tc-panel rounded-[28px] p-6">
        <SectionTitle icon={Play} title="Quick Wins" subtitle="我有 30 分钟时，直接拿来做" />
        <div className="grid gap-4 md:grid-cols-3">
          {overview.quickWins.map((task) => (
            <div key={task.id} className="rounded-[20px] border border-cyan-300/15 bg-white/4 p-5">
              <p className="text-lg font-medium text-white">{task.title}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>{task.domain}</span>
                <span>·</span>
                <span>{task.timeEstimate}min</span>
                <span>·</span>
                <span>{task.priority}</span>
              </div>
              <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Play className="h-4 w-4" />
                开始
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskStream({
  title,
  icon: Icon,
  tasks,
  accent,
}: {
  title: string;
  icon: typeof Clock3;
  tasks: Task[];
  accent: 'amber' | 'cyan' | 'rose';
}) {
  const toneClass =
    accent === 'amber'
      ? 'text-amber-100 border-amber-300/20 bg-amber-300/10'
      : accent === 'rose'
        ? 'text-rose-100 border-rose-300/20 bg-rose-300/10'
        : 'text-cyan-100 border-cyan-300/20 bg-cyan-300/10';

  return (
    <div className="tc-panel rounded-[28px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', accent === 'amber' ? 'text-amber-200' : accent === 'rose' ? 'text-rose-200' : 'text-cyan-200')} />
          <h3 className="font-medium text-white">{title}</h3>
        </div>
        <span className={cn('rounded-full border px-2 py-1 text-xs uppercase tracking-[0.22em]', toneClass)}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-[18px] border border-white/8 bg-white/4 p-4">
            <p className="font-medium text-white">{task.title}</p>
            <p className="mt-2 text-sm text-slate-400">{task.domain}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{task.timeEstimate} min</span>
              <span>{task.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefineryModule({
  materials,
  selectedMaterialId,
  onSelectMaterial,
  materialInput,
  setMaterialInput,
  onAddMaterial,
  activeConversation,
  conversationMetas,
  onSelectConversation,
  messageInput,
  setMessageInput,
  onSendMessage,
}: {
  materials: Material[];
  selectedMaterialId: string | null;
  onSelectMaterial: (id: string) => void;
  materialInput: string;
  setMaterialInput: (value: string) => void;
  onAddMaterial: () => void;
  activeConversation: Conversation | null;
  conversationMetas: ConversationMetadata[];
  onSelectConversation: (id: string) => void;
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: () => void;
}) {
  const selectedMaterial = materials.find((item) => item.id === selectedMaterialId) ?? materials[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="tc-panel rounded-[28px] p-5">
        <SectionTitle icon={FlaskConical} title="The Hopper" subtitle="URL 输入、材料列表和正文阅读在同一工作台" />
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={materialInput}
              onChange={(event) => setMaterialInput(event.target.value)}
              placeholder="粘贴 URL，生成 30 秒速读报告"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/30"
            />
          </div>
          <button
            type="button"
            onClick={onAddMaterial}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
          >
            <Sparkles className="h-4 w-4" />
            开始精炼
          </button>
        </div>

        <div className="mb-5 flex gap-3 overflow-auto pb-1">
          {materials.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => onSelectMaterial(material.id)}
              className={cn(
                'min-w-[240px] rounded-[20px] border p-4 text-left transition',
                material.id === selectedMaterial?.id
                  ? 'border-cyan-300/24 bg-cyan-300/10'
                  : 'border-white/8 bg-white/4 hover:bg-white/6',
              )}
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{material.status}</p>
              <p className="mt-2 font-medium text-white">{material.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{material.summary}</p>
            </button>
          ))}
        </div>

        {selectedMaterial ? (
          <article className="rounded-[24px] border border-white/8 bg-[#060a11] p-6">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                {selectedMaterial.status}
              </span>
              <span className="text-sm text-slate-500">{selectedMaterial.sourceUrl}</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">{selectedMaterial.title}</h3>
            <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {selectedMaterial.content}
            </div>
          </article>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={MessageSquareText} title="AI Workshop" subtitle="Socratic chat + note extraction" />
          <div className="mb-4 flex gap-2 overflow-auto">
            {conversationMetas.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectConversation(item.id)}
                className={cn(
                  'rounded-full border px-3 py-2 text-xs transition',
                  activeConversation?.id === item.id
                    ? 'border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100'
                    : 'border-white/10 bg-white/5 text-slate-300',
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
            {activeConversation?.messages.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={cn(
                  'rounded-[20px] border p-4 text-sm leading-6',
                  message.role === 'user'
                    ? 'ml-8 border-cyan-300/18 bg-cyan-300/10 text-cyan-50'
                    : 'mr-8 border-white/8 bg-white/4 text-slate-200',
                )}
              >
                <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">{message.role}</p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <input
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="继续追问、比较、提炼..."
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-300/30"
            />
            <button
              type="button"
              onClick={onSendMessage}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-300/18 bg-fuchsia-300/10 text-fuchsia-100 transition hover:bg-fuchsia-300/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={Highlighter} title="结晶提取" subtitle="直接从摘要或对话里生成自己的观点" />
          <div className="space-y-3">
            {selectedMaterial ? (
              <>
                <div className="rounded-[18px] border border-emerald-300/15 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
                  “{selectedMaterial.summary}”
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/4 p-4 text-sm leading-6 text-slate-300">
                  提取建议：把这篇材料改写成一条“为什么这对我重要”的判断，再链接到相关永久笔记。
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizerModule({
  notes,
  searchValue,
  onSearchChange,
  capsuleValue,
  onCapsuleChange,
}: {
  notes: Note[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  capsuleValue: string;
  onCapsuleChange: (value: string) => void;
}) {
  const deferredSearch = useDeferredValue(searchValue);
  const [activeDomain, setActiveDomain] = useState('全部');

  const domainStats = useMemo(() => buildDomainStats(notes), [notes]);
  const mergeSuggestions = useMemo(() => buildMergeSuggestions(notes), [notes]);
  const filtered = useMemo(() => {
    return notes.filter((note) => {
      const hitDomain = activeDomain === '全部' || note.domain === activeDomain;
      const hitSearch =
        !deferredSearch ||
        `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase().includes(deferredSearch.toLowerCase());
      return hitDomain && hitSearch;
    });
  }, [activeDomain, deferredSearch, notes]);

  const tinderCards = useMemo(
    () => notes.filter((note) => note.type !== 'known').slice(0, 3),
    [notes],
  );

  const capsuleTag = deriveThoughtCapsuleTag(capsuleValue);

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <aside className="tc-panel rounded-[28px] p-5">
        <SectionTitle icon={FolderTree} title="Domains" subtitle="分类、搜索和整理建议" />
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="搜索笔记、标签、内容"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/30"
          />
        </label>
        <div className="mt-5 space-y-2">
          {domainStats.map((item) => (
            <button
              key={item.domain}
              type="button"
              onClick={() => setActiveDomain(item.domain)}
              className={cn(
                'flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-sm transition',
                activeDomain === item.domain ? 'bg-cyan-300/10 text-cyan-100' : 'bg-white/4 text-slate-300 hover:bg-white/6',
              )}
            >
              <span>{item.domain}</span>
              <span className="text-xs text-slate-500">{item.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[22px] border border-rose-300/15 bg-rose-300/10 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-rose-100">Idea Tinder</p>
          <div className="mt-4 space-y-3">
            {tinderCards.map((card) => (
              <div key={card.id} className="rounded-[18px] border border-white/8 bg-black/20 p-4">
                <p className="font-medium text-white">{card.title}</p>
                <p className="mt-2 text-sm text-slate-300">{card.domain}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={Sparkles} title="碎片拼接建议" subtitle="按标签与主题自动发现可合并内容" />
          <div className="grid gap-4 md:grid-cols-3">
            {mergeSuggestions.map((item) => (
              <div key={item.tag} className="rounded-[20px] border border-amber-300/15 bg-amber-300/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100">#{item.tag}</p>
                <p className="mt-3 text-lg font-medium text-white">{item.notes.length} 条碎片可合并</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {item.notes.slice(0, 2).map((note) => note.title).join(' / ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="tc-panel rounded-[28px] p-5">
            <SectionTitle icon={FileText} title="Knowledge Cabinet" subtitle={`当前显示 ${filtered.length} 条笔记`} />
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((note) => (
                <div key={note.id} className="rounded-[22px] border border-white/8 bg-white/4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{note.title}</p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.22em]',
                        note.type === 'gap'
                          ? 'bg-rose-300/12 text-rose-100'
                          : note.type === 'unknown'
                            ? 'bg-slate-300/12 text-slate-200'
                            : 'bg-cyan-300/12 text-cyan-100',
                      )}
                    >
                      {note.type}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{note.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tc-panel rounded-[28px] p-5">
            <SectionTitle icon={Zap} title="Thought Capsule" subtitle="快速捕获 + 即时标签判断" />
            <textarea
              value={capsuleValue}
              onChange={(event) => onCapsuleChange(event.target.value)}
              placeholder="记录闪念、TODO 或一段尚未成型的判断..."
              className="h-44 w-full rounded-[24px] border border-cyan-300/15 bg-black/20 p-4 text-sm leading-6 text-white outline-none transition focus:border-cyan-300/30"
            />
            <div className="mt-4 rounded-[18px] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI 初判</p>
              <p className="mt-3 text-lg font-medium text-white">{capsuleTag ?? '继续输入以获得判断'}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                建议补一句：这条记录未来会如何影响一个具体项目或决策？
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvaluatorModule({
  evaluations,
  ideaInput,
  onIdeaInput,
  onEvaluate,
}: {
  evaluations: Evaluation[];
  ideaInput: string;
  onIdeaInput: (value: string) => void;
  onEvaluate: () => void;
}) {
  const featured = evaluations[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="tc-panel rounded-[28px] p-5">
        <SectionTitle icon={Scale} title="价值四象限" subtitle="按影响力和可行性排列所有已评估创意" />
        <div className="relative h-[420px] overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {['难但有价值', '高优先级', '搁置', '快速胜利'].map((label) => (
              <div key={label} className="border border-white/5 p-4 text-xs uppercase tracking-[0.22em] text-slate-500">
                {label}
              </div>
            ))}
          </div>
          {evaluations.map((item) => (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs text-white shadow-[0_0_40px_rgba(79,229,255,0.15)]"
              style={{
                left: `${clamp(item.feasibility, 8, 95)}%`,
                top: `${100 - clamp(item.impact, 8, 95)}%`,
              }}
            >
              {item.idea}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={Sparkles} title="毒舌 VC" subtitle="提交一个点子，生成 SWOT 和残酷评论" />
          <textarea
            value={ideaInput}
            onChange={(event) => onIdeaInput(event.target.value)}
            placeholder="描述你的新 App、工作流或产品想法..."
            className="h-36 w-full rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white outline-none transition focus:border-amber-300/30"
          />
          <button
            type="button"
            onClick={onEvaluate}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/18 bg-amber-300/10 px-5 py-3 text-sm text-amber-100 transition hover:bg-amber-300/20"
          >
            <Scale className="h-4 w-4" />
            开始评估
          </button>
        </div>

        {featured ? (
          <div className="tc-panel rounded-[28px] p-5">
            <SectionTitle icon={Gauge} title="最新评估" subtitle={featured.idea} />
            <div className="grid gap-3 sm:grid-cols-2">
              <SwotCard title="优势" tone="emerald" items={featured.assessment.strengths} />
              <SwotCard title="劣势" tone="rose" items={featured.assessment.weaknesses} />
              <SwotCard title="机会" tone="cyan" items={featured.assessment.opportunities} />
              <SwotCard title="威胁" tone="amber" items={featured.assessment.threats} />
            </div>
            <div className="mt-4 rounded-[20px] border border-rose-300/16 bg-rose-300/10 p-4 text-sm leading-7 text-rose-50">
              {featured.assessment.roastComment}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SwotCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'emerald' | 'rose' | 'cyan' | 'amber';
  items: string[];
}) {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-300/15 bg-emerald-300/10 text-emerald-50'
      : tone === 'rose'
        ? 'border-rose-300/15 bg-rose-300/10 text-rose-50'
        : tone === 'amber'
          ? 'border-amber-300/15 bg-amber-300/10 text-amber-50'
          : 'border-cyan-300/15 bg-cyan-300/10 text-cyan-50';

  return (
    <div className={cn('rounded-[20px] border p-4', toneClass)}>
      <p className="text-xs uppercase tracking-[0.24em]">{title}</p>
      <div className="mt-3 space-y-2 text-sm leading-6">
        {items.map((item) => (
          <p key={item}>• {item}</p>
        ))}
      </div>
    </div>
  );
}

function BlueprintModule({
  nodes,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: GraphNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}) {
  const layout = useMemo(() => buildBlueprintLayout(nodes), [nodes]);
  const selected = layout.find((node) => node.id === selectedNodeId) ?? layout[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="tc-panel rounded-[28px] p-5">
        <SectionTitle icon={Network} title="战争迷雾" subtitle="亮色代表已掌握，灰色代表未知，红色代表认知缺口" />
        <div className="relative h-[540px] overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(10,18,32,0.9),rgba(4,7,12,0.98))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,229,255,0.08),transparent_35%)]" />
          {layout.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={cn(
                  'rounded-full border px-4 py-3 text-sm shadow-[0_0_48px_rgba(79,229,255,0.08)] transition',
                  selected?.id === node.id && 'scale-105',
                  node.type === 'gap'
                    ? 'border-rose-300/20 bg-rose-300/15 text-rose-50'
                    : node.type === 'unknown'
                      ? 'border-slate-400/20 bg-slate-400/10 text-slate-100'
                      : 'border-cyan-300/20 bg-cyan-300/12 text-cyan-50',
                )}
              >
                {node.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={MapIcon} title="节点详情" subtitle={selected?.domain} />
          {selected ? (
            <>
              <div className="rounded-[20px] border border-white/8 bg-white/4 p-4">
                <p className="text-lg font-medium text-white">{selected.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  当前节点类型为 <span className="text-cyan-100">{selected.type}</span>，可用于推动 Organizer 整理或 Planner 生成行动。
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={Highlighter} title="理论连线板" subtitle="手动钉住几个节点，写下你的推论" />
          <div className="space-y-3">
            {layout.slice(0, 3).map((node) => (
              <div key={node.id} className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/4 p-4">
                <div>
                  <p className="font-medium text-white">{node.label}</p>
                  <p className="text-sm text-slate-400">{node.domain}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlannerModule({
  tasks,
  setFocusTask,
}: {
  tasks: Task[];
  setFocusTask: (task: Task | null) => void;
}) {
  const quickWins = tasks.filter((task) => task.category === 'quick_win');
  const ladder = buildPlannerLadder(tasks);
  const heatmap = Array.from(
    tasks.reduce((accumulator, task) => {
      accumulator.set(task.domain, (accumulator.get(task.domain) ?? 0) + (task.status !== 'done' ? 1 : 0));
      return accumulator;
    }, new Map<string, number>()),
  ).sort((left, right) => right[1] - left[1]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={TimerReset} title="30 分钟胶囊" subtitle="上下文完整、阻力低、能立刻开始" />
          <div className="space-y-3">
            {quickWins.map((task) => (
              <div key={task.id} className="flex flex-col gap-4 rounded-[20px] border border-white/8 bg-white/4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {task.domain} · {task.timeEstimate} min · {task.priority}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFocusTask(task)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100"
                >
                  <Play className="h-4 w-4" />
                  专注执行
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="tc-panel rounded-[28px] p-5">
          <SectionTitle icon={Target} title="阶梯生成器" subtitle="大任务拆成可点亮的微步骤" />
          <div className="space-y-3">
            {ladder.map((step, index) => (
              <div key={step.title} className="flex items-center gap-4 rounded-[18px] border border-white/8 bg-white/4 p-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium',
                    step.tone === 'done'
                      ? 'bg-emerald-300/14 text-emerald-100'
                      : step.tone === 'active'
                        ? 'bg-cyan-300/14 text-cyan-100'
                        : step.tone === 'next'
                          ? 'bg-fuchsia-300/14 text-fuchsia-100'
                          : 'bg-slate-300/10 text-slate-400',
                  )}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="text-sm text-slate-400">
                    {step.done ? '已完成' : step.tone === 'locked' ? '等待前置步骤' : '准备执行'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tc-panel rounded-[28px] p-5">
        <SectionTitle icon={AlertTriangle} title="拖延热力图" subtitle="哪些领域的未完成任务累计最多" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {heatmap.map(([domain, count]) => (
            <div key={domain} className="rounded-[18px] border border-white/8 bg-white/4 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{domain}</p>
                <span className="text-sm text-slate-400">{count}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className={cn(
                    'h-full rounded-full',
                    count >= 3 ? 'bg-rose-300' : count === 2 ? 'bg-amber-300' : 'bg-cyan-300',
                  )}
                  style={{ width: `${Math.min(100, count * 28)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FocusOverlay({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(task.timeEstimate * 60);

  useEffect(() => {
    setSecondsLeft(task.timeEstimate * 60);
  }, [task]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(3,5,8,0.86)] p-6 backdrop-blur-xl">
      <div className="w-full max-w-xl rounded-[36px] border border-cyan-300/16 bg-slate-950/90 p-10 text-center shadow-[0_24px_120px_rgba(0,0,0,0.55)]">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-200">Focus Capsule</p>
        <div className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-4xl font-semibold text-white shadow-[0_0_80px_rgba(79,229,255,0.14)]">
          {minutes}:{seconds}
        </div>
        <h3 className="mt-8 text-3xl font-semibold text-white">{task.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          当前专注目标：{task.domain} · {task.timeEstimate} 分钟。先只做这一件事，不切上下文。
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full border border-rose-300/18 bg-rose-300/10 px-5 py-3 text-sm text-rose-100 transition hover:bg-rose-300/20"
        >
          结束专注
        </button>
      </div>
    </div>
  );
}

export default function NeonTheme() {
  const { refreshTheme } = useTheme();
  const workspaceState = useAsyncData(loadWorkspace);

  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [materialInput, setMaterialInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [ideaInput, setIdeaInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [capsuleValue, setCapsuleValue] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<SettingsPayload | null>(null);
  const [newVaultName, setNewVaultName] = useState('');

  useEffect(() => {
    const snapshot = workspaceState.data;
    if (!snapshot) {
      return;
    }
    setWorkspace(snapshot);
    setSettingsDraft(snapshot.settings);
    setSelectedMaterialId((current) => current ?? snapshot.materials[0]?.id ?? null);
    setSelectedNodeId((current) => current ?? snapshot.graph.nodes[0]?.id ?? null);
  }, [workspaceState.data]);

  const overview = workspace?.overview;

  async function refreshWorkspace() {
    await workspaceState.reload();
  }

  async function handleSaveSettings() {
    if (!settingsDraft) {
      return;
    }
    setBusy(true);
    try {
      await updateSettings({
        activeTheme: settingsDraft.activeTheme,
        activeVaultPath: settingsDraft.vault.path,
        llm: settingsDraft.llm,
      });
      await refreshTheme();
      await refreshWorkspace();
      setShowSettings(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateVault() {
    if (!newVaultName.trim()) {
      return;
    }
    setBusy(true);
    try {
      await createVault(newVaultName.trim());
      setNewVaultName('');
      await refreshWorkspace();
    } finally {
      setBusy(false);
    }
  }

  async function handleAddMaterial() {
    if (!materialInput.trim()) {
      return;
    }
    setBusy(true);
    try {
      const material = await addMaterial(materialInput.trim());
      const conversation = await startConversation('请给我这篇材料的 30 秒速读报告。', material.id);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              materials: [material, ...current.materials],
              conversationMetas: [
                { id: conversation.id, title: conversation.title, updatedAt: conversation.updatedAt },
                ...current.conversationMetas,
              ],
              activeConversation: conversation,
            }
          : current,
      );
      setSelectedMaterialId(material.id);
      setMaterialInput('');
      startTransition(() => setActiveModule('refinery'));
    } finally {
      setBusy(false);
    }
  }

  async function handleSelectConversation(id: string) {
    setBusy(true);
    try {
      const conversation = await getConversation(id);
      setWorkspace((current) => (current ? { ...current, activeConversation: conversation } : current));
    } finally {
      setBusy(false);
    }
  }

  async function handleSendMessage() {
    if (!messageInput.trim()) {
      return;
    }
    setBusy(true);
    try {
      let nextConversation: Conversation;
      if (workspace?.activeConversation) {
        nextConversation = await sendConversationMessage(workspace.activeConversation.id, messageInput.trim());
      } else {
        nextConversation = await startConversation(messageInput.trim(), selectedMaterialId ?? undefined);
      }
      setWorkspace((current) =>
        current
          ? {
              ...current,
              activeConversation: nextConversation,
              conversationMetas: [
                { id: nextConversation.id, title: nextConversation.title, updatedAt: nextConversation.updatedAt },
                ...current.conversationMetas.filter((item) => item.id !== nextConversation.id),
              ],
            }
          : current,
      );
      setMessageInput('');
    } finally {
      setBusy(false);
    }
  }

  async function handleEvaluate() {
    if (!ideaInput.trim()) {
      return;
    }
    setBusy(true);
    try {
      const evaluation = await createEvaluation(ideaInput.trim());
      setWorkspace((current) =>
        current
          ? {
              ...current,
              evaluations: [evaluation, ...current.evaluations],
            }
          : current,
      );
      setIdeaInput('');
      startTransition(() => setActiveModule('evaluator'));
    } finally {
      setBusy(false);
    }
  }

  if (workspaceState.loading || !workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05060a] px-6 text-white">
        <div className="tc-panel rounded-[28px] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">NEON Boot</p>
          <p className="mt-3 text-lg text-white">正在同步 ThoughtCabinet 工作区...</p>
        </div>
      </div>
    );
  }

  const content = {
    dashboard: <DashboardModule overview={workspace.overview} />,
    refinery: (
      <RefineryModule
        materials={workspace.materials}
        selectedMaterialId={selectedMaterialId}
        onSelectMaterial={setSelectedMaterialId}
        materialInput={materialInput}
        setMaterialInput={setMaterialInput}
        onAddMaterial={() => void handleAddMaterial()}
        activeConversation={workspace.activeConversation}
        conversationMetas={workspace.conversationMetas}
        onSelectConversation={(id) => void handleSelectConversation(id)}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSendMessage={() => void handleSendMessage()}
      />
    ),
    organizer: (
      <OrganizerModule
        notes={workspace.notes}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        capsuleValue={capsuleValue}
        onCapsuleChange={setCapsuleValue}
      />
    ),
    evaluator: (
      <EvaluatorModule
        evaluations={workspace.evaluations}
        ideaInput={ideaInput}
        onIdeaInput={setIdeaInput}
        onEvaluate={() => void handleEvaluate()}
      />
    ),
    blueprint: (
      <BlueprintModule
        nodes={workspace.graph.nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
      />
    ),
    planner: (
      <PlannerModule
        tasks={workspace.tasks}
        setFocusTask={setFocusTask}
      />
    ),
  }[activeModule];

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(79,229,255,0.12),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(179,107,255,0.12),transparent_20%)]" />
      <Sidebar
        activeModule={activeModule}
        onChange={(next) => {
          startTransition(() => setActiveModule(next));
        }}
      />
      <div className="relative lg:ml-[112px]">
        <StatusBar
          health={overview?.health ?? 96}
          vaultName={workspace.settings.vault.name}
          vaultPath={overview?.vaultPath ?? ''}
          refreshing={workspaceState.loading || busy}
          onRefresh={() => void refreshWorkspace()}
          onOpenSettings={() => setShowSettings(true)}
        />
        <main className="px-3 pb-24 pt-4 sm:px-4 lg:px-6 lg:pb-10">
          {workspaceState.error ? (
            <div className="mb-4 rounded-[20px] border border-rose-300/16 bg-rose-300/10 p-4 text-sm text-rose-50">
              数据刷新失败：{workspaceState.error}
            </div>
          ) : null}
          {content}
        </main>
      </div>
      <SettingsDrawer
        open={showSettings}
        busy={busy}
        settings={settingsDraft}
        newVaultName={newVaultName}
        onClose={() => setShowSettings(false)}
        onThemeChange={(theme) =>
          setSettingsDraft((current) => (current ? { ...current, activeTheme: theme } : current))
        }
        onVaultChange={(vault) =>
          setSettingsDraft((current) => (current ? { ...current, vault } : current))
        }
        onNewVaultNameChange={setNewVaultName}
        onModelChange={(field, value) =>
          setSettingsDraft((current) => {
            if (!current) {
              return current;
            }
            if (field === 'baseUrl' || field === 'apiKey' || field === 'defaultModel') {
              return {
                ...current,
                llm: {
                  ...current.llm,
                  [field]: value,
                },
              };
            }
            return {
              ...current,
              llm: {
                ...current.llm,
                moduleModels: {
                  ...current.llm.moduleModels,
                  [field]: value,
                },
              },
            };
          })
        }
        onCreateVault={() => void handleCreateVault()}
        onSave={() => void handleSaveSettings()}
      />
      {focusTask ? <FocusOverlay task={focusTask} onClose={() => setFocusTask(null)} /> : null}
    </div>
  );
}
