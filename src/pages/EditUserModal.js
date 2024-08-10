import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EditUserModal.css';

const EditUserModal = ({ toggleEditModal, refreshUsers, usuario }) => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    direccion: '',
    especificaciones_direccion: '',
    rol_id: 1,
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_completo: usuario.nombre_completo,
        telefono: usuario.telefono,
        email: usuario.email,
        direccion: usuario.direccion,
        especificaciones_direccion: usuario.especificaciones_direccion,
        rol_id: usuario.rol_id,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log('Enviando solicitud a servidor...');
        const response = await axios.put(`http://localhost:3001/clientes/${usuario.id}`, formData);
        console.log('Respuesta recibida del servidor:', response);

        if (response.status === 200) {
            await Swal.fire({
                icon: 'success',
                title: 'Actualización exitosa',
                text: 'El usuario ha sido actualizado exitosamente.',
            });

            refreshUsers(); // Actualiza la lista de usuarios
            toggleEditModal(); // Cierra el modal
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Hubo un error al actualizar el usuario.',
        });
    }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Usuario</h2>
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
          <button type="submit">Actualizar</button>
          <button type="button" onClick={toggleEditModal}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
