/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/DocumentationSection.tsx                │
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
import { ClipboardCopy, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/app/documentation/components/CodeBlock";

interface DocumentationSectionProps {
  copyToClipboard: (text: string) => void;
}

export function DocumentationSection({ copyToClipboard }: DocumentationSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            What is A2A?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Agent2Agent (A2A) is an open protocol created by Google to allow 
            communication and interoperability between agent applications.
          </p>
          <p>
            This protocol establishes a common standard for agents built 
            in different structures and providers to collaborate and exchange information.
          </p>
          <div className="flex flex-col space-y-2 mt-4">
            <a 
              href="https://github.com/google/A2A" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center"
            >
              <span className="mr-2">GitHub: google/A2A</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center"
            >
              <span className="mr-2">Google Developers Blog: A2A</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">A2A Communication Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-emerald-400 text-lg font-medium mb-2">1. Standard HTTP (tasks/send)</h3>
            <p className="text-neutral-300 mb-2">
              This method sends a request and receives the complete response at once, after the agent has finished all processing.
            </p>
            <div className="bg-[#222] p-4 rounded-md border border-[#444] space-y-2">
              <h4 className="font-medium text-white">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                <li>Single HTTP request with complete response</li>
                <li>Wait for the agent to finish all processing</li>
                <li>Best for simple and quick tasks</li>
                <li>Simpler implementation in frontend</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-emerald-400 text-lg font-medium mb-2">2. Streaming (tasks/sendSubscribe)</h3>
            <p className="text-neutral-300 mb-2">
              This method uses Server-Sent Events (SSE) to provide real-time updates while the agent processes the request.
            </p>
            <div className="bg-[#222] p-4 rounded-md border border-[#444] space-y-2">
              <h4 className="font-medium text-white">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                <li>Partial responses in real-time</li>
                <li>Instant feedback for the user</li>
                <li>Best for chat interfaces and long responses</li>
                <li>Better user experience for complex tasks</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-emerald-400 text-lg font-medium mb-3">Comparison between methods</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#222] border-b border-[#444]">
                  <th className="p-3 text-left text-neutral-300">Feature</th>
                  <th className="p-3 text-left text-neutral-300">tasks/send</th>
                  <th className="p-3 text-left text-neutral-300">tasks/sendSubscribe</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">Response type</td>
                  <td className="p-3 text-neutral-300">Single, complete</td>
                  <td className="p-3 text-neutral-300">Partial event stream</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">Response time</td>
                  <td className="p-3 text-neutral-300">After complete processing</td>
                  <td className="p-3 text-neutral-300">Real-time, partial</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">Implementation complexity</td>
                  <td className="p-3 text-neutral-300">Simple</td>
                  <td className="p-3 text-neutral-300">Moderate</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">UX for long tasks</td>
                  <td className="p-3 text-neutral-300">Worst (long wait)</td>
                  <td className="p-3 text-neutral-300">Better (continuous feedback)</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">Network resource usage</td>
                  <td className="p-3 text-neutral-300">Lower for short responses</td>
                  <td className="p-3 text-neutral-300">More efficient for long responses</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-3 text-neutral-300">Ideal use case</td>
                  <td className="p-3 text-neutral-300">Simple APIs, integrations</td>
                  <td className="p-3 text-neutral-300">Chat interfaces, extensive content</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">JSON-RPC 2.0</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The API uses the JSON-RPC 2.0 protocol for communication with A2A agents.
            A correct JSON-RPC request has the following structure:
          </p>
          <div className="relative">
            <CodeBlock
              text={JSON.stringify({
                jsonrpc: "2.0",
                method: "tasks/send",
                params: {
                  message: {
                    role: "user",
                    parts: [
                      {
                        type: "text",
                        text: "Your question here"
                      }
                    ]
                  },
                  sessionId: "abc-123",
                  id: "task-456"
                },
                id: "call-789"
              }, null, 2)}
              language="json"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 text-white hover:bg-[#333]"
              onClick={() => copyToClipboard(JSON.stringify({
                jsonrpc: "2.0",
                method: "tasks/send",
                params: {
                  message: {
                    role: "user",
                    parts: [
                      {
                        type: "text",
                        text: "Your question here"
                      }
                    ]
                  },
                  sessionId: "abc-123",
                  id: "task-456"
                },
                id: "call-789"
              }, null, 2))}
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">JSON-RPC 2.0 Specification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Required fields:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-[#333] px-1 rounded">jsonrpc</code>: Protocol version (always "2.0")</li>
              <li><code className="bg-[#333] px-1 rounded">method</code>: Method to be called (ex: "tasks/send")</li>
              <li><code className="bg-[#333] px-1 rounded">params</code>: Call parameters</li>
              <li><code className="bg-[#333] px-1 rounded">id</code>: Unique identifier of the call (can be string or number)</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-white">Important notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The request ID will be returned in the response (important for correlation)</li>
              <li>The message format follows the Google A2A protocol</li>
              <li>Agents may support different features, check the Agent Card for more details</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">Response format</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div>
            <h3 className="font-medium text-white mb-2">Success response</h3>
            <div className="relative">
              <CodeBlock
                text={JSON.stringify({
                  jsonrpc: "2.0",
                  result: {
                    status: {
                      message: {
                        parts: [
                          {
                            type: "text",
                            text: "Agent response here..."
                          }
                        ]
                      }
                    }
                  },
                  id: "call-789"
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
                      message: {
                        parts: [
                          {
                            type: "text",
                            text: "Agent response here..."
                          }
                        ]
                      }
                    }
                  },
                  id: "call-789"
                }, null, 2))}
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-2">Error response</h3>
            <div className="relative">
              <CodeBlock
                text={JSON.stringify({
                  jsonrpc: "2.0",
                  error: {
                    code: -32603,
                    message: "Error message"
                  },
                  id: "call-789"
                }, null, 2)}
                language="json"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-[#333]"
                onClick={() => copyToClipboard(JSON.stringify({
                  jsonrpc: "2.0",
                  error: {
                    code: -32603,
                    message: "Error message"
                  },
                  id: "call-789"
                }, null, 2))}
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 