/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/dialogs/ApiKeysDialog.tsx                                │
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
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { ApiKey } from "@/services/agentService";
import { Edit, Eye, Key, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { availableModelProviders } from "@/types/aiModels";

interface ApiKeysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: ApiKey[];
  isLoading: boolean;
  onAddApiKey: (apiKey: {
    name: string;
    provider: string;
    key_value: string;
  }) => Promise<void>;
  onUpdateApiKey: (
    id: string,
    apiKey: {
      name: string;
      provider: string;
      key_value?: string;
      is_active: boolean;
    }
  ) => Promise<void>;
  onDeleteApiKey: (id: string) => Promise<void>;
}

export function ApiKeysDialog({
  open,
  onOpenChange,
  apiKeys,
  isLoading,
  onAddApiKey,
  onUpdateApiKey,
  onDeleteApiKey,
}: ApiKeysDialogProps) {
  const [isAddingApiKey, setIsAddingApiKey] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<
    Partial<ApiKey & { key_value?: string }>
  >({});

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<ApiKey | null>(null);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleAddClick = () => {
    setCurrentApiKey({});
    setIsAddingApiKey(true);
    setIsEditingApiKey(false);
  };

  const handleEditClick = (apiKey: ApiKey) => {
    setCurrentApiKey({ ...apiKey, key_value: "" });
    setIsAddingApiKey(true);
    setIsEditingApiKey(true);
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setApiKeyToDelete(apiKey);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveApiKey = async () => {
    if (
      !currentApiKey.name ||
      !currentApiKey.provider ||
      (!isEditingApiKey && !currentApiKey.key_value)
    ) {
      return;
    }

    try {
      if (currentApiKey.id) {
        await onUpdateApiKey(currentApiKey.id, {
          name: currentApiKey.name,
          provider: currentApiKey.provider,
          key_value: currentApiKey.key_value,
          is_active: currentApiKey.is_active !== false,
        });
      } else {
        await onAddApiKey({
          name: currentApiKey.name,
          provider: currentApiKey.provider,
          key_value: currentApiKey.key_value!,
        });
      }

      setCurrentApiKey({});
      setIsAddingApiKey(false);
      setIsEditingApiKey(false);
    } catch (error) {
      console.error("Error saving API key:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!apiKeyToDelete) return;

    try {
      await onDeleteApiKey(apiKeyToDelete.id);
      setApiKeyToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1a1a] border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white">Manage API Keys</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add and manage API keys for use in your agents
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-1">
          {isAddingApiKey ? (
            <div className="space-y-4 p-4 bg-[#222] rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  {isEditingApiKey ? "Edit Key" : "New Key"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingApiKey(false);
                    setIsEditingApiKey(false);
                    setCurrentApiKey({});
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-neutral-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={currentApiKey.name || ""}
                    onChange={(e) =>
                      setCurrentApiKey({
                        ...currentApiKey,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3 bg-[#333] border-[#444] text-white"
                    placeholder="OpenAI GPT-4"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="provider"
                    className="text-right text-neutral-300"
                  >
                    Provider
                  </Label>
                  <Select
                    value={currentApiKey.provider}
                    onValueChange={(value) =>
                      setCurrentApiKey({
                        ...currentApiKey,
                        provider: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 bg-[#333] border-[#444] text-white">
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#222] border-[#444] text-white">
                      {availableModelProviders.map((provider) => (
                        <SelectItem
                          key={provider.value}
                          value={provider.value}
                          className="data-[selected]:bg-[#333] data-[highlighted]:bg-[#333] !text-white focus:!text-white hover:text-emerald-400 data-[selected]:!text-emerald-400"
                        >
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="key_value"
                    className="text-right text-neutral-300"
                  >
                    Key Value
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="key_value"
                      value={currentApiKey.key_value || ""}
                      onChange={(e) =>
                        setCurrentApiKey({
                          ...currentApiKey,
                          key_value: e.target.value,
                        })
                      }
                      className="bg-[#333] border-[#444] text-white pr-10"
                      type={isApiKeyVisible ? "text" : "password"}
                      placeholder={
                        isEditingApiKey
                          ? "Leave blank to keep the current value"
                          : "sk-..."
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-neutral-400 hover:text-white"
                      onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isEditingApiKey && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="is_active"
                      className="text-right text-neutral-300"
                    >
                      Status
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Checkbox
                        id="is_active"
                        checked={currentApiKey.is_active !== false}
                        onCheckedChange={(checked) =>
                          setCurrentApiKey({
                            ...currentApiKey,
                            is_active: !!checked,
                          })
                        }
                        className="mr-2 data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400"
                      />
                      <Label htmlFor="is_active" className="text-neutral-300">
                        Active
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingApiKey(false);
                    setIsEditingApiKey(false);
                    setCurrentApiKey({});
                  }}
                  className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveApiKey}
                  className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-1"></div>
                  )}
                  {isEditingApiKey ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">
                  Available Keys
                </h3>
                <Button
                  onClick={handleAddClick}
                  className="bg-emerald-400 text-black hover:bg-[#00cc7d]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Key
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
                </div>
              ) : apiKeys.length > 0 ? (
                <div className="space-y-2">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-3 bg-[#222] rounded-md border border-[#333] hover:border-emerald-400/30"
                    >
                      <div>
                        <p className="font-medium text-white">{apiKey.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="bg-[#333] text-emerald-400 border-emerald-400/30"
                          >
                            {apiKey.provider.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-neutral-400">
                            Created on{" "}
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </p>
                          {!apiKey.is_active && (
                            <Badge
                              variant="outline"
                              className="bg-[#333] text-red-400 border-red-400/30"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(apiKey)}
                          className="text-neutral-300 hover:text-emerald-400 hover:bg-[#333]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(apiKey)}
                          className="text-red-500 hover:text-red-400 hover:bg-[#333]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-[#333] rounded-md bg-[#222] text-neutral-400">
                  <Key className="mx-auto h-10 w-10 text-neutral-500 mb-3" />
                  <p>You don't have any API keys registered</p>
                  <p className="text-sm mt-1">
                    Add your API keys to use them in your agents
                  </p>
                  <Button
                    onClick={handleAddClick}
                    className="mt-4 bg-[#333] text-emerald-400 hover:bg-[#444]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Key
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="border-t border-[#333] pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#222] border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirm Delete"
        description={`Are you sure you want to delete the key "${apiKeyToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </Dialog>
  );
}
