import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './LoginModal.css';
import { useAuthentication } from '../components/authentication'; // Ruta unificada

function LoginModal({ toggleLoginModal, openRegisterModal, onLoginSuccess }) {
  const [fullName, setFullName] = useState('');
  const [number, setNumber] = useState('');
  const { login } = useAuthentication(); // Agrega la función de login del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el número tenga exactamente 10 dígitos
    if (number.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número debe contener exactamente 10 dígitos.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      return;
    }

    const userCredentials = {
      fullName: fullName,
      number: number,
    };

    try {
      // Actualiza la URL aquí
      const response = await axios.post('https://backend-pizza-p9w9.onrender.com/login', userCredentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token); // Guarda el token en localStorage
      login(user); // Llama a la función de login del contexto
      setFullName(''); // Limpiar los campos después de iniciar sesión
      setNumber('');

      // Redirigir al usuario dependiendo del rol o cualquier lógica de redirección necesaria
      if (user.rol_id === 2) { // Suponiendo que el rol de administrador es 2
        navigate('/administrador'); // Redirige a la interfaz del administrador usando navigate
      } else {
        navigate('/'); // Redirige a la página principal o perfil
      }

      // Mostrar un mensaje de éxito que se cierra automáticamente después de 2 segundos
      Swal.fire({
        icon: 'success',
        title: 'Sesión iniciada correctamente',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // Llamar a la función onLoginSuccess para cerrar el modal
      onLoginSuccess(user);
    } catch (error) {
      // Mostrar alerta de error si hay un problema durante el inicio de sesión
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: 'Hubo un problema al intentar iniciar sesión.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    // Validar que el valor ingresado sean números y no exceda los 10 dígitos
    if (/^\d*$/.test(value) && value.length <= 10) {
      setNumber(value);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <button className="close-button" onClick={toggleLoginModal}>
          &times;
        </button>
        <div className="login-image"></div>
        <div className="login-form">
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
              <label htmlFor="number">Número:</label>
              <input
                type="text"
                id="number"
                name="number"
                value={number}
                onChange={handleTelefonoChange}
                placeholder="+52"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Ingresar
            </button>
          </form>
          <div className="register-link" onClick={openRegisterModal}>
            ¿No tienes cuenta? Regístrate
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
