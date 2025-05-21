/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/page.tsx                                        │
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

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Canva from "./Canva";
import { Agent } from "@/types/agent";
import { getAgent, updateAgent } from "@/services/agentService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, PlayIcon } from "lucide-react";
import Link from "next/link";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/contexts/DnDContext";
import { NodeDataProvider } from "@/contexts/NodeDataContext";
import { SourceClickProvider } from "@/contexts/SourceClickContext";
import { useToast } from "@/hooks/use-toast";
import { AgentTestChatModal } from "./nodes/components/agent/AgentTestChatModal";

function WorkflowsContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const canvaRef = useRef<any>(null);
  const { toast } = useToast();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const clientId = user?.client_id || "";

  useEffect(() => {
    if (agentId && clientId) {
      setLoading(true);
      getAgent(agentId, clientId)
        .then((res) => {
          setAgent(res.data);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "current_workflow_agent",
              JSON.stringify(res.data)
            );
          }
        })
        .catch((err) => {
          console.error("Error loading agent:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [agentId, clientId]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("current_workflow_agent");
      }
    };
  }, []);

  const handleSaveWorkflow = async () => {
    if (!agent || !canvaRef.current) return;

    try {
      const { nodes, edges } = canvaRef.current.getFlowData();

      const workflow = {
        nodes,
        edges,
      };

      await updateAgent(agent.id, {
        ...agent,
        config: {
          ...agent.config,
          workflow,
        },
      });

      toast({
        title: "Workflow saved",
        description: "The changes were saved successfully",
      });

      canvaRef.current.setHasChanges(false);
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast({
        title: "Error saving workflow",
        description: "Unable to save the changes",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex flex-col" data-workflow-page="true">
      {/* Header with controls */}
      <div className="w-full bg-[#121212] py-4 px-6 z-10 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Link href="/agents">
            <Button
              variant="outline"
              className="bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Button>
          </Link>

          {agent && (
            <div className="bg-neutral-800 px-4 py-2 rounded-md">
              <h2 className="text-neutral-200 font-medium">
                {agent.name} -{" "}
                <span className="text-neutral-400 text-sm">{agent.type}</span>
              </h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
            onClick={handleSaveWorkflow}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          {agent && (
            <Button
              variant="outline"
              className="bg-green-800 border-green-700 text-green-200 hover:bg-green-700"
              onClick={() => setIsTestModalOpen(true)}
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Test Workflow
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        {agent && isTestModalOpen && (
          <AgentTestChatModal
            open={isTestModalOpen}
            onOpenChange={setIsTestModalOpen}
            agent={agent}
            canvasRef={canvaRef} // Passamos a referência do canvas para permitir a visualização dos nós em execução
          />
        )}

        <NodeDataProvider>
          <SourceClickProvider>
            <DnDProvider>
              <ReactFlowProvider>
                <Canva agent={agent} ref={canvaRef} data-canvas-ref="true" />
              </ReactFlowProvider>
            </DnDProvider>
          </SourceClickProvider>
        </NodeDataProvider>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <WorkflowsContent />
    </Suspense>
  );
}
