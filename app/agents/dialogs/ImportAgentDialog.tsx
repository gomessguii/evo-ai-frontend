/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/ImportAgentDialog.tsx                             │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: May 15, 2025                                                  │
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

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, FileJson } from "lucide-react";
import { importAgentFromJson } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";

interface ImportAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clientId: string;
  folderId?: string | null;
}

export function ImportAgentDialog({
  open,
  onOpenChange,
  onSuccess,
  clientId,
  folderId,
}: ImportAgentDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/json") {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a JSON file",
        variant: "destructive",
      });
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!file || !clientId) return;
    
    try {
      setIsLoading(true);
      
      await importAgentFromJson(file, clientId, folderId);
      
      toast({
        title: "Import successful",
        description: folderId 
          ? "Agent was imported successfully and added to the current folder" 
          : "Agent was imported successfully",
      });
      
      // Call the success callback to refresh the agent list
      onSuccess();
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset state
      setFile(null);
    } catch (error) {
      console.error("Error importing agent:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing the agent",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    if (!isLoading) {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetState();
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Import Agent</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Upload a JSON file to import an agent
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div
            className={`h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 transition-colors cursor-pointer ${
              dragActive 
                ? "border-emerald-400 bg-emerald-900/20" 
                : file 
                  ? "border-emerald-600 bg-emerald-900/10" 
                  : "border-[#444] hover:border-emerald-600/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleSelectFile}
          >
            {file ? (
              <div className="flex flex-col items-center space-y-2">
                <FileJson className="h-10 w-10 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{file.name}</span>
                <span className="text-neutral-400 text-xs">
                  {Math.round(file.size / 1024)} KB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-10 w-10 text-neutral-500" />
                <p className="text-neutral-400 text-center">
                  Drag & drop your JSON file here or click to browse
                </p>
                <span className="text-neutral-500 text-xs">
                  Only JSON files are accepted
                </span>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Agent"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 