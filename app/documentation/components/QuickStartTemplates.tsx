/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/QuickStartTemplates.tsx                 │
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
import { 
  MessageSquare, 
  FileText, 
  Zap, 
  Settings, 
  Users,
  Play 
} from "lucide-react";

interface QuickStartTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  method: string;
  message: string;
  useCase: string;
}

interface QuickStartTemplatesProps {
  onSelectTemplate: (template: QuickStartTemplate) => void;
}

export function QuickStartTemplates({ onSelectTemplate }: QuickStartTemplatesProps) {
  const templates: QuickStartTemplate[] = [
    {
      id: "hello",
      name: "Hello Agent",
      description: "Simple greeting to test agent connectivity",
      icon: MessageSquare,
      method: "message/send",
      message: "Hello! Can you introduce yourself and tell me what you can do?",
      useCase: "Basic connectivity test"
    },
    {
      id: "analysis",
      name: "Data Analysis",
      description: "Request data analysis and insights",
      icon: FileText,
      method: "message/send",
      message: "Please analyze the current market trends in AI technology and provide key insights with recommendations.",
      useCase: "Complex analytical tasks"
    },
    {
      id: "streaming",
      name: "Long Content",
      description: "Generate lengthy content with streaming",
      icon: Zap,
      method: "message/stream",
      message: "Write a comprehensive guide about implementing the Agent2Agent protocol, including technical details, best practices, and code examples.",
      useCase: "Streaming responses"
    },
    {
      id: "task-query",
      name: "Task Status",
      description: "Query the status of a running task",
      icon: Settings,
      method: "tasks/get",
      message: "",
      useCase: "Task management"
    },
    {
      id: "capabilities",
      name: "Agent Capabilities",
      description: "Discover agent capabilities and skills",
      icon: Users,
      method: "agent/authenticatedExtendedCard",
      message: "",
      useCase: "Agent discovery"
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'message/send': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'message/stream': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'tasks/get': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'tasks/cancel': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'agent/authenticatedExtendedCard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-white mb-6">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Quick Start Templates
        </CardTitle>
        <p className="text-neutral-400 text-sm">
          Choose a template to quickly test different A2A protocol methods
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div
                key={template.id}
                className="bg-[#222] border border-[#444] rounded-lg p-4 hover:border-emerald-500/50 transition-colors cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <IconComponent className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{template.name}</h3>
                      <p className="text-xs text-neutral-400">{template.useCase}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-neutral-300 mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getMethodColor(template.method)}`}>
                    {template.method}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs px-2 py-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-xs">
            💡 <strong>Tip:</strong> These templates automatically configure the correct A2A method and provide example messages. 
            Simply select one and customize the agent URL and authentication.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 