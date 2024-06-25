import React, { useState } from 'react';
import axios from 'axios';
import './RegisterModal.css';

function RegisterModal({ toggleRegisterModal, openLoginModal }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [placeReferences, setPlaceReferences] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Objeto con los datos del usuario a registrar
    const newUser = {
      fullName: fullName,
      email: email,
      address: address,
      placeReferences: placeReferences
    };

    // Hacer una solicitud POST usando Axios
    axios.post('/register_user.php', newUser)
  .then(response => {
    console.log(response.data);
    // Aquí podrías mostrar un mensaje de éxito o redirigir al usuario
  })
  .catch(error => {
    console.error('Error en el registro: ', error);
  });

  };

  return (
    <div className="register-modal">
      <div className="register-modal-content">
        <span className="close-button" onClick={toggleRegisterModal}>&times;</span>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo:</label>
            <input type="text" id="fullName" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Dirección:</label>
            <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="placeReferences">Referencias del Lugar:</label>
            <input type="text" id="placeReferences" name="placeReferences" value={placeReferences} onChange={(e) => setPlaceReferences(e.target.value)} required />
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
