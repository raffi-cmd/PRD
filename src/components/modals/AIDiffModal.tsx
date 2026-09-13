import React from 'react';
import { AIProposal } from '../../types/ai';
import { Check, X, Wand2, ArrowRight } from 'lucide-react';

interface AIDiffModalProps {
  proposal: AIProposal | null;
  onAccept: (proposal: AIProposal) => void;
  onReject: () => void;
}

export const AIDiffModal: React.FC<AIDiffModalProps> = ({ proposal, onAccept, onReject }) => {
  if (!proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">AI Proposal Preview</h2>
              <p className="text-[11px] text-slate-400">
                Review proposed modifications for &ldquo;{proposal.originalTitle}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onReject}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff View */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-1 bg-slate-950">
          {proposal.diffLines.map((line, idx) => {
            if (line.type === 'added') {
              return (
                <div key={idx} className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded flex items-start gap-2">
                  <span className="text-emerald-500 select-none">+</span>
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'removed') {
              return (
                <div key={idx} className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded flex items-start gap-2">
                  <span className="text-rose-500 select-none">-</span>
                  <span className="whitespace-pre-wrap line-through opacity-80">{line.text}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="text-slate-400 px-2 py-0.5 flex items-start gap-2">
                <span className="text-slate-600 select-none">&nbsp;</span>
                <span className="whitespace-pre-wrap">{line.text}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {proposal.summary}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReject}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject Proposal</span>
            </button>
            <button
              onClick={() => onAccept(proposal)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Accept Changes (v+1)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
