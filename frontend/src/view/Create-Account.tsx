import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!username.trim() || !password.trim()) {
        setError("Por favor, ingresa tu nombre de usuario y contraseña.");
        return;
    }
    try {
        const response = await axios.post("http://3.231.254.225:8000/users/", {
            username,
            password
        });
        alert("Cuenta creada correctamente. Por favor, verifica tu correo para activar tu cuenta.");
        navigate("/login"); 
    } catch (error) {
        console.error("Error al crear la cuenta:", error);
        setError("Error al procesar la solicitud. Asegúrate de que el nombre de usuario no esté ya en uso y que la contraseña cumpla con los requisitos.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-20">
      <div className="max-w-md w-full bg-gradient-to-tl from-indigo-900 via-transparent to-red-900 border border-black rounded-xl p-8">
        <form className="space-y-4" onSubmit={handleCreateAccount}>
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
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
