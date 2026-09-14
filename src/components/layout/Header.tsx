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
  FileText
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
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
    if (score >= 50) return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/80';
  };

  const viewTabs: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'canvas', label: 'Canvas', icon: Layers },
    { id: 'design', label: 'Design Intent', icon: Palette },
    { id: 'handoff', label: 'Handoff', icon: FileText }
  ];

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between gap-4 z-40 relative">
      {/* Left: App Logo, Sidebar toggle, and Project Title */}
      <div className="flex items-center gap-3 min-w-0">
        {activeView === 'canvas' && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Toggle Node Library"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
          <Layers className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-sm tracking-tight text-slate-100 hidden sm:inline">
            Planner
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>

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
              className="bg-slate-950 border border-brand-500 rounded px-2 py-0.5 text-xs text-slate-100 font-medium focus:outline-none w-48"
            />
          ) : (
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-slate-300 hover:text-slate-100 truncate cursor-pointer transition"
              title="Double click to rename project"
            >
              {projectName}
            </h2>
          )}
        </div>

        {/* Save Status Indicator */}
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 ml-2">
          {saveStatus === 'saving' && (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-400">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-400 hidden md:inline">Saved ✓</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400">Save failed</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: View Switcher Tabs */}
      <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-800 rounded-lg p-1 text-xs">
        {viewTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSetActiveView(id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeView === id
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo — only useful on canvas */}
        {activeView === 'canvas' && (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-700/60 transition cursor-pointer"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3 h-3" />
          <span className="text-[11px] font-mono">Ctrl+K</span>
        </button>

        {/* Generate Project Plan CTA */}
        <button
          onClick={onOpenGenerateModal}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-md shadow-brand-500/20 transition cursor-pointer"
          title="Generate a full planning graph from an idea"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Generate Plan</span>
        </button>

        {/* Project Planning Readiness & Validation */}
        <button
          onClick={onOpenValidation}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${getHealthBadgeColor(
            healthReport.score
          )}`}
          title="Project Planning Readiness Breakdown"
        >
          <span>Readiness:</span>
          <span className="font-bold">{healthReport.score}%</span>
        </button>

        {/* Export Hub */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          title="Export AI Coding Handoff, Design Brief & Context files"
        >
          <FileCode2 className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden lg:inline">Export Hub</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          title="Settings & API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

