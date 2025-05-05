import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import Swal from "sweetalert2"

export default function Navbar() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const navigate = useNavigate()

  const handleNavLinkClick = (path: React.SetStateAction<string>) => {
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
        navigate("/login")
      }
    })
  }

  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <nav className=" bg-transparent max-w-full mt-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between sm:h-16 h-14">
          {/* Logo */}
          <div
            className="flex-1 flex items-center sm:items-stretch sm:justify-start cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out"
            onClick={handleLogoClick}>
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block lg:hidden h-5 w-auto"
                src="/superlablogo"
                alt="Workflow"
              />
              <img
                className="hidden lg:block h-24 w-auto"
                src="/superlablogo.png"
                alt="Workflow"
              />
            </div>
          </div>

          {/* Navigation Links */}
          {location.pathname !== "/login" && (
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <div className="mr-32">
                    {/* Home Link */}
                    <Link
                      to="/"
                      className={`${
                        currentPath === "/"
                          ? "text-white underline decoration-2 underline-offset-8 decoration-red-800"
                          : "text-white"
                      } px-3 py-2 rounded-md text-base font-medium mr-10`}
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
                          : "text-white"
                      } px-3 py-2 rounded-md text-base font-medium`}
                      aria-current={
                        currentPath === "/herramientas-ia" ? "page" : undefined
                      }
                      onClick={() => handleNavLinkClick("/herramientas-ia")}>
                      Herramientas-IA
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <button
                    className="text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
                    onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Profile dropdown (Commented out for now) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile Dropdown */}
            {/* Commented out for now */}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden" id="mobile-menu">
        {location.pathname !== "/login" && (
          <div className="flex px-2 pt-2 pb-2 space-y-1">
            {/* Home Link */}
            <Link
              to="/"
              className={`${
                currentPath === "/"
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } block pt-2 w-[70%] py-0 rounded-xl sm:text-base text-xs  font-medium`}
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
              } block pt-2 w-full py-0 rounded-xl sm:text-base text-xs font-medium`}
              aria-current={
                currentPath === "/herramientas-ia" ? "page" : undefined
              }
              onClick={() => handleNavLinkClick("/herramientas-ia")}>
              Herramientas-IA
            </Link>

            {/* Logout Button */}
            <button
              className="text-gray-800 ml-4 hover:bg-gray-700 hover:text-white  block max-w-16 rounded-md sm:text-base text-xs  font-medium w-full "
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
