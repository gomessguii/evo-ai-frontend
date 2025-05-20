/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/MCPDialog.tsx                                    │
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MCPServer } from "@/types/mcpServer";
import { Server } from "lucide-react";
import { useState, useEffect } from "react";

interface MCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mcpConfig: {
    id: string;
    envs: Record<string, string>;
    tools: string[];
  }) => void;
  availableMCPs: MCPServer[];
  selectedMCP?: MCPServer | null;
  initialEnvs?: Record<string, string>;
  initialTools?: string[];
  clientId: string;
}

export function MCPDialog({
  open,
  onOpenChange,
  onSave,
  availableMCPs,
  selectedMCP: initialSelectedMCP = null,
  initialEnvs = {},
  initialTools = [],
  clientId,
}: MCPDialogProps) {
  const [selectedMCP, setSelectedMCP] = useState<MCPServer | null>(null);
  const [mcpEnvs, setMcpEnvs] = useState<Record<string, string>>({});
  const [selectedMCPTools, setSelectedMCPTools] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (initialSelectedMCP) {
        setSelectedMCP(initialSelectedMCP);
        setMcpEnvs(initialEnvs);
        setSelectedMCPTools(initialTools);
      } else {
        setSelectedMCP(null);
        setMcpEnvs({});
        setSelectedMCPTools([]);
      }
    }
  }, [open, initialSelectedMCP, initialEnvs, initialTools]);

  const handleSelectMCP = (value: string) => {
    const mcp = availableMCPs.find((m) => m.id === value);
    if (mcp) {
      setSelectedMCP(mcp);
      const initialEnvs: Record<string, string> = {};
      Object.keys(mcp.environments || {}).forEach((key) => {
        initialEnvs[key] = "";
      });
      setMcpEnvs(initialEnvs);
      setSelectedMCPTools([]);
    }
  };

  const toggleMCPTool = (tool: string) => {
    if (selectedMCPTools.includes(tool)) {
      setSelectedMCPTools(selectedMCPTools.filter((t) => t !== tool));
    } else {
      setSelectedMCPTools([...selectedMCPTools, tool]);
    }
  };

  const handleSave = () => {
    if (!selectedMCP) return;
    
    onSave({
      id: selectedMCP.id,
      envs: mcpEnvs,
      tools: selectedMCPTools,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Configure MCP Server
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Select a MCP server and configure its tools.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mcp-select" className="text-neutral-300">
                MCP Server
              </Label>
              <Select
                value={selectedMCP?.id}
                onValueChange={handleSelectMCP}
              >
                <SelectTrigger className="bg-[#222] border-[#444] text-white">
                  <SelectValue placeholder="Select a MCP server" />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#444] text-white">
                  {availableMCPs.map((mcp) => (
                    <SelectItem
                      key={mcp.id}
                      value={mcp.id}
                      className="data-[selected]:bg-[#333] data-[highlighted]:bg-[#333] !text-white focus:!text-white hover:text-emerald-400 data-[selected]:!text-emerald-400"
                    >
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-emerald-400" />
                        {mcp.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMCP && (
              <>
                <div className="border border-[#444] rounded-md p-3 bg-[#222]">
                  <p className="font-medium text-white">{selectedMCP.name}</p>
                  <p className="text-sm text-neutral-400">
                    {selectedMCP.description?.substring(0, 100)}...
                  </p>
                  <div className="mt-2 text-xs text-neutral-400">
                    <p>
                      <strong>Type:</strong> {selectedMCP.type}
                    </p>
                    <p>
                      <strong>Configuration:</strong>{" "}
                      {selectedMCP.config_type === "sse" ? "SSE" : "Studio"}
                    </p>
                  </div>
                </div>

                {selectedMCP.environments &&
                  Object.keys(selectedMCP.environments).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-white">
                        Environment Variables
                      </h3>
                      {Object.entries(selectedMCP.environments || {}).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="grid grid-cols-3 items-center gap-4"
                          >
                            <Label
                              htmlFor={`env-${key}`}
                              className="text-right text-neutral-300"
                            >
                              {key}
                            </Label>
                            <Input
                              id={`env-${key}`}
                              value={mcpEnvs[key] || ""}
                              onChange={(e) =>
                                setMcpEnvs({
                                  ...mcpEnvs,
                                  [key]: e.target.value,
                                })
                              }
                              className="col-span-2 bg-[#222] border-[#444] text-white"
                              placeholder={value as string}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}

                {selectedMCP.tools && selectedMCP.tools.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white">
                      Available Tools
                    </h3>
                    <div className="border border-[#444] rounded-md p-3 bg-[#222]">
                      {selectedMCP.tools.map((tool: any) => (
                        <div
                          key={tool.id}
                          className="flex items-center space-x-2 py-1"
                        >
                          <Checkbox
                            id={`tool-${tool.id}`}
                            checked={selectedMCPTools.includes(tool.id)}
                            onCheckedChange={() => toggleMCPTool(tool.id)}
                            className="data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400"
                          />
                          <Label
                            htmlFor={`tool-${tool.id}`}
                            className="text-sm text-neutral-300"
                          >
                            {tool.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 pt-2 border-t border-[#333]">
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
            disabled={!selectedMCP}
          >
            Add MCP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
