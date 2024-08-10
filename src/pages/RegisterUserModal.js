import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RegisterUserModal.css'; // Archivo CSS para estilos específicos

const RegisterUserModal = ({ toggleRegisterModal, refreshUsers }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    direccion: '',
    especificaciones_direccion: '',
    rol_id: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register_user', formData);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario ha sido registrado exitosamente.',
      });
      refreshUsers();
      toggleRegisterModal();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'Hubo un error al registrar el usuario.',
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registrar Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre Completo:
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Especificaciones de Dirección:
            <input
              type="text"
              name="especificaciones_direccion"
              value={formData.especificaciones_direccion}
              onChange={handleChange}
            />
          </label>
          <label>
            Rol:
            <select
              name="rol_id"
              value={formData.rol_id}
              onChange={handleChange}
              required
            >
              <option value="1">Usuario</option>
              <option value="2">Administrador</option>
            </select>
          </label>
          <button type="submit">Registrar</button>
          <button type="button" onClick={toggleRegisterModal}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserModal;
