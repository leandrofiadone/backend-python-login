import React from "react"
import {Navigate} from "react-router-dom"

interface ProtectedRouteProps {
  path: string
  element: React.ReactNode
}

// const isAuthenticated = () => {
//   // Verificar si el token existe en localStorage
// //   const token = localStorage.getItem('token');
// //   return !!token;  // Devuelve true si el token existe, false si no

//     const isAuthenticatedValue = false // Cambia este valor para simular diferentes estados de autenticación
//     return isAuthenticatedValue
// }

const isAuthenticated = () => {
  // Verificar si el token existe en localStorage
  const token = localStorage.getItem("token")
  // Devuelve true si el token existe y no está vacío, false si no
  return !!token
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element}) => {
  return isAuthenticated() ? (
    element // Renderiza el elemento pasado como prop si el usuario está autenticado
  ) : (
    <Navigate to="/login" replace /> // Redirige al usuario a la página de login si no está autenticado
  )
}

export default ProtectedRoute
