/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/message/MessageForm.tsx        │
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Agent } from "@/types/agent";
import { listAgents } from "@/services/agentService";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Save, 
  Text, 
  Image, 
  File, 
  Video,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
function MessageForm({
  selectedNode,
  handleUpdateNode,
  setEdges,
  setIsOpen,
  setSelectedNode,
}: {
  selectedNode: any;
  handleUpdateNode: any;
  setEdges: any;
  setIsOpen: any;
  setSelectedNode: any;
}) {
  const [node, setNode] = useState(selectedNode);
  const [messageType, setMessageType] = useState("text");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const edges = useEdges();
  const nodes = useNodes();

  const connectedNode = useMemo(() => {
    const edge = edges.find((edge) => edge.source === selectedNode.id);
    if (!edge) return null;
    const node = nodes.find((node) => node.id === edge.target);
    return node || null;
  }, [edges, nodes, selectedNode.id]);
  
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || '{}') : {};
  const clientId = user?.client_id || "";
  
  const currentAgent = typeof window !== "undefined" ? 
    JSON.parse(localStorage.getItem("current_workflow_agent") || '{}') : {};
  const currentAgentId = currentAgent?.id;

  useEffect(() => {
    if (selectedNode) {
      setNode(selectedNode);
      setMessageType(selectedNode.data.message?.type || "text");
      setContent(selectedNode.data.message?.content || "");
    }
  }, [selectedNode]);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    listAgents(clientId)
      .then((res) => {
        const filteredAgents = res.data.filter((agent: Agent) => agent.id !== currentAgentId);
        setAllAgents(filteredAgents);
        setAgents(filteredAgents);
      })
      .catch((error) => console.error("Error loading agents:", error))
      .finally(() => setLoading(false));
  }, [clientId, currentAgentId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setAgents(allAgents);
    } else {
      const filtered = allAgents.filter((agent) => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAgents(filtered);
    }
  }, [searchTerm, allAgents]);

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

  const handleSave = () => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        message: {
          type: messageType,
          content,
        },
      },
    };
    setNode(updatedNode);
    handleUpdateNode(updatedNode);
  };
  
  const messageTypeInfo = {
    text: {
      icon: <Text className="h-5 w-5 text-orange-400" />,
      name: "Text Message",
      description: "Simple text message",
      color: "bg-orange-900/30 border-orange-700/50",
    },
    image: {
      icon: <Image className="h-5 w-5 text-blue-400" />,
      name: "Image",
      description: "Image URL or base64",
      color: "bg-blue-900/30 border-blue-700/50",
    },
    file: {
      icon: <File className="h-5 w-5 text-emerald-400" />,
      name: "File",
      description: "File URL or base64",
      color: "bg-emerald-900/30 border-emerald-700/50",
    },
    video: {
      icon: <Video className="h-5 w-5 text-purple-400" />,
      name: "Video",
      description: "Video URL or base64",
      color: "bg-purple-900/30 border-purple-700/50",
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-medium text-neutral-200">Message Type</h3>
            <Badge
              variant="outline"
              className="text-xs bg-orange-900/20 text-orange-400 border-orange-700/50"
            >
              {messageType === "text" ? "TEXT" : messageType.toUpperCase()}
            </Badge>
          </div>
          <Select 
            value={messageType}
            onValueChange={setMessageType}
          >
            <SelectTrigger className="w-[120px] h-8 bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectItem value="text">Text</SelectItem>
              {/* Outras opções podem ser habilitadas no futuro */}
              {/* <SelectItem value="image">Image</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="video">Video</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="grid gap-4">
          <div className="p-3 rounded-md bg-orange-900/10 border border-orange-700/30 mb-2">
            <div className="flex items-start gap-2">
              <div className="bg-orange-900/50 rounded-full p-1.5 flex-shrink-0">
                <MessageSquare size={18} className="text-orange-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-200">{messageTypeInfo.text.name}</h3>
                <p className="text-sm text-neutral-400 mt-1">{messageTypeInfo.text.description}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[150px] bg-neutral-700 border-neutral-600 resize-none"
            />
          </div>

          {content.trim() !== "" ? (
            <div className="rounded-md bg-neutral-700/50 border border-neutral-600 p-3 mt-2">
              <div className="text-sm font-medium text-neutral-400 mb-1">Preview</div>
              <div className="flex items-start gap-2 p-2 rounded-md bg-neutral-800/70">
                <div className="rounded-full bg-orange-900/30 p-1.5 mt-0.5">
                  <MessageSquare size={15} className="text-orange-400" />
                </div>
                <div className="text-sm text-neutral-300 whitespace-pre-wrap">{content}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-700/30 border border-neutral-600/50 p-4 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-6 w-6 text-neutral-500 mb-2" />
              <p className="text-neutral-400 text-sm">Your message will appear here</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-neutral-700 flex-shrink-0">
        <Button
          className="w-full bg-orange-700 hover:bg-orange-600 text-white flex items-center gap-2 justify-center"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Message
        </Button>
      </div>
    </div>
  );
}

export { MessageForm };
