import React from 'react';
import './RegisterModal.css';

function RegisterModal({ toggleRegisterModal, openLoginModal }) {
  return (
    <div className="register-modal">
      <div className="register-modal-content">
        <span className="close-button" onClick={toggleRegisterModal}>&times;</span>
        <h2>Registrarse</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />
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