/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/ShareAgentDialog.tsx                             │
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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agent } from "@/types/agent";
import { Input } from "@/components/ui/input";
import { Copy, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent;
  apiKey?: string;
}

export function ShareAgentDialog({
  open,
  onOpenChange,
  agent,
  apiKey,
}: ShareAgentDialogProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open && agent && apiKey) {
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}/shared-chat?agent=${agent.id}&key=${apiKey}`);
    }
  }, [open, agent, apiKey]);

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to the clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast({
        title: "API Key copied!",
        description: "The API Key has been copied to the clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-400" />
            Share Agent
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Share this agent with others without the need to login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Share Link</h3>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareLink}
                className="bg-[#222] border-[#444] text-white"
              />
              <Button
                variant="outline"
                className="shrink-0 bg-[#222] border-[#444] hover:bg-[#333] text-emerald-400 hover:text-emerald-300"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-400">
              Any person with this link can access the agent using the included API key.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">API Key</h3>
            <div className="flex gap-2">
              <Input
                readOnly
                value={apiKey}
                type="password"
                className="bg-[#222] border-[#444] text-white"
              />
              <Button
                variant="outline"
                className="shrink-0 bg-[#222] border-[#444] hover:bg-[#333] text-emerald-400 hover:text-emerald-300"
                onClick={handleCopyApiKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-400">
              The API key allows access to the agent. Do not share with untrusted people.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-[#333] pt-4">
          <Button
            variant="outline"
            onClick={() => window.open(shareLink, "_blank")}
            className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white flex gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Link
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 