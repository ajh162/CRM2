"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Building,
  Bell,
  Shield,
  Settings,
  Database,
  Mail,
  Phone,
  Globe,
  Save,
  Upload,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Configuracion() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Estados para diferentes secciones de configuración
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    bio: "",
    avatar: "",
  })

  const [companyData, setCompanyData] = useState({
    name: "CRM Empresarial S.L.",
    industry: "technology",
    size: "50-100",
    website: "https://crm-empresarial.com",
    phone: "+34 900 123 456",
    email: "info@crm-empresarial.com",
    address: "Calle de la Innovación 123, Madrid, España",
    taxId: "B12345678",
    description: "Empresa líder en soluciones CRM para el mercado empresarial",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newContacts: true,
    newDeals: true,
    ticketUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAlerts: true,
    ipRestriction: false,
    allowedIPs: "",
  })

  const [systemSettings, setSystemSettings] = useState({
    language: "es",
    timezone: "Europe/Madrid",
    dateFormat: "DD/MM/YYYY",
    currency: "EUR",
    theme: "light",
    autoSave: true,
    backupFrequency: "daily",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      position: parsedUser.position || "Administrador",
      bio: parsedUser.bio || "",
      avatar: parsedUser.avatar || "",
    })

    // Cargar configuraciones guardadas
    const savedCompanyData = localStorage.getItem("companyData")
    if (savedCompanyData) {
      setCompanyData(JSON.parse(savedCompanyData))
    }

    const savedNotificationSettings = localStorage.getItem("notificationSettings")
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }

    const savedSecuritySettings = localStorage.getItem("securitySettings")
    if (savedSecuritySettings) {
      setSecuritySettings(JSON.parse(savedSecuritySettings))
    }

    const savedSystemSettings = localStorage.getItem("systemSettings")
    if (savedSystemSettings) {
      setSystemSettings(JSON.parse(savedSystemSettings))
    }
  }, [router])

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!profileData.name || !profileData.email) {
        throw new Error("Nombre y email son obligatorios")
      }

      if (!profileData.email.includes("@")) {
        throw new Error("Email no válido")
      }

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar usuario en localStorage
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      showMessage("success", "Perfil actualizado correctamente")
    } catch (error: any) {
      showMessage("error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("companyData", JSON.stringify(companyData))
      showMessage("success", "Información de empresa actualizada")
    } catch (error: any) {
      showMessage("error", "Error al guardar información de empresa")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
      showMessage("success", "Configuración de notificaciones guardada")
    } catch (error: any) {
      showMessage("error", "Error al guardar configuración")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("securitySettings", JSON.stringify(securitySettings))
      showMessage("success", "Configuración de seguridad guardada")
    } catch (error: any) {
      showMessage("error", "Error al guardar configuración de seguridad")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSystem = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("systemSettings", JSON.stringify(systemSettings))
      showMessage("success", "Configuración del sistema guardada")
    } catch (error: any) {
      showMessage("error", "Error al guardar configuración del sistema")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error("Todos los campos son obligatorios")
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
      }

      if (passwordData.currentPassword !== "admin123") {
        throw new Error("Contraseña actual incorrecta")
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      showMessage("success", "Contraseña cambiada correctamente")
    } catch (error: any) {
      showMessage("error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = () => {
    // Simular subida de avatar
    const newAvatar = `/placeholder.svg?height=100&width=100&text=${profileData.name.charAt(0)}`
    setProfileData({ ...profileData, avatar: newAvatar })
    showMessage("success", "Avatar actualizado")
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600 mt-1">Gestiona la configuración de tu cuenta y sistema</p>
            </div>

            {/* Message Alert */}
            {message && (
              <Alert
                className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Empresa</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notificaciones</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Seguridad</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Sistema</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Integraciones</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Actualiza tu información de perfil</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo *</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Cargo</Label>
                            <Input
                              id="position"
                              value={profileData.position}
                              onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Biografía</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={3}
                            placeholder="Cuéntanos sobre ti..."
                          />
                        </div>

                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                          {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    {/* Avatar Card */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Foto de Perfil</CardTitle>
                        <CardDescription>Actualiza tu avatar</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                          <AvatarFallback className="bg-blue-600 text-white text-2xl">
                            {profileData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={handleAvatarUpload} className="w-full bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Foto
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Change Password Card */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Cambiar Contraseña</CardTitle>
                        <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Contraseña actual</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva contraseña</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                          </div>

                          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                            {loading ? "Cambiando..." : "Cambiar Contraseña"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Company Tab */}
              <TabsContent value="company">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Información de la Empresa</CardTitle>
                    <CardDescription>Configura los datos de tu organización</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveCompany} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Nombre de la empresa</Label>
                          <Input
                            id="companyName"
                            value={companyData.name}
                            onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industria</Label>
                          <Select
                            value={companyData.industry}
                            onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Tecnología</SelectItem>
                              <SelectItem value="finance">Finanzas</SelectItem>
                              <SelectItem value="healthcare">Salud</SelectItem>
                              <SelectItem value="education">Educación</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufactura</SelectItem>
                              <SelectItem value="consulting">Consultoría</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Tamaño de la empresa</Label>
                          <Select
                            value={companyData.size}
                            onValueChange={(value) => setCompanyData({ ...companyData, size: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 empleados</SelectItem>
                              <SelectItem value="11-50">11-50 empleados</SelectItem>
                              <SelectItem value="51-100">51-100 empleados</SelectItem>
                              <SelectItem value="101-500">101-500 empleados</SelectItem>
                              <SelectItem value="500+">500+ empleados</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxId">NIF/CIF</Label>
                          <Input
                            id="taxId"
                            value={companyData.taxId}
                            onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyWebsite">Sitio web</Label>
                          <Input
                            id="companyWebsite"
                            type="url"
                            value={companyData.website}
                            onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyPhone">Teléfono</Label>
                          <Input
                            id="companyPhone"
                            value={companyData.phone}
                            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Email corporativo</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={companyData.email}
                          onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Dirección</Label>
                        <Textarea
                          id="companyAddress"
                          value={companyData.address}
                          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyDescription">Descripción</Label>
                        <Textarea
                          id="companyDescription"
                          value={companyData.description}
                          onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Guardando..." : "Guardar Información"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Canales de Notificación</CardTitle>
                      <CardDescription>Configura cómo quieres recibir las notificaciones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificaciones por Email</Label>
                          <p className="text-sm text-gray-500">Recibe notificaciones en tu correo electrónico</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificaciones Push</Label>
                          <p className="text-sm text-gray-500">Recibe notificaciones en el navegador</p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificaciones SMS</Label>
                          <p className="text-sm text-gray-500">Recibe notificaciones por mensaje de texto</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Tipos de Notificación</CardTitle>
                      <CardDescription>Selecciona qué eventos quieres que te notifiquen</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Nuevos contactos</Label>
                        <Switch
                          checked={notificationSettings.newContacts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, newContacts: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Nuevos negocios</Label>
                        <Switch
                          checked={notificationSettings.newDeals}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, newDeals: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Actualizaciones de tickets</Label>
                        <Switch
                          checked={notificationSettings.ticketUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, ticketUpdates: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Alertas del sistema</Label>
                        <Switch
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, systemAlerts: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Reportes semanales</Label>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Reportes mensuales</Label>
                        <Switch
                          checked={notificationSettings.monthlyReports}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, monthlyReports: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Configuración de Seguridad</CardTitle>
                      <CardDescription>Protege tu cuenta con configuraciones avanzadas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Autenticación de dos factores</Label>
                          <p className="text-sm text-gray-500">Agrega una capa extra de seguridad</p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Alertas de inicio de sesión</Label>
                          <p className="text-sm text-gray-500">Notificar sobre nuevos inicios de sesión</p>
                        </div>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onCheckedChange={(checked) =>
                            setSecuritySettings({ ...securitySettings, loginAlerts: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Restricción por IP</Label>
                          <p className="text-sm text-gray-500">Limitar acceso a IPs específicas</p>
                        </div>
                        <Switch
                          checked={securitySettings.ipRestriction}
                          onCheckedChange={(checked) =>
                            setSecuritySettings({ ...securitySettings, ipRestriction: checked })
                          }
                        />
                      </div>

                      {securitySettings.ipRestriction && (
                        <div className="space-y-2">
                          <Label htmlFor="allowedIPs">IPs permitidas</Label>
                          <Textarea
                            id="allowedIPs"
                            value={securitySettings.allowedIPs}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, allowedIPs: e.target.value })}
                            placeholder="192.168.1.1, 10.0.0.1"
                            rows={2}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Políticas de Sesión</CardTitle>
                      <CardDescription>Configura el comportamiento de las sesiones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Tiempo de inactividad (minutos)</Label>
                        <Select
                          value={securitySettings.sessionTimeout}
                          onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                            <SelectItem value="480">8 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Expiración de contraseña (días)</Label>
                        <Select
                          value={securitySettings.passwordExpiry}
                          onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 días</SelectItem>
                            <SelectItem value="60">60 días</SelectItem>
                            <SelectItem value="90">90 días</SelectItem>
                            <SelectItem value="180">180 días</SelectItem>
                            <SelectItem value="365">1 año</SelectItem>
                            <SelectItem value="never">Nunca</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Última actualización de seguridad: Hoy
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button onClick={handleSaveSecurity} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </div>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Configuración Regional</CardTitle>
                      <CardDescription>Personaliza el idioma y formato regional</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Idioma</Label>
                        <Select
                          value={systemSettings.language}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="it">Italiano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Zona horaria</Label>
                        <Select
                          value={systemSettings.timezone}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                            <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                            <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Formato de fecha</Label>
                        <Select
                          value={systemSettings.dateFormat}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Select
                          value={systemSettings.currency}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                            <SelectItem value="GBP">Libra (£)</SelectItem>
                            <SelectItem value="JPY">Yen (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Preferencias del Sistema</CardTitle>
                      <CardDescription>Configura el comportamiento de la aplicación</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Tema</Label>
                        <Select
                          value={systemSettings.theme}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, theme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Oscuro</SelectItem>
                            <SelectItem value="auto">Automático</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Frecuencia de respaldo</Label>
                        <Select
                          value={systemSettings.backupFrequency}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, backupFrequency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensual</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Guardado automático</Label>
                          <p className="text-sm text-gray-500">Guardar cambios automáticamente</p>
                        </div>
                        <Switch
                          checked={systemSettings.autoSave}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoSave: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button onClick={handleSaveSystem} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span>Email Marketing</span>
                      </CardTitle>
                      <CardDescription>Conecta con plataformas de email marketing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mailchimp</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SendGrid</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <span>Comunicaciones</span>
                      </CardTitle>
                      <CardDescription>Integra servicios de comunicación</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WhatsApp Business</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Twilio SMS</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <span>Redes Sociales</span>
                      </CardTitle>
                      <CardDescription>Conecta con redes sociales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LinkedIn</span>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Facebook</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-orange-600" />
                        <span>Almacenamiento</span>
                      </CardTitle>
                      <CardDescription>Servicios de almacenamiento en la nube</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Google Drive</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dropbox</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span>Pagos</span>
                      </CardTitle>
                      <CardDescription>Procesadores de pago</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stripe</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">PayPal</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <span>Productividad</span>
                      </CardTitle>
                      <CardDescription>Herramientas de productividad</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Slack</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Microsoft Teams</span>
                        <Badge variant="outline" className="text-gray-600">
                          No conectado
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Configurar APIs
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Configuración de API</CardTitle>
                    <CardDescription>Gestiona las claves de API y webhooks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">Clave de API del CRM</Label>
                        <div className="flex space-x-2">
                          <Input id="apiKey" value="crm_live_sk_1234567890abcdef" disabled className="bg-gray-50" />
                          <Button variant="outline" size="sm">
                            Regenerar
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">URL de Webhook</Label>
                        <Input
                          id="webhookUrl"
                          placeholder="https://tu-dominio.com/webhook"
                          value="https://crm-empresarial.com/api/webhook"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
