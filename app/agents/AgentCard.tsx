/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/AgentCard.tsx                                             │
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
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder } from "@/services/agentService";
import { Agent, AgentType } from "@/types/agent";
import { MCPServer } from "@/types/mcpServer";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  GitBranch,
  MoveRight,
  Pencil,
  RefreshCw,
  Settings,
  Share2,
  Trash2,
  Workflow,
  TextSelect,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onMove: (agent: Agent) => void;
  onShare?: (agent: Agent) => void;
  onWorkflow?: (agentId: string) => void;
  availableMCPs?: MCPServer[];
  getApiKeyNameById?: (id: string | undefined) => string | null;
  getAgentNameById?: (id: string) => string;
  folders?: Folder[];
}

export function AgentCard({
  agent,
  onEdit,
  onDelete,
  onMove,
  onShare,
  onWorkflow,
  availableMCPs = [],
  getApiKeyNameById = () => null,
  getAgentNameById = (id) => id,
  folders = [],
}: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const getAgentTypeIcon = (type: AgentType) => {
    const agentTypes = [
      { value: "llm", icon: Code },
      { value: "a2a", icon: ExternalLink },
      { value: "sequential", icon: Workflow },
      { value: "parallel", icon: GitBranch },
      { value: "loop", icon: RefreshCw },
      { value: "workflow", icon: Workflow },
    ];

    const agentType = agentTypes.find((t) => t.value === type);
    if (agentType) {
      const IconComponent = agentType.icon;
      return <IconComponent className="h-5 w-5 text-white" />;
    }
    return <Bot className="h-5 w-5 text-white" />;
  };

  const getFolderNameById = (id: string) => {
    const folder = folders?.find((f) => f.id === id);
    return folder?.name || id;
  };

  const getAgentTypeName = (type: AgentType) => {
    const agentTypes = [
      { value: "llm", label: "LLM Agent" },
      { value: "a2a", label: "A2A Agent" },
      { value: "sequential", label: "Sequential Agent" },
      { value: "parallel", label: "Parallel Agent" },
      { value: "loop", label: "Loop Agent" },
      { value: "workflow", label: "Workflow Agent" },
      { value: "task", label: "Task Agent" },
    ];
    return agentTypes.find((t) => t.value === type)?.label || type;
  };

  const getTotalTools = () => {
    if (agent.type === "llm" && agent.config?.mcp_servers) {
      return agent.config.mcp_servers.reduce(
        (total, mcp) => total + (mcp.tools?.length || 0),
        0
      );
    }
    return 0;
  };

  const getCreatedAtFormatted = () => {
    return new Date(agent.created_at).toLocaleDateString();
  };

  return (
    <Card className="w-full overflow-hidden border border-zinc-800 shadow-lg bg-gradient-to-br from-zinc-800 to-zinc-900">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getAgentTypeIcon(agent.type)}
          <h3 className="font-medium text-white">{agent.name}</h3>
        </div>
        <Badge className="bg-emerald-800 hover:bg-emerald-700 text-white border-0">
          {getAgentTypeName(agent.type)}
        </Badge>
      </div>

      <CardContent className="p-0">
        <div className="p-4 border-b border-zinc-800">
          <p className="text-sm text-zinc-300">
            {agent.description && agent.description.length > 100
              ? `${agent.description.substring(0, 100)}...`
              : agent.description}
          </p>
        </div>

        <div className="p-4 bg-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Model:</span>
            <span className="text-xs font-medium text-zinc-300">
              {agent.type === "llm" ? agent.model : "N/A"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white p-0 h-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="ml-1 text-xs">{expanded ? "Less" : "More"}</span>
          </Button>
        </div>

        {expanded && (
          <div className="p-4 bg-zinc-950 text-xs space-y-3 animate-in fade-in-50 duration-200">
            {agent.folder_id && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Folder:</span>
                <Badge
                  variant="outline"
                  className="h-5 px-2 bg-transparent text-emerald-400 border-emerald-800"
                >
                  {getFolderNameById(agent.folder_id)}
                </Badge>
              </div>
            )}

            {agent.type === "llm" && agent.api_key_id && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">API Key:</span>
                <Badge
                  variant="outline"
                  className="h-5 px-2 bg-transparent text-emerald-400 border-emerald-800"
                >
                  {getApiKeyNameById(agent.api_key_id)}
                </Badge>
              </div>
            )}

            {getTotalTools() > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Tools:</span>
                <span className="text-zinc-300">{getTotalTools()}</span>
              </div>
            )}

            {agent.config?.sub_agents && agent.config.sub_agents.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Sub-agents:</span>
                <span className="text-zinc-300">
                  {agent.config.sub_agents.length}
                </span>
              </div>
            )}

            {agent.type === "workflow" && agent.config?.workflow && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Elements:</span>
                <span className="text-zinc-300">
                  {agent.config.workflow.nodes?.length || 0} nodes,{" "}
                  {agent.config.workflow.edges?.length || 0} connections
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Created at:</span>
              <span className="text-zinc-300">{getCreatedAtFormatted()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-500">ID:</span>
              <span className="text-zinc-300 text-[10px]">{agent.id}</span>
            </div>
          </div>
        )}

        <div className="flex border-t border-zinc-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 rounded-none h-12 text-zinc-400 hover:text-white hover:bg-zinc-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800 text-zinc-300"
            >
              {agent.type === "workflow" && onWorkflow && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white group"
                  onClick={() => onWorkflow(agent.id)}
                >
                  <Workflow className="h-4 w-4 mr-2 text-zinc-300 group-hover:text-white" />
                  <span className="text-zinc-300 group-hover:text-white">Open Workflow</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white group"
                onClick={() =>
                  router.push(
                    `/documentation?agent_url=${agent.agent_card_url?.replace("/.well-known/agent.json", "") || ""}&api_key=${agent.config?.api_key}`
                  )
                }
              >
                <TextSelect className="h-4 w-4 mr-2 text-zinc-300 group-hover:text-white" />
                <span className="text-zinc-300 group-hover:text-white">Test A2A</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white group"
                onClick={() => onEdit(agent)}
              >
                <Pencil className="h-4 w-4 mr-2 text-zinc-300 group-hover:text-white" />
                <span className="text-zinc-300 group-hover:text-white">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white group"
                onClick={() => onMove(agent)}
              >
                <MoveRight className="h-4 w-4 mr-2 text-zinc-300 group-hover:text-white" />
                <span className="text-zinc-300 group-hover:text-white">Move to Folder</span>
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white group"
                  onClick={() => onShare(agent)}
                >
                  <Share2 className="h-4 w-4 mr-2 text-zinc-300 group-hover:text-white" />
                  <span className="text-zinc-300 group-hover:text-white">Share</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer text-red-500 hover:bg-zinc-800 hover:text-red-400 focus:bg-zinc-800 group"
                onClick={() => onDelete(agent)}
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-500 group-hover:text-red-400" />
                <span className="text-red-500 group-hover:text-red-400">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-px bg-zinc-800" />
          <a
            href={agent.agent_card_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center rounded-none h-12 text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Agent Card
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
