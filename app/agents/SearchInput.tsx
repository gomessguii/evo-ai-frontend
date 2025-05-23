/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/SearchInput.tsx                                           │
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

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  selectedAgentType?: string | null;
  onAgentTypeChange?: (type: string | null) => void;
  agentTypes?: string[];
}

// Using "all" as a special value to represent no filter
const ANY_TYPE_VALUE = "all";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search agents...",
  className = "",
  selectedAgentType = null,
  onAgentTypeChange,
  agentTypes = [],
}: SearchInputProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTypeChange = (value: string) => {
    if (onAgentTypeChange) {
      onAgentTypeChange(value === ANY_TYPE_VALUE ? null : value);
    }
  };

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="pl-10 w-full bg-[#222] border-[#444] text-white focus:border-emerald-400 focus:ring-emerald-400/10"
      />
      {value && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
        )}
      </div>

      {agentTypes.length > 0 && onAgentTypeChange && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`px-3 py-2 bg-[#222] border-[#444] hover:bg-[#333] ${
                selectedAgentType ? "text-emerald-400" : "text-neutral-400"
              }`}
            >
              <Filter className="h-4 w-4 mr-1" />
              {selectedAgentType ? "Filtered" : "Filter"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-[#222] border-[#444]">
            <div className="space-y-3">
              <div className="text-xs font-medium text-neutral-300">
                Filter by type
              </div>
              <Select
                value={selectedAgentType ? selectedAgentType : ANY_TYPE_VALUE}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="bg-[#333] border-[#444] text-white">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent className="bg-[#333] border-[#444] text-white">
                  <SelectItem value={ANY_TYPE_VALUE}>Any type</SelectItem>
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedAgentType && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-neutral-300 hover:text-white"
                  onClick={() => {
                    onAgentTypeChange(null);
                    setIsFilterOpen(false);
                  }}
                >
                  Clear filter
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
