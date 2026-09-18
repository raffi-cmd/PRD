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
    <div className="w-full h-full flex flex-col bg-[#040508] text-slate-100 overflow-hidden">
      {/* Top Action Header Bar */}
      <div className="p-3.5 border-b border-white/[0.08] bg-[#06070a]/95 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs tracking-wider flex items-center gap-1.5 font-mono">
              <span className="text-white font-semibold">AI Coding Handoff</span>
              <span className="text-slate-400 font-normal">& Spec Hub</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">
                READY FOR AGENTS
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Authoritative, ambiguity-reducing specification for OpenCode, Cursor, Cline, Codex, and Antigravity.
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Preview vs Raw Toggle */}
          <div className="flex items-center bg-[#090a0f] p-1 rounded-lg border border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer font-mono text-[11px] ${
                viewMode === 'preview'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Technical Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer font-mono text-[11px] ${
                viewMode === 'raw'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
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
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#090a0f] hover:bg-[#121520] text-slate-200 border border-white/[0.08] hover:border-white/[0.16] transition cursor-pointer"
          >
            {copiedAction === 'HANDOFF.md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>Copy Handoff</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(designBriefMarkdown, 'DESIGN_BRIEF.md')}
            className="hidden md:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#090a0f] hover:bg-[#121520] text-slate-300 border border-white/[0.08] hover:border-white/[0.16] transition cursor-pointer"
          >
            {copiedAction === 'DESIGN_BRIEF.md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>Copy Design Brief</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('HANDOFF.md', handoffMarkdown)}
            className="flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#040508] transition cursor-pointer shadow-glow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="p-1.5 rounded-lg bg-[#090a0f] hover:bg-[#121520] text-slate-400 hover:text-slate-200 transition cursor-pointer border border-white/[0.08]"
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
            <section className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  1. Product Definition & Vision
                </span>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                  {project.project.name} (v{project.project.version})
                </span>
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">{project.project.name}</h1>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{project.project.description || 'No description provided.'}</p>
            </section>

            {/* 2. DESIGN NORTH STAR & METAPHOR */}
            <section className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> 2. Design North Star & Metaphor
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {design?.northStar?.status?.toUpperCase() || 'DEFAULT'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#06070a] border border-indigo-500/20">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Design North Star Statement:</span>
                <p className="text-sm font-medium text-slate-100 leading-relaxed italic font-serif">
                  "{design?.northStar?.statement || 'Technical, calm, information-dense, and precise.'}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">Visual Direction:</span>
                  <p className="font-semibold text-cyan-300 capitalize">{design?.visualDirection?.direction || 'Editorial utility'}</p>
                  {design?.visualDirection?.rationale && (
                    <p className="text-[11px] text-slate-400 italic">"{design.visualDirection.rationale}"</p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">Visual Metaphor:</span>
                  <p className="font-semibold text-emerald-300">{design?.visualMetaphor?.metaphor || 'Developer terminal'}</p>
                  {design?.visualMetaphor?.impact && (
                    <p className="text-[11px] text-slate-400 italic">"{design.visualMetaphor.impact}"</p>
                  )}
                </div>
              </div>
            </section>

            {/* 3. LAYOUT, TYPOGRAPHY & COLOR */}
            <section className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.08] space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 block border-b border-white/[0.06] pb-2">
                3. Layout, Typography & Color Direction
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-mono text-purple-300 font-semibold uppercase block">Layout Intent</span>
                  <div><span className="text-slate-500">Desktop:</span> <span className="text-slate-300">{design?.layoutStrategy?.desktop || '2-Column Split'}</span></div>
                  <div><span className="text-slate-500">Mobile:</span> <span className="text-slate-300">{design?.layoutStrategy?.mobile || 'Single Column'}</span></div>
                  <div><span className="text-slate-500">Focal:</span> <span className="text-slate-300">{design?.layoutStrategy?.focalPoint || 'Primary Output'}</span></div>
                </div>

                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-mono text-sky-300 font-semibold uppercase block">Typography Rules</span>
                  <div><span className="text-slate-500">Headings:</span> <span className="text-slate-300">{design?.typography?.display || 'Geometric Sans'}</span></div>
                  <div><span className="text-slate-500">Body:</span> <span className="text-slate-300">{design?.typography?.body || 'System Sans'}</span></div>
                  <div><span className="text-slate-500">Data/Code:</span> <span className="text-slate-300 font-mono text-[11px]">{design?.typography?.numericData || 'Tabular Monospace'}</span></div>
                </div>

                <div className="p-3 rounded-xl bg-[#06070a] border border-white/[0.06] space-y-1.5">
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
              <div className="p-4 rounded-2xl bg-[#090a0f] border border-rose-500/20 space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> 4. Forbidden Anti-Patterns
                </span>
                <ul className="space-y-1.5 text-xs text-rose-200/90 font-mono">
                  {design?.antiPatterns?.forbidden?.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Acceptance Criteria */}
              <div className="p-4 rounded-2xl bg-[#090a0f] border border-emerald-500/20 space-y-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5. Visual Acceptance Criteria
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-200/90 font-mono">
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
            <section className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  6. 15-Step Visual Verification Protocol for Coding Agents
                </span>
                <span className="text-[10px] font-mono text-slate-500">AUTOMATED GATE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">01. Inspect existing project</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">02. Understand current code</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">03. Plan atomic changes</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">04. Implement modularly</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">05. Run local dev server</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">06. Render Desktop (~1280px)</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">07. Render Mobile (~390px)</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">08. Inspect visual output</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">09. Identify visual flaw</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">10. Fix high-impact problem</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">11. Re-render viewports</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">12. Iterate if needed</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">13. Run automated tests</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-white/[0.06] hover:border-white/[0.12] transition">14. Run typecheck & build</div>
                <div className="p-2.5 rounded-xl bg-[#06070a] border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-between">
                  <span>15. Final visual sign-off</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* MODE 2: RAW MARKDOWN VIEW */}
        {viewMode === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                HANDOFF.md — Direct raw specification text
              </span>
              <button
                type="button"
                onClick={() => handleCopy(handoffMarkdown, 'HANDOFF.md')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#090a0f] hover:bg-[#121520] text-slate-200 border border-white/[0.08] transition cursor-pointer font-mono text-[11px]"
              >
                {copiedAction === 'HANDOFF.md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copiedAction === 'HANDOFF.md' ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            <pre className="p-5 rounded-2xl bg-[#090a0f] border border-white/[0.08] text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {handoffMarkdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
