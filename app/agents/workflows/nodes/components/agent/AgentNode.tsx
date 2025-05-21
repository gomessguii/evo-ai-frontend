/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/agent/AgentNode.tsx            │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: May 13, 2025                                                  │
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, NodeProps, Position, useEdges } from "@xyflow/react";
import { MessageCircle, User, Code, ExternalLink, Workflow, GitBranch, RefreshCw, BookOpenCheck, ArrowRight } from "lucide-react";
import { Agent } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { BaseNode } from "../../BaseNode";

export function AgentNode(props: NodeProps) {
  const { selected, data } = props;

  const edges = useEdges();

  const isHandleConnected = (handleId: string) => {
    return edges.some(
      (edge) => edge.source === props.id && edge.sourceHandle === handleId
    );
  };

  const isBottomHandleConnected = isHandleConnected("bottom-handle");
  
  const agent = data.agent as Agent | undefined;
  const isExecuting = data.isExecuting as boolean | undefined;

  const getAgentTypeName = (type: string) => {
    const agentTypes: Record<string, string> = {
      llm: "LLM Agent",
      a2a: "A2A Agent",
      sequential: "Sequential Agent",
      parallel: "Parallel Agent",
      loop: "Loop Agent",
      workflow: "Workflow Agent",
      task: "Task Agent",
    };
    return agentTypes[type] || type;
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case "llm":
        return <Code className="h-4 w-4 text-green-400" />;
      case "a2a":
        return <ExternalLink className="h-4 w-4 text-indigo-400" />;
      case "sequential":
        return <Workflow className="h-4 w-4 text-yellow-400" />;
      case "parallel":
        return <GitBranch className="h-4 w-4 text-purple-400" />;
      case "loop":
        return <RefreshCw className="h-4 w-4 text-orange-400" />;
      case "workflow":
        return <Workflow className="h-4 w-4 text-blue-400" />;
      case "task":
        return <BookOpenCheck className="h-4 w-4 text-red-400" />;
      default:
        return <User className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getModelBadgeColor = (model: string) => {
    if (model?.includes('gpt-4')) return 'bg-green-900/30 text-green-400 border-green-600/30';
    if (model?.includes('gpt-3')) return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30';
    if (model?.includes('claude')) return 'bg-orange-900/30 text-orange-400 border-orange-600/30';
    if (model?.includes('gemini')) return 'bg-blue-900/30 text-blue-400 border-blue-600/30';
    return 'bg-neutral-800 text-neutral-400 border-neutral-600/50';
  };

  return (
    <BaseNode hasTarget={true} selected={selected || false} borderColor="blue" isExecuting={isExecuting}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/40 shadow-sm">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-blue-400">
              {data.label as string}
            </p>
          </div>
        </div>
      </div>

      {agent ? (
        <div className="mb-3 rounded-lg border border-blue-700/40 bg-blue-950/10 p-3 transition-all duration-200 hover:border-blue-600/50 hover:bg-blue-900/10">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center">
                {getAgentTypeIcon(agent.type)}
                <span className="ml-1.5 font-medium text-white">{agent.name}</span>
              </div>
              <Badge
                variant="outline"
                className="px-1.5 py-0 text-xs bg-blue-900/30 text-blue-400 border-blue-700/40"
              >
                {getAgentTypeName(agent.type)}
              </Badge>
            </div>
            
            {agent.model && (
              <div className="mt-2 flex items-center">
                <Badge
                  variant="outline"
                  className={cn("px-1.5 py-0 text-xs", getModelBadgeColor(agent.model))}
                >
                  {agent.model}
                </Badge>
              </div>
            )}
            
            {agent.description && (
              <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                {agent.description.slice(0, 30)} {agent.description.length > 30 && '...'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-700/40 bg-blue-950/10 p-5 text-center transition-all duration-200 hover:border-blue-600/50 hover:bg-blue-900/20">
          <User className="h-8 w-8 text-blue-700/50 mb-2" />
          <p className="text-blue-400">Select an agent</p>
          <p className="mt-1 text-xs text-neutral-500">Click to configure</p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-end text-sm text-neutral-400 transition-colors">
        <div className="flex items-center space-x-1 rounded-md py-1 px-2">
          <span>Next step</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        <Handle
          className={cn(
            "!w-3 !h-3 !rounded-full transition-all duration-300",
            isBottomHandleConnected ? "!bg-blue-500 !border-blue-400" : "!bg-neutral-400 !border-neutral-500",
            selected && isBottomHandleConnected && "!bg-blue-400 !border-blue-300"
          )}
          style={{
            right: "-8px",
            top: "calc(100% - 25px)",
          }}
          type="source"
          position={Position.Right}
          id="bottom-handle"
        />
      </div>
    </BaseNode>
  );
}
