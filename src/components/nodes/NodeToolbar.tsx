import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Trash2, ChevronDown, Wand2, Maximize2, Minimize2, Search, CheckSquare, ChevronUp } from 'lucide-react';

export type NodeAIActionType = 'improve' | 'expand' | 'simplify' | 'review' | 'missing-info';

interface NodeToolbarProps {
  onTriggerAI: (action: NodeAIActionType) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  isGenerating?: boolean;
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  onTriggerAI,
  onDuplicate,
  onDelete,
  onToggleCollapse,
  isCollapsed = false,
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
    <div className="absolute -top-9 left-0 right-0 flex items-center justify-between gap-1 px-2 py-1 bg-[#090a0f] border border-white/[0.12] rounded-lg shadow-xl text-slate-300 z-50 text-xs backdrop-blur-md">
      {/* AI Assistant dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setShowAIMenu(!showAIMenu)}
          disabled={isGenerating}
          className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer disabled:opacity-50"
          title="AI Assistant Actions"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>{isGenerating ? 'Thinking...' : 'AI Assist'}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
        </button>

        {showAIMenu && (
          <div className="absolute left-0 bottom-full mb-1.5 w-52 bg-[#090a0f] border border-white/[0.12] rounded-xl shadow-2xl py-1 z-50 nodrag text-slate-200 text-xs divide-y divide-white/[0.06]">
            <div className="px-3 py-1 text-[9px] uppercase font-mono text-slate-500 tracking-wider">
              AI Node Architect
            </div>
            <div className="py-0.5">
              <button
                type="button"
                onClick={() => {
                  setShowAIMenu(false);
                  onTriggerAI('improve');
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/[0.06] text-left transition cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sharpen & Clarify</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAIMenu(false);
                  onTriggerAI('expand');
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/[0.06] text-left transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Expand Edge Cases</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAIMenu(false);
                  onTriggerAI('simplify');
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/[0.06] text-left transition cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Simplify & Densify</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAIMenu(false);
                  onTriggerAI('missing-info');
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/[0.06] text-left transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-purple-400" />
                <span>Find Unanswered Gaps</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAIMenu(false);
                  onTriggerAI('review');
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/[0.06] text-left transition cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                <span>Architectural Review</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Node utilities */}
      <div className="flex items-center gap-1">
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={isCollapsed ? 'Expand node' : 'Collapse node'}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        )}

        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 rounded hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition cursor-pointer"
          title="Duplicate node"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-1 rounded hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 transition cursor-pointer"
          title="Delete node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
