// Authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const togglePassword = document.getElementById("togglePassword")
  const passwordInput = document.getElementById("password")
  const errorMessage = document.getElementById("errorMessage")
  const loginBtn = document.getElementById("loginBtn")

  // Check if user is already logged in
  const user = localStorage.getItem("user")
  if (user) {
    window.location.href = "dashboard.html"
  }

  // Toggle password visibility
  togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    const icon = this.querySelector("i")
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash")
  })

  // Handle login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Show loading state
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Iniciando sesión...'
    loginBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Validate credentials
      if (email === "admin@crm.com" && password === "admin123") {
        // Create user session
        const userData = {
          id: 1,
          name: "Administrador CRM",
          email: email,
          role: "admin",
          avatar: null,
          loginTime: new Date().toISOString(),
        }

        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", "mock-jwt-token")

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } else {
        // Show error
        showError("Credenciales incorrectas. Usa: admin@crm.com / admin123")
      }

      // Reset button
      loginBtn.innerHTML = "Iniciar Sesión"
      loginBtn.disabled = false
    }, 1000)
  })

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.remove("hidden")

    setTimeout(() => {
      errorMessage.classList.add("hidden")
    }, 5000)
  }
})
