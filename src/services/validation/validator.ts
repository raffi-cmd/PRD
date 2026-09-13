import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { HealthReport, ValidationFinding, HealthCheckItem } from '../../types/validation';

export function validateProjectGraph(nodes: PlannerNode[], edges: PlannerEdge[]): HealthReport {
  const findings: ValidationFinding[] = [];
  const checks: HealthCheckItem[] = [];

  const nodeTypeMap = new Map<string, PlannerNode[]>();
  for (const node of nodes) {
    const type = node.data.type;
    const list = nodeTypeMap.get(type) || [];
    list.push(node);
    nodeTypeMap.set(type, list);
  }

  // Check 1: Idea (15)
  const ideaNodes = nodeTypeMap.get('idea') || [];
  const hasIdea = ideaNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-idea',
    label: 'Project Idea defined',
    passed: hasIdea,
    detail: hasIdea ? 'Core vision is documented.' : 'Add an Idea node with a clear goal and problem description.',
    weight: 15
  });
  if (!hasIdea) {
    findings.push({
      id: 'finding-idea',
      severity: 'ERROR',
      title: 'Missing Project Idea',
      message: 'The project lacks a defined core idea. All planning should stem from an initial concept.',
      fixActionLabel: 'Create Idea Node'
    });
  }

  // Check 2: Requirements (10)
  const reqNodes = nodeTypeMap.get('requirements') || [];
  const hasReqs = reqNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-reqs',
    label: 'Requirements specified',
    passed: hasReqs,
    detail: hasReqs ? 'Functional & non-functional requirements present.' : 'Requirements node is missing or empty.',
    weight: 10
  });
  if (!hasReqs) {
    findings.push({
      id: 'finding-reqs',
      severity: 'WARNING',
      title: 'Requirements Undefined',
      message: 'Without documented requirements, architectural decisions lack clear constraints.',
      fixActionLabel: 'Add Requirements'
    });
  }

  // Check 3: PRD (15)
  const prdNodes = nodeTypeMap.get('prd') || [];
  const hasPrd = prdNodes.some((n) => n.data.content.trim().length > 50);
  checks.push({
    id: 'check-prd',
    label: 'PRD complete',
    passed: hasPrd,
    detail: hasPrd ? 'PRD with goals and acceptance criteria exists.' : 'Add a PRD node to anchor feature definitions.',
    weight: 15
  });
  if (!hasPrd) {
    findings.push({
      id: 'finding-prd',
      severity: 'WARNING',
      title: 'PRD Missing or Incomplete',
      message: 'A Product Requirements Document ensures all team members and coding agents align on scope.',
      fixActionLabel: 'Generate PRD'
    });
  }

  // Check 4: Architecture (15)
  const archNodes = nodeTypeMap.get('architecture') || [];
  const hasArch = archNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-arch',
    label: 'Architecture defined',
    passed: hasArch,
    detail: hasArch ? 'System topology and boundaries defined.' : 'Architecture node is missing or undefined.',
    weight: 15
  });
  if (!hasArch) {
    findings.push({
      id: 'finding-arch',
      severity: 'WARNING',
      title: 'Architecture Missing',
      message: 'System architecture guides directory layout, database interactions, and API communication.',
      fixActionLabel: 'Add Architecture'
    });
  }

  // Check 5: Tech Stack (10)
  const techNodes = nodeTypeMap.get('tech_stack') || [];
  const hasTech = techNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-tech',
    label: 'Tech Stack justified',
    passed: hasTech,
    detail: hasTech ? 'Technologies and rationales documented.' : 'Add a Tech Stack node with reasons for key choices.',
    weight: 10
  });

  // Check 6: Data Model (10)
  const dataModelNodes = nodeTypeMap.get('data_model') || [];
  const hasDataModel = dataModelNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-datamodel',
    label: 'Data Model specified',
    passed: hasDataModel,
    detail: hasDataModel ? 'Entities and relationships are mapped.' : 'Consider defining your data model and schemas.',
    weight: 10
  });

  // Check 7: API (10)
  const apiNodes = nodeTypeMap.get('api') || [];
  const hasApi = apiNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-api',
    label: 'API contracts designed',
    passed: hasApi,
    detail: hasApi ? 'Endpoints and request/response payloads defined.' : 'Define API endpoints to establish frontend-backend boundaries.',
    weight: 10
  });

  // Check 8: Tasks (10)
  const taskNodes = nodeTypeMap.get('tasks') || [];
  const hasTasks = taskNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-tasks',
    label: 'Execution Tasks broken down',
    passed: hasTasks,
    detail: hasTasks ? 'Actionable tasks and phases ready.' : 'Break implementation down into sequential task items.',
    weight: 10
  });
  if (!hasTasks) {
    findings.push({
      id: 'finding-tasks',
      severity: 'ERROR',
      title: 'No Implementation Tasks',
      message: 'Coding agents require discrete, ordered tasks with acceptance criteria to begin development.',
      fixActionLabel: 'Generate Tasks'
    });
  }

  // Check 9: Test Plan (5)
  const testNodes = nodeTypeMap.get('test_plan') || [];
  const hasTestPlan = testNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-test',
    label: 'Test Plan established',
    passed: hasTestPlan,
    detail: hasTestPlan ? 'Verification and testing strategy documented.' : 'Add a Test Plan node to specify QA criteria.',
    weight: 5
  });

  // Check 10: Circular Dependencies Detection
  const circularCycle = findCycle(nodes, edges);
  if (circularCycle.length > 0) {
    findings.push({
      id: 'finding-cycle',
      severity: 'ERROR',
      title: 'Circular Dependency Loop Detected',
      message: `A circular reference was found in the graph: ${circularCycle.join(' -> ')}. This creates infinite loops in context resolution.`,
      fixActionLabel: 'Disconnect Loop'
    });
  }

  // Check 11: Outdated Nodes
  const outdatedNodes = nodes.filter((n) => n.data.status === 'outdated');
  for (const outNode of outdatedNodes) {
    findings.push({
      id: `finding-outdated-${outNode.id}`,
      severity: 'WARNING',
      title: `Node Outdated: "${outNode.data.title}"`,
      message: outNode.data.outdatedReason || 'An upstream connected node was modified after this node was written.',
      nodeId: outNode.id,
      nodeTitle: outNode.data.title,
      fixActionLabel: 'Review & Update'
    });
  }

  // Calculate Health Score
  let totalWeight = 0;
  let earnedWeight = 0;
  for (const c of checks) {
    totalWeight += c.weight;
    if (c.passed) earnedWeight += c.weight;
  }

  let rawScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  if (circularCycle.length > 0) {
    rawScore = Math.max(0, rawScore - 20);
  }

  const passedCount = checks.filter((c) => c.passed).length;

  return {
    score: rawScore,
    passedChecks: passedCount,
    totalChecks: checks.length,
    findings,
    checks,
    timestamp: new Date().toISOString()
  };
}

function findCycle(nodes: PlannerNode[], edges: PlannerEdge[]): string[] {
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    adj.set(n.id, []);
  }
  for (const e of edges) {
    const list = adj.get(e.source);
    if (list) {
      list.push(e.target);
    }
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const path: string[] = [];

  function dfs(curr: string): boolean {
    visited.add(curr);
    inStack.add(curr);
    path.push(curr);

    const neighbors = adj.get(curr) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        path.push(neighbor);
        return true;
      }
    }

    inStack.delete(curr);
    path.pop();
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      if (dfs(n.id)) {
        return path;
      }
    }
  }

  return [];
}
