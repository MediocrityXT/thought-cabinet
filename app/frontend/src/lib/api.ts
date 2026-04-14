import axios from 'axios';
import type {
  BlueprintGraph,
  Conversation,
  ConversationMessageCreate,
  ConversationMetadata,
  DashboardOverview,
  Evaluation,
  EvaluationCreate,
  HealthStatus,
  Material,
  MaterialCreate,
  MaterialUpdate,
  Note,
  NoteCreate,
  NoteUpdate,
  PlannerAssignRequest,
  PlannerChatRequest,
  PlannerAssignment,
  PlannerBoard,
  PlannerBrief,
  PlannerFeedback,
  PlannerFeedbackCreate,
  PlannerSchedule,
  RefineryIntakeRequest,
  RefinerySession,
  RefinerySettings,
  RefinerySettingsUpdate,
  SettingsPayload,
  SettingsUpdate,
  Task,
  TaskCreate,
  TaskUpdate,
  ThemeConfig,
  ThemeName,
  VaultSummary,
  WorkspaceSnapshot,
} from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
});

export async function getHealth(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health');
  return data;
}

export async function getTheme(): Promise<ThemeConfig> {
  const { data } = await api.get<ThemeConfig>('/config/theme');
  return data;
}

export async function updateTheme(theme: ThemeName): Promise<ThemeConfig> {
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

export async function updateSettings(payload: SettingsUpdate): Promise<SettingsPayload> {
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

export async function createNote(payload: NoteCreate): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function getNote(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function updateNote(id: string, payload: NoteUpdate): Promise<Note> {
  const { data } = await api.put<Note>(`/notes/${id}`, payload);
  return data;
}

export async function listTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
}

export async function updateTask(id: string, payload: TaskUpdate): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function listEvaluations(): Promise<Evaluation[]> {
  const { data } = await api.get<Evaluation[]>('/evaluations');
  return data;
}

export async function createEvaluation(ideaOrPayload: string | EvaluationCreate): Promise<Evaluation> {
  const payload: EvaluationCreate = typeof ideaOrPayload === 'string' ? { idea: ideaOrPayload } : ideaOrPayload;
  const { data } = await api.post<Evaluation>('/evaluations', payload);
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

export async function assignPlannerTask(payload: PlannerAssignRequest): Promise<PlannerAssignment> {
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

export async function chatPlannerGoal(evaluationId: string, payload: PlannerChatRequest): Promise<PlannerBoard> {
  const { data } = await api.post<PlannerBoard>(`/planner/goals/${evaluationId}/chat`, payload);
  return data;
}

export async function listMaterials(): Promise<Material[]> {
  const { data } = await api.get<Material[]>('/refinery/materials');
  return data;
}

export async function getMaterial(id: string): Promise<Material> {
  const { data } = await api.get<Material>(`/refinery/materials/${id}`);
  return data;
}

export async function getRefinerySettings(): Promise<RefinerySettings> {
  const { data } = await api.get<RefinerySettings>('/refinery/settings');
  return data;
}

export async function updateRefinerySettings(payload: string | RefinerySettingsUpdate): Promise<RefinerySettings> {
  const requestPayload: RefinerySettingsUpdate = typeof payload === 'string' ? { defaultPrompt: payload } : payload;
  const { data } = await api.put<RefinerySettings>('/refinery/settings', requestPayload);
  return data;
}

export async function intakeRefineryMaterial(inputOrPayload: string | RefineryIntakeRequest, title?: string): Promise<RefinerySession> {
  const payload: RefineryIntakeRequest = typeof inputOrPayload === 'string' ? { input: inputOrPayload, title } : inputOrPayload;
  const { data } = await api.post<RefinerySession>('/refinery/intake', payload);
  return data;
}

export async function addMaterial(inputOrPayload: string | MaterialCreate, title?: string): Promise<Material> {
  const payload: MaterialCreate = typeof inputOrPayload === 'string' ? { input: inputOrPayload, title } : inputOrPayload;
  const { data } = await api.post<Material>('/refinery/materials', payload);
  return data;
}

export async function updateRefineryMaterial(id: string, payload: MaterialUpdate): Promise<Material> {
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

export async function sendMessage(id: string, payload: ConversationMessageCreate): Promise<Conversation> {
  const { data } = await api.post<Conversation>(`/refinery/conversations/${id}/messages`, payload);
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
