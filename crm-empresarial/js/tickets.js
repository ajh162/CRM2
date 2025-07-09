// Tickets page functionality
class TicketsManager {
  constructor() {
    this.tickets = []
    this.filteredTickets = []
    this.editingTicket = null
    this.init()
  }

  init() {
    this.loadTickets()
    this.setupEventListeners()
    this.renderTickets()
    this.updateStats()
  }

  loadTickets() {
    const CRMData = window.CRMData // Declare CRMData variable
    this.tickets = CRMData.getTickets()
    this.filteredTickets = [...this.tickets]
  }

  setupEventListeners() {
    // Modal controls
    document.getElementById("newTicketBtn").addEventListener("click", () => this.openModal())
    document.getElementById("addFirstTicket")?.addEventListener("click", () => this.openModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
    document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal())

    // Form submission
    document.getElementById("ticketForm").addEventListener("submit", (e) => this.handleSubmit(e))

    // Search and filters
    document.getElementById("filterSearch").addEventListener("input", (e) => this.handleSearch(e.target.value))
    document.getElementById("statusFilter").addEventListener("change", (e) => this.handleStatusFilter(e.target.value))
    document
      .getElementById("priorityFilter")
      .addEventListener("change", (e) => this.handlePriorityFilter(e.target.value))

    // Close modal on outside click
    document.getElementById("ticketModal").addEventListener("click", (e) => {
      if (e.target.id === "ticketModal") {
        this.closeModal()
      }
    })
  }

  openModal(ticket = null) {
    this.editingTicket = ticket
    const modal = document.getElementById("ticketModal")
    const title = document.getElementById("modalTitle")
    const form = document.getElementById("ticketForm")

    if (ticket) {
      title.textContent = "Editar Ticket"
      this.populateForm(ticket)
    } else {
      title.textContent = "Nuevo Ticket"
      form.reset()
    }

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    document.getElementById("ticketModal").classList.add("hidden")
    document.body.style.overflow = "auto"
    this.editingTicket = null
  }

  populateForm(ticket) {
    document.getElementById("ticketTitle").value = ticket.title || ""
    document.getElementById("ticketDescription").value = ticket.description || ""
    document.getElementById("ticketPriority").value = ticket.priority || "medium"
    document.getElementById("ticketStatus").value = ticket.status || "open"
    document.getElementById("ticketCategory").value = ticket.category || "technical"
    document.getElementById("ticketAssignedTo").value = ticket.assignedTo || ""
    document.getElementById("ticketClientName").value = ticket.clientName || ""
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const ticketData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      status: formData.get("status"),
      category: formData.get("category"),
      assignedTo: formData.get("assignedTo"),
      clientName: formData.get("clientName"),
    }

    if (this.editingTicket) {
      this.updateTicket(ticketData)
    } else {
      this.createTicket(ticketData)
    }
  }

  createTicket(ticketData) {
    const newTicket = {
      id: Date.now(),
      ...ticketData,
      clientId: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.tickets.unshift(newTicket)
    this.saveTickets()
    this.renderTickets()
    this.updateStats()
    this.closeModal()

    window.crmApp.showNotification("Ticket creado exitosamente")
  }

  updateTicket(ticketData) {
    const index = this.tickets.findIndex((t) => t.id === this.editingTicket.id)
    if (index !== -1) {
      this.tickets[index] = {
        ...this.tickets[index],
        ...ticketData,
        updatedAt: new Date().toISOString(),
      }

      this.saveTickets()
      this.renderTickets()
      this.updateStats()
      this.closeModal()

      window.crmApp.showNotification("Ticket actualizado exitosamente")
    }
  }

  deleteTicket(ticketId) {
    if (confirm("¿Estás seguro de que quieres eliminar este ticket?")) {
      this.tickets = this.tickets.filter((t) => t.id !== ticketId)
      this.saveTickets()
      this.renderTickets()
      this.updateStats()

      window.crmApp.showNotification("Ticket eliminado exitosamente")
    }
  }

  handleSearch(searchTerm) {
    this.applyFilters(
      searchTerm,
      document.getElementById("statusFilter").value,
      document.getElementById("priorityFilter").value,
    )
  }

  handleStatusFilter(status) {
    this.applyFilters(
      document.getElementById("filterSearch").value,
      status,
      document.getElementById("priorityFilter").value,
    )
  }

  handlePriorityFilter(priority) {
    this.applyFilters(
      document.getElementById("filterSearch").value,
      document.getElementById("statusFilter").value,
      priority,
    )
  }

  applyFilters(searchTerm, status, priority) {
    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesSearch =
        !searchTerm ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = status === "all" || ticket.status === status
      const matchesPriority = priority === "all" || ticket.priority === priority

      return matchesSearch && matchesStatus && matchesPriority
    })

    this.renderTickets()
    this.updateStats()
  }

  updateStats() {
    const openTickets = this.tickets.filter((t) => t.status === "open").length
    const inProgressTickets = this.tickets.filter((t) => t.status === "in-progress").length
    const highPriorityTickets = this.tickets.filter((t) => t.priority === "high").length

    document.getElementById("openTickets").textContent = openTickets
    document.getElementById("inProgressTickets").textContent = inProgressTickets
    document.getElementById("highPriorityTickets").textContent = highPriorityTickets
  }

  renderTickets() {
    const list = document.getElementById("ticketsList")
    const emptyState = document.getElementById("emptyState")

    if (this.filteredTickets.length === 0) {
      list.classList.add("hidden")
      emptyState.classList.remove("hidden")
      return
    }

    list.classList.remove("hidden")
    emptyState.classList.add("hidden")

    list.innerHTML = this.filteredTickets.map((ticket) => this.renderTicketCard(ticket)).join("")

    // Add event listeners to action buttons
    this.filteredTickets.forEach((ticket) => {
      document.getElementById(`edit-${ticket.id}`)?.addEventListener("click", () => this.openModal(ticket))
      document.getElementById(`delete-${ticket.id}`)?.addEventListener("click", () => this.deleteTicket(ticket.id))
    })
  }

  renderTicketCard(ticket) {
    const priorityColors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }

    const statusColors = {
      open: "bg-blue-100 text-blue-800",
      "in-progress": "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }

    const priorityLabels = {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    }

    const statusLabels = {
      open: "Abierto",
      "in-progress": "En Progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
    }

    const categoryLabels = {
      technical: "Técnico",
      billing: "Facturación",
      "feature-request": "Nueva Funcionalidad",
      performance: "Rendimiento",
      training: "Capacitación",
    }

    const statusIcons = {
      open: "fa-exclamation-circle",
      "in-progress": "fa-clock",
      resolved: "fa-check-circle",
      closed: "fa-check-circle",
    }

    return `
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="p-1 rounded-full ${statusColors[ticket.status]}">
                                <i class="fas ${statusIcons[ticket.status]} text-sm"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">${ticket.title}</h3>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}">
                                ${priorityLabels[ticket.priority]}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}">
                                ${statusLabels[ticket.status]}
                            </span>
                        </div>

                        <p class="text-gray-600 mb-4 line-clamp-2">${ticket.description}</p>

                        <div class="flex items-center space-x-6 text-sm text-gray-500">
                            <div class="flex items-center space-x-1">
                                <i class="fas fa-user"></i>
                                <span>${ticket.clientName}</span>
                            </div>

                            <div class="flex items-center space-x-1">
                                <span>Categoría:</span>
                                <span class="font-medium">${categoryLabels[ticket.category]}</span>
                            </div>

                            ${
                              ticket.assignedTo
                                ? `
                                <div class="flex items-center space-x-1">
                                    <span>Asignado a:</span>
                                    <span class="font-medium">${ticket.assignedTo}</span>
                                </div>
                            `
                                : ""
                            }

                            <div class="flex items-center space-x-1">
                                <i class="fas fa-calendar"></i>
                                <span>${window.crmApp.formatDate(ticket.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex space-x-2 ml-4">
                        <button id="edit-${ticket.id}" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button id="delete-${ticket.id}" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  saveTickets() {
    const CRMData = window.CRMData // Declare CRMData variable
    CRMData.saveTickets(this.tickets)
  }
}

// Initialize tickets manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.ticketsManager = new TicketsManager()
})
