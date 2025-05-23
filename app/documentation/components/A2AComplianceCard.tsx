/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/documentation/components/A2AComplianceCard.tsx                    │
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  Shield, 
  Zap, 
  FileText, 
  Settings, 
  Network,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

export function A2AComplianceCard() {
  const [showCoreFeatures, setShowCoreFeatures] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  const implementedFeatures = [
    {
      name: "JSON-RPC 2.0 Protocol",
      status: "implemented",
      icon: CheckCircle2,
      description: "Full compliance with JSON-RPC 2.0 specification"
    },
    {
      name: "message/send Method",
      status: "implemented", 
      icon: CheckCircle2,
      description: "Standard HTTP messaging with proper request/response format"
    },
    {
      name: "message/stream Method",
      status: "implemented",
      icon: CheckCircle2,
      description: "Real-time streaming via Server-Sent Events (SSE)"
    },
    {
      name: "tasks/get Method",
      status: "implemented",
      icon: CheckCircle2,
      description: "Task status querying and monitoring"
    },
    {
      name: "tasks/cancel Method",
      status: "implemented",
      icon: CheckCircle2,
      description: "Task cancellation support"
    },
    {
      name: "agent/authenticatedExtendedCard",
      status: "implemented",
      icon: CheckCircle2,
      description: "Agent discovery and capability enumeration"
    },
    {
      name: "File Upload Support",
      status: "implemented",
      icon: CheckCircle2,
      description: "Base64 file encoding with proper MIME type handling"
    },
    {
      name: "UUID v4 Message IDs",
      status: "implemented",
      icon: CheckCircle2,
      description: "Standards-compliant unique message identification"
    },
    {
      name: "Authentication Methods",
      status: "implemented",
      icon: CheckCircle2,
      description: "API Key and Bearer token authentication"
    },
    {
      name: "Task State Management",
      status: "implemented",
      icon: CheckCircle2,
      description: "Complete task lifecycle: submitted → working → completed/failed"
    },
    {
      name: "Artifact Handling",
      status: "implemented",
      icon: CheckCircle2,
      description: "Complex response data with structured artifacts"
    },
    {
      name: "CORS Compliance",
      status: "implemented",
      icon: CheckCircle2,
      description: "Proper cross-origin resource sharing configuration"
    },
    {
      name: "tasks/pushNotificationConfig/set",
      status: "implemented",
      icon: CheckCircle2,
      description: "Set push notification configuration for tasks"
    },
    {
      name: "tasks/pushNotificationConfig/get", 
      status: "implemented",
      icon: CheckCircle2,
      description: "Get push notification configuration for tasks"
    },
    {
      name: "tasks/resubscribe",
      status: "implemented", 
      icon: CheckCircle2,
      description: "Resubscribe to task updates and notifications"
    }
  ];

  const advancedFeatures = [
    {
      name: "Push Notifications",
      status: "implemented",
      icon: CheckCircle2,
      description: "A2A pushNotificationConfig methods and webhook support"
    },
    {
      name: "Multi-turn Conversations",
      status: "implemented",
      icon: CheckCircle2,
      description: "Context preservation via contextId field as per A2A specification"
    },
    {
      name: "Enhanced Error Diagnostics", 
      status: "implemented",
      icon: AlertCircle,
      description: "Comprehensive A2A error analysis and troubleshooting guidance"
    }
  ];

  const implementedCount = implementedFeatures.filter(f => f.status === 'implemented').length;
  const totalFeatures = implementedFeatures.length + advancedFeatures.length;
  const partialCount = advancedFeatures.filter(f => f.status === 'partial').length;
  const advancedImplementedCount = advancedFeatures.filter(f => f.status === 'implemented').length;
  const totalImplementedCount = implementedCount + advancedImplementedCount;
  const completionPercentage = Math.round(((totalImplementedCount + (partialCount * 0.5)) / totalFeatures) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-400';
      case 'partial': return 'text-yellow-400';
      case 'planned': return 'text-blue-400';
      default: return 'text-neutral-400';
    }
  };

  const getStatusIcon = (status: string, IconComponent: any) => {
    const colorClass = getStatusColor(status);
    return <IconComponent className={`h-4 w-4 ${colorClass}`} />;
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border-emerald-500/20 text-white">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center">
          <Network className="h-5 w-5 mr-2" />
          A2A Specification Compliance
        </CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-300">Implementation Progress</span>
              <span className="text-emerald-400 font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const shouldExpand = !showCoreFeatures || !showAdvancedFeatures;
                setShowCoreFeatures(shouldExpand);
                setShowAdvancedFeatures(shouldExpand);
              }}
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2 py-1 rounded border border-neutral-600 hover:border-neutral-400"
            >
              {showCoreFeatures && showAdvancedFeatures ? 'Collapse All' : 'Expand All'}
            </button>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              v0.2.0 Compatible
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <a 
            href="https://google.github.io/A2A/specification" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/20 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2 text-blue-400" />
            <span className="text-blue-400">View Official Specification</span>
            <ExternalLink className="h-3 w-3 ml-2 text-blue-400" />
          </a>
        </div>

        <div>
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-[#222]/30 p-2 rounded-lg transition-colors mb-4 border border-transparent hover:border-[#333]"
            onClick={() => setShowCoreFeatures(!showCoreFeatures)}
          >
            <h3 className="text-white font-semibold flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
              Core Features 
              <span className="ml-2 text-green-400 text-sm">({implementedCount}/{implementedFeatures.length} implemented)</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500">
                {showCoreFeatures ? 'Hide details' : 'Show details'}
              </span>
              {showCoreFeatures ? (
                <ChevronUp className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
              )}
            </div>
          </div>
          
          {showCoreFeatures && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {implementedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 bg-[#222]/50 p-3 rounded-lg border border-[#333]">
                  {getStatusIcon(feature.status, feature.icon)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{feature.name}</p>
                    <p className="text-xs text-neutral-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-[#222]/30 p-2 rounded-lg transition-colors mb-4 border border-transparent hover:border-[#333]"
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          >
            <h3 className="text-white font-semibold flex items-center">
              <Settings className="h-4 w-4 mr-2 text-blue-400" />
              Advanced Features 
              <span className="ml-2 text-blue-400 text-sm">({advancedImplementedCount}/{advancedFeatures.length} implemented)</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500">
                {showAdvancedFeatures ? 'Hide details' : 'Show details'}
              </span>
              {showAdvancedFeatures ? (
                <ChevronUp className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
              )}
            </div>
          </div>
          
          {showAdvancedFeatures && (
            <div className="space-y-3">
              {advancedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 bg-[#222]/50 p-3 rounded-lg border border-[#333]">
                  {getStatusIcon(feature.status, feature.icon)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-white">{feature.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          feature.status === 'implemented' ? 'border-green-500 text-green-400' :
                          feature.status === 'partial' ? 'border-yellow-500 text-yellow-400' :
                          'border-blue-500 text-blue-400'
                        }`}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-emerald-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-400 font-medium">✓ 100% A2A v0.2.0 Compliance Achieved</p>
              <p className="text-emerald-300 mt-1">
                All 8 official RPC methods implemented • Complete protocol data objects • Full workflow support • Enterprise security ready
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 