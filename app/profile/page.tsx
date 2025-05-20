/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/profile/page.tsx                                                 │
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

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) return JSON.parse(user)
    }
    return {
      id: "",
      name: "",
      email: "",
      is_admin: false,
      email_verified: false,
      created_at: "",
    }
  })

  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: userData.email,
  })
  useEffect(() => {
    setProfileData({ name: userData.name, email: userData.email })
  }, [userData])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUserData({
        ...userData,
        name: profileData.name,
        email: profileData.email,
      })

      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Unable to update your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`} />
                  <AvatarFallback className="text-2xl bg-emerald-400 text-black">
                    {(userData.name || "?")
                      .split(" ")
                      .filter(Boolean)
                      .map((n: string) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-white text-xl">{userData.name}</CardTitle>
                <CardDescription className="text-neutral-400">{userData.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-neutral-300">
                  <span>ID:</span>
                  <span className="text-neutral-400 truncate max-w-[180px]">{userData.id}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Account Type:</span>
                  <span className="text-neutral-400">{userData.is_admin ? "Administrator" : "Client"}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Email Verified:</span>
                  <span className="text-neutral-400">{userData.email_verified ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Created at:</span>
                  <span className="text-neutral-400">{new Date(userData.created_at).toLocaleDateString("en-US")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="bg-[#1a1a1a] border-[#333]">
            <form onSubmit={handleProfileUpdate}>
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-neutral-400">Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
