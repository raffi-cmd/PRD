import { useState, useCallback, useRef, useEffect } from 'react';
import { ProjectSchema, DesignIntentData } from '../types/project';
import { PlannerNode, NodeType, PlannerNodeData, NodeStatus } from '../types/node';
import { PlannerEdge, EdgeType } from '../types/edge';
import { AIProposal } from '../types/ai';
import { NODE_CONFIGS } from '../constants/nodeConfigs';
import { createDefaultProject } from '../services/storage/projectIO';
import { getDownstreamImpactedNodes } from '../services/ai/contextBuilder';

export interface PlannerStore {
  project: ProjectSchema;
  canUndo: boolean;
  canRedo: boolean;
  selectedNodeId: string | null;
  impactedNodeIds: string[];
  addNode: (type: NodeType, title?: string, content?: string, position?: { x: number; y: number }) => string;
  updateNode: (id: string, partial: Partial<PlannerNodeData>, markDownstreamOutdated?: boolean) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  toggleNodeCollapse: (id: string) => void;
  addEdge: (source: string, target: string, type?: EdgeType) => void;
  deleteEdge: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setProject: (newProject: ProjectSchema) => void;
  applyProposal: (proposal: AIProposal) => void;
  updateDesignIntent: (designIntent: DesignIntentData) => void;
  dismissOutdatedStatus: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
}

export function usePlannerStore(initialProject?: ProjectSchema): PlannerStore {
  const [project, setProjectInternal] = useState<ProjectSchema>(() => initialProject || createDefaultProject());
  const [past, setPast] = useState<ProjectSchema[]>([]);
  const [future, setFuture] = useState<ProjectSchema[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [impactedNodeIds, setImpactedNodeIds] = useState<string[]>([]);

  // Ref to prevent state desync in history pushes
  const projectRef = useRef(project);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  const pushHistory = useCallback((currentProj: ProjectSchema) => {
    setPast((prev) => [...prev.slice(-25), JSON.parse(JSON.stringify(currentProj))]);
    setFuture([]);
  }, []);

  const setProject = useCallback(
    (newProject: ProjectSchema) => {
      pushHistory(projectRef.current);
      setProjectInternal(newProject);
      setSelectedNodeId(null);
      setImpactedNodeIds([]);
    },
    [pushHistory]
  );

  const addNode = useCallback(
    (type: NodeType, customTitle?: string, customContent?: string, pos?: { x: number; y: number }): string => {
      const config = NODE_CONFIGS[type] || NODE_CONFIGS.custom;
      const id = `node-${type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
      const now = new Date().toISOString();

      const defaultPos = pos || {
        x: 350 + (projectRef.current.nodes.length % 4) * 50,
        y: 120 + (projectRef.current.nodes.length % 6) * 60
      };

      const title = customTitle || config.defaultTitle;
      const content = customContent !== undefined ? customContent : config.defaultContent;

      const newNode: PlannerNode = {
        id,
        type: 'plannerNode',
        position: defaultPos,
        data: {
          id,
          type,
          title,
          content,
          status: 'draft',
          category: config.category,
          version: 1,
          versions: [
            {
              version: 1,
              title,
              content,
              timestamp: now
            }
          ],
          createdAt: now,
          updatedAt: now
        }
      };

      pushHistory(projectRef.current);
      setProjectInternal((prev) => ({
        ...prev,
        project: { ...prev.project, updatedAt: now },
        nodes: [...prev.nodes, newNode]
      }));

      setSelectedNodeId(id);
      return id;
    },
    [pushHistory]
  );

  const updateNode = useCallback(
    (id: string, partial: Partial<PlannerNodeData>, markDownstreamOutdated = false) => {
      const now = new Date().toISOString();
      const current = projectRef.current;
      const targetNode = current.nodes.find((n) => n.id === id);
      if (!targetNode) return;

      pushHistory(current);

      let impactedList: PlannerNode[] = [];
      if (markDownstreamOutdated && partial.content && partial.content !== targetNode.data.content) {
        impactedList = getDownstreamImpactedNodes(id, current.nodes, current.edges);
        setImpactedNodeIds(impactedList.map((n) => n.id));
      }

      setProjectInternal((prev) => {
        const nextNodes = prev.nodes.map((node) => {
          if (node.id === id) {
            const hasSubstantiveContentChange =
              partial.content !== undefined && partial.content !== node.data.content;
            const nextVersion = hasSubstantiveContentChange ? node.data.version + 1 : node.data.version;
            const updatedVersions = hasSubstantiveContentChange
              ? [
                  ...node.data.versions,
                  {
                    version: nextVersion,
                    title: partial.title || node.data.title,
                    content: partial.content || node.data.content,
                    timestamp: now,
                    summary: 'Manual edit'
                  }
                ]
              : node.data.versions;

            return {
              ...node,
              data: {
                ...node.data,
                ...partial,
                version: nextVersion,
                versions: updatedVersions,
                updatedAt: now
              }
            };
          }

          // Mark downstream nodes outdated if requested
          if (impactedList.some((imp) => imp.id === node.id) && node.data.status !== 'outdated') {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'outdated' as NodeStatus,
                outdatedReason: `Upstream specification in "${targetNode.data.title}" was modified.`
              }
            };
          }

          return node;
        });

        return {
          ...prev,
          project: { ...prev.project, updatedAt: now },
          nodes: nextNodes
        };
      });
    },
    [pushHistory]
  );

  const deleteNode = useCallback(
    (id: string) => {
      pushHistory(projectRef.current);
      setProjectInternal((prev) => ({
        ...prev,
        project: { ...prev.project, updatedAt: new Date().toISOString() },
        nodes: prev.nodes.filter((n) => n.id !== id),
        edges: prev.edges.filter((e) => e.source !== id && e.target !== id)
      }));
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [pushHistory, selectedNodeId]
  );

  const duplicateNode = useCallback(
    (id: string) => {
      const current = projectRef.current;
      const orig = current.nodes.find((n) => n.id === id);
      if (!orig) return;

      const newId = `node-${orig.data.type}-${Date.now().toString(36)}`;
      const now = new Date().toISOString();

      const clonedNode: PlannerNode = {
        id: newId,
        type: 'plannerNode',
        position: { x: orig.position.x + 40, y: orig.position.y + 40 },
        data: {
          ...orig.data,
          id: newId,
          title: `${orig.data.title} (Copy)`,
          version: 1,
          versions: [
            {
              version: 1,
              title: `${orig.data.title} (Copy)`,
              content: orig.data.content,
              timestamp: now
            }
          ],
          createdAt: now,
          updatedAt: now
        }
      };

      pushHistory(current);
      setProjectInternal((prev) => ({
        ...prev,
        nodes: [...prev.nodes, clonedNode]
      }));
      setSelectedNodeId(newId);
    },
    [pushHistory]
  );

  const updateNodePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setProjectInternal((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === id ? { ...n, position } : n))
    }));
  }, []);

  const toggleNodeCollapse = useCallback((id: string) => {
    setProjectInternal((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } } : n
      )
    }));
  }, []);

  const addEdge = useCallback(
    (source: string, target: string, type: EdgeType = 'dependency') => {
      if (source === target) return;
      const current = projectRef.current;
      const existing = current.edges.find((e) => e.source === source && e.target === target);
      if (existing) return;

      const id = `edge-${source}-${target}-${Date.now().toString(36)}`;
      const newEdge: PlannerEdge = {
        id,
        source,
        target,
        type: 'customEdge',
        data: { type }
      };

      pushHistory(current);
      setProjectInternal((prev) => ({
        ...prev,
        edges: [...prev.edges, newEdge]
      }));
    },
    [pushHistory]
  );

  const deleteEdge = useCallback(
    (id: string) => {
      pushHistory(projectRef.current);
      setProjectInternal((prev) => ({
        ...prev,
        edges: prev.edges.filter((e) => e.id !== id)
      }));
    },
    [pushHistory]
  );

  const applyProposal = useCallback(
    (proposal: AIProposal) => {
      const now = new Date().toISOString();
      const current = projectRef.current;
      const targetNode = current.nodes.find((n) => n.id === proposal.nodeId);
      if (!targetNode) return;

      pushHistory(current);

      const nextVersion = targetNode.data.version + 1;
      const updatedVersions = [
        ...targetNode.data.versions,
        {
          version: nextVersion,
          title: proposal.proposedTitle,
          content: proposal.proposedContent,
          timestamp: now,
          summary: proposal.summary || 'AI enhancement applied'
        }
      ];

      setProjectInternal((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === proposal.nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  title: proposal.proposedTitle,
                  content: proposal.proposedContent,
                  version: nextVersion,
                  versions: updatedVersions,
                  status: 'in_review' as NodeStatus,
                  updatedAt: now
                }
              }
            : node
        )
      }));
    },
    [pushHistory]
  );

  const dismissOutdatedStatus = useCallback((nodeId: string) => {
    setProjectInternal((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                status: 'in_review' as NodeStatus,
                outdatedReason: undefined
              }
            }
          : n
      )
    }));
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((prev) => [JSON.parse(JSON.stringify(projectRef.current)), ...prev]);
    setPast(newPast);
    setProjectInternal(previous);
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((prev) => [...prev, JSON.parse(JSON.stringify(projectRef.current))]);
    setFuture(newFuture);
    setProjectInternal(next);
  }, [future]);

  const updateDesignIntent = useCallback((designIntent: DesignIntentData) => {
    pushHistory(projectRef.current);
    setProjectInternal((prev) => ({ ...prev, designIntent }));
  }, [pushHistory]);

  return {
    project,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    selectedNodeId,
    impactedNodeIds,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    updateNodePosition,
    toggleNodeCollapse,
    addEdge,
    deleteEdge,
    setSelectedNodeId,
    setProject,
    applyProposal,
    updateDesignIntent,
    dismissOutdatedStatus,
    undo,
    redo
  };
}

