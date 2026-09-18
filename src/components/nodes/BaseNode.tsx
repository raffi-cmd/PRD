import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NODE_CONFIGS } from '../../constants/nodeConfigs';
import { PlannerNodeData, NodeStatus } from '../../types/node';
import { NodeMarkdownBody } from './NodeMarkdownBody';
import { NodeToolbar, NodeAIActionType } from './NodeToolbar';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  FileEdit,
  History,
  Check,
  Sparkles
} from 'lucide-react';

export const BaseNode: React.FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as PlannerNodeData;
  const config = NODE_CONFIGS[nodeData.type] || NODE_CONFIGS.custom;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(nodeData.title);

  // Status visual mapping
  const statusBadges: Record<NodeStatus, { label: string; icon: React.ReactNode; badgeClass: string }> = {
    draft: {
      label: 'Draft',
      icon: <FileEdit className="w-3 h-3 text-slate-400" />,
      badgeClass: 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
    },
    in_review: {
      label: 'In Review',
      icon: <Clock className="w-3 h-3 text-sky-400" />,
      badgeClass: 'bg-sky-950/40 text-sky-300 border-sky-500/30'
    },
    approved: {
      label: 'Approved',
      icon: <CheckCircle className="w-3 h-3 text-emerald-400" />,
      badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
    },
    blocked: {
      label: 'Blocked',
      icon: <Ban className="w-3 h-3 text-rose-400" />,
      badgeClass: 'bg-rose-950/40 text-rose-300 border-rose-500/30'
    },
    complete: {
      label: 'Complete',
      icon: <Check className="w-3 h-3 text-purple-400" />,
      badgeClass: 'bg-purple-950/40 text-purple-300 border-purple-500/30'
    },
    outdated: {
      label: 'Outdated',
      icon: <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />,
      badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40'
    }
  };

  const currentStatusBadge = statusBadges[nodeData.status] || statusBadges.draft;

  const cycleStatus = () => {
    const statuses: NodeStatus[] = ['draft', 'in_review', 'approved', 'blocked', 'complete'];
    const currIdx = statuses.indexOf(nodeData.status);
    const nextStatus = statuses[(currIdx + 1) % statuses.length];
    window.dispatchEvent(
      new CustomEvent('planner:update-node', {
        detail: { id, partial: { status: nextStatus } }
      })
    );
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== nodeData.title) {
      window.dispatchEvent(
        new CustomEvent('planner:update-node', {
          detail: { id, partial: { title: titleDraft.trim() } }
        })
      );
    }
  };

  const handleSaveContent = (newContent: string) => {
    window.dispatchEvent(
      new CustomEvent('planner:update-node', {
        detail: { id, partial: { content: newContent }, markDownstream: true }
      })
    );
  };

  const handleTriggerAI = (action: NodeAIActionType) => {
    window.dispatchEvent(
      new CustomEvent('planner:ai-action', {
        detail: { id, action }
      })
    );
  };

  const handleDuplicate = () => {
    window.dispatchEvent(
      new CustomEvent('planner:duplicate-node', {
        detail: { id }
      })
    );
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent('planner:delete-node', {
        detail: { id }
      })
    );
  };

  const handleToggleCollapse = () => {
    window.dispatchEvent(
      new CustomEvent('planner:toggle-collapse', {
        detail: { id }
      })
    );
  };

  return (
    <div
      className={`group relative rounded-xl transition-all duration-150 w-80 sm:w-96 select-none ${
        selected
          ? 'bg-[#090a0f] border border-emerald-500/70 shadow-glow-md ring-1 ring-emerald-500/20'
          : 'bg-[#090a0f]/95 hover:bg-[#0c0e14] border border-white/[0.08] hover:border-white/[0.16] shadow-subtle'
      }`}
    >
      {/* Node Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!top-[-5px] !w-2.5 !h-2.5 !bg-slate-700 hover:!bg-emerald-400 !border !border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bottom-[-5px] !w-2.5 !h-2.5 !bg-slate-700 hover:!bg-emerald-400 !border !border-black"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="handle-left"
        className="!left-[-5px] !w-2.5 !h-2.5 !bg-slate-700 hover:!bg-emerald-400 !border !border-black"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="handle-right"
        className="!right-[-5px] !w-2.5 !h-2.5 !bg-slate-700 hover:!bg-emerald-400 !border !border-black"
      />

      {/* Floating Action Toolbar on Selected */}
      {selected && (
        <NodeToolbar
          onTriggerAI={handleTriggerAI}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onToggleCollapse={handleToggleCollapse}
          isCollapsed={Boolean(nodeData.isCollapsed)}
        />
      )}

      {/* Node Header */}
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: config.color || '#10b981' }}
          />

          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
            {config.label}
          </span>

          <span className="text-white/[0.15]">&bull;</span>

          {isEditingTitle ? (
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="bg-[#040508] border border-emerald-500/50 rounded px-1.5 py-0.5 text-xs text-white font-medium focus:outline-none w-full font-mono"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-xs font-medium text-slate-200 hover:text-white truncate cursor-pointer transition"
              title="Double click to edit title"
            >
              {nodeData.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Version badge */}
          {nodeData.version && nodeData.version > 1 && (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-slate-400 px-1 py-0.2 rounded bg-white/[0.03] border border-white/[0.06]">
              <History className="w-2.5 h-2.5" />
              v{nodeData.version}
            </span>
          )}

          {/* Interactive Status Badge */}
          <button
            onClick={cycleStatus}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition cursor-pointer ${currentStatusBadge.badgeClass}`}
            title="Click to cycle status"
          >
            {currentStatusBadge.icon}
            <span>{currentStatusBadge.label}</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={handleToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition cursor-pointer"
            title={nodeData.isCollapsed ? 'Expand node' : 'Collapse node'}
          >
            {nodeData.isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Outdated Notice Banner */}
      {nodeData.status === 'outdated' && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-3 py-1.5 text-[11px] text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Upstream dependency modified</span>
          </div>
          <button
            onClick={() => handleTriggerAI('improve')}
            className="text-[10px] font-mono underline hover:text-amber-100 flex items-center gap-0.5"
          >
            <Sparkles className="w-2.5 h-2.5" /> Re-sync
          </button>
        </div>
      )}

      {/* Node Markdown Body */}
      {!nodeData.isCollapsed && (
        <div className="p-3">
          <NodeMarkdownBody content={nodeData.content} onSaveContent={handleSaveContent} />
        </div>
      )}
    </div>
  );
});
