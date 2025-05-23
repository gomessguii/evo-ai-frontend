/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/chat/components/AgentInfoDialog.tsx                              │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: May 14, 2025                                                  │
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
import { Agent } from "@/types/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Code,
  WrenchIcon,
  Layers,
  Server,
  TagIcon,
  Share,
  Edit,
  Loader2,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listApiKeys, ApiKey } from "@/services/agentService";
import { listMCPServers } from "@/services/mcpServerService";
import { availableModels } from "@/types/aiModels";
import { MCPServer } from "@/types/mcpServer";
import { AgentForm } from "@/app/agents/forms/AgentForm";
import { exportAsJson } from "@/lib/utils";

interface AgentInfoDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentUpdated?: (updatedAgent: Agent) => void;
}

export function AgentInfoDialog({
  agent,
  open,
  onOpenChange,
  onAgentUpdated,
}: AgentInfoDialogProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [isAgentFormOpen, setIsAgentFormOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [availableMCPs, setAvailableMCPs] = useState<MCPServer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const clientId = user?.client_id || "";

  useEffect(() => {
    if (!clientId || !open) return;

    const loadData = async () => {
      try {
        const [apiKeysResponse, mcpServersResponse] = await Promise.all([
          listApiKeys(clientId),
          listMCPServers(),
        ]);

        setApiKeys(apiKeysResponse.data);
        setAvailableMCPs(mcpServersResponse.data);
      } catch (error) {
        console.error("Error loading data for agent form:", error);
      }
    };

    loadData();
  }, [clientId, open]);

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

  const handleSaveAgent = async (agentData: Partial<Agent>) => {
    if (!agent?.id) return;

    setIsLoading(true);
    try {
      const { updateAgent } = await import("@/services/agentService");
      const updated = await updateAgent(agent.id, agentData as any);

      if (updated.data && onAgentUpdated) {
        onAgentUpdated(updated.data);
      }

      setIsAgentFormOpen(false);
    } catch (error) {
      console.error("Error updating agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para exportar o agente como JSON
  const handleExportAgent = async () => {
    if (!agent) return;
    
    try {
      // First fetch all agents to properly resolve agent_tools references
      const { listAgents } = await import("@/services/agentService");
      const allAgentsResponse = await listAgents(clientId, 0, 1000);
      const allAgents = allAgentsResponse.data || [];
      
      exportAsJson(
        agent, 
        `agent-${agent.name.replace(/\s+/g, "-").toLowerCase()}-${agent.id.substring(0, 8)}`,
        true,
        allAgents
      );
    } catch (error) {
      console.error("Error exporting agent:", error);
    }
  };

  if (!agent) return null;

  const getToolsCount = () => {
    let count = 0;
    if (agent.config?.tools) count += agent.config.tools.length;
    if (agent.config?.custom_tools?.http_tools)
      count += agent.config.custom_tools.http_tools.length;
    if (agent.config?.agent_tools)
      count += agent.config.agent_tools.length;
    return count;
  };

  const getSubAgentsCount = () => {
    return agent.config?.sub_agents?.length || 0;
  };

  const getMCPServersCount = () => {
    let count = 0;
    if (agent.config?.mcp_servers) count += agent.config.mcp_servers.length;
    if (agent.config?.custom_mcp_servers)
      count += agent.config.custom_mcp_servers.length;
    return count;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col overflow-hidden bg-neutral-900 border-neutral-700">
          <DialogHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <DialogTitle className="text-xl text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-400" />
                {agent.name}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 mt-1">
                {agent.description || "No description available"}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-neutral-800 border-neutral-700 text-emerald-400"
              >
                {getAgentTypeName(agent.type)}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-neutral-800 border-neutral-700 hover:bg-emerald-900 hover:text-emerald-400"
                onClick={handleExportAgent}
                title="Export agent as JSON"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-neutral-800 border-neutral-700 hover:bg-emerald-900 hover:text-emerald-400"
                onClick={() => setIsAgentFormOpen(true)}
                title="Edit agent"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="bg-neutral-800 p-1 border-b border-neutral-700">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-emerald-400"
              >
                Information
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-emerald-400"
              >
                Tools
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-emerald-400"
              >
                Configuration
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="info" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-800 p-3 rounded-md border border-neutral-700 flex flex-col items-center justify-center text-center">
                      <Code className="h-5 w-5 text-emerald-400 mb-1" />
                      <span className="text-xs text-neutral-400">Model</span>
                      <span className="text-sm text-neutral-200 mt-1 font-medium">
                        {agent.model || "Not specified"}
                      </span>
                    </div>

                    <div className="bg-neutral-800 p-3 rounded-md border border-neutral-700 flex flex-col items-center justify-center text-center">
                      <TagIcon className="h-5 w-5 text-emerald-400 mb-1" />
                      <span className="text-xs text-neutral-400">Tools</span>
                      <span className="text-sm text-neutral-200 mt-1 font-medium">
                        {getToolsCount()}
                      </span>
                    </div>

                    <div className="bg-neutral-800 p-3 rounded-md border border-neutral-700 flex flex-col items-center justify-center text-center">
                      <Layers className="h-5 w-5 text-emerald-400 mb-1" />
                      <span className="text-xs text-neutral-400">
                        Sub-agents
                      </span>
                      <span className="text-sm text-neutral-200 mt-1 font-medium">
                        {getSubAgentsCount()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">
                      Agent Role
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      {agent.role || "Not specified"}
                    </p>
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">
                      Agent Goal
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      {agent.goal || "Not specified"}
                    </p>
                    {/* agent instructions: agent.instruction */}
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">
                      Agent Instructions
                    </h3>
                    <div className="bg-neutral-900 p-3 rounded-md border border-neutral-700 max-h-[200px] overflow-y-auto">
                      <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono">
                        {agent.instruction || "No instructions provided"}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0 space-y-4">
                {getToolsCount() > 0 ? (
                  <div className="space-y-3">
                    {/* Built-in tools */}
                    {agent.config?.tools && agent.config.tools.length > 0 && (
                      <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                        <h3 className="text-sm font-medium text-emerald-400 mb-2">
                          Built-in Tools
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {agent.config.tools.map((tool, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-neutral-900 border-neutral-700 text-neutral-300 p-2 justify-start"
                            >
                              <TagIcon className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                              {typeof tool === 'string' ? tool : 'Custom Tool'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agent Tools */}
                    {agent.config?.agent_tools && agent.config.agent_tools.length > 0 && (
                      <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                        <h3 className="text-sm font-medium text-emerald-400 mb-2">
                          Agent Tools
                        </h3>
                        <div className="space-y-2">
                          {agent.config.agent_tools.map((agentId, index) => (
                            <div
                              key={index}
                              className="bg-neutral-900 p-2 rounded-md border border-neutral-700 flex items-center"
                            >
                              <div className="flex items-center">
                                <Bot className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                                <span className="text-sm text-neutral-300">
                                  {agents.find(a => a.id === agentId)?.name || agentId}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom HTTP tools */}
                    {agent.config?.custom_tools?.http_tools &&
                      agent.config.custom_tools.http_tools.length > 0 && (
                        <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                          <h3 className="text-sm font-medium text-emerald-400 mb-2">
                            Custom HTTP Tools
                          </h3>
                          <div className="space-y-2">
                            {agent.config.custom_tools.http_tools.map(
                              (tool, index) => (
                                <div
                                  key={index}
                                  className="bg-neutral-900 p-2 rounded-md border border-neutral-700 flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <Server className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                                    <span className="text-sm text-neutral-300">
                                      {tool.name}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-neutral-800 border-neutral-700 text-emerald-400"
                                  >
                                    {tool.method}
                                  </Badge>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="bg-neutral-800 p-6 rounded-md border border-neutral-700 text-center">
                    <TagIcon className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-neutral-400">
                      This agent has no tools configured
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="config" className="mt-0 space-y-4">
                <div className="space-y-3">
                  {/* MCP Servers */}
                  <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">
                      MCP Servers
                    </h3>
                    {getMCPServersCount() > 0 ? (
                      <div className="space-y-2">
                        {agent.config?.mcp_servers &&
                          agent.config.mcp_servers.map((mcp, index) => (
                            <div
                              key={index}
                              className="bg-neutral-900 p-2 rounded-md border border-neutral-700 flex items-center"
                            >
                              <Server className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                              <span className="text-sm text-neutral-300">
                                {mcp.id}
                              </span>
                            </div>
                          ))}

                        {agent.config?.custom_mcp_servers &&
                          agent.config.custom_mcp_servers.map((mcp, index) => (
                            <div
                              key={index}
                              className="bg-neutral-900 p-2 rounded-md border border-neutral-700 flex items-center"
                            >
                              <Server className="h-3.5 w-3.5 mr-2 text-yellow-400" />
                              <span className="text-sm text-neutral-300">
                                {mcp.url}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-sm">
                        No MCP servers configured
                      </p>
                    )}
                  </div>

                  {/* API Key */}
                  <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">
                      API Key
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      {agent.api_key_id
                        ? `Key ID: ${agent.api_key_id}`
                        : "No API key configured"}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Edit Form Dialog */}
      {isAgentFormOpen && agent && (
        <AgentForm
          open={isAgentFormOpen}
          onOpenChange={setIsAgentFormOpen}
          initialValues={agent}
          apiKeys={apiKeys}
          availableModels={availableModels}
          availableMCPs={availableMCPs}
          agents={agents}
          onOpenApiKeysDialog={() => {}}
          onOpenMCPDialog={() => {}}
          onOpenCustomMCPDialog={() => {}}
          onSave={handleSaveAgent}
          isLoading={isLoading}
          getAgentNameById={(id) => id}
          clientId={clientId}
        />
      )}
    </>
  );
}
 