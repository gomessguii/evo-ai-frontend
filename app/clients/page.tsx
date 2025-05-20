/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/clients/page.tsx                                                 │
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus, MoreHorizontal, Edit, Trash2, Search, Users, UserPlus } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  createClient,
  listClients,
  getClient,
  updateClient,
  deleteClient,
  impersonateClient,
  Client,
} from "@/services/clientService"
import { useRouter } from "next/navigation"

export default function ClientsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [clientData, setClientData] = useState({
    name: "",
    email: "",
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(1000)
  const [total, setTotal] = useState(0)

  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true)
      try {
        const res = await listClients((page - 1) * limit, limit)
        setClients(res.data)
        setTotal(res.data.length)
      } catch (error) {
        toast({
          title: "Error loading clients",
          description: "Unable to load clients.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchClients()
  }, [page, limit])

  const filteredClients = Array.isArray(clients)
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, clientData)
        toast({
          title: "Client updated",
          description: `${clientData.name} was updated successfully.`,
        })
      } else {
        await createClient({ ...clientData, password: "Password@123" })
        toast({
          title: "Client added",
          description: `${clientData.name} was added successfully.`,
        })
      }
      setIsDialogOpen(false)
      resetForm()
      const res = await listClients((page - 1) * limit, limit)
      setClients(res.data)
      setTotal(res.data.length)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to save client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClient = async (client: Client) => {
    setIsLoading(true)
    try {
      const res = await getClient(client.id)
      setSelectedClient(res.data)
      setClientData({
        name: res.data.name,
        email: res.data.email,
      })
      setIsDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error searching client",
        description: "Unable to search client.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteClient = async () => {
    if (!selectedClient) return
    setIsLoading(true)
    try {
      await deleteClient(selectedClient.id)
      toast({
        title: "Client deleted",
        description: `${selectedClient.name} was deleted successfully.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedClient(null)
      const res = await listClients((page - 1) * limit, limit)
      setClients(res.data)
      setTotal(res.data.length)
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to delete client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImpersonateClient = async (client: Client) => {
    setIsLoading(true)
    try {
      const response = await impersonateClient(client.id)
      
      const currentUser = localStorage.getItem("user")
      if (currentUser) {
        localStorage.setItem("adminUser", currentUser)
      }
      
      const currentToken = document.cookie.match(/access_token=([^;]+)/)?.[1]
      if (currentToken) {
        localStorage.setItem("adminToken", currentToken)
      }
      
      localStorage.setItem("isImpersonating", "true")
      localStorage.setItem("impersonatedClient", client.name)
      
      document.cookie = `isImpersonating=true; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `impersonatedClient=${encodeURIComponent(client.name)}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`
      
      const userData = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        is_admin: false,
        client_id: client.id
      }
      localStorage.setItem("user", JSON.stringify(userData))
      document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${60 * 60 * 24 * 7}`
      
      toast({
        title: "Impersonation mode activated",
        description: `You are viewing as ${client.name}`,
      })
      
      router.push("/agents")
    } catch (error) {
      console.error("Error impersonating client:", error)
      toast({
        title: "Error",
        description: "Unable to impersonate client",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setClientData({
      name: "",
      email: "",
    })
    setSelectedClient(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Client Management</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-emerald-400 text-black hover:bg-[#00cc7d]">
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-[#333]">
            <form onSubmit={handleAddClient}>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedClient ? "Edit Client" : "New Client"}</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  {selectedClient
                    ? "Edit the existing client information."
                    : "Fill in the information to create a new client."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                    placeholder="Company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                    placeholder="contact@company.com"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-400 text-black hover:bg-[#00cc7d]" disabled={isLoading}>
                  {isLoading ? "Saving..." : selectedClient ? "Save Changes" : "Add Client"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1a1a1a] border-[#333] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm delete</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Are you sure you want to delete the client "{selectedClient?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#444] text-neutral-300 hover:bg-[#333] hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteClient}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="bg-[#1a1a1a] border-[#333] mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Search Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#222] border-[#444] text-white pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-[#333]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333] hover:bg-[#222]">
                <TableHead className="text-neutral-300">Name</TableHead>
                <TableHead className="text-neutral-300">Email</TableHead>
                <TableHead className="text-neutral-300">Created At</TableHead>
                <TableHead className="text-neutral-300">Users</TableHead>
                <TableHead className="text-neutral-300">Agents</TableHead>
                <TableHead className="text-neutral-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-[#333] hover:bg-[#222]">
                    <TableCell className="font-medium text-white">{client.name}</TableCell>
                    <TableCell className="text-neutral-300">{client.email}</TableCell>
                    <TableCell className="text-neutral-300">
                      {new Date(client.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-emerald-400" />
                        {client.users_count ?? 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-300">{client.agents_count ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-300 hover:bg-[#333]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#222] border-[#444] text-white">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#444]" />
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#333]"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="mr-2 h-4 w-4 text-emerald-400" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#333]"
                            onClick={() => handleImpersonateClient(client)}
                          >
                            <UserPlus className="mr-2 h-4 w-4 text-emerald-400" />
                            Enter as client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#333] text-red-500"
                            onClick={() => {
                              setSelectedClient(client)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
          Previous
        </Button>
        <span className="mx-4 text-white">Page {page} of {Math.ceil(total / limit) || 1}</span>
        <Button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total || isLoading}>
          Next
        </Button>
      </div>
    </div>
  )
}
