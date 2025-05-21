/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/shared-chat/components/SharedChatPanel.tsx                       │
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

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Loader2, Bot, User } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/services/sessionService";
import { ChatMessage } from "@/app/chat/components/ChatMessage";
import { FileData } from "@/lib/file-utils";
import { ChatInput } from "@/app/chat/components/ChatInput";

interface FunctionMessageContent {
  title: string;
  content: string;
  author?: string;
}

interface SharedChatPanelProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  isSending: boolean;
  agentName?: string;
  onSendMessage: (message: string, files?: FileData[]) => void;
  getMessageText: (message: ChatMessageType) => string | FunctionMessageContent;
  containsMarkdown: (text: string) => boolean;
  sessionId?: string;
}

export function SharedChatPanel({
  messages,
  isLoading,
  isSending,
  agentName = "Shared Agent",
  onSendMessage,
  getMessageText,
  containsMarkdown,
  sessionId,
}: SharedChatPanelProps) {
  const [expandedFunctions, setExpandedFunctions] = useState<Record<string, boolean>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  const toggleFunctionExpansion = (messageId: string) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-neutral-950"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-4 relative">
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
              {`Chat with ${agentName}`}
            </h3>
            <p className="text-neutral-500 text-sm max-w-md">
              Type your message below to start the conversation. This chat will help you interact with the shared agent and explore its capabilities.
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-full">
            {messages.map((message) => {
              const messageContent = getMessageText(message);
              const agentColor = message.author === "user" ? "bg-emerald-500" : "bg-gradient-to-br from-neutral-800 to-neutral-900";
              const isExpanded = expandedFunctions[message.id] || false;

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  agentColor={agentColor}
                  isExpanded={isExpanded}
                  toggleExpansion={toggleFunctionExpansion}
                  containsMarkdown={containsMarkdown}
                  messageContent={messageContent}
                  sessionId={sessionId}
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

      <div className="px-4 pt-4 pb-6 border-t border-neutral-700 bg-neutral-900">
        {isSending && !isLoading && (
          <div className="px-4 py-2 mb-3 rounded-lg bg-neutral-800/50 border border-neutral-700/30 text-sm text-neutral-400 flex items-center">
            <div className="mr-2 relative">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <div className="absolute inset-0 blur-sm bg-emerald-400/20 rounded-full animate-pulse"></div>
            </div>
            Agent is thinking...
          </div>
        )}
        <div className="rounded-lg bg-neutral-800/20 border border-neutral-700/30 p-1">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isSending || isLoading}
            placeholder="Type your message..."
            autoFocus={true}
          />
        </div>
      </div>
    </div>
  );
} 