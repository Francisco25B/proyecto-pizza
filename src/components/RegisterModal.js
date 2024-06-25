import React, { useState } from 'react';
import axios from 'axios';
import './RegisterModal.css';

function RegisterModal({ toggleRegisterModal, openLoginModal }) {
  const [nombre_completo, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [especificaciones_direccion, setEspecificacionesDireccion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      nombre_completo,
      telefono,
      email,
      direccion,
      especificaciones_direccion,
    };

    axios.post('http://localhost:3001/register_user', newUser)
    .then(response => {
        console.log(response.data);
        // Aquí podrías mostrar un mensaje de éxito o redirigir al usuario
    })
    .catch(error => {
        console.error('Error en el registro:', error);
        // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    });

  };

  return (
    <div className="register-modal">
      <div className="register-modal-content">
        <span className="close-button" onClick={toggleRegisterModal}>&times;</span>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_completo">Nombre Completo:</label>
            <input type="text" id="nombre_completo" name="nombre_completo" value={nombre_completo} onChange={(e) => setNombreCompleto(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Número de Teléfono:</label>
            <input type="text" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
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
          <button type="submit" className="register-button">Registrar</button>
        </form>
        <p className="back-to-login-text" onClick={openLoginModal}>
          Volver al inicio de sesión
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
