// Deals page functionality
class DealsManager {
  constructor() {
    this.deals = []
    this.filteredDeals = []
    this.editingDeal = null
    this.init()
  }

  init() {
    this.loadDeals()
    this.setupEventListeners()
    this.renderDeals()
    this.updateStats()
  }

  loadDeals() {
    const CRMData = window.CRMData // Declare CRMData variable
    this.deals = CRMData.getDeals()
    this.filteredDeals = [...this.deals]
  }

  setupEventListeners() {
    // Modal controls
    document.getElementById("newDealBtn").addEventListener("click", () => this.openModal())
    document.getElementById("addFirstDeal")?.addEventListener("click", () => this.openModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeModal())
    document.getElementById("cancelBtn").addEventListener("click", () => this.closeModal())

    // Form submission
    document.getElementById("dealForm").addEventListener("submit", (e) => this.handleSubmit(e))

    // Search and filters
    document.getElementById("filterSearch").addEventListener("input", (e) => this.handleSearch(e.target.value))
    document.getElementById("stageFilter").addEventListener("change", (e) => this.handleStageFilter(e.target.value))

    // Close modal on outside click
    document.getElementById("dealModal").addEventListener("click", (e) => {
      if (e.target.id === "dealModal") {
        this.closeModal()
      }
    })
  }

  openModal(deal = null) {
    this.editingDeal = deal
    const modal = document.getElementById("dealModal")
    const title = document.getElementById("modalTitle")
    const form = document.getElementById("dealForm")

    if (deal) {
      title.textContent = "Editar Negocio"
      this.populateForm(deal)
    } else {
      title.textContent = "Nuevo Negocio"
      form.reset()
    }

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }

  closeModal() {
    document.getElementById("dealModal").classList.add("hidden")
    document.body.style.overflow = "auto"
    this.editingDeal = null
  }

  populateForm(deal) {
    document.getElementById("dealTitle").value = deal.title || ""
    document.getElementById("dealClient").value = deal.client || ""
    document.getElementById("dealValue").value = deal.value || ""
    document.getElementById("dealStage").value = deal.stage || "qualification"
    document.getElementById("dealProbability").value = deal.probability || 50
    document.getElementById("dealCloseDate").value = deal.expectedCloseDate || ""
    document.getElementById("dealDescription").value = deal.description || ""
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const dealData = {
      title: formData.get("title"),
      client: formData.get("client"),
      value: Number.parseFloat(formData.get("value")),
      stage: formData.get("stage"),
      probability: Number.parseInt(formData.get("probability")),
      expectedCloseDate: formData.get("expectedCloseDate"),
      description: formData.get("description"),
    }

    if (this.editingDeal) {
      this.updateDeal(dealData)
    } else {
      this.createDeal(dealData)
    }
  }

  createDeal(dealData) {
    const newDeal = {
      id: Date.now(),
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.deals.unshift(newDeal)
    this.saveDeals()
    this.renderDeals()
    this.updateStats()
    this.closeModal()

    window.crmApp.showNotification("Negocio creado exitosamente")
  }

  updateDeal(dealData) {
    const index = this.deals.findIndex((d) => d.id === this.editingDeal.id)
    if (index !== -1) {
      this.deals[index] = {
        ...this.deals[index],
        ...dealData,
        updatedAt: new Date().toISOString(),
      }

      this.saveDeals()
      this.renderDeals()
      this.updateStats()
      this.closeModal()

      window.crmApp.showNotification("Negocio actualizado exitosamente")
    }
  }

  deleteDeal(dealId) {
    if (confirm("¿Estás seguro de que quieres eliminar este negocio?")) {
      this.deals = this.deals.filter((d) => d.id !== dealId)
      this.saveDeals()
      this.renderDeals()
      this.updateStats()

      window.crmApp.showNotification("Negocio eliminado exitosamente")
    }
  }

  handleSearch(searchTerm) {
    this.applyFilters(searchTerm, document.getElementById("stageFilter").value)
  }

  handleStageFilter(stage) {
    this.applyFilters(document.getElementById("filterSearch").value, stage)
  }

  applyFilters(searchTerm, stage) {
    this.filteredDeals = this.deals.filter((deal) => {
      const matchesSearch =
        !searchTerm ||
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.client.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStage = stage === "all" || deal.stage === stage

      return matchesSearch && matchesStage
    })

    this.renderDeals()
    this.updateStats()
  }

  updateStats() {
    const totalValue = this.filteredDeals.reduce((sum, deal) => sum + deal.value, 0)
    const avgProbability =
      this.filteredDeals.length > 0
        ? this.filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / this.filteredDeals.length
        : 0

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyDeals = this.deals.filter((deal) => {
      const dealDate = new Date(deal.createdAt)
      return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear
    }).length

    document.getElementById("totalValue").textContent = `€${totalValue.toLocaleString()}`
    document.getElementById("totalDeals").textContent = this.filteredDeals.length
    document.getElementById("avgProbability").textContent = `${Math.round(avgProbability)}%`
    document.getElementById("probabilityBar").style.width = `${avgProbability}%`
    document.getElementById("monthlyDeals").textContent = monthlyDeals
  }

  renderDeals() {
    const grid = document.getElementById("dealsGrid")
    const emptyState = document.getElementById("emptyState")

    if (this.filteredDeals.length === 0) {
      grid.classList.add("hidden")
      emptyState.classList.remove("hidden")
      return
    }

    grid.classList.remove("hidden")
    emptyState.classList.add("hidden")

    grid.innerHTML = this.filteredDeals.map((deal) => this.renderDealCard(deal)).join("")

    // Add event listeners to action buttons
    this.filteredDeals.forEach((deal) => {
      document.getElementById(`edit-${deal.id}`)?.addEventListener("click", () => this.openModal(deal))
      document.getElementById(`delete-${deal.id}`)?.addEventListener("click", () => this.deleteDeal(deal.id))
    })
  }

  renderDealCard(deal) {
    const stageColors = {
      qualification: "bg-yellow-100 text-yellow-800",
      proposal: "bg-blue-100 text-blue-800",
      negotiation: "bg-orange-100 text-orange-800",
      "closed-won": "bg-green-100 text-green-800",
      "closed-lost": "bg-red-100 text-red-800",
    }

    const stageLabels = {
      qualification: "Calificación",
      proposal: "Propuesta",
      negotiation: "Negociación",
      "closed-won": "Cerrado Ganado",
      "closed-lost": "Cerrado Perdido",
    }

    const probabilityColor =
      deal.probability >= 75
        ? "text-green-600"
        : deal.probability >= 50
          ? "text-yellow-600"
          : deal.probability >= 25
            ? "text-orange-600"
            : "text-red-600"

    return `
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">${deal.title}</h3>
                        <p class="text-gray-600 flex items-center">
                            <i class="fas fa-users mr-1"></i>
                            ${deal.client}
                        </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[deal.stage]}">
                        ${stageLabels[deal.stage]}
                    </span>
                </div>

                <div class="space-y-4 mb-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-euro-sign text-green-600"></i>
                            <span class="text-lg font-semibold text-gray-900">€${deal.value.toLocaleString()}</span>
                        </div>
                        <div class="text-sm font-medium ${probabilityColor}">
                            ${deal.probability}%
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Probabilidad</span>
                            <span>${deal.probability}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${deal.probability}%"></div>
                        </div>
                    </div>

                    ${
                      deal.expectedCloseDate
                        ? `
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <i class="fas fa-calendar"></i>
                            <span>Cierre esperado: ${window.crmApp.formatDate(deal.expectedCloseDate)}</span>
                        </div>
                    `
                        : ""
                    }

                    ${
                      deal.description
                        ? `
                        <p class="text-sm text-gray-600 line-clamp-2">${deal.description}</p>
                    `
                        : ""
                    }
                </div>

                <div class="flex justify-end space-x-2">
                    <button id="edit-${deal.id}" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button id="delete-${deal.id}" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
  }

  saveDeals() {
    const CRMData = window.CRMData // Declare CRMData variable
    CRMData.saveDeals(this.deals)
  }
}

// Initialize deals manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dealsManager = new DealsManager()
})
