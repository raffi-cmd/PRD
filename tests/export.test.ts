import { describe, it, expect } from 'vitest';
import { createDefaultProject } from '../src/services/storage/projectIO';
import { generateAllExportFiles, generateAIContextMarkdown } from '../src/services/export/aiContextExport';

describe('AI Context & Agent Exports', () => {
  it('generates all expected coding agent files', () => {
    const proj = createDefaultProject('AI App');
    const bundle = generateAllExportFiles(proj);

    expect(bundle['AI_CONTEXT.md']).toBeDefined();
    expect(bundle['AGENTS.md']).toBeDefined();
    expect(bundle['CLAUDE.md']).toBeDefined();
    expect(bundle['GEMINI.md']).toBeDefined();
    expect(Object.keys(bundle.tasks).length).toBeGreaterThan(0);
  });

  it('AI_CONTEXT.md includes all major planning sections', () => {
    const proj = createDefaultProject('AI App');
    const md = generateAIContextMarkdown(proj);

    expect(md).toContain('## 1. Project Goal & Problem');
    expect(md).toContain('## 2. Requirements & Boundaries');
    expect(md).toContain('## 3. Product Requirements Document (PRD)');
    expect(md).toContain('## 6. System Architecture');
    expect(md).toContain('## 7. Technology Stack');
    expect(md).toContain('## 12. Implementation Tasks & Phases');
  });
});
