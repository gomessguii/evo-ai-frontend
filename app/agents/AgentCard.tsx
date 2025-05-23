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
  ArrowRight,
  Bot,
  BookOpenCheck,
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
  Download,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { exportAsJson } from "@/lib/utils";

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
  agents: Agent[];
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
  agents,
}: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const getAgentTypeInfo = (type: AgentType) => {
    const types: Record<
      string,
      {
        label: string;
        icon: React.ElementType;
        color: string;
        bgColor: string;
        badgeClass: string;
      }
    > = {
      llm: {
        label: "LLM Agent",
        icon: Code,
        color: "#00cc7d",
        bgColor: "bg-green-500/10",
        badgeClass:
          "bg-green-900/30 text-green-400 border-green-600/30 hover:bg-green-900/40",
      },
      a2a: {
        label: "A2A Agent",
        icon: ExternalLink,
        color: "#6366f1",
        bgColor: "bg-indigo-500/10",
        badgeClass:
          "bg-indigo-900/30 text-indigo-400 border-indigo-600/30 hover:bg-indigo-900/40",
      },
      sequential: {
        label: "Sequential Agent",
        icon: ArrowRight,
        color: "#f59e0b",
        bgColor: "bg-yellow-500/10",
        badgeClass:
          "bg-yellow-900/30 text-yellow-400 border-yellow-600/30 hover:bg-yellow-900/40",
      },
      parallel: {
        label: "Parallel Agent",
        icon: GitBranch,
        color: "#8b5cf6",
        bgColor: "bg-purple-500/10",
        badgeClass:
          "bg-purple-900/30 text-purple-400 border-purple-600/30 hover:bg-purple-900/40",
      },
      loop: {
        label: "Loop Agent",
        icon: RefreshCw,
        color: "#ec4899",
        bgColor: "bg-pink-500/10",
        badgeClass:
          "bg-orange-900/30 text-orange-400 border-orange-600/30 hover:bg-orange-900/40",
      },
      workflow: {
        label: "Workflow Agent",
        icon: Workflow,
        color: "#3b82f6",
        bgColor: "bg-blue-500/10",
        badgeClass:
          "bg-blue-900/30 text-blue-400 border-blue-700/40 hover:bg-blue-900/40",
      },
      task: {
        label: "Task Agent",
        icon: BookOpenCheck,
        color: "#ef4444",
        bgColor: "bg-red-500/10",
        badgeClass:
          "bg-red-900/30 text-red-400 border-red-600/30 hover:bg-red-900/40",
      },
    };

    return (
      types[type] || {
        label: type,
        icon: Bot,
        color: "#94a3b8",
        bgColor: "bg-slate-500/10",
        badgeClass:
          "bg-slate-900/30 text-slate-400 border-slate-600/30 hover:bg-slate-900/40",
      }
    );
  };

  const getAgentTypeIcon = (type: AgentType) => {
    const typeInfo = getAgentTypeInfo(type);
    const IconComponent = typeInfo.icon;
    return (
      <IconComponent className="h-5 w-5" style={{ color: typeInfo.color }} />
    );
  };

  const getAgentTypeName = (type: AgentType) => {
    return getAgentTypeInfo(type).label;
  };

  const getAgentTypeBgColor = (type: AgentType) => {
    return getAgentTypeInfo(type).bgColor;
  };

  const getAgentTypeBadgeClass = (type: AgentType) => {
    return getAgentTypeInfo(type).badgeClass;
  };

  const getFolderNameById = (id: string) => {
    const folder = folders?.find((f) => f.id === id);
    return folder?.name || id;
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

  // Função para exportar o agente como JSON
  const handleExportAgent = () => {
    try {
      exportAsJson(
        agent,
        `agent-${agent.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${agent.id.substring(0, 8)}`,
        true,
        agents
      );
    } catch (error) {
      console.error("Error exporting agent:", error);
    }
  };

  // Função para testar o agente A2A no laboratório
  const handleTestA2A = () => {
    // Usar a URL do agent card como URL base para testes A2A
    const agentUrl = agent.agent_card_url?.replace(
      "/.well-known/agent.json",
      ""
    );

    // Usar a API key diretamente do config do agente
    const apiKey = agent.config?.api_key;

    // Construir a URL com parâmetros para o laboratório de testes
    const params = new URLSearchParams();

    if (agentUrl) {
      params.set("agent_url", agentUrl);
    }

    if (apiKey) {
      params.set("api_key", apiKey);
    }

    // Redirecionar para o laboratório de testes na aba "lab"
    const testUrl = `/documentation?${params.toString()}#lab`;

    router.push(testUrl);
  };

  return (
    <Card className="w-full overflow-hidden border border-zinc-800 shadow-lg bg-gradient-to-br from-zinc-800 to-zinc-900">
      <div
        className={cn(
          "p-4 flex justify-between items-center border-b border-zinc-800",
          getAgentTypeBgColor(agent.type)
        )}
      >
        <div className="flex items-center gap-2">
          {getAgentTypeIcon(agent.type)}
          <h3 className="font-medium text-white">{agent.name}</h3>
        </div>
        <Badge
          variant="outline"
          className={cn("border", getAgentTypeBadgeClass(agent.type))}
        >
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

        <div
          className={cn(
            "p-4 flex justify-between items-center",
            getAgentTypeBgColor(agent.type),
            "bg-opacity-20"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Model:</span>
            <span className="text-xs font-medium text-zinc-300">
              {agent.type === "llm" ? agent.model : "N/A"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn("p-0 h-auto", {
              "text-green-400 hover:text-green-300": agent.type === "llm",
              "text-indigo-400 hover:text-indigo-300": agent.type === "a2a",
              "text-yellow-400 hover:text-yellow-300":
                agent.type === "sequential",
              "text-purple-400 hover:text-purple-300":
                agent.type === "parallel",
              "text-orange-400 hover:text-orange-300": agent.type === "loop",
              "text-blue-400 hover:text-blue-300": agent.type === "workflow",
              "text-red-400 hover:text-red-300": agent.type === "task",
              "text-zinc-400 hover:text-white": ![
                "llm",
                "a2a",
                "sequential",
                "parallel",
                "loop",
                "workflow",
                "task",
              ].includes(agent.type),
            })}
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
                  className={cn(
                    "h-5 px-2 bg-transparent",
                    getAgentTypeBadgeClass(agent.type)
                  )}
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
                  className={cn(
                    "h-5 px-2 bg-transparent",
                    getAgentTypeBadgeClass(agent.type)
                  )}
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
              className="bg-zinc-900 border-zinc-700"
              side="bottom"
              align="end"
            >
              <DropdownMenuItem
                className="text-white hover:bg-zinc-800 cursor-pointer"
                onClick={handleTestA2A}
              >
                <FlaskConical className="h-4 w-4 mr-2 text-emerald-400" />
                Test A2A
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:bg-zinc-800 cursor-pointer"
                onClick={() => onEdit(agent)}
              >
                <Pencil className="h-4 w-4 mr-2 text-emerald-400" />
                Edit Agent
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:bg-zinc-800 cursor-pointer"
                onClick={() => onMove(agent)}
              >
                <MoveRight className="h-4 w-4 mr-2 text-yellow-400" />
                Move Agent
              </DropdownMenuItem>
              {onWorkflow && agent.type === "workflow" && (
                <DropdownMenuItem
                  className="text-white hover:bg-zinc-800 cursor-pointer"
                  onClick={() => onWorkflow(agent.id)}
                >
                  <Workflow className="h-4 w-4 mr-2 text-blue-400" />
                  Open Workflow
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-white hover:bg-zinc-800 cursor-pointer"
                onClick={handleExportAgent}
              >
                <Download className="h-4 w-4 mr-2 text-purple-400" />
                Export as JSON
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem
                  className="text-white hover:bg-zinc-800 cursor-pointer"
                  onClick={() => onShare(agent)}
                >
                  <Share2 className="h-4 w-4 mr-2 text-blue-400" />
                  Share Agent
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-500 hover:bg-zinc-800 cursor-pointer"
                onClick={() => onDelete(agent)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="w-px bg-zinc-800" />
          <a
            href={agent.agent_card_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center rounded-none h-12 hover:bg-zinc-800",
              {
                "text-green-400 hover:text-green-300": agent.type === "llm",
                "text-indigo-400 hover:text-indigo-300": agent.type === "a2a",
                "text-yellow-400 hover:text-yellow-300":
                  agent.type === "sequential",
                "text-purple-400 hover:text-purple-300":
                  agent.type === "parallel",
                "text-orange-400 hover:text-orange-300": agent.type === "loop",
                "text-blue-400 hover:text-blue-300": agent.type === "workflow",
                "text-red-400 hover:text-red-300": agent.type === "task",
              }
            )}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Agent Card
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
