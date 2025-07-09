"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, AlertCircle, Clock, CheckCircle, Edit, Trash2, Filter, User, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getTickets } from "@/lib/data"

export default function Tickets() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [filteredTickets, setFilteredTickets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    category: "technical",
    assignedTo: "",
    clientName: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    const ticketsData = getTickets()
    setTickets(ticketsData)
    setFilteredTickets(ticketsData)
  }, [router])

  useEffect(() => {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === filterPriority)
    }

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, filterStatus, filterPriority])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === editingTicket.id ? { ...ticket, ...formData, updatedAt: new Date().toISOString() } : ticket,
      )
      setTickets(updatedTickets)
    } else {
      const newTicket = {
        id: Date.now(),
        ...formData,
        clientId: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTickets([newTicket, ...tickets])
    }

    setIsDialogOpen(false)
    setEditingTicket(null)
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      category: "technical",
      assignedTo: "",
      clientName: "",
    })
  }

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket)
    setFormData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      category: ticket.category,
      assignedTo: ticket.assignedTo,
      clientName: ticket.clientName,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (ticketId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este ticket?")) {
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto"
      case "in-progress":
        return "En Progreso"
      case "resolved":
        return "Resuelto"
      case "closed":
        return "Cerrado"
      case "scheduled":
        return "Programado"
      default:
        return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "technical":
        return "Técnico"
      case "billing":
        return "Facturación"
      case "feature-request":
        return "Nueva Funcionalidad"
      case "performance":
        return "Rendimiento"
      case "training":
        return "Capacitación"
      default:
        return category
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
  const highPriorityTickets = tickets.filter((t) => t.priority === "high").length

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
                <h1 className="text-3xl font-bold text-gray-900">Tickets de Soporte</h1>
                <p className="text-gray-600 mt-1">Gestiona las solicitudes y problemas de tus clientes</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTicket ? "Editar Ticket" : "Nuevo Ticket"}</DialogTitle>
                    <DialogDescription>
                      {editingTicket
                        ? "Modifica la información del ticket"
                        : "Completa la información para crear un nuevo ticket"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título del ticket *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <SelectItem value="open">Abierto</SelectItem>
                            <SelectItem value="in-progress">En Progreso</SelectItem>
                            <SelectItem value="resolved">Resuelto</SelectItem>
                            <SelectItem value="closed">Cerrado</SelectItem>
                            <SelectItem value="scheduled">Programado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Técnico</SelectItem>
                            <SelectItem value="billing">Facturación</SelectItem>
                            <SelectItem value="feature-request">Nueva Funcionalidad</SelectItem>
                            <SelectItem value="performance">Rendimiento</SelectItem>
                            <SelectItem value="training">Capacitación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Asignado a</Label>
                        <Input
                          id="assignedTo"
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientName">Cliente</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setEditingTicket(null)
                          setFormData({
                            title: "",
                            description: "",
                            priority: "medium",
                            status: "open",
                            category: "technical",
                            assignedTo: "",
                            clientName: "",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingTicket ? "Actualizar" : "Crear"} Ticket
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Tickets Abiertos</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{openTickets}</div>
                  <p className="text-xs text-gray-600 mt-1">Requieren atención</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">En Progreso</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{inProgressTickets}</div>
                  <p className="text-xs text-gray-600 mt-1">Siendo trabajados</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Alta Prioridad</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{highPriorityTickets}</div>
                  <p className="text-xs text-gray-600 mt-1">Atención urgente</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6 border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar tickets..."
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
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="open">Abiertos</SelectItem>
                        <SelectItem value="in-progress">En Progreso</SelectItem>
                        <SelectItem value="resolved">Resueltos</SelectItem>
                        <SelectItem value="closed">Cerrados</SelectItem>
                        <SelectItem value="scheduled">Programados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-1 rounded-full ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.clientName}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span>Categoría:</span>
                            <span className="font-medium">{getCategoryLabel(ticket.category)}</span>
                          </div>

                          {ticket.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <span>Asignado a:</span>
                              <span className="font-medium">{ticket.assignedTo}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString("es-ES")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(ticket)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ticket.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tickets</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer ticket"}
                </p>
                {!searchTerm && filterStatus === "all" && filterPriority === "all" && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Ticket
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
