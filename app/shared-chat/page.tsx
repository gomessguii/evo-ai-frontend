/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: shared-chat/page.tsx                                                    │
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

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Loader2, ChevronRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getQueryParam } from "@/lib/utils";
import { getSharedAgent } from "@/services/agentService";
import { ChatMessage, ChatPart } from "@/services/sessionService";
import { useAgentWebSocket } from "@/hooks/use-agent-webSocket";
import { AgentInfo } from "./AgentInfo";
import Image from "next/image";
import { SharedSessionList } from "./components/SharedSessionList";
import { SharedChatPanel } from "./components/SharedChatPanel";
import { FileData } from "@/lib/file-utils";

interface AttachedFile {
  filename: string;
  content_type: string;
  data: string;
  size: number;
  preview_url?: string;
}

interface FunctionMessageContent {
  title: string;
  content: string;
  author?: string;
}

interface SharedAgentInfo {
  id: string;
  apiKey: string;
}

interface SharedSession {
  id: string;
  update_time: string;
  name?: string;
  messages: ChatMessage[];
}

export default function SharedChat() {
  const [isLoading, setIsLoading] = useState(true);
  const [agent, setAgent] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [agentParams, setAgentParams] = useState<SharedAgentInfo | null>(null);
  const [isParamsDialogOpen, setIsParamsDialogOpen] = useState(false);
  const [manualAgentId, setManualAgentId] = useState("");
  const [manualApiKey, setManualApiKey] = useState("");
  const [savedAgents, setSavedAgents] = useState<SharedAgentInfo[]>([]);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  const [sessions, setSessions] = useState<SharedSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isSessionsCollapsed, setIsSessionsCollapsed] = useState(false);
  const [sessionSearchTerm, setSessionSearchTerm] = useState("");

  const { toast } = useToast();

  const createNewSession = () => {
    const sessionId = generateExternalId();
    const newSession: SharedSession = {
      id: sessionId,
      update_time: new Date().toISOString(),
      messages: [
        {
          id: `system-${Date.now()}`,
          content: {
            parts: [
              {
                text: "Welcome to this shared agent. Type a message to start chatting.",
              },
            ],
            role: "system",
          },
          author: "assistant",
          timestamp: Date.now() / 1000,
        },
      ],
    };

    setSessions((prev) => [...prev, newSession]);
    setSelectedSession(sessionId);
    setMessages(newSession.messages);

    if (agentParams) {
      saveSessionsToLocalStorage(agentParams.id, [...sessions, newSession]);
    }
  };

  const saveSessionsToLocalStorage = (
    agentId: string,
    sessionsToSave: SharedSession[]
  ) => {
    if (typeof window !== "undefined") {
      const key = `shared_agent_sessions_${agentId}`;
      localStorage.setItem(key, JSON.stringify(sessionsToSave));
    }
  };

  const loadSessionsFromLocalStorage = (agentId: string): SharedSession[] => {
    if (typeof window !== "undefined") {
      const key = `shared_agent_sessions_${agentId}`;
      const sessionsJson = localStorage.getItem(key);
      if (sessionsJson) {
        try {
          return JSON.parse(sessionsJson);
        } catch (e) {
          console.error("Error parsing sessions from localStorage:", e);
        }
      }
    }
    return [];
  };

  useEffect(() => {
    const agentId = getQueryParam("agent");
    const apiKey = getQueryParam("key");

    console.log("[Shared Chat] Params from URL:", { agentId, apiKey });

    if (agentId && apiKey) {
      setAgentParams({ id: agentId, apiKey });

      if (typeof window !== "undefined") {
        localStorage.setItem("shared_agent_api_key", apiKey);
        console.log("[Shared Chat] API key set in localStorage");

        const savedAgentsJson = localStorage.getItem("shared_agents") || "[]";
        try {
          const savedAgents = JSON.parse(savedAgentsJson) as SharedAgentInfo[];
          const existingAgent = savedAgents.find((a) => a.id === agentId);

          if (!existingAgent) {
            const updatedAgents = [...savedAgents, { id: agentId, apiKey }];
            localStorage.setItem(
              "shared_agents",
              JSON.stringify(updatedAgents)
            );
            console.log("[Shared Chat] Agent added to saved agents");
          }
        } catch (e) {
          console.error("Error processing saved agents:", e);
        }
      }
    } else {
      if (typeof window !== "undefined") {
        const savedAgentsJson = localStorage.getItem("shared_agents") || "[]";
        try {
          const savedAgents = JSON.parse(savedAgentsJson) as SharedAgentInfo[];
          setSavedAgents(savedAgents);

          if (savedAgents.length > 0) {
            setAgentParams(savedAgents[savedAgents.length - 1]);
            localStorage.setItem(
              "shared_agent_api_key",
              savedAgents[savedAgents.length - 1].apiKey
            );
          } else {
            setIsParamsDialogOpen(true);
          }
        } catch (e) {
          console.error("Error processing saved agents:", e);
          setIsParamsDialogOpen(true);
        }
      } else {
        setIsParamsDialogOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const loadAgentData = async () => {
      if (!agentParams) return;

      setIsLoading(true);
      try {
        localStorage.setItem("shared_agent_api_key", agentParams.apiKey);

        try {
          const response = await getSharedAgent(agentParams.id);
          setAgent(response.data);
        } catch (error) {
          console.error("Error loading agent data:", error);
          setAgent({
            id: agentParams.id,
            name: "Shared Agent",
            description: "This agent is being accessed via a shared API key",
            type: "llm",
            model: "Unknown model",
            created_at: new Date().toISOString(),
          });
        }

        const loadedSessions = loadSessionsFromLocalStorage(agentParams.id);

        if (loadedSessions.length > 0) {
          setSessions(loadedSessions);
          const latestSession = loadedSessions.sort(
            (a, b) =>
              new Date(b.update_time).getTime() -
              new Date(a.update_time).getTime()
          )[0];
          setSelectedSession(latestSession.id);
          setMessages(latestSession.messages);
        } else {
          createNewSession();
        }
      } catch (error) {
        console.error("Error setting up shared agent:", error);
        toast({
          title: "Error",
          description: "Unable to set up the shared agent.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
  }, [agentParams, toast]);

  useEffect(() => {
    if (selectedSession && messages.length > 0) {
      setSessions((prev) => {
        const updatedSessions = prev.map((session) => {
          if (session.id === selectedSession) {
            return {
              ...session,
              messages: messages,
              update_time: new Date().toISOString(),
            };
          }
          return session;
        });

        if (agentParams) {
          saveSessionsToLocalStorage(agentParams.id, updatedSessions);
        }

        return updatedSessions;
      });
    }
  }, [messages, selectedSession, agentParams]);

  const handleSendMessage = async (messageText: string, files?: FileData[]) => {
    if (
      (!messageText.trim() && (!files || files.length === 0)) ||
      !agentParams?.id ||
      !selectedSession
    )
      return;

    setIsSending(true);

    const messageParts: ChatPart[] = [];

    if (messageText.trim()) {
      messageParts.push({ text: messageText });
    }

    if (files && files.length > 0) {
      files.forEach((file) => {
        messageParts.push({
          inline_data: {
            data: file.data,
            mime_type: file.content_type,
          },
        });
      });
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        content: {
          parts: messageParts,
          role: "user",
        },
        author: "user",
        timestamp: Date.now() / 1000,
      },
    ]);

    wsSendMessage(messageText, files);
  };

  const generateExternalId = () => {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0") +
      now.getMilliseconds().toString().padStart(3, "0")
    );
  };

  const containsMarkdown = (text: string): boolean => {
    if (!text || text.length < 3) return false;

    const markdownPatterns = [
      /[*_]{1,2}[^*_]+[*_]{1,2}/, // bold/italic
      /\[[^\]]+\]\([^)]+\)/, // links
      /^#{1,6}\s/m, // headers
      /^[-*+]\s/m, // unordered lists
      /^[0-9]+\.\s/m, // ordered lists
      /^>\s/m, // block quotes
      /`[^`]+`/, // inline code
      /```[\s\S]*?```/, // code blocks
      /^\|(.+\|)+$/m, // tables
      /!\[[^\]]*\]\([^)]+\)/, // images
    ];

    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  const getMessageText = (
    message: ChatMessage
  ): string | FunctionMessageContent => {
    const author = message.author;
    const parts = message.content.parts;

    if (!parts || parts.length === 0) return "Empty content";

    const functionCallPart = parts.find(
      (part) => part.functionCall || part.function_call
    );
    const functionResponsePart = parts.find(
      (part) => part.functionResponse || part.function_response
    );

    const inlineDataParts = parts.filter((part) => part.inline_data);

    if (functionCallPart) {
      const funcCall =
        functionCallPart.functionCall || functionCallPart.function_call || {};
      const args = funcCall.args || {};
      const name = funcCall.name || "unknown";
      const id = funcCall.id || "no-id";

      return {
        author,
        title: `📞 Function call: ${name}`,
        content: `ID: ${id}
Args: ${
          Object.keys(args).length > 0
            ? `\n${JSON.stringify(args, null, 2)}`
            : "{}"
        }`,
      } as FunctionMessageContent;
    }

    if (functionResponsePart) {
      const funcResponse =
        functionResponsePart.functionResponse ||
        functionResponsePart.function_response ||
        {};
      const response = funcResponse.response || {};
      const name = funcResponse.name || "unknown";
      const id = funcResponse.id || "no-id";
      const status = response.status || "unknown";
      const statusEmoji = status === "error" ? "❌" : "✅";

      let resultText = "";
      if (status === "error") {
        resultText = `Error: ${response.error_message || "Unknown error"}`;
      } else if (response.report) {
        resultText = `Result: ${response.report}`;
      } else if (response.result && response.result.content) {
        const content = response.result.content;
        if (Array.isArray(content) && content.length > 0 && content[0].text) {
          try {
            const textContent = content[0].text;
            const parsedJson = JSON.parse(textContent);
            resultText = `Result: \n${JSON.stringify(parsedJson, null, 2)}`;
          } catch (e) {
            resultText = `Result: ${content[0].text}`;
          }
        } else {
          resultText = `Result:\n${JSON.stringify(response, null, 2)}`;
        }
      } else {
        resultText = `Result:\n${JSON.stringify(response, null, 2)}`;
      }

      return {
        author,
        title: `${statusEmoji} Function response: ${name}`,
        content: `ID: ${id}\n${resultText}`,
      } as FunctionMessageContent;
    }

    if (parts.length === 1 && parts[0].text) {
      return {
        author,
        content: parts[0].text,
        title: "Message",
      } as FunctionMessageContent;
    }

    const textParts = parts
      .filter((part) => part.text)
      .map((part) => part.text)
      .filter((text) => text);

    if (textParts.length > 0) {
      return {
        author,
        content: textParts.join("\n\n"),
        title: "Message",
      } as FunctionMessageContent;
    }

    return "Empty content";
  };

  const onEvent = useCallback((event: any) => {
    setMessages((prev) => [...prev, event]);
  }, []);

  const onTurnComplete = useCallback(() => {
    setIsSending(false);
  }, []);

  const externalId = selectedSession || generateExternalId();

  const { sendMessage: wsSendMessage, disconnect: _ } = useAgentWebSocket({
    agentId: agentParams?.id || "",
    externalId,
    apiKey: agentParams?.apiKey,
    onEvent,
    onTurnComplete,
  });

  const handleManualConnect = () => {
    if (manualAgentId && manualApiKey) {
      const newAgent = { id: manualAgentId, apiKey: manualApiKey };
      if (typeof window !== "undefined") {
        const savedAgentsJson = localStorage.getItem("shared_agents") || "[]";
        try {
          const savedAgents = JSON.parse(savedAgentsJson) as SharedAgentInfo[];
          const existingAgentIndex = savedAgents.findIndex(
            (a) => a.id === manualAgentId
          );

          if (existingAgentIndex >= 0) {
            savedAgents[existingAgentIndex] = newAgent;
          } else {
            savedAgents.push(newAgent);
          }

          localStorage.setItem("shared_agents", JSON.stringify(savedAgents));
          setSavedAgents(savedAgents);
        } catch (e) {
          console.error("Error processing saved agents:", e);
        }
      }

      setAgentParams(newAgent);
      setIsParamsDialogOpen(false);
    } else {
      toast({
        title: "Incomplete data",
        description: "Please fill in the agent ID and API key.",
        variant: "destructive",
      });
    }
  };

  const selectSavedAgent = (agent: SharedAgentInfo) => {
    setAgentParams(agent);
    setIsParamsDialogOpen(false);
  };

  const handleSessionSelect = (sessionId: string | null) => {
    if (!sessionId) return;

    // Encontre a sessão selecionada e carregue suas mensagens
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setSelectedSession(sessionId);
    }
  };

  return (
    <div className="flex h-screen max-h-screen bg-neutral-950">
      <SharedSessionList
        sessions={sessions}
        selectedSession={selectedSession}
        isLoading={isLoading}
        searchTerm={sessionSearchTerm}
        isCollapsed={isSessionsCollapsed}
        setSearchTerm={setSessionSearchTerm}
        setSelectedSession={handleSessionSelect}
        onNewSession={createNewSession}
        onToggleCollapse={() => setIsSessionsCollapsed(!isSessionsCollapsed)}
        agentName={agent?.name || "Shared Agent"}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {agent && (
          <div className="p-4 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://evolution-api.com/files/evo/logo-evo-ai.svg"
                alt="Evolution API"
                width={60}
                height={30}
              />
              <div className="h-10 w-px bg-neutral-800" />
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
              >
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-white flex items-center gap-2">
                    {agent.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-neutral-400 hover:text-emerald-400 p-0.5"
                      onClick={() => setIsInfoPanelOpen(true)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </h1>
                  <p className="text-sm text-neutral-400">
                    {agent.description?.length > 100
                      ? `${agent.description.substring(0, 100)}...`
                      : agent.description}
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-500 text-white px-3 py-1 text-sm border-0">
              Shared Agent
            </Badge>
          </div>
        )}

        {(selectedSession || agentParams) ? (
          <SharedChatPanel
            messages={messages}
            isLoading={isLoading}
            isSending={isSending}
            agentName={agent?.name || "Shared Agent"}
            onSendMessage={handleSendMessage}
            getMessageText={getMessageText}
            containsMarkdown={containsMarkdown}
            sessionId={selectedSession || undefined}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-neutral-950">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
              <MessageSquare className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Welcome to Shared Chat
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              To start, please enter an agent ID and API key
            </p>
            <Button
              onClick={() => setIsParamsDialogOpen(true)}
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-6 h-auto rounded-xl"
            >
              Connect to Agent
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isParamsDialogOpen} onOpenChange={setIsParamsDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-emerald-500/20">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <DialogTitle className="text-xl font-medium">
                Connect to Shared Agent
              </DialogTitle>
            </div>
            <DialogDescription className="text-neutral-400">
              Enter the agent ID and API key to connect
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Agent ID</label>
              <Input
                value={manualAgentId}
                onChange={(e) => setManualAgentId(e.target.value)}
                placeholder="Enter agent ID"
                className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">API Key</label>
              <Input
                value={manualApiKey}
                onChange={(e) => setManualApiKey(e.target.value)}
                placeholder="Enter API key"
                type="password"
                className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-emerald-500"
              />
            </div>

            {savedAgents.length > 0 && (
              <div className="pt-2 border-t border-neutral-700">
                <p className="text-sm text-neutral-300 mb-2">Or select a saved agent:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {savedAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant="outline"
                      className="w-full justify-start text-left mb-1 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200"
                      onClick={() => selectSavedAgent(agent)}
                    >
                      <div className="truncate">{agent.id}</div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsParamsDialogOpen(false)}
              className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleManualConnect}
              disabled={!manualAgentId || !manualApiKey}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-3xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-emerald-500/20">
                <Info className="h-5 w-5 text-emerald-400" />
              </div>
              <DialogTitle className="text-xl font-medium">
                {agent?.name || "Shared Agent"} Information
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-2">
            {agent && <AgentInfo agent={agent} isShared={true} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
