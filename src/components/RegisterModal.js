import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RegisterModal.css';

// Función para validar el número de teléfono
const isValidPhoneNumber = (number) => {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length === 10;
};

function RegisterModal({ toggleRegisterModal, onRegisterSuccess, toggleLoginModal }) {
  const [nombre_completo, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [especificaciones_direccion, setEspecificacionesDireccion] = useState('');

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
              params: {
                lat: latitude,
                lon: longitude,
                format: 'json',
                addressdetails: 1
              }
            });
            if (response.data && response.data.display_name) {
              setDireccion(response.data.display_name);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error en la geocodificación',
                text: 'No se pudo obtener la dirección desde la ubicación.',
              });
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener dirección',
              text: 'No se pudo realizar la solicitud a Nominatim.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener ubicación',
            text: 'No se pudo obtener la ubicación del usuario.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Geolocalización no soportada',
        text: 'Tu navegador no soporta la geolocalización.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remover cualquier formato especial y obtener solo los números
    const cleanTelefono = telefono.replace(/\D/g, '');

    if (!isValidPhoneNumber(cleanTelefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Número de teléfono inválido',
        text: 'El número de teléfono debe contener exactamente 10 dígitos numéricos.',
      });
      return;
    }

    const newUser = {
      nombre_completo,
      telefono: cleanTelefono, // Enviar el número limpio
      email,
      direccion,
      especificaciones_direccion,
      rol_id: 1 // Asignar el rol de "Usuario" automáticamente
    };

    try {
      // Actualiza la URL para que apunte a tu backend en Render
      const response = await axios.post('https://backend-pizza-p9w9.onrender.com/register_user', newUser);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado correctamente',
          text: '¡Ahora puedes iniciar sesión!',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          onRegisterSuccess(); // Llama a la función de éxito al registrarse
          setNombreCompleto('');
          setTelefono('');
          setEmail('');
          setDireccion('');
          setEspecificacionesDireccion('');

          toggleRegisterModal(); // Cierra el modal después del registro exitoso
          toggleLoginModal(); // Abre el modal de inicio de sesión
        });
      } else {
        console.error('Error en el registro:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'El número de teléfono ya está en uso.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo.',
        });
      }
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    if (/^[\d\s]*$/.test(value) && value.length <= 12) {
      setTelefono(value);
    }
  };

  const formatTelefono = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 10) {
      return `+52 ${cleanValue}`;
    }
    return cleanValue;
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
              <label htmlFor="nombre_completo">Nombre Completo:</label>
              <input
                type="text"
                id="nombre_completo"
                value={nombre_completo}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Número de Teléfono:</label>
              <input
                type="text"
                id="telefono"
                value={telefono} // Mostrar valor sin formato
                onChange={handleTelefonoChange}
                placeholder="+52 1234567890"
                title="El número debe contener exactamente 10 dígitos numéricos, opcionalmente precedidos por el código de país (+52)."
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
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
              <button type="button" onClick={obtenerUbicacion}>Obtener Ubicación</button>
            </div>
            <div className="form-group">
              <label htmlFor="especificaciones_direccion">Referencias del Lugar:</label>
              <input
                type="text"
                id="especificaciones_direccion"
                value={especificaciones_direccion}
                onChange={(e) => setEspecificacionesDireccion(e.target.value)}
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
