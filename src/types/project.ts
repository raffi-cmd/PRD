import { PlannerNode } from './node';
import { PlannerEdge } from './edge';
import { AIProviderConfig } from './ai';

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSettings {
  aiConfig: AIProviderConfig;
  autoSave: boolean;
  snapToGrid: boolean;
  theme: 'dark' | 'light';
}

export interface ProjectSchema {
  schemaVersion: number; // currently 1
  project: ProjectMetadata;
  nodes: PlannerNode[];
  edges: PlannerEdge[];
  settings: ProjectSettings;
}
