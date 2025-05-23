/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/forms/SubAgentsTab.tsx                                    │
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

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agent } from "@/types/agent";
import { listAgents } from "@/services/agentService";
import { Loader2, Search, X } from "lucide-react";

interface SubAgentsTabProps {
  values: Partial<Agent>;
  onChange: (values: Partial<Agent>) => void;
  getAgentNameById: (id: string) => string;
  editingAgentId?: string;
  clientId: string;
}

export function SubAgentsTab({
  values,
  onChange,
  getAgentNameById,
  editingAgentId,
  clientId,
}: SubAgentsTabProps) {
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Get folder ID from current agent
  const folderId = values.folder_id;
  
  useEffect(() => {
    loadAgents();
  }, [clientId, folderId, editingAgentId]);
  
  const loadAgents = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      const res = await listAgents(
        clientId,
        0,
        100,
        folderId || undefined
      );
      
      // Filter out the current agent to avoid self-reference
      const filteredAgents = res.data.filter(agent => 
        agent.id !== editingAgentId
      );
      
      setAvailableAgents(filteredAgents);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubAgent = (agentId: string) => {
    if (!values.config?.sub_agents?.includes(agentId)) {
      onChange({
        ...values,
        config: {
          ...values.config,
          sub_agents: [...(values.config?.sub_agents || []), agentId],
        },
      });
    }
  };

  const handleRemoveSubAgent = (agentId: string) => {
    onChange({
      ...values,
      config: {
        ...values.config,
        sub_agents:
          values.config?.sub_agents?.filter((id) => id !== agentId) || [],
      },
    });
  };
  
  const filteredAgents = availableAgents.filter(agent => 
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Sub-Agents</h3>
        <div className="text-sm text-neutral-400">
          {values.config?.sub_agents?.length || 0} sub-agents selected
        </div>
      </div>

      <div className="border border-[#444] rounded-md p-4 bg-[#222]">
        <p className="text-sm text-neutral-400 mb-4">
          Select the agents that will be used as sub-agents.
        </p>

        {values.config?.sub_agents && values.config.sub_agents.length > 0 ? (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-white">
              Selected sub-agents:
            </h4>
            <div className="flex flex-wrap gap-2">
              {values.config.sub_agents.map((agentId) => (
                <Badge
                  key={agentId}
                  variant="secondary"
                  className="flex items-center gap-1 bg-[#333] text-emerald-400"
                >
                  {getAgentNameById(agentId)}
                  <button
                    onClick={() => handleRemoveSubAgent(agentId)}
                    className="ml-1 h-4 w-4 rounded-full hover:bg-[#444] inline-flex items-center justify-center"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-400 mb-4">
            No sub-agents selected
          </div>
        )}

        <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">
          Available agents:
        </h4>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search agents by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#1a1a1a] border-[#444] text-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
            <div className="mt-2 text-sm text-neutral-400">Loading agents...</div>
          </div>
        ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-4 text-neutral-400">
                {search ? `No agents found matching "${search}"` : "No other agents found in this folder"}
              </div>
            ) : (
              filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-2 hover:bg-[#2a2a2a] rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{agent.name}</span>
                  <Badge
                    variant="outline"
                    className="ml-2 border-[#444] text-emerald-400"
                  >
                    {agent.type === "llm"
                      ? "LLM Agent"
                      : agent.type === "a2a"
                      ? "A2A Agent"
                      : agent.type === "sequential"
                      ? "Sequential Agent"
                      : agent.type === "parallel"
                      ? "Parallel Agent"
                      : agent.type === "loop"
                      ? "Loop Agent"
                      : agent.type === "workflow"
                      ? "Workflow Agent"
                      : agent.type === "task"
                      ? "Task Agent"
                      : agent.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddSubAgent(agent.id)}
                  disabled={values.config?.sub_agents?.includes(agent.id)}
                  className={
                    values.config?.sub_agents?.includes(agent.id)
                      ? "text-neutral-500 bg-[#222] hover:bg-[#333]"
                      : "text-emerald-400 hover:bg-[#333] bg-[#222]"
                  }
                >
                  {values.config?.sub_agents?.includes(agent.id)
                    ? "Added"
                    : "Add"}
                </Button>
              </div>
              ))
            )}
        </div>
        )}
      </div>
    </div>
  );
}
