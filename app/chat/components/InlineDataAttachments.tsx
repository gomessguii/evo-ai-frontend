/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/chat/components/InlineDataAttachments.tsx                        │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: August 29, 2025                                               │
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

import React, { useState, useEffect } from "react";
import { formatFileSize, isImageFile } from "@/lib/file-utils";
import { File, FileText, Download, Image } from "lucide-react";
import { ChatPart } from "@/services/sessionService";

interface InlineDataAttachmentsProps {
  parts: ChatPart[];
  className?: string;
  sessionId?: string;
}

interface ProcessedFile {
  filename: string;
  content_type: string;
  data: string;
  size: number;
  preview_url?: string;
}

export function InlineDataAttachments({ parts, className = "", sessionId }: InlineDataAttachmentsProps) {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (isProcessed) return;

    const validParts = parts.filter(part => part.inline_data && part.inline_data.data);
    
    if (validParts.length === 0) {
      setIsProcessed(true);
      return;
    }
    
    const files = validParts.map((part, index) => {
      const { mime_type, data } = part.inline_data!;
      const extension = mime_type.split('/')[1] || 'file';
      
      let filename = '';
      
      if (part.inline_data?.metadata?.filename) {
        filename = part.inline_data.metadata.filename;
      } 
      else if (part.file_data?.filename) {
        filename = part.file_data.filename;
      }
      else {
        filename = `media_${index + 1}.${extension}`;
      }
      
      let preview_url = undefined;
      if (data && isImageFile(mime_type)) {
        preview_url = data.startsWith('data:') 
          ? data 
          : `data:${mime_type};base64,${data}`;
      }
      
      const fileData: ProcessedFile = {
        filename,
        content_type: mime_type,
        size: data.length,
        data,
        preview_url
      };
      
      return fileData;
    });
    
    setProcessedFiles(files);
    setIsProcessed(true);
  }, [parts, isProcessed]);

  if (processedFiles.length === 0) return null;

  const downloadFile = (file: ProcessedFile) => {
    try {
      const link = document.createElement("a");
      const dataUrl = file.data.startsWith('data:') 
        ? file.data 
        : `data:${file.content_type};base64,${file.data}`;
      
      link.href = dataUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading file ${file.filename}:`, error);
    }
  };

  const getFileUrl = (file: ProcessedFile) => {
    return file.preview_url || (file.data.startsWith('data:') 
      ? file.data 
      : `data:${file.content_type};base64,${file.data}`);
  };

  return (
    <div className={`flex flex-col gap-2 mt-2 ${className}`}>
      <div className="text-xs text-neutral-400 mb-1">
        <span>Attached files:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {processedFiles.map((file, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#333] rounded-md overflow-hidden border border-[#444] hover:border-[#666] transition-colors"
          >
            {isImageFile(file.content_type) && (
              <div className="w-full max-w-[200px] h-[120px] bg-black flex items-center justify-center">
                <img
                  src={getFileUrl(file)}
                  alt={file.filename}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error(`Error loading image ${file.filename}`);
                    (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYiPjxsaW5lIHgxPSIyIiB5MT0iMiIgeDI9IjIyIiB5Mj0iMjIiLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHg9IjIiIHk9IjIiIHJ4PSIyIiByeT0iMiIvPjxsaW5lIHgxPSI4IiB5MT0iMTAiIHgyPSI4IiB5Mj0iMTAiLz48bGluZSB4MT0iMTIiIHkxPSIxNCIgeDI9IjEyIiB5Mj0iMTQiLz48L3N2Zz4=";
                  }}
                />
              </div>
            )}
            <div className="p-2 flex items-center gap-2">
              <div className="flex-shrink-0">
                {isImageFile(file.content_type) ? (
                  <Image className="h-4 w-4 text-emerald-400" />
                ) : file.content_type === "application/pdf" ? (
                  <FileText className="h-4 w-4 text-emerald-400" />
                ) : (
                  <File className="h-4 w-4 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate max-w-[150px]">
                  {file.filename}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <button
                onClick={() => downloadFile(file)}
                className="text-emerald-400 hover:text-white transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}