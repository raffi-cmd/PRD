import React, { useState } from 'react';
import { ProjectSchema, DesignIntentData, DecisionStatus } from '../../types/project';
import { VisualReferencesManager } from './VisualReferencesManager';
import {
  Palette,
  Sparkles,
  ShieldAlert,
  Layers,
  Layout,
  Type,
  Maximize2,
  CheckCircle2,
  Plus,
  Trash2,
  Sliders,
  Smartphone,
  Eye,
  HelpCircle,
  Zap,
  Tag,
  Compass,
  AlertTriangle,
  FileCheck2,
  Image as ImageIcon
} from 'lucide-react';

interface DesignIntentModuleProps {
  project: ProjectSchema;
  onUpdateDesignIntent: (updated: DesignIntentData) => void;
}

const DIRECTION_PRESETS = [
  'editorial utility',
  'technical documentation',
  'industrial interface',
  'financial terminal',
  'Japanese minimal',
  'playful educational',
  'premium commerce',
  'brutalist utility'
];

const INTERACTION_PHILOSOPHIES = [
  'immediate feedback',
  'direct manipulation',
  'keyboard-friendly',
  'tactile feel',
  'quiet & unobtrusive',
  'progressive disclosure',
  'deliberate transitions',
  'minimal motion'
];

const ANTI_PATTERN_PRESETS = [
  'generic SaaS dashboard clichés',
  'excessive rounded cards / card soup',
  'gradient-heavy UI without semantic meaning',
  'glassmorphism or heavy blur effects',
  'decorative icons lacking purpose',
  'meaningless pill badges on every label',
  'fake AI sparkles and floating animations'
];

export const DesignIntentModule: React.FC<DesignIntentModuleProps> = ({
  project,
  onUpdateDesignIntent
}) => {
  const design = project.designIntent || {
    projectType: 'new_project',
    northStar: {
      statement: 'Technical, calm, information-dense, and precise — like a professional engineering workspace.',
      status: 'default',
      aiSuggestion: 'Compact utility tool with sharp hierarchy, restrained colors, and high data density.'
    },
    visualDirection: { direction: 'editorial utility', rationale: '', status: 'default' },
    visualMetaphor: { metaphor: '', impact: '', status: 'default' },
    visualReferences: [],
    layoutStrategy: { desktop: '', mobile: '', relationships: '', status: 'default' },
    typography: { communicationStyle: 'dense and utilitarian', details: '', status: 'default' },
    color: { primaryRole: '', accentRole: '', surfaceCharacter: '', contrastExpectations: '', status: 'default' },
    components: { generalCharacter: 'restrained and functional', status: 'default' },
    interaction: { philosophy: ['immediate feedback'], motionAndStates: '', status: 'default' },
    density: { level: 'balanced', rules: '', status: 'default' },
    responsiveIntent: { breakpointRules: '', mobilePriority: '', status: 'default' },
    accessibility: { requirements: [], status: 'default' },
    antiPatterns: { forbidden: [], status: 'default' },
    visualAcceptanceCriteria: { criteria: [], status: 'default' },
    constraints: { technical: [], component: [], responsive: [], accessibility: [], thingsToAvoid: [] },
    critiqueChecklist: [],
    provenance: {}
  };

  const [activeTab, setActiveTab] = useState<
    | 'north_star'
    | 'references'
    | 'layout_typography'
    | 'components_motion'
    | 'antipatterns_critique'
  >('north_star');

  const [newAntiPattern, setNewAntiPattern] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [newA11y, setNewA11y] = useState('');
  const [isEditingNorthStar, setIsEditingNorthStar] = useState(false);
  const [northStarDraft, setNorthStarDraft] = useState(design.northStar?.statement || '');

  const updateField = (updater: (draft: DesignIntentData) => void, fieldKey?: string) => {
    const draft: DesignIntentData = JSON.parse(JSON.stringify(design));
    updater(draft);
    if (fieldKey) {
      draft.provenance = draft.provenance || {};
      draft.provenance[fieldKey] = 'user_decided';
    }
    onUpdateDesignIntent(draft);
  };

  const renderStatusBadge = (status?: DecisionStatus) => {
    const currentStatus = status || 'default';
    if (currentStatus === 'user_decided') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1 font-mono">
          <Tag className="w-2.5 h-2.5" /> USER DECISION
        </span>
      );
    }
    if (currentStatus === 'ai_suggested') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 font-mono">
          <Sparkles className="w-2.5 h-2.5 text-violet-400" /> AI SUGGESTION
        </span>
      );
    }
    if (currentStatus === 'undecided') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
          UNDECIDED
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
        DEFAULT
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Design Intent & Visual Direction System
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                PRD V2
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Establish North Star, Visual Metaphor, Hierarchy, and Anti-Patterns so AI coding agents build distinct, intentional software.
            </p>
          </div>
        </div>

        {/* 5-Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {[
            { id: 'north_star', label: '1. North Star & Direction', icon: Compass },
            { id: 'references', label: '2. Visual References', icon: ImageIcon },
            { id: 'layout_typography', label: '3. Layout & Typography', icon: Layout },
            { id: 'components_motion', label: '4. Components & Motion', icon: Sliders },
            { id: 'antipatterns_critique', label: '5. Anti-Patterns & Critique', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* TAB 1: NORTH STAR & DIRECTION */}
        {activeTab === 'north_star' && (
          <div className="space-y-6">
            {/* 3.1 DESIGN NORTH STAR HERO CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-violet-950/30 border border-violet-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-300">
                    Design North Star
                  </span>
                </div>
                {renderStatusBadge(design.northStar?.status)}
              </div>

              {!isEditingNorthStar ? (
                <div className="space-y-2">
                  <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed italic">
                    "{design.northStar?.statement || 'Technical, calm, information-dense, and precise — like a professional engineering workspace.'}"
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setNorthStarDraft(design.northStar?.statement || '');
                        setIsEditingNorthStar(true);
                      }}
                      className="text-xs px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                    >
                      Edit Statement
                    </button>
                    {design.northStar?.aiSuggestion && design.northStar?.status !== 'user_decided' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateField((d) => {
                            d.northStar.statement = d.northStar.aiSuggestion || '';
                            d.northStar.status = 'user_decided';
                          }, 'northStar');
                        }}
                        className="text-xs px-3 py-1 rounded-md bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Accept AI Suggestion</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={northStarDraft}
                    onChange={(e) => setNorthStarDraft(e.target.value)}
                    placeholder="Describe in one sentence what this product should look and feel like..."
                    className="w-full p-3 rounded-lg bg-slate-950 border border-violet-500/50 text-sm text-slate-100 focus:outline-none leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNorthStar(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateField((d) => {
                          d.northStar.statement = northStarDraft.trim();
                          d.northStar.status = 'user_decided';
                        }, 'northStar');
                        setIsEditingNorthStar(false);
                      }}
                      className="px-3 py-1 rounded-md bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-xs transition cursor-pointer"
                    >
                      Save North Star
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3.2 VISUAL DIRECTION */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    Visual Direction Posture
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select the high-level aesthetic posture and design language.
                  </p>
                </div>
                {renderStatusBadge(design.visualDirection?.status)}
              </div>

              <div className="flex flex-wrap gap-2">
                {DIRECTION_PRESETS.map((preset) => {
                  const isSelected = design.visualDirection?.direction === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        updateField((d) => {
                          d.visualDirection.direction = preset;
                          d.visualDirection.status = 'user_decided';
                        }, 'visualDirection')
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer capitalize font-medium ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Visual Direction Rationale:</label>
                <textarea
                  rows={2}
                  value={design.visualDirection?.rationale || ''}
                  onChange={(e) =>
                    updateField((d) => {
                      d.visualDirection.rationale = e.target.value;
                      d.visualDirection.status = 'user_decided';
                    }, 'visualDirection')
                  }
                  placeholder="Explain why this aesthetic direction fits the product purpose..."
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400 leading-relaxed"
                />
              </div>
            </div>

            {/* 3.3 VISUAL METAPHOR */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Visual Metaphor & Real-World Anchor
                  </label>
                  <p className="text-[11px] text-slate-400">
                    A physical reference (e.g. thermal receipt, blueprint, terminal, laboratory) that shapes hierarchy, density, and typography.
                  </p>
                </div>
                {renderStatusBadge(design.visualMetaphor?.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Visual Metaphor Reference:</label>
                  <input
                    type="text"
                    value={design.visualMetaphor?.metaphor || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.visualMetaphor.metaphor = e.target.value;
                        d.visualMetaphor.status = 'user_decided';
                      }, 'visualMetaphor')
                    }
                    placeholder='e.g., "Indonesian SPBU thermal receipt + roadside board"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Impact on UI & Components:</label>
                  <input
                    type="text"
                    value={design.visualMetaphor?.impact || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.visualMetaphor.impact = e.target.value;
                        d.visualMetaphor.status = 'user_decided';
                      }, 'visualMetaphor')
                    }
                    placeholder='e.g., "Receipt-like monospace rows for totals; high contrast board headers"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL REFERENCES */}
        {activeTab === 'references' && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <VisualReferencesManager
              references={design.visualReferences || []}
              onChange={(updated) =>
                updateField((d) => {
                  d.visualReferences = updated;
                }, 'visualReferences')
              }
            />
          </div>
        )}

        {/* TAB 3: LAYOUT & TYPOGRAPHY */}
        {activeTab === 'layout_typography' && (
          <div className="space-y-6">
            {/* 3.5 Layout Strategy */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-purple-400" />
                    Layout Strategy & Viewport Behavior
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Define grid structure, container limits, focal points, and breakpoint relationships.
                  </p>
                </div>
                {renderStatusBadge(design.layoutStrategy?.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Desktop Layout Intent:</label>
                  <input
                    type="text"
                    value={design.layoutStrategy?.desktop || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.layoutStrategy.desktop = e.target.value;
                        d.layoutStrategy.status = 'user_decided';
                      }, 'layoutStrategy')
                    }
                    placeholder='e.g., "Two-column split view (Input on left, live calculated output on right)"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Mobile Layout Intent:</label>
                  <input
                    type="text"
                    value={design.layoutStrategy?.mobile || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.layoutStrategy.mobile = e.target.value;
                        d.layoutStrategy.status = 'user_decided';
                      }, 'layoutStrategy')
                    }
                    placeholder='e.g., "Sequential input step -> Sticky Total Result bar -> History stack"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Primary Focal Point:</label>
                  <input
                    type="text"
                    value={design.layoutStrategy?.focalPoint || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.layoutStrategy.focalPoint = e.target.value;
                        d.layoutStrategy.status = 'user_decided';
                      }, 'layoutStrategy')
                    }
                    placeholder='e.g., "Primary calculated output / Central planning canvas"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Whitespace Philosophy:</label>
                  <input
                    type="text"
                    value={design.layoutStrategy?.whitespacePhilosophy || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.layoutStrategy.whitespacePhilosophy = e.target.value;
                        d.layoutStrategy.status = 'user_decided';
                      }, 'layoutStrategy')
                    }
                    placeholder='e.g., "Intentional around primary content, minimal between related controls"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>
            </div>

            {/* 3.6 Typography */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Type className="w-4 h-4 text-sky-400" />
                  Typography Direction & Hierarchy
                </label>
                {renderStatusBadge(design.typography?.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Display / Headings:</label>
                  <input
                    type="text"
                    value={design.typography?.display || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.typography.display = e.target.value;
                        d.typography.status = 'user_decided';
                      }, 'typography')
                    }
                    placeholder="e.g., Clean geometric sans"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Body Typography:</label>
                  <input
                    type="text"
                    value={design.typography?.body || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.typography.body = e.target.value;
                        d.typography.status = 'user_decided';
                      }, 'typography')
                    }
                    placeholder="e.g., Neutral system sans"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Numeric / Data Typography:</label>
                  <input
                    type="text"
                    value={design.typography?.numericData || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.typography.numericData = e.target.value;
                        d.typography.status = 'user_decided';
                      }, 'typography')
                    }
                    placeholder="e.g., Tabular monospace"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Selective Monospace Usage Rule:</label>
                <input
                  type="text"
                  value={design.typography?.monospaceUsage || ''}
                  onChange={(e) =>
                    updateField((d) => {
                      d.typography.monospaceUsage = e.target.value;
                      d.typography.status = 'user_decided';
                    }, 'typography')
                  }
                  placeholder='e.g., "Use monospace selectively for data rows, IDs, and code blocks only."'
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* 3.7 Color Roles */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Color Direction & Contrast Intent
                </label>
                {renderStatusBadge(design.color?.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Primary Background Role:</label>
                  <input
                    type="text"
                    value={design.color?.primaryRole || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.color.primaryRole = e.target.value;
                        d.color.status = 'user_decided';
                      }, 'color')
                    }
                    placeholder="e.g., Deep slate background with crisp light text"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Accent & Highlight Role:</label>
                  <input
                    type="text"
                    value={design.color?.accentRole || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.color.accentRole = e.target.value;
                        d.color.status = 'user_decided';
                      }, 'color')
                    }
                    placeholder="e.g., Teal/cyan reserved exclusively for active states"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPONENTS & MOTION */}
        {activeTab === 'components_motion' && (
          <div className="space-y-6">
            {/* 3.8 Component Character */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-pink-400" />
                  Component Character & Styling Rules
                </label>
                {renderStatusBadge(design.components?.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Borders & Elevation Treatment:</label>
                  <input
                    type="text"
                    value={design.components?.borderTreatment || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.components.borderTreatment = e.target.value;
                        d.components.status = 'user_decided';
                      }, 'components')
                    }
                    placeholder='e.g., "Subtle 1px border; minimal elevation"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Radius Scale:</label>
                  <input
                    type="text"
                    value={design.components?.radius || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.components.radius = e.target.value;
                        d.components.status = 'user_decided';
                      }, 'components')
                    }
                    placeholder='e.g., "Small to medium (rounded-lg), avoid pill soup"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Cards Guidelines:</label>
                  <input
                    type="text"
                    value={design.components?.cards || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.components.cards = e.target.value;
                        d.components.status = 'user_decided';
                      }, 'components')
                    }
                    placeholder='e.g., "Use sparingly; avoid card soup"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Buttons & Inputs Guidelines:</label>
                  <input
                    type="text"
                    value={design.components?.buttons || ''}
                    onChange={(e) =>
                      updateField((d) => {
                        d.components.buttons = e.target.value;
                        d.components.status = 'user_decided';
                      }, 'components')
                    }
                    placeholder='e.g., "Primary dominates secondary; utility inputs"'
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* 3.9 & 3.10 Density & Motion */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Density & Motion Philosophy
                </label>
                {renderStatusBadge(design.density?.status)}
              </div>

              <div className="flex gap-3 items-center">
                <span className="text-xs text-slate-300 font-medium">Density:</span>
                {(['compact', 'balanced', 'spacious'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() =>
                      updateField((d) => {
                        d.density.level = lvl;
                        d.density.status = 'user_decided';
                      }, 'density')
                    }
                    className={`px-3 py-1 rounded-md text-xs font-mono border capitalize transition cursor-pointer ${
                      design.density?.level === lvl
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Motion Intensity:</label>
                <input
                  type="text"
                  value={design.interaction?.motionIntensity || ''}
                  onChange={(e) =>
                    updateField((d) => {
                      d.interaction.motionIntensity = e.target.value;
                      d.interaction.status = 'user_decided';
                    }, 'interaction')
                  }
                  placeholder='e.g., "Subtle & instantaneous (<150ms), zero decorative bounce"'
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANTI-PATTERNS & CRITIQUE */}
        {activeTab === 'antipatterns_critique' && (
          <div className="space-y-6">
            {/* 3.13 Anti-Patterns */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Forbidden Anti-Patterns (MUST NOT APPEAR)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Explicitly instruct coding AI agents what visual clichés to prevent.
                  </p>
                </div>
                {renderStatusBadge(design.antiPatterns?.status)}
              </div>

              <div className="flex flex-wrap gap-2">
                {ANTI_PATTERN_PRESETS.map((preset) => {
                  const isForbidden = design.antiPatterns?.forbidden?.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        updateField((d) => {
                          const current = d.antiPatterns?.forbidden || [];
                          if (isForbidden) {
                            d.antiPatterns.forbidden = current.filter((f) => f !== preset);
                          } else {
                            d.antiPatterns.forbidden = [...current, preset];
                          }
                          d.antiPatterns.status = 'user_decided';
                        }, 'antiPatterns')
                      }
                      className={`px-3 py-1 rounded-lg text-xs border transition cursor-pointer ${
                        isForbidden
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isForbidden ? '✓ ' : '+ '}
                      {preset}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom anti-pattern..."
                  value={newAntiPattern}
                  onChange={(e) => setNewAntiPattern(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAntiPattern.trim()) {
                      updateField((d) => {
                        d.antiPatterns.forbidden.push(newAntiPattern.trim());
                        d.antiPatterns.status = 'user_decided';
                      }, 'antiPatterns');
                      setNewAntiPattern('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newAntiPattern.trim()) {
                      updateField((d) => {
                        d.antiPatterns.forbidden.push(newAntiPattern.trim());
                        d.antiPatterns.status = 'user_decided';
                      }, 'antiPatterns');
                      setNewAntiPattern('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3.14 Visual Acceptance Criteria */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Visual Acceptance Criteria
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Testable visual quality criteria to verify rendered browser output.
                  </p>
                </div>
                {renderStatusBadge(design.visualAcceptanceCriteria?.status)}
              </div>

              <div className="space-y-2">
                {design.visualAcceptanceCriteria?.criteria?.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <span>- {c}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateField((d) => {
                          d.visualAcceptanceCriteria.criteria.splice(idx, 1);
                          d.visualAcceptanceCriteria.status = 'user_decided';
                        }, 'visualAcceptanceCriteria')
                      }
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='e.g., "Primary focal point is immediately obvious at first glance."'
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCriterion.trim()) {
                      updateField((d) => {
                        d.visualAcceptanceCriteria.criteria.push(newCriterion.trim());
                        d.visualAcceptanceCriteria.status = 'user_decided';
                      }, 'visualAcceptanceCriteria');
                      setNewCriterion('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCriterion.trim()) {
                      updateField((d) => {
                        d.visualAcceptanceCriteria.criteria.push(newCriterion.trim());
                        d.visualAcceptanceCriteria.status = 'user_decided';
                      }, 'visualAcceptanceCriteria');
                      setNewCriterion('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Design Critique Framework Stage */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-violet-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                  Design Critique Priority Framework
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Coding agents will audit visual execution using this strict priority hierarchy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 space-y-1">
                  <span className="font-mono font-bold text-rose-300 block">P0 — Broken (Fix First!)</span>
                  <p className="text-[11px] text-rose-200/80">Layout breakage, text overflow, inaccessible touch targets, runtime crash.</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 space-y-1">
                  <span className="font-mono font-bold text-amber-300 block">P1 — Visual Hierarchy</span>
                  <p className="text-[11px] text-amber-200/80">Focal point clarity, purposeful spacing density, typography contrast.</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                  <span className="font-mono font-bold text-emerald-300 block">P2 — Micro Polish</span>
                  <p className="text-[11px] text-emerald-200/80">Subtle 1px border alignment, smooth hover feedback, quiet empty states.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
