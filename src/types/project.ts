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

export type DecisionStatus = 'user_decided' | 'ai_suggested' | 'default' | 'undecided';
export type ProvenanceType = DecisionStatus;

export interface VisualReference {
  id: string;
  title: string;
  sourceUrl?: string;
  imageUrl?: string;
  notes?: string;
  whatToBorrow: string[];     // Principles to adopt (hierarchy, density, typography, etc.)
  whatNotToCopy: string[];    // Items NOT to copy (branding, logos, exact layout, proprietary assets)
  analysis?: {
    layout?: string;
    density?: string;
    typography?: string;
    radius?: string;
    borders?: string;
    color?: string;
    hierarchy?: string;
    interaction?: string;
  };
}

export interface DesignCritiqueItem {
  id: string;
  priority: 'P0' | 'P1' | 'P2'; // P0: Broken, P1: Visual Hierarchy, P2: Polish
  title: string;
  description: string;
  resolved: boolean;
}

export interface ImplementationConstraints {
  technical: string[];
  component: string[];
  responsive: string[];
  accessibility: string[];
  thingsToAvoid: string[];
}

export interface DesignIntentData {
  projectType: 'new_project' | 'existing_project';
  existingProjectAction?: 'preserve_identity' | 'refine_identity' | 'redesign' | 'visual_cleanup' | 'consistency_pass';
  
  // 3.1 Design North Star
  northStar: {
    statement: string;
    status: DecisionStatus;
    aiSuggestion?: string;
  };

  // 3.2 Visual Direction
  visualDirection: {
    direction: string;
    rationale: string;
    status?: DecisionStatus;
  };

  // 3.3 Visual Metaphor
  visualMetaphor: {
    metaphor: string;
    impact: string;
    status?: DecisionStatus;
  };

  // 3.4 Visual References
  visualReferences: VisualReference[];

  // 3.5 Layout Strategy
  layoutStrategy: {
    containerWidth?: string;
    gridAndColumns?: string;
    focalPoint?: string;
    desktop: string;
    mobile: string;
    relationships: string;
    whitespacePhilosophy?: string;
    status?: DecisionStatus;
  };

  // 3.6 Typography Direction
  typography: {
    display?: string;
    body?: string;
    numericData?: string;
    hierarchyScale?: string;
    communicationStyle: string;
    monospaceUsage?: string;
    details: string;
    status?: DecisionStatus;
  };

  // 3.7 Color Direction
  color: {
    primaryRole: string;
    accentRole: string;
    surfaceCharacter: string;
    contrastExpectations: string;
    status?: DecisionStatus;
  };

  // 3.8 Component Character
  components: {
    generalCharacter: string;
    borderTreatment?: string;
    radius?: string;
    shadows?: string;
    cards?: string;
    buttons?: string;
    inputs?: string;
    icons?: string;
    status?: DecisionStatus;
  };

  // 3.9 Interaction Character
  interaction: {
    philosophy: string[];
    motionIntensity?: string;
    motionAndStates: string;
    status?: DecisionStatus;
  };

  // 3.10 Density
  density: {
    level: 'compact' | 'balanced' | 'spacious';
    rules: string;
    status?: DecisionStatus;
  };

  // 3.11 Responsive Intent
  responsiveIntent: {
    breakpointRules: string;
    mobilePriority: string;
    status?: DecisionStatus;
  };

  // 3.12 Accessibility Intent
  accessibility: {
    requirements: string[];
    status?: DecisionStatus;
  };

  // 3.13 Anti-Patterns
  antiPatterns: {
    forbidden: string[];
    overcorrectionWarning?: string;
    status?: DecisionStatus;
  };

  // 3.14 Visual Acceptance Criteria
  visualAcceptanceCriteria: {
    criteria: string[];
    status?: DecisionStatus;
  };

  // Constraints & Critique
  constraints?: ImplementationConstraints;
  critiqueChecklist?: DesignCritiqueItem[];

  // Provenance / Decision Status map
  provenance: Record<string, DecisionStatus>;
}

export interface ProjectSchema {
  schemaVersion: number; // 2 for V2
  project: ProjectMetadata;
  nodes: PlannerNode[];
  edges: PlannerEdge[];
  settings: ProjectSettings;
  designIntent?: DesignIntentData;
}

