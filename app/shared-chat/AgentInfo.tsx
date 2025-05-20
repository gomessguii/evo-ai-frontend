/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: shared-chat/AgentInfo.tsx                                            │
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Code,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Tag,
  Info,
  ArrowRight,
  Workflow,
  Bot,
  GitBranch,
  RefreshCw,
  Key,
  Users,
  BookOpenCheck,
} from "lucide-react";
import { Agent, AgentType } from "@/types/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AgentInfoProps {
  agent: Agent;
  isShared?: boolean;
}

export function AgentInfo({ agent, isShared = false }: AgentInfoProps) {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  const getAgentTypeInfo = () => {
    const types: Record<
      AgentType,
      { label: string; icon: React.ElementType; color: string }
    > = {
      llm: { label: "LLM Agent", icon: Code, color: "#00cc7d" },
      a2a: { label: "A2A Agent", icon: ExternalLink, color: "#3b82f6" },
      sequential: {
        label: "Sequential Agent",
        icon: ArrowRight,
        color: "#f59e0b",
      },
      parallel: { label: "Parallel Agent", icon: GitBranch, color: "#8b5cf6" },
      loop: { label: "Loop Agent", icon: RefreshCw, color: "#ec4899" },
      workflow: { label: "Workflow Agent", icon: Workflow, color: "#14b8a6" },
      task: { label: "Task Agent", icon: BookOpenCheck, color: "#00cc7d" },
    };

    return (
      types[agent.type as AgentType] || {
        label: agent.type,
        icon: Bot,
        color: "#00cc7d",
      }
    );
  };

  const agentTypeInfo = getAgentTypeInfo();
  const IconComponent = agentTypeInfo.icon;

  const getModelName = () => {
    if (agent.type === "llm" && agent.model) {
      return agent.model;
    }
    return "N/A";
  };

  const getCreatedAt = () => {
    if (!agent.created_at) return "Unknown";
    return new Date(agent.created_at).toLocaleDateString();
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

  const getSubAgents = () => {
    if (agent.config?.sub_agents) {
      return agent.config.sub_agents.length;
    }
    return 0;
  };

  const showAgentCard = () => {
    if (agent.agent_card_url) {
      setIsCardDialogOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="bg-[#182724] rounded-lg overflow-hidden border border-[#1e3a36] shadow-lg"
          style={{ backgroundColor: `${agentTypeInfo.color}15` }}
        >
          <div
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer transition-colors",
              "hover:bg-opacity-80"
            )}
            style={{ backgroundColor: `${agentTypeInfo.color}20` }}
          >
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: agentTypeInfo.color }}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-white text-lg">{agent.name}</h2>
              </div>
              <p className="text-xs text-emerald-400">{agentTypeInfo.label}</p>
            </div>
          </div>

          <div className="p-4 space-y-4 border-t border-[#1e3a36] animate-in fade-in-50 duration-200">
            {agent.description && (
              <p className="text-neutral-300 text-sm leading-relaxed">
                {agent.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141414] rounded p-3 flex flex-col justify-between">
                <span className="text-xs text-neutral-500 mb-1">Model</span>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-sm text-white truncate">
                    {getModelName()}
                  </span>
                </div>
              </div>

              <div className="bg-[#141414] rounded p-3 flex flex-col justify-between">
                <span className="text-xs text-neutral-500 mb-1">Created at</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-sm text-white">{getCreatedAt()}</span>
                </div>
              </div>

              {getTotalTools() > 0 && (
                <div className="bg-[#141414] rounded p-3 flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 mb-1">Tools</span>
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-sm text-white">
                      {getTotalTools()}
                    </span>
                  </div>
                </div>
              )}

              {getSubAgents() > 0 && (
                <div className="bg-[#141414] rounded p-3 flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 mb-1">Sub-agents</span>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-sm text-white">{getSubAgents()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-[#141414] rounded p-3">
              <div className="flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-neutral-400">Agent ID</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                {agent.id}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-[#182724] mt-2 border border-[#1e3a36]"
              disabled={!agent.agent_card_url}
              onClick={showAgentCard}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Agent Card
            </Button>
          </div>
        </div>

        <div className="bg-[#182724] rounded-lg overflow-hidden border border-[#1e3a36] p-4">
          <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-400" />
            Access Information
          </h3>

          <div className="space-y-2">
            <div className="bg-[#141414] rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-neutral-500">API Key</span>
                <Badge className="bg-emerald-900 text-emerald-400 text-xs">
                  {isShared ? "Shared" : "Not Shared"}
                </Badge>
              </div>
              <p className="text-xs font-mono text-emerald-400">
                {isShared ? "Shared" : "Not Shared"}
              </p>
            </div>

            <p className="text-xs text-neutral-500 mt-2">
              This is a {isShared ? "shared" : "not shared"} API key. Be careful when sharing it with third
              parties.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-neutral-900 border-neutral-800 text-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-emerald-400" />
              Agent Card
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {agent.agent_card_url && (
              <iframe
                src={agent.agent_card_url}
                className="w-full h-[50vh] border border-neutral-800 rounded-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollbarWidth: 'none' }}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => window.open(agent.agent_card_url, "_blank")}
              className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              onClick={() => setIsCardDialogOpen(false)}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
