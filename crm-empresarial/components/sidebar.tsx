"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  ShoppingCart,
  Briefcase,
  Ticket,
  Settings,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Contactos", path: "/contactos" },
  { icon: Briefcase, label: "Negocios", path: "/negocios" },
  { icon: ShoppingCart, label: "Compras", path: "/compras" },
  { icon: Ticket, label: "Tickets", path: "/tickets" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CRM Pro</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1.5">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${collapsed ? "px-2" : "px-3"} ${
                  isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => router.push(item.path)}
              >
                <Icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 text-red-600 hover:bg-red-50 hover:text-red-700 ${
            collapsed ? "px-2" : "px-3"
          }`}
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
