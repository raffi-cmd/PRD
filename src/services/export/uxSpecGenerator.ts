import { ProjectSchema } from '../../types/project';

export function generateUXSpecMarkdown(project: ProjectSchema): string {
  const meta = project.project;

  function getNodeContent(type: string): string {
    const matched = project.nodes.filter((n) => n.data.type === type);
    if (matched.length === 0) return '_Not specified in planning graph._';
    return matched.map((m) => `### ${m.data.title}\n\n${m.data.content}`).join('\n\n');
  }

  return `# UX SPECIFICATION: ${meta.name}

> Authoritative user journeys, screen flows, information architecture, and state feelings.
> Generated on: ${new Date().toISOString()}

---

## 1. USER JOURNEY & CORE ACTIONS

### Primary User Flow & Navigation Pathways
${getNodeContent('user_flow')}

### User Stories & Scenarios
${getNodeContent('user_stories')}

---

## 2. INFORMATION ARCHITECTURE & SCREEN SPECIFICATIONS

### UI / UX Specifications & Screen Wireframes
${getNodeContent('ui_ux')}

### Component Inventory & Props
${getNodeContent('components')}

---

## 3. UX STATE GUIDELINES & BEHAVIORAL FEELINGS

- **First Visit / Onboarding State**:
  - Uncluttered introduction with zero wall-of-text modal splash screens.
  - Obvious single primary call-to-action leading immediately to initial value.

- **Empty State**:
  - Quiet, instructional, and actionable.
  - Avoid decorative empty illustration clichés or fake confetti.
  - Provide a clear 1-click trigger or sample template to start.

- **Input & Editing State**:
  - Real-time inline feedback without blocking the user.
  - Accessible, visible keyboard focus indicators on active controls.
  - Clear validation warnings anchored directly to affected input fields.

- **Loading & Processing State**:
  - Context-aware skeleton loaders matching target layout dimensions.
  - Zero layout shift or screen jitter when data resolves.

- **Success & Completion State**:
  - Instant inline confirmation; unambiguous status indicators.
  - Avoid disruptive modal takeovers when a calm inline banner suffices.

- **Error & Recovery State**:
  - Explicit, human-readable root-cause error description.
  - Actionable inline retry/recovery options; never leave the user trapped.

- **Mobile Viewport State**:
  - Single-column stacked workflow preserving desktop visual hierarchy.
  - Minimum touch targets of 44x44px.
  - Key primary actions stay sticky or immediately reachable.
`;
}
