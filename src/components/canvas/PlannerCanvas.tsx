import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BaseNode } from '../nodes/BaseNode';
import { CustomEdge } from './CustomEdge';
import { CanvasControls } from './CanvasControls';
import { PlannerStore } from '../../hooks/usePlannerStore';
import { NodeAIActionType } from '../nodes/NodeToolbar';

interface PlannerCanvasProps {
  store: PlannerStore;
  onTriggerAIForNode: (nodeId: string, action: NodeAIActionType) => void;
}

const PlannerCanvasInner: React.FC<PlannerCanvasProps> = ({ store, onTriggerAIForNode }) => {
  const {
    project,
    setProject,
    updateNode,
    deleteNode,
    duplicateNode,
    toggleNodeCollapse,
    dismissOutdatedStatus,
    setSelectedNodeId
  } = store;

  const nodeTypes = useMemo(() => ({ plannerNode: BaseNode }), []);
  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  // Listen for custom events dispatched by nodes
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      updateNode(detail.id, detail.partial, detail.markDownstream);
    };

    const handleAI = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      onTriggerAIForNode(detail.id, detail.action);
    };

    const handleDuplicate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      duplicateNode(detail.id);
    };

    const handleDelete = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      deleteNode(detail.id);
    };

    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      toggleNodeCollapse(detail.id);
    };

    const handleDismissOutdated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      dismissOutdatedStatus(detail.id);
    };

    window.addEventListener('planner:update-node', handleUpdate);
    window.addEventListener('planner:ai-action', handleAI);
    window.addEventListener('planner:duplicate-node', handleDuplicate);
    window.addEventListener('planner:delete-node', handleDelete);
    window.addEventListener('planner:toggle-collapse', handleToggle);
    window.addEventListener('planner:dismiss-outdated', handleDismissOutdated);

    return () => {
      window.removeEventListener('planner:update-node', handleUpdate);
      window.removeEventListener('planner:ai-action', handleAI);
      window.removeEventListener('planner:duplicate-node', handleDuplicate);
      window.removeEventListener('planner:delete-node', handleDelete);
      window.removeEventListener('planner:toggle-collapse', handleToggle);
      window.removeEventListener('planner:dismiss-outdated', handleDismissOutdated);
    };
  }, [
    updateNode,
    onTriggerAIForNode,
    duplicateNode,
    deleteNode,
    toggleNodeCollapse,
    dismissOutdatedStatus
  ]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setProject({
        ...project,
        nodes: applyNodeChanges(changes, project.nodes as unknown as Node[]) as any
      });
    },
    [project, setProject]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setProject({
        ...project,
        edges: applyEdgeChanges(changes, project.edges as unknown as Edge[]) as any
      });
    },
    [project, setProject]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      store.addEdge(params.source, params.target, 'dependency');
    },
    [store]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Auto layout function to tidy up nodes neatly in columns/grid
  const handleAutoLayout = useCallback(() => {
    const updatedNodes = project.nodes.map((n, idx) => ({
      ...n,
      position: {
        x: 80 + (idx % 3) * 480,
        y: 80 + Math.floor(idx / 3) * 400
      }
    }));
    setProject({
      ...project,
      nodes: updatedNodes
    });
  }, [project, setProject]);

  return (
    <div className="w-full h-full relative bg-[#040508]">
      <ReactFlow
        nodes={project.nodes as unknown as Node[]}
        edges={project.edges as unknown as Edge[]}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        defaultViewport={{ x: 120, y: 80, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2.5}
        snapToGrid={project.settings.snapToGrid}
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          type: 'customEdge',
          animated: true
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="#1e293b" />
        
        {/* Prominent Zoom & View Controls */}
        <CanvasControls onAutoLayout={handleAutoLayout} />

        {/* MiniMap on bottom-right */}
        <MiniMap
          className="!bg-[#090a0f] !border !border-white/[0.12] !rounded-xl !shadow-2xl"
          nodeColor="#10b981"
          maskColor="rgba(4, 5, 8, 0.85)"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export const PlannerCanvas: React.FC<PlannerCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <PlannerCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
