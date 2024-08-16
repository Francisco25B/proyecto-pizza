import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import UserProfile from '../components/UserProfile';
import Pedidos from './pedidos'; // Asegúrate de que el nombre del archivo y el componente coincidan
import Productos from './productos'; // Asegúrate de que el nombre del archivo y el componente coincidan
import Usuarios from './usuarios'; // Asegúrate de que el nombre del archivo y el componente coincidan
import Dashboard from './Dashboard'; // Importa el nuevo componente Dashboard
import './AdminInterface.css';

function AdminInterface() {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        {/* Título de la empresa */}
        <div className="company-title">
          <h2>Giovannis Pizza</h2>
        </div>
        
        <hr className="separator" />

        {/* Título del menú */}
        <h3 className="menu-title">Menú</h3>
        
        <ul>
          <li
            className={selectedSection === 'dashboard' ? 'active' : ''}
            onClick={() => setSelectedSection('dashboard')}
          >
            <i className="fa fa-tachometer-alt"></i> Inicio
          </li>
          <li
            className={selectedSection === 'usuarios' ? 'active' : ''}
            onClick={() => setSelectedSection('usuarios')}
          >
            <i className="fa fa-user"></i> Usuarios
          </li>
          <li
            className={selectedSection === 'pedidos' ? 'active' : ''}
            onClick={() => setSelectedSection('pedidos')}
          >
            <i className="fa fa-shopping-cart"></i> Pedidos
          </li>
          <li
            className={selectedSection === 'productos' ? 'active' : ''}
            onClick={() => setSelectedSection('productos')}
          >
            <i className="fa fa-box"></i> Productos
          </li>
          <li
            className={selectedSection === 'profile' ? 'active' : ''}
            onClick={() => setSelectedSection('profile')}
          >
            <i className="fa fa-user"></i> Perfil
          </li>
        </ul>

        <hr className="separator" />

        {/* Opción de cerrar sesión */}
        <div className="logout">
          <a href="/">
            <i className="fa fa-sign-out-alt"></i> Cerrar Sesión
          </a>
        </div>
      </aside>

      <AdminHeader setSelectedSection={setSelectedSection} /> {/* Pasa la función al header */}
      
      <div className="admin-content">
        <main className="admin-main">
          {selectedSection === 'dashboard' && <Dashboard />} {/* Agrega la nueva opción */}
          {selectedSection === 'profile' && <UserProfile />}
          {selectedSection === 'usuarios' && <Usuarios />} {/* Nombre del componente importado */}
          {selectedSection === 'pedidos' && <Pedidos />} {/* Nombre del componente importado */}
          {selectedSection === 'productos' && <Productos />} {/* Nombre del componente importado */}
        </main>
      </div>
    </div>
  );
}

export default AdminInterface;
