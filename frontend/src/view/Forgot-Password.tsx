import React, {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Función para manejar el envío del formulario
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevenir recarga de la página al enviar el formulario

    // Reiniciar estados
    setError("")
    setSuccess("")

    if (!identifier.trim()) {
      setError("Por favor, ingresa tu nombre de usuario o correo electrónico.")
      return
    }

    setIsLoading(true)

    try {
      // Usar la variable de entorno para la URL de la API
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

      await axios.post(`${apiUrl}/auth/forgot-password`, {
        identifier
      })

      setSuccess(
        "Si tu cuenta existe, recibirás un correo con las instrucciones para restablecer tu contraseña."
      )
      // Opcionalmente, después de un tiempo podríamos redirigir al usuario
      setTimeout(() => {
        navigate("/login")
      }, 5000)
    } catch (error) {
      console.error(
        "Error al solicitar el restablecimiento de contraseña:",
        error
      )
      setError(
        "Error al procesar la solicitud. Por favor, intenta de nuevo más tarde."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center mt-8 mb-20">
      <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
        <h2 className="text-xl text-white font-semibold mb-4 text-center">
          Recupera tu contraseña
        </h2>
        <p className="text-white mb-4 text-sm">
          Ingresa tu nombre de usuario o correo electrónico y te enviaremos
          instrucciones para restablecer tu contraseña.
        </p>

        <form className="space-y-4" onSubmit={handleForgotPassword}>
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
          {success && <p className="text-green-200">{success}</p>}

          <button
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-gray-500"
            type="submit"
            disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar instrucciones"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-white text-white py-2 rounded-md hover:bg-white hover:bg-opacity-10 focus:outline-none mt-2">
            Volver a inicio de sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
