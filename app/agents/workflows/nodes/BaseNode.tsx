/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/BaseNode.tsx                              │
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
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { cn } from "@/lib/utils";
import { useDnD } from "@/contexts/DnDContext";

export function BaseNode({
  selected,
  hasTarget,
  children,
  borderColor,
  isExecuting
}: {
  selected: boolean;
  hasTarget: boolean;
  children: React.ReactNode;
  borderColor: string;
  isExecuting?: boolean;
}) {
  const { pointerEvents } = useDnD();

  // Border and background color mapping
  const colorStyles = {
    blue: {
      border: "border-blue-700/70 hover:border-blue-500",
      gradient: "bg-gradient-to-br from-blue-950/40 to-neutral-900/90", 
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(59,130,246,0.3)]"
    },
    orange: {
      border: "border-orange-700/70 hover:border-orange-500",
      gradient: "bg-gradient-to-br from-orange-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(249,115,22,0.3)]"
    },
    green: {
      border: "border-green-700/70 hover:border-green-500",
      gradient: "bg-gradient-to-br from-green-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", 
      selectedGlow: "shadow-[0_0_25px_rgba(34,197,94,0.3)]"
    },
    red: {
      border: "border-red-700/70 hover:border-red-500", 
      gradient: "bg-gradient-to-br from-red-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(239,68,68,0.3)]"
    },
    yellow: {
      border: "border-yellow-700/70 hover:border-yellow-500",
      gradient: "bg-gradient-to-br from-yellow-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(234,179,8,0.3)]"
    },
    purple: {
      border: "border-purple-700/70 hover:border-purple-500",
      gradient: "bg-gradient-to-br from-purple-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]"
    },
    indigo: {
      border: "border-indigo-700/70 hover:border-indigo-500",
      gradient: "bg-gradient-to-br from-indigo-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(99,102,241,0.3)]"
    },
    pink: {
      border: "border-pink-700/70 hover:border-pink-500",
      gradient: "bg-gradient-to-br from-pink-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(236,72,153,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(236,72,153,0.3)]"
    },
    emerald: {
      border: "border-emerald-700/70 hover:border-emerald-500",
      gradient: "bg-gradient-to-br from-emerald-950/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]"
    },
    slate: {
      border: "border-slate-700/70 hover:border-slate-500",
      gradient: "bg-gradient-to-br from-slate-800/40 to-neutral-900/90",
      glow: "shadow-[0_0_15px_rgba(100,116,139,0.15)]",
      selectedGlow: "shadow-[0_0_25px_rgba(100,116,139,0.3)]"
    },
  };

  // Default to blue if color not in mapping
  const colorStyle = colorStyles[borderColor as keyof typeof colorStyles] || colorStyles.blue;
  
  // Selected styles
  const selectedStyle = {
    border: "border-green-500/90",
    glow: colorStyle.selectedGlow
  };
  
  // Executing styles
  const executingStyle = {
    border: "border-emerald-500",
    glow: "shadow-[0_0_25px_rgba(5,212,114,0.5)]"
  };

  return (
    <>
      <div
        className={cn(
          "relative z-0 w-[350px] rounded-2xl p-4 border-2 backdrop-blur-sm transition-all duration-300",
          "shadow-lg hover:shadow-xl",
          isExecuting ? executingStyle.glow : selected ? selectedStyle.glow : colorStyle.glow,
          isExecuting ? executingStyle.border : selected ? selectedStyle.border : colorStyle.border,
          colorStyle.gradient,
          isExecuting && "active-execution-node"
        )}
        style={{
          backdropFilter: "blur(12px)",
        }}
        data-is-executing={isExecuting ? "true" : "false"}
      >
        {hasTarget && (
          <Handle
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              borderRadius: "15px",
              height: "100%",
              backgroundColor: "transparent",
              border: "none",
              pointerEvents: pointerEvents === "none" ? "none" : "auto",
            }}
            type="target"
            position={Position.Left}
          />
        )}

        {children}
      </div>
    </>
  );
}
