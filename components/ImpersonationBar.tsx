/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/components/ImpersonationBar.tsx                                  │
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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UserX } from "lucide-react";

export default function ImpersonationBar() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [clientName, setClientName] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const checkImpersonation = () => {
    if (typeof window === 'undefined') return;
    
    const lsImpersonating = localStorage.getItem('isImpersonating') === 'true';
    
    const cookieImpersonating = document.cookie
      .split('; ')
      .find(row => row.startsWith('isImpersonating='))
      ?.split('=')[1] === 'true';
    
    let name = localStorage.getItem('impersonatedClient') || '';
    
    if (!name) {
      const clientNameCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('impersonatedClient='));
      
      if (clientNameCookie) {
        name = decodeURIComponent(clientNameCookie.split('=')[1]);
      }
    }
    
    setIsImpersonating(lsImpersonating || cookieImpersonating);
    setClientName(name);
  };

  useEffect(() => {
    checkImpersonation();
    
    const intervalId = setInterval(checkImpersonation, 2000);
    
    window.addEventListener('storage', checkImpersonation);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', checkImpersonation);
    };
  }, []);

  const handleExitImpersonation = () => {
    const adminUserJson = localStorage.getItem('adminUser');
    if (adminUserJson) {
      localStorage.setItem('user', adminUserJson);
      document.cookie = `user=${encodeURIComponent(adminUserJson)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.removeItem('adminUser');
    }
    
    localStorage.removeItem('isImpersonating');
    localStorage.removeItem('impersonatedClient');
    
    document.cookie = 'isImpersonating=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'impersonatedClient=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      document.cookie = `access_token=${adminToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.setItem('access_token', adminToken);
      localStorage.removeItem('adminToken');
    }
    
    toast({
      title: "Admin mode restored",
      description: "You are no longer impersonating a client",
    });
    
    router.push('/clients');
  };

  if (!isImpersonating) return null;

  return (
    <div className="bg-[#a4fc9c] text-black py-2 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <p>
          You are viewing as a client: <span className="font-bold">{clientName}</span>
        </p>
        <Button
          onClick={handleExitImpersonation}
          className="bg-black text-white hover:bg-neutral-800 flex items-center gap-2"
        >
          <UserX className="h-4 w-4" />
          Back to admin
        </Button>
      </div>
    </div>
  );
} 