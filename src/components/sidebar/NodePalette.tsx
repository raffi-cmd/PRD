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
    <aside className="w-80 border-r border-slate-800 bg-slate-900/95 backdrop-blur flex flex-col h-[calc(100vh-3.5rem)] z-30 shadow-2xl shrink-0">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <h2 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
            Node Catalog
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter node types..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
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
              <h3 className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-2">
                {cat.title}
              </h3>
              <div className="space-y-1.5">
                {items.map((cfg) => (
                  <button
                    key={cfg.type}
                    onClick={() => onAddNode(cfg.type)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700 transition flex items-start justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${cfg.accentBg}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {cfg.shortDescription}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-brand-400 shrink-0 mt-1 transition" />
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
