// src/components/ProtectedRoute.js

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthentication } from '../components/authContext'; // Asegúrate de que este hook esté en la ruta correcta

const ProtectedRoute = ({ children, toggleLoginModal }) => {
  const { user } = useAuthentication();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        toggleLoginModal(); // Llama a la función toggleLoginModal para mostrar el modal de inicio de sesión
      });
    }
  }, [user, toggleLoginModal]);

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;

