import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './LoginModal.css';

function LoginModal({ toggleLoginModal, openRegisterModal, onLoginSuccess }) {
  const [fullName, setFullName] = useState('');
  const [number, setNumber] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (number.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número debe contener exactamente 10 dígitos.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      return;
    }

    const userCredentials = {
      fullName: fullName,
      number: number
    };

    try {
      const response = await axios.post('http://localhost:3001/login', userCredentials);
      if (response.status === 200) {
        const { user } = response.data;
        onLoginSuccess(user); // Llama a la función de éxito al iniciar sesión

        // Aquí puedes almacenar el token si decides implementarlo más tarde
        // localStorage.setItem('token', token);

        // Redirigir al usuario dependiendo del rol o cualquier lógica de redirección necesaria
        if (user.rol_id === 2) { 
          navigate('/administrador'); 
        }

        Swal.fire({
          icon: 'success',
          title: 'Sesión iniciada correctamente',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        console.error('Error en el inicio de sesión:', response.data);
        Swal.fire({
          icon: 'error',
          title: 'Error en el inicio de sesión',
          text: 'Nombre de usuario o número de teléfono incorrectos.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Hubo un problema al intentar iniciar sesión.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    if (/^[\d\s]*$/.test(value) && value.length <= 10) {
      setNumber(value);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <span className="close-button" onClick={toggleLoginModal}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Número de Teléfono:</label>
            <input
              type="text"
              id="number"
              name="number"
              value={number}
              onChange={handleTelefonoChange}
              placeholder="1234567890"
              required
            />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
        <p className="switch-to-register-text" onClick={openRegisterModal}>
          ¿No tienes una cuenta? Regístrate aquí
        </p>
      </div>
    </div>
  );
}

export default LoginModal;


