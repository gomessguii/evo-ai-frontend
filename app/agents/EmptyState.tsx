/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/EmptyState.tsx                                            │
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

import { Button } from "@/components/ui/button";
import { Folder, Plus, Search, Server } from "lucide-react";

interface EmptyStateProps {
  type: "no-agents" | "empty-folder" | "search-no-results";
  searchTerm?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  type,
  searchTerm = "",
  onAction,
  actionLabel = "Create Agent",
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "empty-folder":
        return <Folder className="h-16 w-16 text-emerald-400" />;
      case "search-no-results":
        return <Search className="h-16 w-16 text-emerald-400" />;
      case "no-agents":
      default:
        return <Server className="h-16 w-16 text-emerald-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "empty-folder":
        return "Empty folder";
      case "search-no-results":
        return "No agents found";
      case "no-agents":
      default:
        return "No agents found";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "empty-folder":
        return "This folder is empty. Add agents or create a new one.";
      case "search-no-results":
        return `We couldn't find any agents that match your search: "${searchTerm}"`;
      case "no-agents":
      default:
        return "You don't have any agents configured. Create your first agent to start!";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="mb-6 p-8 rounded-full bg-[#1a1a1a] border border-[#333]">
        {getIcon()}
      </div>
      <h2 className="text-2xl font-semibold text-white mb-3">{getTitle()}</h2>
      <p className="text-neutral-300 mb-6 max-w-md">{getMessage()}</p>
      {onAction && (
        <Button
          onClick={onAction}
          className={
            type === "search-no-results"
              ? "bg-[#222] text-white hover:bg-[#333]"
              : "bg-emerald-400 text-black hover:bg-[#00cc7d] px-6 py-2 hover:shadow-[0_0_15px_rgba(0,255,157,0.2)]"
          }
        >
          {type === "search-no-results" ? null : (
            <Plus className="mr-2 h-5 w-5" />
          )}
          {type === "search-no-results" ? "Clear search" : actionLabel}
        </Button>
      )}
    </div>
  );
}
