import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RegisterModal.css';

function RegisterModal({ toggleRegisterModal, onRegisterSuccess, toggleLoginModal }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor, asegúrate de que ambas contraseñas sean iguales.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      return;
    }

    const newUser = {
      fullName,
      email,
      password,
      phoneNumber
    };

    try {
      await axios.post('http://localhost:3001/register', newUser);
      onRegisterSuccess(); // Llama a la función de éxito al registrarse
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada exitosamente.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });

      toggleRegisterModal(); // Cierra el modal después del registro exitoso
      toggleLoginModal(); // Abre el modal de inicio de sesión
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="register-modal">
      <div className="register-modal-content">
        <button className="close-button" onClick={toggleRegisterModal}>&times;</button>
        <div className="register-image"></div>
        <div className="register-form">
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo:</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Número de Teléfono:</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="register-button">Registrar</button>
          </form>
          <div className="login-link" onClick={() => {
            toggleRegisterModal();
            toggleLoginModal();
          }}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;


