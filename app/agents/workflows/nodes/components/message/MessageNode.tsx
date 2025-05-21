/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/message/MessageNode.tsx        │
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, NodeProps, Position, useEdges } from "@xyflow/react";
import { MessageCircle, Text, Image, File, Video, ArrowRight } from "lucide-react";
import { MessageType, MessageTypeEnum } from "../../nodeFunctions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { BaseNode } from "../../BaseNode";

export function MessageNode(props: NodeProps) {
  const { selected, data } = props;
  const edges = useEdges();
  const isExecuting = data.isExecuting as boolean | undefined;

  const isHandleConnected = (handleId: string) => {
    return edges.some(
      (edge) => edge.source === props.id && edge.sourceHandle === handleId
    );
  };

  const isBottomHandleConnected = isHandleConnected("bottom-handle");
  
  const message = data.message as MessageType | undefined;

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case MessageTypeEnum.TEXT:
        return <Text className="h-4 w-4 text-orange-400" />;
      case "image":
        return <Image className="h-4 w-4 text-blue-400" />;
      case "file":
        return <File className="h-4 w-4 text-emerald-400" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-400" />;
      default:
        return <MessageCircle className="h-4 w-4 text-orange-400" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case MessageTypeEnum.TEXT:
        return 'bg-orange-900/30 text-orange-400 border-orange-700/40';
      case "image":
        return 'bg-blue-900/30 text-blue-400 border-blue-700/40';
      case "file":
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-700/40';
      case "video":
        return 'bg-purple-900/30 text-purple-400 border-purple-700/40';
      default:
        return 'bg-orange-900/30 text-orange-400 border-orange-700/40';
    }
  };

  const getMessageTypeName = (type: string) => {
    const messageTypes: Record<string, string> = {
      text: "Text Message",
      image: "Image",
      file: "File",
      video: "Video",
    };
    return messageTypes[type] || type;
  };

  return (
    <BaseNode hasTarget={true} selected={selected || false} borderColor="orange" isExecuting={isExecuting}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-900/40 shadow-sm">
            <MessageCircle className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-orange-400">
              {data.label as string}
            </p>
          </div>
        </div>
      </div>

      {message ? (
        <div className="mb-3 rounded-lg border border-orange-700/40 bg-orange-950/10 p-3 transition-all duration-200 hover:border-orange-600/50 hover:bg-orange-900/10">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center">
                {getMessageTypeIcon(message.type)}
                <span className="ml-1.5 font-medium text-white">{getMessageTypeName(message.type)}</span>
              </div>
              <Badge
                variant="outline"
                className={cn("px-1.5 py-0 text-xs", getMessageTypeColor(message.type))}
              >
                {message.type}
              </Badge>
            </div>
            
            {message.content && (
              <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                {message.content.slice(0, 80)} {message.content.length > 80 && '...'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-orange-700/40 bg-orange-950/10 p-5 text-center transition-all duration-200 hover:border-orange-600/50 hover:bg-orange-900/20">
          <MessageCircle className="h-8 w-8 text-orange-700/50 mb-2" />
          <p className="text-orange-400">No message configured</p>
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
            isBottomHandleConnected ? "!bg-orange-500 !border-orange-400" : "!bg-neutral-400 !border-neutral-500",
            selected && isBottomHandleConnected && "!bg-orange-400 !border-orange-300"
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
