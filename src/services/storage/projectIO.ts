import { ProjectSchema, DesignIntentData } from '../../types/project';
import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { AIProviderType, AIProviderConfig } from '../../types/ai';

export function getStoredApiKey(provider: AIProviderType): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(`vibe_${provider}_api_key`) || '';
  }
  return '';
}

export function setStoredApiKey(provider: AIProviderType, key: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`vibe_${provider}_api_key`, key.trim());
  }
}

export function getInitialAiConfig(): AIProviderConfig {
  if (typeof localStorage !== 'undefined') {
    const provider = (localStorage.getItem('vibe_ai_provider') as AIProviderType) || 'gemini';
    const apiKey = getStoredApiKey(provider);
    const model = localStorage.getItem(`vibe_${provider}_model`) || (provider === 'gemini' ? 'gemini-2.0-flash' : provider === 'openai' ? 'gpt-4o-mini' : provider === 'anthropic' ? 'claude-3-5-sonnet-latest' : 'deepseek/deepseek-chat');
    return {
      provider,
      apiKey,
      model,
      temperature: 0.4
    };
  }
  return {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.0-flash',
    temperature: 0.4
  };
}

export function createDefaultDesignIntent(): DesignIntentData {
  return {
    projectType: 'new_project',
    northStar: {
      statement: 'Technical, calm, information-dense, and precise — like a professional engineering workspace rather than a generic SaaS dashboard.',
      status: 'default',
      aiSuggestion: 'Compact utility tool with sharp hierarchy, restrained colors, and high data density.'
    },
    visualDirection: {
      direction: 'editorial utility',
      rationale: 'High information density with clear typography and structured sections for fast visual scanning.',
      status: 'default'
    },
    visualMetaphor: {
      metaphor: 'Developer terminal + technical documentation workbook',
      impact: 'Drives crisp grid lines, deliberate contrast, and functional typography over decorative cards.',
      status: 'default'
    },
    visualReferences: [
      {
        id: 'ref-default-1',
        title: 'Developer Terminal & Workbench',
        notes: 'Clean monospace tables, clear visual priority, zero decorative gradients',
        whatToBorrow: ['Data density', 'Monospace typography for IDs/code', 'High contrast border hierarchy'],
        whatNotToCopy: ['Exact proprietary layout', 'Branding elements', 'Monochrome dullness'],
        analysis: {
          layout: 'Split-pane master/detail composition',
          density: 'High (compact data rows)',
          typography: 'Geometric sans headings + tabular monospace data',
          radius: 'Restrained (4px - 6px)',
          borders: 'Subtle slate borders (1px)',
          color: 'Dark slate surfaces with purposeful teal accent',
          hierarchy: 'Primary result immediately prominent at top-left',
          interaction: 'Instant keyboard shortcuts and zero motion latency'
        }
      }
    ],
    layoutStrategy: {
      containerWidth: 'Max-width 1280px with narrow centered utility shells',
      gridAndColumns: 'Two-column split view on desktop (Input/Canvas + Result/Context)',
      focalPoint: 'Primary calculated result / central canvas',
      desktop: 'Two-column split view (Input/Canvas + Result/Context)',
      mobile: 'Linear stacked step-by-step navigation',
      relationships: 'Input directly updates output without disruptive modal context switches.',
      whitespacePhilosophy: 'Intentional around primary content, minimal between related utility controls.',
      status: 'default'
    },
    typography: {
      display: 'Clean geometric sans with strict weight hierarchy',
      body: 'Highly readable neutral sans (Inter / system sans)',
      numericData: 'Tabular monospace for statistics, timestamps, metrics, and identifiers',
      hierarchyScale: 'Display: 20-24px, Headings: 14-16px, Body: 13px, Caption/Meta: 11px',
      communicationStyle: 'dense and utilitarian',
      monospaceUsage: 'Use monospace selectively for data schemas, code snippets, and structural IDs.',
      details: 'Clean geometric sans for primary UI text with strict size hierarchy.',
      status: 'default'
    },
    color: {
      primaryRole: 'Deep slate background with crisp light gray typography',
      accentRole: 'Teal/Cyan highlight for active elements and key metrics',
      surfaceCharacter: 'Subtle dark borders with dark slate surfaces',
      contrastExpectations: 'High contrast (WCAG AAA compliant text) for optimal readability.',
      status: 'default'
    },
    components: {
      generalCharacter: 'restrained and functional',
      borderTreatment: 'Subtle 1px slate-800 borders to define regions',
      radius: 'Small to medium (rounded-lg 8px), never pill-soup',
      shadows: 'Minimal subtle elevation only for floating overlays/drawers',
      cards: 'Use sparingly; avoid card soup.',
      buttons: 'Primary action visually dominates secondary utility buttons.',
      inputs: 'Feel like utility controls with explicit state feedback.',
      icons: 'Functional only for scanning; no decorative icon spam.',
      status: 'default'
    },
    interaction: {
      philosophy: ['immediate feedback', 'direct manipulation', 'keyboard-friendly'],
      motionIntensity: 'Subtle & instantaneous (<150ms), zero decorative bounce',
      motionAndStates: 'Subtle instantaneous state transitions without excessive delays.',
      status: 'default'
    },
    density: {
      level: 'balanced',
      rules: 'Results and technical data dense; primary controls and onboarding spacious.',
      status: 'default'
    },
    responsiveIntent: {
      breakpointRules: 'Desktop side-by-side collapses into logical stacked workflow on mobile.',
      mobilePriority: 'Primary output and core input action remain visible without horizontal scroll.',
      status: 'default'
    },
    accessibility: {
      requirements: [
        'Visible focus outlines on keyboard navigation',
        'WCAG AA contrast ratios',
        'Semantic HTML layout elements',
        'Screen reader accessible labels',
        'Reduced motion query support'
      ],
      status: 'default'
    },
    antiPatterns: {
      forbidden: [
        'generic SaaS dashboard clichés',
        'excessive rounded cards / card soup',
        'gradient-heavy UI without semantic meaning',
        'glassmorphism or heavy blur effects',
        'decorative icons lacking purpose',
        'meaningless pill badges on every label',
        'fake AI sparkles and floating animations'
      ],
      overcorrectionWarning: 'Avoiding gradients or cards does not mean making the UI flat or monochrome.',
      status: 'default'
    },
    visualAcceptanceCriteria: {
      criteria: [
        'The primary output/result is immediately recognizable and visually dominant at a 2-second glance.',
        'The design does not resemble a generic AI-generated SaaS template.',
        'Keyboard navigation allows full operation without mouse interaction.',
        'Desktop and mobile viewports maintain visual hierarchy without stacked chaos.'
      ],
      status: 'default'
    },
    constraints: {
      technical: ['React 18 + TypeScript strict mode', 'Zero heavy runtime CSS libraries; pure Tailwind CSS'],
      component: ['Reuse existing primitive buttons/inputs', 'Keep dialogs accessible with Escape trap'],
      responsive: ['Desktop 1280px+, Tablet 768px, Mobile 390px support'],
      accessibility: ['Visible keyboard focus indicator', 'WCAG AAA text contrast on dark backgrounds'],
      thingsToAvoid: ['No arbitrary rainbow colors', 'No infinite spinner blocks without error fallback']
    },
    critiqueChecklist: [
      { id: 'crit-1', priority: 'P0', title: 'Functional & Layout Integrity', description: 'No layout breakage, no text overflow, interactive controls fully reachable', resolved: true },
      { id: 'crit-2', priority: 'P1', title: 'Visual Hierarchy & Focal Point', description: 'Primary output visually leads the screen; secondary controls do not compete', resolved: true },
      { id: 'crit-3', priority: 'P1', title: 'Intentional Spacing & Density', description: 'Whitespace is deliberate, not mechanical copy-paste', resolved: true },
      { id: 'crit-4', priority: 'P2', title: 'Micro-Polish & Alignment', description: 'Subtle borders, consistent padding, crisp typography hierarchy', resolved: true }
    ],
    provenance: {
      northStar: 'default',
      visualDirection: 'default',
      visualMetaphor: 'default',
      visualReferences: 'default',
      layoutStrategy: 'default',
      typography: 'default',
      color: 'default',
      components: 'default',
      interaction: 'default',
      density: 'default',
      responsiveIntent: 'default',
      accessibility: 'default',
      antiPatterns: 'default',
      visualAcceptanceCriteria: 'default'
    }
  };
}

export function createDefaultProject(title = 'My New Project', description = 'Visual AI project plan'): ProjectSchema {
  const now = new Date().toISOString();
  const projectId = 'proj-' + Math.random().toString(36).substring(2, 9);

  const initialNodes: PlannerNode[] = [
    {
      id: 'node-idea-init',
      type: 'plannerNode',
      position: { x: 400, y: 80 },
      data: {
        id: 'node-idea-init',
        type: 'idea',
        title: 'Project Idea',
        content: '## Goal\nDescribe your application idea, users, and core value proposition here.\n\nTip: Click **Generate Project Plan** in the top bar to synthesize a full architecture and task graph automatically!',
        status: 'draft',
        category: 'planning',
        version: 1,
        versions: [
          {
            version: 1,
            title: 'Project Idea',
            content: '## Goal\nDescribe your application idea, users, and core value proposition here.',
            timestamp: now
          }
        ],
        createdAt: now,
        updatedAt: now
      }
    }
  ];

  return {
    schemaVersion: 2,
    project: {
      id: projectId,
      name: title,
      description,
      version: 1,
      createdAt: now,
      updatedAt: now
    },
    nodes: initialNodes,
    edges: [],
    settings: {
      aiConfig: getInitialAiConfig(),
      autoSave: true,
      snapToGrid: true,
      theme: 'dark'
    },
    designIntent: createDefaultDesignIntent()
  };
}

export function exportProjectToJSON(project: ProjectSchema): string {
  return JSON.stringify({ ...project, schemaVersion: 2 }, null, 2);
}

export function parseProjectJSON(jsonString: string): ProjectSchema {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON format. Please select a valid project file.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Project file is not a valid object.');
  }

  const candidate = parsed as Partial<ProjectSchema>;

  if (!candidate.project || typeof candidate.project.name !== 'string') {
    throw new Error('Missing project metadata in project file.');
  }

  if (!Array.isArray(candidate.nodes)) {
    throw new Error('Project file is missing or contains invalid nodes array.');
  }

  const validatedNodes: PlannerNode[] = candidate.nodes.map((n, idx) => {
    const node = n as Partial<PlannerNode>;
    return {
      id: node.id || `node-${idx}-${Date.now()}`,
      type: node.type || 'plannerNode',
      position: node.position || { x: 100 + (idx % 4) * 250, y: 100 + Math.floor(idx / 4) * 200 },
      data: {
        id: node.data?.id || node.id || `node-${idx}`,
        type: node.data?.type || 'custom',
        title: node.data?.title || 'Untitled Node',
        content: node.data?.content || '',
        status: node.data?.status || 'draft',
        category: node.data?.category || 'planning',
        version: node.data?.version || 1,
        versions: node.data?.versions || [],
        createdAt: node.data?.createdAt || new Date().toISOString(),
        updatedAt: node.data?.updatedAt || new Date().toISOString(),
        tasks: node.data?.tasks
      }
    };
  });

  const validatedEdges: PlannerEdge[] = Array.isArray(candidate.edges)
    ? candidate.edges.map((e, idx) => {
        const edge = e as Partial<PlannerEdge>;
        return {
          id: edge.id || `edge-${idx}-${Date.now()}`,
          source: edge.source || '',
          target: edge.target || '',
          type: edge.type || 'customEdge',
          data: edge.data || { type: 'dependency' }
        };
      }).filter((e) => e.source && e.target)
    : [];

  return {
    schemaVersion: 2,
    project: {
      id: candidate.project.id || 'proj-' + Date.now(),
      name: candidate.project.name,
      description: candidate.project.description || '',
      version: candidate.project.version || 1,
      createdAt: candidate.project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    nodes: validatedNodes,
    edges: validatedEdges,
    settings: {
      aiConfig: candidate.settings?.aiConfig || getInitialAiConfig(),
      autoSave: candidate.settings?.autoSave ?? true,
      snapToGrid: candidate.settings?.snapToGrid ?? true,
      theme: candidate.settings?.theme || 'dark'
    },
    designIntent: candidate.designIntent ? {
      ...createDefaultDesignIntent(),
      ...candidate.designIntent
    } : createDefaultDesignIntent()
  };
}

