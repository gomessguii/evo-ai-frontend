/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/CustomToolDialog.tsx                             │
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
import { HTTPTool, HTTPToolParameter } from "@/types/agent";
import { sanitizeAgentName } from "@/lib/utils";

interface CustomToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tool: HTTPTool) => void;
  initialTool?: HTTPTool | null;
}

export function CustomToolDialog({
  open,
  onOpenChange,
  onSave,
  initialTool = null,
}: CustomToolDialogProps) {
  const [tool, setTool] = useState<Partial<HTTPTool>>({
    name: "",
    method: "GET",
    endpoint: "",
    description: "",
    headers: {},
    values: {},
    parameters: {},
    error_handling: {
      timeout: 30,
      retry_count: 0,
      fallback_response: {},
    },
  });

  const [headersList, setHeadersList] = useState<{ id: string; key: string; value: string }[]>([]);
  const [bodyParams, setBodyParams] = useState<{ id: string; key: string; param: HTTPToolParameter }[]>([]);
  const [pathParams, setPathParams] = useState<{ id: string; key: string; desc: string }[]>([]);
  const [queryParams, setQueryParams] = useState<{ id: string; key: string; value: string }[]>([]);
  const [valuesList, setValuesList] = useState<{ id: string; key: string; value: string }[]>([]);
  const [timeout, setTimeout] = useState<number>(30);
  const [fallbackError, setFallbackError] = useState<string>("");
  const [fallbackMessage, setFallbackMessage] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (initialTool) {
        setTool(initialTool);
        setHeadersList(
          Object.entries(initialTool.headers || {}).map(([key, value], idx) => ({
            id: `header-${idx}`,
            key,
            value,
          }))
        );
        setBodyParams(
          Object.entries(initialTool.parameters?.body_params || {}).map(([key, param], idx) => ({
            id: `body-${idx}`,
            key,
            param,
          }))
        );
        setPathParams(
          Object.entries(initialTool.parameters?.path_params || {}).map(([key, desc], idx) => ({
            id: `path-${idx}`,
            key,
            desc: desc as string,
          }))
        );
        setQueryParams(
          Object.entries(initialTool.parameters?.query_params || {}).map(([key, value], idx) => ({
            id: `query-${idx}`,
            key,
            value: value as string,
          }))
        );
        setValuesList(
          Object.entries(initialTool.values || {}).map(([key, value], idx) => ({
            id: `val-${idx}`,
            key,
            value: value as string,
          }))
        );
        setTimeout(initialTool.error_handling?.timeout || 30);
        setFallbackError(initialTool.error_handling?.fallback_response?.error || "");
        setFallbackMessage(initialTool.error_handling?.fallback_response?.message || "");
      } else {
        setTool({
          name: "",
          method: "GET",
          endpoint: "",
          description: "",
          headers: {},
          values: {},
          parameters: {},
          error_handling: {
            timeout: 30,
            retry_count: 0,
            fallback_response: {},
          },
        });
        setHeadersList([]);
        setBodyParams([]);
        setPathParams([]);
        setQueryParams([]);
        setValuesList([]);
        setTimeout(30);
        setFallbackError("");
        setFallbackMessage("");
      }
    }
  }, [open, initialTool]);

  const handleAddHeader = () => {
    setHeadersList([...headersList, { id: `header-${Date.now()}`, key: "", value: "" }]);
  };
  const handleRemoveHeader = (id: string) => {
    setHeadersList(headersList.filter((h) => h.id !== id));
  };
  const handleHeaderChange = (id: string, field: "key" | "value", value: string) => {
    setHeadersList(headersList.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  const handleAddBodyParam = () => {
    setBodyParams([
      ...bodyParams,
      {
        id: `body-${Date.now()}`,
        key: "",
        param: { type: "string", required: false, description: "" },
      },
    ]);
  };
  const handleRemoveBodyParam = (id: string) => {
    setBodyParams(bodyParams.filter((p) => p.id !== id));
  };
  const handleBodyParamChange = (id: string, field: "key" | keyof HTTPToolParameter, value: string | boolean) => {
    setBodyParams(
      bodyParams.map((p) =>
        p.id === id
          ? field === "key"
            ? { ...p, key: value as string }
            : { ...p, param: { ...p.param, [field]: value } }
          : p
      )
    );
  };

  // Path Params
  const handleAddPathParam = () => {
    setPathParams([...pathParams, { id: `path-${Date.now()}`, key: "", desc: "" }]);
  };
  const handleRemovePathParam = (id: string) => {
    setPathParams(pathParams.filter((p) => p.id !== id));
  };
  const handlePathParamChange = (id: string, field: "key" | "desc", value: string) => {
    setPathParams(pathParams.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Query Params
  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { id: `query-${Date.now()}`, key: "", value: "" }]);
  };
  const handleRemoveQueryParam = (id: string) => {
    setQueryParams(queryParams.filter((q) => q.id !== id));
  };
  const handleQueryParamChange = (id: string, field: "key" | "value", value: string) => {
    setQueryParams(queryParams.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  // Values
  const handleAddValue = () => {
    setValuesList([...valuesList, { id: `val-${Date.now()}`, key: "", value: "" }]);
  };
  const handleRemoveValue = (id: string) => {
    setValuesList(valuesList.filter((v) => v.id !== id));
  };
  const handleValueChange = (id: string, field: "key" | "value", value: string) => {
    setValuesList(valuesList.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleSave = () => {
    if (!tool.name || !tool.endpoint) return;
    const headersObject: Record<string, string> = {};
    headersList.forEach((h) => {
      if (h.key.trim()) headersObject[h.key] = h.value;
    });
    const bodyParamsObject: Record<string, HTTPToolParameter> = {};
    bodyParams.forEach((p) => {
      if (p.key.trim()) bodyParamsObject[p.key] = p.param;
    });
    const pathParamsObject: Record<string, string> = {};
    pathParams.forEach((p) => {
      if (p.key.trim()) pathParamsObject[p.key] = p.desc;
    });
    const queryParamsObject: Record<string, string> = {};
    queryParams.forEach((q) => {
      if (q.key.trim()) queryParamsObject[q.key] = q.value;
    });
    const valuesObject: Record<string, string> = {};
    valuesList.forEach((v) => {
      if (v.key.trim()) valuesObject[v.key] = v.value;
    });
    
    // Sanitize the tool name
    const sanitizedName = sanitizeAgentName(tool.name);
    
    onSave({
      ...(tool as HTTPTool),
      name: sanitizedName,
      headers: headersObject,
      values: valuesObject,
      parameters: {
        ...tool.parameters,
        body_params: bodyParamsObject,
        path_params: pathParamsObject,
        query_params: queryParamsObject,
      },
      error_handling: {
        timeout,
        retry_count: tool.error_handling?.retry_count ?? 0,
        fallback_response: {
          error: fallbackError,
          message: fallbackMessage,
        },
      },
    } as HTTPTool);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {initialTool ? "Edit Custom Tool" : "Add Custom Tool"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Configure the HTTP tool (custom tool) for this agent.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Name</Label>
              <Input
                value={tool.name || ""}
                onChange={(e) => setTool({ ...tool, name: e.target.value })}
                onBlur={(e) => {
                  const sanitizedName = sanitizeAgentName(e.target.value);
                  if (sanitizedName !== e.target.value) {
                    setTool({ ...tool, name: sanitizedName });
                  }
                }}
                className="bg-[#222] border-[#444] text-white"
                placeholder="Tool name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300">HTTP Method</Label>
              <select
                value={tool.method || "GET"}
                onChange={(e) => setTool({ ...tool, method: e.target.value })}
                className="w-full bg-[#222] border-[#444] text-white rounded-md px-3 py-2"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Endpoint URL</Label>
            <Input
              value={tool.endpoint || ""}
              onChange={(e) => setTool({ ...tool, endpoint: e.target.value })}
              className="bg-[#222] border-[#444] text-white"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Description</Label>
            <Input
              value={tool.description || ""}
              onChange={(e) => setTool({ ...tool, description: e.target.value })}
              className="bg-[#222] border-[#444] text-white"
              placeholder="Tool description"
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">HTTP Headers</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222]">
              {headersList.map((header) => (
                <div key={header.id} className="grid grid-cols-5 items-center gap-2 mb-2">
                  <Input
                    value={header.key}
                    onChange={(e) => handleHeaderChange(header.id, "key", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Header Name"
                  />
                  <Input
                    value={header.value}
                    onChange={(e) => handleHeaderChange(header.id, "value", e.target.value)}
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
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Body Parameters</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222]">
              {bodyParams.map((param) => (
                <div key={param.id} className="grid grid-cols-6 items-center gap-2 mb-2">
                  <Input
                    value={param.key}
                    onChange={(e) => handleBodyParamChange(param.id, "key", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Param Name"
                  />
                  <select
                    value={param.param.type}
                    onChange={(e) => handleBodyParamChange(param.id, "type", e.target.value)}
                    className="col-span-1 bg-[#333] border-[#444] text-white rounded-md px-2 py-1"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                  <Input
                    value={param.param.description}
                    onChange={(e) => handleBodyParamChange(param.id, "description", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Description"
                  />
                  <label className="col-span-1 flex items-center gap-1 text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={param.param.required}
                      onChange={(e) => handleBodyParamChange(param.id, "required", e.target.checked)}
                      className="accent-emerald-400"
                    />
                    Required
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBodyParam(param.id)}
                    className="col-span-1 h-8 text-red-500 hover:text-red-400 hover:bg-[#444]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBodyParam}
                className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Body Param
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Path Parameters</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222]">
              {pathParams.map((param) => (
                <div key={param.id} className="grid grid-cols-5 items-center gap-2 mb-2">
                  <Input
                    value={param.key}
                    onChange={(e) => handlePathParamChange(param.id, "key", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Param Name"
                  />
                  <Input
                    value={param.desc}
                    onChange={(e) => handlePathParamChange(param.id, "desc", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Description"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePathParam(param.id)}
                    className="col-span-1 h-8 text-red-500 hover:text-red-400 hover:bg-[#444]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPathParam}
                className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Path Param
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Query Parameters</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222]">
              {queryParams.map((param) => (
                <div key={param.id} className="grid grid-cols-5 items-center gap-2 mb-2">
                  <Input
                    value={param.key}
                    onChange={(e) => handleQueryParamChange(param.id, "key", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Param Name"
                  />
                  <Input
                    value={param.value}
                    onChange={(e) => handleQueryParamChange(param.id, "value", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Default Value"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQueryParam(param.id)}
                    className="col-span-1 h-8 text-red-500 hover:text-red-400 hover:bg-[#444]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddQueryParam}
                className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Query Param
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Default Values</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222]">
              {valuesList.map((val) => (
                <div key={val.id} className="grid grid-cols-5 items-center gap-2 mb-2">
                  <Input
                    value={val.key}
                    onChange={(e) => handleValueChange(val.id, "key", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Key"
                  />
                  <Input
                    value={val.value}
                    onChange={(e) => handleValueChange(val.id, "value", e.target.value)}
                    className="col-span-2 bg-[#333] border-[#444] text-white"
                    placeholder="Value"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveValue(val.id)}
                    className="col-span-1 h-8 text-red-500 hover:text-red-400 hover:bg-[#444]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddValue}
                className="w-full mt-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 bg-[#222] hover:text-emerald-400"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Value
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Error Handling</h3>
            <div className="border border-[#444] rounded-md p-3 bg-[#222] space-y-2">
              <div className="flex gap-4 items-center">
                <Label className="text-neutral-300">Timeout (s)</Label>
                <Input
                  type="number"
                  min={1}
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                  className="w-24 bg-[#333] border-[#444] text-white"
                />
              </div>
              <div className="flex gap-4 items-center">
                <Label className="text-neutral-300">Fallback Error</Label>
                <Input
                  value={fallbackError}
                  onChange={(e) => setFallbackError(e.target.value)}
                  className="bg-[#333] border-[#444] text-white"
                  placeholder="error"
                />
              </div>
              <div className="flex gap-4 items-center">
                <Label className="text-neutral-300">Fallback Message</Label>
                <Input
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                  className="bg-[#333] border-[#444] text-white"
                  placeholder="Custom error message"
                />
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
            disabled={!tool.name || !tool.endpoint}
          >
            {initialTool ? "Save Changes" : "Add Tool"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 