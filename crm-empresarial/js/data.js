// Mock data for the CRM application
const CRMData = {
  contacts: [
    {
      id: 1,
      name: "Ana García",
      email: "ana.garcia@empresa.com",
      phone: "+34 600 123 456",
      company: "Tech Solutions S.L.",
      position: "Directora de Marketing",
      address: "Calle Mayor 123, Madrid",
      status: "active",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@innovatech.es",
      phone: "+34 610 234 567",
      company: "InnovaTech",
      position: "CEO",
      address: "Avenida de la Innovación 45, Barcelona",
      status: "prospect",
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-18T11:45:00Z",
    },
    {
      id: 3,
      name: "María López",
      email: "maria.lopez@digitalcorp.com",
      phone: "+34 620 345 678",
      company: "Digital Corp",
      position: "Gerente de Ventas",
      address: "Plaza del Comercio 78, Valencia",
      status: "active",
      createdAt: "2024-01-05T14:20:00Z",
      updatedAt: "2024-01-22T16:10:00Z",
    },
    {
      id: 4,
      name: "David Martín",
      email: "david.martin@startuplab.es",
      phone: "+34 630 456 789",
      company: "StartupLab",
      position: "CTO",
      address: "Calle de la Tecnología 12, Sevilla",
      status: "inactive",
      createdAt: "2024-01-01T08:30:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: 5,
      name: "Laura Sánchez",
      email: "laura.sanchez@consulting.com",
      phone: "+34 640 567 890",
      company: "Business Consulting",
      position: "Consultora Senior",
      address: "Paseo de los Negocios 89, Bilbao",
      status: "active",
      createdAt: "2023-12-28T16:45:00Z",
      updatedAt: "2024-01-19T10:20:00Z",
    },
  ],

  deals: [
    {
      id: 1,
      title: "Desarrollo Web Corporativo",
      client: "Tech Solutions S.L.",
      value: 25000,
      stage: "negotiation",
      probability: 75,
      expectedCloseDate: "2024-02-15",
      description: "Desarrollo completo de sitio web corporativo con sistema de gestión de contenidos",
      contactId: 1,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-25T15:30:00Z",
    },
    {
      id: 2,
      title: "Sistema CRM Personalizado",
      client: "InnovaTech",
      value: 45000,
      stage: "proposal",
      probability: 60,
      expectedCloseDate: "2024-03-01",
      description: "Desarrollo de sistema CRM personalizado para gestión de clientes y ventas",
      contactId: 2,
      createdAt: "2024-01-08T09:15:00Z",
      updatedAt: "2024-01-23T11:45:00Z",
    },
    {
      id: 3,
      title: "Consultoría Digital",
      client: "Digital Corp",
      value: 15000,
      stage: "closed-won",
      probability: 100,
      expectedCloseDate: "2024-01-20",
      description: "Consultoría para transformación digital y optimización de procesos",
      contactId: 3,
      createdAt: "2023-12-15T14:20:00Z",
      updatedAt: "2024-01-20T16:10:00Z",
    },
  ],

  tickets: [
    {
      id: 1,
      title: "Error en sistema de pagos",
      description: "Los usuarios reportan errores al procesar pagos con tarjeta de crédito",
      priority: "high",
      status: "open",
      category: "technical",
      assignedTo: "Equipo Técnico",
      clientId: 1,
      clientName: "Tech Solutions S.L.",
      createdAt: "2024-01-25T09:30:00Z",
      updatedAt: "2024-01-25T14:15:00Z",
    },
    {
      id: 2,
      title: "Solicitud de nueva funcionalidad",
      description: "Cliente solicita agregar sistema de notificaciones push en la aplicación móvil",
      priority: "medium",
      status: "in-progress",
      category: "feature-request",
      assignedTo: "Equipo de Desarrollo",
      clientId: 2,
      clientName: "InnovaTech",
      createdAt: "2024-01-24T11:20:00Z",
      updatedAt: "2024-01-25T10:45:00Z",
    },
  ],

  purchases: [
    {
      id: 1,
      title: "Licencias Microsoft Office 365",
      supplier: "Microsoft Corporation",
      category: "software",
      amount: 2400,
      quantity: 20,
      unitPrice: 120,
      status: "completed",
      orderDate: "2024-01-20T10:00:00Z",
      deliveryDate: "2024-01-22T14:30:00Z",
      description: "Licencias anuales de Microsoft Office 365 para el equipo",
      approvedBy: "Ana García",
    },
    {
      id: 2,
      title: "Equipos de Desarrollo",
      supplier: "TechStore S.L.",
      category: "hardware",
      amount: 15000,
      quantity: 5,
      unitPrice: 3000,
      status: "pending",
      orderDate: "2024-01-24T09:15:00Z",
      deliveryDate: "2024-02-05T12:00:00Z",
      description: "Laptops de alta gama para el equipo de desarrollo",
      approvedBy: "Carlos Rodríguez",
    },
  ],

  // Helper methods
  getContacts() {
    return JSON.parse(localStorage.getItem("crm_contacts")) || this.contacts
  },

  saveContacts(contacts) {
    localStorage.setItem("crm_contacts", JSON.stringify(contacts))
  },

  getDeals() {
    return JSON.parse(localStorage.getItem("crm_deals")) || this.deals
  },

  saveDeals(deals) {
    localStorage.setItem("crm_deals", JSON.stringify(deals))
  },

  getTickets() {
    return JSON.parse(localStorage.getItem("crm_tickets")) || this.tickets
  },

  saveTickets(tickets) {
    localStorage.setItem("crm_tickets", JSON.stringify(tickets))
  },

  getPurchases() {
    return JSON.parse(localStorage.getItem("crm_purchases")) || this.purchases
  },

  savePurchases(purchases) {
    localStorage.setItem("crm_purchases", JSON.stringify(purchases))
  },
}

// Initialize data on first load
if (!localStorage.getItem("crm_contacts")) {
  localStorage.setItem("crm_contacts", JSON.stringify(CRMData.contacts))
}
if (!localStorage.getItem("crm_deals")) {
  localStorage.setItem("crm_deals", JSON.stringify(CRMData.deals))
}
if (!localStorage.getItem("crm_tickets")) {
  localStorage.setItem("crm_tickets", JSON.stringify(CRMData.tickets))
}
if (!localStorage.getItem("crm_purchases")) {
  localStorage.setItem("crm_purchases", JSON.stringify(CRMData.purchases))
}

// Make CRMData globally available
window.CRMData = CRMData
