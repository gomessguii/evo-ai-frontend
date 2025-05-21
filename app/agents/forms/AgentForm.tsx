/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/forms/AgentForm.tsx                                       │
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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "@/types/agent";
import { ApiKey } from "@/services/agentService";
import { MCPServer } from "@/types/mcpServer";
import { useState, useEffect } from "react";
import { BasicInfoTab } from "./BasicInfoTab";
import { ConfigurationTab } from "./ConfigurationTab";
import { SubAgentsTab } from "./SubAgentsTab";
import { MCPDialog } from "../dialogs/MCPDialog";
import { CustomMCPDialog } from "../dialogs/CustomMCPDialog";

interface ModelOption {
  value: string;
  label: string;
  provider: string;
}

interface AgentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: Partial<Agent>;
  apiKeys: ApiKey[];
  availableModels: ModelOption[];
  availableMCPs: MCPServer[];
  agents: Agent[];
  onOpenApiKeysDialog: () => void;
  onOpenMCPDialog: (mcp?: any) => void;
  onOpenCustomMCPDialog: (customMCP?: any) => void;
  onSave: (values: Partial<Agent>) => Promise<void>;
  isLoading?: boolean;
  getAgentNameById: (id: string) => string;
  clientId: string;
}

export function AgentForm({
  open,
  onOpenChange,
  initialValues,
  apiKeys,
  availableModels,
  availableMCPs,
  agents,
  onOpenApiKeysDialog,
  onOpenMCPDialog: externalOnOpenMCPDialog,
  onOpenCustomMCPDialog: externalOnOpenCustomMCPDialog,
  onSave,
  isLoading = false,
  getAgentNameById,
  clientId,
}: AgentFormProps) {
  const [values, setValues] = useState<Partial<Agent>>(initialValues);
  const [activeTab, setActiveTab] = useState("basic");

  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [selectedMCP, setSelectedMCP] = useState<any>(null);
  const [customMcpDialogOpen, setCustomMcpDialogOpen] = useState(false);
  const [selectedCustomMCP, setSelectedCustomMCP] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setActiveTab("basic");
    }
  }, [open, initialValues]);

  const handleOpenMCPDialog = (mcpConfig: any = null) => {
    setSelectedMCP(mcpConfig);
    setMcpDialogOpen(true);
  };

  const handleOpenCustomMCPDialog = (customMCP: any = null) => {
    setSelectedCustomMCP(customMCP);
    setCustomMcpDialogOpen(true);
  };

  const handleConfigureMCP = (mcpConfig: any) => {
    handleOpenMCPDialog(mcpConfig);
  };

  const handleRemoveMCP = (mcpId: string) => {
    setValues({
      ...values,
      config: {
        ...values.config,
        mcp_servers:
          values.config?.mcp_servers?.filter((mcp) => mcp.id !== mcpId) || [],
      },
    });
  };

  const handleConfigureCustomMCP = (customMCP: any) => {
    handleOpenCustomMCPDialog(customMCP);
  };

  const handleRemoveCustomMCP = (url: string) => {
    setValues({
      ...values,
      config: {
        ...values.config,
        custom_mcp_servers:
          values.config?.custom_mcp_servers?.filter(
            (customMCP) => customMCP.url !== url
          ) || [],
      },
    });
  };

  const handleSaveMCP = (mcpConfig: any) => {
    const updatedMcpServers = [...(values.config?.mcp_servers || [])];
    const existingIndex = updatedMcpServers.findIndex(
      (mcp) => mcp.id === mcpConfig.id
    );

    if (existingIndex >= 0) {
      updatedMcpServers[existingIndex] = mcpConfig;
    } else {
      updatedMcpServers.push(mcpConfig);
    }

    setValues({
      ...values,
      config: {
        ...(values.config || {}),
        mcp_servers: updatedMcpServers,
      },
    });
  };

  const handleSaveCustomMCP = (customMCP: any) => {
    const updatedCustomMCPs = [...(values.config?.custom_mcp_servers || [])];
    const existingIndex = updatedCustomMCPs.findIndex(
      (mcp) => mcp.url === customMCP.url
    );

    if (existingIndex >= 0) {
      updatedCustomMCPs[existingIndex] = customMCP;
    } else {
      updatedCustomMCPs.push(customMCP);
    }

    setValues({
      ...values,
      config: {
        ...(values.config || {}),
        custom_mcp_servers: updatedCustomMCPs,
      },
    });
  };

  const handleSave = async () => {
    const finalValues = {
      ...values,
      client_id: clientId,
      name: values.name,
    };

    await onSave(finalValues);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {initialValues.id ? "Edit Agent" : "New Agent"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              {initialValues.id
                ? "Edit the existing agent information"
                : "Fill in the information to create a new agent"}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-3 bg-[#222]">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
              >
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="subagents"
                className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
              >
                Sub-Agents
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 overflow-auto">
              <TabsContent value="basic" className="p-4 space-y-4">
                <BasicInfoTab
                  values={values}
                  onChange={setValues}
                  apiKeys={apiKeys}
                  availableModels={availableModels}
                  onOpenApiKeysDialog={onOpenApiKeysDialog}
                  clientId={clientId}
                />
              </TabsContent>

              <TabsContent value="config" className="p-4 space-y-4">
                <ConfigurationTab
                  values={values}
                  onChange={setValues}
                  agents={agents}
                  availableMCPs={availableMCPs}
                  apiKeys={apiKeys}
                  availableModels={availableModels}
                  getAgentNameById={getAgentNameById}
                  onOpenApiKeysDialog={onOpenApiKeysDialog}
                  onConfigureMCP={handleConfigureMCP}
                  onRemoveMCP={handleRemoveMCP}
                  onConfigureCustomMCP={handleConfigureCustomMCP}
                  onRemoveCustomMCP={handleRemoveCustomMCP}
                  onOpenMCPDialog={handleOpenMCPDialog}
                  onOpenCustomMCPDialog={handleOpenCustomMCPDialog}
                  clientId={clientId}
                />
              </TabsContent>

              <TabsContent value="subagents" className="p-4 space-y-4">
                <SubAgentsTab
                  values={values}
                  onChange={setValues}
                  getAgentNameById={getAgentNameById}
                  editingAgentId={initialValues.id}
                  clientId={clientId}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
              disabled={!values.name || isLoading}
            >
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
              )}
              {initialValues.id ? "Save Changes" : "Add Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MCP Dialog */}
      <MCPDialog
        open={mcpDialogOpen}
        onOpenChange={setMcpDialogOpen}
        onSave={handleSaveMCP}
        availableMCPs={availableMCPs}
        selectedMCP={
          availableMCPs.find((m) => selectedMCP?.id === m.id) || null
        }
        initialEnvs={selectedMCP?.envs || {}}
        initialTools={selectedMCP?.tools || []}
        clientId={clientId}
      />

      {/* Custom MCP Dialog */}
      <CustomMCPDialog
        open={customMcpDialogOpen}
        onOpenChange={setCustomMcpDialogOpen}
        onSave={handleSaveCustomMCP}
        initialCustomMCP={selectedCustomMCP}
        clientId={clientId}
      />
    </>
  );
}
