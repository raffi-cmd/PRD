import { ProjectSchema, DesignIntentData } from '../../types/project';
import { generateDesignBriefMarkdown } from './designBriefGenerator';
import { generateUXSpecMarkdown } from './uxSpecGenerator';
import { createDefaultDesignIntent } from '../storage/projectIO';

export function generateAICodingHandoffMarkdown(project: ProjectSchema): string {
  const meta = project.project;
  const design: DesignIntentData = project.designIntent || createDefaultDesignIntent();

  function getNodeContent(type: string): string {
    const matched = project.nodes.filter((n) => n.data.type === type);
    if (matched.length === 0) return '_Not specified in graph._';
    return matched.map((m) => `### ${m.data.title}\n\n${m.data.content}`).join('\n\n');
  }

  const designBrief = generateDesignBriefMarkdown(project);
  const uxSpec = generateUXSpecMarkdown(project);

  let constraintsBlock = '';
  if (design.constraints) {
    constraintsBlock = `### Technical Constraints\n${design.constraints.technical.map((c) => `- ${c}`).join('\n')}\n\n### Component & Responsive Constraints\n${design.constraints.component.concat(design.constraints.responsive).map((c) => `- ${c}`).join('\n')}\n\n### Things to Explicitly Avoid\n${design.constraints.thingsToAvoid.map((c) => `- ${c}`).join('\n')}`;
  } else {
    constraintsBlock = '- Follow existing repository conventions and package.json versions.\n- Avoid introducing unnecessary heavy dependencies.\n- Ensure strict TypeScript typing without any.';
  }

  return `# AI CODING HANDOFF: ${meta.name}

> Comprehensive Product → UX → Design Intent → Technical Implementation Blueprint
> Generated on: ${new Date().toISOString()} | Schema: V2 | Target: OpenCode, Codex, Cline, Cursor, Antigravity

---

## 1. PRODUCT DEFINITION
- **Project Name**: ${meta.name}
- **Description**: ${meta.description || 'N/A'}
- **Project Scope**: ${design.projectType === 'existing_project' ? `Existing Project — Action: ${design.existingProjectAction || 'Refine Identity'}` : 'New Greenfield Build'}

### Product Vision & Goals
${getNodeContent('idea')}

### System Requirements & Boundaries
${getNodeContent('requirements')}

### Product Requirements Document (PRD)
${getNodeContent('prd')}

---

## 2. UX DEFINITION & STATE FEELINGS
${uxSpec}

---

## 3. DESIGN INTENT & BRIEF
${designBrief}

---

## 4. FUNCTIONAL & TECHNICAL ARCHITECTURE

### System Topology & Architecture
${getNodeContent('architecture')}

### Technology Stack & Justifications
${getNodeContent('tech_stack')}

### Data Model & Schemas
${getNodeContent('data_model')}

### API Specification & Endpoints
${getNodeContent('api')}

### Implementation Tasks & Phases
${getNodeContent('tasks')}

---

## 5. IMPLEMENTATION CONSTRAINTS
${constraintsBlock}

---

## 6. IMPLEMENTATION RULES FOR CODING AGENTS

1. **Inspect Before Modifying**: Always read existing files, types, and components before writing code.
2. **Preserve Working Architecture**: Do not rewrite existing working components or change build systems unless instructed.
3. **Follow Design Intent**: Ground every visual choice in the Design North Star, Visual Metaphor, and Typography/Color direction.
4. **Enforce Intentional Composition**: Spacing, sizing, and borders must have semantic purpose, not random copy-paste.
5. **Strict Anti-AI-Slop Rules**: Zero generic gradient blobs, zero card soup, zero glassmorphism, zero decorative icon spam.
6. **Atomic Verification**: Build and test after every significant change.
7. **Execute Visual Verification**: Follow the mandatory 15-step verification loop below before claiming completion.

---

## 7. VISUAL VERIFICATION LOOP (15-STEP SEQUENCE)

As an AI coding agent, you MUST complete this exact sequence for all UI implementations:

1. **Inspect existing project**: Review code and UI baseline.
2. **Understand current implementation**: Know component hierarchy and data flow.
3. **Plan changes**: Outline atomic edits before typing code.
4. **Implement**: Write clean, modular code.
5. **Run the application**: Start preview/dev server.
6. **Render desktop viewport (~1280px-1440px)**.
7. **Render mobile viewport (~390px)**.
8. **Inspect screenshots / browser output**: Check visual balance, contrast, alignment.
9. **Identify highest-impact visual problem**: Look for generic SaaS patterns or broken hierarchy.
10. **Fix that problem**: Refine typography, padding, or contrast.
11. **Render again**: Confirm the visual fix on both viewports.
12. **Repeat if necessary**: Only stop when visual execution matches intent.
13. **Run functional tests**: Verify unit and integration test pass rate.
14. **Run typecheck / build / lint**: Ensure zero compiler warnings/errors.
15. **Final visual inspection**: Confirm the UI feels recognizable, intentional, and high-quality.

---

## 8. DESIGN CRITIQUE STAGE (PRIORITY HIERARCHY)

When auditing UI implementation, always resolve issues in this strict order:

### P0 — Broken (Fix First!)
- Broken functionality, broken click/touch targets
- Layout overflow or unreadable text wrapping
- Runtime errors, uncaught exceptions, build failures

### P1 — Visual Hierarchy (Fix Second!)
- Focal point not immediately obvious at a 2-second glance
- Spacing is mechanical rather than intentional
- Typography scale lacks clear weight/size distinction
- Mobile viewport collapses into unstructured chaos

### P2 — Polish (Fix Last!)
- Subtle alignment and 1px micro-border consistency
- Hover / active state transitions (<150ms)
- Empty state copy and subtle focus rings

> **Rule**: Never spend time polishing P2 details when P0 or P1 hierarchy flaws exist!

---

## 9. DESIGN JUDGMENT GATE (10 QUESTIONS)

Before marking any visual task complete, answer these 10 questions:

1. **Does the rendered UI express the Design North Star?**
2. **Is the primary focal point obvious at a 2-second glance?**
3. **Does the visual metaphor actually influence layout and typography?**
4. **Does the composition feel intentional rather than assembled from generic template kits?**
5. **Is whitespace purposeful rather than uniform filler?**
6. **Are components visually differentiated according to their semantic roles?**
7. **Does the interface feel like a coherent product rather than floating cards?**
8. **Is the design recognizable without relying solely on a logo?**
9. **Does it strictly avoid all specified anti-patterns?**
10. **Would a human designer consider another iteration materially worthwhile?**

> **Rule**: If the answer to #10 is YES, you MUST perform another iteration before declaring completion!

---

## 10. DEFINITION OF DONE

A task is complete ONLY when:
- [ ] Code compiles without errors or warnings.
- [ ] All automated unit & integration tests pass (100%).
- [ ] Desktop and mobile viewports have been visually inspected.
- [ ] All Visual Acceptance Criteria are satisfied.
- [ ] All P0, P1, and P2 design critique checks pass.
- [ ] All 10 Design Judgment Gate questions pass.
`;
}
