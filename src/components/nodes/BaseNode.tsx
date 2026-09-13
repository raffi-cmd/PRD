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
  Check
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
      icon: <FileEdit className="w-3.5 h-3.5 text-slate-400" />,
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    in_review: {
      label: 'In Review',
      icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
      badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-800/90'
    },
    approved: {
      label: 'Approved',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/90'
    },
    blocked: {
      label: 'Blocked',
      icon: <Ban className="w-3.5 h-3.5 text-rose-400" />,
      badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-800/90'
    },
    complete: {
      label: 'Complete',
      icon: <Check className="w-3.5 h-3.5 text-purple-400" />,
      badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-800/90'
    },
    outdated: {
      label: 'Outdated',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800'
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

  const handleDismissOutdated = () => {
    window.dispatchEvent(
      new CustomEvent('planner:dismiss-outdated', {
        detail: { id }
      })
    );
  };

  return (
    <div
      className={`w-[440px] bg-slate-900/98 border rounded-xl shadow-2xl backdrop-blur-md transition-all duration-200 ${
        selected ? 'border-brand-400 ring-2 ring-brand-500/30 shadow-brand-500/20' : 'border-slate-800'
      } ${nodeData.status === 'outdated' ? 'border-amber-500/60 ring-1 ring-amber-500/20' : ''}`}
    >
      {/* Target Handles for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3.5 h-3.5 !bg-slate-600 hover:!bg-brand-400 !border-2 !border-slate-950 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3.5 h-3.5 !bg-slate-600 hover:!bg-brand-400 !border-2 !border-slate-950 transition-colors"
      />

      {/* Node Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-950/60 rounded-t-xl">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Node Type pill */}
          <span
            className={`text-[11px] uppercase font-mono px-2.5 py-0.5 rounded border font-semibold tracking-wider shrink-0 ${config.accentBg}`}
          >
            {config.label}
          </span>

          {/* Title */}
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
              className="bg-slate-950 border border-brand-500 rounded px-2 py-0.5 text-sm text-slate-100 font-semibold focus:outline-none w-full nodrag"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold text-slate-100 truncate cursor-text flex-1 hover:text-brand-300 transition"
              title="Double click to rename"
            >
              {nodeData.title}
            </h3>
          )}
        </div>

        {/* Controls on header right: Version badge, Status pill, Collapse */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700/60"
            title={`Version ${nodeData.version || 1}`}
          >
            <History className="w-3 h-3 text-slate-400" />
            <span>v{nodeData.version || 1}</span>
          </span>

          <button
            onClick={cycleStatus}
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition cursor-pointer ${currentStatusBadge.badgeClass}`}
            title="Click to cycle status"
          >
            {currentStatusBadge.icon}
            <span>{currentStatusBadge.label}</span>
          </button>

          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={nodeData.collapsed ? 'Expand node' : 'Collapse node'}
          >
            {nodeData.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Outdated Warning Banner */}
      {nodeData.status === 'outdated' && (
        <div className="bg-amber-950/60 border-b border-amber-900/80 px-3.5 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">{nodeData.outdatedReason || 'Upstream dependencies modified.'}</span>
          </div>
          <button
            onClick={handleDismissOutdated}
            className="text-[11px] bg-amber-900/60 hover:bg-amber-900/90 border border-amber-700/60 px-2 py-0.5 rounded text-amber-200 transition cursor-pointer ml-2 shrink-0 font-medium"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Node Body */}
      <NodeMarkdownBody
        content={nodeData.content}
        onSaveContent={handleSaveContent}
        isCollapsed={nodeData.collapsed}
      />

      {/* Node Footer Toolbar */}
      <NodeToolbar
        onAIAction={handleTriggerAI}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {/* Source Handles for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3.5 h-3.5 !bg-slate-600 hover:!bg-brand-400 !border-2 !border-slate-950 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3.5 h-3.5 !bg-slate-600 hover:!bg-brand-400 !border-2 !border-slate-950 transition-colors"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
