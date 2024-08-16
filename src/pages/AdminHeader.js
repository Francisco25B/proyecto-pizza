import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdminHeader.css'; // Importa el archivo de estilos
import axios from 'axios'; // Importa axios

// Componente funcional para el encabezado del administrador
export function AdminHeader({ setSelectedSection }) {
  const [orderCount, setOrderCount] = useState(0); // Número de pedidos pendientes
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);
  const [orders, setOrders] = useState([]); // Estado para almacenar pedidos

  // Función para manejar el clic en el icono de campanita (notificaciones)
  const handleNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3001/pedidos'); // Asegúrate de que esta URL sea correcta
      setOrders(response.data);
      setShowOrdersMenu(!showOrdersMenu); // Alterna el menú desplegable
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  };

  // Función para cambiar la sección a 'pedidos' y restablecer el contador de notificaciones
  const handleViewOrder = () => {
    setSelectedSection('pedidos'); // Cambia la sección activa a 'pedidos'
    setShowOrdersMenu(false); // Cierra el menú después de cambiar la sección
    setOrderCount(0); // Restablece el contador de notificaciones a 0
  };

  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión?')) {
      // Aquí deberías manejar la lógica para cerrar sesión
      window.location.href = '/'; // Redirige a la página de inicio
    }
  };

  useEffect(() => {
    // Obtén el número inicial de pedidos pendientes al montar el componente
    const fetchOrderCount = async () => {
      try {
        const response = await axios.get('http://localhost:3001/pedidos'); // Asegúrate de que esta URL es correcta
        setOrderCount(response.data.length);
      } catch (error) {
        console.error('Error fetching orders count:', error);
      }
    };

    fetchOrderCount();

    // Configura una actualización periódica (cada 30 segundos)
    const intervalId = setInterval(fetchOrderCount, 30000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Bienvenido Administrador</h1>
        </div>
        <div className="header-icons">
          <div className="notification-icon-container" onClick={handleNotifications}>
            <FontAwesomeIcon icon={faBell} className="icon notification-icon" />
            {orderCount > 0 && (
              <span className="notification-count">{orderCount}</span>
            )}
          </div>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon logout-icon" onClick={handleLogout} />
        </div>
      </div>

      {/* Menú desplegable para mostrar los pedidos */}
      {showOrdersMenu && (
        <div className="orders-menu">
          <div className="orders-menu-content">
            <div className="orders-menu-header">
              <h2>Pedidos</h2>
              <button className="close-menu" onClick={() => setShowOrdersMenu(false)}>
                &times;
              </button>
            </div>
            <div className="orders-menu-body">
              {orders.length === 0 ? (
                <p>No hay pedidos pendientes.</p>
              ) : (
                <ul>
                  {orders.map((order) => (
                    <li key={order.id} className="order-item" onClick={handleViewOrder}>
                      <h3>Pedido de {order.nombre_completo}</h3>
                      <p><strong>Producto:</strong> {order.nombre_producto}</p>
                      <p><strong>Cantidad:</strong> {order.cantidad}</p>
                      <p><strong>Precio:</strong> ${order.precio}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
