import React, { useState } from 'react';
import { Sparkles, X, AlertCircle, Loader2 } from 'lucide-react';
import { AIProviderConfig } from '../../types/ai';
import { getAIProvider } from '../../services/ai/provider';
import { buildProjectPlanSynthesisPrompt, SYSTEM_ARCHITECT_PROMPT } from '../../services/ai/prompts';
import { PlannerNode, NodeType } from '../../types/node';
import { PlannerEdge } from '../../types/edge';
import { NODE_CONFIGS } from '../../constants/nodeConfigs';

interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiConfig: AIProviderConfig;
  onApplySynthesizedGraph: (title: string, description: string, nodes: PlannerNode[], edges: PlannerEdge[]) => void;
}

export const GeneratePlanModal: React.FC<GeneratePlanModalProps> = ({
  isOpen,
  onClose,
  aiConfig,
  onApplySynthesizedGraph
}) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const exampleIdeas = [
    'A developer portfolio generator that parses GitHub repositories and exports an interactive static site.',
    'A local-first document expiry and warranty tracker with reminder notifications and receipt scanning.',
    'A real-time collaborative code review tool with syntax diffing, inline discussion, and automated linter integration.'
  ];

  const handleGenerate = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a project idea description.');
      return;
    }

    if (!aiConfig.apiKey?.trim()) {
      setErrorMsg('Please configure your Gemini API Key in Settings first.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    try {
      const provider = getAIProvider(aiConfig);
      const prompt = buildProjectPlanSynthesisPrompt(trimmed);

      const response = await provider.generate(
        {
          prompt,
          systemInstruction: SYSTEM_ARCHITECT_PROMPT,
          temperature: 0.3
        },
        aiConfig
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

      // Layout coordinates for the 12 nodes
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
          const type: NodeType = n.type || 'custom';
          const config = NODE_CONFIGS[type] || NODE_CONFIGS.custom;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
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
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Project Concept / Problem Statement
            </label>
            <textarea
              rows={5}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              placeholder="Describe your project idea in detail: target users, key functionality, architecture desires, or problem to solve..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
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

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-950/60 border border-rose-800 rounded-lg p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
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
  );
};
