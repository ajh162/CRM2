// Contacts page functionality
class ContactsManager {
  constructor() {
    this.contacts = []
    this.filteredContacts = []
    this.editingContact = null
    this.init()
  }

  init() {
    this.loadContacts()
    this.setupEventListeners()
    this.renderContacts()
  }

  loadContacts() {
    const CRMData = window.CRMData // Declare CRMData variable
    this.contacts = CRMData.getContacts()
    this.filteredContacts = [...this.contacts]
  }

  setupEventListeners() {
    // Modal controls
    document.getElementById("newContactBtn").addEventListener("click", () => this.openModal())
    document.getElementById("addFirstContact")?.addEventListener("click", () => this.openModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
    document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal())

    // Form submission
    document.getElementById("contactForm").addEventListener("submit", (e) => this.handleSubmit(e))

    // Search and filters
    document.getElementById("filterSearch").addEventListener("input", (e) => this.handleSearch(e.target.value))
    document.getElementById("statusFilter").addEventListener("change", (e) => this.handleStatusFilter(e.target.value))

    // Close modal on outside click
    document.getElementById("contactModal").addEventListener("click", (e) => {
      if (e.target.id === "contactModal") {
        this.closeModal()
      }
    })
  }

  openModal(contact = null) {
    this.editingContact = contact
    const modal = document.getElementById("contactModal")
    const title = document.getElementById("modalTitle")
    const form = document.getElementById("contactForm")

    if (contact) {
      title.textContent = "Editar Contacto"
      this.populateForm(contact)
    } else {
      title.textContent = "Nuevo Contacto"
      form.reset()
    }

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    document.getElementById("contactModal").classList.add("hidden")
    document.body.style.overflow = "auto"
    this.editingContact = null
  }

  populateForm(contact) {
    document.getElementById("contactName").value = contact.name || ""
    document.getElementById("contactEmail").value = contact.email || ""
    document.getElementById("contactPhone").value = contact.phone || ""
    document.getElementById("contactCompany").value = contact.company || ""
    document.getElementById("contactPosition").value = contact.position || ""
    document.getElementById("contactAddress").value = contact.address || ""
    document.getElementById("contactStatus").value = contact.status || "active"
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const contactData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      position: formData.get("position"),
      address: formData.get("address"),
      status: formData.get("status"),
    }

    if (this.editingContact) {
      this.updateContact(contactData)
    } else {
      this.createContact(contactData)
    }
  }

  createContact(contactData) {
    const newContact = {
      id: Date.now(),
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.contacts.unshift(newContact)
    this.saveContacts()
    this.renderContacts()
    this.closeModal()

    window.crmApp.showNotification("Contacto creado exitosamente")
  }

  updateContact(contactData) {
    const index = this.contacts.findIndex((c) => c.id === this.editingContact.id)
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ...contactData,
        updatedAt: new Date().toISOString(),
      }

      this.saveContacts()
      this.renderContacts()
      this.closeModal()

      window.crmApp.showNotification("Contacto actualizado exitosamente")
    }
  }

  deleteContact(contactId) {
    if (confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      this.contacts = this.contacts.filter((c) => c.id !== contactId)
      this.saveContacts()
      this.renderContacts()

      window.crmApp.showNotification("Contacto eliminado exitosamente")
    }
  }

  handleSearch(searchTerm) {
    this.applyFilters(searchTerm, document.getElementById("statusFilter").value)
  }

  handleStatusFilter(status) {
    this.applyFilters(document.getElementById("filterSearch").value, status)
  }

  applyFilters(searchTerm, status) {
    this.filteredContacts = this.contacts.filter((contact) => {
      const matchesSearch =
        !searchTerm ||
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = status === "all" || contact.status === status

      return matchesSearch && matchesStatus
    })

    this.renderContacts()
  }

  renderContacts() {
    const grid = document.getElementById("contactsGrid")
    const emptyState = document.getElementById("emptyState")

    if (this.filteredContacts.length === 0) {
      grid.classList.add("hidden")
      emptyState.classList.remove("hidden")
      return
    }

    grid.classList.remove("hidden")
    emptyState.classList.add("hidden")

    grid.innerHTML = this.filteredContacts.map((contact) => this.renderContactCard(contact)).join("")

    // Add event listeners to action buttons
    this.filteredContacts.forEach((contact) => {
      document.getElementById(`edit-${contact.id}`)?.addEventListener("click", () => this.openModal(contact))
      document.getElementById(`delete-${contact.id}`)?.addEventListener("click", () => this.deleteContact(contact.id))
    })
  }

  renderContactCard(contact) {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      prospect: "bg-blue-100 text-blue-800",
    }

    const statusLabels = {
      active: "Activo",
      inactive: "Inactivo",
      prospect: "Prospecto",
    }

    const initials = contact.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

    return `
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-medium">${initials}</span>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${contact.name}</h3>
                            <p class="text-gray-600">${contact.position || "Sin cargo"}</p>
                        </div>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[contact.status]}">
                        ${statusLabels[contact.status]}
                    </span>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <i class="fas fa-envelope w-4"></i>
                        <span>${contact.email}</span>
                    </div>
                    ${
                      contact.phone
                        ? `
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <i class="fas fa-phone w-4"></i>
                            <span>${contact.phone}</span>
                        </div>
                    `
                        : ""
                    }
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <i class="fas fa-building w-4"></i>
                        <span>${contact.company}</span>
                    </div>
                    ${
                      contact.address
                        ? `
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <i class="fas fa-map-marker-alt w-4"></i>
                            <span class="truncate">${contact.address}</span>
                        </div>
                    `
                        : ""
                    }
                </div>

                <div class="flex justify-end space-x-2">
                    <button id="edit-${contact.id}" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button id="delete-${contact.id}" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
  }

  saveContacts() {
    const CRMData = window.CRMData // Declare CRMData variable
    CRMData.saveContacts(this.contacts)
  }
}

// Initialize contacts manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.contactsManager = new ContactsManager()
})
