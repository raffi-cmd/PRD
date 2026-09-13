# AI Coding Agent Context - Planner Repository

## Repository Overview
This repository contains **Planner**, a high-performance Visual AI Project Planner built with Vite, React 18/19, TypeScript, Tailwind CSS, and `@xyflow/react`.

## Key Directory Layout
- `src/types/`: Strict TypeScript declarations for nodes, edges, project schemas, AI contracts, and validation rules.
- `src/constants/nodeConfigs.ts`: Configuration metadata, categories, icons, and default templates for all 20+ node types.
- `src/services/ai/`: Multi-provider abstraction (`provider.ts`), Gemini API client (`gemini.ts`), graph traversal context builder (`contextBuilder.ts`), and prompt templates (`prompts.ts`).
- `src/services/storage/`: IndexedDB client (`indexedDb.ts`) and JSON import/export parser (`projectIO.ts`).
- `src/services/validation/`: Graph validation and health auditing engine (`validator.ts`).
- `src/services/export/`: Generators for `AI_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and task files.
- `src/hooks/`: State management with undo/redo (`usePlannerStore.ts`), debounced auto-save (`useAutoSave.ts`), and keyboard shortcuts (`useKeyboardShortcuts.ts`).
- `src/components/`: Modular UI components divided into canvas, nodes, modals, sidebar, and layout.
- `tests/`: Automated unit and integration tests using Vitest.

## Engineering Standards
- Strict typing with zero `any` casts in core service logic.
- Atomic state transitions with undo/redo history preservation.
- Local-first privacy: API keys never leave the client unless explicitly routed to the AI endpoint.
