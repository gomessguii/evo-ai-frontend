/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/shared-chat/components/SharedSessionList.tsx                     │
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SharedSession {
  id: string;
  update_time: string;
  name?: string;
}

interface SharedSessionListProps {
  sessions: SharedSession[];
  selectedSession: string | null;
  isLoading: boolean;
  searchTerm: string;
  isCollapsed: boolean;
  setSearchTerm: (value: string) => void;
  setSelectedSession: (value: string | null) => void;
  onNewSession: () => void;
  onToggleCollapse: () => void;
  agentName?: string;
}

export function SharedSessionList({
  sessions,
  selectedSession,
  isLoading,
  searchTerm,
  isCollapsed,
  setSearchTerm,
  setSelectedSession,
  onNewSession,
  onToggleCollapse,
  agentName = "Shared Agent"
}: SharedSessionListProps) {
  const filteredSessions = sessions.filter((session) =>
    session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.name && session.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const getDisplayName = (session: SharedSession) => {
    if (session.name) return session.name;
    return `Session ${session.id.substring(0, 8)}`;
  };

  if (isCollapsed) {
    return (
      <div className="w-10 border-r border-neutral-800 bg-neutral-900 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mt-4 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800"
          onClick={onToggleCollapse}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-neutral-800 flex flex-col bg-neutral-900 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <div className="p-1 rounded-full bg-emerald-500/20">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            {agentName}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">Shared Sessions</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onNewSession}
            className="bg-emerald-800 text-emerald-100 hover:bg-emerald-700 border-emerald-700 w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> New Session
          </Button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search sessions..."
              className="pl-9 bg-neutral-800 border-neutral-700 text-neutral-200 focus-visible:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
          </div>
        ) : sortedSessions.length > 0 ? (
          <div className="px-4 pt-2 space-y-2">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedSession === session.id
                    ? "bg-emerald-800/20 border border-emerald-600/40"
                    : "bg-neutral-800 hover:bg-neutral-700 border border-transparent"
                }`}
                onClick={() => setSelectedSession(session.id)}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <div className="text-neutral-200 font-medium truncate max-w-[180px]">
                    {getDisplayName(session)}
                  </div>
                </div>
                <div className="mt-1 flex items-center">
                  <Badge className="bg-neutral-700 text-emerald-400 border-neutral-600 text-xs">
                    Shared
                  </Badge>
                  <div className="text-xs text-neutral-500 ml-auto">
                    {formatDateTime(session.update_time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-4 text-neutral-400">
            No results found
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-400">
            Click "New" to start
          </div>
        )}
      </div>
    </div>
  );
} 