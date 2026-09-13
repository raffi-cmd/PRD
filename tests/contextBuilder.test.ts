import { describe, it, expect } from 'vitest';
import { getUpstreamContext, getDownstreamImpactedNodes } from '../src/services/ai/contextBuilder';
import { PlannerNode } from '../src/types/node';
import { PlannerEdge } from '../src/types/edge';

describe('Context Builder & Traversal', () => {
  const nodes: PlannerNode[] = [
    {
      id: 'n-idea',
      type: 'plannerNode',
      position: { x: 0, y: 0 },
      data: { id: 'n-idea', type: 'idea', title: 'My Idea', content: 'Building an AI planner.', status: 'approved', category: 'planning', version: 1, versions: [], createdAt: '', updatedAt: '' }
    },
    {
      id: 'n-reqs',
      type: 'plannerNode',
      position: { x: 0, y: 100 },
      data: { id: 'n-reqs', type: 'requirements', title: 'Requirements', content: 'Must support local storage.', status: 'approved', category: 'planning', version: 1, versions: [], createdAt: '', updatedAt: '' }
    },
    {
      id: 'n-prd',
      type: 'plannerNode',
      position: { x: 0, y: 200 },
      data: { id: 'n-prd', type: 'prd', title: 'PRD', content: 'PRD details.', status: 'approved', category: 'planning', version: 1, versions: [], createdAt: '', updatedAt: '' }
    },
    {
      id: 'n-arch',
      type: 'plannerNode',
      position: { x: 0, y: 300 },
      data: { id: 'n-arch', type: 'architecture', title: 'Architecture', content: 'Client-side SPA.', status: 'approved', category: 'technical', version: 1, versions: [], createdAt: '', updatedAt: '' }
    }
  ];

  const edges: PlannerEdge[] = [
    { id: 'e1', source: 'n-idea', target: 'n-reqs' },
    { id: 'e2', source: 'n-reqs', target: 'n-prd' },
    { id: 'e3', source: 'n-prd', target: 'n-arch' }
  ];

  it('traverses upstream ancestors and sorts by priority', () => {
    const upstream = getUpstreamContext('n-arch', nodes, edges);
    expect(upstream.length).toBe(3);
    // Should be sorted: idea -> requirements -> prd
    expect(upstream[0].nodeType).toBe('idea');
    expect(upstream[1].nodeType).toBe('requirements');
    expect(upstream[2].nodeType).toBe('prd');
  });

  it('identifies downstream impacted nodes', () => {
    const impacted = getDownstreamImpactedNodes('n-idea', nodes, edges);
    expect(impacted.length).toBe(3);
    const ids = impacted.map((n) => n.id);
    expect(ids).toContain('n-reqs');
    expect(ids).toContain('n-prd');
    expect(ids).toContain('n-arch');
  });
});
