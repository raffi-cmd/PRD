import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { EdgeType } from '../../types/edge';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const edgeType = (data?.type as EdgeType) || 'dependency';

  const typeLabels: Record<EdgeType, { label: string; bg: string; text: string }> = {
    dependency: { label: 'depends on', bg: 'bg-slate-800', text: 'text-slate-300' },
    'derived-from': { label: 'derived from', bg: 'bg-cyan-950/80', text: 'text-cyan-300' },
    'related-to': { label: 'related to', bg: 'bg-zinc-800', text: 'text-zinc-300' },
    implements: { label: 'implements', bg: 'bg-emerald-950/80', text: 'text-emerald-300' },
    blocks: { label: 'blocks', bg: 'bg-rose-950/80', text: 'text-rose-300' }
  };

  const badge = typeLabels[edgeType] || typeLabels.dependency;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeWidth: 2, stroke: '#475569' }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700/60 shadow-sm ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
