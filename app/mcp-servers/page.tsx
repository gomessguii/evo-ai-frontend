/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/mcp-servers/page.tsx                                             │
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
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Plus, MoreHorizontal, Edit, Trash2, Search, PenToolIcon as Tool } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createMCPServer,
  listMCPServers,
  getMCPServer,
  updateMCPServer,
  deleteMCPServer,
} from "@/services/mcpServerService"
import { MCPServer, MCPServerCreate, ToolConfig } from "@/types/mcpServer"

export default function MCPServersPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  const [serverData, setServerData] = useState<{
    name: string
    description: string
    type: string
    config_type: "sse" | "studio"
    url: string
    headers: { key: string; value: string }[]
    command: string
    args: string
    environments: { key: string }[]
    tools: ToolConfig[]
  }>({
    name: "",
    description: "",
    type: "official",
    config_type: "sse",
    url: "",
    headers: [{ key: "x-api-key", value: "" }],
    command: "npx",
    args: "",
    environments: [],
    tools: [],
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  const [mcpServers, setMcpServers] = useState<MCPServer[]>([])

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true)
      try {
        const res = await listMCPServers((page - 1) * limit, limit)
        setMcpServers(res.data)
        setTotal(res.data.length)
      } catch (error) {
        toast({
          title: "Error loading MCP servers",
          description: "Unable to load servers.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchServers()
  }, [page, limit])

  // Search server by name/description (local filter)
  const filteredServers = Array.isArray(mcpServers)
    ? mcpServers.filter(
        (server) =>
          server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (server.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleAddHeader = () => {
    setServerData({
      ...serverData,
      headers: [...serverData.headers, { key: "", value: "" }],
    })
  }

  const handleRemoveHeader = (index: number) => {
    const updatedHeaders = [...serverData.headers]
    updatedHeaders.splice(index, 1)
    setServerData({
      ...serverData,
      headers: updatedHeaders,
    })
  }

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const updatedHeaders = [...serverData.headers]
    updatedHeaders[index][field] = value
    setServerData({
      ...serverData,
      headers: updatedHeaders,
    })
  }

  const handleAddEnvironment = () => {
    setServerData({
      ...serverData,
      environments: [...serverData.environments, { key: "" }],
    })
  }

  const handleRemoveEnvironment = (index: number) => {
    const updatedEnvironments = [...serverData.environments]
    updatedEnvironments.splice(index, 1)
    setServerData({
      ...serverData,
      environments: updatedEnvironments,
    })
  }

  const handleEnvironmentChange = (index: number, value: string) => {
    const updatedEnvironments = [...serverData.environments]
    updatedEnvironments[index].key = value
    setServerData({
      ...serverData,
      environments: updatedEnvironments,
    })
  }

  const handleAddTool = () => {
    const name = "new_tool";
    const newTool: ToolConfig = {
      id: name,
      name: name,
      description: "",
      tags: [],
      examples: [],
      inputModes: ["text"],
      outputModes: ["text"],
    }
    setServerData({
      ...serverData,
      tools: [...serverData.tools, newTool],
    })
  }

  const handleRemoveTool = (index: number) => {
    const updatedTools = [...serverData.tools]
    updatedTools.splice(index, 1)
    setServerData({
      ...serverData,
      tools: updatedTools,
    })
  }

  const handleToolChange = (index: number, field: keyof ToolConfig, value: any) => {
    const updatedTools = [...serverData.tools]
    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    }
    
    if (field === 'name') {
      updatedTools[index].id = value;
    }
    
    setServerData({
      ...serverData,
      tools: updatedTools,
    })
  }

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Convert environments array to object
      const environmentsObj: Record<string, string> = {}
      serverData.environments.forEach((env) => {
        if (env.key) {
          environmentsObj[env.key] = `env@@${env.key}`
        }
      })
      // Convert headers array to object
      const headersObj: Record<string, string> = {}
      serverData.headers.forEach((header) => {
        if (header.key) {
          headersObj[header.key] = header.value
        }
      })
      let config_json: any = {}
      if (serverData.config_type === "sse") {
        config_json = {
          url: serverData.url,
          headers: headersObj,
        }
      } else if (serverData.config_type === "studio") {
        const args = serverData.args.split("\n").filter((arg) => arg.trim() !== "")
        const envObj: Record<string, string> = {}
        serverData.environments.forEach((env) => {
          if (env.key) {
            envObj[env.key] = `env@@${env.key}`
          }
        })
        config_json = {
          command: serverData.command,
          args: args,
          env: envObj,
        }
      }
      const payload: MCPServerCreate = {
        name: serverData.name,
        description: serverData.description,
        type: serverData.type,
        config_type: serverData.config_type,
        config_json,
        environments: environmentsObj,
        tools: serverData.tools,
      }
      if (selectedServer) {
        await updateMCPServer(selectedServer.id, payload)
        toast({
          title: "Server updated",
          description: `${serverData.name} was updated successfully.`,
        })
      } else {
        await createMCPServer(payload)
        toast({
          title: "Server added",
          description: `${serverData.name} was added successfully.`,
        })
      }
      setIsDialogOpen(false)
      resetForm()
      // Reload list
      const res = await listMCPServers((page - 1) * limit, limit)
      setMcpServers(res.data)
      setTotal(res.data.length)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to save the MCP server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditServer = async (server: MCPServer) => {
    setIsLoading(true)
    try {
      const res = await getMCPServer(server.id)
      setSelectedServer(res.data)
      // Convert environments object to array
      const environmentsArray = Object.keys(res.data.environments || {}).map((key) => ({ key }))
      // Convert headers object to array
      const headersArray = res.data.config_json.headers
        ? Object.entries(res.data.config_json.headers).map(([key, value]) => ({ key, value: value as string }))
        : [{ key: "x-api-key", value: "" }]
      if (res.data.config_type === "sse") {
        setServerData({
          name: res.data.name,
          description: res.data.description || "",
          type: res.data.type,
          config_type: res.data.config_type as any,
          url: res.data.config_json.url || "",
          headers: headersArray,
          command: "",
          args: "",
          environments: environmentsArray,
          tools: res.data.tools,
        })
      } else if (res.data.config_type === "studio") {
        setServerData({
          name: res.data.name,
          description: res.data.description || "",
          type: res.data.type,
          config_type: res.data.config_type as any,
          url: "",
          headers: [],
          command: res.data.config_json.command || "npx",
          args: (res.data.config_json.args || []).join("\n"),
          environments: environmentsArray,
          tools: res.data.tools,
        })
      }
      setActiveTab("basic")
      setIsDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error searching MCP server",
        description: "Unable to search the server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteServer = (server: MCPServer) => {
    setSelectedServer(server)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteServer = async () => {
    if (!selectedServer) return
    setIsLoading(true)
    try {
      await deleteMCPServer(selectedServer.id)
      toast({
        title: "Server deleted",
        description: `${selectedServer.name} was deleted successfully.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedServer(null)
      // Reload list
      const res = await listMCPServers((page - 1) * limit, limit)
      setMcpServers(res.data)
      setTotal(res.data.length)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to delete the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setServerData({
      name: "",
      description: "",
      type: "official",
      config_type: "sse",
      url: "",
      headers: [{ key: "x-api-key", value: "" }],
      command: "npx",
      args: "",
      environments: [],
      tools: [],
    })
    setSelectedServer(null)
    setActiveTab("basic")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">MCP Servers Management</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-emerald-400 text-black hover:bg-[#00cc7d]">
              <Plus className="mr-2 h-4 w-4" />
              New MCP Server
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
            <form onSubmit={handleAddServer}>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedServer ? "Edit MCP Server" : "New MCP Server"}
                </DialogTitle>
                <DialogDescription className="text-neutral-400">
                  {selectedServer
                    ? "Edit the existing MCP server information."
                    : "Fill in the information to create a new MCP server."}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid grid-cols-3 bg-[#222]">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
                  >
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="environments"
                    className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
                  >
                    Environment Variables
                  </TabsTrigger>
                  <TabsTrigger
                    value="tools"
                    className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
                  >
                    Tools
                  </TabsTrigger>
                </TabsList>

                <div className="overflow-y-auto max-h-[60vh] p-4">
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-neutral-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={serverData.name}
                        onChange={(e) => setServerData({ ...serverData, name: e.target.value })}
                        className="bg-[#222] border-[#444] text-white"
                        placeholder="MCP Server Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-neutral-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={serverData.description}
                        onChange={(e) => setServerData({ ...serverData, description: e.target.value })}
                        className="bg-[#222] border-[#444] text-white"
                        placeholder="MCP Server Description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-neutral-300">
                        Type
                      </Label>
                      <Select
                        value={serverData.type}
                        onValueChange={(value) => setServerData({ ...serverData, type: value })}
                      >
                        <SelectTrigger id="type" className="w-full bg-[#222] border-[#444] text-white">
                          <SelectValue placeholder="Select the type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#222] border-[#444] text-white">
                          <SelectItem value="official">Official</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="config_type" className="text-neutral-300">
                        Configuration Type
                      </Label>
                      <Select
                        value={serverData.config_type}
                        onValueChange={(value: "sse" | "studio") =>
                          setServerData({ ...serverData, config_type: value })
                        }
                      >
                        <SelectTrigger id="config_type" className="w-full bg-[#222] border-[#444] text-white">
                          <SelectValue placeholder="Select the configuration type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#222] border-[#444] text-white">
                          <SelectItem value="sse">SSE (Server-Sent Events)</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Specific fields for SSE */}
                    {serverData.config_type === "sse" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="url" className="text-neutral-300">
                            URL
                          </Label>
                          <Input
                            id="url"
                            value={serverData.url}
                            onChange={(e) => setServerData({ ...serverData, url: e.target.value })}
                            className="bg-[#222] border-[#444] text-white"
                            placeholder="https://your_server.com/sse"
                            required={serverData.config_type === "sse"}
                          />
                        </div>

                        {/* Dynamic headers */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-neutral-300">Headers</Label>
                            <Button
                              type="button"
                              onClick={handleAddHeader}
                              className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
                              size="sm"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Header
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {serverData.headers.map((header, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Label htmlFor={`header-key-${index}`} className="sr-only">
                                    Header Name
                                  </Label>
                                  <Input
                                    id={`header-key-${index}`}
                                    value={header.key}
                                    onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                                    className="bg-[#222] border-[#444] text-white"
                                    placeholder="Header Name"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor={`header-value-${index}`} className="sr-only">
                                    Header Value
                                  </Label>
                                  <Input
                                    id={`header-value-${index}`}
                                    value={header.value}
                                    onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                                    className="bg-[#222] border-[#444] text-white"
                                    placeholder="Header Value"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveHeader(index)}
                                  className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Specific fields for Studio */}
                    {serverData.config_type === "studio" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="command" className="text-neutral-300">
                            Command
                          </Label>
                          <Input
                            id="command"
                            value={serverData.command}
                            onChange={(e) => setServerData({ ...serverData, command: e.target.value })}
                            className="bg-[#222] border-[#444] text-white"
                            placeholder="npx"
                            required={serverData.config_type === "studio"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="args" className="text-neutral-300">
                            Arguments (one per line)
                          </Label>
                          <Textarea
                            id="args"
                            value={serverData.args}
                            onChange={(e) => setServerData({ ...serverData, args: e.target.value })}
                            className="bg-[#222] border-[#444] text-white"
                            placeholder="-y
@modelcontextprotocol/server-brave-search"
                            required={serverData.config_type === "studio"}
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="environments" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">Environment Variables</h3>
                      <Button
                        type="button"
                        onClick={handleAddEnvironment}
                        className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Environment Variable
                      </Button>
                    </div>

                    {serverData.environments.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        No environment variables configured. Click "Add Variable" to start.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serverData.environments.map((env, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Label htmlFor={`env-key-${index}`} className="sr-only">
                                Environment Variable Name
                              </Label>
                              <Input
                                id={`env-key-${index}`}
                                value={env.key}
                                onChange={(e) => handleEnvironmentChange(index, e.target.value)}
                                className="bg-[#222] border-[#444] text-white"
                                placeholder="ENV_VARIABLE_NAME"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveEnvironment(index)}
                              className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">Tools</h3>
                      <Button
                        type="button"
                        onClick={handleAddTool}
                        className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tool
                      </Button>
                    </div>

                    {serverData.tools.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400">
                        No tools configured. Click "Add Tool" to start.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {serverData.tools.map((tool, index) => (
                          <Card key={index} className="bg-[#222] border-[#444]">
                            <CardHeader className="pb-2 flex flex-row justify-between items-start">
                              <div>
                                <CardTitle className="text-white text-base">Tool {index + 1}</CardTitle>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveTool(index)}
                                className="text-red-500 hover:text-red-400 hover:bg-[#333] h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor={`tool-name-${index}`} className="text-neutral-300">
                                  Name
                                </Label>
                                <Input
                                  id={`tool-name-${index}`}
                                  value={tool.name}
                                  onChange={(e) => handleToolChange(index, "name", e.target.value)}
                                  className="bg-[#222] border-[#444] text-white"
                                  placeholder="tool_name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tool-description-${index}`} className="text-neutral-300">
                                  Description
                                </Label>
                                <Textarea
                                  id={`tool-description-${index}`}
                                  value={tool.description}
                                  onChange={(e) => handleToolChange(index, "description", e.target.value)}
                                  className="bg-[#222] border-[#444] text-white"
                                  placeholder="Tool Description"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tool-tags-${index}`} className="text-neutral-300">
                                  Tags (separated by comma)
                                </Label>
                                <Input
                                  id={`tool-tags-${index}`}
                                  value={(tool.tags ?? []).join(", ")}
                                  onChange={(e) => handleToolChange(index, "tags", e.target.value.split(", "))}
                                  className="bg-[#222] border-[#444] text-white"
                                  placeholder="tag1, tag2, tag3"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`tool-examples-${index}`} className="text-neutral-300">
                                  Examples (separated by comma)
                                </Label>
                                <Textarea
                                  id={`tool-examples-${index}`}
                                  value={(tool.examples ?? []).join(", ")}
                                  onChange={(e) => handleToolChange(index, "examples", e.target.value.split(", "))}
                                  className="bg-[#222] border-[#444] text-white"
                                  placeholder="Example 1, Example 2"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-400 text-black hover:bg-[#00cc7d]" disabled={isLoading}>
                  {isLoading ? "Saving..." : selectedServer ? "Save Changes" : "Add Server"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm delete</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Are you sure you want to delete the server "{selectedServer?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteServer}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="bg-[#1a1a1a] border-[#333] mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Search MCP Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#222] border-[#444] text-white pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#333]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333] hover:bg-[#222]">
                <TableHead className="text-neutral-300">Name</TableHead>
                <TableHead className="text-neutral-300">Description</TableHead>
                <TableHead className="text-neutral-300">Type</TableHead>
                <TableHead className="text-neutral-300">Configuration</TableHead>
                <TableHead className="text-neutral-300">Tools</TableHead>
                <TableHead className="text-neutral-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServers.length > 0 ? (
                filteredServers.map((server) => (
                  <TableRow key={server.id} className="border-[#333] hover:bg-[#222]">
                    <TableCell className="font-medium text-white">{server.name}</TableCell>
                    <TableCell className="text-neutral-300">{server.description}</TableCell>
                    <TableCell className="text-neutral-300">
                      <Badge
                        variant="outline"
                        className={
                          server.type === "official"
                            ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/30"
                            : "bg-[#ff9d00]/10 text-[#ff9d00] border-[#ff9d00]/30"
                        }
                      >
                        {server.type === "official" ? "Official" : "Community"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={
                            server.config_type === "sse"
                              ? "bg-[#00b8ff]/10 text-[#00b8ff] border-[#00b8ff]/30"
                              : "bg-[#ff5e00]/10 text-[#ff5e00] border-[#ff5e00]/30"
                          }
                        >
                          {server.config_type === "sse" ? "SSE" : "Studio"}
                        </Badge>
                        {server.config_type === "sse" && (
                          <span className="text-xs truncate max-w-[200px]">{server.config_json.url}</span>
                        )}
                        {server.config_type === "studio" && (
                          <span className="text-xs truncate max-w-[200px]">
                            {server.config_json.command} {server.config_json.args?.join(" ")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      <div className="flex items-center">
                        <Tool className="h-4 w-4 mr-1 text-emerald-400" />
                        {server.tools.length}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-300 hover:bg-[#333]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#222] border-[#444] text-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#444]" />
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#333]"
                            onClick={() => handleEditServer(server)}
                          >
                            <Edit className="mr-2 h-4 w-4 text-emerald-400" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#333] text-red-500"
                            onClick={() => handleDeleteServer(server)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                    No MCP servers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
