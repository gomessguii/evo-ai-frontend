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
        "bg-neutral-900 text-white flex flex-col h-full transition-all duration-300 ease-in-out border-r border-neutral-800", 
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <TooltipProvider delayDuration={300}>
        <div className={cn("p-4 mb-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/">
            {isCollapsed ? (
              <div className="h-10 w-10 flex items-center justify-center bg-neutral-800/50 rounded-full p-1">
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
                className="flex items-center justify-center p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        <nav className="space-y-1.5 flex-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? isCollapsed 
                          ? "bg-emerald-500/20 text-emerald-400 border-0" 
                          : "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                        : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800"
                    )}
                  >
                    <item.icon className={cn("flex-shrink-0", isActive ? "h-5 w-5 text-emerald-400" : "h-5 w-5")} />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn("border-t border-neutral-800 pt-4 mt-2 pb-4", isCollapsed ? "px-2" : "px-4")}>
          <div className="mb-4 relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !isCollapsed && setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "w-full flex items-center transition-colors rounded-md px-3 py-2.5",
                    isCollapsed ? "justify-center" : "justify-between",
                    userMenuOpen
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800"
                  )}
                >
                  <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
                    <User className={cn(userMenuOpen ? "text-emerald-400" : "text-neutral-400", "h-5 w-5")} />
                    {!isCollapsed && <span className="font-medium">My Account</span>}
                  </div>
                  {!isCollapsed && (
                    userMenuOpen ? (
                      <ChevronUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                  My Account
                </TooltipContent>
              )}
            </Tooltip>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-neutral-800 rounded-md overflow-hidden border border-neutral-700">
                {userMenuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-700"
                      )}
                    >
                      <item.icon className={cn(isActive ? "text-emerald-400" : "", "h-5 w-5")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="text-sm text-emerald-400 font-medium">Evo AI</div>
              <div className="text-xs text-neutral-500 mt-1">
                © {new Date().getFullYear()} Evolution API
              </div>
            </>
          )}
        </div>
      </TooltipProvider>
      
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <DialogTitle>Confirmation of Logout</DialogTitle>
            </div>
            <DialogDescription className="text-neutral-400">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLogoutDialogOpen(false)}
              className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Yes, logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
