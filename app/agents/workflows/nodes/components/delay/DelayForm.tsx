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
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DelayType, DelayUnitEnum } from "../../nodeFunctions";

export function DelayForm({
  selectedNode,
  handleUpdateNode,
  setEdges,
  setIsOpen,
  setSelectedNode,
}: {
  selectedNode: any;
  handleUpdateNode: (node: any) => void;
  setEdges: Dispatch<SetStateAction<any[]>>;
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
    setEdges((edges) => {
      return edges.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      );
    });

    setIsOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="p-4 bg-gray-800 flex-1 overflow-y-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="delay-value" className="text-gray-200">Delay Value</Label>
          <Input
            id="delay-value"
            type="number"
            min="1"
            className="bg-gray-700 text-white border-gray-600"
            value={delay.value}
            onChange={(e) =>
              setDelay({
                ...delay,
                value: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay-unit" className="text-gray-200">Unit</Label>
          <Select
            value={delay.unit}
            onValueChange={(value) =>
              setDelay({
                ...delay,
                unit: value as DelayUnitEnum,
              })
            }
          >
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select the unit" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value={DelayUnitEnum.SECONDS}>Seconds</SelectItem>
              <SelectItem value={DelayUnitEnum.MINUTES}>Minutes</SelectItem>
              <SelectItem value={DelayUnitEnum.HOURS}>Hours</SelectItem>
              <SelectItem value={DelayUnitEnum.DAYS}>Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay-description" className="text-gray-200">Description (optional)</Label>
          <Textarea
            id="delay-description"
            className="bg-gray-700 text-white border-gray-600"
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

        <div className="flex justify-between pt-4">
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
} 