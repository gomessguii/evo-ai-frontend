/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/config/A2AAgentConfig.tsx                                 │
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
import { Label } from "@/components/ui/label";

interface A2AAgentConfigProps {
  values: {
    agent_card_url?: string;
  };
  onChange: (values: any) => void;
}

export function A2AAgentConfig({ values, onChange }: A2AAgentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="agent_card_url" className="text-right text-neutral-300">
          Agent Card URL
        </Label>
        <Input
          id="agent_card_url"
          value={values.agent_card_url || ""}
          onChange={(e) =>
            onChange({
              ...values,
              agent_card_url: e.target.value,
            })
          }
          placeholder="https://example.com/.well-known/agent-card.json"
          className="col-span-3 bg-[#222] border-[#444] text-white"
        />
      </div>
      <div className="pl-[25%] text-sm text-neutral-400">
        <p>
          Provide the full URL for the JSON file of the Agent Card that describes
          this agent.
        </p>
        <p className="mt-2">
          Agent Cards contain metadata, capabilities descriptions and supported
          protocols.
        </p>
      </div>
    </div>
  );
}
