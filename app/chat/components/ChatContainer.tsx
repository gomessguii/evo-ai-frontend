/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/chat/components/ChatContainer.tsx                                │
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

import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Loader2, Bot, Zap } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatMessage as ChatMessageType } from "@/services/sessionService";
import { cn } from "@/lib/utils";

interface FunctionMessageContent {
  title: string;
  content: string;
  author?: string;
}

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  agentColor: string;
  expandedFunctions: Record<string, boolean>;
  toggleFunctionExpansion: (messageId: string) => void;
  containsMarkdown: (text: string) => boolean;
  getMessageText: (message: ChatMessageType) => string | FunctionMessageContent;
  agentName?: string;
  containerClassName?: string;
  messagesContainerClassName?: string;
  inputContainerClassName?: string;
  sessionId?: string;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
  agentColor,
  expandedFunctions,
  toggleFunctionExpansion,
  containsMarkdown,
  getMessageText,
  agentName = "Agent",
  containerClassName = "",
  messagesContainerClassName = "",
  inputContainerClassName = "",
  sessionId,
}: ChatContainerProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);

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

  // Simulate initial loading for smoother UX
  useEffect(() => {
    if (sessionId) {
      setIsInitializing(true);
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionId]);

  const isEmpty = messages.length === 0;

  return (
    <div className={cn(
      "flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950",
      containerClassName
    )}>
      <div 
        className={cn(
          "flex-1 overflow-hidden p-5",
          messagesContainerClassName
        )}
        style={{ filter: isLoading && !isInitializing ? "blur(1px)" : "none" }}
      >
        <ScrollArea
          ref={messagesContainerRef}
          className="h-full pr-4"
        >
          {isInitializing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg mb-4 animate-pulse">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <p className="text-neutral-400 mb-2">Loading conversation...</p>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" 
                  style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          ) : isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center shadow-lg mb-5 border border-emerald-500/30">
                <MessageSquare className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-300 mb-2">
                {`Chat with ${agentName}`}
              </h3>
              <p className="text-neutral-500 text-sm max-w-md">
                Type your message below to start the conversation. This chat will help you interact with the agent and explore its capabilities.
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-4 flex-1">
              {messages.map((message) => {
                const messageContent = getMessageText(message);
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
            </div>
          )}
        </ScrollArea>
      </div>

      <div className={cn(
        "p-3 border-t border-neutral-800 bg-neutral-900",
        inputContainerClassName
      )}>
        {isLoading && !isInitializing && (
          <div className="px-4 py-2 mb-3 rounded-lg bg-neutral-800/50 text-sm text-neutral-400 flex items-center">
            <Loader2 className="h-3 w-3 mr-2 animate-spin text-emerald-400" />
            Agent is thinking...
          </div>
        )}
        <ChatInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          placeholder="Type your message..."
          autoFocus={true}
        />
      </div>
    </div>
  );
} 