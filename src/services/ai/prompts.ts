import { NodeType } from '../../types/node';
import { AIContextSnippet } from '../../types/ai';

export const SYSTEM_ARCHITECT_PROMPT = `You are a Senior Principal Software Architect, Principal Product Manager, and AI Coding Strategist.
Your goal is to transform project ideas into clear, executable, production-grade technical blueprints.
Never hallucinate non-standard implementations without reason.
When information or technical choices are ambiguous, explicitly state "Decision required:" instead of guessing blindly.
Always produce clean, well-formatted Markdown or valid JSON depending on what is requested.`;

export function buildProjectPlanSynthesisPrompt(idea: string): string {
  return `Act as a Principal System Architect and generate a comprehensive, structured initial planning graph for this project idea:
"${idea}"

Generate a JSON object matching this EXACT structure (valid JSON, no surrounding markdown fences, or wrapped in \`\`\`json):
{
  "projectTitle": "Clear, concise project name",
  "projectDescription": "1-2 sentence overview",
  "nodes": [
    {
      "id": "node-idea",
      "type": "idea",
      "title": "Project Vision & Core Idea",
      "content": "Detailed markdown explaining the problem, target user, and core value proposition.",
      "status": "approved"
    },
    {
      "id": "node-requirements",
      "type": "requirements",
      "title": "Functional & Non-Functional Requirements",
      "content": "Detailed markdown covering Problem, Goals, Target Users, Functional Requirements, Non-Functional Requirements, Constraints, Assumptions, and Non-Goals.",
      "status": "in_review"
    },
    {
      "id": "node-prd",
      "type": "prd",
      "title": "Product Requirements Document (PRD)",
      "content": "Comprehensive PRD with: 1. Overview, 2. Problem Statement, 3. Target Users, 4. Goals & Non-Goals, 5. User Stories, 6. Core Features, 7. Edge Cases, 8. Acceptance Criteria, 9. Success Metrics.",
      "status": "draft"
    },
    {
      "id": "node-arch",
      "type": "architecture",
      "title": "System Architecture & Flow",
      "content": "Architecture overview, client/server boundaries, authentication strategy, data flow, communication protocol, security considerations, and scalability.",
      "status": "draft"
    },
    {
      "id": "node-techstack",
      "type": "tech_stack",
      "title": "Recommended Technology Stack",
      "content": "Frontend, Backend, Database, Hosting, and Tooling recommendations with explicit 'Reason:' for each choice.",
      "status": "draft"
    },
    {
      "id": "node-datamodel",
      "type": "data_model",
      "title": "Database Schema & Relationships",
      "content": "Database entities, primary keys, fields, data types, and explicit 1->N / N->N relationships.",
      "status": "draft"
    },
    {
      "id": "node-api",
      "type": "api",
      "title": "API Specification",
      "content": "RESTful endpoints with HTTP Method, Path, Purpose, Request payload, and Response status codes.",
      "status": "draft"
    },
    {
      "id": "node-uiux",
      "type": "ui_ux",
      "title": "UI / UX Design & Screen Flow",
      "content": "Core pages, layout principles, responsive behavior, loading states, empty states, and accessibility considerations.",
      "status": "draft"
    },
    {
      "id": "node-designintent",
      "type": "design_intent",
      "title": "Design North Star & Visual Intent",
      "content": "## Design North Star\n[AI SUGGESTION] Define the single sentence describing visual character.\n\n## Visual Metaphor & Direction\n- Direction: Editorial Utility\n- Metaphor: Domain Workbench\n- Anti-Patterns: No generic SaaS dashboard clichés, no card soup, no gradient blobs.",
      "status": "draft"
    },
    {
      "id": "node-tasks",
      "type": "tasks",
      "title": "Development Tasks & Execution Plan",
      "content": "Step-by-step tasks organized by Phase 1 (Scaffolding), Phase 2 (Core Models & API), Phase 3 (UI Implementation), Phase 4 (Polish & Tests). Include TASK-001... identifiers, goals, and acceptance criteria.",
      "status": "draft"
    },
    {
      "id": "node-testplan",
      "type": "test_plan",
      "title": "Testing & QA Strategy",
      "content": "Unit testing, integration testing, critical user path verification, and edge case coverage.",
      "status": "draft"
    },
    {
      "id": "node-validation",
      "type": "validation",
      "title": "Project Health & Pre-flight Checklist",
      "content": "Sanity checks, potential failure modes, security considerations, and definition of done.",
      "status": "draft"
    },
    {
      "id": "node-aicontext",
      "type": "ai_context",
      "title": "AI Coding Agent Context",
      "content": "Concise briefing for AI coding assistants (e.g. Cursor, Claude Code, Cline) on how to approach building this application.",
      "status": "draft"
    }
  ],
  "edges": [
    { "source": "node-idea", "target": "node-requirements", "type": "derived-from" },
    { "source": "node-requirements", "target": "node-prd", "type": "derived-from" },
    { "source": "node-prd", "target": "node-arch", "type": "implements" },
    { "source": "node-prd", "target": "node-techstack", "type": "implements" },
    { "source": "node-arch", "target": "node-datamodel", "type": "dependency" },
    { "source": "node-arch", "target": "node-api", "type": "dependency" },
    { "source": "node-prd", "target": "node-uiux", "type": "implements" },
    { "source": "node-uiux", "target": "node-designintent", "type": "implements" },
    { "source": "node-designintent", "target": "node-tasks", "type": "implements" },
    { "source": "node-api", "target": "node-tasks", "type": "implements" },
    { "source": "node-tasks", "target": "node-testplan", "type": "dependency" },
    { "source": "node-testplan", "target": "node-validation", "type": "dependency" },
    { "source": "node-validation", "target": "node-aicontext", "type": "implements" }
  ]
}`;
}

export function buildContextualNodePrompt(
  nodeType: NodeType,
  nodeTitle: string,
  instruction: string,
  existingContent: string,
  contextSnippets: AIContextSnippet[]
): string {
  let contextBlock = '';
  if (contextSnippets.length > 0) {
    contextBlock = '=== CONNECTED PROJECT CONTEXT ===\n' +
      contextSnippets
        .map(
          (s) =>
            `[${s.relationship.toUpperCase()}: ${s.nodeType.toUpperCase()} - "${s.title}"]\n${s.content}\n`
        )
        .join('\n------------------------------\n');
  } else {
    contextBlock = '(No upstream nodes connected. Generate independently based on instruction).';
  }

  return `You are editing or generating content for a planning node:
TYPE: ${nodeType.toUpperCase()}
TITLE: ${nodeTitle}

${contextBlock}

=== CURRENT NODE CONTENT ===
${existingContent || '(Empty draft)'}

=== USER INSTRUCTION ===
${instruction}

=== GUIDELINES FOR ${nodeType.toUpperCase()} ===
${getNodeTypeSpecificGuideline(nodeType)}

Produce high quality, professional Markdown directly. Do not include meta chatter or back-and-forth conversational remarks.`;
}

function getNodeTypeSpecificGuideline(type: NodeType): string {
  switch (type) {
    case 'prd':
      return `- Structure into: Product Overview, Problem Statement, Target Users, Goals, Non-Goals, User Stories, Core Features, Functional Requirements, Non-Functional Requirements, User Flow, Constraints, Assumptions, Edge Cases, Acceptance Criteria, Success Metrics, Risks.
- Ensure every feature has measurable acceptance criteria.`;
    case 'requirements':
      return `- Explicitly enumerate Problem, Goals, Target Users, Functional Requirements, Non-Functional Requirements, Constraints, Assumptions, and Non-Goals.
- Identify incomplete requirements.`;
    case 'architecture':
      return `- Detail: Architecture Overview, Frontend, Backend, Database, Authentication, API, External Services, Communication Flow, Security, Scalability.
- If an architectural decision is not specified by upstream context, label it explicitly as "Decision required:" rather than inventing requirements.`;
    case 'tech_stack':
      return `- List Frontend, Backend, Database, Hosting, AI Provider, Testing, Tooling.
- For each technology, explicitly state "Reason:" justifying why it fits this project without overengineering.`;
    case 'data_model':
      return `- Define distinct entities, field names, primary keys, data types, and explicit relationships (1->N, N->N).`;
    case 'api':
      return `- Define HTTP methods (GET, POST, PATCH, DELETE), paths, purpose, request body schema, and response codes.`;
    case 'ui_ux':
      return `- Describe pages, layout, navigation, key components, responsive behavior, loading states, empty states, error states, and accessibility.`;
    case 'tasks':
      return `- Group tasks into sequential phases (Phase 1: Setup, Phase 2: Core Logic, Phase 3: UI, Phase 4: Polish, Phase 5: Deployment).
- Each task should have TASK-XXX ID, Title, Goal, Dependencies, Affected Files, Acceptance Criteria, Priority, Status.`;
    case 'test_plan':
      return `- Outline Unit, Integration, and End-to-End tests, along with manual verification steps and edge-case testing.`;
    case 'validation':
      return `- Provide a sanity check checklist evaluating completeness, security, architecture stability, and launch readiness.`;
    case 'ai_context':
      return `- Formulate an authoritative context briefing suitable for feeding into an AI coding assistant (e.g. Cursor, Claude Code, Cline).`;
    default:
      return `- Provide structured, concise, actionable technical markdown.`;
  }
}

export function buildProjectReviewPrompt(
  nodes: Array<{ id: string; type: string; title: string; content: string }>,
  edges: Array<{ source: string; target: string; type?: string }>
): string {
  return `You are a Principal Software Architect conducting a rigorous review of a full project planning graph.
Review the following project graph for:
1. Missing essential requirements or specs
2. Contradictions between connected nodes (e.g., PRD states one thing, Architecture specifies another)
3. Circular dependencies or broken dependency chains
4. Missing architecture decisions (e.g., Auth or DB undefined)
5. Unrealistic or oversized tasks
6. Missing acceptance criteria or test strategies
7. Scope creep or unnecessary tech stack bloat

=== NODES ===
${JSON.stringify(nodes, null, 2)}

=== EDGES ===
${JSON.stringify(edges, null, 2)}

Return a JSON array of findings matching this EXACT structure (valid JSON, no conversational markdown outside the json block):
[
  {
    "id": "finding-1",
    "severity": "ERROR" | "WARNING" | "INFO",
    "title": "Short finding title",
    "message": "Detailed explanation of the issue and why it risks project execution.",
    "nodeId": "id-of-affected-node-or-null",
    "nodeTitle": "title-of-affected-node-or-null",
    "fixActionLabel": "Action to fix (e.g. 'Define DB Schema' or 'Split TASK-003')",
    "suggestedFix": "Concrete suggestion or replacement text"
  }
]`;
}
