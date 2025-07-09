"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingCart, Briefcase, Ticket, TrendingUp, DollarSign, Activity, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getDashboardStats, getRecentActivities } from "@/lib/data"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    setStats(getDashboardStats())
    setActivities(getRecentActivities())
  }, [router])

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
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido, {user.name}</h1>
              <p className="text-gray-600">Aquí tienes un resumen de tu actividad empresarial</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Contactos</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats?.contacts}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Negocios Activos</CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats?.deals}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Tickets Abiertos</CardTitle>
                  <Ticket className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats?.tickets}</div>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />3 críticos
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ingresos del Mes</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">${stats?.revenue?.toLocaleString()}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en tu CRM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {activity.time}
                          </p>
                        </div>
                        <Badge variant={activity.type === "success" ? "default" : "secondary"}>{activity.module}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Acciones Rápidas</CardTitle>
                  <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => router.push("/contactos")}
                    >
                      <Users className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Nuevo Contacto</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => router.push("/negocios")}
                    >
                      <Briefcase className="h-6 w-6 text-green-600" />
                      <span className="text-sm">Nuevo Negocio</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => router.push("/tickets")}
                    >
                      <Ticket className="h-6 w-6 text-orange-600" />
                      <span className="text-sm">Crear Ticket</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                      onClick={() => router.push("/compras")}
                    >
                      <ShoppingCart className="h-6 w-6 text-purple-600" />
                      <span className="text-sm">Nueva Compra</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
