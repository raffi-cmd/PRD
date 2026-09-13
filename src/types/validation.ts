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

export interface HealthCheckItem {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface HealthReport {
  score: number; // 0 to 100
  passedChecks: number;
  totalChecks: number;
  findings: ValidationFinding[];
  checks: HealthCheckItem[];
  timestamp: string;
}
