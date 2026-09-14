import React, { useState } from 'react';
import { ProjectSchema } from '../../types/project';
import {
  generateAllExportFiles,
  generateAIContextMarkdown
} from '../../services/export/aiContextExport';
import { exportProjectToJSON, parseProjectJSON } from '../../services/storage/projectIO';
import { X, Copy, Download, Check, FileCode, FolderArchive, Upload } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectSchema;
  onImportProject: (imported: ProjectSchema) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onImportProject
}) => {
  const [activeTab, setActiveTab] = useState<'handoff' | 'design_brief' | 'ux_spec' | 'ai_context' | 'agents' | 'tasks' | 'json'>('handoff');
  const [selectedAgentFile, setSelectedAgentFile] = useState<'AGENTS.md' | 'CLAUDE.md' | 'GEMINI.md'>('AGENTS.md');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const bundle = generateAllExportFiles(project);
  const projectJson = exportProjectToJSON(project);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      alert('Clipboard copy failed.');
    }
  };

  const downloadFile = (filename: string, content: string, mimeType = 'text/markdown') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseProjectJSON(text);
        onImportProject(parsed);
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setImportError(msg);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Coding Agent Context & Export Hub</h2>
              <p className="text-[11px] text-slate-400">
                Authoritative specifications for Claude Code, Cursor, Antigravity, and Cline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 gap-1 text-xs overflow-x-auto">
          {([
            { id: 'handoff', label: 'HANDOFF.md ⭐' },
            { id: 'design_brief', label: 'DESIGN_BRIEF.md' },
            { id: 'ux_spec', label: 'UX_SPEC.md' },
            { id: 'ai_context', label: 'AI_CONTEXT.md' },
            { id: 'agents', label: 'Agent Directives' },
            { id: 'tasks', label: `Tasks (${Object.keys(bundle.tasks).length})` },
            { id: 'json', label: 'JSON Import/Export' }
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-2.5 px-3 font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === id
                  ? 'border-brand-400 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
          {/* TAB: HANDOFF.md */}
          {activeTab === 'handoff' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Complete AI Coding Handoff: Product Context + UX + Design Intent + Visual Verification Loop + Design Judgment Gate.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bundle['HANDOFF.md'], 'handoff')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'handoff' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'handoff' ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('HANDOFF.md', bundle['HANDOFF.md'])}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {bundle['HANDOFF.md']}
              </pre>
            </div>
          )}

          {/* TAB: DESIGN_BRIEF.md */}
          {activeTab === 'design_brief' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Synthesized Design Intent Brief: North Star, metaphor, hierarchy, anti-patterns & visual acceptance criteria.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bundle['DESIGN_BRIEF.md'], 'design_brief')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'design_brief' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'design_brief' ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('DESIGN_BRIEF.md', bundle['DESIGN_BRIEF.md'])}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {bundle['DESIGN_BRIEF.md']}
              </pre>
            </div>
          )}

          {/* TAB: UX_SPEC.md */}
          {activeTab === 'ux_spec' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  User journey, screen flows, information architecture, and behavioral state guidelines.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bundle['UX_SPEC.md'], 'ux_spec')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'ux_spec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'ux_spec' ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('UX_SPEC.md', bundle['UX_SPEC.md'])}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {bundle['UX_SPEC.md']}
              </pre>
            </div>
          )}

          {/* TAB: AI_CONTEXT.md */}
          {activeTab === 'ai_context' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Universal context file capturing the entire graph state.
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bundle['AI_CONTEXT.md'], 'ai_context')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === 'ai_context' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'ai_context' ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('AI_CONTEXT.md', bundle['AI_CONTEXT.md'])}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {bundle['AI_CONTEXT.md']}
              </pre>
            </div>
          )}

          {/* TAB 2: AGENT DIRECTIVES */}
          {activeTab === 'agents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  {(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'] as const).map((agentFile) => (
                    <button
                      key={agentFile}
                      onClick={() => setSelectedAgentFile(agentFile)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                        selectedAgentFile === agentFile
                          ? 'bg-brand-500/20 text-brand-300 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {agentFile}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bundle[selectedAgentFile], selectedAgentFile)}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedKey === selectedAgentFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === selectedAgentFile ? 'Copied!' : 'Copy File'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile(selectedAgentFile, bundle[selectedAgentFile])}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {bundle[selectedAgentFile]}
              </pre>
            </div>
          )}

          {/* TAB 3: TASK CARDS */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <span className="text-slate-400 text-[11px] block">
                Individual task definition files extracted from your plan for dispatching to coding agents.
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {Object.entries(bundle.tasks).map(([filename, taskContent]) => (
                  <div
                    key={filename}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-brand-400 block mb-1">
                        {filename}
                      </span>
                      <pre className="text-[10px] text-slate-400 font-mono line-clamp-4 leading-relaxed">
                        {taskContent}
                      </pre>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => copyToClipboard(taskContent, filename)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        {copiedKey === filename ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => downloadFile(filename, taskContent)}
                        className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JSON IMPORT / EXPORT */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">
                  Export or restore full project schema including node coordinates, versions, and connections.
                </span>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    onClick={() => downloadFile('planner-project.json', projectJson, 'application/json')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {importError && (
                <div className="bg-rose-950/60 border border-rose-800 rounded-lg p-2.5 text-xs text-rose-300">
                  {importError}
                </div>
              )}

              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {projectJson}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
