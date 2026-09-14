import React, { useState } from 'react';
import { ProjectSchema } from '../../types/project';
import { generateAICodingHandoffMarkdown } from '../../services/export/aiCodingHandoffGenerator';
import { generateDesignBriefMarkdown } from '../../services/export/designBriefGenerator';
import { generateUXSpecMarkdown } from '../../services/export/uxSpecGenerator';
import {
  FileText,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Compass,
  Palette,
  Layout,
  Type,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  Zap,
  Tag,
  Eye,
  CheckSquare
} from 'lucide-react';

interface HandoffViewProps {
  project: ProjectSchema;
  onOpenExportModal: () => void;
  onShowToast: (msg: string) => void;
}

export const HandoffView: React.FC<HandoffViewProps> = ({
  project,
  onOpenExportModal,
  onShowToast
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const handoffMarkdown = generateAICodingHandoffMarkdown(project);
  const designBriefMarkdown = generateDesignBriefMarkdown(project);
  const uxSpecMarkdown = generateUXSpecMarkdown(project);

  const design = project.designIntent;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAction(label);
      onShowToast(`Copied ${label} to clipboard ✓`);
      setTimeout(() => setCopiedAction(null), 2000);
    } catch {
      onShowToast('Clipboard copy failed');
    }
  };

  const handleDownload = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${filename} ✓`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Action Header Bar */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              AI Coding Handoff & Specification Hub
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono border border-brand-500/30">
                Ready for AI
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Authoritative, ambiguity-reducing specification for OpenCode, Cursor, Cline, Codex, and Antigravity.
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Preview vs Raw Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                viewMode === 'preview'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Technical Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                viewMode === 'raw'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          {/* Quick Copy Buttons */}
          <button
            type="button"
            onClick={() => handleCopy(handoffMarkdown, 'HANDOFF.md')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            {copiedAction === 'HANDOFF.md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Handoff</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(designBriefMarkdown, 'DESIGN_BRIEF.md')}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition cursor-pointer"
          >
            {copiedAction === 'DESIGN_BRIEF.md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Design Brief</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('HANDOFF.md', handoffMarkdown)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 transition cursor-pointer shadow-md shadow-brand-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer border border-slate-800"
            title="Open Full Export Hub"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* MODE 1: HUMAN READABLE STRUCTURED TECHNICAL PREVIEW */}
        {viewMode === 'preview' && (
          <div className="space-y-6">
            {/* 1. PRODUCT CONTEXT HERO */}
            <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
                  1. Product Definition & Vision
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {project.project.name} (v{project.project.version})
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-100">{project.project.name}</h1>
              <p className="text-xs text-slate-300 leading-relaxed">{project.project.description || 'No description provided.'}</p>
            </section>

            {/* 2. DESIGN NORTH STAR & METAPHOR */}
            <section className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-violet-950/20 border border-violet-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> 2. Design North Star & Metaphor
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {design?.northStar?.status?.toUpperCase() || 'DEFAULT'}
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-violet-500/30">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Design North Star Statement:</span>
                <p className="text-sm font-medium text-slate-100 leading-relaxed italic">
                  "{design?.northStar?.statement || 'Technical, calm, information-dense, and precise.'}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono">Visual Direction:</span>
                  <p className="font-semibold text-cyan-300 capitalize">{design?.visualDirection?.direction || 'Editorial utility'}</p>
                  {design?.visualDirection?.rationale && (
                    <p className="text-[11px] text-slate-400 italic">"{design.visualDirection.rationale}"</p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono">Visual Metaphor:</span>
                  <p className="font-semibold text-emerald-300">{design?.visualMetaphor?.metaphor || 'Developer terminal'}</p>
                  {design?.visualMetaphor?.impact && (
                    <p className="text-[11px] text-slate-400 italic">"{design.visualMetaphor.impact}"</p>
                  )}
                </div>
              </div>
            </section>

            {/* 3. LAYOUT, TYPOGRAPHY & COLOR */}
            <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block border-b border-slate-800/80 pb-2">
                3. Layout, Typography & Color Direction
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-purple-300 font-semibold uppercase block">Layout Intent</span>
                  <div><span className="text-slate-500">Desktop:</span> <span className="text-slate-300">{design?.layoutStrategy?.desktop || '2-Column Split'}</span></div>
                  <div><span className="text-slate-500">Mobile:</span> <span className="text-slate-300">{design?.layoutStrategy?.mobile || 'Single Column'}</span></div>
                  <div><span className="text-slate-500">Focal:</span> <span className="text-slate-300">{design?.layoutStrategy?.focalPoint || 'Primary Output'}</span></div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-sky-300 font-semibold uppercase block">Typography Rules</span>
                  <div><span className="text-slate-500">Headings:</span> <span className="text-slate-300">{design?.typography?.display || 'Geometric Sans'}</span></div>
                  <div><span className="text-slate-500">Body:</span> <span className="text-slate-300">{design?.typography?.body || 'System Sans'}</span></div>
                  <div><span className="text-slate-500">Data/Code:</span> <span className="text-slate-300 font-mono text-[11px]">{design?.typography?.numericData || 'Tabular Monospace'}</span></div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-300 font-semibold uppercase block">Color & Density</span>
                  <div><span className="text-slate-500">Primary:</span> <span className="text-slate-300">{design?.color?.primaryRole || 'Deep slate'}</span></div>
                  <div><span className="text-slate-500">Accent:</span> <span className="text-slate-300">{design?.color?.accentRole || 'Teal highlight'}</span></div>
                  <div><span className="text-slate-500">Density:</span> <span className="text-emerald-300 font-mono uppercase">{design?.density?.level || 'BALANCED'}</span></div>
                </div>
              </div>
            </section>

            {/* 4. ANTI-PATTERNS & ACCEPTANCE CRITERIA */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Anti-Patterns */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/40 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> 4. Forbidden Anti-Patterns
                </span>
                <ul className="space-y-1.5 text-xs text-rose-200/90">
                  {design?.antiPatterns?.forbidden?.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Acceptance Criteria */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5. Visual Acceptance Criteria
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-200/90">
                  {design?.visualAcceptanceCriteria?.criteria?.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 5. 15-STEP VERIFICATION LOOP & CRITIQUE GATE */}
            <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 block border-b border-slate-800/80 pb-2">
                6. 15-Step Visual Verification Protocol for Coding Agents
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">1. Inspect existing project</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">2. Understand current code</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">3. Plan atomic changes</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">4. Implement modularly</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">5. Run local dev server</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">6. Render Desktop (~1280px)</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">7. Render Mobile (~390px)</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">8. Inspect visual output</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">9. Identify visual flaw</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">10. Fix high-impact problem</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">11. Re-render viewports</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">12. Iterate if needed</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">13. Run automated tests</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">14. Run typecheck & build</div>
                <div className="p-2.5 rounded bg-slate-950 border border-brand-500/40 text-brand-300 font-bold">15. Final visual sign-off</div>
              </div>
            </section>
          </div>
        )}

        {/* MODE 2: RAW MARKDOWN VIEW */}
        {viewMode === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                HANDOFF.md — Direct raw specification text
              </span>
              <button
                type="button"
                onClick={() => handleCopy(handoffMarkdown, 'HANDOFF.md')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer text-[11px]"
              >
                {copiedAction === 'HANDOFF.md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAction === 'HANDOFF.md' ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {handoffMarkdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
