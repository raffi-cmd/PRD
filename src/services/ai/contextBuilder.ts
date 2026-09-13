import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { AIContextSnippet } from '../../types/ai';

export function getUpstreamContext(
  targetNodeId: string,
  nodes: PlannerNode[],
  edges: PlannerEdge[],
  maxDepth = 3
): AIContextSnippet[] {
  const nodeMap = new Map<string, PlannerNode>(nodes.map((n) => [n.id, n]));
  const snippets: AIContextSnippet[] = [];
  const visited = new Set<string>();

  function traverse(currentId: string, depth: number) {
    if (depth > maxDepth) return;

    // Incoming edges where this node is the target
    const incomingEdges = edges.filter((e) => e.target === currentId);

    for (const edge of incomingEdges) {
      const sourceId = edge.source;
      if (visited.has(sourceId) || sourceId === targetNodeId) continue;
      visited.add(sourceId);

      const sourceNode = nodeMap.get(sourceId);
      if (sourceNode) {
        snippets.push({
          nodeId: sourceNode.id,
          nodeType: sourceNode.data.type,
          title: sourceNode.data.title,
          content: sourceNode.data.content,
          relationship: depth === 1 ? 'parent' : 'dependency'
        });

        // Recurse upstream
        traverse(sourceId, depth + 1);
      }
    }
  }

  traverse(targetNodeId, 1);

  // Sort logically: idea -> requirements -> prd -> user_stories -> architecture -> tech_stack -> data_model -> api -> ui_ux
  const orderPriority: Record<string, number> = {
    idea: 1,
    requirements: 2,
    prd: 3,
    user_stories: 4,
    scope: 5,
    assumptions: 6,
    architecture: 7,
    tech_stack: 8,
    data_model: 9,
    api: 10,
    folder_structure: 11,
    ui_ux: 12,
    components: 13,
    user_flow: 14,
    tasks: 15,
    dependencies: 16,
    test_plan: 17,
    validation: 18,
    ai_context: 19
  };

  snippets.sort((a, b) => (orderPriority[a.nodeType] ?? 99) - (orderPriority[b.nodeType] ?? 99));

  return snippets;
}

export function getDownstreamImpactedNodes(
  sourceNodeId: string,
  nodes: PlannerNode[],
  edges: PlannerEdge[]
): PlannerNode[] {
  const nodeMap = new Map<string, PlannerNode>(nodes.map((n) => [n.id, n]));
  const impacted: PlannerNode[] = [];
  const visited = new Set<string>();

  function traverse(currentId: string) {
    const outgoingEdges = edges.filter((e) => e.source === currentId);
    for (const edge of outgoingEdges) {
      const targetId = edge.target;
      if (visited.has(targetId)) continue;
      visited.add(targetId);

      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        impacted.push(targetNode);
        traverse(targetId);
      }
    }
  }

  traverse(sourceNodeId);
  return impacted;
}
