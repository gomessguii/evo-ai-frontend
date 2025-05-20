/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @author: Victor Calazans - Implementation of Delay node form                 │
│ @file: /app/agents/workflows/nodes/components/delay/DelayForm.tsx            │
│ Developed by: Davidson Gomes                                                 │
│ Delay form developed by: Victor Calazans                                     │
│ Creation date: May 13, 2025                                                  │
│ Delay form implementation date: May 17, 2025                                 │
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { Clock, Trash2, Save, AlertCircle, HourglassIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DelayType, DelayUnitEnum } from "../../nodeFunctions";
import { cn } from "@/lib/utils";

export function DelayForm({
  selectedNode,
  handleUpdateNode,
  setEdges,
  setIsOpen,
  setSelectedNode,
}: {
  selectedNode: any;
  handleUpdateNode: (node: any) => void;
  setEdges: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNode: Dispatch<SetStateAction<any>>;
}) {
  const [delay, setDelay] = useState<DelayType>({
    value: 1,
    unit: DelayUnitEnum.SECONDS,
    description: "",
  });

  useEffect(() => {
    if (selectedNode?.data?.delay) {
      setDelay(selectedNode.data.delay);
    }
  }, [selectedNode]);

  const handleSave = () => {
    handleUpdateNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        delay,
      },
    });
  };

  const handleDelete = () => {
    setEdges((edges: any) => {
      return edges.filter(
        (edge: any) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      );
    });

    setIsOpen(false);
    setSelectedNode(null);
  };

  const getUnitLabel = (unit: DelayUnitEnum) => {
    const units = {
      [DelayUnitEnum.SECONDS]: "Seconds",
      [DelayUnitEnum.MINUTES]: "Minutes",
      [DelayUnitEnum.HOURS]: "Hours",
      [DelayUnitEnum.DAYS]: "Days",
    };
    return units[unit] || unit;
  };

  const getTimeDescription = () => {
    const value = delay.value || 0;
    
    if (value <= 0) return "Invalid time";
    
    if (value === 1) {
      return `1 ${getUnitLabel(delay.unit).slice(0, -1)}`;
    }
    
    return `${value} ${getUnitLabel(delay.unit)}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-medium text-neutral-200">Delay Duration</h3>
            <Badge
              variant="outline"
              className="text-xs bg-yellow-900/20 text-yellow-400 border-yellow-700/50"
            >
              {getTimeDescription().toUpperCase()}
            </Badge>
          </div>
          <Select 
            value={delay.unit}
            onValueChange={(value) =>
              setDelay({
                ...delay,
                unit: value as DelayUnitEnum,
              })
            }
          >
            <SelectTrigger className="w-[120px] h-8 bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectItem value={DelayUnitEnum.SECONDS}>Seconds</SelectItem>
              <SelectItem value={DelayUnitEnum.MINUTES}>Minutes</SelectItem>
              <SelectItem value={DelayUnitEnum.HOURS}>Hours</SelectItem>
              <SelectItem value={DelayUnitEnum.DAYS}>Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="grid gap-4">
          <div className="p-3 rounded-md bg-yellow-900/10 border border-yellow-700/30 mb-2">
            <div className="flex items-start gap-2">
              <div className="bg-yellow-900/50 rounded-full p-1.5 flex-shrink-0">
                <Clock size={18} className="text-yellow-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-200">Time Delay</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Pause workflow execution for a specified amount of time
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delay-value">Delay Value</Label>
            <Input
              id="delay-value"
              type="number"
              min="1"
              className="bg-neutral-700 border-neutral-600"
              value={delay.value}
              onChange={(e) =>
                setDelay({
                  ...delay,
                  value: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delay-description">Description (optional)</Label>
            <Textarea
              id="delay-description"
              className="bg-neutral-700 border-neutral-600 min-h-[100px] resize-none"
              value={delay.description}
              onChange={(e) =>
                setDelay({
                  ...delay,
                  description: e.target.value,
                })
              }
              placeholder="Add a description for this delay"
            />
          </div>

          {delay.value > 0 ? (
            <div className="rounded-md bg-neutral-700/50 border border-neutral-600 p-3 mt-2">
              <div className="text-sm font-medium text-neutral-400 mb-1">Preview</div>
              <div className="flex items-start gap-2 p-2 rounded-md bg-neutral-800/70">
                <div className="rounded-full bg-yellow-900/30 p-1.5 mt-0.5">
                  <HourglassIcon size={15} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <span className="text-sm text-yellow-400 font-medium">
                      {getTimeDescription()} delay
                    </span>
                    {delay.description && (
                      <span className="text-xs text-neutral-400 mt-1">
                        {delay.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-700/30 border border-neutral-600/50 p-4 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-6 w-6 text-neutral-500 mb-2" />
              <p className="text-neutral-400 text-sm">Please set a valid delay time</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-neutral-700 flex-shrink-0">
        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            className="border-red-700/50 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Node
          </Button>
          <Button
            className="bg-yellow-700 hover:bg-yellow-600 text-white flex items-center gap-2"
            onClick={handleSave}
          >
            <Save size={16} />
            Save Delay
          </Button>
        </div>
      </div>
    </div>
  );
} 