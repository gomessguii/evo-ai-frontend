/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/agent/AgentForm.tsx            │
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
/* eslint-disable jsx-a11y/alt-text */
import { useEdges, useNodes } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Agent } from "@/types/agent";
import { listAgents, listFolders, Folder, getAgent } from "@/services/agentService";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { User, Loader2, Search, FolderIcon, Trash2, Play, MessageSquare, PlayIcon, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentForm as GlobalAgentForm } from "@/app/agents/forms/AgentForm";
import { ApiKey, listApiKeys } from "@/services/agentService";
import { listMCPServers } from "@/services/mcpServerService";
import { availableModels } from "@/types/aiModels";
import { MCPServer } from "@/types/mcpServer";
import { AgentTestChatModal } from "./AgentTestChatModal";
import { sanitizeAgentName, escapePromptBraces } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* eslint-disable @typescript-eslint/no-explicit-any */
const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || '{}') : {};
const clientId: string = user?.client_id ? String(user.client_id) : "";

const agentListStyles = {
  scrollbarWidth: 'none', /* Firefox */
  msOverflowStyle: 'none', /* IE and Edge */
  '::-webkit-scrollbar': {
    display: 'none' /* Chrome, Safari and Opera */
  }
};

export function AgentForm({ selectedNode, handleUpdateNode, setEdges, setIsOpen, setSelectedNode }: {
  selectedNode: any;
  handleUpdateNode: any;
  setEdges: any;
  setIsOpen: any;
  setSelectedNode: any;
}) {
  const [node, setNode] = useState(selectedNode);
  const [loading, setLoading] = useState(true);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingCurrentAgent, setLoadingCurrentAgent] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [agentTypes, setAgentTypes] = useState<string[]>([]);
  const [agentFolderId, setAgentFolderId] = useState<string | null>(null);
  const edges = useEdges();
  const nodes = useNodes();
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [availableMCPs, setAvailableMCPs] = useState<MCPServer[]>([]);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    client_id: clientId || "",
    name: "",
    description: "",
    type: "llm",
    model: "openai/gpt-4.1-nano",
    instruction: "",
    api_key_id: "",
    config: {
      tools: [],
      mcp_servers: [],
      custom_mcp_servers: [],
      custom_tools: { http_tools: [] },
      sub_agents: [],
      agent_tools: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Acessar a referência do canvas a partir do localStorage
  const canvasRef = useRef<any>(null);
  
  useEffect(() => {
    // Quando o componente é montado, verifica se há uma referência de canvas no contexto global
    if (typeof window !== "undefined") {
      const workflowsPage = document.querySelector('[data-workflow-page="true"]');
      if (workflowsPage) {
        // Se estamos na página de workflows, tentamos acessar a ref do canvas
        const canvasElement = workflowsPage.querySelector('[data-canvas-ref="true"]');
        if (canvasElement && (canvasElement as any).__reactRef) {
          canvasRef.current = (canvasElement as any).__reactRef.current;
        }
      }
    }
  }, []);

  const connectedNode = useMemo(() => {
    const edge = edges.find((edge: any) => edge.source === selectedNode.id);
    if (!edge) return null;
    const node = nodes.find((node: any) => node.id === edge.target);
    return node || null;
  }, [edges, nodes, selectedNode.id]);
  
  const currentAgent = typeof window !== "undefined" ? 
    JSON.parse(localStorage.getItem("current_workflow_agent") || '{}') : {};
  const currentAgentId = currentAgent?.id;

  useEffect(() => {
    if (selectedNode) {
      setNode(selectedNode);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (!clientId) return;
    setLoadingFolders(true);
    listFolders(clientId)
      .then((res) => {
        setFolders(res.data);
      })
      .catch((error) => console.error("Error loading folders:", error))
      .finally(() => setLoadingFolders(false));
  }, [clientId]);

  useEffect(() => {
    if (!currentAgentId || !clientId) {
      return;
    }
    
    setLoadingCurrentAgent(true);
    
    getAgent(currentAgentId, clientId)
      .then((res) => {
        const agent = res.data;
        if (agent.folder_id) {
          setAgentFolderId(agent.folder_id);
          setSelectedFolderId(agent.folder_id);
        }
      })
      .catch((error) => console.error("Error loading current agent:", error))
      .finally(() => setLoadingCurrentAgent(false));
  }, [currentAgentId, clientId]);

  useEffect(() => {
    if (!clientId) return;
    
    if (loadingFolders || loadingCurrentAgent) return;
    
    setLoading(true);
    
    listAgents(clientId, 0, 100, selectedFolderId || undefined)
      .then((res) => {
        const filteredAgents = res.data.filter((agent: Agent) => agent.id !== currentAgentId);
        setAllAgents(filteredAgents);
        setAgents(filteredAgents);
        
        // Extract unique agent types
        const types = [...new Set(filteredAgents.map(agent => agent.type))].filter(Boolean);
        setAgentTypes(types);
      })
      .catch((error) => console.error("Error loading agents:", error))
      .finally(() => setLoading(false));
  }, [clientId, currentAgentId, selectedFolderId, loadingFolders, loadingCurrentAgent]);

  useEffect(() => {
    // Apply all filters: search, folder, and type
    let filtered = allAgents;
    
    // Search filter is applied in a separate effect
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((agent) => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply agent type filter
    if (selectedAgentType) {
      filtered = filtered.filter(agent => agent.type === selectedAgentType);
    }
    
      setAgents(filtered);
  }, [searchQuery, selectedAgentType, allAgents]);

  useEffect(() => {
    if (!clientId) return;
    listApiKeys(clientId).then((res) => setApiKeys(res.data));
    listMCPServers().then((res) => setAvailableMCPs(res.data));
  }, [clientId]);

  const handleDeleteEdge = useCallback(() => {
    const id = edges.find((edge: any) => edge.source === selectedNode.id)?.id;
    setEdges((edges: any) => {
      const left = edges.filter((edge: any) => edge.id !== id);
      return left;
    });
  }, [nodes, edges, selectedNode, setEdges]);

  const handleSelectAgent = (agent: Agent) => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        agent,
      },
    };
    setNode(updatedNode);
    handleUpdateNode(updatedNode);
  };

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

  const handleOpenAgentDialog = () => {
    setNewAgent({
      client_id: clientId || "",
      name: "",
      description: "",
      type: "llm",
      model: "openai/gpt-4.1-nano",
      instruction: "",
      api_key_id: "",
      config: {
        tools: [],
        mcp_servers: [],
        custom_mcp_servers: [],
        custom_tools: { http_tools: [] },
        sub_agents: [],
        agent_tools: [],
      },
      folder_id: selectedFolderId || undefined,
    });
    setIsAgentDialogOpen(true);
  };

  const handleSaveAgent = async (agentData: Partial<Agent>) => {
    setIsLoading(true);
    try {
      const sanitizedData = {
        ...agentData,
        client_id: clientId,
        name: agentData.name ? sanitizeAgentName(agentData.name) : agentData.name,
        instruction: agentData.instruction ? escapePromptBraces(agentData.instruction) : agentData.instruction
      };

      if (isEditMode && node.data.agent?.id) {
        // Update existing agent
        const { updateAgent } = await import("@/services/agentService");
        const updated = await updateAgent(node.data.agent.id, sanitizedData as any);
        
        // Refresh the agent list
        const res = await listAgents(clientId, 0, 100, selectedFolderId || undefined);
        const filteredAgents = res.data.filter((agent: Agent) => agent.id !== currentAgentId);
        setAllAgents(filteredAgents);
        setAgents(filteredAgents);
        
        if (updated.data) {
          handleSelectAgent(updated.data);
        }
      } else {
        // Create new agent
        const { createAgent } = await import("@/services/agentService");
        const created = await createAgent(sanitizedData as any);

        const res = await listAgents(clientId, 0, 100, selectedFolderId || undefined);
        const filteredAgents = res.data.filter((agent: Agent) => agent.id !== currentAgentId);
        setAllAgents(filteredAgents);
        setAgents(filteredAgents);

        if (created.data) {
          handleSelectAgent(created.data);
        }
      }
      
      setIsAgentDialogOpen(false);
      setIsEditMode(false);
    } catch (e) {
      console.error("Error saving agent:", e);
      setIsAgentDialogOpen(false);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderChange = (value: string) => {
    setSelectedFolderId(value === "all" ? null : value);
  };
  
  const handleAgentTypeChange = (value: string) => {
    setSelectedAgentType(value === "all" ? null : value);
  };

  const getFolderNameById = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    return folder?.name || id;
  };

  const handleEditAgent = () => {
    if (!node.data.agent) return;
    
    setNewAgent({
      ...node.data.agent,
      client_id: clientId || "",
    });
    
    setIsEditMode(true);
    setIsAgentDialogOpen(true);
  };

  return (
    <>
      {isAgentDialogOpen && (
        <GlobalAgentForm
          open={isAgentDialogOpen}
          onOpenChange={(open) => {
            setIsAgentDialogOpen(open);
            if (!open) setIsEditMode(false);
          }}
          initialValues={newAgent}
          apiKeys={apiKeys}
          availableModels={availableModels}
          availableMCPs={availableMCPs}
          agents={allAgents}
          onOpenApiKeysDialog={() => {}}
          onOpenMCPDialog={() => {}}
          onOpenCustomMCPDialog={() => {}}
          onSave={handleSaveAgent}
          isLoading={isLoading}
          getAgentNameById={(id) => allAgents.find((a) => a.id === id)?.name || id}
          clientId={clientId}
        />
      )}
      
      {/* Agent Test Chat Modal - moved outside of nested divs to render properly */}
      {isTestModalOpen && node.data.agent && (
        <AgentTestChatModal
          open={isTestModalOpen}
          onOpenChange={setIsTestModalOpen}
          agent={node.data.agent}
        />
      )}
      
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-neutral-700 flex-shrink-0">
          <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-neutral-800 border-neutral-700 text-neutral-200 focus-visible:ring-emerald-500"
            />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Select 
                value={selectedFolderId ? selectedFolderId : "all"} 
                onValueChange={handleFolderChange}
              >
                <SelectTrigger className="w-full h-9 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500 focus:ring-offset-0">
                  <SelectValue placeholder="All folders" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                  <SelectItem value="all">All folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select 
                value={selectedAgentType ? selectedAgentType : "all"} 
                onValueChange={handleAgentTypeChange}
              >
                <SelectTrigger className="w-full h-9 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-emerald-500 focus:ring-offset-0">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                  <SelectItem value="all">All types</SelectItem>
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getAgentTypeName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
            <h3 className="text-md font-medium text-neutral-200">
              {searchQuery ? "Search Results" : "Select an Agent"}
            </h3>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-emerald-800 hover:bg-emerald-700 border-emerald-700 text-emerald-100"
              onClick={() => {
                setNewAgent({
                  id: "",
                  name: "",
                  client_id: clientId || "",
                  type: "llm",
                  model: "",
                  config: {},
                  description: "",
                });
                setIsEditMode(false);
                setIsAgentDialogOpen(true);
              }}
              aria-label="New Agent"
            >
              <Plus size={14} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
            <div className="space-y-2 pr-2">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors group relative ${
                      node.data.agent?.id === agent.id
                        ? "bg-emerald-800/20 border border-emerald-600/40"
                        : "bg-neutral-800 hover:bg-neutral-700 border border-transparent"
                    }`}
                    onClick={() => handleSelectAgent(agent)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="bg-neutral-700 rounded-full p-1.5 flex-shrink-0">
                        <User size={18} className="text-neutral-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-neutral-200 truncate">{agent.name}</h3>
                          <div 
                            className="ml-auto text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 transition-colors p-1 rounded hover:bg-yellow-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewAgent({
                                ...agent,
                                client_id: clientId || "",
                              });
                              setIsEditMode(true);
                              setIsAgentDialogOpen(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-neutral-700 text-emerald-400 border-neutral-600"
                          >
                            {getAgentTypeName(agent.type)}
                          </Badge>
                          {agent.model && (
                            <span className="text-xs text-neutral-400">{agent.model}</span>
                          )}
                        </div>
                        {agent.description && (
                          <p className="text-sm text-neutral-400 mt-1.5 line-clamp-2">
                            {agent.description.slice(0, 30)} {agent.description.length > 30 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-400">
                  No agents found
                </div>
              )}
            </div>
          </div>
        </div>

        {node.data.agent && (
          <div className="p-4 border-t border-neutral-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium text-neutral-200">Selected Agent</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                  onClick={() => {
                    handleUpdateNode({
                      ...node,
                      data: {
                        ...node.data,
                        agent: null,
                      },
                    });
                  }}
                  aria-label="Clear agent"
                >
                  <X size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-200"
                  onClick={handleEditAgent}
                  aria-label="Edit agent"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-emerald-800 hover:bg-emerald-700 border-emerald-700 text-emerald-100"
                  onClick={() => setIsTestModalOpen(true)}
                  aria-label="Test agent"
                >
                  <PlayIcon size={14} />
                </Button>
              </div>
            </div>
            <div className="p-3 rounded-md bg-emerald-800/20 border border-emerald-600/40">
              <div className="flex items-start gap-2">
                <div className="bg-emerald-900/50 rounded-full p-1.5 flex-shrink-0">
                  <User size={18} className="text-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-200 truncate">{node.data.agent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-emerald-900/50 text-emerald-400 border-emerald-700/50"
                    >
                      {getAgentTypeName(node.data.agent.type)}
                    </Badge>
                    {node.data.agent.model && (
                      <span className="text-xs text-neutral-400">{node.data.agent.model}</span>
                    )}
                  </div>
                  {node.data.agent.description && (
                    <p className="text-sm text-neutral-400 mt-1.5 line-clamp-2">
                      {node.data.agent.description.slice(0, 30)} {node.data.agent.description.length > 30 ? "..." : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
