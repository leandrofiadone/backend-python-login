import axios from "axios"
import React, {useState} from "react"
import {useNavigate, Link} from "react-router-dom"

const Login = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false)
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false)
  const navigate = useNavigate()

  // Hardcodear usuario y contraseña (para pruebas)
  const hardcodedUsername = "usuarioPrueba" // Usuario hardcodeado
  const hardcodedEmail = "usuario@prueba.com" // Email hardcodeado
  const hardcodedPassword = "password123" // Contraseña hardcodeada

  // Manejo del formulario de inicio de sesión
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validación básica de los campos
    if (!identifier.trim() || !password.trim()) {
      setError("Por favor, ingresa tu nombre de usuario/email y contraseña.")
      return
    }

    setIsLoading(true)

    // --------------------------
    // ** Login Hardcodeado **
    // --------------------------
    // Aquí estamos validando las credenciales "hardcodeadas".
    if (
      (identifier === hardcodedUsername || identifier === hardcodedEmail) &&
      password === hardcodedPassword
    ) {
      // Si las credenciales coinciden con las hardcodeadas, se simula un inicio de sesión exitoso
      localStorage.setItem("token", "fake-token-for-demo") // Guardamos un token ficticio
      navigate("/") // Redirigimos al usuario a la página principal
      return // Detenemos el proceso aquí
    }

    // --------------------------
    // ** Login Normal (Backend) **
    // --------------------------
    try {
      // Usar la variable de entorno para la URL de la API
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      const response = await axios.post(`${apiUrl}/auth/login`, {
        identifier,
        password
      })

      // Si el login es exitoso, se guarda el token recibido del backend
      localStorage.setItem("token", response.data.token)
      navigate("/") // Redirige a la página principal
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Usuario/email o contraseña incorrectos.")
    } finally {
      setIsLoading(false)
    }
  }

  // Funciones para manejar el flujo de creación de cuenta y olvido de contraseña
  const handleForgotPassword = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowForgotPasswordForm(true)
    setError("")
  }

  const handleCreateAccount = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowCreateAccountForm(true)
    setError("")
  }

  const handleCreateAccountSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError("")

    // Validación básica de los campos
    if (!identifier.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.")
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      await axios.post(`${apiUrl}/auth/register`, {
        username: identifier,
        email: identifier.includes("@") ? identifier : "",
        password
      })

      setMessage("Cuenta creada exitosamente. Ahora puedes iniciar sesión.")
      setTimeout(() => {
        handleBackToLogin()
      }, 2000)
    } catch (error) {
      console.error("Error al crear cuenta:", error)
      setError("Error al crear la cuenta. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError("")

    if (!identifier.trim()) {
      setError("Por favor, ingresa tu nombre de usuario o email.")
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      console.log("👉 Enviando forgot-password a:", apiUrl)
      await axios.post(`${apiUrl}/auth/forgot-password`, {
        identifier
      })

      setMessage(
        "Si existe una cuenta con este usuario/email, recibirás un correo con instrucciones para restablecer tu contraseña."
      )
    } catch (error) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)
      // Mensaje genérico para evitar revelar información sobre existencia de cuentas
      setMessage(
        "Si existe una cuenta con este usuario/email, recibirás un correo con instrucciones para restablecer tu contraseña."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowCreateAccountForm(false)
    setShowForgotPasswordForm(false)
    setError("")
    setMessage("")
  }

  return (
    <div className="flex justify-center sm:mx-0 mx-6 items-center mt-8 mb-20">
      <div className="max-w-md w-full border-black bg-gradient-to-tl from-indigo-900 via-transparent hover:via-black to-red-900 sm:px-10 border rounded-xl sm:p-8 p-6">
        {!showCreateAccountForm && !showForgotPasswordForm ? (
          <>
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              Iniciar Sesión
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                  type="text"
                  placeholder="Nombre de usuario o email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-200">{error}</p>}
              <button
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Cargando..." : "Iniciar sesión"}
              </button>
              <div className="flex justify-between">
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-white hover:underline"
                  style={{textDecoration: "none"}}>
                  Olvidé mi contraseña
                </a>
                <a
                  href="#"
                  onClick={handleCreateAccount}
                  className="text-white hover:underline"
                  style={{textDecoration: "none"}}>
                  Crear cuenta
                </a>
              </div>
            </form>
          </>
        ) : showCreateAccountForm ? (
          <>
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              Crear Cuenta
            </h2>
            <form className="space-y-4" onSubmit={handleCreateAccountSubmit}>
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                  type="text"
                  placeholder="Nombre de usuario o email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-200">{error}</p>}
              {message && <p className="text-green-200">{message}</p>}
              <button
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Procesando..." : "Crear cuenta"}
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                disabled={isLoading}
                type="button">
                Volver a inicio de sesión
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              Recuperar Contraseña
            </h2>
            <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <input
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                  type="text"
                  placeholder="Nombre de usuario o email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-200">{error}</p>}
              {message && <p className="text-green-200">{message}</p>}
              <button
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 border border-black disabled:bg-red-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Procesando..." : "Enviar"}
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                disabled={isLoading}
                type="button">
                Volver a inicio de sesión
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Login
