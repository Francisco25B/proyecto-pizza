// AuthContext.js

import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    // Lógica para iniciar sesión
  };

  const logout = () => {
    // Lógica para cerrar sesión
  };

  const isAuthenticated = () => {
    // Lógica para verificar si el usuario está autenticado
  };

  const getUserRole = () => {
    // Lógica para obtener el rol del usuario
    // Esta función debe estar definida aquí y accesible a través del contexto
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
