// Purchases page functionality
class PurchasesManager {
  constructor() {
    this.purchases = []
    this.filteredPurchases = []
    this.editingPurchase = null
    this.init()
  }

  init() {
    this.loadPurchases()
    this.setupEventListeners()
    this.renderPurchases()
    this.updateStats()
  }

  loadPurchases() {
    const CRMData = window.CRMData // Declare CRMData variable
    this.purchases = CRMData.getPurchases()
    this.filteredPurchases = [...this.purchases]
  }

  setupEventListeners() {
    // Modal controls
    document.getElementById("newPurchaseBtn").addEventListener("click", () => this.openModal())
    document.getElementById("addFirstPurchase")?.addEventListener("click", () => this.openModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
    document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal())

    // Form submission
    document.getElementById("purchaseForm").addEventListener("submit", (e) => this.handleSubmit(e))

    // Calculate total when quantity or unit price changes
    document.getElementById("purchaseQuantity").addEventListener("input", () => this.calculateTotal())
    document.getElementById("purchaseUnitPrice").addEventListener("input", () => this.calculateTotal())

    // Search and filters
    document.getElementById("filterSearch").addEventListener("input", (e) => this.handleSearch(e.target.value))
    document.getElementById("statusFilter").addEventListener("change", (e) => this.handleStatusFilter(e.target.value))
    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) => this.handleCategoryFilter(e.target.value))

    // Close modal on outside click
    document.getElementById("purchaseModal").addEventListener("click", (e) => {
      if (e.target.id === "purchaseModal") {
        this.closeModal()
      }
    })
  }

  calculateTotal() {
    const quantity = Number.parseFloat(document.getElementById("purchaseQuantity").value) || 0
    const unitPrice = Number.parseFloat(document.getElementById("purchaseUnitPrice").value) || 0
    const total = quantity * unitPrice
    document.getElementById("purchaseTotal").value = `€${total.toFixed(2)}`
  }

  openModal(purchase = null) {
    this.editingPurchase = purchase
    const modal = document.getElementById("purchaseModal")
    const title = document.getElementById("modalTitle")
    const form = document.getElementById("purchaseForm")

    if (purchase) {
      title.textContent = "Editar Compra"
      this.populateForm(purchase)
    } else {
      title.textContent = "Nueva Compra"
      form.reset()
      this.calculateTotal()
    }

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    document.getElementById("purchaseModal").classList.add("hidden")
    document.body.style.overflow = "auto"
    this.editingPurchase = null
  }

  populateForm(purchase) {
    document.getElementById("purchaseTitle").value = purchase.title || ""
    document.getElementById("purchaseSupplier").value = purchase.supplier || ""
    document.getElementById("purchaseCategory").value = purchase.category || "software"
    document.getElementById("purchaseQuantity").value = purchase.quantity || 1
    document.getElementById("purchaseUnitPrice").value = purchase.unitPrice || ""
    document.getElementById("purchaseStatus").value = purchase.status || "pending"
    document.getElementById("purchaseApprovedBy").value = purchase.approvedBy || ""
    document.getElementById("purchaseOrderDate").value = purchase.orderDate ? purchase.orderDate.split("T")[0] : ""
    document.getElementById("purchaseDeliveryDate").value = purchase.deliveryDate
      ? purchase.deliveryDate.split("T")[0]
      : ""
    document.getElementById("purchaseDescription").value = purchase.description || ""
    this.calculateTotal()
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const quantity = Number.parseInt(formData.get("quantity"))
    const unitPrice = Number.parseFloat(formData.get("unitPrice"))

    const purchaseData = {
      title: formData.get("title"),
      supplier: formData.get("supplier"),
      category: formData.get("category"),
      quantity: quantity,
      unitPrice: unitPrice,
      amount: quantity * unitPrice,
      status: formData.get("status"),
      approvedBy: formData.get("approvedBy"),
      orderDate: formData.get("orderDate"),
      deliveryDate: formData.get("deliveryDate"),
      description: formData.get("description"),
    }

    if (this.editingPurchase) {
      this.updatePurchase(purchaseData)
    } else {
      this.createPurchase(purchaseData)
    }
  }

  createPurchase(purchaseData) {
    const newPurchase = {
      id: Date.now(),
      ...purchaseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.purchases.unshift(newPurchase)
    this.savePurchases()
    this.renderPurchases()
    this.updateStats()
    this.closeModal()

    window.crmApp.showNotification("Compra registrada exitosamente")
  }

  updatePurchase(purchaseData) {
    const index = this.purchases.findIndex((p) => p.id === this.editingPurchase.id)
    if (index !== -1) {
      this.purchases[index] = {
        ...this.purchases[index],
        ...purchaseData,
        updatedAt: new Date().toISOString(),
      }

      this.savePurchases()
      this.renderPurchases()
      this.updateStats()
      this.closeModal()

      window.crmApp.showNotification("Compra actualizada exitosamente")
    }
  }

  deletePurchase(purchaseId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta compra?")) {
      this.purchases = this.purchases.filter((p) => p.id !== purchaseId)
      this.savePurchases()
      this.renderPurchases()
      this.updateStats()

      window.crmApp.showNotification("Compra eliminada exitosamente")
    }
  }

  handleSearch(searchTerm) {
    this.applyFilters(
      searchTerm,
      document.getElementById("statusFilter").value,
      document.getElementById("categoryFilter").value,
    )
  }

  handleStatusFilter(status) {
    this.applyFilters(
      document.getElementById("filterSearch").value,
      status,
      document.getElementById("categoryFilter").value,
    )
  }

  handleCategoryFilter(category) {
    this.applyFilters(
      document.getElementById("filterSearch").value,
      document.getElementById("statusFilter").value,
      category,
    )
  }

  applyFilters(searchTerm, status, category) {
    this.filteredPurchases = this.purchases.filter((purchase) => {
      const matchesSearch =
        !searchTerm ||
        purchase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = status === "all" || purchase.status === status
      const matchesCategory = category === "all" || purchase.category === category

      return matchesSearch && matchesStatus && matchesCategory
    })

    this.renderPurchases()
    this.updateStats()
  }

  updateStats() {
    const totalAmount = this.filteredPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
    const completedPurchases = this.purchases.filter((p) => p.status === "completed").length
    const pendingPurchases = this.purchases.filter((p) => p.status === "pending").length

    document.getElementById("totalAmount").textContent = `€${totalAmount.toLocaleString()}`
    document.getElementById("totalPurchases").textContent = this.filteredPurchases.length
    document.getElementById("completedPurchases").textContent = completedPurchases
    document.getElementById("pendingPurchases").textContent = pendingPurchases
  }

  renderPurchases() {
    const list = document.getElementById("purchasesList")
    const emptyState = document.getElementById("emptyState")

    if (this.filteredPurchases.length === 0) {
      list.classList.add("hidden")
      emptyState.classList.remove("hidden")
      return
    }

    list.classList.remove("hidden")
    emptyState.classList.add("hidden")

    list.innerHTML = this.filteredPurchases.map((purchase) => this.renderPurchaseCard(purchase)).join("")

    // Add event listeners to action buttons
    this.filteredPurchases.forEach((purchase) => {
      document.getElementById(`edit-${purchase.id}`)?.addEventListener("click", () => this.openModal(purchase))
      document
        .getElementById(`delete-${purchase.id}`)
        ?.addEventListener("click", () => this.deletePurchase(purchase.id))
    })
  }

  renderPurchaseCard(purchase) {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    }

    const categoryColors = {
      software: "bg-purple-100 text-purple-800",
      hardware: "bg-blue-100 text-blue-800",
      services: "bg-green-100 text-green-800",
      furniture: "bg-orange-100 text-orange-800",
      security: "bg-red-100 text-red-800",
    }

    const statusLabels = {
      completed: "Completado",
      pending: "Pendiente",
      approved: "Aprobado",
      cancelled: "Cancelado",
    }

    const categoryLabels = {
      software: "Software",
      hardware: "Hardware",
      services: "Servicios",
      furniture: "Mobiliario",
      security: "Seguridad",
    }

    const statusIcons = {
      completed: "fa-check-circle",
      pending: "fa-clock",
      approved: "fa-check-circle",
      cancelled: "fa-times-circle",
    }

    return `
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="p-1 rounded-full ${statusColors[purchase.status]}">
                                <i class="fas ${statusIcons[purchase.status]} text-sm"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">${purchase.title}</h3>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[purchase.category]}">
                                ${categoryLabels[purchase.category]}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[purchase.status]}">
                                ${statusLabels[purchase.status]}
                            </span>
                        </div>

                        <p class="text-gray-600 mb-4">${purchase.description}</p>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-building text-gray-400"></i>
                                <div>
                                    <p class="text-xs text-gray-500">Proveedor</p>
                                    <p class="text-sm font-medium">${purchase.supplier}</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <i class="fas fa-box text-gray-400"></i>
                                <div>
                                    <p class="text-xs text-gray-500">Cantidad</p>
                                    <p class="text-sm font-medium">${purchase.quantity} unidades</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <i class="fas fa-euro-sign text-gray-400"></i>
                                <div>
                                    <p class="text-xs text-gray-500">Precio unitario</p>
                                    <p class="text-sm font-medium">€${purchase.unitPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <i class="fas fa-euro-sign text-green-600"></i>
                                <div>
                                    <p class="text-xs text-gray-500">Total</p>
                                    <p class="text-lg font-bold text-green-600">€${purchase.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center space-x-6 text-sm text-gray-500">
                            ${
                              purchase.orderDate
                                ? `
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-calendar"></i>
                                    <span>Pedido: ${window.crmApp.formatDate(purchase.orderDate)}</span>
                                </div>
                            `
                                : ""
                            }

                            ${
                              purchase.deliveryDate
                                ? `
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-calendar"></i>
                                    <span>Entrega: ${window.crmApp.formatDate(purchase.deliveryDate)}</span>
                                </div>
                            `
                                : ""
                            }

                            ${
                              purchase.approvedBy
                                ? `
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-user"></i>
                                    <span>Aprobado por: ${purchase.approvedBy}</span>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    </div>

                    <div class="flex space-x-2 ml-4">
                        <button id="edit-${purchase.id}" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button id="delete-${purchase.id}" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  savePurchases() {
    const CRMData = window.CRMData // Declare CRMData variable
    CRMData.savePurchases(this.purchases)
  }
}

// Initialize purchases manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.purchasesManager = new PurchasesManager()
})
