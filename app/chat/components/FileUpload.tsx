/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/chat/components/FileUpload.tsx                                   │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: August 24, 2025                                               │
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

import React, { useState, useRef, useEffect } from "react";
import { FileData, formatFileSize, isImageFile } from "@/lib/file-utils";
import { Paperclip, X, Image, File, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void;
  maxFileSize?: number;
  maxFiles?: number;
  className?: string;
  reset?: boolean;
}

export function FileUpload({
  onFilesSelected,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className = "",
  reset = false, // Default false
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (reset && selectedFiles.length > 0) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + newFiles.length > maxFiles) {
      toast({
        title: `You can only attach up to ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }
    
    const validFiles: FileData[] = [];
    
    for (const file of newFiles) {
      if (file.size > maxFileSize) {
        toast({
          title: `File ${file.name} exceeds the maximum size of ${formatFileSize(maxFileSize)}.`,
          variant: "destructive",
        });
        continue;
      }
      
      try {
        const reader = new FileReader();
        
        const readFile = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(file);
        
        const base64Data = await readFile;
        const previewUrl = URL.createObjectURL(file);
        
        validFiles.push({
          filename: file.name,
          content_type: file.type,
          data: base64Data,
          size: file.size,
          preview_url: previewUrl
        });
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: `Error processing file ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center flex-1">
          {selectedFiles.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 bg-[#333] text-white rounded-md p-1.5 text-xs group relative"
            >
              {isImageFile(file.content_type) ? (
                <Image className="h-4 w-4 text-emerald-400" />
              ) : file.content_type === 'application/pdf' ? (
                <FileText className="h-4 w-4 text-emerald-400" />
              ) : (
                <File className="h-4 w-4 text-emerald-400" />
              )}
              <span className="max-w-[120px] truncate">{file.filename}</span>
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
      
      {selectedFiles.length < maxFiles && (
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#333] text-neutral-400 hover:text-emerald-400 transition-colors"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </button>
      )}
    </div>
  );
} 