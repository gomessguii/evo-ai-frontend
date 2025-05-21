/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/start/StartNode.tsx            │
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Node, NodeProps, Position, useEdges } from "@xyflow/react";
import { Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { BaseNode } from "../../BaseNode";

export type StartNodeType = Node<
  {
    label?: string;
  },
  "start-node"
>;

export function StartNode(props: NodeProps) {
  const { selected, data } = props;
  const edges = useEdges();
  const isExecuting = data.isExecuting as boolean | undefined;

  const isSourceHandleConnected = edges.some(
    (edge) => edge.source === props.id
  );

  return (
    <BaseNode hasTarget={true} selected={selected || false} borderColor="emerald" isExecuting={isExecuting}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/40 shadow-sm">
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-emerald-400">Start</p>
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-emerald-700/40 bg-emerald-950/10 p-3 transition-all duration-200 hover:border-emerald-600/50 hover:bg-emerald-900/10">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center">
              <span className="font-medium text-white">Input: User content</span>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-neutral-400">
            The workflow begins when a user sends a message to the agent
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end text-sm text-neutral-400 transition-colors">
        <div className="flex items-center space-x-1 rounded-md py-1 px-2">
          <span>Next step</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        <Handle
          className={cn(
            "!w-3 !h-3 !rounded-full transition-all duration-300",
            isSourceHandleConnected ? "!bg-emerald-500 !border-emerald-400" : "!bg-neutral-400 !border-neutral-500",
            selected && isSourceHandleConnected && "!bg-emerald-400 !border-emerald-300"
          )}
          style={{
            right: "-8px",
            top: "calc(100% - 25px)",
          }}
          type="source"
          position={Position.Right}
        />
      </div>
    </BaseNode>
  );
}
