/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/page.tsx                                           │
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

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Code, BookOpen, FlaskConical, Network, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

import { DocumentationSection } from "./components/DocumentationSection";
import { TechnicalDetailsSection } from "./components/TechnicalDetailsSection";
import { FrontendImplementationSection } from "./components/FrontendImplementationSection";
import { CodeBlock } from "./components/CodeBlock";
import { CodeExamplesSection } from "./components/CodeExamplesSection";
import { HttpLabForm } from "./components/HttpLabForm";
import { StreamLabForm } from "./components/StreamLabForm";
import { LabSection } from "./components/LabSection";
import { A2AComplianceCard } from "./components/A2AComplianceCard";
import { QuickStartTemplates } from "./components/QuickStartTemplates";

function DocumentationContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const agentUrlParam = searchParams.get("agent_url");
  const apiKeyParam = searchParams.get("api_key");

  const [agentUrl, setAgentUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState(
    `session-${Math.random().toString(36).substring(2, 9)}`
  );
  const [taskId, setTaskId] = useState(
    `task-${Math.random().toString(36).substring(2, 9)}`
  );
  const [callId, setCallId] = useState(
    `call-${Math.random().toString(36).substring(2, 9)}`
  );
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mainTab, setMainTab] = useState("docs");
  const [labMode, setLabMode] = useState("http");
  const [a2aMethod, setA2aMethod] = useState("message/send");
  const [authMethod, setAuthMethod] = useState("api-key");

  // Streaming states
  const [streamResponse, setStreamResponse] = useState("");
  const [streamStatus, setStreamStatus] = useState("");
  const [streamHistory, setStreamHistory] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);

  // Task management states
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<any>(null);
  const [artifacts, setArtifacts] = useState<any[]>([]);

  // Debug state
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // Files state
  const [attachedFiles, setAttachedFiles] = useState<
    { name: string; type: string; size: number; base64: string }[]
  >([]);

  // Conversation history state for multi-turn conversations
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [contextId, setContextId] = useState<string | null>(null);

  // Push notifications state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [enableWebhooks, setEnableWebhooks] = useState(false);

  // Advanced error handling state
  const [showDetailedErrors, setShowDetailedErrors] = useState(true);

  // Lab UI visibility states
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [showCorsInfo, setShowCorsInfo] = useState(false);
  const [showConfigStatus, setShowConfigStatus] = useState(true);

  // Types for A2A messages
  interface MessagePart {
    type: string;
    text?: string;
    file?: {
      name: string;
      bytes: string;
    };
  }

  interface TextPart {
    type: "text";
    text: string;
  }

  interface FilePart {
    type: "file";
    file: {
      name: string;
      bytes: string;
    };
  }

  type MessagePartType = TextPart | FilePart;

  useEffect(() => {
    if (agentUrlParam) {
      setAgentUrl(agentUrlParam);
    }
    if (apiKeyParam) {
      setApiKey(apiKeyParam);
    }
    // Generate initial UUIDs
    generateNewIds();
    
    // Check for hash in URL to auto-switch to lab tab
    if (typeof window !== 'undefined' && window.location.hash === '#lab') {
      setMainTab('lab');
    }
  }, [agentUrlParam, apiKeyParam]);

  // Generate UUID v4 as required by A2A spec
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Generate new IDs
  const generateNewIds = () => {
    setTaskId(generateUUID());
    setCallId(`req-${Math.random().toString(36).substring(2, 9)}`);
  };

  // Clear conversation history
  const clearHistory = () => {
    setConversationHistory([]);
    setContextId(null);
    addDebugLog("Conversation history and contextId cleared");
    toast({
      title: "History Cleared",
      description: "Conversation context has been reset for new multi-turn conversation.",
    });
  };

  // Handle template selection
  const handleTemplateSelection = (template: any) => {
    setA2aMethod(template.method);
    setMessage(template.message);
    generateNewIds();
    
    // Show success toast
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied successfully.`,
    });
  };

  const isFilePart = (part: any): part is FilePart => {
    return part.type === "file" && part.file !== undefined;
  };

  // Create A2A-compliant request based on selected method
  const createA2ARequest = () => {
    const currentMessage = {
      role: "user",
      parts: [
        ...(message
          ? [
              {
                type: "text",
                text: message,
              },
            ]
          : [
              {
                type: "text",
                text: "What is the A2A protocol?",
              },
            ]),
        ...attachedFiles.map((file) => ({
          type: "file",
          file: {
            name: file.name,
            mimeType: file.type, // Use mimeType as per A2A spec
            bytes: file.base64,
          },
        })),
      ],
      messageId: taskId, // Use UUID as required by A2A spec
    };

    // Include contextId for multi-turn conversations (A2A specification)
    const messageWithContext = contextId 
      ? {
          contextId: contextId,
          message: currentMessage
        }
      : {
          message: currentMessage
        };

    // Add push notification configuration if enabled (for message methods)
    const messageParamsWithPushConfig = (a2aMethod === "message/send" || a2aMethod === "message/stream") && enableWebhooks && webhookUrl
      ? {
          ...messageWithContext,
          pushNotificationConfig: {
            webhookUrl: webhookUrl,
            webhookAuthenticationInfo: {
              type: "none"
            }
          }
        }
      : messageWithContext;

    const baseRequest = {
      jsonrpc: "2.0",
      id: callId,
      method: a2aMethod,
    };

    switch (a2aMethod) {
      case "message/send":
      case "message/stream":
        return {
          ...baseRequest,
          params: messageParamsWithPushConfig,
        };
      
      case "tasks/get":
        return {
          ...baseRequest,
          params: {
            taskId: currentTaskId || taskId,
          },
        };
      
      case "tasks/cancel":
        return {
          ...baseRequest,
          params: {
            taskId: currentTaskId || taskId,
          },
        };

      case "tasks/pushNotificationConfig/set":
        return {
          ...baseRequest,
          params: {
            taskId: currentTaskId || taskId,
            pushNotificationConfig: enableWebhooks && webhookUrl ? {
              webhookUrl: webhookUrl,
              webhookAuthenticationInfo: {
                type: "none"
              }
            } : null,
          },
        };

      case "tasks/pushNotificationConfig/get":
        return {
          ...baseRequest,
          params: {
            taskId: currentTaskId || taskId,
          },
        };

      case "tasks/resubscribe":
        return {
          ...baseRequest,
          params: {
            taskId: currentTaskId || taskId,
          },
        };
      
      case "agent/authenticatedExtendedCard":
        return {
          ...baseRequest,
          params: {},
        };
      
      default:
        return {
          ...baseRequest,
          params: messageParamsWithPushConfig,
        };
    }
  };

  // Standard HTTP request
  const jsonRpcRequest = createA2ARequest();

  // Streaming request (same as standard but with stream method)
  const streamRpcRequest = {
    ...createA2ARequest(),
    method: "message/stream",
  };

  // Code examples
  const curlExample = `curl -X POST \\
  ${agentUrl || "http://localhost:8000/api/v1/a2a/your-agent-id"} \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: ${apiKey || "your-api-key"}' \\
  -d '${JSON.stringify(jsonRpcRequest, null, 2)}'`;

  const fetchExample = `async function testA2AAgent() {
  const response = await fetch(
    '${agentUrl || "http://localhost:8000/api/v1/a2a/your-agent-id"}',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '${apiKey || "your-api-key"}'
      },
      body: JSON.stringify(${JSON.stringify(jsonRpcRequest, null, 2)})
    }
  );
  
  const data = await response.json();
  console.log('Agent response:', data);
}`;

  // Function to add debug logs
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].substring(0, 8);
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG] ${message}`);
  };

  // Standard HTTP request method
  const sendRequest = async () => {
    if (!agentUrl) {
      toast({
        title: "Agent URL required",
        description: "Please enter the agent URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    addDebugLog("=== Starting A2A Request ===");
    addDebugLog("Sending A2A request to: " + agentUrl);
    addDebugLog(`Method: ${a2aMethod}`);
    addDebugLog(`Authentication: ${authMethod}`);
    addDebugLog("Note: Browser may send OPTIONS preflight request first (CORS)");
    addDebugLog(
      `Payload: ${JSON.stringify({
        ...jsonRpcRequest,
        params: jsonRpcRequest.params && 'message' in jsonRpcRequest.params && jsonRpcRequest.params.message ? {
          ...jsonRpcRequest.params,
          message: {
            ...jsonRpcRequest.params.message,
            parts: jsonRpcRequest.params.message.parts.map((part: any) =>
              isFilePart(part)
                ? {
                    ...part,
                    file: { ...part.file, bytes: "BASE64_DATA_TRUNCATED" },
                  }
                : part
            ),
          },
        } : jsonRpcRequest.params,
      })}`
    );

    if (attachedFiles.length > 0) {
      addDebugLog(
        `Sending ${attachedFiles.length} file(s): ${attachedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
    }

    try {
      // Prepare headers based on authentication method
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey) {
        if (authMethod === "bearer") {
          headers["Authorization"] = `Bearer ${apiKey}`;
        } else {
          headers["x-api-key"] = apiKey;
        }
      }

      addDebugLog(`Headers: ${JSON.stringify(headers, null, 2)}`);
      addDebugLog("Making POST request...");

      const response = await fetch(agentUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(jsonRpcRequest),
      });

      addDebugLog(`Response status: ${response.status} ${response.statusText}`);
      addDebugLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);

      if (!response.ok) {
        const errorText = await response.text();
        addDebugLog(`HTTP error: ${response.status} ${response.statusText}`);
        addDebugLog(`Error response: ${errorText}`);
        throw new Error(
          `HTTP error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      addDebugLog("Successfully received A2A response");
      addDebugLog(`Response data: ${JSON.stringify(data, null, 2).substring(0, 500)}...`);
      
      // Handle A2A-specific response structure
      if (data.result) {
        const result = data.result;
        
        // Update task information if available
        if (result.id) {
          setCurrentTaskId(result.id);
          addDebugLog(`Task ID: ${result.id}`);
        }
        
        // Update task status if available
        if (result.status) {
          setTaskStatus(result.status);
          addDebugLog(`Task status: ${result.status.state}`);
        }
        
        // Update artifacts if available
        if (result.artifacts && Array.isArray(result.artifacts)) {
          setArtifacts(result.artifacts);
          addDebugLog(`Received ${result.artifacts.length} artifact(s)`);
        }

        // Extract contextId from response for multi-turn conversations (A2A spec)
        if (result.contextId) {
          setContextId(result.contextId);
          addDebugLog(`Context ID: ${result.contextId}`);
        }

        // Maintain local conversation history for UI display only
        if (a2aMethod === "message/send" || a2aMethod === "message/stream") {
          const userMessage = {
            role: "user",
            parts: [
              ...(message
                ? [{ type: "text", text: message }]
                : [{ type: "text", text: "What is the A2A protocol?" }]
              ),
              ...attachedFiles.map((file) => ({
                type: "file",
                file: {
                  name: file.name,
                  mimeType: file.type,
                  bytes: file.base64,
                },
              })),
            ],
            messageId: taskId,
          };

          const assistantMessage = result.status?.message || {
            role: "assistant",
            parts: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            messageId: generateUUID(),
          };

          setConversationHistory(prev => [...prev, userMessage, assistantMessage]);
          addDebugLog(`Context preserved via contextId. Local history: ${conversationHistory.length + 2} messages`);
        }
      }
      
      setResponse(JSON.stringify(data, null, 2));
      setAttachedFiles([]); // Clear attached files after successful request
      addDebugLog("=== A2A Request Completed Successfully ===");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addDebugLog(`Request failed: ${errorMsg}`);
      addDebugLog("=== A2A Request Failed ===");
      
      // Enhanced error handling for A2A protocol
      if (showDetailedErrors) {
        let detailedError = errorMsg;
        
        // Try to extract A2A-specific error information
        if (error instanceof Error && error.message.includes("HTTP error:")) {
          detailedError = `A2A Protocol Error: ${errorMsg}`;
          
          // Common A2A error scenarios
          if (errorMsg.includes("400")) {
            detailedError += "\n\nPossible causes:\n• Invalid JSON-RPC 2.0 format\n• Missing required A2A parameters\n• Malformed message structure";
          } else if (errorMsg.includes("401")) {
            detailedError += "\n\nAuthentication Error:\n• Invalid API key\n• Missing authentication header\n• Expired bearer token";
          } else if (errorMsg.includes("404")) {
            detailedError += "\n\nAgent Not Found:\n• Incorrect agent URL\n• Agent not deployed\n• Invalid endpoint path";
          } else if (errorMsg.includes("500")) {
            detailedError += "\n\nServer Error:\n• Agent internal error\n• A2A method not implemented\n• Processing failure";
          }
        }
        
        toast({
          title: "A2A Request Failed",
          description: detailedError,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error sending A2A request",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to process event stream
  const processEventStream = async (response: Response) => {
    try {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      addDebugLog("Starting event stream processing...");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          addDebugLog("Stream finished by server");
          setStreamComplete(true);
          setIsStreaming(false);
          break;
        }

        // Decode chunk of data
        const chunk = decoder.decode(value, { stream: true });
        addDebugLog(`Received chunk (${value.length} bytes)`);

        // Add to buffer
        buffer += chunk;

        // Process complete events in buffer
        // We use regex to identify complete "data:" events
        // A complete SSE event ends with two newlines (\n\n)
        const regex = /data:\s*({.*?})\s*(?:\n\n|\r\n\r\n)/g;

        let match;
        let processedPosition = 0;

        // Extract all complete "data:" events
        while ((match = regex.exec(buffer)) !== null) {
          const jsonStr = match[1].trim();
          addDebugLog(`Complete event found: ${jsonStr.substring(0, 50)}...`);

          try {
            // Process the JSON of the event
            const data = JSON.parse(jsonStr);

            // Add to history
            setStreamHistory((prev) => [...prev, jsonStr]);

            // Process the data obtained
            processStreamData(data);

            // Update the processed position to remove from buffer after
            processedPosition = match.index + match[0].length;
          } catch (jsonError) {
            addDebugLog(`Error processing JSON: ${jsonError}`);
            // Continue processing other events even with error in one of them
          }
        }

        // Remove the processed part of the buffer
        if (processedPosition > 0) {
          buffer = buffer.substring(processedPosition);
        }

        // Check if the buffer is too large (indicates invalid data)
        if (buffer.length > 10000) {
          addDebugLog("Buffer too large, clearing old data");
          // Keep only the last part of the buffer that may contain a partial event
          buffer = buffer.substring(buffer.length - 5000);
        }

        // Remove ping events from buffer
        if (buffer.includes(": ping")) {
          addDebugLog("Ping event detected, clearing buffer");
          buffer = buffer.replace(/:\s*ping.*?(?:\n\n|\r\n\r\n)/g, "");
        }
      }
    } catch (streamError) {
      const errorMsg =
        streamError instanceof Error ? streamError.message : "Unknown error";
      addDebugLog(`Error processing stream: ${errorMsg}`);
      console.error("Error processing stream:", streamError);
      toast({
        title: "Error processing stream",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  // Process a received streaming event
  const processStreamData = (data: any) => {
    // Add log to see the complete structure of the data
    addDebugLog(
      `Processing A2A stream data: ${JSON.stringify(data).substring(0, 100)}...`
    );

    // Validate if data follows the JSON-RPC 2.0 format
    if (!data.jsonrpc || data.jsonrpc !== "2.0" || !data.result) {
      addDebugLog("Invalid A2A event format, ignoring");
      return;
    }

    const result = data.result;

    // Handle A2A Task object structure
    if (result.id) {
      setCurrentTaskId(result.id);
      addDebugLog(`Task ID: ${result.id}`);
    }

    // Process A2A TaskStatus object
    if (result.status) {
      const status = result.status;
      const state = status.state;

      addDebugLog(`A2A Task status: ${state}`);
      setStreamStatus(state);
      setTaskStatus(status);

      // Process message from status if available
      if (status.message && status.message.parts) {
        const textParts = status.message.parts.filter(
          (part: any) => part.type === "text" && part.text
        );

        if (textParts.length > 0) {
          const currentMessageText = textParts
            .map((part: any) => part.text)
            .join("");

          addDebugLog(
            `A2A message text: "${currentMessageText.substring(0, 50)}${
              currentMessageText.length > 50 ? "..." : ""
            }"`
          );

          if (currentMessageText.trim()) {
            setStreamResponse(currentMessageText);
          }
        }
      }

      // Check if task is completed according to A2A spec
      if (state === "completed" || state === "failed" || state === "canceled") {
        addDebugLog(`A2A Task ${state}`);
        setStreamComplete(true);
        setIsStreaming(false);
      }
    }

    // Process A2A Artifact objects
    if (result.artifacts && Array.isArray(result.artifacts)) {
      addDebugLog(`Received ${result.artifacts.length} A2A artifact(s)`);
      setArtifacts(result.artifacts);

      // Extract text content from artifacts
      result.artifacts.forEach((artifact: any, index: number) => {
        if (artifact.parts && artifact.parts.length > 0) {
          const textParts = artifact.parts.filter(
            (part: any) => part.type === "text" && part.text
          );

          if (textParts.length > 0) {
            const artifactText = textParts.map((part: any) => part.text).join("");

            addDebugLog(
              `A2A Artifact ${index + 1} text: "${artifactText.substring(0, 50)}${
                artifactText.length > 50 ? "..." : ""
              }"`
            );

            if (artifactText.trim()) {
              // Update response with the artifact content
              setStreamResponse(prev => prev ? `${prev}\n\n${artifactText}` : artifactText);
            }
          }
        }
      });
    }

    // Handle TaskStatusUpdateEvent and TaskArtifactUpdateEvent as per A2A spec
    if (result.event) {
      const eventType = result.event;
      addDebugLog(`A2A Event type: ${eventType}`);

      if (eventType === "task.status.update" && result.status) {
        // Already handled above
      } else if (eventType === "task.artifact.update" && result.artifact) {
        // Handle single artifact update
        addDebugLog("Processing A2A artifact update event");
        
        if (result.artifact.parts && result.artifact.parts.length > 0) {
          const textParts = result.artifact.parts.filter(
            (part: any) => part.type === "text" && part.text
          );

          if (textParts.length > 0) {
            const artifactText = textParts.map((part: any) => part.text).join("");
            
            if (artifactText.trim()) {
              setStreamResponse(prev => prev ? `${prev}${artifactText}` : artifactText);
              
              // Check if this is the last chunk
              if (result.artifact.lastChunk === true) {
                addDebugLog("Last chunk of A2A artifact received");
                setStreamComplete(true);
                setIsStreaming(false);
              }
            }
          }
        }
      }
    }

    // Check for final flag as per A2A spec
    if (result.final === true) {
      addDebugLog("Final A2A event received");
      setStreamComplete(true);
      setIsStreaming(false);
    }
  };

  // Stream request with EventSource
  const sendStreamRequestWithEventSource = async () => {
    if (!agentUrl) {
      toast({
        title: "Agent URL required",
        description: "Please enter the agent URL",
        variant: "destructive",
      });
      return;
    }

    setIsStreaming(true);
    setStreamResponse("");
    setStreamHistory([]);
    setStreamStatus("submitted");
    setStreamComplete(false);

    // Log debug info
    addDebugLog("Setting up A2A streaming to: " + agentUrl);
    addDebugLog(`Streaming method: message/stream`);
    addDebugLog(`Authentication: ${authMethod}`);
    addDebugLog(
      `Streaming payload: ${JSON.stringify({
        ...streamRpcRequest,
        params: streamRpcRequest.params && 'message' in streamRpcRequest.params && streamRpcRequest.params.message ? {
          ...streamRpcRequest.params,
          message: {
            ...streamRpcRequest.params.message,
            parts: streamRpcRequest.params.message.parts.map((part: any) =>
              isFilePart(part)
                ? {
                    ...part,
                    file: { ...part.file, bytes: "BASE64_DATA_TRUNCATED" },
                  }
                : part
            ),
          },
        } : streamRpcRequest.params,
      })}`
    );

    if (attachedFiles.length > 0) {
      addDebugLog(
        `Streaming with ${attachedFiles.length} file(s): ${attachedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
    }

    try {
      addDebugLog("Stream URL: " + agentUrl);

      // Prepare headers based on authentication method
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey) {
        if (authMethod === "bearer") {
          headers["Authorization"] = `Bearer ${apiKey}`;
        } else {
          headers["x-api-key"] = apiKey;
        }
      }

      // Make initial request to start streaming session
      const initialResponse = await fetch(agentUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(streamRpcRequest),
      });

      // Verificar o content-type da resposta
      const contentType = initialResponse.headers.get("Content-Type");
      addDebugLog(`Response content type: ${contentType || "not specified"}`);

      if (contentType && contentType.includes("text/event-stream")) {
        // É uma resposta SSE (Server-Sent Events)
        addDebugLog("Detected SSE response, processing stream directly");
        processEventStream(initialResponse);
        return;
      }

      if (!initialResponse.ok) {
        const errorText = await initialResponse.text();
        addDebugLog(
          `HTTP error: ${initialResponse.status} ${initialResponse.statusText}`
        );
        addDebugLog(`Error response: ${errorText}`);
        throw new Error(
          `HTTP error: ${initialResponse.status} ${initialResponse.statusText}`
        );
      }

      // Get the initial response data
      try {
        const responseText = await initialResponse.text();

        // Verificar se a resposta começa com "data:", o que indica um SSE
        if (responseText.trim().startsWith("data:")) {
          addDebugLog("Response has SSE format but wrong content-type");
          // Criar uma resposta sintética para processar como stream
          const syntheticResponse = new Response(responseText, {
            headers: {
              "Content-Type": "text/event-stream",
            },
          });
          processEventStream(syntheticResponse);
          return;
        }

        // Tentar processar como JSON
        const initialData = JSON.parse(responseText);
        addDebugLog("Initial stream response: " + JSON.stringify(initialData));

        // Display initial response
        displayInitialResponse(initialData);

        // Get task ID from response if present
        const responseTaskId = extractTaskId(initialData);

        if (responseTaskId) {
          addDebugLog(`Using task ID from response: ${responseTaskId}`);
          // Setup EventSource for streaming updates
          setupEventSource(agentUrl + "?taskId=" + responseTaskId);
        } else {
          setIsStreaming(false);
          setStreamComplete(true);
          setStreamStatus("completed");
          addDebugLog("No task ID in response, streaming ended");
        }
      } catch (parseError) {
        addDebugLog(`Error parsing response: ${parseError}`);

        // Se não conseguimos processar como JSON ou SSE, mostrar o erro
        setStreamResponse(
          `Error: Unable to process response: ${parseError instanceof Error ? parseError.message : String(parseError)}`
        );
        setIsStreaming(false);
        setStreamStatus("failed");
        setStreamComplete(true);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setIsStreaming(false);
      setStreamStatus("failed");
      addDebugLog(`Stream request failed: ${errorMsg}`);
      toast({
        title: "Error setting up stream",
        description: errorMsg,
        variant: "destructive",
      });
    }

    // Clear attached files after sending
    setAttachedFiles([]);
  };

  const ensureTrailingSlash = (path: string) => {
    return path.endsWith("/") ? path : path + "/";
  };

  // Function to extract task ID from different response formats
  const extractTaskId = (data: any): string | null => {
    // Try different possible paths for the task ID
    const possiblePaths = [
      data?.result?.id,
      data?.result?.status?.id,
      data?.result?.task?.id,
      data?.id,
      data?.task_id,
      data?.taskId,
    ];

    for (const path of possiblePaths) {
      if (path && typeof path === "string") {
        return path;
      }
    }

    // If no specific ID is found, try using the request ID as fallback
    return taskId;
  };

  // Configure and start the EventSource
  const setupEventSource = (url: string) => {
    addDebugLog(`Configuring EventSource for: ${url}`);

    // Ensure any previous EventSource is closed
    let eventSource: EventSource;

    try {
      // Create EventSource for streaming
      eventSource = new EventSource(url);

      addDebugLog("EventSource created and connecting...");

      // For debugging all events
      eventSource.onopen = () => {
        addDebugLog("EventSource connected successfully");
      };

      // Process received SSE events
      eventSource.onmessage = (event) => {
        addDebugLog(
          `Received event [${new Date().toISOString()}]: ${event.data.substring(
            0,
            50
          )}...`
        );

        try {
          const data = JSON.parse(event.data);
          setStreamHistory((prev) => [...prev, event.data]);

          // If the event is empty or has no relevant data, ignore it
          if (!data || (!data.result && !data.status && !data.message)) {
            addDebugLog("Event without relevant data");
            return;
          }

          // Process data according to the type
          processStreamData(data);
        } catch (jsonError) {
          const errorMsg =
            jsonError instanceof Error ? jsonError.message : "Unknown error";
          addDebugLog(`Error processing JSON: ${errorMsg}`);
          console.error("Error processing JSON:", jsonError);
        }
      };

      // Handle errors
      eventSource.onerror = (error) => {
        addDebugLog(`Error in EventSource: ${JSON.stringify(error)}`);
        console.error("EventSource error:", error);

        // Don't close automatically - try to reconnect unless it's a fatal error
        if (eventSource.readyState === EventSource.CLOSED) {
          addDebugLog("EventSource closed due to error");
          toast({
            title: "Streaming Error",
            description: "Connection to server was interrupted",
            variant: "destructive",
          });

          setIsStreaming(false);
          setStreamComplete(true);
        } else {
          addDebugLog("EventSource attempting to reconnect...");
        }
      };

      const checkStreamStatus = setInterval(() => {
        if (streamComplete) {
          addDebugLog("Stream marked as complete, closing EventSource");
          eventSource.close();
          clearInterval(checkStreamStatus);
        }
      }, 1000);
    } catch (esError) {
      addDebugLog(`Error creating EventSource: ${esError}`);
      throw esError;
    }
  };

  const displayInitialResponse = (data: any) => {
    addDebugLog("Displaying initial response without streaming");

    // Try to extract text message if available
    try {
      const result = data.result || data;
      const status = result.status || {};
      const message = status.message || result.message;

      if (message && message.parts) {
        const parts = message.parts.filter((part: any) => part.type === "text");

        if (parts.length > 0) {
          const currentText = parts.map((part: any) => part.text).join("");
          setStreamResponse(currentText);
        } else {
          // No text parts, display formatted JSON
          setStreamResponse(JSON.stringify(data, null, 2));
        }
      } else {
        // No structured message, display formatted JSON
        setStreamResponse(JSON.stringify(data, null, 2));
      }

      // Set status as completed
      setStreamStatus("completed");
      setStreamComplete(true);
    } catch (parseError) {
      // In case of error processing, show raw JSON
      setStreamResponse(JSON.stringify(data, null, 2));
      setStreamStatus("completed");
      setStreamComplete(true);
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  // Render status indicator based on streaming status
  const renderStatusIndicator = () => {
    switch (streamStatus) {
      case "submitted":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Submitted
          </span>
        );
      case "working":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
            Canceled
          </span>
        );
      case "input-required":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Input Required
          </span>
        );
      default:
        return null;
    }
  };

  // Typing indicator for streaming
  const renderTypingIndicator = () => {
    if (streamStatus === "working" && !streamComplete) {
      return (
        <div className="flex items-center space-x-1 mt-2 text-neutral-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div
            className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 bg-[#121212] min-h-screen">
      {/* Modern Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-6 py-3 rounded-full border border-emerald-500/30">
            <Network className="h-6 w-6 text-emerald-400" />
            <span className="font-bold text-emerald-400">A2A Protocol</span>
            <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">v0.2.1</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Agent2Agent Protocol
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Documentation and testing lab for the official Google Agent2Agent protocol.
          Build, test, and validate A2A-compliant agent communications.
        </p>
      </div>

      <Tabs
        defaultValue="docs"
        className="w-full mb-8"
        onValueChange={setMainTab}
      >
        <TabsList className="bg-[#121212] w-full mb-6 p-1 rounded-lg grid grid-cols-3">
          <TabsTrigger
            value="docs"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/50 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Documentation</div>
              <div className="text-xs opacity-70">Protocol specification & compliance</div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="lab"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/50 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all"
          >
            <FlaskConical className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Testing Lab</div>
              <div className="text-xs opacity-70">Interactive A2A protocol testing</div>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="examples"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/50 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all"
          >
            <Code className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Code Examples</div>
              <div className="text-xs opacity-70">Implementation samples & snippets</div>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Documentation Tab - Only essential technical concepts and details */}
        <TabsContent value="docs">
          <div className="space-y-6">
            {/* A2A Compliance Card */}
            <A2AComplianceCard />
            
            {/* Main Documentation */}
            <DocumentationSection copyToClipboard={copyToClipboard} />
          </div>
        </TabsContent>

        {/* Lab Tab */}
        <TabsContent value="lab">
          {/* Quick Start Templates */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-[#222]/30 p-3 rounded-lg transition-colors border border-transparent hover:border-[#333]"
              onClick={() => setShowQuickStart(!showQuickStart)}
            >
              <h3 className="text-white font-semibold flex items-center">
                <FlaskConical className="h-4 w-4 mr-2 text-purple-400" />
                Quick Start Templates
                <span className="ml-2 text-purple-400 text-sm">(4 templates available)</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">
                  {showQuickStart ? 'Hide templates' : 'Show templates'}
                </span>
                {showQuickStart ? (
                  <ChevronUp className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                )}
              </div>
            </div>
            
            {showQuickStart && (
              <QuickStartTemplates onSelectTemplate={handleTemplateSelection} />
            )}
          </div>
          
          {/* CORS Information */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-[#222]/30 p-3 rounded-lg transition-colors border border-transparent hover:border-[#333]"
              onClick={() => setShowCorsInfo(!showCorsInfo)}
            >
              <h3 className="text-orange-400 font-semibold flex items-center text-sm">
                ⚠️ CORS & Browser Requests
                <span className="ml-2 text-orange-300 text-xs">(Important for cross-origin testing)</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">
                  {showCorsInfo ? 'Hide info' : 'Show info'}
                </span>
                {showCorsInfo ? (
                  <ChevronUp className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                )}
              </div>
            </div>
            
            {showCorsInfo && (
              <Card className="bg-[#1a1a1a] border-orange-400/20 text-white">
                <CardContent className="p-4">
                  <div className="text-sm space-y-2">
                    <p className="text-neutral-300">
                      <strong>Note:</strong> If you see OPTIONS requests in logs, this is normal browser behavior.
                    </p>
                    <ul className="space-y-1 text-neutral-400 text-xs">
                      <li>• Browser sends OPTIONS preflight for cross-origin requests</li>
                      <li>• OPTIONS request checks CORS permissions before actual POST</li>
                      <li>• Your A2A server must handle OPTIONS and return proper CORS headers</li>
                      <li>• The actual POST request with your data comes after OPTIONS</li>
                    </ul>
                    <div className="mt-3 p-2 bg-[#222] rounded text-xs">
                      <strong className="text-orange-400">Server CORS Headers needed:</strong><br/>
                      <code className="text-emerald-400">
                        Access-Control-Allow-Origin: *<br/>
                        Access-Control-Allow-Methods: POST, OPTIONS<br/>
                        Access-Control-Allow-Headers: Content-Type, x-api-key, Authorization
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* A2A Configuration Status */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-[#222]/30 p-3 rounded-lg transition-colors border border-transparent hover:border-[#333]"
              onClick={() => setShowConfigStatus(!showConfigStatus)}
            >
              <h3 className="text-emerald-400 font-semibold flex items-center text-sm">
                🔧 Active A2A Configuration
                <span className="ml-2 text-emerald-300 text-xs">(Real-time feature status)</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">
                  {showConfigStatus ? 'Hide config' : 'Show config'}
                </span>
                {showConfigStatus ? (
                  <ChevronUp className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
                )}
              </div>
            </div>
            
            {showConfigStatus && (
              <Card className="bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/20 text-white">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-[#222]/50 p-3 rounded-lg">
                      <h4 className="text-emerald-400 font-medium mb-2">Multi-turn Conversations</h4>
                      <div className={`text-xs ${contextId ? 'text-green-400' : 'text-neutral-400'}`}>
                        {contextId ? '✅ Active' : '⏸️ Waiting for contextId'}
                      </div>
                      {contextId && (
                        <div className="text-xs text-emerald-300 mt-1 font-mono">
                          contextId: {contextId.substring(0, 8)}...
                        </div>
                      )}
                      {!contextId && (
                        <div className="text-xs text-neutral-400 mt-1">
                          Server will provide contextId if supported
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-[#222]/50 p-3 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Push Notifications</h4>
                      <div className={`text-xs ${enableWebhooks ? 'text-green-400' : 'text-neutral-400'}`}>
                        {enableWebhooks ? '✅ Enabled' : '❌ Disabled'}
                      </div>
                      {enableWebhooks && webhookUrl && (
                        <div className="text-xs text-blue-300 mt-1 truncate">
                          {webhookUrl}
                        </div>
                      )}
                      {enableWebhooks && !webhookUrl && (
                        <div className="text-xs text-yellow-400 mt-1">
                          URL not configured
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-[#222]/50 p-3 rounded-lg">
                      <h4 className="text-orange-400 font-medium mb-2">Debug Logging</h4>
                      <div className={`text-xs ${showDetailedErrors ? 'text-green-400' : 'text-neutral-400'}`}>
                        {showDetailedErrors ? '🔍 Detailed' : '⚡ Basic'}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {showDetailedErrors ? 'Enhanced debug logs' : 'Standard logs only'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-[#1a1a1a] border-[#333] text-white mb-6">
            <CardHeader>
              <CardTitle className="text-emerald-400">A2A Testing Lab</CardTitle>
              <CardDescription>
                Test your A2A agent with different communication methods. Fully compliant with A2A v0.2.1 specification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="http" onValueChange={setLabMode}>
                <TabsList className="bg-[#222] border-[#333] mb-4">
                  <TabsTrigger
                    value="http"
                    className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
                  >
                    HTTP Request
                  </TabsTrigger>
                  <TabsTrigger
                    value="stream"
                    className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
                  >
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
                    setFiles={setAttachedFiles}
                    a2aMethod={a2aMethod}
                    setA2aMethod={setA2aMethod}
                    authMethod={authMethod}
                    setAuthMethod={setAuthMethod}
                    generateNewIds={generateNewIds}
                    currentTaskId={currentTaskId}
                    conversationHistory={conversationHistory}
                    clearHistory={clearHistory}
                    webhookUrl={webhookUrl}
                    setWebhookUrl={setWebhookUrl}
                    enableWebhooks={enableWebhooks}
                    setEnableWebhooks={setEnableWebhooks}
                    showDetailedErrors={showDetailedErrors}
                    setShowDetailedErrors={setShowDetailedErrors}
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
                    setFiles={setAttachedFiles}
                    authMethod={authMethod}
                    currentTaskId={currentTaskId}
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
                  <CodeBlock text={response} language="json" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show message if no response yet but in HTTP mode */}
          {!response && labMode === "http" && !isLoading && (
            <Card className="bg-[#1a1a1a] border-[#333] text-white">
              <CardContent className="p-6 text-center">
                <p className="text-neutral-400">
                  Click "Send" to test your A2A agent and see the response here.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Debug Logs Section */}
          {debugLogs.length > 0 && (
            <Card className="bg-[#1a1a1a] border-[#333] text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-400">Debug Logs</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDebug(!showDebug)}
                      className="bg-[#222] border-[#444] text-white hover:bg-[#333]"
                    >
                      {showDebug ? "Hide" : "Show"} Logs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDebugLogs([])}
                      className="bg-[#222] border-[#444] text-white hover:bg-[#333]"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Detailed request flow - includes CORS preflight and actual requests
                </CardDescription>
              </CardHeader>
              {showDebug && (
                <CardContent>
                  <div className="bg-[#0a0a0a] p-4 rounded-md max-h-96 overflow-y-auto">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                      {debugLogs.join('\n')}
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            <TechnicalDetailsSection copyToClipboard={copyToClipboard} />
            <FrontendImplementationSection copyToClipboard={copyToClipboard} />
            <CodeExamplesSection
              agentUrl={agentUrl}
              apiKey={apiKey}
              jsonRpcRequest={jsonRpcRequest}
              curlExample={curlExample}
              fetchExample={fetchExample}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Footer with additional resources */}
      <Card className="bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/20 text-white mt-12">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">Official Resources</h3>
              <div className="space-y-2 text-sm">
                <a 
                  href="https://google.github.io/A2A/specification" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  📋 Official A2A Specification
                </a>
                <a 
                  href="https://github.com/google/A2A" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  🔗 GitHub Repository
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">Implementation Status</h3>
              <div className="space-y-1 text-sm text-neutral-300">
                <div>✅ A2A v0.2.1 Compliant</div>
                <div>✅ All Core Methods Supported</div>
                <div>✅ Enterprise Security Ready</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">Need Help?</h3>
              <div className="space-y-1 text-sm text-neutral-300">
                <div>📖 Check the documentation tab</div>
                <div>🧪 Test with the lab interface</div>
                <div>💡 View code examples for implementation</div>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-500/20 mt-6 pt-4 text-center text-xs text-neutral-400">
            Built with ❤️ for the Agent2Agent community • Evolution API © 2025
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 bg-[#121212] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
      }
    >
      <DocumentationContent />
    </Suspense>
  );
}
