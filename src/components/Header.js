import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHome, faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuthentication } from '../components/authContext'; // Corregido el import para authentication
import logo from '../assets/logo.png';
import inicioImg from '../assets/inicio.png';
import menuImg from '../assets/menu.png';
import aboutImg from '../assets/nosotros.png';
import contactImg from '../assets/contacto.png';
import Swal from 'sweetalert2';

function Header({ toggleLoginModal, notifications }) {
  const { cartItems, setCartItems } = useCart();
  const { isAuthenticated, logout } = useAuthentication();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    if (isAuthenticated()) {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (savedCartItems) {
        setCartItems(savedCartItems);
      }
    }
  }, [isAuthenticated, setCartItems]);

  useEffect(() => {
    if (notifications) {
      console.log('Notificaciones recibidas:', notifications); // Verificar las notificaciones
      const filteredNotifications = notifications.filter(notification =>
        notification.includes('pedido aceptado') || notification.includes('pedido rechazado')
      );
      console.log('Notificaciones filtradas:', filteredNotifications); // Verificar las notificaciones filtradas
      setNotificationList(filteredNotifications);
    }
  }, [notifications]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await logout();
        setCartItems([]);
        window.location.href = '/';
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      }
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Pizzería Chida Logo" className="logo" />
      </div>
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <nav className={`nav-links ${menuOpen ? 'mobile' : ''}`}>
        <ul>
          <li><Link to="/" className="nav-link" onClick={closeMenu}><img src={inicioImg} alt="Inicio" /> Inicio</Link></li>
          <li><Link to="/menu" className="nav-link" onClick={closeMenu}><img src={menuImg} alt="Menú" /> Menú</Link></li>
          <li><Link to="/about" className="nav-link" onClick={closeMenu}><img src={aboutImg} alt="Sobre Nosotros" /> Sobre Nosotros</Link></li>
          <li><Link to="/contact" className="nav-link" onClick={closeMenu}><img src={contactImg} alt="Contacto" /> Contacto</Link></li>
        </ul>
      </nav>
      <div className="icons">
        {isAuthenticated() ? (
          <>
            <div className="user-menu">
              <button className="icon-button" onClick={handleMenuToggle}>
                <FontAwesomeIcon icon={faHome} />
              </button>
              {menuOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/profile" className="dropdown-link" onClick={closeMenu}>Mi Perfil</Link></li>
                  <li><button className="dropdown-link" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              )}
            </div>
          
            <Link to="/cart" className="icon-button">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItems.length > 0 && <span className="cart-counter">{cartItems.length}</span>}
            </Link>
          </>
        ) : (
          <>
            <button className="icon-button" onClick={toggleLoginModal}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            <Link to="/cart" className="icon-button">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItems.length > 0 && <span className="cart-counter">{cartItems.length}</span>}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
