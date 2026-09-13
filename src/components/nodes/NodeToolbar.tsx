import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Trash2, ChevronDown, Wand2, Maximize2, Minimize2, Search, CheckSquare } from 'lucide-react';

export type NodeAIActionType = 'improve' | 'expand' | 'simplify' | 'review' | 'missing-info';

interface NodeToolbarProps {
  onAIAction: (action: NodeAIActionType) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isGenerating?: boolean;
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  onAIAction,
  onDuplicate,
  onDelete,
  isGenerating = false
}) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAIMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1 border-t border-slate-800/80 px-3 py-1.5 bg-slate-900/90 text-slate-400">
      {/* AI Assistant dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowAIMenu(!showAIMenu)}
          disabled={isGenerating}
          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition cursor-pointer disabled:opacity-50"
          title="AI Planning Actions"
        >
          <Sparkles className="w-3 h-3 text-brand-400 animate-pulse" />
          <span>{isGenerating ? 'Thinking...' : 'AI Assist'}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
        </button>

        {showAIMenu && (
          <div className="absolute left-0 bottom-full mb-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50 nodrag text-slate-200 text-xs">
            <div className="px-3 py-1 text-[10px] uppercase font-mono text-slate-500 tracking-wider">
              AI Operations
            </div>
            <button
              onClick={() => {
                setShowAIMenu(false);
                onAIAction('improve');
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Improve</span>
            </button>
            <button
              onClick={() => {
                setShowAIMenu(false);
                onAIAction('expand');
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Expand Details</span>
            </button>
            <button
              onClick={() => {
                setShowAIMenu(false);
                onAIAction('simplify');
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left transition cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Simplify</span>
            </button>
            <button
              onClick={() => {
                setShowAIMenu(false);
                onAIAction('missing-info');
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-purple-400" />
              <span>Find Missing Info</span>
            </button>
            <button
              onClick={() => {
                setShowAIMenu(false);
                onAIAction('review');
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left transition cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Review & Critique</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
        title="Duplicate node"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 rounded hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition cursor-pointer"
        title="Delete node"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
