import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, LoaderCircle, Plus, Save, X } from 'lucide-react';
import { Sidebar, type ModuleId } from '@/components/layout/Sidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { AssessmentCommittee } from '@/pages/AssessmentCommittee';
import { Dashboard } from '@/pages/Dashboard';
import { Hopper } from '@/pages/Hopper';
import { KnowledgeBlueprint } from '@/pages/KnowledgeBlueprint';
import { WarRoom } from '@/pages/WarRoom';
import { useTheme } from '@/context/ThemeContext';
import {
  assignPlannerTask,
  createPlannerFeedback,
  createEvaluation,
  createNote,
  createVault,
  getPlannerBoard,
  getRefinerySettings,
  getWorkspaceSnapshot,
  intakeRefineryMaterial,
  publishRefineryNote,
  resetRefineryConversation,
  chatPlannerGoal,
  sendMessage,
  startConversation,
  updateRefineryMaterial,
  updateRefinerySettings,
  updateSettings,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import type { LLMSettings, PlannerBoard, PlannerFeedbackCreate, RefinerySettings, SettingsPayload, WorkspaceSnapshot } from '@/lib/types';

function cloneLlmSettings(llm: LLMSettings): LLMSettings {
  return {
    baseUrl: llm.baseUrl,
    apiKey: llm.apiKey,
    defaultModel: llm.defaultModel,
    moduleModels: { ...llm.moduleModels },
    apiConfigPath: llm.apiConfigPath,
  };
}

function extractRefineryReport(markdown: string) {
  const match = markdown.match(/^\s*(> \[![A-Z]+\].*(?:\n>.*)*)/m);
  return match?.[1]?.trim() ?? '';
}

function SettingsSheet({
  open,
  settings,
  saving,
  onClose,
  onSave,
  onCreateVault,
}: {
  open: boolean;
  settings: SettingsPayload | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: { activeTheme: SettingsPayload['activeTheme']; activeVaultPath: string; llm: LLMSettings }) => Promise<void>;
  onCreateVault: (name: string) => Promise<void>;
}) {
  const [vaultName, setVaultName] = useState('');
  const [activeTheme, setActiveTheme] = useState<SettingsPayload['activeTheme']>('NEON');
  const [activeVaultPath, setActiveVaultPath] = useState('');
  const [llm, setLlm] = useState<LLMSettings | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && settings) {
      setActiveTheme(settings.activeTheme);
      setActiveVaultPath(settings.vault.path);
      setLlm(cloneLlmSettings(settings.llm));
    }
  }

  if (!open || !settings || !llm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-panel shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">系统设置</h2>
            <p className="text-sm text-star-dust">Vault、主题和 OpenAI 兼容模型配置</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/10">
            <X className="h-5 w-5 text-star-dust" />
          </button>
        </div>

        <div className="custom-scrollbar h-[calc(100%-84px)] space-y-8 overflow-auto px-6 py-6">
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-star-dust">Workspace</h3>
            </div>
            <label className="block space-y-2">
              <span className="text-sm text-white">主题</span>
              <select
                value={activeTheme}
                onChange={(event) => setActiveTheme(event.target.value as SettingsPayload['activeTheme'])}
                className="w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white focus:border-cyan focus:outline-none"
              >
                <option value="NEON">NEON</option>
                <option value="ZEN">ZEN</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-white">活动 Vault</span>
              <select
                value={activeVaultPath}
                onChange={(event) => setActiveVaultPath(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white focus:border-cyan focus:outline-none"
              >
                {settings.availableVaults.map((vault) => (
                  <option key={vault.path} value={vault.path}>
                    {vault.name} ({vault.noteCount} notes)
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-xl border border-white/5 bg-elevated p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">新建空 Vault</div>
                  <div className="text-xs text-star-dust">会自动初始化 Obsidian 目录和 Git 仓库</div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={vaultName}
                  onChange={(event) => setVaultName(event.target.value)}
                  placeholder="例如：research-lab"
                  className="flex-1 rounded-lg border border-white/10 bg-panel px-4 py-3 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                />
                <button
                  onClick={() => void onCreateVault(vaultName)}
                  disabled={saving || !vaultName.trim()}
                  className="flex items-center gap-2 rounded-lg bg-cyan/20 px-4 py-3 text-cyan transition-colors hover:bg-cyan/30 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  创建
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-star-dust">LLM</h3>
              <p className="mt-1 text-xs text-star-dust">
                Base URL / API Key 当前为只读，来源于 <span className="font-mono">C:\Users\admin\api.yaml</span>
              </p>
            </div>
            <label className="block space-y-2">
              <span className="text-sm text-white">Base URL</span>
              <input
                value={llm.baseUrl}
                readOnly
                className="w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-white">API Key</span>
              <input
                type="password"
                value={llm.apiKey}
                readOnly
                className="w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-white">默认模型</span>
              <input
                value={llm.defaultModel}
                onChange={(event) => setLlm({ ...llm, defaultModel: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-elevated px-4 py-3 text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(llm.moduleModels).map(([module, model]) => (
                <label key={module} className="block space-y-2 rounded-xl border border-white/5 bg-elevated p-4">
                  <span className="text-sm text-white">{module}</span>
                  <input
                    value={model}
                    onChange={(event) =>
                      setLlm({
                        ...llm,
                        moduleModels: {
                          ...llm.moduleModels,
                          [module]: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm text-white placeholder:text-star-dust focus:border-cyan focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </section>

          <button
            onClick={() => void onSave({ activeTheme, activeVaultPath, llm })}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-cyan-purple px-4 py-3 font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NeonTheme() {
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [plannerGoalId, setPlannerGoalId] = useState<string | null>(null);
  const [plannerBoard, setPlannerBoard] = useState<PlannerBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [refinerySettings, setRefinerySettings] = useState<RefinerySettings | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshTheme } = useTheme();

  const plannerGoalIdRef = useRef(plannerGoalId);
  plannerGoalIdRef.current = plannerGoalId;

  const loadWorkspace = useCallback(async () => {
    try {
      setError(null);
      const snapshot = await getWorkspaceSnapshot();
      const promptSettings = await getRefinerySettings();
      setWorkspace(snapshot);
      setRefinerySettings(promptSettings);
      const defaultGoalId = plannerGoalIdRef.current ?? snapshot.evaluations[0]?.id ?? null;
      if (defaultGoalId) {
        const board = await getPlannerBoard({ evaluationId: defaultGoalId });
        setPlannerBoard(board);
        setPlannerGoalId(board.evaluationId);
      } else {
        setPlannerBoard(null);
      }
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : 'Workspace unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  async function refreshWorkspace() {
    setRefreshing(true);
    await loadWorkspace();
  }

  async function analyzeWorkspace() {
    await refreshWorkspace();
  }

  async function handleAddMaterial(sourceUrl: string) {
    try {
      setSubmitting(true);
      const session = await intakeRefineryMaterial(sourceUrl);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              materials: [session.material, ...current.materials.filter((item) => item.id !== session.material.id)],
              conversationMetas: [
                { id: session.conversation.id, title: session.conversation.title, updatedAt: session.conversation.updatedAt },
                ...current.conversationMetas.filter((item) => item.id !== session.conversation.id),
              ],
              activeConversation: session.conversation,
            }
          : current,
      );
      setRefinerySettings(session.settings);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOpenRefineryMaterial(materialId: string) {
    setSubmitting(true);
    try {
      const conversation = await startConversation('请基于短文本报告继续精炼这份材料。', materialId);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              activeConversation: conversation,
              conversationMetas: [
                { id: conversation.id, title: conversation.title, updatedAt: conversation.updatedAt },
                ...current.conversationMetas.filter((item) => item.id !== conversation.id),
              ],
            }
          : current,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendConversationMessage(content: string) {
    if (!workspace) {
      return;
    }
    setSubmitting(true);
    try {
      const conversation = workspace.activeConversation
        ? await sendMessage(workspace.activeConversation.id, { role: 'user', content })
        : await startConversation(content, workspace.materials[0]?.id);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              activeConversation: conversation,
              conversationMetas: [
                { id: conversation.id, title: conversation.title, updatedAt: conversation.updatedAt },
                ...current.conversationMetas.filter((item) => item.id !== conversation.id),
              ],
            }
          : current,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateNote(payload: { title: string; content: string; domain: string; type: WorkspaceSnapshot['notes'][number]['type']; tags: string[] }) {
    const note = await createNote(payload);
    setWorkspace((current) => (current ? { ...current, notes: [note, ...current.notes] } : current));
  }

  async function handleCreateEvaluation(idea: string) {
    const evaluation = await createEvaluation(idea);
    setWorkspace((current) => (current ? { ...current, evaluations: [evaluation, ...current.evaluations] } : current));
    setPlannerGoalId(evaluation.id);
    const board = await getPlannerBoard({ evaluationId: evaluation.id });
    setPlannerBoard(board);
    return evaluation;
  }

  async function handlePublishRefineryNote() {
    if (!workspace?.activeConversation) {
      return;
    }
    setSubmitting(true);
    try {
      const note = await publishRefineryNote(workspace.activeConversation.id);
      setWorkspace((current) =>
        current
          ? {
              ...current,
              notes: [note, ...current.notes.filter((item) => item.id !== note.id)],
              materials: current.materials.map((item) =>
                item.id === current.activeConversation?.contextId ? { ...item, status: 'refined' } : item,
              ),
            }
          : current,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetRefineryConversation() {
    if (!workspace?.activeConversation) {
      return;
    }
    setSubmitting(true);
    try {
      const conversation = await resetRefineryConversation(workspace.activeConversation.id);
      setWorkspace((current) => (current ? { ...current, activeConversation: conversation } : current));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveRefineryMaterial(markdown: string) {
    if (!workspace?.activeConversation?.contextId) {
      return;
    }
    setSubmitting(true);
    try {
      const material = await updateRefineryMaterial(workspace.activeConversation.contextId, {
        content: markdown,
        report: extractRefineryReport(markdown),
      });
      setWorkspace((current) =>
        current
          ? {
              ...current,
              materials: current.materials.map((item) => (item.id === material.id ? material : item)),
            }
          : current,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveRefineryPrompt(defaultPrompt: string) {
    setSubmitting(true);
    try {
      const nextSettings = await updateRefinerySettings(defaultPrompt);
      setRefinerySettings(nextSettings);
    } finally {
      setSubmitting(false);
    }
  }

  async function loadPlannerBoard(evaluationId: string | null, activeNodeId?: string | null) {
    if (!evaluationId) {
      setPlannerBoard(null);
      return;
    }
    setPlannerLoading(true);
    try {
      const board = await getPlannerBoard({ evaluationId, activeNodeId });
      setPlannerBoard(board);
      setPlannerGoalId(board.evaluationId);
    } finally {
      setPlannerLoading(false);
    }
  }

  async function handleSelectPlannerGoal(evaluationId: string) {
    await loadPlannerBoard(evaluationId);
  }

  async function handleSelectPlannerNode(nodeId: string) {
    if (!plannerGoalId) {
      return;
    }
    await loadPlannerBoard(plannerGoalId, nodeId);
  }

  async function handlePlannerAssign(minutes: number) {
    setSubmitting(true);
    try {
      const assignment = await assignPlannerTask({ evaluationId: plannerGoalId, minutes });
      await loadPlannerBoard(assignment.evaluationId, assignment.selectedNode.id);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePlannerFeedback(payload: PlannerFeedbackCreate) {
    if (!plannerGoalId) {
      return;
    }
    setSubmitting(true);
    try {
      await createPlannerFeedback(plannerGoalId, payload);
      await loadPlannerBoard(plannerGoalId, payload.nodeId);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePlannerChat(message: string) {
    if (!plannerGoalId) {
      return;
    }
    setSubmitting(true);
    try {
      const board = await chatPlannerGoal(plannerGoalId, { message });
      setPlannerBoard(board);
      setPlannerGoalId(board.evaluationId);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveSettings(payload: { activeTheme: SettingsPayload['activeTheme']; activeVaultPath: string; llm: LLMSettings }) {
    try {
      setSaving(true);
      await updateSettings(payload);
      await refreshTheme();
      await loadWorkspace();
      setSettingsOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateVault(name: string) {
    try {
      setSaving(true);
      await createVault(name.trim());
      await loadWorkspace();
    } finally {
      setSaving(false);
    }
  }

  function renderModule() {
    if (!workspace) {
      return null;
    }
    switch (activeModule) {
      case 'dashboard':
        return (
          <div className="flex h-full flex-col bg-deep text-white">
            <main className="custom-scrollbar min-h-0 flex-1 overflow-auto">
              <Dashboard
                overview={workspace.overview}
                vaultName={workspace.settings.vault.name}
                onOpenPlanner={() => startTransition(() => setActiveModule('war-room'))}
              />
            </main>
          </div>
        );
      case 'hopper':
        return (
          <Hopper
            materials={workspace.materials}
            activeConversation={workspace.activeConversation}
            settings={refinerySettings}
            submitting={submitting}
            onAddMaterial={handleAddMaterial}
            onOpenMaterial={handleOpenRefineryMaterial}
            onSendMessage={handleSendConversationMessage}
            onResetConversation={handleResetRefineryConversation}
            onPublishNote={handlePublishRefineryNote}
            onSavePrompt={handleSaveRefineryPrompt}
            onSaveMaterialMarkdown={handleSaveRefineryMaterial}
            notes={workspace.notes}
          />
        );
      case 'committee':
        return (
          <AssessmentCommittee
            evaluations={workspace.evaluations}
            notes={workspace.notes}
            creating={submitting}
            onCreateEvaluation={handleCreateEvaluation}
            onSaveSerendipity={(content) => handleCreateNote({ title: content.slice(0, 24), content, domain: 'Evaluator', type: 'unknown', tags: ['serendipity'] })}
            onPromoteToPlanner={(evaluationId) => {
              void loadPlannerBoard(evaluationId);
              startTransition(() => setActiveModule('war-room'));
            }}
          />
        );
      case 'blueprint':
        return <KnowledgeBlueprint graph={workspace.graph} notes={workspace.notes} />;
      case 'war-room':
        return (
          <WarRoom
            board={plannerBoard}
            evaluations={workspace.evaluations}
            loading={plannerLoading}
            submitting={submitting}
            selectedGoalId={plannerGoalId}
            onSelectGoal={(evaluationId) => void handleSelectPlannerGoal(evaluationId)}
            onSelectNode={(nodeId) => void handleSelectPlannerNode(nodeId)}
            onAssign={(minutes) => void handlePlannerAssign(minutes)}
            onSendFeedback={(payload) => void handlePlannerFeedback(payload)}
            onSendChat={(message) => void handlePlannerChat(message)}
          />
        );
      default:
        return null;
    }
  }

  if (loading && !workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-panel px-5 py-4 text-white">
          <LoaderCircle className="h-5 w-5 animate-spin text-cyan" />
          <span>NEON Boot</span>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep px-6">
        <div className="max-w-md rounded-2xl border border-rose/20 bg-panel p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-rose" />
          <h1 className="mb-2 text-xl font-semibold text-white">工作区加载失败</h1>
          <p className="mb-4 text-sm text-star-dust">{error ?? 'Unknown error'}</p>
          <button onClick={() => void refreshWorkspace()} className="rounded-lg bg-cyan/20 px-4 py-2 text-cyan transition-colors hover:bg-cyan/30">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep text-white">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={(module) => startTransition(() => setActiveModule(module))}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <StatusBar
        vaultName={workspace.settings.vault.name}
        vaultPath={workspace.settings.vault.path}
        health={workspace.overview.health}
        refreshing={refreshing}
        onRefresh={() => void refreshWorkspace()}
        onAnalyze={analyzeWorkspace}
      />

      <main className={cn('fixed bottom-0 left-20 right-0 top-12 overflow-hidden transition-all duration-300')}>
        <div className="custom-scrollbar h-full overflow-auto">{renderModule()}</div>
      </main>

      <SettingsSheet
        open={settingsOpen}
        settings={workspace.settings}
        saving={saving}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        onCreateVault={handleCreateVault}
      />
    </div>
  );
}
