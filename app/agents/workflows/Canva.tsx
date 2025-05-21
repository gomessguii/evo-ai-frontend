/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/Canva.tsx                                       │
│ Developed by: Davidson Gomes                                                 │
│ Delay node integration developed by: Victor Calazans                         │
│ Creation date: May 13, 2025                                                  |
│ Delay implementation date: May 17, 2025                                      │
│ Contact: contato@evolution-api.com                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © Evolution API 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
│                                                                              │
│ You may not use this file except in compliance with the License.             │
│ You may obtain a copy of the License at                                      │
│                                                                              │
│    http://www.apache.org/licenses/LICENSE-2.0                                │
│                                                                              │
│ Unless required by applicable law or agreed to in writing, software          │
│ distributed under the License is distributed on an "AS IS" BASIS,            │
│ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     │
│ See the License for the specific language governing permissions and          │
│ limitations under the License.                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ @important                                                                   │
│ For any future changes to the code in this file, it is recommended to        │
│ include, together with the modification, the information of the developer    │
│ who changed it and the date of modification.                                 │
└──────────────────────────────────────────────────────────────────────────────┘
*/
"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  ConnectionMode,
  ConnectionLineType,
  useReactFlow,
  ProOptions,
  applyNodeChanges,
  NodeChange,
  OnNodesChange,
  MiniMap,
  Panel,
  Background,
} from "@xyflow/react";
import { useDnD } from "@/contexts/DnDContext";

import { Edit, X, ChevronLeft, ChevronRight } from "lucide-react";

import "@xyflow/react/dist/style.css";
import "./canva.css";

import { getHelperLines } from "./utils";

import { NodePanel } from "./NodePanel";
import ContextMenu from "./ContextMenu";
import { initialEdges, edgeTypes } from "./edges";
import HelperLines from "./HelperLines";
import { initialNodes, nodeTypes } from "./nodes";
import { AgentForm } from "./nodes/components/agent/AgentForm";
import { ConditionForm } from "./nodes/components/condition/ConditionForm";
import { Agent, WorkflowData } from "@/types/agent";
import { updateAgent } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";
import { MessageForm } from "./nodes/components/message/MessageForm";
import { DelayForm } from "./nodes/components/delay/DelayForm";
import { Button } from "@/components/ui/button";

const proOptions: ProOptions = { account: "paid-pro", hideAttribution: true };

const NodeFormWrapper = ({
  selectedNode,
  editingLabel,
  setEditingLabel,
  handleUpdateNode,
  setSelectedNode,
  children,
}: {
  selectedNode: any;
  editingLabel: boolean;
  setEditingLabel: (value: boolean) => void;
  handleUpdateNode: (node: any) => void;
  setSelectedNode: (node: any) => void;
  children: React.ReactNode;
}) => {
  // Handle ESC key to close the panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editingLabel) {
        setSelectedNode(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedNode, editingLabel]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 sticky top-0 z-20 bg-neutral-800 shadow-md border-b border-neutral-700">
        <div className="p-4 text-center relative">
          <button
            className="absolute right-2 top-2 text-neutral-200 hover:text-white p-1 rounded-full hover:bg-neutral-700"
            onClick={() => setSelectedNode(null)}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
          {!editingLabel ? (
            <div className="flex items-center justify-center text-xl font-bold text-neutral-200">
              <span>{selectedNode.data.label}</span>
              {selectedNode.type !== "start-node" && (
                <Edit
                  size={16}
                  className="ml-2 cursor-pointer hover:text-indigo-300"
                  onClick={() => setEditingLabel(true)}
                />
              )}
            </div>
          ) : (
            <input
              type="text"
              value={selectedNode.data.label}
              className="w-full p-2 text-center text-xl font-bold bg-neutral-800 text-neutral-200 border border-neutral-600 rounded"
              onChange={(e) => {
                handleUpdateNode({
                  ...selectedNode,
                  data: {
                    ...selectedNode.data,
                    label: e.target.value,
                  },
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingLabel(false);
                }
              }}
              onBlur={() => setEditingLabel(false)}
              autoFocus
            />
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};

const Canva = forwardRef(({ agent }: { agent: Agent | null }, ref) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const { type, setPointerEvents } = useDnD();
  const [menu, setMenu] = useState<any>(null);
  const localRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [activeExecutionNodeId, setActiveExecutionNodeId] = useState<
    string | null
  >(null);

  const [editingLabel, setEditingLabel] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const [nodePanelOpen, setNodePanelOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getFlowData: () => ({
      nodes,
      edges,
    }),
    setHasChanges,
    setActiveExecutionNodeId,
  }));

  // Effect para limpar o nó ativo após um timeout
  useEffect(() => {
    if (activeExecutionNodeId) {
      const timer = setTimeout(() => {
        setActiveExecutionNodeId(null);
      }, 5000); // Aumentar para 5 segundos para dar mais tempo de visualização

      return () => clearTimeout(timer);
    }
  }, [activeExecutionNodeId]);

  useEffect(() => {
    if (
      agent?.config?.workflow &&
      agent.config.workflow.nodes.length > 0 &&
      agent.config.workflow.edges.length > 0
    ) {
      setNodes(
        (agent.config.workflow.nodes as typeof initialNodes) || initialNodes
      );
      setEdges(
        (agent.config.workflow.edges as typeof initialEdges) || initialEdges
      );
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [agent, setNodes, setEdges]);

  // Atualizar os nós quando o nó ativo muda para adicionar classe visual
  useEffect(() => {
    if (nodes.length > 0) {
      setNodes((nds: any) =>
        nds.map((node: any) => {
          if (node.id === activeExecutionNodeId) {
            // Adiciona uma classe para destacar o nó ativo
            return {
              ...node,
              className: "active-execution-node",
              data: {
                ...node.data,
                isExecuting: true,
              },
            };
          } else {
            // Remove a classe de destaque
            const { isExecuting, ...restData } = node.data || {};
            return {
              ...node,
              className: "",
              data: restData,
            };
          }
        })
      );
    }
  }, [activeExecutionNodeId, setNodes]);

  useEffect(() => {
    if (agent?.config?.workflow) {
      const initialNodes = agent.config.workflow.nodes || [];
      const initialEdges = agent.config.workflow.edges || [];

      if (
        JSON.stringify(nodes) !== JSON.stringify(initialNodes) ||
        JSON.stringify(edges) !== JSON.stringify(initialEdges)
      ) {
        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
    }
  }, [nodes, edges, agent]);

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => {
        if (connection.source === connection.target) {
          return currentEdges;
        }

        return addEdge(connection, currentEdges);
      });
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (_event: any, connectionState: any) => {
      setPointerEvents("none");

      if (connectionState.fromHandle?.type === "target") {
        return;
      }

      if (!connectionState.isValid) {
        // Since we're using NodePanel now, we don't need to do anything here
        // The panel will handle node creation through drag and drop
      }
    },
    [setPointerEvents]
  );

  const onConnectStart = useCallback(() => {
    setPointerEvents("auto");
  }, [setPointerEvents]);

  const customApplyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: any): any => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      // this will be true if it's a single node being dragged
      // inside we calculate the helper lines and snap position for the position where the node is being moved to
      if (
        changes.length === 1 &&
        changes[0].type === "position" &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], nodes);

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;

        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }

      return applyNodeChanges(changes, nodes);
    },
    []
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) => customApplyNodeChanges(changes, nodes));
    },
    [setNodes, customApplyNodeChanges]
  );

  const getLabelFromNode = (type: string) => {
    const order = nodes.length;

    switch (type) {
      case "start-node":
        return "Start";
      case "agent-node":
        return `Agent #${order}`;
      case "condition-node":
        return `Condition #${order}`;
      case "message-node":
        return `Message #${order}`;
      case "delay-node":
        return `Delay #${order}`;
      default:
        return "Node";
    }
  };

  const handleAddNode = useCallback(
    (type: any, node: any) => {
      const newNode: any = {
        id: String(Date.now()),
        type,
        position: node.position,
        data: {
          label: getLabelFromNode(type),
        },
      };

      setNodes((nodes) => [...nodes, newNode]);

      if (node.targetId) {
        const newEdge: any = {
          source: node.targetId,
          sourceHandle: node.handleId,
          target: newNode.id,
          type: "default",
        };

        const newsEdges: any = [...edges, newEdge];

        setEdges(newsEdges);
      }
    },
    [nodes, setNodes, edges, setEdges]
  );

  const handleUpdateNode = useCallback(
    (node: any) => {
      setNodes((nodes) => {
        const index = nodes.findIndex((n) => n.id === node.id);
        if (index !== -1) {
          nodes[index] = node;
        }
        return [...nodes];
      });

      if (selectedNode && selectedNode.id === node.id) {
        setSelectedNode(node);
      }
    },
    [setNodes, selectedNode]
  );

  const handleDeleteEdge = useCallback(
    (id: any) => {
      setEdges((edges) => {
        const left = edges.filter((edge: any) => edge.id !== id);
        return left;
      });
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: any = {
        id: String(Date.now()),
        type,
        position,
        data: {
          label: getLabelFromNode(type),
        },
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [screenToFlowPosition, setNodes, type, getLabelFromNode]
  );

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();

      if (node.id === "start-node") {
        return;
      }

      if (!localRef.current) {
        return;
      }

      const paneBounds = localRef.current.getBoundingClientRect();

      const x = event.clientX - paneBounds.left;
      const y = event.clientY - paneBounds.top;

      const menuWidth = 200;
      const menuHeight = 200;

      const left = x + menuWidth > paneBounds.width ? undefined : x;
      const top = y + menuHeight > paneBounds.height ? undefined : y;
      const right =
        x + menuWidth > paneBounds.width ? paneBounds.width - x : undefined;
      const bottom =
        y + menuHeight > paneBounds.height ? paneBounds.height - y : undefined;

      setMenu({
        id: node.id,
        left,
        top,
        right,
        bottom,
      });
    },
    [setMenu]
  );

  const onNodeClick = useCallback((event: any, node: any) => {
    event.preventDefault();

    if (node.type === "start-node") {
      return;
    }

    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setMenu(null);
    setSelectedNode(null);
    setNodePanelOpen(false);
  }, [setMenu, setSelectedNode]);

  return (
    <div className="h-full w-full bg-[#121212]">
      <div
        style={{ position: "relative", height: "100%", width: "100%" }}
        ref={localRef}
        className="overflow-hidden"
      >
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          connectionMode={ConnectionMode.Strict}
          connectionLineType={ConnectionLineType.Bezier}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
          colorMode="dark"
          minZoom={0.1}
          maxZoom={10}
          fitView={false}
          defaultViewport={{
            x: 0,
            y: 0,
            zoom: 1,
          }}
          elevateEdgesOnSelect
          elevateNodesOnSelect
          proOptions={proOptions}
          connectionLineStyle={{
            stroke: "gray",
            strokeWidth: 2,
            strokeDashoffset: 5,
            strokeDasharray: 5,
          }}
          defaultEdgeOptions={{
            type: "default",
            style: {
              strokeWidth: 3,
            },
            data: {
              handleDeleteEdge,
            },
          }}
        >
          <Background color="#334155" gap={24} size={1.5} />
          <MiniMap
            className="bg-neutral-800/80 border border-neutral-700 rounded-lg shadow-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case "start-node":
                  return "#10b981";
                case "agent-node":
                  return "#3b82f6";
                case "message-node":
                  return "#f97316";
                case "condition-node":
                  return "#3b82f6";
                case "delay-node":
                  return "#eab308";
                default:
                  return "#64748b";
              }
            }}
            maskColor="rgba(15, 23, 42, 0.6)"
          />

          <Controls
            showInteractive={true}
            showFitView={true}
            orientation="vertical"
            position="bottom-left"
          />
          <HelperLines
            horizontal={helperLineHorizontal}
            vertical={helperLineVertical}
          />
          {menu && <ContextMenu onClick={onPaneClick} {...menu} />}

          {nodePanelOpen ? (
            <Panel position="top-right">
              <div className="flex items-start">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNodePanelOpen(false)}
                  className="mr-2 h-8 w-8 rounded-full bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <NodePanel />
              </div>
            </Panel>
          ) : (
            <Panel position="top-right">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNodePanelOpen(true)}
                className="h-8 w-8 rounded-full bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Panel>
          )}
        </ReactFlow>

        {/* Overlay when form is open on smaller screens */}
        {selectedNode && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[5] transition-opacity duration-300"
            onClick={() => setSelectedNode(null)}
          />
        )}

        <div
          className="absolute left-0 top-0 z-10 h-full w-[350px] bg-neutral-900 shadow-lg transition-all duration-300 ease-in-out border-r border-neutral-700 flex flex-col"
          style={{
            transform: selectedNode ? "translateX(0)" : "translateX(-100%)",
            opacity: selectedNode ? 1 : 0,
          }}
        >
          {selectedNode ? (
            <NodeFormWrapper
              selectedNode={selectedNode}
              editingLabel={editingLabel}
              setEditingLabel={setEditingLabel}
              handleUpdateNode={handleUpdateNode}
              setSelectedNode={setSelectedNode}
            >
              {selectedNode.type === "agent-node" && (
                <AgentForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={() => {}}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "condition-node" && (
                <ConditionForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={() => {}}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "message-node" && (
                <MessageForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={() => {}}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "delay-node" && (
                <DelayForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={() => {}}
                  setSelectedNode={setSelectedNode}
                />
              )}
            </NodeFormWrapper>
          ) : null}
        </div>
      </div>
    </div>
  );
});

Canva.displayName = "Canva";

export default Canva;
