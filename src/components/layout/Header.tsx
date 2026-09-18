import React from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Settings,
  Command,
  Layers,
  Plus,
  Palette,
  FileText,
  Activity,
  Terminal
} from 'lucide-react';
import { SaveStatus } from '../../hooks/useAutoSave';
import { HealthReport } from '../../types/validation';
import { ActiveView } from '../../App';

interface HeaderProps {
  projectName: string;
  onUpdateProjectName: (name: string) => void;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenGenerateModal: () => void;
  onOpenValidation: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  healthReport: HealthReport;
  activeView: ActiveView;
  onSetActiveView: (view: ActiveView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onUpdateProjectName,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenGenerateModal,
  onOpenValidation,
  onOpenExport,
  onOpenSettings,
  onOpenCommandPalette,
  onToggleSidebar,
  healthReport,
  activeView,
  onSetActiveView
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(projectName);

  React.useEffect(() => {
    setNameDraft(projectName);
  }, [projectName]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (nameDraft.trim()) {
      onUpdateProjectName(nameDraft.trim());
    }
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
  };

  const viewTabs: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'canvas', label: 'Canvas', icon: Layers },
    { id: 'design', label: 'Design Intent', icon: Palette },
    { id: 'handoff', label: 'Handoff', icon: FileText }
  ];

  return (
    <header className="h-13 border-b border-white/[0.08] bg-[#06070a]/95 backdrop-blur-md px-3.5 flex items-center justify-between gap-3 z-40 relative shadow-sm">
      {/* Left: App Logo, Sidebar toggle, and Project Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {activeView === 'canvas' && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition cursor-pointer"
            title="Toggle Node Library"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2 select-none">
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs tracking-tight text-white">PRD</span>
            <span className="font-normal text-xs text-slate-400">Planner</span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v3.3
            </span>
          </div>
        </div>

        <span className="text-white/10 hidden sm:inline">&bull;</span>

        <div className="flex items-center gap-1.5 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="bg-[#090a0f] border border-emerald-500/50 rounded px-2 py-0.5 text-xs text-slate-100 font-medium focus:outline-none w-44 font-mono shadow-inner"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-xs text-slate-300 hover:text-white truncate cursor-pointer transition font-mono"
              title="Double click to rename project"
            >
              {projectName}
            </h2>
          )}
        </div>

        {/* Save Status Indicator */}
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 ml-1">
          {saveStatus === 'saving' && (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-400">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-400 hidden lg:inline">Saved</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400">Failed</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Developer Tools Segmented Pill View Switcher */}
      <div className="flex items-center gap-1 bg-[#090a0f] border border-white/[0.08] rounded-lg p-0.5 text-xs">
        {viewTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSetActiveView(id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              activeView === id
                ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${activeView === id ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Right: Actions & Telemetry */}
      <div className="flex items-center gap-1.5">
        {/* Undo/Redo — only useful on canvas */}
        {activeView === 'canvas' && (
          <div className="flex items-center gap-0.5 mr-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 text-xs border border-white/[0.08] transition cursor-pointer"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-mono">Ctrl+K</span>
        </button>

        {/* Generate Project Plan CTA */}
        <button
          onClick={onOpenGenerateModal}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20 transition cursor-pointer"
          title="Synthesize a full planning graph from an idea"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Synthesize Plan</span>
        </button>

        {/* Project Planning Readiness & Telemetry */}
        <button
          onClick={onOpenValidation}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition cursor-pointer ${getHealthBadgeColor(
            healthReport.score
          )}`}
          title="Project Planning Readiness Breakdown"
        >
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="font-mono">{healthReport.score}%</span>
        </button>

        {/* Export Hub */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] transition cursor-pointer"
          title="Export AI Coding Handoff, Design Brief & Context files"
        >
          <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Export Hub</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] text-slate-400 hover:text-slate-200 transition cursor-pointer"
          title="Settings & AI Providers"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
