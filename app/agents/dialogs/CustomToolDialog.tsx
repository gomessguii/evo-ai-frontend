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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Plus, 
  Info, 
  Trash, 
  Globe, 
  FileJson, 
  LayoutList, 
  Settings, 
  Database,
  Code,
  Server,
  Wand
} from "lucide-react";
import { useState, useEffect } from "react";
import { HTTPTool, HTTPToolParameter } from "@/types/agent";
import { sanitizeAgentName } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const [activeTab, setActiveTab] = useState("basics");

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
      setActiveTab("basics");
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

  const ParamField = ({ 
    children, 
    label, 
    tooltip
  }: { 
    children: React.ReactNode, 
    label: string, 
    tooltip?: string 
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-neutral-200">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-neutral-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-neutral-800 border-neutral-700 text-white p-3 max-w-sm">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  );

  const FieldList = <T extends Record<string, any>>({ 
    items, 
    onAdd, 
    onRemove, 
    onChange, 
    fields, 
    addText, 
    emptyText, 
    icon 
  }: { 
    items: T[], 
    onAdd: () => void, 
    onRemove: (id: string) => void, 
    onChange: (id: string, field: string, value: any) => void, 
    fields: { name: string, field: string, placeholder: string, width: number, type?: string }[],
    addText: string,
    emptyText: string,
    icon: React.ReactNode
  }) => (
    <div className="border border-neutral-700 rounded-md p-3 bg-neutral-800/50">
      {items.length > 0 ? (
        <div className="space-y-2 mb-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <div className="flex-1 flex gap-2 w-full">
                {fields.map(field => {
                  // Calculate percentage width based on the field's width value
                  const widthPercent = (field.width / 12) * 100;
                  
                  return (
                    <div 
                      key={field.name} 
                      className="flex-shrink-0"
                      style={{ width: `${widthPercent}%` }}
                    >
                      {field.type === 'select' ? (
                        <select
                          value={(field.field.includes('.') 
                            ? item.param?.[field.field.split('.')[1]] 
                            : item[field.field]) || ''}
                          onChange={(e) => onChange(
                            item.id, 
                            field.field,
                            e.target.value
                          )}
                          className="w-full h-9 px-3 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-white text-sm"
                        >
                          <option value="string">string</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center h-9 w-full justify-center">
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={item.param?.required || false}
                              onChange={(e) => onChange(
                                item.id, 
                                field.field,
                                (e.target as HTMLInputElement).checked
                              )}
                              className="accent-emerald-400 rounded"
                            />
                            <span className="text-xs text-neutral-300">Required</span>
                          </label>
                        </div>
                      ) : (
                        <Input
                          value={(field.field.includes('.') 
                            ? item.param?.[field.field.split('.')[1]] 
                            : item[field.field]) || ''}
                          onChange={(e) => onChange(
                            item.id, 
                            field.field,
                            e.target.value
                          )}
                          className="h-9 w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 text-sm"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="h-9 w-9 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          {icon}
          <p className="mt-2 text-neutral-400 text-sm">{emptyText}</p>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-neutral-800/30"
      >
        <Plus className="h-4 w-4 mr-1.5" /> {addText}
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col bg-neutral-900 border-neutral-700 p-0">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Area */}
          <div className="flex items-start justify-between p-6 border-b border-neutral-800">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Wand className="h-5 w-5 text-emerald-400" />
                {initialTool ? "Edit Custom Tool" : "Create Custom Tool"}
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Configure an HTTP tool for your agent to interact with external APIs
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-neutral-800 text-emerald-400 border-emerald-500/30 uppercase text-xs font-semibold px-2 py-0.5">
                {tool.method || "GET"}
              </Badge>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Navigation */}
            <div className="w-[200px] bg-neutral-800/50 border-r border-neutral-800 flex-shrink-0">
              <div className="py-4">
                <nav className="space-y-1 px-2">
                  {[
                    { id: 'basics', label: 'Basic Info', icon: <Info className="h-4 w-4" /> },
                    { id: 'endpoint', label: 'Endpoint', icon: <Globe className="h-4 w-4" /> },
                    { id: 'headers', label: 'Headers', icon: <Server className="h-4 w-4" /> },
                    { id: 'body', label: 'Body Params', icon: <FileJson className="h-4 w-4" /> },
                    { id: 'path', label: 'Path Params', icon: <Code className="h-4 w-4" /> },
                    { id: 'query', label: 'Query Params', icon: <LayoutList className="h-4 w-4" /> },
                    { id: 'defaults', label: 'Default Values', icon: <Database className="h-4 w-4" /> },
                    { id: 'error', label: 'Error Handling', icon: <Settings className="h-4 w-4" /> },
                  ].map(item => (
                    <button
                      key={item.id}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        activeTab === item.id 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                      )}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {(
                        (item.id === 'headers' && headersList.length > 0) ||
                        (item.id === 'body' && bodyParams.length > 0) ||
                        (item.id === 'path' && pathParams.length > 0) ||
                        (item.id === 'query' && queryParams.length > 0) ||
                        (item.id === 'defaults' && valuesList.length > 0)
                      ) && (
                        <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs rounded-full px-1.5 py-0.5 min-w-[18px]">
                          {item.id === 'headers' && headersList.length}
                          {item.id === 'body' && bodyParams.length}
                          {item.id === 'path' && pathParams.length}
                          {item.id === 'query' && queryParams.length}
                          {item.id === 'defaults' && valuesList.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'basics' && (
                <div className="p-6">
                  <div className="space-y-6">
                    <ParamField 
                      label="Tool Name" 
                      tooltip="A unique identifier for this tool. Will be used by the agent to reference this tool."
                    >
              <Input
                value={tool.name || ""}
                onChange={(e) => setTool({ ...tool, name: e.target.value })}
                onBlur={(e) => {
                  const sanitizedName = sanitizeAgentName(e.target.value);
                  if (sanitizedName !== e.target.value) {
                    setTool({ ...tool, name: sanitizedName });
                  }
                }}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        placeholder="e.g. weatherApi, searchTool"
                      />
                    </ParamField>

                    <ParamField 
                      label="Description" 
                      tooltip="A clear description of what this tool does. The agent will use this to determine when to use the tool."
                    >
            <Input
              value={tool.description || ""}
              onChange={(e) => setTool({ ...tool, description: e.target.value })}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        placeholder="Provides weather information for a given location"
            />
                    </ParamField>
          </div>
                </div>
              )}

              {activeTab === 'endpoint' && (
                <div className="p-6">
                  <div className="space-y-6">
                    <ParamField 
                      label="HTTP Method" 
                      tooltip="The HTTP method to use for the request."
                    >
                      <div className="flex gap-1">
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(method => (
              <Button
                            key={method}
                            type="button"
                            onClick={() => setTool({ ...tool, method })}
                            className={cn(
                              "px-4 py-2 rounded font-medium text-sm flex-1",
                              tool.method === method
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
                            )}
                          >
                            {method}
              </Button>
                        ))}
                      </div>
                    </ParamField>

                    <ParamField 
                      label="Endpoint URL" 
                      tooltip="The complete URL to call. Can include path parameters with the format {paramName}."
                    >
                      <div className="space-y-1">
                        <Input
                          value={tool.endpoint || ""}
                          onChange={(e) => setTool({ ...tool, endpoint: e.target.value })}
                          className="bg-neutral-800 border-neutral-700 text-white font-mono"
                          placeholder="https://api.example.com/v1/resource/{id}"
                        />
                        {tool.endpoint && tool.endpoint.includes('{') && (
                          <p className="text-xs text-amber-400">
                            <Info className="h-3 w-3 inline-block mr-1" /> 
                            URL contains path variables. Don't forget to define them in the Path Parameters section.
                          </p>
                        )}
                      </div>
                    </ParamField>

                    <div className="p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md mt-6">
                      <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" /> How to use variables in your endpoint
                      </h3>
                      <p className="text-neutral-300 text-sm mb-3">
                        You can use dynamic variables in your endpoint using the <code className="bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-300">{"{VARIABLE_NAME}"}</code> syntax.
                      </p>
                      <div className="grid grid-cols-1 gap-4 text-xs">
                        <div>
                          <h4 className="font-medium text-white mb-1">Example:</h4>
                          <code className="block bg-neutral-900 text-neutral-200 p-2 rounded">
                            https://api.example.com/users/<span className="text-emerald-400">{"{userId}"}</span>/profile
                          </code>
                          <p className="mt-1 text-neutral-400">Define <code className="bg-neutral-700 px-1 py-0.5 rounded text-emerald-300">userId</code> as a Path Parameter</p>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
              )}

              {activeTab === 'headers' && (
                <div className="p-6">
                  <ParamField 
                    label="HTTP Headers" 
                    tooltip="Headers to send with each request. Common examples include Authorization, Content-Type, Accept, etc."
                  >
                    <FieldList
                      items={headersList}
                      onAdd={handleAddHeader}
                      onRemove={handleRemoveHeader}
                      onChange={(id, field, value) => {
                        handleHeaderChange(
                          id, 
                          field as "key" | "value", 
                          value as string
                        );
                      }}
                      fields={[
                        { name: "Header Name", field: "key", placeholder: "e.g. Authorization", width: 6 },
                        { name: "Header Value", field: "value", placeholder: "e.g. Bearer token123", width: 6 }
                      ]}
                      addText="Add Header"
                      emptyText="No headers configured. Add headers to customize your HTTP requests."
                      icon={<Server className="h-10 w-10 text-neutral-700" />}
                    />
                  </ParamField>
                </div>
              )}

              {activeTab === 'body' && (
                <div className="p-6">
                  <div className="mb-6 p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md">
                    <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> About Body Parameters
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      Parameters that will be sent in the request body. Only applicable for POST, PUT, and PATCH methods.
                      You can use variables like <code className="bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-300">{"{variableName}"}</code> that will be replaced at runtime.
                    </p>
            </div>
                  
                  <FieldList
                    items={bodyParams}
                    onAdd={handleAddBodyParam}
                    onRemove={handleRemoveBodyParam}
                    onChange={(id, field, value) => {
                      if (field === "key") {
                        handleBodyParamChange(id, "key", value as string);
                      } else if (field.startsWith("param.")) {
                        const paramField = field.split('.')[1] as keyof HTTPToolParameter;
                        handleBodyParamChange(id, paramField, 
                          paramField === "required" ? value as boolean : value as string
                        );
                      }
                    }}
                    fields={[
                      { name: "Parameter Name", field: "key", placeholder: "e.g. userId", width: 4 },
                      { name: "Type", field: "param.type", placeholder: "", width: 2, type: "select" },
                      { name: "Description", field: "param.description", placeholder: "What this parameter does", width: 4 },
                      { name: "Required", field: "param.required", placeholder: "", width: 2, type: "checkbox" }
                    ]}
                    addText="Add Body Parameter"
                    emptyText="No body parameters configured. Add parameters for POST/PUT/PATCH requests."
                    icon={<FileJson className="h-10 w-10 text-neutral-700" />}
                  />
                </div>
              )}

              {activeTab === 'path' && (
                <div className="p-6">
                  <div className="mb-6 p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md">
                    <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> About Path Parameters
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      Path parameters are placeholders in your URL path that will be replaced with actual values.
                      For example, in <code className="bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-300">https://api.example.com/users/{"{userId}"}</code>,
                      <code className="bg-neutral-700 px-1 py-0.5 rounded text-emerald-300">userId</code> is a path parameter.
                    </p>
                  </div>

                  <FieldList
                    items={pathParams}
                    onAdd={handleAddPathParam}
                    onRemove={handleRemovePathParam}
                    onChange={(id, field, value) => {
                      handlePathParamChange(
                        id, 
                        field as "key" | "desc", 
                        value as string
                      );
                    }}
                    fields={[
                      { name: "Parameter Name", field: "key", placeholder: "e.g. userId", width: 4 },
                      { name: "Description", field: "desc", placeholder: "What this parameter represents", width: 6 },
                      { name: "Required", field: "required", placeholder: "", width: 2, type: "checkbox" }
                    ]}
                    addText="Add Path Parameter"
                    emptyText="No path parameters configured. Add parameters if your endpoint URL contains {placeholders}."
                    icon={<Code className="h-10 w-10 text-neutral-700" />}
                  />
                </div>
              )}

              {activeTab === 'query' && (
                <div className="p-6">
                  <div className="mb-6 p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md">
                    <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> About Query Parameters
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      Query parameters are added to the URL after a question mark (?) to filter or customize the request.
                      For example: <code className="bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-300">https://api.example.com/search?query=term&limit=10</code>
                    </p>
            </div>

                  <FieldList
                    items={queryParams}
                    onAdd={handleAddQueryParam}
                    onRemove={handleRemoveQueryParam}
                    onChange={(id, field, value) => {
                      handleQueryParamChange(
                        id, 
                        field as "key" | "value", 
                        value as string
                      );
                    }}
                    fields={[
                      { name: "Parameter Name", field: "key", placeholder: "e.g. search", width: 4 },
                      { name: "Description", field: "value", placeholder: "What this parameter does", width: 6 },
                      { name: "Required", field: "required", placeholder: "", width: 2, type: "checkbox" }
                    ]}
                    addText="Add Query Parameter"
                    emptyText="No query parameters configured. Add parameters to customize your URL query string."
                    icon={<LayoutList className="h-10 w-10 text-neutral-700" />}
                  />
                </div>
              )}

              {activeTab === 'defaults' && (
                <div className="p-6">
                  <div className="mb-6 p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md">
                    <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> About Default Values
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      Set default values for parameters you've defined in the Body, Path, or Query sections.
                      These values will be used when the parameter isn't explicitly provided during a tool call.
                    </p>
            </div>

                  <FieldList
                    items={valuesList}
                    onAdd={handleAddValue}
                    onRemove={handleRemoveValue}
                    onChange={(id, field, value) => {
                      handleValueChange(
                        id, 
                        field as "key" | "value", 
                        value as string
                      );
                    }}
                    fields={[
                      { name: "Parameter Name", field: "key", placeholder: "Name of an existing parameter", width: 5 },
                      { name: "Default Value", field: "value", placeholder: "Value to use if not provided", width: 7 }
                    ]}
                    addText="Add Default Value"
                    emptyText="No default values configured. Add default values for your previously defined parameters."
                    icon={<Database className="h-10 w-10 text-neutral-700" />}
                  />
                </div>
              )}

              {activeTab === 'error' && (
                <div className="p-6">
                  <div className="mb-6 p-4 bg-neutral-800/80 border border-emerald-600/20 rounded-md">
                    <h3 className="text-emerald-400 text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" /> About Error Handling
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      Configure how the tool should handle errors and timeouts when making HTTP requests.
                      Proper error handling ensures reliable operation of your agent.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <ParamField 
                      label="Timeout (seconds)" 
                      tooltip="Maximum time to wait for a response before considering the request failed."
                    >
                <Input
                  type="number"
                  min={1}
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                        className="w-32 bg-neutral-800 border-neutral-700 text-white"
                />
                    </ParamField>

                    <ParamField 
                      label="Fallback Error Code" 
                      tooltip="Error code to return if the request fails."
                    >
                <Input
                  value={fallbackError}
                  onChange={(e) => setFallbackError(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        placeholder="e.g. API_ERROR"
                />
                    </ParamField>

                    <ParamField 
                      label="Fallback Error Message" 
                      tooltip="Human-readable message to return if the request fails."
                    >
                <Input
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                        className="bg-neutral-800 border-neutral-700 text-white"
                        placeholder="e.g. Failed to retrieve data from the API."
                />
                    </ParamField>
                  </div>
              </div>
              )}
            </div>
          </div>
          
          {/* Footer Area */}
          <div className="border-t border-neutral-800 p-4 flex items-center justify-between">
          <Button
              variant="ghost"
            onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
              className="bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
            disabled={!tool.name || !tool.endpoint}
          >
              {initialTool ? "Save Changes" : "Create Tool"}
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 