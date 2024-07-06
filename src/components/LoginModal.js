import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { validateLogin } from '../components/controlador';
import './LoginModal.css';

function LoginModal({ toggleLoginModal, openRegisterModal, onLoginSuccess }) {
  const [fullName, setFullName] = useState('');
  const [number, setNumber] = useState('');
  const navigate = useNavigate(); // Cambia de useHistory a useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    if (number.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número debe contener exactamente 10 dígitos.',
      });
      return;
    }

    const userCredentials = {
      fullName: fullName,
      number: number,
    };

    // Aquí deberías validar el login
    validateLogin(userCredentials, (userData) => {
      onLoginSuccess(userData); // Llama a la función de éxito al iniciar sesión
      setFullName(''); // Limpia los campos después de iniciar sesión
      setNumber('');
      
      // Redirige al usuario dependiendo del rol o cualquier lógica de redirección necesaria
      if (userData.rol_id === 2) { // Suponiendo que el rol de administrador es 2
        navigate('/administrador'); // Redirige a la interfaz del administrador usando navigate
      }
    });
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
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
            <label htmlFor="number">Número:</label>
            <input
              type="text"
              id="number"
              name="number"
              value={number}
              onChange={handleNumberChange}
              pattern="\d{10}"
              title="Debe contener 10 dígitos numéricos"
              required
            />
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
