/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/LabSection.tsx                          │
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

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { HttpLabForm } from "@/app/documentation/components/HttpLabForm";
import { StreamLabForm } from "@/app/documentation/components/StreamLabForm";
import { CodeBlock } from "@/app/documentation/components/CodeBlock";

interface LabSectionProps {
  agentUrl: string;
  setAgentUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  message: string;
  setMessage: (message: string) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  taskId: string;
  setTaskId: (id: string) => void;
  callId: string;
  setCallId: (id: string) => void;
  sendRequest: () => Promise<void>;
  sendStreamRequestWithEventSource: () => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
  streamResponse: string;
  streamStatus: string;
  streamHistory: string[];
  streamComplete: boolean;
  response: string;
  copyToClipboard: (text: string) => void;
  renderStatusIndicator: () => JSX.Element | null;
  renderTypingIndicator: () => JSX.Element | null;
}

export function LabSection({
  agentUrl,
  setAgentUrl,
  apiKey,
  setApiKey,
  message,
  setMessage,
  sessionId,
  setSessionId,
  taskId,
  setTaskId,
  callId,
  setCallId,
  sendRequest,
  sendStreamRequestWithEventSource,
  isLoading,
  isStreaming,
  streamResponse,
  streamStatus,
  streamHistory,
  streamComplete,
  response,
  copyToClipboard,
  renderStatusIndicator,
  renderTypingIndicator
}: LabSectionProps) {
  const [labMode, setLabMode] = useState("http");

  return (
    <>
      <Card className="bg-[#1a1a1a] border-[#333] text-white mb-6">
        <CardHeader>
          <CardTitle className="text-emerald-400">A2A Test Lab</CardTitle>
          <CardDescription className="text-neutral-400">
            Test your A2A agent with different communication methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="http" onValueChange={setLabMode}>
            <TabsList className="bg-[#222] border-[#333] mb-4">
              <TabsTrigger value="http" className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400">
                HTTP Request
              </TabsTrigger>
              <TabsTrigger value="stream" className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400">
                Streaming
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="http">
              <HttpLabForm 
                agentUrl={agentUrl}
                setAgentUrl={setAgentUrl}
                apiKey={apiKey}
                setApiKey={setApiKey}
                message={message}
                setMessage={setMessage}
                sessionId={sessionId}
                setSessionId={setSessionId}
                taskId={taskId}
                setTaskId={setTaskId}
                callId={callId}
                setCallId={setCallId}
                sendRequest={sendRequest}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="stream">
              <StreamLabForm 
                agentUrl={agentUrl}
                setAgentUrl={setAgentUrl}
                apiKey={apiKey}
                setApiKey={setApiKey}
                message={message}
                setMessage={setMessage}
                sessionId={sessionId}
                setSessionId={setSessionId}
                taskId={taskId}
                setTaskId={setTaskId}
                callId={callId}
                setCallId={setCallId}
                sendStreamRequest={sendStreamRequestWithEventSource}
                isStreaming={isStreaming}
                streamResponse={streamResponse}
                streamStatus={streamStatus}
                streamHistory={streamHistory}
                renderStatusIndicator={renderStatusIndicator}
                renderTypingIndicator={renderTypingIndicator}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {response && labMode === "http" && (
        <Card className="bg-[#1a1a1a] border-[#333] text-white">
          <CardHeader>
            <CardTitle className="text-emerald-400">Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <CodeBlock
                text={response}
                language="json"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-[#333]"
                onClick={() => copyToClipboard(response)}
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
} 