import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import './LoginModal.css';

function LoginModal({ toggleLoginModal, openRegisterModal }) {
  const [fullName, setFullName] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      fullName: fullName,
      number: number
    };

    axios.post('http://localhost:3001/login', userCredentials)
      .then(response => {
        console.log(response.data); // Aquí puedes hacer algo con la respuesta si es necesario
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Usuario autenticado correctamente!',
        }).then(() => {
          toggleLoginModal(); // Cierra el modal de inicio de sesión
        });
      })
      .catch(error => {
        console.error('Error en el inicio de sesión: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Por favor, verifica tus credenciales e intenta de nuevo.',
        });
      });
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <span className="close-button" onClick={toggleLoginModal}>&times;</span>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo:</label>
            <input type="text" id="fullName" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="number">Número:</label>
            <input type="text" id="number" name="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
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
