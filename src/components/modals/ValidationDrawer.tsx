import React from 'react';
import { HealthReport, ValidationFinding } from '../../types/validation';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles, Wrench } from 'lucide-react';

interface ValidationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: HealthReport;
  onFixWithAI?: (finding: ValidationFinding) => void;
}

export const ValidationDrawer: React.FC<ValidationDrawerProps> = ({
  isOpen,
  onClose,
  report,
  onFixWithAI
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
  };

  const getSeverityBadge = (severity: 'ERROR' | 'WARNING' | 'INFO') => {
    switch (severity) {
      case 'ERROR':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
          badge: 'bg-rose-950/80 text-rose-300 border-rose-800'
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800'
        };
      case 'INFO':
        return {
          icon: <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
          badge: 'bg-sky-950/80 text-sky-300 border-sky-800'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Project Health & Validation</h2>
            <p className="text-[11px] text-slate-400">
              Rule-based structural verification for AI coding readiness
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Score Overview */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Architecture Health Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-100">{report.score}%</span>
              <span className="text-[11px] text-slate-500">
                ({report.passedChecks}/{report.totalChecks} checks passed)
              </span>
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${getScoreColor(
              report.score
            )}`}
          >
            {report.score}%
          </div>
        </div>

        {/* Content: Checks & Findings */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Findings List */}
          {report.findings.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-2">
                Issues Requiring Attention ({report.findings.length})
              </h3>
              <div className="space-y-2.5">
                {report.findings.map((f) => {
                  const badge = getSeverityBadge(f.severity);
                  return (
                    <div
                      key={f.id}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {badge.icon}
                          <span className="font-semibold text-slate-200 truncate">{f.title}</span>
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${badge.badge}`}
                        >
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{f.message}</p>
                      {f.fixActionLabel && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => onFixWithAI?.(f)}
                            className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{f.fixActionLabel}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Checklist */}
          <div>
            <h3 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-2">
              Specification Checklist
            </h3>
            <div className="space-y-1.5">
              {report.checks.map((check) => (
                <div
                  key={check.id}
                  className="p-2 rounded bg-slate-950/40 border border-slate-800/80 flex items-start gap-2 text-[11px]"
                >
                  {check.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={check.passed ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                      {check.label}
                    </span>
                    <p className="text-[10px] text-slate-500 truncate">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
