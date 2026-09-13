import React, { useState, useEffect } from 'react';
import { NodeType } from '../../types/node';
import { NODE_CONFIGS } from '../../constants/nodeConfigs';
import {
  Search,
  Sparkles,
  CheckCircle2,
  FileCode2,
  Settings,
  Plus,
  Undo2,
  Redo2,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: NodeType) => void;
  onOpenGeneratePlan: () => void;
  onOpenValidation: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onAddNode,
  onOpenGeneratePlan,
  onOpenValidation,
  onOpenExport,
  onOpenSettings,
  onUndo,
  onRedo
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'gen-plan',
      label: 'Synthesize Project Plan',
      category: 'AI Planning',
      icon: <Sparkles className="w-4 h-4 text-brand-400" />,
      run: () => {
        onClose();
        onOpenGeneratePlan();
      }
    },
    {
      id: 'validate',
      label: 'Validate Project Health',
      category: 'Quality Assurance',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      run: () => {
        onClose();
        onOpenValidation();
      }
    },
    {
      id: 'export',
      label: 'Prepare for Coding & Export',
      category: 'Export',
      icon: <FileCode2 className="w-4 h-4 text-cyan-400" />,
      run: () => {
        onClose();
        onOpenExport();
      }
    },
    {
      id: 'settings',
      label: 'Configure AI Provider & Settings',
      category: 'Preferences',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      run: () => {
        onClose();
        onOpenSettings();
      }
    },
    {
      id: 'undo',
      label: 'Undo Last Action',
      category: 'History',
      icon: <Undo2 className="w-4 h-4 text-slate-400" />,
      run: () => {
        onClose();
        onUndo();
      }
    },
    {
      id: 'redo',
      label: 'Redo Action',
      category: 'History',
      icon: <Redo2 className="w-4 h-4 text-slate-400" />,
      run: () => {
        onClose();
        onRedo();
      }
    }
  ];

  const nodeActions = Object.values(NODE_CONFIGS).map((cfg) => ({
    id: `add-node-${cfg.type}`,
    label: `Create Node: ${cfg.label}`,
    category: `Add Node (${cfg.category})`,
    icon: <Plus className="w-4 h-4 text-slate-400" />,
    run: () => {
      onClose();
      onAddNode(cfg.type);
    }
  }));

  const allItems = [...actions, ...nodeActions].filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search node types (e.g. PRD, Tasks, Architecture)..."
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-600 text-xs focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No matching commands found.</div>
          ) : (
            allItems.map((item) => (
              <button
                key={item.id}
                onClick={item.run}
                className="w-full p-2.5 rounded-lg hover:bg-slate-800/80 text-left flex items-center justify-between group transition cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-slate-200 font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
