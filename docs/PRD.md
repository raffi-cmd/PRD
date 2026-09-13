# Product Requirements Document (PRD) - Visual AI Project Planner

## 1. Product Overview
Planner is a node-based visual planning and architecture environment for software developers and engineering teams. It bridges the gap between raw product ideas and execution-ready AI coding context.

## 2. Problem Statement
Developers working with AI coding agents (Claude Code, Cursor, Antigravity, Cline) frequently face two extremes:
1. **Chat amnesia / hallucination**: Feeding vague or scattered prompts leads to inconsistent database models, broken API contracts, and unaligned implementations.
2. **Monolithic text PRDs**: Traditional 30-page PRD documents are cumbersome to review, hard to visually verify, and difficult to keep in sync as upstream decisions change.

## 3. Goals
- Provide a visual, node-based canvas for mapping the entire software planning lifecycle.
- Support 20+ specialized planning artifacts across Planning, Technical, Product/Design, and Execution domains.
- Automatically track upstream-to-downstream dependencies and flag outdated artifacts when specifications change.
- Provide intelligent, context-aware AI generation that inspects only relevant upstream nodes.
- Compile the visual planning graph into deterministic coding-agent context files (`AI_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `tasks/TASK-XXX.md`).
- Maintain human-in-the-loop control through visual diffing and version history.
- Ensure local-first privacy with browser-based IndexedDB storage.

## 4. Target Users
- Full-stack developers, software architects, product engineers, and technical founders.
- Developers leveraging AI coding assistants who need rock-solid, unambiguous context before coding.

## 5. Functional Requirements
- **Interactive Canvas**: Pan, zoom, node drag, box selection, minimap, auto-layout.
- **Node System**: 20+ node types with inline markdown editing, status lifecycle (Draft -> In Review -> Approved -> Blocked -> Complete -> Outdated), version history stack.
- **Connection System**: Typed edges (`dependency`, `derived-from`, `related-to`, `implements`, `blocks`) with automated downstream impact detection.
- **AI Planning Engine**: Pluggable AI provider abstraction (Gemini 2.5 Flash, 1.5 Flash, 1.5 Pro) with contextual prompt synthesis.
- **AI Diff Modal**: Unified/side-by-side diff preview with Accept / Reject controls.
- **Validation Engine**: Rule-based project health audit calculating a 0-100% score and flagging circular loops or missing specifications.
- **Export Hub**: Export `AI_CONTEXT.md`, universal agent instructions, atomic task files, and JSON schemas.
- **Storage**: IndexedDB persistence with debounced auto-save.

## 6. Non-Functional Requirements
- **Performance**: Capable of handling 100+ nodes on modern canvas without lag.
- **Reliability**: Debounced auto-save ensures zero data loss on accidental tab refresh.
- **Security**: Client-side API keys never committed to version control; optional backend proxy architecture recommended for production.
