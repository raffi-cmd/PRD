export type EdgeType =
  | 'dependency'
  | 'derived-from'
  | 'related-to'
  | 'implements'
  | 'blocks';

export interface PlannerEdgeData extends Record<string, unknown> {
  type: EdgeType;
  label?: string;
  notes?: string;
}

export interface PlannerEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: PlannerEdgeData;
  animated?: boolean;
  style?: React.CSSProperties;
  label?: string;
}
