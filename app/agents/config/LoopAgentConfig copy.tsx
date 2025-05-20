/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/config/LoopAgentConfig.tsx                                │
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
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/types/agent";
import { ArrowRight } from "lucide-react";

interface LoopAgentConfigProps {
  values: {
    config?: {
      sub_agents?: string[];
      max_iterations?: number;
    };
  };
  onChange: (values: any) => void;
  agents: Agent[];
  getAgentNameById: (id: string) => string;
}

export function LoopAgentConfig({
  values,
  onChange,
  agents,
  getAgentNameById,
}: LoopAgentConfigProps) {
  const handleMaxIterationsChange = (value: string) => {
    const maxIterations = parseInt(value);
    onChange({
      ...values,
      config: {
        ...values.config,
        max_iterations: isNaN(maxIterations) ? undefined : maxIterations,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="max_iterations" className="text-right text-neutral-300">
          Max. Iterations
        </Label>
        <Input
          id="max_iterations"
          type="number"
          min={1}
          max={100}
          value={values.config?.max_iterations || ""}
          onChange={(e) => handleMaxIterationsChange(e.target.value)}
          className="col-span-3 bg-[#222] border-[#444] text-white"
        />
      </div>

      <div className="border border-[#444] rounded-md p-4 bg-[#222]">
        <h3 className="text-sm font-medium text-white mb-4">
          Execution Order of Agents
        </h3>

        {values.config?.sub_agents && values.config.sub_agents.length > 0 ? (
          <div className="space-y-3">
            {values.config.sub_agents.map((agentId, index) => (
              <div
                key={agentId}
                className="flex items-center space-x-2 bg-[#2a2a2a] p-3 rounded-md"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {getAgentNameById(agentId)}
                  </div>
                  <div className="text-sm text-neutral-400">
                    Executed on{" "}
                    <Badge className="bg-[#333] text-emerald-400 border-none">
                      Position {index + 1}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400">
            Add agents in the "Sub-Agents" tab to define the execution order
          </div>
        )}

        <div className="mt-3 text-sm text-neutral-400">
          <p>
            The agents will be executed sequentially in the order listed above.
            The output of each agent will be provided as input to the next
            agent in the sequence.
          </p>
        </div>
      </div>
    </div>
  );
}
