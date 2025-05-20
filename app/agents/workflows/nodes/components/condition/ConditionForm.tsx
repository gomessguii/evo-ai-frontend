/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/nodes/components/condition/ConditionForm.tsx    │
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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ConditionType, ConditionTypeEnum } from "../../nodeFunctions";
import { ConditionDialog } from "./ConditionDialog";
import { Button } from "@/components/ui/button";
import { Filter, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* eslint-disable @typescript-eslint/no-explicit-any */
function ConditionForm({
  selectedNode,
  handleUpdateNode,
}: {
  selectedNode: any;
  handleUpdateNode: any;
  setEdges: any;
  setIsOpen: any;
  setSelectedNode: any;
}) {
  const [node, setNode] = useState(selectedNode);

  const [conditions, setConditions] = useState<ConditionType[]>(
    selectedNode.data.conditions || []
  );

  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [conditionToDelete, setConditionToDelete] =
    useState<ConditionType | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setNode(selectedNode);
      setConditions(selectedNode.data.conditions || []);
    }
  }, [selectedNode]);

  const handleDelete = (condition: ConditionType) => {
    setConditionToDelete(condition);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!conditionToDelete) return;

    const newConditions = conditions.filter(
      (c) => c.id !== conditionToDelete.id
    );
    setConditions(newConditions);
    handleUpdateNode({
      ...node,
      data: { ...node.data, conditions: newConditions },
    });
    setDeleteDialog(false);
    setConditionToDelete(null);
  };

  const renderCondition = (condition: ConditionType) => {
    if (condition.type === ConditionTypeEnum.PREVIOUS_OUTPUT) {
      type OperatorType =
        | "is_defined"
        | "is_not_defined"
        | "equals"
        | "not_equals"
        | "contains"
        | "not_contains"
        | "starts_with"
        | "ends_with"
        | "greater_than"
        | "greater_than_or_equal"
        | "less_than"
        | "less_than_or_equal"
        | "matches"
        | "not_matches";

      const operatorText: Record<OperatorType, string> = {
        is_defined: "is defined",
        is_not_defined: "is not defined",
        equals: "is equal to",
        not_equals: "is not equal to",
        contains: "contains",
        not_contains: "does not contain",
        starts_with: "starts with",
        ends_with: "ends with",
        greater_than: "is greater than",
        greater_than_or_equal: "is greater than or equal to",
        less_than: "is less than",
        less_than_or_equal: "is less than or equal to",
        matches: "matches the regex",
        not_matches: "does not match the regex",
      };

      return (
        <div
          key={condition.id}
          className="p-3 rounded-md cursor-pointer transition-colors bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 mb-2 group"
        >
          <div className="flex items-start gap-2">
            <div className="bg-blue-900/50 rounded-full p-1.5 flex-shrink-0">
              <Filter size={18} className="text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-200">Condition</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(condition)}
                  className="h-7 w-7 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-900/20"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-900/20 text-blue-400 border-blue-700/50"
                >
                  Field
                </Badge>
                <span className="text-sm text-neutral-300 font-medium">{condition.data.field}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                <span className="text-sm text-neutral-400">{operatorText[condition.data.operator as OperatorType]}</span>
                {!["is_defined", "is_not_defined"].includes(condition.data.operator) && (
                  <span className="text-sm font-medium text-emerald-400">
                    "{condition.data.value}"
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-medium text-neutral-200">Logic Type</h3>
            <Badge
              variant="outline"
              className="text-xs bg-blue-900/20 text-blue-400 border-blue-700/50"
            >
              {node.data.type === "or" ? "ANY" : "ALL"}
            </Badge>
          </div>
          <Select 
            value={node.data.type || "and"}
            onValueChange={(value) => {
              const updatedNode = {
                ...node,
                data: {
                  ...node.data,
                  type: value,
                },
              };
              setNode(updatedNode);
              handleUpdateNode(updatedNode);
            }}
          >
            <SelectTrigger className="w-[120px] h-8 bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectItem value="and">ALL (AND)</SelectItem>
              <SelectItem value="or">ANY (OR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-neutral-400 mt-2">
          {node.data.type === "or" 
            ? "Any of the following conditions must be true to proceed."
            : "All of the following conditions must be true to proceed."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-neutral-200">Conditions</h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-800/20 hover:bg-blue-700/30 border-blue-700/50 text-blue-300"
              onClick={() => setOpen(true)}
            >
              <Plus size={14} className="mr-1" />
              Add Condition
            </Button>
          </div>

          {conditions.length > 0 ? (
            <div className="space-y-2">
              {conditions.map((condition) => renderCondition(condition))}
            </div>
          ) : (
            <div 
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-neutral-700 hover:border-blue-600/50 hover:bg-neutral-800/50 transition-colors cursor-pointer text-center"
            >
              <Filter className="h-10 w-10 text-neutral-500 mb-2" />
              <p className="text-neutral-400">No conditions yet</p>
              <p className="text-sm text-neutral-500 mt-1">Click to add a condition</p>
            </div>
          )}
        </div>
      </div>

      <ConditionDialog
        open={open}
        onOpenChange={setOpen}
        selectedNode={selectedNode}
        handleUpdateNode={handleUpdateNode}
      />

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this condition?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
              onClick={() => {
                setDeleteDialog(false);
                setConditionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="bg-red-900 hover:bg-red-800 text-white"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ConditionForm };
