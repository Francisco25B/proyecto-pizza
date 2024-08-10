import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado para el usuario autenticado

  const login = (userData) => {
    setUser(userData); // Actualiza el usuario
  };

  const logout = () => {
    setUser(null); // Limpia el usuario
  };

  const isAuthenticated = () => {
    return !!user; // Verifica si el usuario está autenticado
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthProvider');
  }
  return context;
}