// src/components/LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useAuthentication } from '../authContext'; // Asegúrate de que este hook esté en la ruta correcta

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuthentication(); // Asume que tienes una función de logout en tu hook de autenticación

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    navigate('/'); // Redirige al usuario a la página principal
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;

