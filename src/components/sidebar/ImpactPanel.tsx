import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { PlannerNode } from '../../types/node';

interface ImpactPanelProps {
  impactedNodes: PlannerNode[];
  onSelectNode: (id: string) => void;
  onClear: () => void;
}

export const ImpactPanel: React.FC<ImpactPanelProps> = ({ impactedNodes, onSelectNode, onClear }) => {
  if (impactedNodes.length === 0) return null;

  return (
    <div className="absolute bottom-6 right-6 max-w-sm bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl p-4 z-40 backdrop-blur animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Downstream Impact Detected</span>
        </div>
        <button
          onClick={onClear}
          className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
          title="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
        Modifications in an upstream specification may affect {impactedNodes.length} connected artifact(s):
      </p>

      <div className="space-y-1.5 max-h-40 overflow-y-auto mb-3 pr-1">
        {impactedNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelectNode(n.id)}
            className="w-full text-left px-2.5 py-1.5 rounded bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 text-[11px] text-slate-200 truncate flex items-center justify-between transition cursor-pointer"
          >
            <span className="truncate">{n.data.title}</span>
            <span className="text-[10px] text-amber-400/80 font-mono shrink-0 ml-2">Review &rarr;</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClear}
          className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition cursor-pointer"
        >
          Acknowledge All
        </button>
      </div>
    </div>
  );
};
