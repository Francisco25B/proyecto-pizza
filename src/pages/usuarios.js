import React, { useState, useEffect } from 'react';
import './usuarios.css'; // Archivo CSS para estilos específicos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';
import RegisterUserModal from './RegisterUserModal';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };

  const handleViewUsuario = (usuario) => {
    Swal.fire({
      title: 'Detalles del Usuario',
      html: `
        <p><strong>Nombre Completo:</strong> ${usuario.nombre_completo}</p>
        <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Dirección:</strong> ${usuario.direccion}</p>
        <p><strong>Especificaciones de Ubicación:</strong> ${usuario.especificaciones_direccion}</p>
        <p><strong>Rol del Usuario:</strong> ${usuario.rol_id === 1 ? 'Usuario' : 'Administrador'}</p>
      `,
      confirmButtonText: 'Cerrar',
      icon: 'info',
    });
  };

  const handleEditUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    toggleRegisterModal();
  };

  const handleDeleteUsuario = async (usuarioId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3001/usuarios/${usuarioId}`);
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado correctamente',
              text: 'El usuario ha sido eliminado de la base de datos',
            });
            fetchUsuarios(); // Actualizar la lista de usuarios
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar usuario',
              text: 'Hubo un problema al intentar eliminar el usuario',
            });
          }
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Hubo un error en la solicitud para eliminar el usuario',
          });
        }
      }
    });
  };

  return (
    <div className="usuarios-container">
      <h2>Usuarios Registrados</h2>

      {/* Botón circular verde con icono de más */}
      <button className="add-button" onClick={toggleRegisterModal}>
        <FontAwesomeIcon icon={faPlus} />Agregar
      </button>

      {/* Cuadro de búsqueda */}
      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button><FontAwesomeIcon icon={faSearch} /></button>
      </div>

      {/* Tabla de usuarios */}
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Especificaciones de Ubicación</th>
            <th>Rol del Usuario</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.email}</td>
              <td>{usuario.direccion}</td>
              <td>{usuario.especificaciones_direccion}</td>
              <td>{usuario.rol_id === 1 ? 'Usuario' : 'Administrador'}</td>
              <td>
                <button className="view-button" onClick={() => handleViewUsuario(usuario)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="edit-button" onClick={() => handleEditUsuario(usuario)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button" onClick={() => handleDeleteUsuario(usuario.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showRegisterModal && <RegisterUserModal toggleRegisterModal={toggleRegisterModal} refreshUsers={fetchUsuarios} usuario={selectedUsuario} />}
    </div>
  );
};

export default Usuarios;
