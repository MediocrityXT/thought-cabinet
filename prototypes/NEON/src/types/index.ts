export interface Note {
  id: string;
  title: string;
  content: string;
  domain: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'pending';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'doing' | 'completed';
  priority: 'high' | 'medium' | 'low';
  domain: string;
  timeEstimate: number;
  dueDate?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  impact: number;
  feasibility: number;
  status: 'idea' | 'evaluating' | 'active' | 'completed' | 'archived';
  domain: string;
  tasks: Task[];
}

export interface CognitiveGap {
  id: string;
  domain: string;
  concept: string;
  relatedNotes: string[];
  severity: 'high' | 'medium' | 'low';
}

export interface ProgressEvent {
  id: string;
  type: 'cognitive' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  score?: number;
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export type ModuleType = 'dashboard' | 'refinery' | 'organizer' | 'evaluator' | 'blueprint' | 'planner';
