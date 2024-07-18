import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import './RegisterModal.css';

function RegisterModal({ toggleRegisterModal, openLoginModal }) {
    const [nombre_completo, setNombreCompleto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [especificaciones_direccion, setEspecificacionesDireccion] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que el número de teléfono tenga exactamente 10 dígitos y sea numérico
        if (telefono.length !== 10 || !(/^\d+$/.test(telefono))) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El número de teléfono debe contener solo 10 dígitos numéricos.',
            });
            return;
        }

        const newUser = {
            nombre_completo,
            telefono,
            email,
            direccion,
            especificaciones_direccion,
            rol_id: 1,
        };

        try {
            const response = await axios.post('http://localhost:3001/register_user', newUser);

            if (response.status === 200) {
                // Mostrar SweetAlert2 de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario registrado correctamente',
                    text: '¡Ahora puedes iniciar sesión!',
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        openLoginModal(); // Redirigir al usuario a la página de inicio de sesión
                    }
                });
            } else {
                console.error('Error en el registro:', response.data);
                // Manejar otro tipo de error si es necesario
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            // Manejar el error de la petición
        }
    };

    return (
        <div className="register-modal">
            <div className="register-modal-content">
                <span className="close-button" onClick={toggleRegisterModal}>&times;</span>
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre_completo">Nombre Completo:</label>
                        <input type="text" id="nombre_completo" name="nombre_completo" value={nombre_completo} onChange={(e) => setNombreCompleto(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Número de Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección:</label>
                        <input type="text" id="direccion" name="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="especificaciones_direccion">Referencias del Lugar:</label>
                        <input type="text" id="especificaciones_direccion" name="especificaciones_direccion" value={especificaciones_direccion} onChange={(e) => setEspecificacionesDireccion(e.target.value)} required />
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

