import React from 'react';
import './AdminDashboard.css'; // Archivo CSS para estilos específicos del dashboard

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Dashboard del Administrador</h2>

      {/* Contenido del dashboard */}
      <div className="grid-container">
        {/* Cuadro de 10 pedidos más vendidos */}
        <div className="grid-item sales">
          <div className="dashboard-card">
            <h3>10 Pedidos Más Vendidos</h3>
            <p>Aquí va el contenido de los pedidos más vendidos...</p>
          </div>
        </div>

        {/* Cuadro de ganancias */}
        <div className="grid-item profits">
          <div className="dashboard-card">
            <h3>Ganancias</h3>
            <p>Aquí va el contenido de las ganancias...</p>
          </div>
        </div>

        {/* Cuadro de usuarios */}
        <div className="grid-item users">
          <div className="dashboard-card">
            <h3>Usuarios</h3>
            <p>Aquí va el contenido de los usuarios...</p>
          </div>
        </div>

        {/* Cuadro de perfil */}
        <div className="grid-item profile">
          <div className="dashboard-card">
            <h3>Perfil</h3>
            <p>Aquí va el contenido del perfil...</p>
          </div>
        </div>

        {/* Cuadro de productos registrados */}
        <div className="grid-item products">
          <div className="dashboard-card">
            <h3>Productos Registrados</h3>
            <p>Aquí va el contenido de los productos registrados...</p>
          </div>
        </div>

        {/* Cuadro de pedidos recientes */}
        <div className="grid-item orders">
          <div className="dashboard-card">
            <h3>Pedidos Recientes</h3>
            <p>Aquí va el contenido de los pedidos recientes...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
