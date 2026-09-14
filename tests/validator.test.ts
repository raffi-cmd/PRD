import { describe, it, expect } from 'vitest';
import { validateProjectGraph } from '../src/services/validation/validator';
import { PlannerNode } from '../src/types/node';
import { PlannerEdge } from '../src/types/edge';

describe('Project Graph Validator', () => {
  it('returns low health score and findings when empty or missing essential nodes', () => {
    const nodes: PlannerNode[] = [];
    const edges: PlannerEdge[] = [];

    const report = validateProjectGraph(nodes, edges);
    expect(report.score).toBeLessThan(30);
    expect(report.findings.some((f) => f.severity === 'ERROR')).toBe(true);
    expect(report.findings.some((f) => f.title.includes('Missing Project Vision'))).toBe(true);
  });

  it('calculates higher health score when essential nodes are present', () => {
    const nodes: PlannerNode[] = [
      {
        id: 'node-1',
        type: 'plannerNode',
        position: { x: 0, y: 0 },
        data: {
          id: 'node-1',
          type: 'idea',
          title: 'Idea',
          content: 'This is a sufficiently long project vision description.',
          status: 'approved',
          category: 'planning',
          version: 1,
          versions: [],
          createdAt: '',
          updatedAt: ''
        }
      },
      {
        id: 'node-2',
        type: 'plannerNode',
        position: { x: 0, y: 100 },
        data: {
          id: 'node-2',
          type: 'requirements',
          title: 'Requirements',
          content: 'Functional requirements and non-functional requirements detailed properly.',
          status: 'approved',
          category: 'planning',
          version: 1,
          versions: [],
          createdAt: '',
          updatedAt: ''
        }
      },
      {
        id: 'node-3',
        type: 'plannerNode',
        position: { x: 0, y: 200 },
        data: {
          id: 'node-3',
          type: 'prd',
          title: 'PRD',
          content: 'Product requirements document with goals, features, and acceptance criteria in depth.',
          status: 'approved',
          category: 'planning',
          version: 1,
          versions: [],
          createdAt: '',
          updatedAt: ''
        }
      },
      {
        id: 'node-4',
        type: 'plannerNode',
        position: { x: 0, y: 300 },
        data: {
          id: 'node-4',
          type: 'architecture',
          title: 'Architecture',
          content: 'System architecture covering backend, frontend, database, and APIs.',
          status: 'approved',
          category: 'technical',
          version: 1,
          versions: [],
          createdAt: '',
          updatedAt: ''
        }
      },
      {
        id: 'node-5',
        type: 'plannerNode',
        position: { x: 0, y: 400 },
        data: {
          id: 'node-5',
          type: 'tasks',
          title: 'Tasks',
          content: '### Phase 1: Setup\n- [ ] TASK-001: Implement base setup with criteria.',
          status: 'approved',
          category: 'execution',
          version: 1,
          versions: [],
          createdAt: '',
          updatedAt: ''
        }
      }
    ];

    const edges: PlannerEdge[] = [
      { id: 'e1', source: 'node-1', target: 'node-2' },
      { id: 'e2', source: 'node-2', target: 'node-3' },
      { id: 'e3', source: 'node-3', target: 'node-4' },
      { id: 'e4', source: 'node-4', target: 'node-5' }
    ];

    const report = validateProjectGraph(nodes, edges);
    expect(report.score).toBeGreaterThanOrEqual(40);
    expect(report.categories).toBeDefined();
    expect(report.categories.length).toBe(5);
    expect(report.categories.some((c) => c.category === 'product' && c.score > 0)).toBe(true);
  });

  it('detects circular dependency loops', () => {
    const nodes: PlannerNode[] = [
      {
        id: 'a',
        type: 'plannerNode',
        position: { x: 0, y: 0 },
        data: { id: 'a', type: 'prd', title: 'PRD', content: 'content', status: 'approved', category: 'planning', version: 1, versions: [], createdAt: '', updatedAt: '' }
      },
      {
        id: 'b',
        type: 'plannerNode',
        position: { x: 0, y: 0 },
        data: { id: 'b', type: 'architecture', title: 'Arch', content: 'content', status: 'approved', category: 'technical', version: 1, versions: [], createdAt: '', updatedAt: '' }
      }
    ];

    const edges: PlannerEdge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'a' }
    ];

    const report = validateProjectGraph(nodes, edges);
    expect(report.findings.some((f) => f.id === 'finding-cycle')).toBe(true);
  });
});
