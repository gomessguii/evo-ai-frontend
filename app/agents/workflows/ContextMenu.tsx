/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/ContextMenu.tsx                                 │
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
import { useReactFlow, Node, Edge } from "@xyflow/react";
import { Copy, Trash2 } from "lucide-react";
import React, { useCallback } from "react";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);

    if (!node) {
      console.error(`Node with id ${id} not found.`);
      return;
    }

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      id: `${node.id}-copy`,
      position,
      selected: false,
      dragging: false,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes: Node[]) => nodes.filter((node) => node.id !== id));
    setEdges((edges: Edge[]) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id),
    );
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{
        position: "absolute",
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
        zIndex: 10,
      }}
      className="context-menu rounded-md border p-3 shadow-lg border-neutral-700 bg-neutral-800"
      {...props}
    >
      <p className="mb-2 text-sm font-semibold text-neutral-200">
        Actions
      </p>
      <button
        onClick={duplicateNode}
        className="mb-1 flex w-full flex-row items-center rounded-md px-2 py-1 text-sm hover:bg-neutral-700"
      >
        <Copy
          size={16}
          className="mr-2 flex-shrink-0 text-blue-300"
        />
        <span className="text-neutral-300">Duplicate</span>
      </button>
      <button
        onClick={deleteNode}
        className="flex w-full flex-row items-center rounded-md px-2 py-1 text-sm hover:bg-neutral-700"
      >
        <Trash2
          size={16}
          className="mr-2 flex-shrink-0 text-red-300"
        />
        <span className="text-neutral-300">Delete</span>
      </button>
    </div>
  );
}
