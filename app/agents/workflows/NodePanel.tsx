"use client";

import type React from "react";
import { useState } from "react";
import {
  User,
  MessageSquare,
  Filter,
  Clock,
  Plus,
  MenuSquare,
  Layers,
  MoveRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDnD } from "@/contexts/DnDContext";

export function NodePanel() {
  const [activeTab, setActiveTab] = useState("content");
  const { setType } = useDnD();

  const nodeTypes = {
    content: [
      {
        id: "agent-node",
        name: "Agent",
        icon: User,
        color: "text-blue-400",
        bgColor: "bg-blue-950/40",
        borderColor: "border-blue-500/30",
        hoverColor: "group-hover:bg-blue-900/50",
        glowColor: "group-hover:shadow-blue-500/20",
        description: "Add an AI agent to process messages and execute tasks",
      },
      {
        id: "message-node",
        name: "Message",
        icon: MessageSquare,
        color: "text-orange-400",
        bgColor: "bg-orange-950/40",
        borderColor: "border-orange-500/30",
        hoverColor: "group-hover:bg-orange-900/50",
        glowColor: "group-hover:shadow-orange-500/20",
        description: "Send a message to users or other nodes in the workflow",
      },
    ],
    logic: [
      {
        id: "condition-node",
        name: "Condition",
        icon: Filter,
        color: "text-purple-400",
        bgColor: "bg-purple-950/40",
        borderColor: "border-purple-500/30",
        hoverColor: "group-hover:bg-purple-900/50",
        glowColor: "group-hover:shadow-purple-500/20",
        description:
          "Create a decision point with multiple outcomes based on conditions",
      },
      {
        id: "delay-node",
        name: "Delay",
        icon: Clock,
        color: "text-yellow-400",
        bgColor: "bg-yellow-950/40",
        borderColor: "border-yellow-500/30",
        hoverColor: "group-hover:bg-yellow-900/50",
        glowColor: "group-hover:shadow-yellow-500/20",
        description: "Add a time delay between workflow operations",
      },
    ],
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    setType(nodeType);
  };

  const handleNodeAdd = (nodeType: string) => {
    setType(nodeType);
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl w-[320px] transition-all duration-300 ease-in-out overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-slate-200">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h3 className="font-medium">Workflow Nodes</h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Drag nodes to the canvas or click to add
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full bg-slate-800/50 grid grid-cols-2 p-1 rounded-lg">
            <TabsTrigger
              value="content"
              className={cn(
                "rounded-md text-xs font-medium transition-all",
                "data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900/30 data-[state=active]:to-indigo-900/30",
                "data-[state=active]:text-blue-300 data-[state=active]:shadow-sm",
                "data-[state=inactive]:text-slate-400"
              )}
            >
              <MenuSquare className="h-3.5 w-3.5 mr-1.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="logic"
              className={cn(
                "rounded-md text-xs font-medium transition-all",
                "data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-900/30 data-[state=active]:to-orange-900/30",
                "data-[state=active]:text-yellow-300 data-[state=active]:shadow-sm",
                "data-[state=inactive]:text-slate-400"
              )}
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Logic
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="p-3 space-y-2 mt-0">
          {nodeTypes.content.map((node) => (
            <TooltipProvider key={node.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(event) => onDragStart(event, node.id)}
                    className={cn(
                      "group flex items-center gap-3 p-3.5 border rounded-lg cursor-grab transition-all duration-300",
                      "backdrop-blur-sm hover:shadow-lg",
                      node.borderColor,
                      node.bgColor,
                      node.glowColor
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
                        "bg-slate-800/80 group-hover:scale-105",
                        node.hoverColor
                      )}
                    >
                      <node.icon className={cn("h-5 w-5", node.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn("font-medium block text-sm", node.color)}
                      >
                        {node.name}
                      </span>
                      <span className="text-xs text-slate-400 truncate block">
                        {node.description}
                      </span>
                    </div>
                    <div
                      onClick={() => handleNodeAdd(node.id)}
                      className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-md bg-slate-800/60 text-slate-400",
                        "hover:bg-gradient-to-r hover:text-white transition-all",
                        node.id === "agent-node"
                          ? "hover:from-blue-800 hover:to-blue-600"
                          : "hover:from-orange-800 hover:to-orange-600"
                      )}
                    >
                      <Plus size={16} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-slate-900 border-slate-700 text-slate-200"
                >
                  <div className="p-1 max-w-[200px]">
                    <p className="font-medium text-sm">{node.name} Node</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {node.description}
                    </p>
                    <div className="flex items-center mt-2 pt-2 border-t border-slate-700/50 text-xs text-slate-400">
                      <MoveRight className="h-3 w-3 mr-1.5" />
                      <span>Drag to canvas or click + to add</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </TabsContent>

        <TabsContent value="logic" className="p-3 space-y-2 mt-0">
          {nodeTypes.logic.map((node) => (
            <TooltipProvider key={node.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    draggable
                    onDragStart={(event) => onDragStart(event, node.id)}
                    className={cn(
                      "group flex items-center gap-3 p-3.5 border rounded-lg cursor-grab transition-all duration-300",
                      "backdrop-blur-sm hover:shadow-lg",
                      node.borderColor,
                      node.bgColor,
                      node.glowColor
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
                        "bg-slate-800/80 group-hover:scale-105",
                        node.hoverColor
                      )}
                    >
                      <node.icon className={cn("h-5 w-5", node.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn("font-medium block text-sm", node.color)}
                      >
                        {node.name}
                      </span>
                      <span className="text-xs text-slate-400 truncate block">
                        {node.description}
                      </span>
                    </div>
                    <div
                      onClick={() => handleNodeAdd(node.id)}
                      className={cn(
                        "flex items-center justify-center h-7 w-7 rounded-md bg-slate-800/60 text-slate-400",
                        "hover:bg-gradient-to-r hover:text-white transition-all",
                        node.id === "condition-node"
                          ? "hover:from-purple-800 hover:to-purple-600"
                          : "hover:from-yellow-800 hover:to-yellow-600"
                      )}
                    >
                      <Plus size={16} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-slate-900 border-slate-700 text-slate-200"
                >
                  <div className="p-1 max-w-[200px]">
                    <p className="font-medium text-sm">{node.name} Node</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {node.description}
                    </p>
                    <div className="flex items-center mt-2 pt-2 border-t border-slate-700/50 text-xs text-slate-400">
                      <MoveRight className="h-3 w-3 mr-1.5" />
                      <span>Drag to canvas or click + to add</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
