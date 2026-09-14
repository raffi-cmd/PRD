export type Severity = 'ERROR' | 'WARNING' | 'INFO';

export interface ValidationFinding {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  nodeId?: string;
  nodeTitle?: string;
  fixActionLabel?: string;
  suggestedFix?: string;
}

export type ReadinessCategory = 'product' | 'ux' | 'design' | 'technical' | 'verification';

export interface HealthCheckItem {
  id: string;
  label: string;
  category: ReadinessCategory;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface ReadinessCategoryBreakdown {
  category: ReadinessCategory;
  title: string;
  score: number; // 0 to 100
  passedChecks: number;
  totalChecks: number;
  checks: HealthCheckItem[];
}

export interface HealthReport {
  score: number; // 0 to 100 (Overall Planning Readiness)
  passedChecks: number;
  totalChecks: number;
  categories: ReadinessCategoryBreakdown[];
  findings: ValidationFinding[];
  checks: HealthCheckItem[];
  timestamp: string;
}

export type PlanningReadinessReport = HealthReport;

