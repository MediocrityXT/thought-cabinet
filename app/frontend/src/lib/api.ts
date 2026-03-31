import axios from 'axios';
import type {
  BlueprintGraph,
  Conversation,
  ConversationMetadata,
  DashboardOverview,
  Evaluation,
  LLMSettings,
  Material,
  Note,
  PlannerAssignment,
  PlannerBoard,
  PlannerBrief,
  PlannerFeedback,
  PlannerFeedbackCreate,
  PlannerSchedule,
  RefinerySession,
  RefinerySettings,
  SettingsPayload,
  Task,
  ThemeConfig,
  ThemeName,
  VaultSummary,
  WorkspaceSnapshot,
} from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
});

export async function getThemeConfig(): Promise<ThemeConfig> {
  const { data } = await api.get<ThemeConfig>('/config/theme');
  return data;
}

export async function updateThemeConfig(theme: ThemeName): Promise<ThemeConfig> {
  const { data } = await api.put<ThemeConfig>('/config/theme', { activeTheme: theme });
  return data;
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await api.get<DashboardOverview>('/dashboard/overview');
  return data;
}

export async function getSettings(): Promise<SettingsPayload> {
  const { data } = await api.get<SettingsPayload>('/settings');
  return data;
}

export async function updateSettings(payload: {
  activeTheme?: ThemeName;
  activeVaultPath?: string;
  llm?: LLMSettings;
}): Promise<SettingsPayload> {
  const { data } = await api.put<SettingsPayload>('/settings', payload);
  return data;
}

export async function listVaults(): Promise<VaultSummary[]> {
  const { data } = await api.get<VaultSummary[]>('/vaults');
  return data;
}

export async function createVault(name: string): Promise<VaultSummary> {
  const { data } = await api.post<VaultSummary>('/vaults/create', { name });
  return data;
}

export async function selectVault(path: string): Promise<VaultSummary> {
  const { data } = await api.post<VaultSummary>('/vaults/select', { path });
  return data;
}

export async function getBlueprintGraph(): Promise<BlueprintGraph> {
  const { data } = await api.get<BlueprintGraph>('/blueprint/graph');
  return data;
}

export async function listNotes(): Promise<Note[]> {
  const { data } = await api.get<Note[]>('/notes');
  return data;
}

export async function createNote(payload: {
  title: string;
  content: string;
  domain: string;
  type: Note['type'];
  tags: string[];
}): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function listTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}

export async function listEvaluations(): Promise<Evaluation[]> {
  const { data } = await api.get<Evaluation[]>('/evaluations');
  return data;
}

export async function createEvaluation(idea: string): Promise<Evaluation> {
  const { data } = await api.post<Evaluation>('/evaluations', { idea });
  return data;
}

export async function getPlannerBoard(params?: { evaluationId?: string | null; activeNodeId?: string | null }): Promise<PlannerBoard> {
  const { data } = await api.get<PlannerBoard>('/planner/board', {
    params: {
      evaluationId: params?.evaluationId ?? undefined,
      activeNodeId: params?.activeNodeId ?? undefined,
    },
  });
  return data;
}

export async function assignPlannerTask(payload: { evaluationId?: string | null; minutes: number }): Promise<PlannerAssignment> {
  const { data } = await api.post<PlannerAssignment>('/planner/assign', payload);
  return data;
}

export async function getPlannerBrief(evaluationId: string, nodeId?: string | null): Promise<PlannerBrief> {
  const { data } = await api.get<PlannerBrief>(`/planner/goals/${evaluationId}/brief`, {
    params: { nodeId: nodeId ?? undefined },
  });
  return data;
}

export async function listPlannerFeedback(evaluationId: string): Promise<PlannerFeedback[]> {
  const { data } = await api.get<PlannerFeedback[]>(`/planner/goals/${evaluationId}/feedback`);
  return data;
}

export async function createPlannerFeedback(evaluationId: string, payload: PlannerFeedbackCreate): Promise<PlannerFeedback> {
  const { data } = await api.post<PlannerFeedback>(`/planner/goals/${evaluationId}/feedback`, payload);
  return data;
}

export async function getPlannerSchedule(evaluationId: string): Promise<PlannerSchedule> {
  const { data } = await api.get<PlannerSchedule>(`/planner/goals/${evaluationId}/schedule`);
  return data;
}

export async function sendPlannerChat(evaluationId: string, message: string): Promise<PlannerBoard> {
  const { data } = await api.post<PlannerBoard>(`/planner/goals/${evaluationId}/chat`, { message });
  return data;
}

export async function listMaterials(): Promise<Material[]> {
  const { data } = await api.get<Material[]>('/refinery/materials');
  return data;
}

export async function getRefinerySettings(): Promise<RefinerySettings> {
  const { data } = await api.get<RefinerySettings>('/refinery/settings');
  return data;
}

export async function updateRefinerySettings(defaultPrompt: string): Promise<RefinerySettings> {
  const { data } = await api.put<RefinerySettings>('/refinery/settings', { defaultPrompt });
  return data;
}

export async function intakeRefineryMaterial(input: string, title?: string): Promise<RefinerySession> {
  const { data } = await api.post<RefinerySession>('/refinery/intake', { input, title });
  return data;
}

export async function addMaterial(input: string, title?: string): Promise<Material> {
  const { data } = await api.post<Material>('/refinery/materials', { input, title });
  return data;
}

export async function updateRefineryMaterial(
  id: string,
  payload: { title?: string; report?: string; summary?: string; status?: Material['status'] },
): Promise<Material> {
  const { data } = await api.put<Material>(`/refinery/materials/${id}`, payload);
  return data;
}

export async function listConversations(): Promise<ConversationMetadata[]> {
  const { data } = await api.get<ConversationMetadata[]>('/refinery/conversations');
  return data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const { data } = await api.get<Conversation>(`/refinery/conversations/${id}`);
  return data;
}

export async function startConversation(initialMessage: string, contextId?: string): Promise<Conversation> {
  const { data } = await api.post<Conversation>('/refinery/conversations', { initialMessage, contextId });
  return data;
}

export async function sendConversationMessage(id: string, content: string): Promise<Conversation> {
  const { data } = await api.post<Conversation>(`/refinery/conversations/${id}/messages`, {
    role: 'user',
    content,
  });
  return data;
}

export async function resetRefineryConversation(id: string): Promise<Conversation> {
  const { data } = await api.post<Conversation>(`/refinery/conversations/${id}/reset`);
  return data;
}

export async function publishRefineryNote(id: string): Promise<Note> {
  const { data } = await api.post<Note>(`/refinery/conversations/${id}/publish-note`);
  return data;
}

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  const { data } = await api.get<WorkspaceSnapshot>('/workspace');
  return data;
}
