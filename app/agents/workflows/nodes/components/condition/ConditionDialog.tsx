/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/condition/ConditionDialog.tsx  │
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import { ConditionType, ConditionTypeEnum } from "../../nodeFunctions";
import { Button } from "@/components/ui/button";
import { Filter, ArrowRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const conditionTypes = [
  {
    id: "previous-output",
    name: "Previous output",
    description: "Validate the result returned by the previous node",
    icon: <Filter className="h-5 w-5 text-blue-400" />,
    color: "bg-blue-900/30 border-blue-700/50",
  },
];

const operators = [
  { value: "is_defined", label: "is defined" },
  { value: "is_not_defined", label: "is not defined" },
  { value: "equals", label: "is equal to" },
  { value: "not_equals", label: "is not equal to" },
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
  { value: "greater_than", label: "is greater than" },
  { value: "greater_than_or_equal", label: "is greater than or equal to" },
  { value: "less_than", label: "is less than" },
  { value: "less_than_or_equal", label: "is less than or equal to" },
  { value: "matches", label: "matches the regex" },
  { value: "not_matches", label: "does not match the regex" },
];

const outputFields = [
  { value: "content", label: "Content" },
  { value: "status", label: "Status" },
];

function ConditionDialog({
  open,
  onOpenChange,
  selectedNode,
  handleUpdateNode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: any;
  handleUpdateNode: any;
}) {
  const [selectedType, setSelectedType] = useState("previous-output");
  const [selectedField, setSelectedField] = useState(outputFields[0].value);
  const [selectedOperator, setSelectedOperator] = useState(operators[0].value);
  const [comparisonValue, setComparisonValue] = useState("");

  const handleConditionSave = (condition: ConditionType) => {
    const newConditions = selectedNode.data.conditions
      ? [...selectedNode.data.conditions]
      : [];
    newConditions.push(condition);

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        conditions: newConditions,
      },
    };

    handleUpdateNode(updatedNode);
    onOpenChange(false);
  };

  const getOperatorLabel = (value: string) => {
    return operators.find(op => op.value === value)?.label || value;
  };

  const getFieldLabel = (value: string) => {
    return outputFields.find(field => field.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 text-neutral-200 sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add New Condition</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <Label className="text-sm font-medium">Condition Type</Label>
            <div className="grid grid-cols-1 gap-2">
              {conditionTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-all ${
                    selectedType === type.id
                      ? "bg-blue-900/30 border-blue-600"
                      : "border-neutral-700 hover:border-blue-700/50 hover:bg-neutral-700/50"
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/40">
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{type.name}</h4>
                    <p className="text-xs text-neutral-400">{type.description}</p>
                  </div>
                  {selectedType === type.id && (
                    <Badge className="bg-blue-600 text-neutral-100">Selected</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Configuration</Label>
              {selectedType === "previous-output" && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span>Output field</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Operator</span>
                  {!["is_defined", "is_not_defined"].includes(selectedOperator) && (
                    <>
                      <ArrowRight className="h-3 w-3" />
                      <span>Value</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {selectedType === "previous-output" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="field">Output Field</Label>
                  <Select 
                    value={selectedField} 
                    onValueChange={setSelectedField}
                  >
                    <SelectTrigger id="field" className="bg-neutral-700 border-neutral-600">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-700 border-neutral-600">
                      {outputFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Select 
                    value={selectedOperator} 
                    onValueChange={setSelectedOperator}
                  >
                    <SelectTrigger id="operator" className="bg-neutral-700 border-neutral-600">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-700 border-neutral-600">
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!["is_defined", "is_not_defined"].includes(selectedOperator) && (
                  <div className="grid gap-2">
                    <Label htmlFor="value">Comparison Value</Label>
                    <Input
                      id="value"
                      value={comparisonValue}
                      onChange={(e) => setComparisonValue(e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                  </div>
                )}

                <div className="rounded-md bg-neutral-700/50 border border-neutral-600 p-3 mt-4">
                  <div className="text-sm font-medium text-neutral-400 mb-1">Preview</div>
                  <div className="text-sm">
                    <span className="text-blue-400 font-medium">{getFieldLabel(selectedField)}</span>
                    {" "}
                    <span className="text-neutral-300">{getOperatorLabel(selectedOperator)}</span>
                    {" "}
                    {!["is_defined", "is_not_defined"].includes(selectedOperator) && (
                      <span className="text-emerald-400 font-medium">"{comparisonValue || "(empty)"}"</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-neutral-600 text-neutral-200 hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              handleConditionSave({
                id: uuidv4(),
                type: ConditionTypeEnum.PREVIOUS_OUTPUT,
                data: {
                  field: selectedField,
                  operator: selectedOperator,
                  value: comparisonValue,
                },
              });
            }}
            className="bg-blue-700 hover:bg-blue-600 text-white"
          >
            Add Condition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConditionDialog };
