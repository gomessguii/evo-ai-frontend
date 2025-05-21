/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/agent/AgentChatMessageList.tsx │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: May 14, 2025                                                  │
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

import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Agent } from "@/types/agent";
import { InlineDataAttachments } from "@/app/chat/components/InlineDataAttachments";

interface FunctionMessageContent {
    title: string;
    content: string;
    author?: string;
}

interface ChatMessage {
    id: string;
    content: {
        parts: any[];
        role: string;
    };
    author: string;
    timestamp: number;
}

interface AgentChatMessageListProps {
    messages: ChatMessage[];
    agent: Agent;
    expandedFunctions: Record<string, boolean>;
    toggleFunctionExpansion: (messageId: string) => void;
    getMessageText: (message: ChatMessage) => string | FunctionMessageContent;
    containsMarkdown: (text: string) => boolean;
}

export function AgentChatMessageList({
    messages,
    agent,
    expandedFunctions,
    toggleFunctionExpansion,
    getMessageText,
    containsMarkdown,
}: AgentChatMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="space-y-6">
            {messages.map((message) => {
                const messageContent = getMessageText(message);
                const isExpanded = expandedFunctions[message.id] || false;
                const isUser = message.author === "user";
                const agentColor = "bg-emerald-400";
                const hasFunctionCall = message.content.parts.some(
                    (part) => part.functionCall || part.function_call
                );
                const hasFunctionResponse = message.content.parts.some(
                    (part) => part.functionResponse || part.function_response
                );
                const isFunctionMessage = hasFunctionCall || hasFunctionResponse;
                const isTaskExecutor = typeof messageContent === "object" &&
                    "author" in messageContent &&
                    typeof messageContent.author === "string" &&
                    messageContent.author.endsWith("- Task executor");
                
                const inlineDataParts = message.content.parts.filter(part => part.inline_data);
                const hasInlineData = inlineDataParts.length > 0;
                
                const isWorkflowNode = message.author && message.author.startsWith('workflow-node:');
                const nodeId = isWorkflowNode ? message.author.split(':')[1] : null;

                return (
                    <div
                        key={message.id}
                        className="flex w-full"
                        style={{
                            justifyContent: isUser ? "flex-end" : "flex-start"
                        }}
                    >
                        <div
                            className="flex gap-3 max-w-[90%]"
                            style={{
                                flexDirection: isUser ? "row-reverse" : "row"
                            }}
                        >
                            <Avatar className={isUser ? "bg-[#333]" : agentColor}>
                                <AvatarFallback>
                                    {isUser ? "U" : agent.name[0] || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={`rounded-lg p-3 ${isFunctionMessage || isTaskExecutor
                                    ? "bg-[#333] text-emerald-400 font-mono text-sm"
                                    : isUser
                                        ? "bg-emerald-400 text-black"
                                        : "bg-[#222] text-white"
                                    } overflow-hidden relative group`}
                                style={{
                                    wordBreak: "break-word",
                                    maxWidth: "calc(100% - 3rem)",
                                    width: "100%",
                                    ...(isWorkflowNode ? {
                                        borderLeft: '3px solid #05d472',
                                        boxShadow: '0 0 10px rgba(5, 212, 114, 0.2)'
                                    } : {})
                                }}
                            >
                                {isWorkflowNode && (
                                    <div className="text-xs text-emerald-500 mb-1 flex items-center space-x-1 bg-emerald-950/30 p-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                        <span>Node {nodeId} is running</span>
                                    </div>
                                )}
                                
                                {isFunctionMessage || isTaskExecutor ? (
                                    <div className="w-full">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:bg-[#444] rounded px-1 py-0.5 transition-colors"
                                            onClick={() => toggleFunctionExpansion(message.id)}
                                        >
                                            {typeof messageContent === "object" &&
                                                "title" in messageContent && (
                                                    <>
                                                        <div className="flex-1 font-semibold">
                                                            {(messageContent as FunctionMessageContent).title}
                                                        </div>
                                                        <div className="flex items-center justify-center w-5 h-5 text-emerald-400">
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            {isTaskExecutor && (
                                                <>
                                                    <div className="flex-1 font-semibold">
                                                        Task Execution
                                                    </div>
                                                    <div className="flex items-center justify-center w-5 h-5 text-emerald-400">
                                                        {isExpanded ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-2 pt-2 border-t border-[#555]">
                                                {typeof messageContent === "object" &&
                                                    "content" in messageContent && (
                                                        <div className="max-w-full overflow-x-auto">
                                                            <pre className="whitespace-pre-wrap text-xs max-w-full" style={{
                                                                wordWrap: "break-word",
                                                                maxWidth: "100%",
                                                                wordBreak: "break-all"
                                                            }}>
                                                                {(messageContent as FunctionMessageContent).content}
                                                            </pre>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="markdown-content break-words max-w-full overflow-x-auto">
                                        {typeof messageContent === "object" &&
                                            "author" in messageContent &&
                                            messageContent.author !== "user" &&
                                            !isTaskExecutor && (
                                                <div className="text-xs text-neutral-400 mb-1">
                                                    {messageContent.author}
                                                </div>
                                            )}
                                        {((typeof messageContent === "string" &&
                                            containsMarkdown(messageContent)) ||
                                            (typeof messageContent === "object" &&
                                                "content" in messageContent &&
                                                typeof messageContent.content === "string" &&
                                                containsMarkdown(messageContent.content))) &&
                                            !isTaskExecutor ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ ...props }) => (
                                                        <h1 className="text-xl font-bold my-4" {...props} />
                                                    ),
                                                    h2: ({ ...props }) => (
                                                        <h2 className="text-lg font-bold my-3" {...props} />
                                                    ),
                                                    h3: ({ ...props }) => (
                                                        <h3 className="text-base font-bold my-2" {...props} />
                                                    ),
                                                    h4: ({ ...props }) => (
                                                        <h4 className="font-semibold my-2" {...props} />
                                                    ),
                                                    p: ({ ...props }) => <p className="mb-3" {...props} />,
                                                    ul: ({ ...props }) => (
                                                        <ul
                                                            className="list-disc pl-6 mb-3 space-y-1"
                                                            {...props}
                                                        />
                                                    ),
                                                    ol: ({ ...props }) => (
                                                        <ol
                                                            className="list-decimal pl-6 mb-3 space-y-1"
                                                            {...props}
                                                        />
                                                    ),
                                                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                                                    a: ({ ...props }) => (
                                                        <a
                                                            className="text-emerald-400 underline hover:opacity-80 transition-opacity"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            {...props}
                                                        />
                                                    ),
                                                    blockquote: ({ ...props }) => (
                                                        <blockquote
                                                            className="border-l-4 border-[#444] pl-4 py-1 italic my-3 text-neutral-300"
                                                            {...props}
                                                        />
                                                    ),
                                                    code: ({ className, children, ...props }: any) => {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        const isInline = !match && typeof children === "string" && !children.includes("\n");
                                                        
                                                        if (isInline) {
                                                            return (
                                                                <code
                                                                    className="bg-[#333] px-1.5 py-0.5 rounded text-emerald-400 text-sm font-mono"
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        }
                                                        
                                                        return (
                                                            <div className="my-3 relative">
                                                                <div className="bg-[#1a1a1a] rounded-t-md border-b border-[#333] p-2 text-xs text-neutral-400">
                                                                    <span>{match?.[1] || "Code"}</span>
                                                                </div>
                                                                <pre className="bg-[#1a1a1a] p-3 rounded-b-md overflow-x-auto whitespace-pre text-sm">
                                                                    <code {...props}>{children}</code>
                                                                </pre>
                                                            </div>
                                                        );
                                                    },
                                                    table: ({ ...props }) => (
                                                        <div className="overflow-x-auto my-3">
                                                            <table
                                                                className="min-w-full border border-[#333] rounded"
                                                                {...props}
                                                            />
                                                        </div>
                                                    ),
                                                    thead: ({ ...props }) => (
                                                        <thead className="bg-[#1a1a1a]" {...props} />
                                                    ),
                                                    tbody: ({ ...props }) => <tbody {...props} />,
                                                    tr: ({ ...props }) => (
                                                        <tr
                                                            className="border-b border-[#333] last:border-0"
                                                            {...props}
                                                        />
                                                    ),
                                                    th: ({ ...props }) => (
                                                        <th
                                                            className="px-4 py-2 text-left text-xs font-semibold text-neutral-300"
                                                            {...props}
                                                        />
                                                    ),
                                                    td: ({ ...props }) => (
                                                        <td className="px-4 py-2 text-sm" {...props} />
                                                    ),
                                                }}
                                            >
                                                {typeof messageContent === "string"
                                                    ? messageContent
                                                    : messageContent.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="whitespace-pre-wrap">
                                                {typeof messageContent === "string"
                                                    ? messageContent
                                                    : messageContent.content}
                                            </div>
                                        )}
                                        
                                        {hasInlineData && (
                                            <InlineDataAttachments parts={inlineDataParts} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* Empty div at the end for auto-scrolling */}
            <div ref={messagesEndRef} />
        </div>
    );
} 