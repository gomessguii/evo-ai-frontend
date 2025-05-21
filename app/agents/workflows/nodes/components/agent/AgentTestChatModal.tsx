/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/agent/AgentTestChatModal.tsx   │
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
import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgentWebSocket } from "@/hooks/use-agent-webSocket";
import { getAccessTokenFromCookie, cn } from "@/lib/utils";
import { Agent } from "@/types/agent";
import { ChatInput } from "@/app/chat/components/ChatInput";
import { ChatMessage as ChatMessageComponent } from "@/app/chat/components/ChatMessage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatPart } from "@/services/sessionService";
import { FileData } from "@/lib/file-utils";
import { X, User, Bot, Zap, MessageSquare, Loader2, Code, ExternalLink, Workflow, RefreshCw } from "lucide-react";

interface FunctionMessageContent {
    title: string;
    content: string;
    author?: string;
}

interface ChatMessage {
    id: string;
    content: any;
    author: string;
    timestamp: number;
}

interface AgentTestChatModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: Agent;
    canvasRef?: React.RefObject<any>;
}

export function AgentTestChatModal({ open, onOpenChange, agent, canvasRef }: AgentTestChatModalProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [expandedFunctions, setExpandedFunctions] = useState<Record<string, boolean>>({});
    const [isInitializing, setIsInitializing] = useState(true);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    const clientId = user?.client_id || "test";

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

    const [externalId, setExternalId] = useState(generateExternalId());
    const jwt = getAccessTokenFromCookie();

    const onEvent = useCallback((event: any) => {
        setMessages((prev) => [...prev, event]);
        
        // Verificar se a mensagem vem de um nó de workflow e destacar o nó
        // somente se o canvasRef estiver disponível (chamado do Test Workflow na página principal)
        if (event.author && event.author.startsWith('workflow-node:') && canvasRef?.current) {
            const nodeId = event.author.split(':')[1];
            canvasRef.current.setActiveExecutionNodeId(nodeId);
        }
    }, [canvasRef]);

    const onTurnComplete = useCallback(() => {
        setIsSending(false);
    }, []);

    const { sendMessage: wsSendMessage, disconnect } = useAgentWebSocket({
        agentId: agent.id,
        externalId,
        jwt,
        onEvent,
        onTurnComplete,
    });

    // Handle ESC key to close the panel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onOpenChange, open]);
    
    // Show initialization state for better UX
    useEffect(() => {
        if (open) {
            setIsInitializing(true);
            const timer = setTimeout(() => {
                setIsInitializing(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [open, externalId]);

    const handleRestartChat = () => {
        if (disconnect) disconnect();
        setMessages([]);
        setExpandedFunctions({});
        setExternalId(generateExternalId());
        setIsInitializing(true);
        
        // Breve delay para mostrar o status de inicialização
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 1200);
    };

    const handleSendMessageWithFiles = (message: string, files?: FileData[]) => {
        if ((!message.trim() && (!files || files.length === 0))) return;
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

    const getMessageText = (message: ChatMessage): string | FunctionMessageContent => {
        const author = message.author;
        const parts = message.content.parts;
        if (!parts || parts.length === 0) return "Empty content";
        const functionCallPart = parts.find((part: any) => part.functionCall || part.function_call);
        const functionResponsePart = parts.find((part: any) => part.functionResponse || part.function_response);
        
        const inlineDataParts = parts.filter((part: any) => part.inline_data);
        
        if (functionCallPart) {
            const funcCall = functionCallPart.functionCall || functionCallPart.function_call || {};
            const args = funcCall.args || {};
            const name = funcCall.name || "unknown";
            const id = funcCall.id || "no-id";
            return {
                author,
                title: `📞 Function call: ${name}`,
                content: `ID: ${id}\nArgs: ${Object.keys(args).length > 0 ? `\n${JSON.stringify(args, null, 2)}` : "{}"}`,
            } as FunctionMessageContent;
        }
        if (functionResponsePart) {
            const funcResponse = functionResponsePart.functionResponse || functionResponsePart.function_response || {};
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
        const textParts = parts.filter((part: any) => part.text).map((part: any) => part.text).filter((text: string) => text);
        if (textParts.length > 0) {
            return {
                author,
                content: textParts.join("\n\n"),
                title: "Message",
            } as FunctionMessageContent;
        }
        try {
            return JSON.stringify(parts, null, 2).replace(/\\n/g, "\n");
        } catch (error) {
            return "Unable to interpret message content";
        }
    };

    const toggleFunctionExpansion = (messageId: string) => {
        setExpandedFunctions((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    };
    
    const getAgentTypeIcon = (type: string) => {
        switch (type) {
            case "llm":
                return <Code className="h-4 w-4 text-green-400" />;
            case "a2a":
                return <ExternalLink className="h-4 w-4 text-indigo-400" />;
            case "sequential":
            case "workflow":
                return <Workflow className="h-4 w-4 text-blue-400" />;
            default:
                return <Bot className="h-4 w-4 text-emerald-400" />;
        }
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!open) return null;

    // Use React Portal to render directly to document body, bypassing all parent containers
    const modalContent = (
        <>
            {/* Overlay for mobile */}
            <div
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[15] transition-opacity duration-300"
                onClick={() => onOpenChange(false)}
            />
            
            {/* Side panel */}
            <div 
                className="fixed right-0 top-0 z-[1000] h-full w-[450px] bg-gradient-to-b from-neutral-900 to-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col transition-all duration-300 ease-in-out transform"
                style={{
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow: '0 0 25px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-5 bg-gradient-to-r from-neutral-900 to-neutral-800 border-b border-neutral-800">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center shadow-lg mr-3">
                                    {getAgentTypeIcon(agent.type)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge 
                                            className="bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 px-2"
                                        >
                                            {agent.type.toUpperCase()} Agent
                                        </Badge>
                                        {agent.model && (
                                            <span className="text-xs text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded-md">
                                                {agent.model}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRestartChat}
                                className="p-1.5 rounded-full hover:bg-neutral-700/50 text-neutral-400 hover:text-white transition-colors group relative"
                                title="Restart chat"
                                disabled={isInitializing}
                            >
                                <RefreshCw size={18} className={isInitializing ? "animate-spin text-emerald-400" : ""} />
                                <span className="absolute -bottom-8 right-0 bg-neutral-800 text-neutral-200 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                    Restart chat
                                </span>
                            </button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-1.5 rounded-full hover:bg-neutral-700/50 text-neutral-400 hover:text-white transition-colors group relative"
                            >
                                <X size={18} />
                                <span className="absolute -bottom-8 right-0 bg-neutral-800 text-neutral-200 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                    Close
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    {agent.description && (
                        <div className="mt-3 text-sm text-neutral-400 bg-neutral-800/30 p-3 rounded-md border border-neutral-800">
                            {agent.description}
                        </div>
                    )}
                </div>
                
                {/* Chat content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 bg-gradient-to-b from-neutral-900/50 to-neutral-950" ref={messagesContainerRef}>
                    {isInitializing ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg mb-4 animate-pulse">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-neutral-400 mb-2">Initializing connection...</p>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" 
                                    style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                                    style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                                    style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center shadow-lg mb-5 border border-emerald-500/30">
                                <MessageSquare className="h-6 w-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-300 mb-2">Start the conversation</h3>
                            <p className="text-neutral-500 text-sm max-w-xs">
                                Type a message below to begin chatting with {agent.name}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 w-full max-w-full">
                            {messages.map((message) => {
                                const messageContent = getMessageText(message);
                                const agentColor = message.author === "user" ? "bg-emerald-500" : "bg-gradient-to-br from-neutral-800 to-neutral-900";
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
                                        <div className="rounded-lg p-3 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50">
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
                
                {/* Message input */}
                <div className="p-3 border-t border-neutral-800 bg-neutral-900">
                    <ChatInput
                        onSendMessage={handleSendMessageWithFiles}
                        isLoading={isSending}
                        placeholder="Type your message..."
                        autoFocus={true}
                    />
                </div>
            </div>
        </>
    );

    // Use createPortal to render the modal directly to the document body
    return typeof document !== 'undefined' 
        ? createPortal(modalContent, document.body) 
        : null;
} 