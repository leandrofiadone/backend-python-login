import axios from "axios"
import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

const Login = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false)
  const navigate = useNavigate()

  const hardcodedUsername = "usuarioPrueba"
  const hardcodedEmail = "usuario@prueba.com"
  const hardcodedPassword = "password123"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!identifier.trim() || !password.trim()) {
      setError("Por favor, ingresa tu nombre de usuario/email y contraseña.")
      return
    }

    setIsLoading(true)

    if (
      (identifier === hardcodedUsername || identifier === hardcodedEmail) &&
      password === hardcodedPassword
    ) {
      localStorage.setItem("token", "fake-token-for-demo")
      navigate("/")
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
      const response = await axios.post(`${apiUrl}/auth/login`, {
        identifier,
        password
      })

      localStorage.setItem("token", response.data.token)
      navigate("/")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Usuario/email o contraseña incorrectos.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowForgotPasswordForm(true)
    setError("")
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
      await axios.post(`${apiUrl}/auth/forgot-password`, {identifier})

      setMessage(
        "Si existe una cuenta con este usuario/email, recibirás un correo con instrucciones para restablecer tu contraseña."
      )
    } catch (error) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)
      setMessage(
        "Si existe una cuenta con este usuario/email, recibirás un correo con instrucciones para restablecer tu contraseña."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowForgotPasswordForm(false)
    setError("")
    setMessage("")
  }

  return (
    <div className="flex justify-center sm:mx-0 mx-6 items-center mt-8 mb-20">
      <div className="max-w-md w-full border-black bg-gradient-to-tl from-indigo-900 via-transparent hover:via-black to-red-900 sm:px-10 border rounded-xl sm:p-8 p-6">
        {!showForgotPasswordForm ? (
          <>
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              Iniciar Sesión
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                type="text"
                placeholder="Nombre de usuario o email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
              <input
                className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {error && <p className="text-red-200">{error}</p>}
              <button
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Cargando..." : "Iniciar sesión"}
              </button>
              <div className="flex justify-center">
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-white hover:underline"
                  style={{textDecoration: "none"}}>
                  Olvidé mi contraseña
                </a>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              Recuperar Contraseña
            </h2>
            <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
              <input
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                type="text"
                placeholder="Nombre de usuario o email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
              {error && <p className="text-red-200">{error}</p>}
              {message && <p className="text-green-200">{message}</p>}
              <button
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-red-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Procesando..." : "Enviar instrucciones"}
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900"
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
