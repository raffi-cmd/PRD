# Planner: Visual AI Project Planner & AI Coding Planner

Transform raw software concepts into structured, visual, validated, and coding-agent-ready project blueprints.

![Planner Canvas](https://raw.githubusercontent.com/raffi-cmd/planner/main/preview.png)

---

## 🌟 Why Planner Exists

Building complex software with AI coding agents (Claude Code, Cursor, Antigravity, Cline) fails when prompts are vague, unstructured, or scattered.

**Planner** replaces monolithic text PRDs and unorganized notes with a **visual, node-based planning graph**:
- Every planning artifact is a typed, editable card on an infinite canvas.
- Artifacts connect to each other via semantic relationships (`derived-from`, `implements`, `dependency`).
- Changing an upstream specification automatically detects and flags downstream impact.
- Graph-aware AI generates specifications using only relevant connected upstream context.
- With one click, compile the entire visual graph into deterministic coding-agent instructions: `AI_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and atomic `tasks/TASK-XXX.md` cards.

---

## 🚀 Key Features

### 1. Interactive Node-Based Canvas
- Pan, zoom, multi-select, drag, resize, and snap-to-grid (`@xyflow/react`).
- Auto-save with debounced persistence to IndexedDB ("Saving..." &rarr; "Saved ✓").
- Full **Undo / Redo** support (`Ctrl + Z`, `Ctrl + Shift + Z` / `Ctrl + Y`).
- Command Palette (`Ctrl + K`) for rapid navigation.

### 2. 20+ Specialized Planning Node Types
- **Planning**: Idea, Requirements, PRD, User Stories, Scope, Assumptions.
- **Technical**: System Architecture, Tech Stack, Data Model, API Specification, Folder Structure.
- **Product / Design**: UI / UX Specs, User Flow, Component Inventory.
- **Execution**: Development Tasks & Phases, Dependencies, Test Plan, Acceptance Criteria, Pre-flight Validation.
- **AI / Custom**: AI Coding Context, Custom Notes.

### 3. Smart Context Traversal & AI Planning Assistant
- Pluggable AI provider architecture supporting Google Gemini (`gemini-3.7-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
- **Graph Traversal**: AI inspects connected upstream dependencies (e.g. generating an API node automatically includes PRD and Data Model context).
- Node operations: **AI Improve**, **AI Expand**, **AI Simplify**, **AI Review**, **Find Missing Info**.
- **AI Diff Preview**: Side-by-side / unified diff viewer with **[Accept Changes]** and **[Reject]** to prevent accidental overwrites.

### 4. Downstream Impact Analysis
- Modifying an upstream specification (e.g., updating the PRD) automatically flags downstream connected nodes (Architecture, Data Model, Tasks) with an `⚠ Outdated` banner.

### 5. Project Health & Graph Validation Engine
- Rule-based graph auditor calculating a 0–100% health score.
- Detects missing foundational requirements, unassigned tasks, outdated nodes, and circular dependency loops.
- Actionable **"Fix with AI"** suggestions.

### 6. Coding Agent Export Hub
- **`AI_CONTEXT.md`**: Master specification compiling the complete graph state.
- **`AGENTS.md`**: Universal coding agent instructions.
- **`CLAUDE.md`**: Tailored guidelines for Claude Code.
- **`GEMINI.md`**: Directives for Google Antigravity & Gemini CLI.
- **`tasks/TASK-XXX.md`**: Individual atomic task cards ready for dispatch.
- **`planner-project.json`**: Portable, versioned JSON export and import.

---

## 🛠️ Installation & Getting Started

### Prerequisites
- Node.js v18+ (Node v20+ recommended)
- npm or pnpm

### Quick Start
```bash
# Clone repository
git clone https://github.com/raffi-cmd/planner.git
cd planner

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment & API Setup

1. Open Planner in your browser.
2. Click the **Settings** (gear icon) in the header.
3. Enter your **Gemini API Key** (obtain free from [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Keys are stored locally in your browser storage (`localStorage`) and are never sent to external servers.

Alternatively, create a `.env` file based on `.env.example`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + K` | Open Command Palette |
| `Ctrl + S` | Force Save Project |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo |
| `Delete` | Delete selected node |
| `Esc` | Close any open modal |

---

## 🧪 Testing & Verification

```bash
# Run unit & integration test suite
npm test

# Run production build
npm run build
```

---

## 📄 License
MIT License.
