"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Plus, Search, DollarSign, Calendar, TrendingUp, Edit, Trash2, Filter, Users, Briefcase } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getDeals, getContacts } from "@/lib/data"

export default function Negocios() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [deals, setDeals] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [filteredDeals, setFilteredDeals] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStage, setFilterStage] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    value: "",
    stage: "qualification",
    probability: "50",
    expectedCloseDate: "",
    description: "",
    contactId: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    const dealsData = getDeals()
    const contactsData = getContacts()
    setDeals(dealsData)
    setContacts(contactsData)
    setFilteredDeals(dealsData)
  }, [router])

  useEffect(() => {
    let filtered = deals

    if (searchTerm) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.client.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStage !== "all") {
      filtered = filtered.filter((deal) => deal.stage === filterStage)
    }

    setFilteredDeals(filtered)
  }, [deals, searchTerm, filterStage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDeal) {
      const updatedDeals = deals.map((deal) =>
        deal.id === editingDeal.id
          ? {
              ...deal,
              ...formData,
              value: Number.parseFloat(formData.value),
              probability: Number.parseInt(formData.probability),
              updatedAt: new Date().toISOString(),
            }
          : deal,
      )
      setDeals(updatedDeals)
    } else {
      const newDeal = {
        id: Date.now(),
        ...formData,
        value: Number.parseFloat(formData.value),
        probability: Number.parseInt(formData.probability),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDeals([newDeal, ...deals])
    }

    setIsDialogOpen(false)
    setEditingDeal(null)
    setFormData({
      title: "",
      client: "",
      value: "",
      stage: "qualification",
      probability: "50",
      expectedCloseDate: "",
      description: "",
      contactId: "",
    })
  }

  const handleEdit = (deal: any) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      client: deal.client,
      value: deal.value.toString(),
      stage: deal.stage,
      probability: deal.probability.toString(),
      expectedCloseDate: deal.expectedCloseDate,
      description: deal.description,
      contactId: deal.contactId?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (dealId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este negocio?")) {
      setDeals(deals.filter((deal) => deal.id !== dealId))
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "qualification":
        return "bg-yellow-100 text-yellow-800"
      case "proposal":
        return "bg-blue-100 text-blue-800"
      case "negotiation":
        return "bg-orange-100 text-orange-800"
      case "closed-won":
        return "bg-green-100 text-green-800"
      case "closed-lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "qualification":
        return "Calificación"
      case "proposal":
        return "Propuesta"
      case "negotiation":
        return "Negociación"
      case "closed-won":
        return "Cerrado Ganado"
      case "closed-lost":
        return "Cerrado Perdido"
      default:
        return stage
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600"
    if (probability >= 50) return "text-yellow-600"
    if (probability >= 25) return "text-orange-600"
    return "text-red-600"
  }

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0)
  const avgProbability =
    filteredDeals.length > 0 ? filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length : 0

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
                <h1 className="text-3xl font-bold text-gray-900">Negocios</h1>
                <p className="text-gray-600 mt-1">Gestiona tu pipeline de ventas y oportunidades</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Negocio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingDeal ? "Editar Negocio" : "Nuevo Negocio"}</DialogTitle>
                    <DialogDescription>
                      {editingDeal
                        ? "Modifica la información del negocio"
                        : "Completa la información para crear un nuevo negocio"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título del negocio *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client">Cliente *</Label>
                        <Input
                          id="client"
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Valor (€) *</Label>
                        <Input
                          id="value"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.value}
                          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stage">Etapa</Label>
                        <Select
                          value={formData.stage}
                          onValueChange={(value) => setFormData({ ...formData, stage: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qualification">Calificación</SelectItem>
                            <SelectItem value="proposal">Propuesta</SelectItem>
                            <SelectItem value="negotiation">Negociación</SelectItem>
                            <SelectItem value="closed-won">Cerrado Ganado</SelectItem>
                            <SelectItem value="closed-lost">Cerrado Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="probability">Probabilidad (%)</Label>
                        <Input
                          id="probability"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.probability}
                          onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expectedCloseDate">Fecha esperada de cierre</Label>
                        <Input
                          id="expectedCloseDate"
                          type="date"
                          value={formData.expectedCloseDate}
                          onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setEditingDeal(null)
                          setFormData({
                            title: "",
                            client: "",
                            value: "",
                            stage: "qualification",
                            probability: "50",
                            expectedCloseDate: "",
                            description: "",
                            contactId: "",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingDeal ? "Actualizar" : "Crear"} Negocio
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
                  <CardTitle className="text-sm font-medium text-gray-600">Valor Total Pipeline</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">€{totalValue.toLocaleString()}</div>
                  <p className="text-xs text-gray-600 mt-1">{filteredDeals.length} negocios activos</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Probabilidad Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getProbabilityColor(avgProbability)}`}>
                    {avgProbability.toFixed(0)}%
                  </div>
                  <Progress value={avgProbability} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Negocios Este Mes</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      deals.filter((deal) => {
                        const dealDate = new Date(deal.createdAt)
                        const now = new Date()
                        return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear()
                      }).length
                    }
                  </div>
                  <p className="text-xs text-green-600 mt-1">+2 desde la semana pasada</p>
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
                        placeholder="Buscar negocios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={filterStage} onValueChange={setFilterStage}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las etapas</SelectItem>
                        <SelectItem value="qualification">Calificación</SelectItem>
                        <SelectItem value="proposal">Propuesta</SelectItem>
                        <SelectItem value="negotiation">Negociación</SelectItem>
                        <SelectItem value="closed-won">Cerrado Ganado</SelectItem>
                        <SelectItem value="closed-lost">Cerrado Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{deal.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {deal.client}
                        </CardDescription>
                      </div>
                      <Badge className={getStageColor(deal.stage)}>{getStageLabel(deal.stage)}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-gray-900">€{deal.value.toLocaleString()}</span>
                      </div>
                      <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                        {deal.probability}%
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Probabilidad</span>
                        <span>{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2" />
                    </div>

                    {deal.expectedCloseDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Cierre esperado: {new Date(deal.expectedCloseDate).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}

                    {deal.description && <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>}

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(deal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(deal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Briefcase className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron negocios</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStage !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza agregando tu primer negocio"}
                </p>
                {!searchTerm && filterStage === "all" && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Negocio
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
