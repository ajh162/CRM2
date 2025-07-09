// Dashboard specific functionality
document.addEventListener("DOMContentLoaded", () => {
  loadRecentActivities()
})

function loadRecentActivities() {
  const activities = [
    {
      description: "Nuevo contacto agregado: María González",
      time: "Hace 2 horas",
      type: "success",
      module: "Contactos",
      icon: "fa-user-plus",
    },
    {
      description: "Negocio cerrado: Proyecto Web Corporativo",
      time: "Hace 4 horas",
      type: "success",
      module: "Negocios",
      icon: "fa-handshake",
    },
    {
      description: "Ticket resuelto: Error en sistema de pagos",
      time: "Hace 6 horas",
      type: "success",
      module: "Tickets",
      icon: "fa-check-circle",
    },
    {
      description: "Nueva compra registrada: Licencias de software",
      time: "Hace 1 día",
      type: "info",
      module: "Compras",
      icon: "fa-shopping-cart",
    },
    {
      description: "Reunión programada con cliente potencial",
      time: "Hace 2 días",
      type: "info",
      module: "Negocios",
      icon: "fa-calendar",
    },
  ]

  const container = document.getElementById("recentActivities")
  if (container) {
    container.innerHTML = activities
      .map(
        (activity) => `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 ${activity.type === "success" ? "bg-green-100" : "bg-blue-100"} rounded-full flex items-center justify-center">
                        <i class="fas ${activity.icon} text-sm ${activity.type === "success" ? "text-green-600" : "text-blue-600"}"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900">${activity.description}</p>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-xs text-gray-500">${activity.time}</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === "success" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }">
                            ${activity.module}
                        </span>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}
