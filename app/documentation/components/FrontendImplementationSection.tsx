/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/FrontendImplementationSection.tsx       │
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

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { CodeBlock } from "@/app/documentation/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FrontendImplementationSectionProps {
  copyToClipboard: (text: string) => void;
}

export function FrontendImplementationSection({ copyToClipboard }: FrontendImplementationSectionProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-white">
      <CardHeader>
        <CardTitle className="text-emerald-400">Frontend implementation</CardTitle>
        <CardDescription className="text-neutral-400">
          Practical examples for implementation in React applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="standard">
          <TabsList className="bg-[#222] border-[#333] mb-4">
            <TabsTrigger value="standard" className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400">
              Standard HTTP
            </TabsTrigger>
            <TabsTrigger value="streaming" className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400">
              Streaming SSE
            </TabsTrigger>
            <TabsTrigger value="react-component" className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400">
              React component
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div>
              <h3 className="text-emerald-400 text-lg font-medium mb-2">Implementation of message/send</h3>
              <p className="text-neutral-300 mb-4">
                Example of standard implementation in JavaScript/React:
              </p>
              
              <div className="relative">
                <CodeBlock
                  text={`async function sendTask(agentId, message) {
  // Generate unique IDs
  const taskId = crypto.randomUUID();
  const callId = crypto.randomUUID();
  
  // Prepare request data
  const requestData = {
    jsonrpc: "2.0",
    id: callId,
    method: "message/send",
    params: {
      id: taskId,
      sessionId: "session-" + Math.random().toString(36).substring(2, 9),
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: message
          }
        ]
      }
    }
  };

  try {
    // Indicate loading state
    setIsLoading(true);
    
    // Send the request
    const response = await fetch(\`/api/v1/a2a/\${agentId}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }

    // Process the response
    const data = await response.json();
    
    // Check for errors
    if (data.error) {
      console.error('Error in response:', data.error);
      return null;
    }
    
    // Extract the agent response
    const task = data.result;
    
    // Show response in UI
    if (task.status.message && task.status.message.parts) {
      const responseText = task.status.message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');
      
      // Here you would update your React state
      // setResponse(responseText);
      
      return responseText;
    }
    
    return task;
  } catch (error) {
    console.error('Error sending task:', error);
    return null;
  } finally {
    // Finalize loading state
    setIsLoading(false);
  }
}`}
                  language="javascript"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`async function sendTask(agentId, message) {
  // Generate unique IDs
  const taskId = crypto.randomUUID();
  const callId = crypto.randomUUID();
  
  // Prepare request data
  const requestData = {
    jsonrpc: "2.0",
    id: callId,
    method: "message/send",
    params: {
      id: taskId,
      sessionId: "session-" + Math.random().toString(36).substring(2, 9),
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: message
          }
        ]
      }
    }
  };

  try {
    // Indicate loading state
    setIsLoading(true);
    
    // Send the request
    const response = await fetch(\`/api/v1/a2a/\${agentId}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }

    // Process the response
    const data = await response.json();
    
    // Check for errors
    if (data.error) {
      console.error('Error in response:', data.error);
      return null;
    }
    
    // Extract the agent response
    const task = data.result;
    
    // Show response in UI
    if (task.status.message && task.status.message.parts) {
      const responseText = task.status.message.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');
      
      // Here you would update your React state
      // setResponse(responseText);
      
      return responseText;
    }
    
    return task;
  } catch (error) {
    console.error('Error sending task:', error);
    return null;
  } finally {
    // Finalize loading state
    setIsLoading(false);
  }
}`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="streaming">
            <div>
              <h3 className="text-emerald-400 text-lg font-medium mb-2">Implementation of message/stream (Streaming)</h3>
              <p className="text-neutral-300 mb-4">
                Example of implementation of streaming with Server-Sent Events (SSE):
              </p>
              
              <div className="relative">
                <CodeBlock
                  text={`async function initAgentStream(agentId, message, onUpdateCallback) {
  // Generate unique IDs
  const taskId = crypto.randomUUID();
  const callId = crypto.randomUUID();
  const sessionId = "session-" + Math.random().toString(36).substring(2, 9);
  
  // Prepare request data for streaming
  const requestData = {
    jsonrpc: "2.0",
    id: callId,
    method: "message/stream",
    params: {
      id: taskId,
      sessionId: sessionId,
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: message
          }
        ]
      }
    }
  };

  try {
    // Start initial POST request
    const response = await fetch(\`/api/v1/a2a/\${agentId}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE',
        'Accept': 'text/event-stream' // Important for SSE
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    
    // Check content type of the response
    const contentType = response.headers.get('content-type');
    
    // If the response is already SSE, use EventSource
    if (contentType?.includes('text/event-stream')) {
      // Use EventSource to process the stream
      setupEventSource(\`/api/v1/a2a/\${agentId}/stream?taskId=\${taskId}&key=YOUR_API_KEY_HERE\`);
      return;
    }
    
    // Function to configure EventSource
    function setupEventSource(url) {
      const eventSource = new EventSource(url);
      
      // Handler for received messages
      eventSource.onmessage = (event) => {
        try {
          // Process data from the event
          const data = JSON.parse(event.data);
          
          // Process the event
          if (data.result) {
            // Process status if available
            if (data.result.status) {
              const status = data.result.status;
              
              // Extract text if available
              let currentText = '';
              if (status.message && status.message.parts) {
                const parts = status.message.parts.filter(part => part.type === 'text');
                if (parts.length > 0) {
                  currentText = parts.map(part => part.text).join('');
                }
              }
              
              // Call callback with updates
              onUpdateCallback({
                text: currentText,
                state: status.state,
                complete: data.result.final === true
              });
              
              // If it's the final event, close the connection
              if (data.result.final === true) {
                eventSource.close();
                onUpdateCallback({
                  complete: true,
                  state: status.state
                });
              }
            }
            
            // Process artifact if available
            if (data.result.artifact) {
              const artifact = data.result.artifact;
              if (artifact.parts && artifact.parts.length > 0) {
                const parts = artifact.parts.filter(part => part.type === 'text');
                if (parts.length > 0) {
                  const artifactText = parts.map(part => part.text).join('');
                  
                  // Call callback with artifact
                  onUpdateCallback({
                    text: artifactText,
                    state: 'artifact',
                    complete: artifact.lastChunk === true
                  });
                  
                  // If it's the last chunk, close the connection
                  if (artifact.lastChunk === true) {
                    eventSource.close();
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing event:', error);
          onUpdateCallback({ error: error.message });
        }
      };
      
      // Handler for errors
      eventSource.onerror = (error) => {
        console.error('Error in EventSource:', error);
        eventSource.close();
        onUpdateCallback({ 
          error: 'Connection with server interrupted',
          complete: true,
          state: 'error'
        });
      };
    }
  } catch (error) {
    console.error('Error in streaming:', error);
    // Notify error through callback
    onUpdateCallback({ 
      error: error.message,
      complete: true,
      state: 'error'
    });
    return null;
  }
}`}
                  language="javascript"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`async function initAgentStream(agentId, message, onUpdateCallback) {
  // Generate unique IDs
  const taskId = crypto.randomUUID();
  const callId = crypto.randomUUID();
  const sessionId = "session-" + Math.random().toString(36).substring(2, 9);
  
  // Prepare request data for streaming
  const requestData = {
    jsonrpc: "2.0",
    id: callId,
    method: "message/stream",
    params: {
      id: taskId,
      sessionId: sessionId,
      message: {
        role: "user",
        parts: [
          {
            type: "text",
            text: message
          }
        ]
      }
    }
  };

  try {
    // Start initial POST request
    const response = await fetch(\`/api/v1/a2a/\${agentId}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE',
        'Accept': 'text/event-stream' // Important for SSE
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    
    // Check content type of the response
    const contentType = response.headers.get('content-type');
    
    // If the response is already SSE, use EventSource
    if (contentType?.includes('text/event-stream')) {
      // Use EventSource to process the stream
      setupEventSource(\`/api/v1/a2a/\${agentId}/stream?taskId=\${taskId}&key=YOUR_API_KEY_HERE\`);
      return;
    }
    
    // Function to configure EventSource
    function setupEventSource(url) {
      const eventSource = new EventSource(url);
      
      // Handler for received messages
      eventSource.onmessage = (event) => {
        try {
          // Process data from the event
          const data = JSON.parse(event.data);
          
          // Process the event
          if (data.result) {
            // Process status if available
            if (data.result.status) {
              const status = data.result.status;
              
              // Extract text if available
              let currentText = '';
              if (status.message && status.message.parts) {
                const parts = status.message.parts.filter(part => part.type === 'text');
                if (parts.length > 0) {
                  currentText = parts.map(part => part.text).join('');
                }
              }
              
              // Call callback with updates
              onUpdateCallback({
                text: currentText,
                state: status.state,
                complete: data.result.final === true
              });
              
              // If it's the final event, close the connection
              if (data.result.final === true) {
                eventSource.close();
                onUpdateCallback({
                  complete: true,
                  state: status.state
                });
              }
            }
            
            // Process artifact if available
            if (data.result.artifact) {
              const artifact = data.result.artifact;
              if (artifact.parts && artifact.parts.length > 0) {
                const parts = artifact.parts.filter(part => part.type === 'text');
                if (parts.length > 0) {
                  const artifactText = parts.map(part => part.text).join('');
                  
                  // Call callback with artifact
                  onUpdateCallback({
                    text: artifactText,
                    state: 'artifact',
                    complete: artifact.lastChunk === true
                  });
                  
                  // If it's the last chunk, close the connection
                  if (artifact.lastChunk === true) {
                    eventSource.close();
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing event:', error);
          onUpdateCallback({ error: error.message });
        }
      };
      
      // Handler for errors
      eventSource.onerror = (error) => {
        console.error('Error in EventSource:', error);
        eventSource.close();
        onUpdateCallback({ 
          error: 'Connection with server interrupted',
          complete: true,
          state: 'error'
        });
      };
    }
  } catch (error) {
    console.error('Error in streaming:', error);
    // Notify error through callback
    onUpdateCallback({ 
      error: error.message,
      complete: true,
      state: 'error'
    });
    return null;
  }
}`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="react-component">
            <div className="mt-4">
              <h4 className="font-medium text-emerald-400 mb-2">React component with streaming support:</h4>
              <div className="relative">
                <CodeBlock
                  text={`import React, { useState, useRef } from 'react';

function ChatComponentA2A() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('');
  
  // Reference to the agentId
  const agentId = 'your-agent-id';
  
  // Callback for streaming updates
  const handleStreamUpdate = (update) => {
    if (update.error) {
      // Handle error
      setStatus('error');
      return;
    }
    
    // Update text
    setResponse(update.text);
    
    // Update status
    setStatus(update.state);
    
    // If it's complete, finish streaming
    if (update.complete) {
      setIsStreaming(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Clear previous response
    setResponse('');
    setStatus('submitted');
    
    // Start streaming
    setIsStreaming(true);
    
    try {
      // Start stream with the agent
      await initAgentStream(agentId, message, handleStreamUpdate);
      
      // Clear message field after sending
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setIsStreaming(false);
    }
  };
  
  // Render status indicator based on status
  const renderStatusIndicator = () => {
    switch (status) {
      case 'submitted':
        return <span className="badge badge-info">Sent</span>;
      case 'working':
        return <span className="badge badge-warning">Processing</span>;
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'error':
        return <span className="badge badge-danger">Error</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {response && (
          <div className="message agent-message">
            <div className="message-header">
              <div className="agent-name">A2A Agent</div>
              {renderStatusIndicator()}
            </div>
            <div className="message-content">
              {response}
              {status === 'working' && !response && (
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isStreaming || !message.trim()}
          className="send-button"
        >
          {isStreaming ? 'Processing...' : 'Send'}
        </button>
      </form>
    </div>
  );
}`}
                  language="javascript"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-[#333]"
                  onClick={() => copyToClipboard(`import React, { useState, useRef } from 'react';

function ChatComponentA2A() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('');
  
  // Reference to the agentId
  const agentId = 'your-agent-id';
  
  // Callback for streaming updates
  const handleStreamUpdate = (update) => {
    if (update.error) {
      // Handle error
      setStatus('error');
      return;
    }
    
    // Update text
    setResponse(update.text);
    
    // Update status
    setStatus(update.state);
    
    // If it's complete, finish streaming
    if (update.complete) {
      setIsStreaming(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Clear previous response
    setResponse('');
    setStatus('submitted');
    
    // Start streaming
    setIsStreaming(true);
    
    try {
      // Start stream with the agent
      await initAgentStream(agentId, message, handleStreamUpdate);
      
      // Clear message field after sending
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setIsStreaming(false);
    }
  };
  
  // Render status indicator based on status
  const renderStatusIndicator = () => {
    switch (status) {
      case 'submitted':
        return <span className="badge badge-info">Sent</span>;
      case 'working':
        return <span className="badge badge-warning">Processing</span>;
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'error':
        return <span className="badge badge-danger">Error</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {response && (
          <div className="message agent-message">
            <div className="message-header">
              <div className="agent-name">A2A Agent</div>
              {renderStatusIndicator()}
            </div>
            <div className="message-content">
              {response}
              {status === 'working' && !response && (
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isStreaming || !message.trim()}
          className="send-button"
        >
          {isStreaming ? 'Processing...' : 'Send'}
        </button>
      </form>
    </div>
  );
}`)}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 