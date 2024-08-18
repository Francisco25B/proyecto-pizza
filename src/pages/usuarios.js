import React, { useState, useEffect } from 'react';
import './usuarios.css'; // Archivo CSS para estilos específicos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';
import RegisterUserModal from './RegisterUserModal';
import EditUserModal from './EditUserModal';
import SearchBox from './SearchBox';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://backend-pizza-p9w9.onrender.com/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
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
    toggleEditModal();
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
                // Primero eliminar registros relacionados en pedido_pizza y pedido_pizza_detalle
                await axios.delete(`https://backend-pizza-p9w9.onrender.com/pedidos/clientes/${usuarioId}`);

                // Luego eliminar el usuario
                const response = await axios.delete(`https://backend-pizza-p9w9.onrender.com/clientes/${usuarioId}`);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario eliminado correctamente',
                        text: 'El usuario ha sido eliminado de la base de datos',
                    });
                    // Añadir un retraso antes de actualizar la lista de usuarios
                    setTimeout(() => {
                        fetchUsuarios(); // Actualizar la lista de usuarios
                    }, 1000); // Pausa de 1 segundo
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

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.telefono.toString().includes(searchTerm) ||  // Convertir telefono a cadena
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.especificaciones_direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.rol_id === 1 ? 'Usuario' : 'Administrador').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <h2>Usuarios Registrados</h2>

      <button className="add-button" onClick={toggleRegisterModal}>
        <FontAwesomeIcon icon={faPlus} /> Agregar
      </button>

      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredUsuarios.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
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
            {filteredUsuarios.map(usuario => (
              <tr key={usuario.id}>
                <td data-label="Nombre Completo">{usuario.nombre_completo}</td>
                <td data-label="Teléfono">{usuario.telefono}</td>
                <td data-label="Email">{usuario.email}</td>
                <td data-label="Dirección">{usuario.direccion}</td>
                <td data-label="Especificaciones">{usuario.especificaciones_direccion}</td>
                <td data-label="Rol">{usuario.rol_id === 1 ? 'Usuario' : 'Administrador'}</td>
                <td data-label="Opciones">
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
      )}

      {showRegisterModal && <RegisterUserModal toggleRegisterModal={toggleRegisterModal} refreshUsers={fetchUsuarios} />}
      {showEditModal && <EditUserModal toggleEditModal={toggleEditModal} refreshUsers={fetchUsuarios} usuario={selectedUsuario} />}
    </div>
  );
};

export default Usuarios;
