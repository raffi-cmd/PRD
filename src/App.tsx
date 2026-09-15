import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePlannerStore } from './hooks/usePlannerStore';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { NodePalette } from './components/sidebar/NodePalette';
import { ImpactPanel } from './components/sidebar/ImpactPanel';
import { PlannerCanvas } from './components/canvas/PlannerCanvas';
import { GeneratePlanModal } from './components/modals/GeneratePlanModal';
import { AIDiffModal } from './components/modals/AIDiffModal';
import { ValidationDrawer } from './components/modals/ValidationDrawer';
import { ExportModal } from './components/modals/ExportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { DesignIntentModule } from './components/design/DesignIntentModule';
import { HandoffView } from './components/handoff/HandoffView';

import { NodeType, PlannerNode } from './types/node';
import { PlannerEdge } from './types/edge';
import { AIProposal, AIProviderConfig } from './types/ai';
import { ValidationFinding } from './types/validation';
import { NodeAIActionType } from './components/nodes/NodeToolbar';

import { validateProjectGraph } from './services/validation/validator';
import { getUpstreamContext } from './services/ai/contextBuilder';
import { getAIProvider, computeLineDiff } from './services/ai/provider';
import { buildContextualNodePrompt, SYSTEM_ARCHITECT_PROMPT } from './services/ai/prompts';
import { loadLastActiveProject, saveProjectToDB } from './services/storage/indexedDb';
import { generateAICodingHandoffMarkdown } from './services/export/aiCodingHandoffGenerator';

export type ActiveView = 'canvas' | 'design' | 'handoff';

export const App: React.FC = () => {
  const store = usePlannerStore();
  const {
    project,
    setProject,
    addNode,
    deleteNode,
    canUndo,
    canRedo,
    undo,
    redo,
    selectedNodeId,
    impactedNodeIds,
    applyProposal,
    updateDesignIntent
  } = store;

  // Auto-save state
  const saveStatus = useAutoSave(project, project.settings.autoSave);

  // Active view (canvas / design intent / handoff preview)
  const [activeView, setActiveView] = useState<ActiveView>('canvas');

  // Modals & Panels state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeProposal, setActiveProposal] = useState<AIProposal | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved project from IndexedDB on initial mount
  useEffect(() => {
    async function initFromStorage() {
      try {
        const saved = await loadLastActiveProject();
        if (saved && saved.nodes && saved.nodes.length > 0) {
          setProject(saved);
        }
      } catch (err) {
        console.warn('Could not restore from IndexedDB:', err);
      }
    }
    initFromStorage();
  }, [setProject]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Planning Readiness report calculation
  const healthReport = useMemo(
    () => validateProjectGraph(project.nodes, project.edges, project.designIntent),
    [project.nodes, project.edges, project.designIntent]
  );

  // Downstream impacted nodes calculation
  const impactedNodes = useMemo(() => {
    return project.nodes.filter((n) => impactedNodeIds.includes(n.id));
  }, [project.nodes, impactedNodeIds]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: async () => {
      await saveProjectToDB(project);
      showToast('Project saved successfully ✓');
    },
    onUndo: undo,
    onRedo: redo,
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
    onDeleteSelected: () => {
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    },
    onEscape: () => {
      setIsGenerateModalOpen(false);
      setIsValidationOpen(false);
      setIsExportOpen(false);
      setIsSettingsOpen(false);
      setIsCommandPaletteOpen(false);
      setActiveProposal(null);
    }
  });

  // Handle AI actions on specific nodes (Improve, Expand, Simplify, Review, Missing Info)
  const handleTriggerAIForNode = useCallback(
    async (nodeId: string, action: NodeAIActionType) => {
      const targetNode = project.nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const apiKey = project.settings.aiConfig.apiKey?.trim();
      const isLocal = project.settings.aiConfig.baseUrl?.includes('localhost') || project.settings.aiConfig.baseUrl?.includes('127.0.0.1');
      if (!apiKey && !isLocal && project.settings.aiConfig.provider !== 'custom') {
        setIsSettingsOpen(true);
        const provName = project.settings.aiConfig.provider === 'openai' ? 'OpenAI / ChatGPT' : project.settings.aiConfig.provider === 'anthropic' ? 'Anthropic Claude' : project.settings.aiConfig.provider === 'openrouter' ? 'OpenRouter' : 'Gemini';
        showToast(`Please configure your ${provName} API key in settings.`);
        return;
      }

      setIsGeneratingAI(true);
      showToast(`Generating ${action} for "${targetNode.data.title}"...`);

      try {
        // Collect upstream context snippets
        const contextSnippets = getUpstreamContext(nodeId, project.nodes, project.edges);

        let instruction = '';
        switch (action) {
          case 'improve':
            instruction = 'Improve and sharpen this specification for clarity, completeness, and technical precision. Fix ambiguities and make it actionable.';
            break;
          case 'expand':
            instruction = 'Significantly expand this specification. Enumerate edge cases, detailed fields, security considerations, and comprehensive technical steps.';
            break;
          case 'simplify':
            instruction = 'Simplify this specification. Strip unnecessary verbosity, eliminate fluff, and make the requirements concise, punchy, and dense.';
            break;
          case 'review':
            instruction = 'Critique this specification. Add a section evaluating strengths, hidden assumptions, potential architectural risks, and recommendations.';
            break;
          case 'missing-info':
            instruction = 'Identify all missing information, unaddressed requirements, or unspecified decisions needed to implement this module.';
            break;
        }

        const prompt = buildContextualNodePrompt(
          targetNode.data.type,
          targetNode.data.title,
          instruction,
          targetNode.data.content,
          contextSnippets
        );

        const provider = getAIProvider(project.settings.aiConfig);
        const response = await provider.generate(
          {
            prompt,
            systemInstruction: SYSTEM_ARCHITECT_PROMPT,
            temperature: project.settings.aiConfig.temperature ?? 0.4
          },
          project.settings.aiConfig
        );

        const proposedContent = response.text.trim();
        const diffLines = computeLineDiff(targetNode.data.content, proposedContent);

        setActiveProposal({
          nodeId,
          originalTitle: targetNode.data.title,
          originalContent: targetNode.data.content,
          proposedTitle: targetNode.data.title,
          proposedContent,
          diffLines,
          summary: `AI ${action} proposal based on ${contextSnippets.length} upstream connected nodes.`
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast(`AI Error: ${msg}`);
      } finally {
        setIsGeneratingAI(false);
      }
    },
    [project, showToast]
  );

  // Fix issues with AI from validation drawer
  const handleFixWithAI = useCallback(
    (finding: ValidationFinding) => {
      setIsValidationOpen(false);

      if (finding.id === 'finding-idea') {
        addNode('idea', 'Project Vision', '## Goal\nDefine the core product concept.');
        showToast('Added Idea node.');
      } else if (finding.id === 'finding-reqs') {
        const ideaNode = project.nodes.find((n) => n.data.type === 'idea');
        const reqId = addNode('requirements', 'System Requirements', '## Functional Requirements\n- FR-1: ...');
        if (ideaNode) store.addEdge(ideaNode.id, reqId, 'derived-from');
        showToast('Added Requirements node.');
      } else if (finding.id === 'finding-prd') {
        const reqNode = project.nodes.find((n) => n.data.type === 'requirements');
        const prdId = addNode('prd', 'Product Requirements Document (PRD)', '## 1. Overview\n\n## 2. Core Features');
        if (reqNode) store.addEdge(reqNode.id, prdId, 'derived-from');
        showToast('Added PRD node.');
      } else if (finding.id === 'finding-arch') {
        const prdNode = project.nodes.find((n) => n.data.type === 'prd');
        const archId = addNode('architecture', 'System Architecture', '## Overview\n- Client: SPA\n- Server: API\n- DB: SQLite');
        if (prdNode) store.addEdge(prdNode.id, archId, 'implements');
        showToast('Added Architecture node.');
      } else if (finding.id === 'finding-tasks') {
        const archNode = project.nodes.find((n) => n.data.type === 'architecture');
        const taskId = addNode('tasks', 'Execution Tasks', '### Phase 1: Setup\n- [ ] TASK-001: Project structure');
        if (archNode) store.addEdge(archNode.id, taskId, 'implements');
        showToast('Added Tasks node.');
      } else {
        setIsGenerateModalOpen(true);
      }
    },
    [addNode, project.nodes, store, showToast]
  );

  // Apply synthesized project plan
  const handleApplySynthesizedGraph = useCallback(
    (title: string, description: string, nodes: PlannerNode[], edges: PlannerEdge[]) => {
      setProject({
        ...project,
        project: {
          ...project.project,
          name: title,
          description,
          updatedAt: new Date().toISOString()
        },
        nodes,
        edges
      });
      showToast('Synthesized complete project plan graph ✓');
    },
    [project, setProject, showToast]
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* App Header */}
      <Header
        projectName={project.project.name}
        onUpdateProjectName={(name) =>
          setProject({
            ...project,
            project: { ...project.project, name, updatedAt: new Date().toISOString() }
          })
        }
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        healthReport={healthReport}
        activeView={activeView}
        onSetActiveView={setActiveView}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas View */}
        {activeView === 'canvas' && (
          <>
            {/* Collapsible Node Catalog Sidebar */}
            <NodePalette
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onAddNode={(type: NodeType) => {
                addNode(type);
                showToast(`Added ${type} node to canvas`);
              }}
            />

            {/* Node Canvas */}
            <main className="flex-1 relative h-full">
              <PlannerCanvas store={store} onTriggerAIForNode={handleTriggerAIForNode} />

              {/* Toast Notification */}
              {toastMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg shadow-2xl backdrop-blur animate-in fade-in duration-150">
                  {toastMessage}
                </div>
              )}

              {/* Downstream Impact Alert Panel */}
              <ImpactPanel
                impactedNodes={impactedNodes}
                onSelectNode={(id) => store.setSelectedNodeId(id)}
                onClear={() => {
                  for (const n of impactedNodes) {
                    store.dismissOutdatedStatus(n.id);
                  }
                }}
              />
            </main>
          </>
        )}

        {/* Design Intent View */}
        {activeView === 'design' && (
          <main className="flex-1 relative h-full overflow-hidden">
            <DesignIntentModule
              project={project}
              onUpdateDesignIntent={updateDesignIntent}
            />
            {toastMessage && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg shadow-2xl backdrop-blur">
                {toastMessage}
              </div>
            )}
          </main>
        )}

        {/* Handoff View */}
        {activeView === 'handoff' && (
          <main className="flex-1 relative h-full overflow-hidden">
            <HandoffView
              project={project}
              onOpenExportModal={() => setIsExportOpen(true)}
              onShowToast={showToast}
            />
            {toastMessage && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg shadow-2xl backdrop-blur">
                {toastMessage}
              </div>
            )}
          </main>
        )}
      </div>

      {/* Modals */}
      <GeneratePlanModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        aiConfig={project.settings.aiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onApplySynthesizedGraph={handleApplySynthesizedGraph}
      />

      <AIDiffModal
        proposal={activeProposal}
        onAccept={(prop) => {
          applyProposal(prop);
          setActiveProposal(null);
          showToast('Changes accepted and applied ✓');
        }}
        onReject={() => {
          setActiveProposal(null);
          showToast('Proposal rejected.');
        }}
      />

      <ValidationDrawer
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        report={healthReport}
        onFixWithAI={handleFixWithAI}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        onImportProject={(imported) => {
          setProject(imported);
          showToast('Project imported successfully ✓');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={project.settings.aiConfig}
        onSaveConfig={(newCfg: AIProviderConfig) => {
          setProject({
            ...project,
            settings: { ...project.settings, aiConfig: newCfg }
          });
          showToast('AI Settings updated ✓');
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddNode={(type) => addNode(type)}
        onOpenGeneratePlan={() => setIsGenerateModalOpen(true)}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUndo={undo}
        onRedo={redo}
      />
    </div>
  );
};
