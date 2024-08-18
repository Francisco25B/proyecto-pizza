import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './UserProfile.css';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        telefono: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await axios.get('https://backend-pizza-p9w9.onrender.com/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                setFormData({
                    nombre_completo: response.data.nombre_completo,
                    telefono: response.data.telefono,
                    email: response.data.email,
                    password: ''
                });
            } catch (err) {
                setError('Error fetching user data');
            }
        };

        fetchUserData();
    }, []);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://backend-pizza-p9w9.onrender.com/api/user/profile', {
                nombre_completo: formData.nombre_completo,
                telefono: formData.telefono,
                email: formData.email,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(formData);
            setIsEditing(false);
        } catch (err) {
            setError('Error updating user data');
        }
    };
    

    if (error) return <div className="error">{error}</div>;
    if (!userData) return <div>Loading...</div>;

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="profile-picture">
                    <div className="avatar">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </div>
                <div className="profile-details">
                    <h2>{userData.nombre_completo}</h2>
                    <p>{userData.email}</p>
                </div>
            </div>
            <div className="profile-info">
                <h3 className="profile-subtitle">Información Personal</h3>
                <div className="info-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Nombre: {isEditing ? <input type="text" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} /> : userData.nombre_completo}</span>
                </div>
                <div className="info-item">
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Teléfono: {isEditing ? <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} /> : userData.telefono}</span>
                </div>
                <div className="info-item">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Correo: {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} /> : userData.email}</span>
                </div>
            </div>
            <div className="profile-actions">
                {isEditing ? (
                    <>
                        <button className="save-button" onClick={handleSave}>Guardar</button>
                        <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </>
                ) : (
                    <button className="edit-button" onClick={handleEditClick}>Editar Datos</button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
