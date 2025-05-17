/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/agents/workflows/CanvaMenu.tsx                                   │
│ Developed by: Davidson Gomes                                                 │
│ Delay node menu option developed by: Victor Calazans                         │
│ Creation date: May 13, 2025                                                  │
│ Delay implementation date: May 17, 2025                                      │
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
import { Clock, FilterIcon, MessageCircle, PlusIcon, Shuffle, User, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useDnD } from "@/contexts/DnDContext";

function CanvaMenu({
  externalOpen,
  setExternalOpen,
  handleAddNode,
  isOpen,
  setIsOpen,
}: {
  externalOpen: any;
  setExternalOpen: (value: any) => void;
  handleAddNode: (type: string, position: { x: number; y: number }) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { setType } = useDnD();

  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setExternalOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setExternalOpen, setIsOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDragStart = (event: any, nodeType: any) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      setIsOpen(false);
      setExternalOpen(null);
    }, 500);
  };

  const addNode = (type: string) => {
    if (!externalOpen) {
      console.log("externalOpen is empty, unable to add node");
      return;
    }

    // Verificar se externalOpen tem a propriedade position
    if (!externalOpen.position) {
      console.log("externalOpen does not have the position property:", externalOpen);
      return;
    }

    console.log("Adding node of type:", type, "with data:", externalOpen);
    handleAddNode(type, externalOpen);

    setIsOpen(false);
    setExternalOpen(null);
  };

  // Handle just click without drag (for mobile or easier use)
  const handleItemClick = (type: string) => {
    if (externalOpen) {
      addNode(type);
    } else {
      console.log("Item clicked, but no position data available");
      setIsOpen(false);
    }
  };

  return (
    <>
      <div ref={buttonRef}>
        <Button
          className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white shadow-lg  bg-gray-800 hover:bg-gray-700"
          onClick={toggleMenu}
        >
          <PlusIcon size={32} />
        </Button>
      </div>
      {isOpen && (
        <div ref={menuRef}>
          <Card className="absolute right-20 top-5 z-50 mr-5 w-96 p-2 pt-8 shadow-lg bg-gray-800 text-white">
            <CardContent>
              <div className="mb-4">
                <h4 className="mb-4 text-sm font-medium">Content</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed p-4 border-gray-700 hover:bg-gray-700"
                    draggable={true}
                    onDragStart={(event) => {
                      handleDragStart(event, "agent-node");
                    }}
                    onClick={() => handleItemClick("agent-node")}
                  >
                    <User size={20} className="text-blue-500" />
                    <span>Agent</span>
                  </div>
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed p-4 border-gray-700 hover:bg-gray-700"
                    draggable={true}
                    onDragStart={(event) => {
                      handleDragStart(event, "message-node");
                    }}
                    onClick={() => handleItemClick("message-node")}
                  >
                    <MessageCircle size={20} className="text-orange-500" />
                    <span>Message</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="mb-4 text-sm font-medium">Logic</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed p-4 border-gray-700 hover:bg-gray-700"
                    draggable={true}
                    onDragStart={(event) => {
                      handleDragStart(event, "condition-node");
                    }}
                    onClick={() => handleItemClick("condition-node")}
                  >
                    <FilterIcon size={20} className="text-blue-500" />
                    <span>Condition</span>
                  </div>
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed p-4 border-gray-700 hover:bg-gray-700"
                    draggable={true}
                    onDragStart={(event) => {
                      handleDragStart(event, "delay-node");
                    }}
                    onClick={() => handleItemClick("delay-node")}
                  >
                    <Clock size={20} className="text-yellow-500" />
                    <span>Delay</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export { CanvaMenu };
