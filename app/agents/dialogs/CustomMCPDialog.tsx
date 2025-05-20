/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/CustomMCPDialog.tsx                             │
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface CustomMCPHeader {
  id: string;
  key: string;
  value: string;
}

interface CustomMCPServer {
  url: string;
  headers: Record<string, string>;
}

interface CustomMCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customMCP: CustomMCPServer) => void;
  initialCustomMCP?: CustomMCPServer | null;
  clientId: string;
}

export function CustomMCPDialog({
  open,
  onOpenChange,
  onSave,
  initialCustomMCP = null,
  clientId,
}: CustomMCPDialogProps) {
  const [customMCP, setCustomMCP] = useState<Partial<CustomMCPServer>>({
    url: "",
    headers: {},
  });

  const [headersList, setHeadersList] = useState<CustomMCPHeader[]>([]);

  useEffect(() => {
    if (open) {
      if (initialCustomMCP) {
        setCustomMCP(initialCustomMCP);
        const headersList = Object.entries(initialCustomMCP.headers || {}).map(
          ([key, value], index) => ({
            id: `header-${index}`,
            key,
            value,
          })
        );
        setHeadersList(headersList);
      } else {
        setCustomMCP({ url: "", headers: {} });
        setHeadersList([]);
      }
    }
  }, [open, initialCustomMCP]);

  const handleAddHeader = () => {
    setHeadersList([
      ...headersList,
      { id: `header-${Date.now()}`, key: "", value: "" },
    ]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeadersList(headersList.filter((header) => header.id !== id));
  };

  const handleHeaderChange = (
    id: string,
    field: "key" | "value",
    value: string
  ) => {
    setHeadersList(
      headersList.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const handleSave = () => {
    if (!customMCP.url) return;

    const headersObject: Record<string, string> = {};
    headersList.forEach((header) => {
      if (header.key.trim()) {
        headersObject[header.key] = header.value;
      }
    });

    onSave({
      url: customMCP.url,
      headers: headersObject,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Configure Custom MCP
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Configure the URL and HTTP headers for the custom MCP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-mcp-url" className="text-neutral-300">
                MCP URL
              </Label>
              <Input
                id="custom-mcp-url"
                value={customMCP.url || ""}
                onChange={(e) =>
                  setCustomMCP({
                    ...customMCP,
                    url: e.target.value,
                  })
                }
                className="bg-[#222] border-[#444] text-white"
                placeholder="https://meu-servidor-mcp.com/api"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">HTTP Headers</h3>
              <div className="border border-[#444] rounded-md p-3 bg-[#222]">
                {headersList.map((header) => (
                  <div
                    key={header.id}
                    className="grid grid-cols-5 items-center gap-2 mb-2"
                  >
                    <Input
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(header.id, "key", e.target.value)
                      }
                      className="col-span-2 bg-[#333] border-[#444] text-white"
                      placeholder="Header Name"
                    />
                    <Input
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(header.id, "value", e.target.value)
                      }
                      className="col-span-2 bg-[#333] border-[#444] text-white"
                      placeholder="Header Value"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveHeader(header.id)}
                      className="col-span-1 h-8 text-red-500 hover:text-red-400 hover:bg-[#444]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddHeader}
                  className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Header
                </Button>
              </div>
            </div>
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
            disabled={!customMCP.url}
          >
            {initialCustomMCP?.url ? "Save Custom MCP" : "Add Custom MCP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
