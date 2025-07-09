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
import {
  Plus,
  Search,
  DollarSign,
  Package,
  Calendar,
  Edit,
  Trash2,
  Filter,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getPurchases } from "@/lib/data"

export default function Compras() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    supplier: "",
    category: "software",
    amount: "",
    quantity: "1",
    unitPrice: "",
    status: "pending",
    orderDate: "",
    deliveryDate: "",
    description: "",
    approvedBy: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    const purchasesData = getPurchases()
    setPurchases(purchasesData)
    setFilteredPurchases(purchasesData)
  }, [router])

  useEffect(() => {
    let filtered = purchases

    if (searchTerm) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((purchase) => purchase.status === filterStatus)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((purchase) => purchase.category === filterCategory)
    }

    setFilteredPurchases(filtered)
  }, [purchases, searchTerm, filterStatus, filterCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const calculatedAmount = Number.parseFloat(formData.quantity) * Number.parseFloat(formData.unitPrice)

    if (editingPurchase) {
      const updatedPurchases = purchases.map((purchase) =>
        purchase.id === editingPurchase.id
          ? {
              ...purchase,
              ...formData,
              amount: calculatedAmount,
              quantity: Number.parseInt(formData.quantity),
              unitPrice: Number.parseFloat(formData.unitPrice),
            }
          : purchase,
      )
      setPurchases(updatedPurchases)
    } else {
      const newPurchase = {
        id: Date.now(),
        ...formData,
        amount: calculatedAmount,
        quantity: Number.parseInt(formData.quantity),
        unitPrice: Number.parseFloat(formData.unitPrice),
      }
      setPurchases([newPurchase, ...purchases])
    }

    setIsDialogOpen(false)
    setEditingPurchase(null)
    setFormData({
      title: "",
      supplier: "",
      category: "software",
      amount: "",
      quantity: "1",
      unitPrice: "",
      status: "pending",
      orderDate: "",
      deliveryDate: "",
      description: "",
      approvedBy: "",
    })
  }

  const handleEdit = (purchase: any) => {
    setEditingPurchase(purchase)
    setFormData({
      title: purchase.title,
      supplier: purchase.supplier,
      category: purchase.category,
      amount: purchase.amount.toString(),
      quantity: purchase.quantity.toString(),
      unitPrice: purchase.unitPrice.toString(),
      status: purchase.status,
      orderDate: purchase.orderDate ? purchase.orderDate.split("T")[0] : "",
      deliveryDate: purchase.deliveryDate ? purchase.deliveryDate.split("T")[0] : "",
      description: purchase.description,
      approvedBy: purchase.approvedBy,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (purchaseId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta compra?")) {
      setPurchases(purchases.filter((purchase) => purchase.id !== purchaseId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "software":
        return "bg-purple-100 text-purple-800"
      case "hardware":
        return "bg-blue-100 text-blue-800"
      case "services":
        return "bg-green-100 text-green-800"
      case "furniture":
        return "bg-orange-100 text-orange-800"
      case "security":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "approved":
        return "Aprobado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "software":
        return "Software"
      case "hardware":
        return "Hardware"
      case "services":
        return "Servicios"
      case "furniture":
        return "Mobiliario"
      case "security":
        return "Seguridad"
      default:
        return category
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const completedPurchases = purchases.filter((p) => p.status === "completed").length
  const pendingPurchases = purchases.filter((p) => p.status === "pending").length

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
                <h1 className="text-3xl font-bold text-gray-900">Compras</h1>
                <p className="text-gray-600 mt-1">Gestiona las compras y adquisiciones de tu empresa</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Compra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingPurchase ? "Editar Compra" : "Nueva Compra"}</DialogTitle>
                    <DialogDescription>
                      {editingPurchase
                        ? "Modifica la información de la compra"
                        : "Completa la información para registrar una nueva compra"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título de la compra *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Proveedor *</Label>
                        <Input
                          id="supplier"
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          required
                        />
                      </div>

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
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="services">Servicios</SelectItem>
                            <SelectItem value="furniture">Mobiliario</SelectItem>
                            <SelectItem value="security">Seguridad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unitPrice">Precio unitario (€) *</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.unitPrice}
                          onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total (€)</Label>
                        <Input
                          value={
                            formData.quantity && formData.unitPrice
                              ? (Number.parseFloat(formData.quantity) * Number.parseFloat(formData.unitPrice)).toFixed(
                                  2,
                                )
                              : "0.00"
                          }
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="approved">Aprobado</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="approvedBy">Aprobado por</Label>
                        <Input
                          id="approvedBy"
                          value={formData.approvedBy}
                          onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderDate">Fecha de pedido</Label>
                        <Input
                          id="orderDate"
                          type="date"
                          value={formData.orderDate}
                          onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Fecha de entrega</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
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
                          setEditingPurchase(null)
                          setFormData({
                            title: "",
                            supplier: "",
                            category: "software",
                            amount: "",
                            quantity: "1",
                            unitPrice: "",
                            status: "pending",
                            orderDate: "",
                            deliveryDate: "",
                            description: "",
                            approvedBy: "",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingPurchase ? "Actualizar" : "Registrar"} Compra
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
                  <CardTitle className="text-sm font-medium text-gray-600">Total Gastado</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">€{totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-gray-600 mt-1">En {filteredPurchases.length} compras</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Compras Completadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{completedPurchases}</div>
                  <p className="text-xs text-gray-600 mt-1">Entregadas exitosamente</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Compras Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{pendingPurchases}</div>
                  <p className="text-xs text-gray-600 mt-1">Esperando procesamiento</p>
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
                        placeholder="Buscar compras..."
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
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="approved">Aprobados</SelectItem>
                        <SelectItem value="completed">Completados</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="services">Servicios</SelectItem>
                        <SelectItem value="furniture">Mobiliario</SelectItem>
                        <SelectItem value="security">Seguridad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchases List */}
            <div className="space-y-4">
              {filteredPurchases.map((purchase) => (
                <Card key={purchase.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-1 rounded-full ${getStatusColor(purchase.status)}`}>
                            {getStatusIcon(purchase.status)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{purchase.title}</h3>
                          <Badge className={getCategoryColor(purchase.category)}>
                            {getCategoryLabel(purchase.category)}
                          </Badge>
                          <Badge className={getStatusColor(purchase.status)}>{getStatusLabel(purchase.status)}</Badge>
                        </div>

                        <p className="text-gray-600 mb-4">{purchase.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Proveedor</p>
                              <p className="text-sm font-medium">{purchase.supplier}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Cantidad</p>
                              <p className="text-sm font-medium">{purchase.quantity} unidades</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Precio unitario</p>
                              <p className="text-sm font-medium">€{purchase.unitPrice.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-lg font-bold text-green-600">€{purchase.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          {purchase.orderDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Pedido: {new Date(purchase.orderDate).toLocaleDateString("es-ES")}</span>
                            </div>
                          )}

                          {purchase.deliveryDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Entrega: {new Date(purchase.deliveryDate).toLocaleDateString("es-ES")}</span>
                            </div>
                          )}

                          {purchase.approvedBy && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>Aprobado por: {purchase.approvedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(purchase)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(purchase.id)}
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

            {filteredPurchases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Package className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron compras</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza registrando tu primera compra"}
                </p>
                {!searchTerm && filterStatus === "all" && filterCategory === "all" && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Compra
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
