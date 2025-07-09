// Configuration page functionality
class ConfigurationManager {
  constructor() {
    this.config = {}
    this.init()
  }

  init() {
    this.loadConfiguration()
    this.setupEventListeners()
    this.populateForms()
  }

  loadConfiguration() {
    // Load configuration from localStorage or use defaults
    this.config = JSON.parse(localStorage.getItem("crm_config")) || {
      profile: {
        name: "Administrador CRM",
        email: "admin@crm-empresarial.com",
        phone: "+34 600 123 456",
        position: "Administrador del Sistema",
        bio: "Administrador principal del sistema CRM",
      },
      company: {
        name: "CRM Empresarial S.L.",
        industry: "technology",
        size: "51-100",
        taxId: "B12345678",
        website: "https://crm-empresarial.com",
        phone: "+34 900 123 456",
        email: "info@crm-empresarial.com",
        address: "Calle de la Innovación 123, Madrid, España",
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        newContacts: true,
        newDeals: true,
        ticketUpdates: true,
        weeklyReports: true,
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: 30,
        passwordExpiry: 90,
      },
      system: {
        language: "es",
        timezone: "Europe/Madrid",
        currency: "EUR",
        dateFormat: "DD/MM/YYYY",
      },
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll(".config-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => this.switchTab(e.target.dataset.tab))
    })

    // Form submissions
    document.getElementById("profileForm").addEventListener("submit", (e) => this.saveProfile(e))
    document.getElementById("companyForm").addEventListener("submit", (e) => this.saveCompany(e))
    document.getElementById("passwordForm").addEventListener("submit", (e) => this.changePassword(e))

    // Save buttons
    document.getElementById("saveNotifications").addEventListener("click", () => this.saveNotifications())
    document.getElementById("saveSecurity").addEventListener("click", () => this.saveSecurity())
    document.getElementById("saveSystem").addEventListener("click", () => this.saveSystem())

    // Data management
    document.getElementById("exportData").addEventListener("click", () => this.exportData())
    document.getElementById("importData").addEventListener("click", () => this.importData())
    document.getElementById("deleteAllData").addEventListener("click", () => this.deleteAllData())

    // Avatar upload
    document.getElementById("uploadAvatar").addEventListener("click", () => this.uploadAvatar())
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".config-tab").forEach((tab) => {
      tab.classList.remove("active", "border-blue-500", "text-blue-600")
      tab.classList.add("border-transparent", "text-gray-500", "hover:text-gray-700", "hover:border-gray-300")
    })

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`)
    activeTab.classList.add("active", "border-blue-500", "text-blue-600")
    activeTab.classList.remove("border-transparent", "text-gray-500", "hover:text-gray-700", "hover:border-gray-300")

    // Update content
    document.querySelectorAll(".config-content").forEach((content) => {
      content.classList.add("hidden")
    })

    document.getElementById(`${tabName}-tab`).classList.remove("hidden")
  }

  populateForms() {
    // Profile form
    document.getElementById("profileName").value = this.config.profile.name
    document.getElementById("profileEmail").value = this.config.profile.email
    document.getElementById("profilePhone").value = this.config.profile.phone
    document.getElementById("profilePosition").value = this.config.profile.position
    document.getElementById("profileBio").value = this.config.profile.bio

    // Update avatar initials
    const initials = this.config.profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    document.getElementById("avatarInitials").textContent = initials

    // Company form
    document.getElementById("companyName").value = this.config.company.name
    document.getElementById("companyIndustry").value = this.config.company.industry
    document.getElementById("companySize").value = this.config.company.size
    document.getElementById("companyTaxId").value = this.config.company.taxId
    document.getElementById("companyWebsite").value = this.config.company.website
    document.getElementById("companyPhone").value = this.config.company.phone
    document.getElementById("companyEmail").value = this.config.company.email
    document.getElementById("companyAddress").value = this.config.company.address

    // Notifications
    document.getElementById("emailNotifications").checked = this.config.notifications.email
    document.getElementById("pushNotifications").checked = this.config.notifications.push
    document.getElementById("smsNotifications").checked = this.config.notifications.sms
    document.getElementById("newContacts").checked = this.config.notifications.newContacts
    document.getElementById("newDeals").checked = this.config.notifications.newDeals
    document.getElementById("ticketUpdates").checked = this.config.notifications.ticketUpdates
    document.getElementById("weeklyReports").checked = this.config.notifications.weeklyReports

    // Security
    document.getElementById("twoFactorAuth").checked = this.config.security.twoFactorAuth
    document.getElementById("loginAlerts").checked = this.config.security.loginAlerts
    document.getElementById("sessionTimeout").value = this.config.security.sessionTimeout
    document.getElementById("passwordExpiry").value = this.config.security.passwordExpiry

    // System
    document.getElementById("systemLanguage").value = this.config.system.language
    document.getElementById("systemTimezone").value = this.config.system.timezone
    document.getElementById("systemCurrency").value = this.config.system.currency
    document.getElementById("systemDateFormat").value = this.config.system.dateFormat
  }

  saveProfile(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    this.config.profile = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      position: formData.get("position"),
      bio: formData.get("bio"),
    }

    this.saveConfiguration()
    this.showSuccessMessage("Perfil actualizado exitosamente")

    // Update avatar initials
    const initials = this.config.profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    document.getElementById("avatarInitials").textContent = initials
  }

  saveCompany(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    this.config.company = {
      name: formData.get("name"),
      industry: formData.get("industry"),
      size: formData.get("size"),
      taxId: formData.get("taxId"),
      website: formData.get("website"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
    }

    this.saveConfiguration()
    this.showSuccessMessage("Información de empresa actualizada exitosamente")
  }

  changePassword(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const currentPassword = formData.get("currentPassword")
    const newPassword = formData.get("newPassword")
    const confirmPassword = formData.get("confirmPassword")

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Por favor, completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
      return
    }

    // In a real app, you would validate the current password
    this.showSuccessMessage("Contraseña cambiada exitosamente")
    e.target.reset()
  }

  saveNotifications() {
    this.config.notifications = {
      email: document.getElementById("emailNotifications").checked,
      push: document.getElementById("pushNotifications").checked,
      sms: document.getElementById("smsNotifications").checked,
      newContacts: document.getElementById("newContacts").checked,
      newDeals: document.getElementById("newDeals").checked,
      ticketUpdates: document.getElementById("ticketUpdates").checked,
      weeklyReports: document.getElementById("weeklyReports").checked,
    }

    this.saveConfiguration()
    this.showSuccessMessage("Configuración de notificaciones guardada")
  }

  saveSecurity() {
    this.config.security = {
      twoFactorAuth: document.getElementById("twoFactorAuth").checked,
      loginAlerts: document.getElementById("loginAlerts").checked,
      sessionTimeout: Number.parseInt(document.getElementById("sessionTimeout").value),
      passwordExpiry: Number.parseInt(document.getElementById("passwordExpiry").value),
    }

    this.saveConfiguration()
    this.showSuccessMessage("Configuración de seguridad guardada")
  }

  saveSystem() {
    this.config.system = {
      language: document.getElementById("systemLanguage").value,
      timezone: document.getElementById("systemTimezone").value,
      currency: document.getElementById("systemCurrency").value,
      dateFormat: document.getElementById("systemDateFormat").value,
    }

    this.saveConfiguration()
    this.showSuccessMessage("Configuración del sistema guardada")
  }

  exportData() {
    const CRMData = window.CRMData
    const data = {
      contacts: CRMData.getContacts(),
      deals: CRMData.getDeals(),
      tickets: CRMData.getTickets(),
      purchases: CRMData.getPurchases(),
      config: this.config,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crm-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.showSuccessMessage("Datos exportados exitosamente")
  }

  importData() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)

            if (
              confirm("¿Estás seguro de que quieres importar estos datos? Esto sobrescribirá los datos existentes.")
            ) {
              const CRMData = window.CRMData
              if (data.contacts) CRMData.saveContacts(data.contacts)
              if (data.deals) CRMData.saveDeals(data.deals)
              if (data.tickets) CRMData.saveTickets(data.tickets)
              if (data.purchases) CRMData.savePurchases(data.purchases)
              if (data.config) {
                this.config = data.config
                this.saveConfiguration()
                this.populateForms()
              }

              this.showSuccessMessage("Datos importados exitosamente")
            }
          } catch (error) {
            alert("Error al importar el archivo. Asegúrate de que sea un archivo JSON válido.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  deleteAllData() {
    if (confirm("¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.")) {
      if (
        confirm("Esta acción eliminará permanentemente todos los contactos, negocios, tickets y compras. ¿Continuar?")
      ) {
        localStorage.clear()
        this.showSuccessMessage("Todos los datos han sido eliminados")

        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      }
    }
  }

  uploadAvatar() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // In a real app, you would upload the file to a server
        this.showSuccessMessage("Foto de perfil actualizada (simulado)")
      }
    }
    input.click()
  }

  saveConfiguration() {
    localStorage.setItem("crm_config", JSON.stringify(this.config))
  }

  showSuccessMessage(message) {
    const successMessage = document.getElementById("successMessage")
    const successText = document.getElementById("successText")

    successText.textContent = message
    successMessage.classList.remove("hidden")

    setTimeout(() => {
      successMessage.classList.add("hidden")
    }, 3000)
  }
}

// Initialize configuration manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.configManager = new ConfigurationManager()
})
