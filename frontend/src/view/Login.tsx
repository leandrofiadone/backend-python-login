import axios from 'axios'
import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false)
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false)
  const navigate = useNavigate()

  // Hardcodear usuario y contraseña (para pruebas)
  const hardcodedUsername = "usuarioPrueba" // Usuario hardcodeado
  const hardcodedPassword = "password123" // Contraseña hardcodeada

  // Manejo del formulario de inicio de sesión
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validación básica de los campos
    if (!username.trim() || !password.trim()) {
      setError("Por favor, ingresa nombre de usuario y contraseña.")
      return
    }

    // --------------------------
    // ** Login Hardcodeado **
    // --------------------------
    // Aquí estamos validando las credenciales "hardcodeadas".
    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Si las credenciales coinciden con las hardcodeadas, se simula un inicio de sesión exitoso
      localStorage.setItem("token", "fake-token-for-demo") // Guardamos un token ficticio
      navigate("/") // Redirigimos al usuario a la página principal
      return // Detenemos el proceso aquí
    }

    // --------------------------
    // ** Login Normal (Backend) **
    // --------------------------
    // Si las credenciales no son las hardcodeadas, se hace una solicitud al backend real para verificar las credenciales.
    // Aquí se hace la llamada al servidor para autenticar al usuario
    try {
      // Reemplaza esta URL por la real en tu backend
      const response = await axios.post("http://localhost:8000/auth/login", {
        username,
        password
      })

      // Si el login es exitoso, se guarda el token recibido del backend
      localStorage.setItem("token", response.data.token)
      navigate("/") // Redirige a la página principal
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Usuario o contraseña incorrectos.")
    }
  }

  // Funciones para manejar el flujo de creación de cuenta y olvido de contraseña
  const handleForgotPassword = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowForgotPasswordForm(true)
  }

  const handleCreateAccount = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowCreateAccountForm(true)
  }

  const handleCreateAccountSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError("Error al procesar la solicitud.")
  }

  const handleForgotPasswordSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError("Error al procesar la solicitud.")
  }

  const handleBackToLogin = () => {
    setShowCreateAccountForm(false)
    setShowForgotPasswordForm(false)
    setError("")
  }

  return (
    <div className="flex justify-center sm:mx-0 mx-6 items-center mt-8 mb-20 ">
      <div className="max-w-md w-full border-black bg-gradient-to-tl from-indigo-900 via-transparent hover:via-black to-red-900 sm:px-10 border rounded-xl sm:p-8 p-6">
        {!showCreateAccountForm && !showForgotPasswordForm ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full border border-gray-300 rounded-md sm:py-2 py-1 px-4 focus:outline-none focus:border-black"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-200">{error}</p>}
            <button
              className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900"
              type="submit">
              Iniciar sesión
            </button>
            <a
              href="#"
              onClick={handleForgotPassword}
              className="block mt-2"
              style={{textDecoration: "none"}}>
              Olvidé mi contraseña
            </a>
            <a
              href="#"
              onClick={handleCreateAccount}
              style={{textDecoration: "none"}}
              className="block mt-2">
              Crear cuenta
            </a>
          </form>
        ) : showCreateAccountForm ? (
          <div className="flex justify-center items-center mt-8 mb-20">
            <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
              <form className="space-y-4" onSubmit={handleCreateAccountSubmit}>
                <div>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                    type="text"
                    placeholder="Nombre de usuario o email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-200">{error}</p>}
                <button
                  className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900"
                  type="submit">
                  Crear cuenta
                </button>
                <button
                  onClick={handleBackToLogin}
                  className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900">
                  Volver a inicio de sesión
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-8 mb-20">
            <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
              <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
                <div>
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
                    type="text"
                    placeholder="Nombre de usuario o email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-200">{error}</p>}
                {message && <p className="text-green-200">{message}</p>}
                <button
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900"
                  type="submit">
                  Enviar
                </button>
                <button
                  onClick={handleBackToLogin}
                  className="w-full border border-black bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900">
                  Volver a inicio de sesión
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
