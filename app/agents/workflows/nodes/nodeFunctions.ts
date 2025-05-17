/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @author: Victor Calazans - Implementation of Delay types                     │
│ @file: /app/agents/workflows/nodes/nodeFunctions.ts                          │
│ Developed by: Davidson Gomes                                                 │
│ Delay node functionality developed by: Victor Calazans                       │
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
/* eslint-disable no-unused-vars */
export enum ConditionTypeEnum {
  PREVIOUS_OUTPUT = "previous-output",
}

export enum MessageTypeEnum {
  TEXT = "text",
}

export enum DelayUnitEnum {
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
}

export type MessageType = {
  type: MessageTypeEnum;
  content: string;
};

export type DelayType = {
  value: number;
  unit: DelayUnitEnum;
  description?: string;
};

export type ConditionType = {
  id: string;
  type: ConditionTypeEnum;
  data?: any;
};

