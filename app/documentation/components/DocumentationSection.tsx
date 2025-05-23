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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardCopy, 
  Info, 
  ExternalLink, 
  Users, 
  Shield, 
  Zap, 
  Network,
  FileText,
  MessageSquare,
  Settings,
  AlertCircle,
  CheckCircle2,
  Globe
} from "lucide-react";
import { CodeBlock } from "@/app/documentation/components/CodeBlock";

interface DocumentationSectionProps {
  copyToClipboard: (text: string) => void;
}

export function DocumentationSection({ copyToClipboard }: DocumentationSectionProps) {
  const quickStartExample = {
    jsonrpc: "2.0",
    id: "req-001",
    method: "message/send",
    params: {
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: "Hello! Can you help me analyze this data?"
          }
        ],
        messageId: "6dbc13b5-bd57-4c2b-b503-24e381b6c8d6"
      }
    }
  };

  const streamingExample = {
    jsonrpc: "2.0", 
    id: "req-002",
    method: "message/stream",
    params: {
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: "Generate a detailed report on market trends"
          }
        ],
        messageId: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
      }
    }
  };

  const fileUploadExample = {
    jsonrpc: "2.0",
    id: "req-003", 
    method: "message/send",
    params: {
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: "Analyze this image and highlight any faces."
          },
          {
            type: "file",
            file: {
              name: "input_image.png",
              mimeType: "image/png",
              bytes: "iVBORw0KGgoAAAANSUhEUgAAAAUA..." 
            }
          }
        ],
        messageId: "8f0dc03c-4c65-4a14-9b56-7e8b9f2d1a3c"
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/20 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-emerald-500/20 px-4 py-2 rounded-full">
              <Network className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-emerald-400">Agent2Agent Protocol</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            The Standard for AI Agent Communication
          </CardTitle>
          <p className="text-lg text-neutral-300 mt-4 max-w-3xl mx-auto">
            A2A is Google's open protocol enabling seamless communication and interoperability 
            between AI agents across different platforms, providers, and architectures.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a 
              href="https://google.github.io/A2A/specification" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 mr-2 text-emerald-400" />
              <span className="text-emerald-400">Official Specification</span>
              <ExternalLink className="h-3 w-3 ml-2 text-emerald-400" />
            </a>
            <a 
              href="https://github.com/google/A2A" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-blue-400">GitHub Repository</span>
              <ExternalLink className="h-3 w-3 ml-2 text-blue-400" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Key Features & Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Multi-turn Conversations</h3>
                <p className="text-sm text-neutral-400">Support for complex, contextual dialogues between agents</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">File Exchange</h3>
                <p className="text-sm text-neutral-400">Upload and download files with proper MIME type handling</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-time Streaming</h3>
                <p className="text-sm text-neutral-400">Server-Sent Events for live response streaming</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Task Management</h3>
                <p className="text-sm text-neutral-400">Track, query, and cancel long-running tasks</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Enterprise Security</h3>
                <p className="text-sm text-neutral-400">Bearer tokens, API keys, and HTTPS enforcement</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Agent Discovery</h3>
                <p className="text-sm text-neutral-400">Standardized agent cards for capability discovery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protocol Methods */}
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">Protocol Methods</CardTitle>
          <p className="text-neutral-400">A2A supports multiple RPC methods for different interaction patterns</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messaging" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#222] border-[#444]">
              <TabsTrigger value="messaging" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Messaging
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Task Management
              </TabsTrigger>
              <TabsTrigger value="discovery" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Discovery
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messaging" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#222] p-4 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="border-emerald-500 text-emerald-400">message/send</Badge>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Standard HTTP Request</h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    Send a message and receive a complete response after processing is finished.
                  </p>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>• Single request/response cycle</li>
                    <li>• Best for simple queries</li>
                    <li>• Lower complexity implementation</li>
                    <li>• Synchronous operation</li>
                  </ul>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="border-blue-500 text-blue-400">message/stream</Badge>
                    <Zap className="h-4 w-4 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Real-time Streaming</h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    Receive partial responses in real-time via Server-Sent Events.
                  </p>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>• Progressive response delivery</li>
                    <li>• Better UX for long tasks</li>
                    <li>• Live status updates</li>
                    <li>• Asynchronous operation</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#222] p-4 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="border-purple-500 text-purple-400">tasks/get</Badge>
                    <Settings className="h-4 w-4 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Query Task Status</h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    Check the status, progress, and results of a specific task.
                  </p>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>• Real-time status checking</li>
                    <li>• Progress monitoring</li>
                    <li>• Result retrieval</li>
                    <li>• Error diagnosis</li>
                  </ul>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="border-red-500 text-red-400">tasks/cancel</Badge>
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Cancel Task</h4>
                  <p className="text-sm text-neutral-400 mb-3">
                    Terminate a running task before completion.
                  </p>
                  <ul className="text-xs text-neutral-400 space-y-1">
                    <li>• Graceful task termination</li>
                    <li>• Resource cleanup</li>
                    <li>• Cost optimization</li>
                    <li>• User control</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discovery" className="space-y-4">
              <div className="bg-[#222] p-4 rounded-lg border border-[#444]">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="border-green-500 text-green-400">agent/authenticatedExtendedCard</Badge>
                  <Users className="h-4 w-4 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Agent Discovery</h4>
                <p className="text-sm text-neutral-400 mb-3">
                  Retrieve detailed information about agent capabilities, skills, and requirements.
                </p>
                <ul className="text-xs text-neutral-400 space-y-1">
                  <li>• Agent capability discovery</li>
                  <li>• Skill and tool enumeration</li>
                  <li>• Authentication requirements</li>
                  <li>• API version compatibility</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400">Quick Start Examples</CardTitle>
          <p className="text-neutral-400">Ready-to-use JSON-RPC examples based on the official A2A specification</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#222] border-[#444]">
              <TabsTrigger value="basic" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Basic Message
              </TabsTrigger>
              <TabsTrigger value="streaming" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Streaming
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                File Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify(quickStartExample, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify(quickStartExample, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-400 font-medium">Key Points:</p>
                    <ul className="text-blue-300 mt-1 space-y-1">
                      <li>• Uses <code className="bg-blue-500/20 px-1 rounded">message/send</code> for standard HTTP requests</li>
                      <li>• <code className="bg-blue-500/20 px-1 rounded">messageId</code> must be a valid UUID v4</li>
                      <li>• Response contains task ID, status, and artifacts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="streaming" className="space-y-4">
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify(streamingExample, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify(streamingExample, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-purple-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-purple-400 font-medium">Streaming Features:</p>
                    <ul className="text-purple-300 mt-1 space-y-1">
                      <li>• Real-time Server-Sent Events (SSE)</li>
                      <li>• Progressive content delivery</li>
                      <li>• Status updates: submitted → working → completed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <div className="relative">
                <CodeBlock
                  text={JSON.stringify(fileUploadExample, null, 2)}
                  language="json"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(JSON.stringify(fileUploadExample, null, 2))}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-green-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-green-400 font-medium">File Handling:</p>
                    <ul className="text-green-300 mt-1 space-y-1">
                      <li>• Support for multiple file types (images, documents, etc.)</li>
                      <li>• Base64 encoding for binary data</li>
                      <li>• Proper MIME type specification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Security & Best Practices */}
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-emerald-400" />
                Authentication Methods
              </h3>
              <div className="space-y-3">
                <div className="bg-[#222] p-3 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-2">
                    <code className="text-emerald-400 text-sm">x-api-key</code>
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-xs text-neutral-400">Custom header for API key authentication</p>
                </div>
                <div className="bg-[#222] p-3 rounded-lg border border-[#444]">
                  <div className="flex items-center space-x-2 mb-2">
                    <code className="text-blue-400 text-sm">Authorization: Bearer</code>
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                  </div>
                  <p className="text-xs text-neutral-400">OAuth 2.0 Bearer token authentication</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-orange-400" />
                Security Requirements
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <span className="text-neutral-300">HTTPS/TLS encryption required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <span className="text-neutral-300">Input validation on all parameters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <span className="text-neutral-300">Rate limiting and resource controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <span className="text-neutral-300">Proper CORS configuration</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-400 font-medium">Important:</p>
                <p className="text-amber-300 mt-1">
                  Always obtain API credentials out-of-band. Never include sensitive authentication 
                  data in client-side code or version control systems.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* A2A vs MCP */}
      <Card className="bg-[#1a1a1a] border-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Network className="h-5 w-5 mr-2" />
            A2A vs Model Context Protocol (MCP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#222] border-b border-[#444]">
                  <th className="p-4 text-left text-neutral-300">Aspect</th>
                  <th className="p-4 text-left text-emerald-400">Agent2Agent (A2A)</th>
                  <th className="p-4 text-left text-blue-400">Model Context Protocol (MCP)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#333]">
                  <td className="p-4 text-neutral-300 font-medium">Purpose</td>
                  <td className="p-4 text-neutral-300">Agent-to-agent communication</td>
                  <td className="p-4 text-neutral-300">Model-to-tool/resource integration</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-4 text-neutral-300 font-medium">Use Case</td>
                  <td className="p-4 text-neutral-300">AI agents collaborating as peers</td>
                  <td className="p-4 text-neutral-300">AI models accessing external capabilities</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-4 text-neutral-300 font-medium">Relationship</td>
                  <td className="p-4 text-neutral-300">Partner/delegate work</td>
                  <td className="p-4 text-neutral-300">Use specific capabilities</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="p-4 text-neutral-300 font-medium">Integration</td>
                  <td className="p-4 text-neutral-300 text-emerald-400">✓ Can use MCP internally</td>
                  <td className="p-4 text-neutral-300 text-blue-400">✓ Complements A2A</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Working Together:</strong> An A2A client agent might request an A2A server agent to perform a complex task. 
              The server agent, in turn, might use MCP to interact with tools, APIs, or data sources necessary to fulfill the A2A task.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 