import React, {useState, useEffect} from "react"
import {Link, useNavigate, useLocation} from "react-router-dom"
import Swal from "sweetalert2"

export default function Navbar() {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    setCurrentPath(location.pathname)
    setIsLoggedIn(!!localStorage.getItem("token"))
  }, [location.pathname])

  const handleNavLinkClick = (path: string) => {
    setCurrentPath(path)
  }

  const handleLogout = () => {
    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#213547",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        navigate("/login")
      }
    })
  }

  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <nav className="bg-transparent w-full mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Centered when not logged in on mobile */}
          <div
            className={`flex items-center ${
              !isLoggedIn && "mx-auto sm:mx-0"
            } cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out`}
            onClick={handleLogoClick}>
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block lg:hidden h-20 w-auto"
                src="/superlablogo.png"
                alt="Superlab"
              />
              <img
                className="hidden lg:block h-48 w-auto"
                src="/superlablogo.png"
                alt="Superlab"
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          {isLoggedIn && (
            <div className="hidden sm:flex items-center ml-auto">
              <div className="flex space-x-6 mr-6">
                {/* Home Link */}
                <Link
                  to="/"
                  className={`${
                    currentPath === "/"
                      ? "text-white underline decoration-2 underline-offset-8 decoration-red-800"
                      : "text-white hover:text-gray-300"
                  } px-3 py-2 text-base font-medium`}
                  aria-current={currentPath === "/" ? "page" : undefined}
                  onClick={() => handleNavLinkClick("/")}>
                  Cursos
                </Link>

                {/* Herramientas-IA Link */}
                <Link
                  to="/herramientas-ia"
                  className={`${
                    currentPath === "/herramientas-ia"
                      ? "text-white underline decoration-2 underline-offset-8 decoration-red-800"
                      : "text-white hover:text-gray-300"
                  } px-3 py-2 text-base font-medium`}
                  aria-current={
                    currentPath === "/herramientas-ia" ? "page" : undefined
                  }
                  onClick={() => handleNavLinkClick("/herramientas-ia")}>
                  Herramientas-IA
                </Link>
              </div>

              {/* Logout Button */}
              <button
                className="text-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only show when logged in */}
      {isLoggedIn && (
        <div className="sm:hidden px-2 pt-2 pb-3 border-t border-gray-700 mt-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Home Link */}
            <Link
              to="/"
              className={`${
                currentPath === "/"
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } text-center py-2 px-3 rounded-md text-sm font-medium`}
              aria-current={currentPath === "/" ? "page" : undefined}
              onClick={() => handleNavLinkClick("/")}>
              Cursos
            </Link>

            {/* Herramientas-IA Link */}
            <Link
              to="/herramientas-ia"
              className={`${
                currentPath === "/herramientas-ia"
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } text-center py-2 px-3 rounded-md text-sm font-medium`}
              aria-current={
                currentPath === "/herramientas-ia" ? "page" : undefined
              }
              onClick={() => handleNavLinkClick("/herramientas-ia")}>
              IA
            </Link>

            {/* Logout Button */}
            <button
              className="text-gray-800 hover:bg-gray-700 hover:text-white py-2 px-3 rounded-md text-sm font-medium"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
