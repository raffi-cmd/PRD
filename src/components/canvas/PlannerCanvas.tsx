import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BaseNode } from '../nodes/BaseNode';
import { CustomEdge } from './CustomEdge';
import { PlannerStore } from '../../hooks/usePlannerStore';
import { NodeAIActionType } from '../nodes/NodeToolbar';

interface PlannerCanvasProps {
  store: PlannerStore;
  onTriggerAIForNode: (nodeId: string, action: NodeAIActionType) => void;
  zoomInRef?: React.MutableRefObject<() => void>;
  zoomOutRef?: React.MutableRefObject<() => void>;
  fitViewRef?: React.MutableRefObject<() => void>;
}

// Inner component can use useReactFlow because it lives inside ReactFlowProvider
const CanvasInner: React.FC<PlannerCanvasProps> = ({
  store,
  onTriggerAIForNode,
  zoomInRef,
  zoomOutRef,
  fitViewRef
}) => {
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

  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Wire zoom control refs so Header can call them
  useEffect(() => {
    if (zoomInRef) zoomInRef.current = () => zoomIn({ duration: 200 });
    if (zoomOutRef) zoomOutRef.current = () => zoomOut({ duration: 200 });
    if (fitViewRef) fitViewRef.current = () => fitView({ padding: 0.15, duration: 300 });
  }, [zoomIn, zoomOut, fitView, zoomInRef, zoomOutRef, fitViewRef]);

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

  return (
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
      defaultViewport={{ x: 80, y: 80, zoom: 1.2 }}
      minZoom={0.15}
      maxZoom={2.0}
      snapToGrid={project.settings.snapToGrid}
      snapGrid={[16, 16]}
      defaultEdgeOptions={{
        type: 'customEdge',
        animated: true
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#334155" />
      <Controls
        className="!bg-slate-900 !border !border-slate-800 !rounded-lg !shadow-xl !fill-slate-300"
        showInteractive={false}
      />
      <MiniMap
        className="!bg-slate-900/90 !border !border-slate-800 !rounded-lg !shadow-2xl"
        nodeColor="#1e293b"
        maskColor="rgba(15, 23, 42, 0.75)"
        zoomable
        pannable
      />
    </ReactFlow>
  );
};

// Outer component wraps in ReactFlowProvider so useReactFlow works inside
export const PlannerCanvas: React.FC<PlannerCanvasProps> = (props) => {
  return (
    <div className="w-full h-full relative bg-slate-950">
      <ReactFlowProvider>
        <CanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
};
