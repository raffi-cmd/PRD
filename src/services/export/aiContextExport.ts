import { ProjectSchema } from '../../types/project';
import { PlannerNode } from '../../types/node';
import { generateDesignBriefMarkdown } from './designBriefGenerator';
import { generateAICodingHandoffMarkdown } from './aiCodingHandoffGenerator';
import { generateUXSpecMarkdown } from './uxSpecGenerator';

export interface ExportFilesBundle {
  'HANDOFF.md': string;
  'DESIGN_BRIEF.md': string;
  'UX_SPEC.md': string;
  'AI_CONTEXT.md': string;
  'AGENTS.md': string;
  'CLAUDE.md': string;
  'GEMINI.md': string;
  tasks: Record<string, string>; // e.g. "TASK-001.md": "..."
}

export function generateAllExportFiles(project: ProjectSchema): ExportFilesBundle {
  const handoffMd = generateAICodingHandoffMarkdown(project);
  const designBriefMd = generateDesignBriefMarkdown(project);
  const uxSpecMd = generateUXSpecMarkdown(project);
  const aiContext = generateAIContextMarkdown(project);
  const agentsMd = generateAgentsMarkdown(project);
  const claudeMd = generateClaudeMarkdown(project);
  const geminiMd = generateGeminiMarkdown(project);
  const tasks = generateIndividualTaskFiles(project);

  return {
    'HANDOFF.md': handoffMd,
    'DESIGN_BRIEF.md': designBriefMd,
    'UX_SPEC.md': uxSpecMd,
    'AI_CONTEXT.md': aiContext,
    'AGENTS.md': agentsMd,
    'CLAUDE.md': claudeMd,
    'GEMINI.md': geminiMd,
    tasks
  };
}

export function generateAIContextMarkdown(project: ProjectSchema): string {
  const { nodes, project: meta } = project;

  function findContent(type: string): string {
    const matched = nodes.filter((n) => n.data.type === type);
    if (matched.length === 0) return '_Not yet defined in the planning graph._';
    return matched.map((m) => `### ${m.data.title}\n\n${m.data.content}`).join('\n\n');
  }

  return `# Project Context: ${meta.name}

> ${meta.description || 'Comprehensive AI coding agent technical specification and roadmap.'}
> Generated on: ${new Date().toISOString()} | Schema Version: ${project.schemaVersion}

---

## 1. Project Goal & Problem
${findContent('idea')}

---

## 2. Requirements & Boundaries
${findContent('requirements')}

---

## 3. Product Requirements Document (PRD)
${findContent('prd')}

---

## 4. User Stories
${findContent('user_stories')}

---

## 5. Scope & Assumptions
${findContent('scope')}

${findContent('assumptions')}

---

## 6. System Architecture
${findContent('architecture')}

---

## 7. Technology Stack
${findContent('tech_stack')}

---

## 8. Data Model & Database Schemas
${findContent('data_model')}

---

## 9. API Specification
${findContent('api')}

---

## 10. UI / UX Design & Screen Flow
${findContent('ui_ux')}

${findContent('components')}

---

## 11. Folder Structure
${findContent('folder_structure')}

---

## 12. Implementation Tasks & Phases
${findContent('tasks')}

---

## 13. Testing Strategy & Quality Assurance
${findContent('test_plan')}

---

## 14. Acceptance Criteria & Validation
${findContent('acceptance_criteria')}

${findContent('validation')}

---

## 15. Important Decisions & AI Context Directives
${findContent('ai_context')}
`;
}

export function generateAgentsMarkdown(project: ProjectSchema): string {
  const meta = project.project;
  const techStack = project.nodes.find((n) => n.data.type === 'tech_stack')?.data.content || 'Standard modern stack';
  const tasks = project.nodes.find((n) => n.data.type === 'tasks')?.data.content || 'See AI_CONTEXT.md';

  return `# AGENTS.md: Universal Coding Agent Directives

## Project: ${meta.name}

You are an expert autonomous software engineer working on this repository.
Before making any changes, read \`AI_CONTEXT.md\` for the authoritative system architecture, data models, and API contracts.

### Golden Rules
1. **Never Hallucinate Contracts**: Adhere strictly to the data models and API specifications defined in \`AI_CONTEXT.md\`.
2. **Atomic Commits & Verification**: Always verify code builds cleanly and unit tests pass before considering a task complete.
3. **Preserve Architectural Boundaries**: Keep concerns separated (UI vs Service vs Data layer).
4. **Handle Errors Explicitly**: Never swallow exceptions silently. Provide clear, user-friendly error messages.

### Tech Stack Summary
${techStack}

### Execution Order
${tasks}
`;
}

export function generateClaudeMarkdown(project: ProjectSchema): string {
  const meta = project.project;
  return `# CLAUDE.md - Instructions for Claude Code / Anthropic

# Project: ${meta.name}

## Guidelines
- Follow TypeScript strict mode without \`any\`.
- Keep components modular, accessible, and responsive.
- Run tests and linting after making changes.
- Refer to \`AI_CONTEXT.md\` for exact database schemas and API endpoints.

## Development Commands
\`\`\`bash
npm run dev      # Start development server
npm run build    # Compile & build for production
npm test         # Run test suite
\`\`\`
`;
}

export function generateGeminiMarkdown(project: ProjectSchema): string {
  const meta = project.project;
  return `# GEMINI.md - Instructions for Google Antigravity & Gemini CLI

# Project: ${meta.name}

## System Overview
This project was designed using the Visual AI Coding Planner.
Consult \`AI_CONTEXT.md\` for the comprehensive functional and non-functional specifications.

## Engineering Standards
- Follow modern idiomatic patterns.
- Keep dependencies minimal and audit licenses.
- Implement comprehensive unit tests for all domain logic.
`;
}

export function generateIndividualTaskFiles(project: ProjectSchema): Record<string, string> {
  const taskNode = project.nodes.find((n) => n.data.type === 'tasks');
  const files: Record<string, string> = {};

  if (!taskNode || !taskNode.data.content) {
    files['TASK-001-setup.md'] = `# TASK-001: Project Setup\n\nInitialize repository and baseline dependencies.`;
    return files;
  }

  // If structured tasks exist in data.tasks
  if (taskNode.data.tasks && taskNode.data.tasks.length > 0) {
    for (const t of taskNode.data.tasks) {
      const filename = `${t.id}.md`;
      files[filename] = `# ${t.id}: ${t.title}

- **Priority**: ${t.priority}
- **Status**: ${t.status}
- **Phase**: ${t.phase || 'N/A'}
- **Dependencies**: ${t.dependencies.length > 0 ? t.dependencies.join(', ') : 'None'}

## Goal
${t.goal || t.description}

## Description
${t.description}

## Acceptance Criteria
${t.acceptanceCriteria.map((ac) => `- [ ] ${ac}`).join('\n')}
`;
    }
    return files;
  }

  // Otherwise, parse markdown sections with TASK-XXX
  const content = taskNode.data.content;
  const taskMatches = content.matchAll(/(TASK-\d+)[^:\n]*:?\s*([^\n]+)/gi);
  let idx = 1;
  for (const match of taskMatches) {
    const taskId = match[1].toUpperCase();
    const taskTitle = match[2].trim();
    files[`${taskId}.md`] = `# ${taskId}: ${taskTitle}

## Context
Extracted from Project Planner execution plan.

## Task Details
See \`AI_CONTEXT.md\` under Section 12 (Implementation Tasks).
`;
    idx++;
  }

  if (Object.keys(files).length === 0) {
    files['TASK-001.md'] = `# TASK-001: Project Setup\n\nRefer to AI_CONTEXT.md for setup instructions.`;
  }

  return files;
}
