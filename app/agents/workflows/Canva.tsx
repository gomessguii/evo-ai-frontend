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

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

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
} from "@xyflow/react";
import { useDnD } from "@/contexts/DnDContext";

import { Edit } from "lucide-react";

import "@xyflow/react/dist/style.css";
import "./canva.css";

import { getHelperLines } from "./utils";

import { CanvaMenu } from "./CanvaMenu";
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

const proOptions: ProOptions = { account: "paid-pro", hideAttribution: true };

const Canva = forwardRef(({ agent }: { agent: Agent | null }, ref) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const { type, setPointerEvents } = useDnD();
  const [menu, setMenu] = useState<any>(null);
  const localRef = useRef<any>(null);
  const [externalOpen, setExternalOpen] = useState<any>(null);

  const [selectedNode, setSelectedNode] = useState<any>(null);

  const [editingLabel, setEditingLabel] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  useImperativeHandle(ref, () => ({
    getFlowData: () => ({
      nodes,
      edges
    }),
    setHasChanges
  }));

  useEffect(() => {
    if (agent?.config?.workflow && agent.config.workflow.nodes.length > 0 && agent.config.workflow.edges.length > 0) {
      setNodes(agent.config.workflow.nodes as typeof initialNodes || initialNodes);
      setEdges(agent.config.workflow.edges as typeof initialEdges || initialEdges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [agent, setNodes, setEdges]);

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

      if (connectionState.fromHandle.type === "target") {
        return;
      }

      if (!connectionState.isValid) {
        let position = {
          x: connectionState.fromNode.position.x + 500,
          y: connectionState.fromNode.position.y,
        };

        const spacingY = 250;
        const tolerance = 10;

        const adjustPosition = (pos: { x: number; y: number }) => {
          const doesNodeExist = nodes.some((node) => {
            const yDifference = Math.abs(node.position.y - pos.y);
            return node.position.x === pos.x && yDifference < tolerance;
          });

          if (doesNodeExist) {
            pos.y += spacingY;
            return adjustPosition(pos);
          }

          return pos;
        };

        position = adjustPosition(position);

        const data = {
          fromNode: connectionState.fromNode,
          position,
          handleId: connectionState.fromHandle.id,
          targetId: connectionState.fromNode.id,
        };

        setExternalOpen(data);
        setTimeout(() => {
          setIsOpen(true);
        }, 0);
      }
    },
    [setExternalOpen, nodes, setIsOpen, setPointerEvents]
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
    setIsOpen(false);
  }, [setMenu, setSelectedNode, setIsOpen]);

  return (
    <div className="container mx-auto p-6 bg-[#121212] min-h-screen rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Workflows</h1>
      </div>

      <div
        style={{ position: "relative", height: "70vh", width: "100%" }}
        ref={localRef}
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
          <Controls
            showInteractive={false}
            showFitView={false}
            orientation="vertical"
            position="bottom-right"
          />
          <HelperLines
            horizontal={helperLineHorizontal}
            vertical={helperLineVertical}
          />
          {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        </ReactFlow>

        <CanvaMenu
          externalOpen={externalOpen}
          setExternalOpen={setExternalOpen}
          handleAddNode={handleAddNode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div
          className="absolute left-0 top-0 z-10 h-full w-[380px] overflow-y-auto bg-gray-800 shadow-lg transition-transform ease-in-out"
          style={{
            transform: selectedNode ? "translateX(0)" : "translateX(-395px)",
          }}
        >
          {selectedNode ? (
            <>
              <div className="bg-green-800 p-4 text-center">
                {!editingLabel ? (
                  <div className="flex items-center justify-center text-xl font-bold text-gray-200">
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
                    className="w-full p-2 text-center text-xl font-bold bg-gray-800 text-gray-200"
                    onChange={(e) => {
                      handleUpdateNode({
                        ...selectedNode,
                        data: {
                          ...selectedNode.data,
                          label: e.target.value,
                        },
                      });
                    }}
                    onBlur={() => setEditingLabel(false)}
                  />
                )}
              </div>
              {selectedNode.type === "agent-node" && (
                <AgentForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={setIsOpen}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "condition-node" && (
                <ConditionForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={setIsOpen}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "message-node" && (
                <MessageForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={setIsOpen}
                  setSelectedNode={setSelectedNode}
                />
              )}
              {selectedNode.type === "delay-node" && (
                <DelayForm
                  selectedNode={selectedNode}
                  handleUpdateNode={handleUpdateNode}
                  setEdges={setEdges}
                  setIsOpen={setIsOpen}
                  setSelectedNode={setSelectedNode}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
});

Canva.displayName = "Canva";

export default Canva;
