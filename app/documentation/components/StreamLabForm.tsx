/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/StreamLabForm.tsx                       │
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Send, Paperclip, X, FileText, Image, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface StreamLabFormProps {
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
  sendStreamRequest: () => Promise<void>;
  isStreaming: boolean;
  streamResponse: string;
  streamStatus: string;
  streamHistory: string[];
  renderStatusIndicator: () => JSX.Element | null;
  renderTypingIndicator: () => JSX.Element | null;
  setFiles?: (files: AttachedFile[]) => void;
  authMethod: string;
  currentTaskId?: string | null;
}

export function StreamLabForm({
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
  sendStreamRequest,
  isStreaming,
  streamResponse,
  streamStatus,
  streamHistory,
  renderStatusIndicator,
  renderTypingIndicator,
  setFiles = () => {},
  authMethod,
  currentTaskId
}: StreamLabFormProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const clearAttachedFiles = () => {
    setAttachedFiles([]);
  };
  
  const handleSendStreamRequest = async () => {
    await sendStreamRequest();
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
      {/* A2A Streaming Information */}
      <div className="p-4 bg-[#1a1a1a] border border-[#333] rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-emerald-400">A2A Streaming Mode</span>
          <span className="text-xs text-neutral-400">Method: message/stream</span>
        </div>
        <div className="text-xs text-neutral-400">
          Authentication: {authMethod === "bearer" ? "Bearer Token" : "API Key"} header
        </div>
        {currentTaskId && (
          <div className="mt-2 pt-2 border-t border-[#333]">
            <span className="text-xs text-neutral-400">Current Task ID: </span>
            <span className="text-xs text-emerald-400 font-mono">{currentTaskId}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Agent URL</label>
          <Input
            value={agentUrl}
            onChange={(e) => setAgentUrl(e.target.value)}
            placeholder="http://localhost:8000/api/v1/a2a/your-agent-id"
            className="bg-[#222] border-[#444] text-white"
            disabled={isStreaming}
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
            disabled={isStreaming}
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm text-neutral-400 mb-1 block">Message</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What is the A2A protocol?"
          className="bg-[#222] border-[#444] text-white min-h-[100px]"
          disabled={isStreaming}
        />
      </div>
      
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
            disabled={attachedFiles.length >= 5 || isStreaming}
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
            disabled={isStreaming}
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
                  disabled={isStreaming}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-4 bg-[#333]" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Session ID</label>
          <Input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
            disabled={isStreaming}
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Task ID</label>
          <Input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
            disabled={isStreaming}
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-1 block">Call ID</label>
          <Input
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            className="bg-[#222] border-[#444] text-white"
            disabled={isStreaming}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSendStreamRequest}
        disabled={isStreaming}
        className="bg-emerald-400 text-black hover:bg-[#00cc7d] w-full mt-4"
      >
        {isStreaming ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
            Streaming...
          </div>
        ) : (
          <div className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Start Streaming
          </div>
        )}
      </Button>
      
      {streamResponse && (
        <div className="mt-6 rounded-md bg-[#222] border border-[#333] p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-white">Response</h3>
            {renderStatusIndicator && renderStatusIndicator()}
          </div>
          <div className="whitespace-pre-wrap text-sm font-mono text-neutral-300">
            {streamResponse}
          </div>
          {renderTypingIndicator && renderTypingIndicator()}
        </div>
      )}
    </div>
  );
} 