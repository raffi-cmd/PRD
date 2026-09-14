import { describe, it, expect } from 'vitest';
import { createDefaultProject } from '../src/services/storage/projectIO';
import { generateAllExportFiles, generateAIContextMarkdown } from '../src/services/export/aiContextExport';

describe('AI Context & Agent Exports', () => {
  it('generates all expected coding agent files including HANDOFF.md, DESIGN_BRIEF.md, and UX_SPEC.md', () => {
    const proj = createDefaultProject('AI App');
    const bundle = generateAllExportFiles(proj);

    expect(bundle['HANDOFF.md']).toBeDefined();
    expect(bundle['DESIGN_BRIEF.md']).toBeDefined();
    expect(bundle['UX_SPEC.md']).toBeDefined();
    expect(bundle['AI_CONTEXT.md']).toBeDefined();
    expect(bundle['AGENTS.md']).toBeDefined();
    expect(bundle['CLAUDE.md']).toBeDefined();
    expect(bundle['GEMINI.md']).toBeDefined();
    expect(Object.keys(bundle.tasks).length).toBeGreaterThan(0);
  });

  it('HANDOFF.md includes Design Intent, 15-step Visual Verification Loop, Design Critique and Design Judgment Gate', () => {
    const proj = createDefaultProject('AI App');
    const bundle = generateAllExportFiles(proj);
    const handoff = bundle['HANDOFF.md'];

    expect(handoff).toContain('## 1. PRODUCT DEFINITION');
    expect(handoff).toContain('## 2. UX DEFINITION & STATE FEELINGS');
    expect(handoff).toContain('## 3. DESIGN INTENT & BRIEF');
    expect(handoff).toContain('## 6. IMPLEMENTATION RULES FOR CODING AGENTS');
    expect(handoff).toContain('## 7. VISUAL VERIFICATION LOOP (15-STEP SEQUENCE)');
    expect(handoff).toContain('## 8. DESIGN CRITIQUE STAGE (PRIORITY HIERARCHY)');
    expect(handoff).toContain('## 9. DESIGN JUDGMENT GATE (10 QUESTIONS)');
    expect(handoff).toContain('## 10. DEFINITION OF DONE');
  });

  it('DESIGN_BRIEF.md synthesizes North Star, References and all design dimensions', () => {
    const proj = createDefaultProject('AI App');
    const bundle = generateAllExportFiles(proj);
    const brief = bundle['DESIGN_BRIEF.md'];

    expect(brief).toContain('## 1. DESIGN NORTH STAR');
    expect(brief).toContain('## 2. VISUAL DIRECTION');
    expect(brief).toContain('## 3. VISUAL METAPHOR');
    expect(brief).toContain('## 4. VISUAL REFERENCES & PRINCIPLES');
    expect(brief).toContain('## 13. ANTI-PATTERNS (MUST NOT APPEAR)');
    expect(brief).toContain('## 14. VISUAL ACCEPTANCE CRITERIA');
  });

  it('UX_SPEC.md includes user flow, screen specs, and state feelings', () => {
    const proj = createDefaultProject('AI App');
    const bundle = generateAllExportFiles(proj);
    const uxSpec = bundle['UX_SPEC.md'];

    expect(uxSpec).toContain('## 1. USER JOURNEY & CORE ACTIONS');
    expect(uxSpec).toContain('## 2. INFORMATION ARCHITECTURE & SCREEN SPECIFICATIONS');
    expect(uxSpec).toContain('## 3. UX STATE GUIDELINES & BEHAVIORAL FEELINGS');
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
