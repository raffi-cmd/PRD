import React from 'react';
import { HealthReport, ValidationFinding } from '../../types/validation';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles, Wrench, ShieldCheck, CheckSquare, Layers } from 'lucide-react';

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
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Planning Readiness & Verification</h2>
              <p className="text-[11px] text-slate-400">
                Evaluation of project completeness across Product, UX, Design Intent & Tech
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

        {/* Overall Readiness Score Overview */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Overall Planning Readiness</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-100">{report.score}%</span>
              <span className="text-[11px] text-slate-500">
                ({report.passedChecks}/{report.totalChecks} criteria satisfied)
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

        {/* Category Breakdown Bars */}
        {report.categories && report.categories.length > 0 && (
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/20 space-y-2.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Readiness by Dimension
            </span>
            <div className="space-y-2">
              {report.categories.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.title}</span>
                    <span className="font-mono text-[11px] text-slate-400">{cat.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        cat.score >= 80 ? 'bg-emerald-400' : cat.score >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content: Checks & Findings */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Findings List */}
          {report.findings.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-2">
                Unresolved Ambiguities & Issues ({report.findings.length})
              </h3>
              <div className="space-y-2.5">
                {report.findings.map((f) => {
                  const badge = getSeverityBadge(f.severity);
                  return (
                    <div
                      key={f.id}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {badge.icon}
                          <div>
                            <h4 className="font-medium text-slate-200">{f.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {f.message}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${badge.badge}`}
                        >
                          {f.severity}
                        </span>
                      </div>

                      {f.fixActionLabel && onFixWithAI && (
                        <div className="flex justify-end pt-1 border-t border-slate-800/60">
                          <button
                            onClick={() => onFixWithAI(f)}
                            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-300 border border-slate-700/80 transition cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-brand-400" />
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

          {/* Structural Checklist */}
          <div>
            <h3 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-2">
              Readiness Verification Checklist
            </h3>
            <div className="space-y-1.5">
              {report.checks.map((c) => (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition ${
                    c.passed
                      ? 'border-slate-800/80 bg-slate-950/30 text-slate-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5">
                    {c.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${c.passed ? 'text-slate-200' : 'text-slate-400'}`}>
                        {c.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{c.weight}pts</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{c.detail}</p>
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
