/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/chat/page.tsx                                                    │
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

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  Loader2,
  X,
  Trash2,
  Bot,
} from "lucide-react";
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
import { listAgents } from "@/services/agentService";
import {
  listSessions,
  getSessionMessages,
  ChatMessage,
  deleteSession,
  ChatSession,
  ChatPart
} from "@/services/sessionService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentWebSocket } from "@/hooks/use-agent-webSocket";
import { getAccessTokenFromCookie } from "@/lib/utils";
import { ChatMessage as ChatMessageComponent } from "./components/ChatMessage";
import { SessionList } from "./components/SessionList";
import { ChatInput } from "./components/ChatInput";
import { FileData } from "@/lib/file-utils";
import { AgentInfoDialog } from "./components/AgentInfoDialog";

interface FunctionMessageContent {
  title: string;
  content: string;
  author?: string;
}

export default function Chat() {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>("all");
  const [messageInput, setMessageInput] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [showAgentFilter, setShowAgentFilter] = useState(false);
  const [expandedFunctions, setExpandedFunctions] = useState<
    Record<string, boolean>
  >({});
  const [isAgentInfoDialogOpen, setIsAgentInfoDialogOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const clientId = user?.client_id || "test";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const agentsResponse = await listAgents(clientId);
        setAgents(agentsResponse.data);

        const sessionsResponse = await listSessions(clientId);
        setSessions(sessionsResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getSessionMessages(selectedSession);
        setMessages(response.data);

        const agentId = selectedSession.split("_")[1];
        setCurrentAgentId(agentId);

        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedSession]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearchTerm = session.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedAgentFilter === "all") {
      return matchesSearchTerm;
    }

    const sessionAgentId = session.id.split("_")[1];
    return matchesSearchTerm && sessionAgentId === selectedAgentFilter;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const updateTimeA = new Date(a.update_time).getTime();
    const updateTimeB = new Date(b.update_time).getTime();

    return updateTimeB - updateTimeA;
  });

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
      (agent.description &&
        agent.description.toLowerCase().includes(agentSearchTerm.toLowerCase()))
  );

  const selectAgent = (agentId: string) => {
    setCurrentAgentId(agentId);
    setSelectedSession(null);
    setMessages([]);
    setIsNewChatDialogOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentAgentId) return;
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        content: {
          parts: [{ text: messageInput }],
          role: "user",
        },
        author: "user",
        timestamp: Date.now() / 1000,
      },
    ]);
    wsSendMessage(messageInput);
    setMessageInput("");
    const textarea = document.querySelector("textarea");
    if (textarea) textarea.style.height = "auto";
  };

  const handleSendMessageWithFiles = (message: string, files?: FileData[]) => {
    if ((!message.trim() && (!files || files.length === 0)) || !currentAgentId)
      return;
    setIsSending(true);

    const messageParts: ChatPart[] = [];
    
    if (message.trim()) {
      messageParts.push({ text: message });
    }
    
    if (files && files.length > 0) {
      files.forEach(file => {
        messageParts.push({
          inline_data: {
            data: file.data,
            mime_type: file.content_type,
            metadata: {
              filename: file.filename
            }
          }
        });
      });
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        content: {
          parts: messageParts,
          role: "user"
        },
        author: "user",
        timestamp: Date.now() / 1000,
      },
    ]);

    wsSendMessage(message, files);

    setMessageInput("");
    const textarea = document.querySelector("textarea");
    if (textarea) textarea.style.height = "auto";
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

  const currentAgent = agents.find((agent) => agent.id === currentAgentId);

  const getCurrentSessionInfo = () => {
    if (!selectedSession) return null;

    const parts = selectedSession.split("_");

    try {
      const dateStr = parts[0];
      if (dateStr.length >= 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        return {
          externalId: parts[0],
          agentId: parts[1],
          displayDate: `${day}/${month}/${year}`,
        };
      }
    } catch (e) {
      console.error("Error processing session ID:", e);
    }

    return {
      externalId: parts[0],
      agentId: parts[1],
      displayDate: "Session",
    };
  };

  const getExternalId = (sessionId: string) => {
    return sessionId.split("_")[0];
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

  const toggleFunctionExpansion = (messageId: string) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const agentColors: Record<string, string> = {
    Assistant: "bg-emerald-400",
    Programmer: "bg-[#00cc7d]",
    Writer: "bg-[#00b8ff]",
    Researcher: "bg-[#ff9d00]",
    Planner: "bg-[#9d00ff]",
    default: "bg-[#333]",
  };

  const getAgentColor = (agentName: string) => {
    return agentColors[agentName] || agentColors.default;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    textarea.style.height = "auto";

    const maxHeight = 10 * 24;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;

    setMessageInput(textarea.value);
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;

    try {
      await deleteSession(selectedSession);

      setSessions(sessions.filter((session) => session.id !== selectedSession));
      setSelectedSession(null);
      setMessages([]);
      setCurrentAgentId(null);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Session deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error deleting session",
        variant: "destructive",
      });
    }
  };

  const onEvent = useCallback((event: any) => {
    setMessages((prev) => [...prev, event]);
  }, []);

  const onTurnComplete = useCallback(() => {
    setIsSending(false);
  }, []);

  const handleAgentInfoClick = () => {
    setIsAgentInfoDialogOpen(true);
  };

  const handleAgentUpdated = (updatedAgent: any) => {
    setAgents(agents.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ));
    
    toast({
      title: "Agent updated successfully",
      description: "The agent has been updated with the new settings.",
    });
  };

  const jwt = getAccessTokenFromCookie();

  const agentId = useMemo(() => currentAgentId || "", [currentAgentId]);
  const externalId = useMemo(
    () =>
      selectedSession ? getExternalId(selectedSession) : generateExternalId(),
    [selectedSession]
  );

  const { sendMessage: wsSendMessage, disconnect: _ } = useAgentWebSocket({
    agentId,
    externalId,
    jwt,
    onEvent,
    onTurnComplete,
  });

  return (
    <div className="flex h-screen max-h-screen bg-[#121212]">
      <SessionList
        sessions={sessions}
        agents={agents}
        selectedSession={selectedSession}
        isLoading={isLoading}
        searchTerm={searchTerm}
        selectedAgentFilter={selectedAgentFilter}
        showAgentFilter={showAgentFilter}
        setSearchTerm={setSearchTerm}
        setSelectedAgentFilter={setSelectedAgentFilter}
        setShowAgentFilter={setShowAgentFilter}
        setSelectedSession={setSelectedSession}
        setIsNewChatDialogOpen={setIsNewChatDialogOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedSession || currentAgentId ? (
          <>
            <div className="p-4 border-b border-[#333] bg-neutral-900 shadow-md">
              {(() => {
                const sessionInfo = getCurrentSessionInfo();

                return (
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <div className="p-1 rounded-full bg-emerald-500/20">
                        <MessageSquare className="h-5 w-5 text-emerald-400" />
                      </div>
                      {selectedSession
                        ? `Session ${
                            sessionInfo?.externalId || selectedSession
                          }`
                        : "New Conversation"}
                    </h2>

                    <div className="flex items-center gap-2">
                      {currentAgent && (
                        <Badge 
                          className="bg-emerald-500 text-white px-3 py-1 text-sm border-0 cursor-pointer hover:bg-emerald-600 transition-colors"
                          onClick={handleAgentInfoClick}
                        >
                          {currentAgent.name || currentAgentId}
                        </Badge>
                      )}

                      {selectedSession && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-[#333]"
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-neutral-950"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg mb-4 relative">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                    <div className="absolute inset-0 rounded-full blur-md bg-emerald-400/20 animate-pulse"></div>
                  </div>
                  <p className="text-neutral-400 mb-2">Loading conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 flex items-center justify-center shadow-lg mb-5 border border-emerald-500/30">
                    <MessageSquare className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-300 mb-2">
                    {currentAgent ? `Chat with ${currentAgent.name}` : "New Conversation"}
                  </h3>
                  <p className="text-neutral-500 text-sm max-w-md">
                    Type your message below to start the conversation. This chat will help you interact with the agent and explore its capabilities.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 w-full max-w-full">
                  {messages.map((message) => {
                    const messageContent = getMessageText(message);
                    const agentColor = getAgentColor(message.author);
                    const isExpanded = expandedFunctions[message.id] || false;

                    return (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        agentColor={agentColor}
                        isExpanded={isExpanded}
                        toggleExpansion={toggleFunctionExpansion}
                        containsMarkdown={containsMarkdown}
                        messageContent={messageContent}
                        sessionId={selectedSession as string}
                      />
                    );
                  })}

                  {isSending && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar
                          className="bg-gradient-to-br from-purple-600 to-purple-800 shadow-md border-0"
                        >
                          <AvatarFallback className="bg-transparent">
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 shadow-md">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-4 pt-4 pb-6 border-t border-[#333] bg-neutral-900 shadow-inner">
              {isSending && !isLoading && (
                <div className="px-4 py-2 mb-3 rounded-lg bg-neutral-800/50 border border-neutral-700/30 text-sm text-neutral-400 flex items-center shadow-sm">
                  <div className="mr-2 relative">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    <div className="absolute inset-0 blur-sm bg-emerald-400/20 rounded-full animate-pulse"></div>
                  </div>
                  Agent is thinking...
                </div>
              )}
              <div className="rounded-lg shadow-md bg-neutral-800/20 border border-neutral-700/30 p-1">
                <ChatInput
                  onSendMessage={handleSendMessageWithFiles}
                  isLoading={isSending || isLoading}
                  placeholder="Type your message..."
                  autoFocus={true}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-lg mb-6 border border-emerald-500/30">
              <MessageSquare className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Select a conversation
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              Choose an existing conversation or start a new one.
            </p>
            <Button
              onClick={() => setIsNewChatDialogOpen(true)}
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-6 h-auto shadow-md rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Conversation
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-emerald-500/20">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <DialogTitle className="text-xl font-medium text-white">
                New Conversation
              </DialogTitle>
            </div>
            <DialogDescription className="text-neutral-400">
              Select an agent to start a new conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search agents..."
                className="pl-10 bg-neutral-800/40 border-neutral-700/50 text-white focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 shadow-inner rounded-xl"
                value={agentSearchTerm}
                onChange={(e) => setAgentSearchTerm(e.target.value)}
              />
              {agentSearchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-emerald-500 transition-colors"
                  onClick={() => setAgentSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="text-sm text-neutral-300 mb-2">Choose an agent:</div>

            <ScrollArea className="h-[300px] pr-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                    <div className="absolute inset-0 rounded-full blur-md bg-emerald-400/20 animate-pulse"></div>
                  </div>
                  <p className="text-neutral-400 mt-4">Loading agents...</p>
                </div>
              ) : filteredAgents.length > 0 ? (
                <div className="space-y-2">
                  {filteredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-3 rounded-md cursor-pointer transition-all bg-neutral-800 hover:bg-neutral-800/90 border border-neutral-700/30 hover:border-emerald-500/30 shadow-sm hover:shadow-md group"
                      onClick={() => selectAgent(agent.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                          <MessageSquare size={14} className="text-emerald-400" />
                        </div>
                        <span className="font-medium text-white group-hover:text-emerald-50">
                          {agent.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge className="text-xs bg-neutral-800/60 text-emerald-400 border border-emerald-500/30">
                          {agent.type}
                        </Badge>
                        {agent.model && (
                          <span className="text-xs text-neutral-400">
                            {agent.model}
                          </span>
                        )}
                      </div>
                      {agent.description && (
                        <p className="text-xs text-neutral-300 mt-2 line-clamp-2 group-hover:text-neutral-200">
                          {agent.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : agentSearchTerm ? (
                <div className="text-center py-4 text-neutral-400">
                  No agent found with "{agentSearchTerm}"
                </div>
              ) : (
                <div className="text-center py-4 text-neutral-400">
                  <p>No agents available</p>
                  <p className="text-sm mt-2">
                    Create agents in the Agent Management screen
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsNewChatDialogOpen(false)}
              variant="outline"
              className="bg-neutral-800/40 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white hover:border-neutral-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-red-500/20">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <DialogTitle className="text-xl font-medium text-white">
                Delete Session
              </DialogTitle>
            </div>
            <DialogDescription className="text-neutral-400">
              Are you sure you want to delete this session? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="bg-neutral-800/40 border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white hover:border-neutral-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-md"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Info Dialog */}
      <AgentInfoDialog 
        agent={currentAgent}
        open={isAgentInfoDialogOpen}
        onOpenChange={setIsAgentInfoDialogOpen}
        onAgentUpdated={handleAgentUpdated}
      />
    </div>
  );
}
