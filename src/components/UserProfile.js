import React from 'react';
import './UserProfile.css'; // Archivo CSS para estilos específicos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons'; // Iconos de FontAwesome

const UserProfile = () => {
    return (
        <div className="user-profile">
            <div className="profile-picture">
                <img src="ruta/a/imagen.jpg" alt="Usuario" className="avatar" />
            </div>
            <div className="profile-details">
                <h2>Nombre de Usuario</h2>
                <p>Cargo</p>
                <p>Edad: 30</p>
            </div>
            <div className="profile-table">
                <table>
                    <tbody>
                        <tr>
                            <td><FontAwesomeIcon icon={faUser} /></td>
                            <td>Nombre Completo</td>
                            <td>Nombre Ficticio</td>
                        </tr>
                        <tr>
                            <td><FontAwesomeIcon icon={faEnvelope} /></td>
                            <td>correo@ejemplo.com</td>
                            <td>correo@ficticio.com</td>
                        </tr>
                        <tr>
                            <td><FontAwesomeIcon icon={faPhone} /></td>
                            <td>555-1234</td>
                            <td>555-5678</td>
                        </tr>
                        <tr>
                            <td><FontAwesomeIcon icon={faLock} /></td>
                            <td>********</td> {/* No mostrar la contraseña directamente */}
                            <td>********</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserProfile;

