import { TaskItem } from './node';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskPhase {
  id: string;
  name: string; // e.g. "Phase 1: Project Setup"
  goal: string;
  status: TaskStatus;
  acceptanceCriteria: string[];
  tasks: TaskItem[];
}
