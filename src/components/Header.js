// src/components/Header.js

import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuthentication } from '../components/authContext'; // Ajusta la ruta si es necesario
import logo from '../assets/logo.png';
import inicioImg from '../assets/inicio.png';
import menuImg from '../assets/menu.png';
import aboutImg from '../assets/nosotros.png';
import contactImg from '../assets/contacto.png';
import Swal from 'sweetalert2';

function Header({ toggleLoginModal }) {
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuthentication();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      // Lógica para recuperar el carrito del almacenamiento local o de la base de datos
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (savedCartItems) {
        // Aquí no debes usar setCartItems
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('cartItems');
        logout();
        window.location.href = '/'; // Redirige a la página principal después de cerrar sesión
      }
    });
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Pizzería Chida Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <ul>
          <li><Link to="/" className="nav-link"><img src={inicioImg} alt="Inicio" /> Inicio</Link></li>
          <li><Link to="/menu" className="nav-link"><img src={menuImg} alt="Menú" /> Menú</Link></li>
          <li><Link to="/about" className="nav-link"><img src={aboutImg} alt="Sobre Nosotros" /> Sobre Nosotros</Link></li>
          <li><Link to="/contact" className="nav-link"><img src={contactImg} alt="Contacto" /> Contacto</Link></li>
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
                  <li><Link to="/profile" onClick={closeMenu}>Mi Perfil</Link></li>
                  <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
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

