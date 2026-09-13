import { ProjectSchema } from '../../types/project';
import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';

function getInitialApiKey(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('vibe_gemini_api_key') || '';
  }
  return '';
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
    schemaVersion: 1,
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
      aiConfig: {
        provider: 'gemini',
        apiKey: getInitialApiKey(),
        model: 'gemini-3.7-flash',
        temperature: 0.4
      },
      autoSave: true,
      snapToGrid: true,
      theme: 'dark'
    }
  };
}

export function exportProjectToJSON(project: ProjectSchema): string {
  return JSON.stringify(project, null, 2);
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
    schemaVersion: candidate.schemaVersion || 1,
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
      aiConfig: candidate.settings?.aiConfig || {
        provider: 'gemini',
        apiKey: getInitialApiKey(),
        model: 'gemini-3.7-flash',
        temperature: 0.4
      },
      autoSave: candidate.settings?.autoSave ?? true,
      snapToGrid: candidate.settings?.snapToGrid ?? true,
      theme: candidate.settings?.theme || 'dark'
    }
  };
}
