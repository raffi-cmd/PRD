export type NodeCategory = 'planning' | 'technical' | 'product' | 'execution' | 'ai';

export type NodeType =
  // Planning
  | 'idea'
  | 'requirements'
  | 'prd'
  | 'user_stories'
  | 'scope'
  | 'assumptions'
  // Technical
  | 'architecture'
  | 'tech_stack'
  | 'data_model'
  | 'api'
  | 'folder_structure'
  // Product / Design
  | 'ui_ux'
  | 'user_flow'
  | 'components'
  | 'design_intent'
  // Execution
  | 'tasks'
  | 'dependencies'
  | 'test_plan'
  | 'acceptance_criteria'
  | 'validation'
  // AI / Custom
  | 'ai_context'
  | 'custom';

export type NodeStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'blocked'
  | 'complete'
  | 'outdated';

export interface NodeVersion {
  version: number;
  title: string;
  content: string;
  timestamp: string;
  summary?: string;
}

export interface TaskItem {
  id: string; // e.g. "TASK-001"
  title: string;
  description: string;
  goal?: string;
  dependencies: string[];
  affectedFiles?: string[];
  acceptanceCriteria: string[];
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  phase?: string; // e.g. "PHASE 1"
}

export interface PlannerNodeData extends Record<string, unknown> {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  status: NodeStatus;
  category: NodeCategory;
  version: number;
  versions: NodeVersion[];
  collapsed?: boolean;
  outdatedReason?: string;
  tasks?: TaskItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PlannerNode {
  id: string;
  type: string; // React Flow node type (e.g. "plannerNode", "taskNode")
  position: { x: number; y: number };
  data: PlannerNodeData;
  style?: React.CSSProperties;
  selected?: boolean;
}

export interface NodeTypeConfig {
  type: NodeType;
  category: NodeCategory;
  label: string;
  shortDescription: string;
  color: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  iconName: string;
  defaultTitle: string;
  defaultContent: string;
}
