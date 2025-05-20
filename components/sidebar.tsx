/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /components/sidebar.tsx                                               │
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

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Grid3X3,
  Server,
  Users,
  User,
  Shield,
  LogOut,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setIsAdmin(!!parsed.is_admin);
        } catch {}
      }

      // Get saved sidebar state from localStorage
      const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsedState) {
        setIsCollapsed(savedCollapsedState === "true");
      }
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }
  }, [isCollapsed]);

  const menuItems = [
    ...(!isAdmin
      ? [
          {
            name: "Agents",
            href: "/agents",
            icon: Grid3X3,
          },
          {
            name: "Chat",
            href: "/chat",
            icon: MessageSquare,
          },
          {
            name: "Documentation",
            href: "/documentation",
            icon: FileText,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            name: "MCP Servers",
            href: "/mcp-servers",
            icon: Server,
          },
          {
            name: "Clients",
            href: "/clients",
            icon: Users,
          },
          {
            name: "Documentation",
            href: "/documentation",
            icon: FileText,
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      onClick: () => {}
    },
    {
      name: "Security",
      href: "/security",
      icon: Shield,
      onClick: () => {}
    },
    {
      name: "Logout",
      href: "#",
      icon: LogOut,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setLogoutDialogOpen(true)
        setUserMenuOpen(false)
      }
    },
  ];
  
  const handleLogout = () => {
    setLogoutDialogOpen(false)
    router.push("/logout")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "bg-[#121212] text-white flex flex-col h-full transition-all duration-300 ease-in-out", 
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <TooltipProvider delayDuration={300}>
        <div className={cn("p-4 mb-8 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/">
            {isCollapsed ? (
              <div className="h-10 w-10 flex items-center justify-center">
                <Image
                  src="https://evolution-api.com/files/evo/favicon.svg"
                  alt="Evolution API"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <Image
                src="https://evolution-api.com/files/evo/logo-evo-ai.svg"
                alt="Evolution API"
                width={90}
                height={40}
                className="mt-2"
              />
            )}
          </Link>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-[#00ff9d] hover:bg-[#1a1a1a] transition-colors"
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-5 w-5" />
                ) : (
                  <ChevronsLeft className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#1a1a1a] text-white border-[#333]">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        <nav className="space-y-2 flex-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? isCollapsed 
                          ? "bg-[#1a1a1a] text-[#00ff9d] border-l-0 border-t-2 border-[#00ff9d]" 
                          : "bg-[#1a1a1a] text-[#00ff9d] border-l-2 border-[#00ff9d]"
                        : "text-gray-400 hover:text-[#00ff9d] hover:bg-[#1a1a1a]"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-[#1a1a1a] text-white border-[#333]">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn("border-t border-gray-800 pt-4 mt-4", isCollapsed ? "px-2" : "px-4")}>
          <div className="mb-4 relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !isCollapsed && setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "w-full flex items-center transition-colors rounded-md px-3 py-2",
                    isCollapsed ? "justify-center" : "justify-between",
                    userMenuOpen
                      ? "bg-[#1a1a1a] text-[#00ff9d]"
                      : "text-gray-400 hover:text-[#00ff9d] hover:bg-[#1a1a1a]"
                  )}
                >
                  <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
                    <User className="h-5 w-5" />
                    {!isCollapsed && <span>My Account</span>}
                  </div>
                  {!isCollapsed && (
                    userMenuOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-[#1a1a1a] text-white border-[#333]">
                  My Account
                </TooltipContent>
              )}
            </Tooltip>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-[#1a1a1a] rounded-md overflow-hidden shadow-lg">
                {userMenuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 transition-colors",
                        isActive
                          ? "bg-[#252525] text-[#00ff9d]"
                          : "text-gray-400 hover:text-[#00ff9d] hover:bg-[#252525]"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="text-sm text-gray-400">Evo AI</div>
              <div className="text-xs text-gray-500 mt-1">
                © {new Date().getFullYear()} Evolution API
              </div>
            </>
          )}
        </div>
      </TooltipProvider>
      
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <DialogTitle>Confirmation of Logout</DialogTitle>
            </div>
            <DialogDescription className="text-gray-400">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLogoutDialogOpen(false)}
              className="bg-[#222] border-[#444] text-gray-300 hover:bg-[#333] hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-[#00ff9d] text-black hover:bg-[#00cc7d]"
            >
              Yes, logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
