import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function RegisterUserModal({ toggleRegisterModal, refreshUsers }) {
  const [nombre_completo, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [especificaciones_direccion, setEspecificacionesDireccion] = useState('');
  const [rol_id, setRolId] = useState(1); // Por defecto, rol de usuario

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el número de teléfono tenga exactamente 10 dígitos y sea numérico
    if (telefono.length !== 10 || !(/^\d+$/.test(telefono))) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de teléfono debe contener solo 10 dígitos numéricos.',
      });
      return;
    }

    const newUser = {
      nombre_completo,
      telefono,
      email,
      direccion,
      especificaciones_direccion,
      rol_id,
    };

    try {
      const response = await axios.post('http://localhost:3001/register_user', newUser);

      if (response.status === 200) {
        // Validar el contenido de la respuesta
        if (response.data.message === 'Usuario registrado exitosamente') {
          Swal.fire({
            icon: 'success',
            title: 'Usuario registrado correctamente',
            text: '¡El usuario ha sido registrado exitosamente!',
          }).then(() => {
            toggleRegisterModal(); // Cerrar el modal
            refreshUsers(); // Actualizar la lista de usuarios
          });
        } else {
          console.error('Error en el registro:', response.data.message);
        }
      } else {
        console.error('Error en el registro:', response.statusText);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="register-modal">
      <div className="register-modal-content">
        <span className="close-button" onClick={toggleRegisterModal}>&times;</span>
        <h2>Registrar Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_completo">Nombre Completo:</label>
            <input type="text" id="nombre_completo" name="nombre_completo" value={nombre_completo} onChange={(e) => setNombreCompleto(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Número de Teléfono:</label>
            <input type="tel" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="especificaciones_direccion">Referencias del Lugar:</label>
            <input type="text" id="especificaciones_direccion" name="especificaciones_direccion" value={especificaciones_direccion} onChange={(e) => setEspecificacionesDireccion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="rol_id">Rol del Usuario:</label>
            <select id="rol_id" name="rol_id" value={rol_id} onChange={(e) => setRolId(e.target.value)} required>
              <option value="1">Usuario</option>
              <option value="2">Administrador</option>
            </select>
          </div>
          <button type="submit" className="register-button">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUserModal;
