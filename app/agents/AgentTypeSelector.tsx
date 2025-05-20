/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/AgentTypeSelector.tsx                                     │
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

import { AgentType } from "@/types/agent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  ExternalLink,
  GitBranch,
  RefreshCw,
  Workflow,
  Users,
  BookOpenCheck,
} from "lucide-react";

interface AgentTypeSelectorProps {
  value: AgentType;
  onValueChange: (value: AgentType) => void;
  className?: string;
}

export const agentTypes = [
  { value: "llm", label: "LLM Agent", icon: Code },
  { value: "a2a", label: "A2A Agent", icon: ExternalLink },
  { value: "sequential", label: "Sequential Agent", icon: Workflow },
  { value: "parallel", label: "Parallel Agent", icon: GitBranch },
  { value: "loop", label: "Loop Agent", icon: RefreshCw },
  { value: "workflow", label: "Workflow Agent", icon: Workflow },
  { value: "task", label: "Task Agent", icon: BookOpenCheck },
];

export function AgentTypeSelector({
  value,
  onValueChange,
  className = "",
}: AgentTypeSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(value: AgentType) => onValueChange(value)}
    >
      <SelectTrigger
        className={`bg-[#222] border-[#444] text-white ${className}`}
      >
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent className="bg-[#222] border-[#444] text-white">
        {agentTypes.map((type) => (
          <SelectItem
            key={type.value}
            value={type.value}
            className="data-[selected]:bg-[#333] data-[highlighted]:bg-[#333] text-white focus:!text-white hover:text-emerald-400 data-[selected]:!text-emerald-400"
          >
            <div className="flex items-center gap-2">
              <type.icon className="h-4 w-4 text-emerald-400" />
              {type.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
