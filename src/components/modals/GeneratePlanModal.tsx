import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  AlertCircle,
  Loader2,
  Settings,
  RefreshCw,
  Zap,
  Wand2,
  Layers,
  ChevronDown
} from 'lucide-react';
import { AIProviderConfig, AIProviderType } from '../../types/ai';
import { getAIProvider } from '../../services/ai/provider';
import { buildProjectPlanSynthesisPrompt, SYSTEM_ARCHITECT_PROMPT } from '../../services/ai/prompts';
import { PlannerNode } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { NODE_CONFIGS } from '../../constants/nodeConfigs';
import { ModelAutocomplete } from '../common/ModelAutocomplete';
import { AI_PROVIDER_PRESETS } from '../../constants/aiModels';
import { getStoredApiKey } from '../../services/storage/projectIO';

interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiConfig: AIProviderConfig;
  onOpenSettings: () => void;
  onApplySynthesizedGraph: (title: string, description: string, nodes: PlannerNode[], edges: PlannerEdge[]) => void;
}

export const GeneratePlanModal: React.FC<GeneratePlanModalProps> = ({
  isOpen,
  onClose,
  aiConfig,
  onOpenSettings,
  onApplySynthesizedGraph
}) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [activeProvider, setActiveProvider] = useState<AIProviderType>(aiConfig.provider || 'gemini');
  const [selectedModel, setSelectedModel] = useState(aiConfig.model || 'gemini-2.0-flash');
  const [showModelOverride, setShowModelOverride] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize state whenever modal opens or aiConfig changes
  useEffect(() => {
    if (isOpen) {
      const currentProv = aiConfig.provider || 'gemini';
      setActiveProvider(currentProv);
      setSelectedModel(aiConfig.model || AI_PROVIDER_PRESETS[currentProv].defaultModel);
      setErrorMsg('');
    }
  }, [isOpen, aiConfig.provider, aiConfig.model]);

  if (!isOpen) return null;

  const activeProviderPreset = AI_PROVIDER_PRESETS[activeProvider];

  const handleSwitchProvider = (p: AIProviderType) => {
    setActiveProvider(p);
    const storedModel = localStorage.getItem(`vibe_${p}_model`);
    setSelectedModel(storedModel || AI_PROVIDER_PRESETS[p].defaultModel);
    setErrorMsg('');
  };

  const exampleIdeas = [
    'A developer portfolio generator that parses GitHub repositories and exports an interactive static site.',
    'A local-first document expiry and warranty tracker with reminder notifications and receipt scanning.',
    'A real-time collaborative code review tool with syntax diffing, inline discussion, and automated linter integration.'
  ];

  // Helper to generate an offline/fallback synthesized graph if API is overloaded or key is missing
  const generateOfflineFallback = (concept: string) => {
    const now = new Date().toISOString();
    const titleMatch = concept.match(/(?:aplikasi|app|kalkulator|generator|tool|platform|system)\s+([^.]+)/i);
    const projectTitle = titleMatch
      ? titleMatch[0].charAt(0).toUpperCase() + titleMatch[0].slice(1)
      : 'Architected System Plan';

    const coordinateMap: Record<string, { x: number; y: number }> = {
      'node-idea': { x: 450, y: 40 },
      'node-requirements': { x: 450, y: 280 },
      'node-prd': { x: 450, y: 520 },
      'node-uiux': { x: 60, y: 760 },
      'node-arch': { x: 450, y: 760 },
      'node-techstack': { x: 840, y: 760 },
      'node-datamodel': { x: 260, y: 1040 },
      'node-api': { x: 640, y: 1040 },
      'node-tasks': { x: 450, y: 1320 },
      'node-testplan': { x: 450, y: 1600 },
      'node-validation': { x: 450, y: 1880 },
      'node-aicontext': { x: 450, y: 2160 }
    };

    const nodeTemplates = [
      {
        id: 'node-idea',
        type: 'idea' as const,
        title: 'Project Vision & Concept',
        content: `## Vision\n${concept}\n\n## Value Proposition\nProvide immediate, accurate utility with high precision and clean visual feedback.`
      },
      {
        id: 'node-requirements',
        type: 'requirements' as const,
        title: 'Core System Requirements',
        content: `## Functional Requirements\n- FR-1: Interactive input parameters with instant reactive calculation.\n- FR-2: Detailed breakdown formula display and unit conversion.\n- FR-3: Local storage persistence for past calculations.\n- FR-4: Export summary to PDF/Markdown.`
      },
      {
        id: 'node-prd',
        type: 'prd' as const,
        title: 'Product Requirements Document (PRD)',
        content: `## 1. Problem Statement\nUsers need an effortless, reliable calculation tool that minimizes guesswork and waste.\n\n## 2. User Personas\nEngineers, contractors, homeowners, and developers.\n\n## 3. Success Metrics\nCalculation latency < 50ms, zero calculation errors, high mobile responsiveness.`
      },
      {
        id: 'node-uiux',
        type: 'ui_ux' as const,
        title: 'UX & Visual Flow',
        content: `## Screen Architecture\n1. Dual-column desktop layout (Input parameters on left, Live calculated receipt on right).\n2. Step-by-step mobile sheet navigation.\n3. High contrast feedback badges for material estimates.`
      },
      {
        id: 'node-arch',
        type: 'architecture' as const,
        title: 'System Architecture',
        content: `## Architecture Diagram\nReact UI Layer -> Calculation Engine -> LocalStorage Cache -> Export Module`
      },
      {
        id: 'node-techstack',
        type: 'tech_stack' as const,
        title: 'Technology Stack',
        content: `## Frontend\n- React + TypeScript\n- Tailwind CSS\n- Lucide Icons\n- Vite Bundler`
      },
      {
        id: 'node-datamodel',
        type: 'data_model' as const,
        title: 'Data Models & Schemas',
        content: `## CalculationSchema\n\`\`\`typescript\ninterface CalculationInput {\n  length: number;\n  height: number;\n  coats: number;\n  coveragePerLiter: number;\n}\ninterface EstimateResult {\n  paintLiters: number;\n  cementBags: number;\n  sandVolumeM3: number;\n  estimatedCost: number;\n}\n\`\`\``
      },
      {
        id: 'node-api',
        type: 'api' as const,
        title: 'API Contracts & Interfaces',
        content: `## Internal Calculation API\n- calculatePaintRequirement(input)\n- calculateMasonryMaterials(area, thickness)\n- exportCalculationReport(data)`
      },
      {
        id: 'node-tasks',
        type: 'tasks' as const,
        title: 'Implementation Task Breakdown',
        content: `## Phase 1: Core Calculation Engine\n- [ ] Task 1: Setup React + Vite + Tailwind scaffolding\n- [ ] Task 2: Implement reactive formula calculation service\n- [ ] Task 3: Build interactive input controls with validation\n- [ ] Task 4: Build live results dashboard\n- [ ] Task 5: Add LocalStorage export history`
      },
      {
        id: 'node-testplan',
        type: 'test_plan' as const,
        title: 'Verification & QA Plan',
        content: `## Unit Tests\n- Formula edge cases (zero values, negative inputs, large numbers)\n- Unit conversion accuracy`
      },
      {
        id: 'node-validation',
        type: 'validation' as const,
        title: 'Quality & Design Gate',
        content: `## Quality Checklist\n- [x] High contrast readability\n- [x] Zero layout shifts during calculation\n- [x] Mobile friendly touch targets`
      },
      {
        id: 'node-aicontext',
        type: 'ai_context' as const,
        title: 'AI Coding Context Handoff',
        content: `## AI Instructions\nBuild this application with clean separation between the mathematical formula logic and UI presentation.`
      }
    ];

    const nodes: PlannerNode[] = nodeTemplates.map((nt) => {
      const config = NODE_CONFIGS[nt.type] || NODE_CONFIGS.custom;
      return {
        id: nt.id,
        type: 'plannerNode',
        position: coordinateMap[nt.id] || { x: 100, y: 100 },
        data: {
          id: nt.id,
          type: nt.type,
          title: nt.title,
          content: nt.content,
          status: 'draft',
          category: config.category,
          version: 1,
          versions: [
            {
              version: 1,
              title: nt.title,
              content: nt.content,
              timestamp: now,
              summary: 'Synthesized graph from concept'
            }
          ],
          createdAt: now,
          updatedAt: now
        }
      };
    });

    const edges: PlannerEdge[] = [
      { id: 'edge-1', source: 'node-idea', target: 'node-requirements', type: 'customEdge', data: { type: 'derived-from' } },
      { id: 'edge-2', source: 'node-requirements', target: 'node-prd', type: 'customEdge', data: { type: 'derived-from' } },
      { id: 'edge-3', source: 'node-prd', target: 'node-uiux', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-4', source: 'node-prd', target: 'node-arch', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-5', source: 'node-prd', target: 'node-techstack', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-6', source: 'node-arch', target: 'node-datamodel', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-7', source: 'node-arch', target: 'node-api', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-8', source: 'node-datamodel', target: 'node-tasks', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-9', source: 'node-api', target: 'node-tasks', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-10', source: 'node-tasks', target: 'node-testplan', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-11', source: 'node-testplan', target: 'node-validation', type: 'customEdge', data: { type: 'dependency' } },
      { id: 'edge-12', source: 'node-validation', target: 'node-aicontext', type: 'customEdge', data: { type: 'dependency' } }
    ];

    onApplySynthesizedGraph(projectTitle, concept, nodes, edges);
    onClose();
  };

  const handleGenerate = async (overrideModel?: string) => {
    const trimmed = ideaInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a project idea description.');
      return;
    }

    const currentKey =
      activeProvider === aiConfig.provider && aiConfig.apiKey?.trim()
        ? aiConfig.apiKey.trim()
        : getStoredApiKey(activeProvider);

    const isLocal = aiConfig.baseUrl?.includes('localhost') || aiConfig.baseUrl?.includes('127.0.0.1');

    if (!currentKey && !isLocal && activeProvider !== 'custom') {
      setErrorMsg(`Please configure your ${activeProviderPreset.name} API Key in Settings first.`);
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    const modelToUse = (overrideModel || selectedModel || activeProviderPreset.defaultModel).trim();

    try {
      const activeConfig: AIProviderConfig = {
        ...aiConfig,
        provider: activeProvider,
        apiKey: currentKey,
        model: modelToUse
      };

      const provider = getAIProvider(activeConfig);
      const prompt = buildProjectPlanSynthesisPrompt(trimmed);

      const response = await provider.generate(
        {
          prompt,
          systemInstruction: SYSTEM_ARCHITECT_PROMPT,
          model: modelToUse,
          temperature: 0.3
        },
        activeConfig
      );

      // Extract JSON from response
      let cleanText = response.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);

      // Construct nodes with calculated layout coordinates
      const synthesizedNodes: PlannerNode[] = [];
      const now = new Date().toISOString();

      const coordinateMap: Record<string, { x: number; y: number }> = {
        'node-idea': { x: 450, y: 40 },
        'node-requirements': { x: 450, y: 280 },
        'node-prd': { x: 450, y: 520 },
        'node-uiux': { x: 60, y: 760 },
        'node-arch': { x: 450, y: 760 },
        'node-techstack': { x: 840, y: 760 },
        'node-datamodel': { x: 260, y: 1040 },
        'node-api': { x: 640, y: 1040 },
        'node-tasks': { x: 450, y: 1320 },
        'node-testplan': { x: 450, y: 1600 },
        'node-validation': { x: 450, y: 1880 },
        'node-aicontext': { x: 450, y: 2160 }
      };

      if (Array.isArray(parsed.nodes)) {
        parsed.nodes.forEach((n: any, idx: number) => {
          const type = n.type || 'custom';
          const config = (NODE_CONFIGS as any)[type] || NODE_CONFIGS.custom;
          const pos = coordinateMap[n.id] || {
            x: 100 + (idx % 3) * 380,
            y: 100 + Math.floor(idx / 3) * 320
          };

          synthesizedNodes.push({
            id: n.id || `node-${idx}-${Date.now()}`,
            type: 'plannerNode',
            position: pos,
            data: {
              id: n.id || `node-${idx}`,
              type,
              title: n.title || config.defaultTitle,
              content: n.content || config.defaultContent,
              status: n.status || 'draft',
              category: config.category,
              version: 1,
              versions: [
                {
                  version: 1,
                  title: n.title || config.defaultTitle,
                  content: n.content || config.defaultContent,
                  timestamp: now,
                  summary: 'Synthesized from project idea'
                }
              ],
              createdAt: now,
              updatedAt: now
            }
          });
        });
      }

      const synthesizedEdges: PlannerEdge[] = [];
      if (Array.isArray(parsed.edges)) {
        parsed.edges.forEach((e: any, idx: number) => {
          if (e.source && e.target) {
            synthesizedEdges.push({
              id: `edge-syn-${idx}-${Date.now()}`,
              source: e.source,
              target: e.target,
              type: 'customEdge',
              data: { type: e.type || 'dependency' }
            });
          }
        });
      }

      onApplySynthesizedGraph(
        parsed.projectTitle || 'AI Generated Project Plan',
        parsed.projectDescription || trimmed,
        synthesizedNodes,
        synthesizedEdges
      );

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Generation failed: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const providersList: AIProviderType[] = ['gemini', 'openai', 'anthropic', 'openrouter', 'custom'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Synthesize Project Plan</h2>
              <p className="text-[11px] text-slate-400">
                Transform a concept into an end-to-end connected planning graph
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Active AI Provider & Model Bar */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <div className="truncate">
                  <span className="text-slate-400 font-medium">Provider: </span>
                  <span className="text-slate-100 font-bold">{activeProviderPreset.name}</span>
                  <span className="text-slate-600 mx-1.5">&bull;</span>
                  <span className="font-mono text-brand-300 font-semibold">{selectedModel}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModelOverride(!showModelOverride)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700/80 transition cursor-pointer font-medium"
                >
                  <span>{showModelOverride ? 'Close Model Menu' : 'Change Model'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showModelOverride ? 'rotate-180' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80 transition cursor-pointer"
                  title="Open AI Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Model Selector when opened */}
            {showModelOverride && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                {/* Switch provider buttons */}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Switch Provider:</label>
                  <div className="flex flex-wrap gap-1">
                    {providersList.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSwitchProvider(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                          activeProvider === p
                            ? 'bg-brand-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {p === 'openai' ? 'ChatGPT' : p === 'anthropic' ? 'Claude' : p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model input autocomplete */}
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Model Name (Type freely or choose):
                  </label>
                  <ModelAutocomplete
                    value={selectedModel}
                    onChange={(m) => {
                      setSelectedModel(m);
                      localStorage.setItem(`vibe_${activeProvider}_model`, m);
                    }}
                    provider={activeProvider}
                    placeholder={`e.g. ${activeProviderPreset.defaultModel}`}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Project Concept / Problem Statement
            </label>
            <textarea
              rows={5}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              placeholder="Describe your project idea in detail: target users, key functionality, architecture desires, or problem to solve..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Quick Idea Starters */}
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block mb-1.5">
              Quick Concept Starters
            </span>
            <div className="space-y-1.5">
              {exampleIdeas.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setIdeaInput(ex)}
                  className="w-full text-left p-2 rounded bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer line-clamp-1"
                >
                  &bull; {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner with Smart Remediation Actions */}
          {errorMsg && (
            <div className="bg-rose-950/60 border border-rose-800 rounded-lg p-3.5 text-xs text-rose-300 space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>

              {/* Action Buttons to recover immediately */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 text-[11px] text-rose-100 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>

                {activeProvider === 'gemini' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModel('gemini-1.5-flash');
                      handleGenerate('gemini-1.5-flash');
                    }}
                    disabled={isGenerating}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-amber-300 transition cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Try Gemini 1.5 Flash</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 transition cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Change Key in Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateOfflineFallback(ideaInput)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-[11px] text-emerald-300 transition cursor-pointer"
                  title="Generate plan directly without external AI call"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Generate Offline Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => generateOfflineFallback(ideaInput || 'Web Application Planner')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
            title="Instant structured synthesis without AI API"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Instant Template</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-semibold shadow-lg shadow-brand-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
