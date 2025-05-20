/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/config/TaskAgentConfig.tsx                                   │
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

import { Agent, TaskConfig } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Maximize2,
  Save,
  X,
  ArrowDown,
  List,
  Search,
  Edit,
  PenTool,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskAgentConfigProps {
  values: Partial<Agent>;
  onChange: (values: Partial<Agent>) => void;
  agents: Agent[];
  getAgentNameById: (id: string) => string;
  singleTask?: boolean;
}

const getAgentTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    llm: "LLM",
    a2a: "A2A",
    sequential: "Sequential",
    parallel: "Parallel",
    loop: "Loop",
    workflow: "Workflow",
    task: "Task",
  };
  return typeMap[type] || type;
};

const getAgentTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    llm: "bg-blue-800 text-white",
    a2a: "bg-purple-800 text-white",
    sequential: "bg-orange-800 text-white",
    parallel: "bg-green-800 text-white",
    loop: "bg-pink-800 text-white",
    workflow: "bg-yellow-800 text-black",
    task: "bg-green-800 text-white",
  };
  return colorMap[type] || "bg-neutral-800 text-white";
};

export function TaskAgentConfig({
  values,
  onChange,
  agents,
  getAgentNameById,
  singleTask = false,
}: TaskAgentConfigProps) {
  const [newTask, setNewTask] = useState<TaskConfig>({
    agent_id: "",
    description: "",
    expected_output: "",
    enabled_tools: [],
  });

  const [taskAgentSearchQuery, setTaskAgentSearchQuery] = useState<string>("");
  const [filteredTaskAgents, setFilteredTaskAgents] = useState<Agent[]>([]);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [toolSearchQuery, setToolSearchQuery] = useState<string>("");
  const [filteredTools, setFilteredTools] = useState<{id: string, name: string}[]>([]);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [tempSelectedTools, setTempSelectedTools] = useState<string[]>([]);

  useEffect(() => {
    if (isToolsModalOpen) {
      if (isEditing && editingTaskIndex !== null && values.config?.tasks) {
        setTempSelectedTools(
          values.config.tasks[editingTaskIndex]?.enabled_tools || []
        );
      } else {
        setTempSelectedTools([...newTask.enabled_tools || []]);
      }
    }
  }, [isToolsModalOpen]);

  const getAvailableTaskAgents = (currentTaskAgentId?: string) =>
    agents.filter(
      (agent) =>
        agent.id !== values.id &&
        (!values.config?.tasks?.some((task) => task.agent_id === agent.id) ||
          agent.id === currentTaskAgentId)
    );

  useEffect(() => {
    const currentTaskAgentId =
      isEditing && editingTaskIndex !== null && values.config?.tasks
        ? values.config.tasks[editingTaskIndex].agent_id
        : undefined;

    const availableAgents = getAvailableTaskAgents(currentTaskAgentId);

    if (taskAgentSearchQuery.trim() === "") {
      setFilteredTaskAgents(availableAgents);
    } else {
      const query = taskAgentSearchQuery.toLowerCase();
      setFilteredTaskAgents(
        availableAgents.filter(
          (agent) =>
            agent.name.toLowerCase().includes(query) ||
            (agent.description?.toLowerCase() || "").includes(query)
        )
      );
    }
  }, [
    taskAgentSearchQuery,
    agents,
    values.config?.tasks,
    isEditing,
    editingTaskIndex,
  ]);

  useEffect(() => {
    // Reset editing state when values change externally
    if (!isEditing) {
      const currentTaskAgentId =
        editingTaskIndex !== null && values.config?.tasks
          ? values.config.tasks[editingTaskIndex]?.agent_id
          : undefined;
      setFilteredTaskAgents(getAvailableTaskAgents(currentTaskAgentId));
    }
  }, [agents, values.config?.tasks]);

  const getAvailableTools = () => {
    if (!values.config?.tasks || values.config.tasks.length === 0) {
      return [];
    }

    const taskAgentIds = values.config.tasks.map(task => task.agent_id);
    
    const toolsList: {id: string, name: string}[] = [];
    const toolsMap: Record<string, boolean> = {};
    
    taskAgentIds.forEach(agentId => {
      const agent = agents.find(a => a.id === agentId);
      
      if (agent?.type === "llm" && agent.config?.tools) {
        agent.config.tools.forEach(tool => {
          if (!toolsMap[tool.id]) {
            toolsList.push({ id: tool.id, name: tool.id });
            toolsMap[tool.id] = true;
          }
        });
      }
      
      if (agent?.type === "llm" && agent.config?.mcp_servers) {
        agent.config.mcp_servers.forEach(mcp => {
          if (mcp.tools) {
            mcp.tools.forEach(toolId => {
              if (!toolsMap[toolId]) {
                toolsList.push({ id: toolId, name: toolId });
                toolsMap[toolId] = true;
              }
            });
          }
        });
      }
    });
    
    return toolsList;
  };

  useEffect(() => {
    const availableTools = getAvailableTools();
    
    if (toolSearchQuery.trim() === "") {
      setFilteredTools(availableTools);
    } else {
      const query = toolSearchQuery.toLowerCase();
      setFilteredTools(
        availableTools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.id.toLowerCase().includes(query)
        )
      );
    }
  }, [toolSearchQuery, values.config?.tasks, agents]);

  const handleAddTask = () => {
    if (!newTask.agent_id || !newTask.description) {
      return;
    }

    if (isEditing && editingTaskIndex !== null) {
      const tasks = [...(values.config?.tasks || [])];
      tasks[editingTaskIndex] = { ...newTask };

      onChange({
        ...values,
        config: {
          ...(values.config || {}),
          tasks,
        },
      });

      setIsEditing(false);
      setEditingTaskIndex(null);
    } else {
      const tasks = [...(values.config?.tasks || [])];

      if (singleTask) {
        tasks.splice(0, tasks.length, newTask);
      } else {
        tasks.push(newTask);
      }

      onChange({
        ...values,
        config: {
          ...(values.config || {}),
          tasks,
        },
      });
    }

    setNewTask({
      agent_id: "",
      description: "",
      expected_output: "",
      enabled_tools: [],
    });
  };

  const handleEditTask = (index: number) => {
    const task = values.config?.tasks?.[index];
    if (task) {
      setNewTask({ ...task });
      setIsEditing(true);
      setEditingTaskIndex(index);
    }
  };

  const handleCancelEdit = () => {
    setNewTask({
      agent_id: "",
      description: "",
      expected_output: "",
      enabled_tools: [],
    });
    setIsEditing(false);
    setEditingTaskIndex(null);
  };

  const handleRemoveTask = (index: number) => {
    if (editingTaskIndex === index) {
      handleCancelEdit();
    }

    const tasks = [...(values.config?.tasks || [])];
    tasks.splice(index, 1);

    onChange({
      ...values,
      config: {
        ...(values.config || {}),
        tasks,
      },
    });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setNewTask({
      ...newTask,
      description: newValue,
    });
  };

  const handleExpandDescription = () => {
    setExpandedDescription(newTask.description);
    setIsDescriptionModalOpen(true);
  };

  const handleSaveExpandedDescription = () => {
    setNewTask({
      ...newTask,
      description: expandedDescription,
    });
    setIsDescriptionModalOpen(false);
  };

  const handleToggleTool = (toolId: string) => {
    const index = tempSelectedTools.indexOf(toolId);
    
    if (index > -1) {
      setTempSelectedTools(tempSelectedTools.filter(id => id !== toolId));
    } else {
      setTempSelectedTools([...tempSelectedTools, toolId]);
    }
  };

  const isToolEnabled = (toolId: string) => {
    return tempSelectedTools.includes(toolId);
  };

  const handleSaveTools = () => {
    if (isEditing && editingTaskIndex !== null && values.config?.tasks) {
      const tasks = [...(values.config?.tasks || [])];
      
      const updatedTask = {
        ...tasks[editingTaskIndex],
        enabled_tools: [...tempSelectedTools]
      };
      
      tasks[editingTaskIndex] = updatedTask;
      
      const newConfig = {
        ...(values.config || {}),
        tasks: tasks
      };
      
      onChange({
        ...values,
        config: newConfig
      });
      
    } else if (newTask.agent_id) {
      const updatedNewTask = {
        ...newTask,
        enabled_tools: [...tempSelectedTools]
      };
      
      setNewTask(updatedNewTask);
    }
    
    setIsToolsModalOpen(false);
  };

  const renderAgentTypeBadge = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      return null;
    }

    return (
      <Badge className={`ml-2 ${getAgentTypeColor(agent.type)} text-xs`}>
        {getAgentTypeLabel(agent.type)}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center">
            <List className="mr-2 h-5 w-5 text-emerald-400" />
            {singleTask ? "Task" : "Tasks"}
          </h3>
        </div>

        <div className="border border-[#444] rounded-md p-4 bg-[#222]">
          <p className="text-sm text-neutral-400 mb-4">
            {singleTask
              ? "Configure the task that will be executed by the agent."
              : "Configure the sequential tasks that will be executed by the team of agents."}
          </p>

          {values.config?.tasks && values.config.tasks.length > 0 ? (
            <div className="space-y-4 mb-4">
              {values.config.tasks.map((task, index) => (
                <div
                  key={index}
                  className={`border border-[#333] rounded-md p-3 ${
                    editingTaskIndex === index ? "bg-[#1e3a3a]" : "bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-[#333] px-2 py-1 text-xs text-white mr-2">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-white flex items-center">
                          {getAgentNameById(task.agent_id)}
                          {renderAgentTypeBadge(task.agent_id)}
                        </h4>
                      </div>
                      <p className="text-sm text-neutral-300 mt-1">
                        {task.description}
                      </p>
                      {task.expected_output && (
                        <div className="mt-2">
                          <span className="text-xs text-neutral-400">
                            Expected output:
                          </span>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-[#333] text-emerald-400 border-emerald-400/30"
                          >
                            {task.expected_output}
                          </Badge>
                        </div>
                      )}
                      {task.enabled_tools && task.enabled_tools.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-neutral-400">
                            Enabled tools:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.enabled_tools.map((toolId) => (
                              <Badge
                                key={toolId}
                                className="bg-[#333] text-emerald-400 border border-emerald-400/30 text-xs"
                              >
                                {toolId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(index)}
                        className="text-neutral-400 hover:text-emerald-400 hover:bg-[#333] mr-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(index)}
                        className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {!singleTask &&
                    index < (values.config?.tasks?.length || 0) - 1 && (
                      <div className="flex justify-center my-2">
                        <ArrowDown className="h-4 w-4 text-neutral-400" />
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 mb-4 bg-[#2a2a2a] rounded-md">
              <p className="text-neutral-400">No tasks configured</p>
              <p className="text-xs text-neutral-500">
                {singleTask
                  ? "Add a task to define the agent's behavior"
                  : "Add tasks to define the workflow of the team"}
              </p>
            </div>
          )}

          {(!singleTask ||
            !values.config?.tasks ||
            values.config.tasks.length === 0 ||
            isEditing) && (
            <div className="space-y-3 border-t border-[#333] pt-4">
              <h4 className="text-sm font-medium text-white flex items-center justify-between">
                <span>
                  {isEditing
                    ? "Edit task"
                    : `Add ${singleTask ? "one" : "new"} task`}
                </span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-neutral-400 hover:text-emerald-400 hover:bg-[#333]"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                )}
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label
                    htmlFor="agent_id"
                    className="text-xs text-neutral-400 mb-1 block"
                  >
                    Agent
                  </Label>
                  <Select
                    value={newTask.agent_id}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, agent_id: value })
                    }
                  >
                    <SelectTrigger className="bg-[#2a2a2a] border-[#444] text-white">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-[#444] text-white p-0">
                      <div className="sticky top-0 z-10 p-2 bg-[#2a2a2a] border-b border-[#444]">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <Input
                            placeholder="Search agents..."
                            className="bg-[#333] border-[#444] text-white h-8 pl-8"
                            value={taskAgentSearchQuery}
                            onChange={(e) =>
                              setTaskAgentSearchQuery(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="max-h-[200px] overflow-y-auto py-1">
                        {filteredTaskAgents.length > 0 ? (
                          filteredTaskAgents.map((agent) => (
                            <SelectItem
                              key={agent.id}
                              value={agent.id}
                              className="hover:bg-[#333] focus:bg-[#333] flex items-center justify-between px-2"
                              data-agent-item="true"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">{agent.name}</span>
                                <Badge
                                  className={`${getAgentTypeColor(
                                    agent.type
                                  )} text-xs`}
                                >
                                  {getAgentTypeLabel(agent.type)}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-neutral-500 px-4 py-2 text-center">
                            No agents found
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label
                    htmlFor="description"
                    className="text-xs text-neutral-400 mb-1 block"
                  >
                    Task description
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={handleDescriptionChange}
                      className="w-full bg-[#2a2a2a] border-[#444] text-white pr-10"
                      rows={3}
                      onClick={handleExpandDescription}
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-5 text-neutral-400 hover:text-emerald-400 focus:outline-none"
                      onClick={handleExpandDescription}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    <span className="inline-block h-3 w-3 mr-1">ℹ️</span>
                    <span>
                      Use {"{"}content{"}"} to insert the user's input.
                      <span className="ml-2 text-emerald-400">
                        Click to expand editor.
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="expected_output"
                  className="text-xs text-neutral-400 mb-1 block"
                >
                  Expected output (optional)
                </Label>
                <Input
                  id="expected_output"
                  placeholder="Ex: JSON report, List of recommendations, etc."
                  value={newTask.expected_output}
                  onChange={(e) =>
                    setNewTask({ ...newTask, expected_output: e.target.value })
                  }
                  className="bg-[#2a2a2a] border-[#444] text-white"
                />
              </div>

              {newTask.enabled_tools && newTask.enabled_tools.length > 0 && (
                <div className="mt-3">
                  <Label className="text-xs text-neutral-400 mb-1 block">
                    Selected tools:
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {newTask.enabled_tools.map((toolId) => (
                      <Badge
                        key={toolId}
                        className="bg-[#333] text-emerald-400 border border-emerald-400/30"
                      >
                        {toolId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newTask.agent_id) setIsToolsModalOpen(true);
                  }}
                  disabled={!newTask.agent_id}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 px-3"
                >
                  <PenTool className="h-4 w-4 mr-2" /> 
                  Configure tools
                </Button>
                
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.agent_id || !newTask.description}
                  className="bg-[#222] text-emerald-400 border border-emerald-400 hover:bg-emerald-400/10"
                >
                  <Save className="h-4 w-4 mr-1" />{" "}
                  {isEditing ? "Update task" : "Add task"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isDescriptionModalOpen}
        onOpenChange={setIsDescriptionModalOpen}
      >
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] bg-[#1a1a1a] border-[#333] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">Task Description</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col min-h-[60vh]">
            <Textarea
              value={expandedDescription}
              onChange={(e) => setExpandedDescription(e.target.value)}
              className="flex-1 min-h-full bg-[#222] border-[#444] text-white p-4 focus:border-emerald-400 focus:ring-emerald-400 focus:ring-opacity-50 resize-none"
              placeholder="Enter detailed description for the task..."
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDescriptionModalOpen(false)}
              className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveExpandedDescription}
              className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isToolsModalOpen} onOpenChange={setIsToolsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-[#1a1a1a] border-[#333] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">
              Available tools
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search tools..."
              className="bg-[#222] border-[#444] text-white pl-9"
              value={toolSearchQuery}
              onChange={(e) => setToolSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#333] transition duration-150"
                >
                  <Checkbox
                    id={tool.id}
                    checked={isToolEnabled(tool.id)}
                    onCheckedChange={() => handleToggleTool(tool.id)}
                    className="border-[#444] data-[state=checked]:bg-emerald-400 data-[state=checked]:text-black"
                  />
                  <Label
                    htmlFor={tool.id}
                    className="cursor-pointer text-white flex-1"
                  >
                    {tool.name}
                  </Label>
                  <Badge className="bg-[#333] text-emerald-400">{tool.id}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">No tools available</p>
                <p className="text-xs text-neutral-500">
                  The tools are obtained from the selected agents in the tasks.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleSaveTools}
              className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
