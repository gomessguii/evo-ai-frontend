/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @author: Victor Calazans - Implementation of Delay node functionality        │
│ @file: /app/agents/workflows/nodes/components/delay/DelayNode.tsx            │
│ Developed by: Davidson Gomes                                                 │
│ Delay node developed by: Victor Calazans                                     │
│ Creation date: May 13, 2025                                                  │
│ Delay node implementation date: May 17, 2025                                 │
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, NodeProps, Position, useEdges } from "@xyflow/react";
import { Clock, ArrowRight, Timer } from "lucide-react";
import { DelayType } from "../../nodeFunctions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { BaseNode } from "../../BaseNode";

export function DelayNode(props: NodeProps) {
  const { selected, data } = props;

  const edges = useEdges();
  const isExecuting = data.isExecuting as boolean | undefined;

  const isHandleConnected = (handleId: string) => {
    return edges.some(
      (edge) => edge.source === props.id && edge.sourceHandle === handleId
    );
  };

  const isBottomHandleConnected = isHandleConnected("bottom-handle");
  
  const delay = data.delay as DelayType | undefined;

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'seconds':
        return 'Seconds';
      case 'minutes':
        return 'Minutes';
      case 'hours':
        return 'Hours';
      case 'days':
        return 'Days';
      default:
        return unit;
    }
  };

  return (
    <BaseNode hasTarget={true} selected={selected || false} borderColor="yellow" isExecuting={isExecuting}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-900/40 shadow-sm">
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-yellow-400">
              {data.label as string}
            </p>
          </div>
        </div>
      </div>

      {delay ? (
        <div className="mb-3 rounded-lg border border-yellow-700/40 bg-yellow-950/10 p-3 transition-all duration-200 hover:border-yellow-600/50 hover:bg-yellow-900/10">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center">
                <Timer className="h-4 w-4 text-yellow-400" />
                <span className="ml-1.5 font-medium text-white">Delay</span>
              </div>
              <Badge
                variant="outline"
                className="px-1.5 py-0 text-xs bg-yellow-900/30 text-yellow-400 border-yellow-700/40"
              >
                {getUnitLabel(delay.unit)}
              </Badge>
            </div>
            
            <div className="mt-2 flex items-center">
              <span className="text-lg font-semibold text-yellow-300">{delay.value}</span>
              <span className="ml-1 text-sm text-neutral-400">{delay.unit}</span>
            </div>
            
            {delay.description && (
              <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                {delay.description.slice(0, 80)} {delay.description.length > 80 && '...'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-yellow-700/40 bg-yellow-950/10 p-5 text-center transition-all duration-200 hover:border-yellow-600/50 hover:bg-yellow-900/20">
          <Clock className="h-8 w-8 text-yellow-700/50 mb-2" />
          <p className="text-yellow-400">No delay configured</p>
          <p className="mt-1 text-xs text-neutral-500">Click to configure</p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-end text-sm text-neutral-400 transition-colors">
        <div className="flex items-center space-x-1 rounded-md py-1 px-2">
          <span>Next step</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        <Handle
          className={cn(
            "!w-3 !h-3 !rounded-full transition-all duration-300",
            isBottomHandleConnected ? "!bg-yellow-500 !border-yellow-400" : "!bg-neutral-400 !border-neutral-500",
            selected && isBottomHandleConnected && "!bg-yellow-400 !border-yellow-300"
          )}
          style={{
            right: "-8px",
            top: "calc(100% - 25px)",
          }}
          type="source"
          position={Position.Right}
          id="bottom-handle"
        />
      </div>
    </BaseNode>
  );
} 