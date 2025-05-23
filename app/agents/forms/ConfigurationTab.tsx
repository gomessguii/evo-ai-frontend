/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/forms/ConfigurationTab.tsx                                │
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
import { Agent } from "@/types/agent";
import { MCPServer } from "@/types/mcpServer";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Server,
  Settings,
  X,
} from "lucide-react";
import { ParallelAgentConfig } from "../config/ParallelAgentConfig";
import { SequentialAgentConfig } from "../config/SequentialAgentConfig";
import { ApiKey } from "@/services/agentService";
import { LoopAgentConfig } from "../config/LoopAgentConfig copy";
import { A2AAgentConfig } from "../config/A2AAgentConfig";
import { TaskAgentConfig } from "../config/TaskAgentConfig";
import { useState } from "react";
import { MCPDialog } from "../dialogs/MCPDialog";
import { CustomMCPDialog } from "../dialogs/CustomMCPDialog";
import { AgentToolDialog } from "../dialogs/AgentToolDialog";
import { CustomToolDialog } from "../dialogs/CustomToolDialog";
import { useToast } from "@/hooks/use-toast";

interface ConfigurationTabProps {
  values: Partial<Agent>;
  onChange: (values: Partial<Agent>) => void;
  agents: Agent[];
  availableMCPs: MCPServer[];
  apiKeys: ApiKey[];
  availableModels: any[];
  getAgentNameById: (id: string) => string;
  onOpenApiKeysDialog: () => void;
  onConfigureMCP: (mcpConfig: any) => void;
  onRemoveMCP: (mcpId: string) => void;
  onConfigureCustomMCP: (customMCP: any) => void;
  onRemoveCustomMCP: (url: string) => void;
  onOpenMCPDialog: (mcpConfig?: any) => void;
  onOpenCustomMCPDialog: (customMCP?: any) => void;
  clientId: string;
}

export function ConfigurationTab({
  values,
  onChange,
  agents,
  availableMCPs,
  apiKeys,
  availableModels,
  getAgentNameById,
  onOpenApiKeysDialog,
  onConfigureMCP,
  onRemoveMCP,
  onConfigureCustomMCP,
  onRemoveCustomMCP,
  onOpenMCPDialog,
  onOpenCustomMCPDialog,
  clientId,
}: ConfigurationTabProps) {
  const [agentToolDialogOpen, setAgentToolDialogOpen] = useState(false);
  const [customToolDialogOpen, setCustomToolDialogOpen] = useState(false);
  const [editingCustomTool, setEditingCustomTool] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCardUrl, setCopiedCardUrl] = useState(false);
  const { toast } = useToast();

  const handleAddAgentTool = (tool: { id: string }) => {
    const updatedAgentTools = [...(values.config?.agent_tools || [])];
    if (!updatedAgentTools.includes(tool.id)) {
      updatedAgentTools.push(tool.id);
      onChange({
        ...values,
        config: {
          ...(values.config || {}),
          agent_tools: updatedAgentTools,
        },
      });
    }
  };
  const handleRemoveAgentTool = (id: string) => {
    onChange({
      ...values,
      config: {
        ...(values.config || {}),
        agent_tools: (values.config?.agent_tools || []).filter(
          (toolId) => toolId !== id
        ),
      },
    });
  };

  // Custom Tools handlers
  const handleAddCustomTool = (tool: any) => {
    const updatedTools = [...(values.config?.custom_tools?.http_tools || [])];
    updatedTools.push(tool);
    onChange({
      ...values,
      config: {
        ...(values.config || {}),
        custom_tools: {
          ...(values.config?.custom_tools || { http_tools: [] }),
          http_tools: updatedTools,
        },
      },
    });
  };
  const handleEditCustomTool = (tool: any, idx: number) => {
    setEditingCustomTool({ ...tool, idx });
    setCustomToolDialogOpen(true);
  };
  const handleSaveEditCustomTool = (tool: any) => {
    const updatedTools = [...(values.config?.custom_tools?.http_tools || [])];
    if (editingCustomTool && typeof editingCustomTool.idx === "number") {
      updatedTools[editingCustomTool.idx] = tool;
    }
    onChange({
      ...values,
      config: {
        ...(values.config || {}),
        custom_tools: {
          ...(values.config?.custom_tools || { http_tools: [] }),
          http_tools: updatedTools,
        },
      },
    });
    setEditingCustomTool(null);
  };
  const handleRemoveCustomTool = (idx: number) => {
    const updatedTools = [...(values.config?.custom_tools?.http_tools || [])];
    updatedTools.splice(idx, 1);
    onChange({
      ...values,
      config: {
        ...(values.config || {}),
        custom_tools: {
          ...(values.config?.custom_tools || { http_tools: [] }),
          http_tools: updatedTools,
        },
      },
    });
  };

  const apiKeyField = (
    <div className="space-y-2 mb-4">
      <h3 className="text-lg font-medium text-white">Credentials</h3>
      <div className="border border-[#444] rounded-md p-4 bg-[#222] flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm text-neutral-400 mb-1"
            htmlFor="agent-card-url"
          >
            Agent URL. This URL can be used to access the agent card externally.
          </label>
          <div className="relative flex items-center">
            <input
              id="agent-card-url"
              type="text"
              className="w-full bg-[#2a2a2a] border border-[#444] rounded-md px-3 py-2 text-white pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              value={
                values?.agent_card_url?.replace(
                  "/.well-known/agent.json",
                  ""
                ) || ""
              }
              disabled
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-2 text-neutral-400 hover:text-emerald-400 px-1 py-1"
              onClick={async () => {
                if (values?.agent_card_url) {
                  await navigator.clipboard.writeText(
                    values.agent_card_url.replace("/.well-known/agent.json", "")
                  );
                  setCopiedCardUrl(true);
                  setTimeout(() => setCopiedCardUrl(false), 1200);
                  toast({
                    title: "Copied!",
                    description:
                      "The agent URL was copied to the clipboard.",
                  });
                }
              }}
              tabIndex={-1}
            >
              {copiedCardUrl ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400 mb-1" htmlFor="agent-api_key">
            Configure the API Key for this agent. This key will be used for
            authentication with external services.
          </label>
          <div className="relative flex items-center">
            <input
              id="agent-api_key"
              type={showApiKey ? "text" : "password"}
              className="w-full bg-[#2a2a2a] border border-[#444] rounded-md px-3 py-2 text-white pr-24 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              value={values.config?.api_key || ""}
              onChange={(e) =>
                onChange({
                  ...values,
                  config: {
                    ...(values.config || {}),
                    api_key: e.target.value,
                  },
                })
              }
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-9 text-neutral-400 hover:text-emerald-400 px-1 py-1"
              onClick={() => setShowApiKey((v) => !v)}
              tabIndex={-1}
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              className="absolute right-2 text-neutral-400 hover:text-emerald-400 px-1 py-1"
              onClick={async () => {
                if (values.config?.api_key) {
                  await navigator.clipboard.writeText(values.config.api_key);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                  toast({
                    title: "Copied!",
                    description:
                      "The API key was copied to the clipboard.",
                  });
                }
              }}
              tabIndex={-1}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (values.type === "llm") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">MCP Servers</h3>
          <div className="border border-[#444] rounded-md p-4 bg-[#222]">
            <p className="text-sm text-neutral-400 mb-4">
              Configure the MCP servers that this agent can use.
            </p>

            {values.config?.mcp_servers &&
            values.config.mcp_servers.length > 0 ? (
              <div className="space-y-2">
                {values.config.mcp_servers.map((mcpConfig) => {
                  const mcpServer = availableMCPs.find(
                    (mcp) => mcp.id === mcpConfig.id
                  );
                  return (
                    <div
                      key={mcpConfig.id}
                      className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {mcpServer?.name || mcpConfig.id}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {mcpServer?.description?.substring(0, 100)}
                          ...
                        </p>
                        {mcpConfig.tools && mcpConfig.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mcpConfig.tools.map((toolId) => (
                              <Badge
                                key={toolId}
                                variant="outline"
                                className="text-xs bg-[#333] text-emerald-400 border-emerald-400/30"
                              >
                                {toolId}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConfigureMCP(mcpConfig)}
                          className="flex items-center text-neutral-300 hover:text-emerald-400 hover:bg-[#333]"
                        >
                          <Settings className="h-4 w-4 mr-1" /> Configure
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMCP(mcpConfig.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenMCPDialog(null)}
                  className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add MCP Server
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md mb-2">
                <div>
                  <p className="font-medium text-white">
                    No MCP servers configured
                  </p>
                  <p className="text-sm text-neutral-400">
                    Add MCP servers for this agent
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenMCPDialog(null)}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Custom MCPs</h3>
          <div className="border border-[#444] rounded-md p-4 bg-[#222]">
            <p className="text-sm text-neutral-400 mb-4">
              Configure custom MCPs with URL and HTTP headers.
            </p>

            {values.config?.custom_mcp_servers &&
            values.config.custom_mcp_servers.length > 0 ? (
              <div className="space-y-2">
                {values.config.custom_mcp_servers.map((customMCP) => (
                  <div
                    key={customMCP.url}
                    className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md"
                  >
                    <div>
                      <p className="font-medium text-white">{customMCP.url}</p>
                      <p className="text-sm text-neutral-400">
                        {Object.keys(customMCP.headers || {}).length > 0
                          ? `${
                              Object.keys(customMCP.headers || {}).length
                            } headers configured`
                          : "No headers configured"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onConfigureCustomMCP(customMCP)}
                        className="flex items-center text-neutral-300 hover:text-emerald-400 hover:bg-[#333]"
                      >
                        <Settings className="h-4 w-4 mr-1" /> Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveCustomMCP(customMCP.url)}
                        className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenCustomMCPDialog(null)}
                  className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Custom MCP
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md mb-2">
                <div>
                  <p className="font-medium text-white">
                    No custom MCPs configured
                  </p>
                  <p className="text-sm text-neutral-400">
                    Add custom MCPs for this agent
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenCustomMCPDialog(null)}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Agent Tools</h3>
          <div className="border border-[#444] rounded-md p-4 bg-[#222]">
            <p className="text-sm text-neutral-400 mb-4">
              Configure other agents as tools for this agent.
            </p>
            {values.config?.agent_tools &&
            values.config.agent_tools.length > 0 ? (
              <div className="space-y-2">
                {values.config.agent_tools.map((toolId) => {
                  const agent = agents.find((a) => a.id === toolId);
                  return (
                    <div
                      key={toolId}
                      className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {agent?.name || toolId}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {agent?.description || "No description"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAgentTool(toolId)}
                        className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAgentToolDialogOpen(true)}
                  className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Agent Tool
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md mb-2">
                <div>
                  <p className="font-medium text-white">
                    No agent tools configured
                  </p>
                  <p className="text-sm text-neutral-400">
                    Add agent tools for this agent
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAgentToolDialogOpen(true)}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Custom Tools (HTTP Tools)
          </h3>
          <div className="border border-[#444] rounded-md p-4 bg-[#222]">
            <p className="text-sm text-neutral-400 mb-4">
              Configure HTTP tools for this agent.
            </p>
            {values.config?.custom_tools?.http_tools &&
            values.config.custom_tools.http_tools.length > 0 ? (
              <div className="space-y-2">
                {values.config.custom_tools.http_tools.map((tool, idx) => (
                  <div
                    key={tool.name + idx}
                    className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md"
                  >
                    <div>
                      <p className="font-medium text-white">{tool.name}</p>
                      <p className="text-xs text-neutral-400">
                        {tool.method} {tool.endpoint}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomTool(tool, idx)}
                        className="flex items-center text-neutral-300 hover:text-emerald-400 hover:bg-[#333]"
                      >
                        <span className="mr-1">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomTool(idx)}
                        className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCustomTool(null);
                    setCustomToolDialogOpen(true);
                  }}
                  className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Custom Tool
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded-md mb-2">
                <div>
                  <p className="font-medium text-white">
                    No custom tools configured
                  </p>
                  <p className="text-sm text-neutral-400">
                    Add HTTP tools for this agent
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCustomTool(null);
                    setCustomToolDialogOpen(true);
                  }}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            )}
          </div>
        </div>
        <CustomToolDialog
          open={customToolDialogOpen}
          onOpenChange={(open) => {
            setCustomToolDialogOpen(open);
            if (!open) setEditingCustomTool(null);
          }}
          onSave={
            editingCustomTool ? handleSaveEditCustomTool : handleAddCustomTool
          }
          initialTool={editingCustomTool}
        />
        {agentToolDialogOpen && (
        <AgentToolDialog
          open={agentToolDialogOpen}
          onOpenChange={setAgentToolDialogOpen}
          onSave={handleAddAgentTool}
            currentAgentId={values.id}
            folderId={values.folder_id}
          clientId={clientId}
        />
        )}
      </div>
    );
  }

  if (values.type === "a2a") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <A2AAgentConfig values={values} onChange={onChange} />
      </div>
    );
  }

  if (values.type === "sequential") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <SequentialAgentConfig
          values={values}
          onChange={onChange}
          agents={agents}
          getAgentNameById={getAgentNameById}
        />
      </div>
    );
  }

  if (values.type === "parallel") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <ParallelAgentConfig
          values={values}
          onChange={onChange}
          agents={agents}
          getAgentNameById={getAgentNameById}
        />
      </div>
    );
  }

  if (values.type === "loop") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <LoopAgentConfig
          values={values}
          onChange={onChange}
          agents={agents}
          getAgentNameById={getAgentNameById}
        />
      </div>
    );
  }

  if (values.type === "task") {
    return (
      <div className="space-y-4">
        {apiKeyField}
        <TaskAgentConfig
          values={values}
          onChange={onChange}
          agents={agents}
          getAgentNameById={getAgentNameById}
          singleTask={values.type === "task"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeyField}
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <p className="text-neutral-400">
            Configure the sub-agents in the "Sub-Agents" tab
          </p>
        </div>
      </div>
    </div>
  );
}
