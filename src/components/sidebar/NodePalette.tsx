import React, { useState } from 'react';
import { NodeType, NodeCategory } from '../../types/node';
import { NODE_CONFIGS } from '../../constants/nodeConfigs';
import { Search, X, Layers, Plus } from 'lucide-react';

interface NodePaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: NodeType) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ isOpen, onClose, onAddNode }) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const categories: Array<{ id: NodeCategory; title: string }> = [
    { id: 'planning', title: 'Planning & Vision' },
    { id: 'technical', title: 'Technical & Architecture' },
    { id: 'product', title: 'Product & Design' },
    { id: 'execution', title: 'Tasks & Execution' },
    { id: 'ai', title: 'AI & Custom Notes' }
  ];

  const allConfigs = Object.values(NODE_CONFIGS).filter((cfg) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      cfg.label.toLowerCase().includes(q) ||
      cfg.shortDescription.toLowerCase().includes(q) ||
      cfg.category.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-80 border-r border-white/[0.08] bg-[#06070a]/95 backdrop-blur-xl flex flex-col h-[calc(100vh-3.5rem)] z-30 shadow-2xl shrink-0">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs tracking-wider flex items-center gap-1.5 font-mono">
            <span className="text-white font-semibold">Node</span>
            <span className="text-slate-400 font-normal">Catalog</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08] ml-1">
              {allConfigs.length}
            </span>
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition cursor-pointer border border-transparent hover:border-white/[0.08]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter node types..."
            className="w-full bg-[#090a0f] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition font-sans"
          />
        </div>
      </div>

      {/* Nodes list grouped by category */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((cat) => {
          const items = allConfigs.filter((c) => c.category === cat.id);
          if (items.length === 0) return null;

          return (
            <div key={cat.id}>
              <h3 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span>{cat.title}</span>
              </h3>
              <div className="space-y-1.5">
                {items.map((cfg) => (
                  <button
                    key={cfg.type}
                    onClick={() => onAddNode(cfg.type)}
                    className="w-full text-left p-2.5 rounded-xl border border-white/[0.06] bg-[#090a0f]/60 hover:bg-[#10131c] hover:border-white/[0.14] transition flex items-start justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${cfg.accentBg}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-300">
                        {cfg.shortDescription}
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition shrink-0 mt-0.5">
                      <Plus className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
