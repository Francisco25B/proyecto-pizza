import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileUser.css';

function ProfileUser() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirigir al login si no hay token
      return; // Asegúrate de salir de la función si no hay token
    }

    fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 401) {
        navigate('/login'); // Redirigir al login si el token no es válido
        return;
      }
      return response.json();
    })
    .then(data => {
      setUserData(data);
      setIsLoggedIn(true);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      navigate('/login'); // Redirigir al login en caso de error
    });
  }, [navigate]);

  if (!isLoggedIn) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Perfil del Usuario</h1>
      {userData ? (
        <div className="profile-details">
          <p><strong>Nombre Completo:</strong> {userData.nombre_completo}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <p><strong>Dirección:</strong> {userData.direccion}</p>
          <p><strong>Especificaciones de Dirección:</strong> {userData.especificaciones_direccion}</p>
          
        </div>
      ) : (
        <p>No se encontraron datos del usuario.</p>
      )}
    </div>
  );
}

export default ProfileUser;


