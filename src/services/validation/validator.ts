import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { DesignIntentData } from '../../types/project';
import {
  HealthReport,
  ValidationFinding,
  HealthCheckItem,
  ReadinessCategory,
  ReadinessCategoryBreakdown
} from '../../types/validation';

export function validateProjectGraph(
  nodes: PlannerNode[],
  edges: PlannerEdge[],
  designIntent?: DesignIntentData
): HealthReport {
  const findings: ValidationFinding[] = [];
  const checks: HealthCheckItem[] = [];

  const nodeTypeMap = new Map<string, PlannerNode[]>();
  for (const node of nodes) {
    const type = node.data.type;
    const list = nodeTypeMap.get(type) || [];
    list.push(node);
    nodeTypeMap.set(type, list);
  }

  // ==========================================
  // 1. PRODUCT READINESS CHECKS
  // ==========================================
  const ideaNodes = nodeTypeMap.get('idea') || [];
  const hasIdea = ideaNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-idea',
    category: 'product',
    label: 'Project Idea & Vision defined',
    passed: hasIdea,
    detail: hasIdea ? 'Core vision and problem are documented.' : 'Add an Idea node with a clear goal and problem description.',
    weight: 15
  });
  if (!hasIdea) {
    findings.push({
      id: 'finding-idea',
      severity: 'ERROR',
      title: 'Missing Project Vision',
      message: 'The project lacks a defined core idea. All planning should stem from an initial concept.',
      fixActionLabel: 'Create Idea Node'
    });
  }

  const reqNodes = nodeTypeMap.get('requirements') || [];
  const hasReqs = reqNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-reqs',
    category: 'product',
    label: 'Functional & Non-Functional Requirements',
    passed: hasReqs,
    detail: hasReqs ? 'Requirements and boundaries present.' : 'Add or expand Requirements node.',
    weight: 10
  });

  const prdNodes = nodeTypeMap.get('prd') || [];
  const hasPrd = prdNodes.some((n) => n.data.content.trim().length > 50);
  checks.push({
    id: 'check-prd',
    category: 'product',
    label: 'Product Requirements Document (PRD)',
    passed: hasPrd,
    detail: hasPrd ? 'PRD with goals and feature definitions exists.' : 'Add a PRD node to anchor specifications.',
    weight: 15
  });
  if (!hasPrd) {
    findings.push({
      id: 'finding-prd',
      severity: 'WARNING',
      title: 'PRD Missing or Incomplete',
      message: 'A Product Requirements Document ensures all coding agents align on functional scope.',
      fixActionLabel: 'Generate PRD'
    });
  }

  // ==========================================
  // 2. UX READINESS CHECKS
  // ==========================================
  const uiuxNodes = nodeTypeMap.get('ui_ux') || [];
  const userFlowNodes = nodeTypeMap.get('user_flow') || [];
  const hasUX = uiuxNodes.some((n) => n.data.content.trim().length > 30) || userFlowNodes.length > 0;
  checks.push({
    id: 'check-ux-flow',
    category: 'ux',
    label: 'User Flow & Screen Specifications',
    passed: hasUX,
    detail: hasUX ? 'Screen flows and UX specifications mapped.' : 'Document key user flows and screen interactions.',
    weight: 15
  });

  // ==========================================
  // 3. DESIGN INTENT READINESS CHECKS
  // ==========================================
  const hasNorthStar = !!(designIntent?.northStar?.statement && designIntent.northStar.statement.trim().length > 15);
  checks.push({
    id: 'check-north-star',
    category: 'design',
    label: 'Design North Star established',
    passed: hasNorthStar,
    detail: hasNorthStar ? `"${designIntent?.northStar?.statement?.slice(0, 45)}..."` : 'Define the single guiding sentence for emotional/visual character.',
    weight: 15
  });

  const hasAntiPatterns = !!(designIntent?.antiPatterns?.forbidden && designIntent.antiPatterns.forbidden.length > 0);
  checks.push({
    id: 'check-anti-patterns',
    category: 'design',
    label: 'Forbidden Anti-Patterns defined',
    passed: hasAntiPatterns,
    detail: hasAntiPatterns ? `${designIntent?.antiPatterns?.forbidden?.length} anti-patterns specified.` : 'Select what visual clichés coding agents MUST NOT produce.',
    weight: 10
  });

  const hasCriteria = !!(designIntent?.visualAcceptanceCriteria?.criteria && designIntent.visualAcceptanceCriteria.criteria.length > 0);
  checks.push({
    id: 'check-visual-criteria',
    category: 'design',
    label: 'Visual Acceptance Criteria established',
    passed: hasCriteria,
    detail: hasCriteria ? `${designIntent?.visualAcceptanceCriteria?.criteria?.length} testable criteria defined.` : 'Define what visually successful completion means.',
    weight: 10
  });

  // ==========================================
  // 4. TECHNICAL READINESS CHECKS
  // ==========================================
  const archNodes = nodeTypeMap.get('architecture') || [];
  const hasArch = archNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-arch',
    category: 'technical',
    label: 'System Architecture & Boundaries',
    passed: hasArch,
    detail: hasArch ? 'System topology and boundaries defined.' : 'Architecture node is missing or undefined.',
    weight: 15
  });

  const techNodes = nodeTypeMap.get('tech_stack') || [];
  const hasTech = techNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-tech',
    category: 'technical',
    label: 'Technology Stack justified',
    passed: hasTech,
    detail: hasTech ? 'Technologies and rationales documented.' : 'Add a Tech Stack node with reasons for key choices.',
    weight: 10
  });

  const dataModelNodes = nodeTypeMap.get('data_model') || [];
  const hasDataModel = dataModelNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-datamodel',
    category: 'technical',
    label: 'Data Model & Schemas mapped',
    passed: hasDataModel,
    detail: hasDataModel ? 'Entities and relationships are mapped.' : 'Consider defining your data model and schemas.',
    weight: 10
  });

  const apiNodes = nodeTypeMap.get('api') || [];
  const hasApi = apiNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-api',
    category: 'technical',
    label: 'API Specifications designed',
    passed: hasApi,
    detail: hasApi ? 'Endpoints and request/response payloads defined.' : 'Define API endpoints to establish boundaries.',
    weight: 10
  });

  const taskNodes = nodeTypeMap.get('tasks') || [];
  const hasTasks = taskNodes.some((n) => n.data.content.trim().length > 30);
  checks.push({
    id: 'check-tasks',
    category: 'technical',
    label: 'Implementation Task Breakdown',
    passed: hasTasks,
    detail: hasTasks ? 'Actionable tasks and execution plan ready.' : 'Break implementation down into sequential task items.',
    weight: 15
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

  // ==========================================
  // 5. VERIFICATION CHECKS
  // ==========================================
  const testNodes = nodeTypeMap.get('test_plan') || [];
  const hasTestPlan = testNodes.some((n) => n.data.content.trim().length > 20);
  checks.push({
    id: 'check-test',
    category: 'verification',
    label: 'Verification Strategy & Test Plan',
    passed: hasTestPlan,
    detail: hasTestPlan ? 'QA and testing criteria documented.' : 'Add a Test Plan node to specify verification protocol.',
    weight: 10
  });

  // Check Circular Dependencies
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

  // Check Outdated Nodes
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

  // Calculate Overall and Category Breakdown Scores
  const categoryDefs: { cat: ReadinessCategory; title: string }[] = [
    { cat: 'product', title: 'Product Definition' },
    { cat: 'ux', title: 'UX & State Feelings' },
    { cat: 'design', title: 'Design Intent & North Star' },
    { cat: 'technical', title: 'Technical Architecture' },
    { cat: 'verification', title: 'Verification Strategy' }
  ];

  const categories: ReadinessCategoryBreakdown[] = categoryDefs.map(({ cat, title }) => {
    const catChecks = checks.filter((c) => c.category === cat);
    const catTotal = catChecks.reduce((acc, c) => acc + c.weight, 0);
    const catEarned = catChecks.filter((c) => c.passed).reduce((acc, c) => acc + c.weight, 0);
    const score = catTotal > 0 ? Math.round((catEarned / catTotal) * 100) : 0;
    return {
      category: cat,
      title,
      score,
      passedChecks: catChecks.filter((c) => c.passed).length,
      totalChecks: catChecks.length,
      checks: catChecks
    };
  });

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
    categories,
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
