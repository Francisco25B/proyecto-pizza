import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdminHeader.css'; // Importa el archivo de estilos
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Componente funcional para el encabezado del administrador
export function AdminHeader() {
  const [showProfileModal, setShowProfileModal] = useState(false); // Estado para controlar la visibilidad del modal de perfil

  // Datos de ejemplo de usuario
  const user = {
    nombre: 'Nombre del Usuario',
    cargo: 'Cargo del Usuario',
    telefono: '555-1234',
    correo: 'usuario@example.com',
    foto: 'ruta/a/imagen.jpg' // Ruta de la imagen del usuario
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí deberías manejar la lógica para cerrar sesión
        window.location.href = '/'; // Redirige a la página de inicio
      }
    });
  };

 // Función para manejar el clic en el icono de campanita (notificaciones)
 const handleNotifications = () => {
  // Aquí deberías implementar la lógica para mostrar las notificaciones
  Swal.fire({
    title: 'Notificaciones',
    text: 'Sin pedidos por el momento', // Ejemplo de mensaje temporal
    icon: 'info',
  });
};



  // Función para abrir el modal de perfil
  const openProfileModal = () => setShowProfileModal(true);

  // Función para cerrar el modal de perfil
  const closeProfileModal = () => setShowProfileModal(false);

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Bienvenido Administrador</h1>
          <div className="header-search">
            <input type="text" placeholder="Buscar..." />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
        <div className="header-icons">
          <FontAwesomeIcon icon={faBell} className="icon notification-icon" onClick={handleNotifications} />
          <FontAwesomeIcon icon={faUser} className="icon user-icon" onClick={openProfileModal} />
          <FontAwesomeIcon icon={faSignOutAlt} className="icon logout-icon" onClick={handleLogout} />
        </div>
      </div>

      {/* Modal para mostrar los detalles del perfil del usuario */}
      {showProfileModal && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <div className="profile-modal-header">
              <h2>Perfil de Usuario</h2>
              <button className="close-modal" onClick={closeProfileModal}>
                &times;
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-picture">
                <img src={user.foto} alt="Usuario" className="avatar" />
              </div>
              <div className="profile-details">
                <h2>{user.nombre}</h2>
                <p>{user.cargo}</p>
                <p>Teléfono: {user.telefono}</p>
                <p>Correo: {user.correo}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
