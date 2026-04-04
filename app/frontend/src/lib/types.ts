export type ThemeName =
  | 'NEON'
  | 'ZEN'
  | 'EPOCH'
  | 'GLITCH'
  | 'SKY'
  | 'AURA'
  | 'AUGURY'
  | 'LIBRARY'
  | 'ATELIER'
  | 'PRISM'
  | 'FORGE'
  | 'VOID'
  | 'HOME'
  | 'WARROOM';

export type NoteType = 'known' | 'unknown' | 'gap';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskCategory = 'review' | 'focus' | 'alert' | 'quick_win';
export type EvaluationStatus = 'idea' | 'evaluating' | 'active' | 'archived';
export type MaterialStatus = 'unread' | 'reading' | 'refined';
export type MessageRole = 'user' | 'assistant' | 'system';
export type PlannerNodeStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type PlannerFeedbackStatus = 'started' | 'progress' | 'blocked' | 'done' | 'adjusted';
export type PlannerEnergy = 'low' | 'medium' | 'high';

export interface ThemeConfig {
  activeTheme: ThemeName;
}

export interface ModuleModels {
  dashboard: string;
  refinery: string;
  organizer: string;
  evaluator: string;
  blueprint: string;
  planner: string;
}

export interface LLMSettings {
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
  moduleModels: ModuleModels;
  apiConfigPath?: string;
}

export interface VaultSummary {
  name: string;
  path: string;
  isObsidian: boolean;
  gitInitialized: boolean;
  noteCount: number;
  appDataPath: string;
}

export interface SettingsPayload {
  activeTheme: ThemeName;
  vault: VaultSummary;
  availableVaults: VaultSummary[];
  llm: LLMSettings;
}

export interface WorkspaceSnapshot {
  settings: SettingsPayload;
  overview: DashboardOverview;
  graph: BlueprintGraph;
  notes: Note[];
  tasks: Task[];
  evaluations: Evaluation[];
  materials: Material[];
  conversationMetas: ConversationMetadata[];
  activeConversation: Conversation | null;
}

export interface Note {
  id: string;
  title: string;
  domain: string;
  type: NoteType;
  tags: string[];
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  domain: string;
  timeEstimate: number;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  impactScore?: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentScores {
  innovation: number;
  market: number;
  feasibility: number;
  team: number;
}

export interface Assessment {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  roastComment: string;
  scores: AssessmentScores;
}

export interface Evaluation {
  id: string;
  idea: string;
  impact: number;
  feasibility: number;
  domain: string;
  status: EvaluationStatus;
  assessment: Assessment;
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  title: string;
  sourceUrl: string;
  content: string;
  summary: string;
  report: string;
  status: MaterialStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RefinerySettings {
  defaultPrompt: string;
}

export interface RefinerySession {
  material: Material;
  conversation: Conversation;
  settings: RefinerySettings;
}

export interface ConversationMetadata {
  id: string;
  title: string;
  updatedAt?: string;
}

export interface ConversationMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Conversation extends ConversationMetadata {
  contextId?: string;
  content: string;
  messages: ConversationMessage[];
}

export interface DashboardStats {
  totalNotes: number;
  pendingReview: number;
  highValue: number;
  cognitiveGaps: number;
}

export interface ProgressEvent {
  id: string;
  type: 'cognitive' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

export interface DashboardOverview {
  vaultPath: string;
  health: number;
  stats: DashboardStats;
  recentProgress: ProgressEvent[];
  reviewQueue: Task[];
  focusProjects: Task[];
  cognitiveAlerts: Task[];
  quickWins: Task[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: NoteType;
  domain: string;
  tags: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface BlueprintGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface PlannerNode {
  id: string;
  title: string;
  detail: string;
  status: PlannerNodeStatus;
  ddl?: string;
  parentId?: string;
  depth: number;
  timeEstimate: number;
  taskId?: string;
}

export interface PlannerBrief {
  evaluationId: string;
  nodeId: string;
  title: string;
  minimumOutcome: string;
  contextSummary: string;
  docLinks: string[];
  prerequisiteNotes: ConversationMetadata[];
  relatedTaskIds: string[];
}

export interface PlannerFeedback {
  id: string;
  evaluationId: string;
  nodeId: string;
  taskId?: string;
  status: PlannerFeedbackStatus;
  progressNote: string;
  blocker?: string;
  nextSuggestion: string;
  actualMinutes?: number;
  createdAt?: string;
}

export interface PlannerFeedbackCreate {
  nodeId: string;
  taskId?: string;
  status: PlannerFeedbackStatus;
  progressNote: string;
  blocker?: string;
  actualMinutes?: number;
}

export interface PlannerScheduleBlock {
  id: string;
  title: string;
  reason: string;
  startsAt: string;
  endsAt: string;
  energy: PlannerEnergy;
  nodeId: string;
}

export interface PlannerHeatmapCell {
  domain: string;
  rate: number;
  tasks: number;
}

export interface PlannerSchedule {
  evaluationId: string;
  blocks: PlannerScheduleBlock[];
  heatmap: PlannerHeatmapCell[];
  summary: string;
}

export interface PlannerBoard {
  evaluationId: string;
  goalTitle: string;
  goalDdl?: string;
  activeNodeId?: string;
  nodes: PlannerNode[];
  brief: PlannerBrief;
  schedule: PlannerSchedule;
  feedback: PlannerFeedback[];
}

export interface PlannerAssignment {
  evaluationId: string;
  selectedNode: PlannerNode;
  brief: PlannerBrief;
  rationale: string;
}
