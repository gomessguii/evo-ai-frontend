/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/AgentSidebar.tsx                                          │
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  FolderPlus,
  Home,
  X,
  CircleEllipsis,
  Edit,
  Trash2,
} from "lucide-react";

interface AgentFolder {
  id: string;
  name: string;
  description: string;
}

interface AgentSidebarProps {
  visible: boolean;
  folders: AgentFolder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onAddFolder: () => void;
  onEditFolder: (folder: AgentFolder) => void;
  onDeleteFolder: (folder: AgentFolder) => void;
  onClose: () => void;
}

export function AgentSidebar({
  visible,
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onClose,
}: AgentSidebarProps) {
  return (
    <>
      {visible && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-40 bg-[#222] p-2 rounded-md text-emerald-400 hover:bg-[#333] hover:text-emerald-400 shadow-md transition-all"
          aria-label="Hide folders"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div
        className={`fixed top-0 z-30 h-full w-64 bg-[#1a1a1a] p-4 shadow-xl transition-all duration-300 ease-in-out ${
          visible ? "left-64 translate-x-0" : "left-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Folder className="h-5 w-5 mr-2 text-emerald-400" />
            Folders
          </h2>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-neutral-400 hover:text-emerald-400 hover:bg-[#222]"
              onClick={onAddFolder}
            >
              <FolderPlus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-neutral-400 hover:text-emerald-400 hover:bg-[#222]"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <button
            className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
              selectedFolderId === null
                ? "bg-[#333] text-emerald-400"
                : "text-neutral-300 hover:bg-[#222] hover:text-white"
            }`}
            onClick={() => onSelectFolder(null)}
          >
            <Home className="h-4 w-4 mr-2" />
            <span>All agents</span>
          </button>

          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center group">
              <button
                className={`flex-1 text-left px-3 py-2 rounded-md flex items-center ${
                  selectedFolderId === folder.id
                    ? "bg-[#333] text-emerald-400"
                    : "text-neutral-300 hover:bg-[#222] hover:text-white"
                }`}
                onClick={() => onSelectFolder(folder.id)}
              >
                <Folder className="h-4 w-4 mr-2" />
                <span className="truncate">{folder.name}</span>
              </button>

              <div className="opacity-0 group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-0 text-neutral-400 hover:text-white hover:bg-[#222]"
                    >
                      <CircleEllipsis className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#222] border-[#333] text-white"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-[#333] focus:bg-[#333]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditFolder(folder);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-500 hover:bg-[#333] hover:text-red-400 focus:bg-[#333]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFolder(folder);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
