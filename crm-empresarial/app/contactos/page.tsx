"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Mail, Phone, Building, MapPin, Edit, Trash2, Filter } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getContacts } from "@/lib/data"
import { Users } from "lucide-react" // Import Users component

export default function Contactos() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    address: "",
    notes: "",
    status: "active",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    const contactsData = getContacts()
    setContacts(contactsData)
    setFilteredContacts(contactsData)
  }, [router])

  useEffect(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((contact) => contact.status === filterStatus)
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, filterStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingContact) {
      // Editar contacto existente
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id ? { ...contact, ...formData, updatedAt: new Date().toISOString() } : contact,
      )
      setContacts(updatedContacts)
    } else {
      // Crear nuevo contacto
      const newContact = {
        id: Date.now(),
        ...formData,
        avatar: `/placeholder.svg?height=40&width=40`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setContacts([newContact, ...contacts])
    }

    setIsDialogOpen(false)
    setEditingContact(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      notes: "",
      status: "active",
    })
  }

  const handleEdit = (contact: any) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      position: contact.position,
      address: contact.address,
      notes: contact.notes || "",
      status: contact.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (contactId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      setContacts(contacts.filter((contact) => contact.id !== contactId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "prospect":
        return "Prospecto"
      default:
        return status
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
                <p className="text-gray-600 mt-1">Gestiona tu base de datos de contactos</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Contacto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingContact ? "Editar Contacto" : "Nuevo Contacto"}</DialogTitle>
                    <DialogDescription>
                      {editingContact
                        ? "Modifica la información del contacto"
                        : "Completa la información para crear un nuevo contacto"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Cargo</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                            <SelectItem value="prospect">Prospecto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setEditingContact(null)
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            company: "",
                            position: "",
                            address: "",
                            notes: "",
                            status: "active",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingContact ? "Actualizar" : "Crear"} Contacto
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card className="mb-6 border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar contactos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                        <SelectItem value="prospect">Prospectos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {contact.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <CardDescription>{contact.position}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(contact.status)}>{getStatusLabel(contact.status)}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{contact.company}</span>
                      </div>

                      {contact.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{contact.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando tu primer contacto"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Contacto
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
