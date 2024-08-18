import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Valida las credenciales del usuario y maneja la autenticación.
 * @param {Object} userCredentials - Las credenciales del usuario { fullName, number }.
 * @param {Function} onSuccess - Callback a ejecutar si la autenticación es exitosa.
 */
export const validateLogin = (userCredentials, onSuccess) => {
  axios.post('https://backend-pizza-p9w9.onrender.com/login', userCredentials)
    .then(response => {
      const { data } = response;
      if (data && data.user && data.user.rol_id) {
        const { rol_id } = data.user;
        if (rol_id === 1 || rol_id === 2) { // Permitimos tanto usuario normal como administrador
          onSuccess(data.user); // Actualiza el estado del usuario en App.js
        } else {
          throw new Error("Rol no reconocido");
        }
      } else {
        throw new Error("Respuesta de inicio de sesión incompleta");
      }
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
