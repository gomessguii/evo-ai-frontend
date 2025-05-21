/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/AgentList.tsx                                             │
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

import { Agent } from "@/types/agent";
import { MCPServer } from "@/types/mcpServer";
import { AgentCard } from "./AgentCard";
import { EmptyState } from "./EmptyState";
import { ApiKey, Folder } from "@/services/agentService";

interface AgentListProps {
  agents: Agent[];
  isLoading: boolean;
  searchTerm: string;
  selectedFolderId: string | null;
  availableMCPs: MCPServer[];
  getApiKeyNameById: (id: string | undefined) => string | null;
  getAgentNameById: (id: string) => string;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onMove: (agent: Agent) => void;
  onShare?: (agent: Agent) => void;
  onWorkflow?: (agentId: string) => void;
  onClearSearch?: () => void;
  onCreateAgent?: () => void;
  apiKeys: ApiKey[];
  folders: Folder[];
}

export function AgentList({
  agents,
  isLoading,
  searchTerm,
  selectedFolderId,
  availableMCPs,
  getApiKeyNameById,
  getAgentNameById,
  onEdit,
  onDelete,
  onMove,
  onShare,
  onWorkflow,
  onClearSearch,
  onCreateAgent,
  apiKeys,
  folders,
}: AgentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (agents.length === 0) {
    if (searchTerm) {
      return (
        <EmptyState
          type="search-no-results"
          searchTerm={searchTerm}
          onAction={onClearSearch}
        />
      );
    } else if (selectedFolderId) {
      return (
        <EmptyState
          type="empty-folder"
          onAction={onCreateAgent}
          actionLabel="Create Agent"
        />
      );
    } else {
      return (
        <EmptyState
          type="no-agents"
          onAction={onCreateAgent}
          actionLabel="Create Agent"
        />
      );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          onShare={onShare}
          onWorkflow={onWorkflow}
          availableMCPs={availableMCPs}
          getApiKeyNameById={getApiKeyNameById}
          getAgentNameById={getAgentNameById}
          folders={folders}
          agents={agents}
        />
      ))}
    </div>
  );
}
