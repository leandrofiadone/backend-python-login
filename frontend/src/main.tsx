import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {HerramientasIA} from "./view/HerramientasIA.tsx"
import ForgotPassword from "./view/Forgot-Password.tsx"
import CreateAccount from "./view/Create-Account.tsx"
import Navbar from "./components/Navbar.tsx"
import ProtectedRoute from "./components/ProtectedRoutes.tsx"
import Login from "./view/Login.tsx"
import Footer from './components/Footer.tsx'

// eslint-disable-next-line react-refresh/only-export-components


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <div className="sm:absolute top-0 w-full z-10">
        <Navbar />
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/create-account" element={<CreateAccount />} /> 
        <Route
          path="/"
          element={<ProtectedRoute path="/" element={<App />} />}
        />
        <Route
          path="/herramientas-ia"
          element={
            <ProtectedRoute
              path="/herramientas-ia"
              element={<HerramientasIA />}
            />
          }
        />
      </Routes>

      <Footer />
    </Router>
  </React.StrictMode>
)
