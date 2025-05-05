import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar el envío del formulario, tipado correctamente
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir recarga de la página al enviar el formulario
    if (!username.trim()) {
        setError("Por favor, ingresa tu nombre de usuario o correo electrónico.");
        return;
    }
    try {
      const response = await axios.put("http://3.231.254.225:8000/auth/forgot-password", {
        username
      })
        alert("Si tu cuenta existe, recibirás un correo con las instrucciones para restablecer tu contraseña.");
        navigate("/forgot-password");
    } catch (error) {
        console.error("Error al solicitar el restablecimiento de contraseña:", error);
        setError("Error al procesar la solicitud.");
    }
};

  return (
    <div className="flex justify-center items-center mt-8 mb-20">
      <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-black"
              type="text"
              placeholder="Nombre de usuario o email"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </div>
          {error && <p className="text-red-200">{error}</p>}
          <button
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-900"
            type="submit">
            Enviar 
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
