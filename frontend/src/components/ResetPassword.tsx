import React, {useState} from "react"
import axios from "axios"
import {useParams, useNavigate} from "react-router-dom"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {resetToken} = useParams<{resetToken: string}>()
  
  const navigate = useNavigate()
console.log("resetToken:", resetToken)
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reiniciar estados
    setError("")
    setSuccess("")

    // Validaciones
    if (!password || !confirmPassword) {
      setError("Por favor, completa todos los campos.")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setIsLoading(true)

    try {
      // Usar la variable de entorno para la URL de la API
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

      await axios.put(`${apiUrl}/auth/reset-password/${resetToken}`, {
        password
      })

      setSuccess(
        "¡Contraseña actualizada correctamente! Serás redirigido al inicio de sesión."
      )

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error)
      setError(
        "Error al restablecer la contraseña. El enlace podría ser inválido o haber expirado."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center mt-8 mb-20">
      <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
        <h2 className="text-xl text-white font-semibold mb-4 text-center">
          Restablecer Contraseña
        </h2>
        <p className="text-white mb-4 text-sm">
          Introduce tu nueva contraseña a continuación.
        </p>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-200">{error}</p>}
          {success && <p className="text-green-200">{success}</p>}

          <button
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900 disabled:bg-gray-500"
            type="submit"
            disabled={isLoading}>
            {isLoading ? "Procesando..." : "Restablecer Contraseña"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-red-700 border text-white py-2 rounded-md hover:bg-white hover:bg-opacity-10 focus:outline-none mt-2">
            Volver a inicio de sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
