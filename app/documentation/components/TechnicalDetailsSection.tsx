/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/TechnicalDetailsSection.tsx             │
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/app/documentation/components/CodeBlock";

interface TechnicalDetailsSectionProps {
  copyToClipboard: (text: string) => void;
}

export function TechnicalDetailsSection({ copyToClipboard }: TechnicalDetailsSectionProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-white">
      <CardHeader>
        <CardTitle className="text-emerald-400">Technical Details of the Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-emerald-400 text-lg font-medium mb-2">Method message/send</h3>
          <p className="text-neutral-300 mb-4">
            The <code className="bg-[#333] px-1 rounded">message/send</code> method performs a standard HTTP request and waits for the complete response.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Request:</h4>
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify({
                    jsonrpc: "2.0",
                    id: "call-123",
                    method: "message/send",
                    params: {
                      id: "task-456",
                      sessionId: "session-789",
                      message: {
                        role: "user",
                        parts: [
                          {
                            type: "text",
                            text: "Your question here"
                          }
                        ]
                      }
                    }
                  }, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify({
                    jsonrpc: "2.0",
                    id: "call-123",
                    method: "message/send",
                    params: {
                      id: "task-456",
                      sessionId: "session-789",
                      message: {
                        role: "user",
                        parts: [
                          {
                            type: "text",
                            text: "Your question here"
                          }
                        ]
                      }
                    }
                  }, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Headers:</h4>
              <div className="relative">
                <CodeBlock
                  text={`Content-Type: application/json
x-api-key: YOUR_API_KEY`}
                  language="text"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`Content-Type: application/json
x-api-key: YOUR_API_KEY`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Response:</h4>
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify({
                    jsonrpc: "2.0",
                    result: {
                      status: {
                        state: "completed",
                        message: {
                          role: "model",
                          parts: [
                            {
                              type: "text",
                              text: "Complete agent response here."
                            }
                          ]
                        }
                      }
                    },
                    id: "call-123"
                  }, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify({
                    jsonrpc: "2.0",
                    result: {
                      status: {
                        state: "completed",
                        message: {
                          role: "model",
                          parts: [
                            {
                              type: "text",
                              text: "Complete agent response here."
                            }
                          ]
                        }
                      }
                    },
                    id: "call-123"
                  }, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-[#333]" />

        <div>
          <h3 className="text-emerald-400 text-lg font-medium mb-2">Method message/stream</h3>
          <p className="text-neutral-300 mb-4">
            The <code className="bg-[#333] px-1 rounded">message/stream</code> method uses Server-Sent Events (SSE) to receive real-time updates.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Request:</h4>
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify({
                    jsonrpc: "2.0",
                    id: "call-123",
                    method: "message/stream",
                    params: {
                      id: "task-456",
                      sessionId: "session-789",
                      message: {
                        role: "user",
                        parts: [
                          {
                            type: "text",
                            text: "Your question here"
                          }
                        ]
                      }
                    }
                  }, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify({
                    jsonrpc: "2.0",
                    id: "call-123",
                    method: "message/stream",
                    params: {
                      id: "task-456",
                      sessionId: "session-789",
                      message: {
                        role: "user",
                        parts: [
                          {
                            type: "text",
                            text: "Your question here"
                          }
                        ]
                      }
                    }
                  }, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Headers:</h4>
              <div className="relative">
                <CodeBlock
                  text={`Content-Type: application/json
x-api-key: YOUR_API_KEY
Accept: text/event-stream`}
                  language="text"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`Content-Type: application/json
x-api-key: YOUR_API_KEY
Accept: text/event-stream`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">SSE Event Format:</h4>
              <p className="text-neutral-300 mb-4">
                Each event follows the standard Server-Sent Events (SSE) format, with the "data:" prefix followed by the JSON content and terminated by two newlines ("\n\n"):
              </p>
              <div className="relative">
                <CodeBlock
                  text={`data: {"jsonrpc":"2.0","id":"call-123","result":{"id":"task-456","status":{"state":"working","message":{"role":"agent","parts":[{"type":"text","text":"Processing..."}]},"timestamp":"2025-05-13T18:10:37.219Z"},"final":false}}

data: {"jsonrpc":"2.0","id":"call-123","result":{"id":"task-456","status":{"state":"completed","timestamp":"2025-05-13T18:10:40.456Z"},"final":true}}
`}
                  language="text"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`data: {"jsonrpc":"2.0","id":"call-123","result":{"id":"task-456","status":{"state":"working","message":{"role":"agent","parts":[{"type":"text","text":"Processing..."}]},"timestamp":"2025-05-13T18:10:37.219Z"},"final":false}}

data: {"jsonrpc":"2.0","id":"call-123","result":{"id":"task-456","status":{"state":"completed","timestamp":"2025-05-13T18:10:40.456Z"},"final":true}}
`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">Event Types:</h4>
              <ul className="list-disc list-inside text-neutral-300 space-y-2 mb-4">
                <li><span className="text-emerald-400">Status Updates</span>: Contains the <code className="bg-[#333] px-1 rounded">status</code> field with information about the task status.</li>
                <li><span className="text-emerald-400">Artifact Updates</span>: Contains the <code className="bg-[#333] px-1 rounded">artifact</code> field with the content generated by the agent.</li>
                <li><span className="text-emerald-400">Ping Events</span>: Simple events with the format <code className="bg-[#333] px-1 rounded">: ping</code> to keep the connection active.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Client Consumption:</h4>
              <p className="text-neutral-300 mb-2">
                For a better experience, we recommend using the <code className="bg-[#333] px-1 rounded">EventSource</code> API to consume the events:
              </p>
              <div className="relative">
                <CodeBlock
                  text={`// After receiving the initial response via POST, use EventSource to stream
const eventSource = new EventSource(\`/api/v1/a2a/\${agentId}/stream?taskId=\${taskId}&key=\${apiKey}\`);

// Process the received events
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // Process different types of events
  if (data.result) {
    // 1. Process status updates
    if (data.result.status) {
      const state = data.result.status.state; // "working", "completed", etc.
      
      // Check if there is a text message
      if (data.result.status.message?.parts) {
        const textParts = data.result.status.message.parts
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("");
          
        // Update UI with the text
        updateUI(textParts);
      }
      
      // Check if it is the final event
      if (data.result.final === true) {
        eventSource.close(); // Close connection
      }
    }
    
    // 2. Process the generated artifacts
    if (data.result.artifact) {
      const artifact = data.result.artifact;
      
      // Extract text from the artifact
      if (artifact.parts) {
        const artifactText = artifact.parts
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("");
          
        // Update UI with the artifact
        updateArtifactUI(artifactText);
      }
    }
  }
};

// Handle errors
eventSource.onerror = (error) => {
  console.error("Error in SSE:", error);
  eventSource.close();
};`}
                  language="javascript"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`// After receiving the initial response via POST, use EventSource to stream
const eventSource = new EventSource(\`/api/v1/a2a/\${agentId}/stream?taskId=\${taskId}&key=\${apiKey}\`);

// Process the received events
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // Process different types of events
  if (data.result) {
    // 1. Process status updates
    if (data.result.status) {
      const state = data.result.status.state; // "working", "completed", etc.
      
      // Check if there is a text message
      if (data.result.status.message?.parts) {
        const textParts = data.result.status.message.parts
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("");
          
        // Update UI with the text
        updateUI(textParts);
      }
      
      // Check if it is the final event
      if (data.result.final === true) {
        eventSource.close(); // Close connection
      }
    }
    
    // 2. Process the generated artifacts
    if (data.result.artifact) {
      const artifact = data.result.artifact;
      
      // Extract text from the artifact
      if (artifact.parts) {
        const artifactText = artifact.parts
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("");
          
        // Update UI with the artifact
        updateArtifactUI(artifactText);
      }
    }
  }
};

// Handle errors
eventSource.onerror = (error) => {
  console.error("Error in SSE:", error);
  eventSource.close();
};`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Possible task states:</h4>
              <ul className="list-disc list-inside text-neutral-300 space-y-1">
                <li><span className="text-emerald-400">submitted</span>: Task sent but not yet processed</li>
                <li><span className="text-emerald-400">working</span>: Task being processed by the agent</li>
                <li><span className="text-emerald-400">completed</span>: Task completed successfully</li>
                <li><span className="text-emerald-400">input-required</span>: Agent waiting for additional user input</li>
                <li><span className="text-emerald-400">failed</span>: Task failed during processing</li>
                <li><span className="text-emerald-400">canceled</span>: Task was canceled</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-[#222] p-4 rounded-md border border-[#444]">
          <h4 className="font-medium text-white mb-2">Possible task states:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <li className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>submitted</strong>: Task sent</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>working</strong>: Task being processed</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>input-required</strong>: Agent waiting for additional user input</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>completed</strong>: Task completed successfully</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-neutral-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>canceled</strong>: Task canceled</span>
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-neutral-300"><strong>failed</strong>: Task processing failed</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 