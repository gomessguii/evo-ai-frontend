/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/logout/page.tsx                                                  │
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
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = () => {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")

      localStorage.removeItem("impersonatedClient")
      localStorage.removeItem("isImpersonating")

      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "impersonatedClient=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "isImpersonating=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }

    performLogout()
  }, [router])

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="bg-[#1a1a1a] border-[#333] w-full max-w-md p-8">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center animate-pulse">
            <LogOut className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-medium mt-4">Logging out...</h2>
          <p className="text-neutral-400 text-center">
            You are being logged out of the system.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 