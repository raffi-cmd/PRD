# Architecture Specification - Visual AI Project Planner

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client UI (React)                       │
│  ┌──────────────┐  ┌───────────────────┐  ┌──────────────┐  │
│  │    Header    │  │  Planner Canvas   │  │ Node Palette │  │
│  │ (Save, Health│  │  (@xyflow/react)  │  │  (20+ Types) │  │
│  └──────────────┘  └───────────────────┘  └──────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │       Planner Store         │
                │ (usePlannerStore + History) │
                └──────┬───────────────┬──────┘
                       │               │
       ┌───────────────▼──┐         ┌──▼────────────────┐
       │ Validation Engine│         │ Upstream Traversal│
       │ (Graph Auditor)  │         │ (contextBuilder)  │
       └──────────────────┘         └──┬────────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │     AI Provider Service     │
                        │ (GeminiProvider / Pluggable)│
                        └──────────────┬──────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │   Local-First IndexedDB     │
                        │    (Auto-Save Debounced)    │
                        └─────────────────────────────┘
```

## 2. Component Hierarchy
- `App.tsx`: Root state orchestrator, modal switcher, toast dispatcher, keyboard shortcuts router.
- `PlannerCanvas.tsx`: React Flow canvas wrapper rendering custom nodes and custom edges.
- `BaseNode.tsx`: Uniform node container featuring:
  - Header with Category tag, Editable title, Version indicator, Status pill, and Collapse toggle.
  - Outdated notification banner.
  - Markdown body (`NodeMarkdownBody.tsx`) with inline double-click editing.
  - Action toolbar (`NodeToolbar.tsx`) with AI operations menu, duplicate, and delete.
- `CustomEdge.tsx`: Custom bezier edge rendering relationship badges (`derived-from`, `implements`, `dependency`).
- Modals:
  - `GeneratePlanModal.tsx`: Synthesizes 12-node graph from natural language idea.
  - `AIDiffModal.tsx`: Visual line diff viewer with Accept/Reject.
  - `ValidationDrawer.tsx`: Project health scorecard & automated fixes.
  - `ExportModal.tsx`: Hub for `AI_CONTEXT.md`, agent instructions, task cards, and project JSON.
  - `SettingsModal.tsx`: API key and model selector.
  - `CommandPalette.tsx`: `Ctrl + K` fast launcher.

## 3. Data Flow & Traversal
- **Upstream Traversal**: When an AI action is executed on node `X`, `getUpstreamContext(X)` traverses incoming edges to collect parents (e.g. Idea, PRD, Architecture) in topological priority order to feed into Gemini.
- **Downstream Impact Analysis**: When node `X` has its content modified, `getDownstreamImpactedNodes(X)` walks outgoing edges and marks downstream nodes as `outdated`.

## 4. Local-First Storage
- IndexedDB database `PlannerDB` with stores `projects` and `active_project`.
- Falls back to `localStorage` if IndexedDB is blocked.
- Auto-save is debounced at 800ms.
