import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import UserProfile from '../components/UserProfile';
// import AdminDashboard from './AdminDashboard'; // Comentado ya que el archivo no se encuentra
import Pedidos from './pedidos'; // Asegúrate de que el nombre del archivo y el componente coincidan
import Productos from './productos'; // Asegúrate de que el nombre del archivo y el componente coincidan
import Usuarios from './usuarios'; // Asegúrate de que el nombre del archivo y el componente coincidan
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
            className={selectedSection === 'usuarios' ? 'active' : ''}
            onClick={() => setSelectedSection('usuarios')}
          >
            <i className="fa fa-user"></i> Usuarios
          </li>
          <li
            className={selectedSection === 'pedidos' ? 'active' : ''}
            onClick={() => setSelectedSection('pedidos')}
          >
            <i className="fa fa-user"></i> Pedidos
          </li>
          <li
            className={selectedSection === 'productos' ? 'active' : ''}
            onClick={() => setSelectedSection('productos')}
          >
            <i className="fa fa-cog"></i> Productos
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

      <AdminHeader /> {/* Header colocado debajo del menú */}
      
      <div className="admin-content">
        <main className="admin-main">
          {selectedSection === 'profile' && <UserProfile />}
          {/* {selectedSection === 'dashboard' && <AdminDashboard />} */}
          {selectedSection === 'usuarios' && <Usuarios />} {/* Nombre del componente importado */}
          {selectedSection === 'pedidos' && <Pedidos />} {/* Nombre del componente importado */}
          {selectedSection === 'productos' && <Productos />} {/* Nombre del componente importado */}
        </main>
      </div>
    </div>
  );
}

export default AdminInterface;
