/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/config/ParallelAgentConfig.tsx                            │
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

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/types/agent";
import { GitBranch } from "lucide-react";

interface ParallelAgentConfigProps {
  values: {
    config?: {
      sub_agents?: string[];
      aggregation_method?: string;
      timeout_seconds?: number;
      custom_mcp_servers?: any[];
      wait_for_all?: boolean;
    };
  };
  onChange: (values: any) => void;
  agents: Agent[];
  getAgentNameById: (id: string) => string;
}

export function ParallelAgentConfig({
  values,
  onChange,
  agents,
  getAgentNameById,
}: ParallelAgentConfigProps) {
  const aggregationMethods = [
    { value: "merge", label: "Merge all responses" },
    { value: "first", label: "Use only the first response" },
    { value: "last", label: "Use only the last response" },
    { value: "custom", label: "Custom aggregation" },
  ];

  const handleTimeoutChange = (value: string) => {
    const timeout = parseInt(value);
    onChange({
      ...values,
      config: {
        ...values.config,
        timeout_seconds: isNaN(timeout) ? undefined : timeout,
      },
    });
  };

  return (
    <div className="space-y-6">
      
      <div className="border border-[#444] rounded-md p-4 bg-[#222]">
        <h3 className="text-sm font-medium text-white mb-4">
          Agents in Parallel
        </h3>

        {values.config?.sub_agents && values.config.sub_agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {values.config.sub_agents.map((agentId) => (
              <div
                key={agentId}
                className="flex items-center space-x-2 bg-[#2a2a2a] p-3 rounded-md"
              >
                <GitBranch className="h-5 w-5 text-emerald-400" />
                <div className="flex-1">
                  <div className="font-medium text-white truncate">
                    {getAgentNameById(agentId)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400">
            Add agents in the "Sub-Agents" tab to execute in parallel
          </div>
        )}

        <div className="mt-3 text-sm text-neutral-400">
          <p>
            All listed agents will be executed simultaneously with the same
            input. The responses will be aggregated according to the selected
            method.
          </p>
        </div>
      </div>
    </div>
  );
}
