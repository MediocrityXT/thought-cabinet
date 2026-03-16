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

export async function listMaterials(): Promise<Material[]> {
  const { data } = await api.get<Material[]>('/refinery/materials');
  return data;
}

export async function addMaterial(sourceUrl: string, title?: string): Promise<Material> {
  const { data } = await api.post<Material>('/refinery/materials', { sourceUrl, title });
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

export async function getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  const { data } = await api.get<WorkspaceSnapshot>('/workspace');
  return data;
}
