/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/HttpLabForm.tsx                         │
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

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Paperclip, X, FileText, Image, File, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface HttpLabFormProps {
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
  isLoading: boolean;
  setFiles?: (files: AttachedFile[]) => void;
  a2aMethod: string;
  setA2aMethod: (method: string) => void;
  authMethod: string;
  setAuthMethod: (method: string) => void;
  generateNewIds: () => void;
  currentTaskId?: string | null;
  conversationHistory?: any[];
  clearHistory?: () => void;
  webhookUrl?: string;
  setWebhookUrl?: (url: string) => void;
  enableWebhooks?: boolean;
  setEnableWebhooks?: (enabled: boolean) => void;
  showDetailedErrors?: boolean;
  setShowDetailedErrors?: (show: boolean) => void;
}

export function HttpLabForm({
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
  isLoading,
  setFiles = () => {},
  a2aMethod,
  setA2aMethod,
  authMethod,
  setAuthMethod,
  generateNewIds,
  currentTaskId,
  conversationHistory,
  clearHistory,
  webhookUrl,
  setWebhookUrl,
  enableWebhooks,
  setEnableWebhooks,
  showDetailedErrors,
  setShowDetailedErrors
}: HttpLabFormProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const clearAttachedFiles = () => {
    setAttachedFiles([]);
  };
  
  const handleSendRequest = async () => {
    await sendRequest();
    clearAttachedFiles();
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit
    const newFiles = Array.from(e.target.files);
    
    if (attachedFiles.length + newFiles.length > 5) {
      toast({
        title: "File limit exceeded",
        description: "You can only attach up to 5 files.",
        variant: "destructive"
      });
      return;
    }
    
    const filesToAdd: AttachedFile[] = [];
    
    for (const file of newFiles) {
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `The file ${file.name} exceeds the 5MB size limit.`,
          variant: "destructive"
        });
        continue;
      }
      
      try {
        const base64 = await readFileAsBase64(file);
        filesToAdd.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: base64
        });
      } catch (error) {
        console.error("Failed to read file:", error);
        toast({
          title: "Failed to read file",
          description: `Could not process ${file.name}.`,
          variant: "destructive"
        });
      }
    }
    
    if (filesToAdd.length > 0) {
      const updatedFiles = [...attachedFiles, ...filesToAdd];
      setAttachedFiles(updatedFiles);
      setFiles(updatedFiles);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data URL prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(updatedFiles);
    setFiles(updatedFiles);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const isImageFile = (type: string): boolean => {
    return type.startsWith('image/');
  };

  return (
    <div className="space-y-4">
      {/* A2A Method and Authentication Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#1a1a1a] border border-[#333] rounded-md">
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">A2A Method</label>
          <Select value={a2aMethod} onValueChange={setA2aMethod}>
            <SelectTrigger className="bg-[#222] border-[#444] text-white">
              <SelectValue placeholder="Select A2A method" />
            </SelectTrigger>
            <SelectContent className="bg-[#222] border-[#444]">
              <SelectItem value="message/send" className="text-white hover:bg-[#333]">
                message/send
              </SelectItem>
              <SelectItem value="message/stream" className="text-white hover:bg-[#333]">
                message/stream
              </SelectItem>
              <SelectItem value="tasks/get" className="text-white hover:bg-[#333]">
                tasks/get
              </SelectItem>
              <SelectItem value="tasks/cancel" className="text-white hover:bg-[#333]">
                tasks/cancel
              </SelectItem>
              <SelectItem value="tasks/pushNotificationConfig/set" className="text-white hover:bg-[#333]">
                tasks/pushNotificationConfig/set
              </SelectItem>
              <SelectItem value="tasks/pushNotificationConfig/get" className="text-white hover:bg-[#333]">
                tasks/pushNotificationConfig/get
              </SelectItem>
              <SelectItem value="tasks/resubscribe" className="text-white hover:bg-[#333]">
                tasks/resubscribe
              </SelectItem>
              <SelectItem value="agent/authenticatedExtendedCard" className="text-white hover:bg-[#333]">
                agent/authenticatedExtendedCard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">Authentication Method</label>
          <Select value={authMethod} onValueChange={setAuthMethod}>
            <SelectTrigger className="bg-[#222] border-[#444] text-white">
              <SelectValue placeholder="Select auth method" />
            </SelectTrigger>
            <SelectContent className="bg-[#222] border-[#444]">
              <SelectItem value="api-key" className="text-white hover:bg-[#333]">
                API Key (x-api-key header)
              </SelectItem>
              <SelectItem value="bearer" className="text-white hover:bg-[#333]">
                Bearer Token (Authorization header)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Multi-turn Conversation History Controls */}
      {(a2aMethod === "message/send" || a2aMethod === "message/stream") && conversationHistory && conversationHistory.length > 0 && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-emerald-400">
                Multi-turn Conversation Active
              </span>
            </div>
          </div>
          
          <div className="text-xs text-emerald-300">
            💬 {conversationHistory.length} messages in conversation history (contextId active)
          </div>
        </div>
      )}

      {/* Push Notifications (Webhook) Configuration */}
      {(a2aMethod === "message/send" || a2aMethod === "message/stream" || a2aMethod.startsWith("tasks/")) && (
        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableWebhooks"
                checked={enableWebhooks}
                onChange={(e) => setEnableWebhooks?.(e.target.checked)}
                className="rounded bg-[#222] border-[#444] text-blue-400 focus:ring-blue-400"
              />
              <label htmlFor="enableWebhooks" className="text-sm font-medium text-blue-400">
                Enable Push Notifications (Webhooks)
              </label>
            </div>
          </div>
          
          {enableWebhooks && (
            <div className="mt-3">
              <label className="text-sm text-neutral-400 mb-1 block">Webhook URL</label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl?.(e.target.value)}
                placeholder="https://your-server.com/webhook/a2a"
                className="bg-[#222] border-[#444] text-white"
              />
              <div className="text-xs text-blue-300 mt-1">
                {a2aMethod === "tasks/pushNotificationConfig/set" 
                  ? "📡 Configure push notifications for task"
                  : "📡 Webhook URL for push notifications (configured via pushNotificationConfig)"
                }
              </div>
            </div>
          )}
          
          {!enableWebhooks && (
            <div className="text-xs text-neutral-400">
              {a2aMethod === "tasks/pushNotificationConfig/set"
                ? "Push notification configuration will be set to null."
                : "No push notifications will be configured for this request."
              }
            </div>
          )}
        </div>
      )}

      {/* Advanced Error Handling Configuration */}
      <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-md">
        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            id="showDetailedErrors"
            checked={showDetailedErrors}
            onChange={(e) => setShowDetailedErrors?.(e.target.checked)}
            className="rounded bg-[#222] border-[#444] text-orange-400 focus:ring-orange-400"
          />
          <label htmlFor="showDetailedErrors" className="text-sm font-medium text-orange-400">
            Enable Detailed Error Logging
          </label>
        </div>
        
        <div className="text-xs text-neutral-400">
          {showDetailedErrors 
            ? "🔍 Detailed error information will be shown in debug logs (client-side only)."
            : "⚡ Basic error handling only - minimal error information in logs."
          }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Agent URL</label>
          <Input
            value={agentUrl}
            onChange={(e) => setAgentUrl(e.target.value)}
            placeholder="http://localhost:8000/api/v1/a2a/your-agent-id"
            className="bg-[#222] border-[#444] text-white"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">
            {authMethod === "bearer" ? "Bearer Token" : "API Key"} (optional)
          </label>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={authMethod === "bearer" ? "Your Bearer token" : "Your API key"}
            className="bg-[#222] border-[#444] text-white"
          />
        </div>
      </div>

      {/* Show current task ID if available */}
      {currentTaskId && (
        <div className="p-3 bg-[#1a1a1a] border border-emerald-400/20 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-neutral-400">Current Task ID:</span>
              <span className="ml-2 text-emerald-400 font-mono text-sm">{currentTaskId}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Message input - only show for message methods */}
      {(a2aMethod === "message/send" || a2aMethod === "message/stream") && (
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What is the A2A protocol?"
            className="bg-[#222] border-[#444] text-white min-h-[100px]"
          />
        </div>
      )}
      
      {/* File attachment - only show for message methods */}
      {(a2aMethod === "message/send" || a2aMethod === "message/stream") && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-neutral-400">
              Attach Files (up to 5, max 5MB each)
            </label>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachedFiles.length >= 5}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileSelect}
            />
          </div>
          
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {attachedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1.5 bg-[#333] text-white rounded-md p-1.5 text-xs"
                >
                  {isImageFile(file.type) ? (
                    <Image className="h-4 w-4 text-emerald-400" />
                  ) : file.type === 'application/pdf' ? (
                    <FileText className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <File className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <span className="text-neutral-400">({formatFileSize(file.size)})</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="ml-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Separator className="my-4 bg-[#333]" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-neutral-400">Session ID</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateNewIds}
              className="h-6 px-2 text-xs text-neutral-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              New IDs
            </Button>
          </div>
          <Input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">
            {a2aMethod.startsWith("tasks/") ? "Task ID (for operation)" : "Message ID (UUID)"}
          </label>
          <Input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
            placeholder={a2aMethod.startsWith("tasks/") ? "Task ID to query/cancel" : "UUID for message"}
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Request ID</label>
          <Input
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
            placeholder="req-123"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSendRequest}
        disabled={isLoading}
        className="bg-emerald-400 text-black hover:bg-[#00cc7d] w-full mt-4"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
            Sending...
          </div>
        ) : (
          <div className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            {a2aMethod === "message/send" && "Send Message"}
            {a2aMethod === "message/stream" && "Start Stream"}
            {a2aMethod === "tasks/get" && "Get Task Status"}
            {a2aMethod === "tasks/cancel" && "Cancel Task"}
            {a2aMethod === "tasks/pushNotificationConfig/set" && "Set Push Config"}
            {a2aMethod === "tasks/pushNotificationConfig/get" && "Get Push Config"}
            {a2aMethod === "tasks/resubscribe" && "Resubscribe to Task"}
            {a2aMethod === "agent/authenticatedExtendedCard" && "Get Agent Card"}
          </div>
        )}
      </Button>
    </div>
  );
} 