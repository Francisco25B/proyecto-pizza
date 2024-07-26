// authentication.js

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getUserRole = () => {
    return user ? user.role : null;
  };

  const getUserId = () => {
    return user ? user.id : null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, getUserRole, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthentication debe ser usado dentro de un AuthProvider');
  }
  return context;
};
