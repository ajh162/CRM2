// Common functionality shared across pages
class CRMApp {
  constructor() {
    this.user = null
    this.init()
  }

  init() {
    this.checkAuth()
    this.setupNavigation()
    this.setupLogout()
    this.loadUserData()
  }

  checkAuth() {
    const user = localStorage.getItem("user")
    if (!user) {
      window.location.href = "index.html"
      return
    }
    this.user = JSON.parse(user)
  }

  setupNavigation() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split("/").pop()
    const navItems = document.querySelectorAll(".nav-item")

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href") === currentPage) {
        item.classList.add("active")
      }
    })

    // Sidebar toggle
    const toggleBtn = document.getElementById("toggleSidebar")
    const sidebar = document.getElementById("sidebar")

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("w-64")
        sidebar.classList.toggle("w-16")

        const spans = sidebar.querySelectorAll("nav span")
        spans.forEach((span) => {
          span.classList.toggle("hidden")
        })
      })
    }
  }

  setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          window.location.href = "index.html"
        }
      })
    }
  }

  loadUserData() {
    if (this.user) {
      // Update user info in header
      const userName = document.getElementById("userName")
      const userEmail = document.getElementById("userEmail")
      const userInitials = document.getElementById("userInitials")
      const welcomeName = document.getElementById("welcomeName")

      if (userName) userName.textContent = this.user.name
      if (userEmail) userEmail.textContent = this.user.email
      if (welcomeName) welcomeName.textContent = this.user.name.split(" ")[0]

      if (userInitials) {
        const initials = this.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        userInitials.textContent = initials
      }
    }
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`
    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} mr-2"></i>
                <span>${message}</span>
            </div>
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }
}

// CSS for navigation
const style = document.createElement("style")
style.textContent = `
    .nav-item {
        color: #6b7280;
        text-decoration: none;
        transition: all 0.2s;
    }
    
    .nav-item:hover {
        background-color: #f3f4f6;
        color: #374151;
    }
    
    .nav-item.active {
        background-color: #3b82f6;
        color: white;
    }
    
    .nav-item.active:hover {
        background-color: #2563eb;
    }
`
document.head.appendChild(style)

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.crmApp = new CRMApp()
})
