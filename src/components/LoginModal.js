import React from 'react';
import './LoginModal.css';

function LoginModal({ toggleLoginModal, openRegisterModal }) {
  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <span className="close-button" onClick={toggleLoginModal}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <form>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo:</label>
            <input type="text" id="fullName" name="fullName" required />
          </div>
          <div className="form-group">
            <label htmlFor="number">Número:</label>
            <input type="text" id="number" name="number" required />
          </div>
          <button type="submit" className="login-button">Ingresar</button>
        </form>
        <div className="register-link" onClick={openRegisterModal}>
          Registrar
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
