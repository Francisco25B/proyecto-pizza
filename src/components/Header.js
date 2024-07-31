import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHome, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuthentication } from '../components/authentication'; 
import logo from '../assets/logo.png';
import inicioImg from '../assets/inicio.png';
import menuImg from '../assets/menu.png';
import aboutImg from '../assets/nosotros.png';
import contactImg from '../assets/contacto.png';
import Swal from 'sweetalert2';

function Header({ toggleLoginModal }) {
  const { cartItems, setCartItems } = useCart(); 
  const { isAuthenticated, login, logout } = useAuthentication(); 
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (savedCartItems) {
        setCartItems(savedCartItems);
      }
    }
  }, [isAuthenticated, setCartItems]);

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
        // Llama a la función de logout
        await logout();
        // Limpia el carrito al cerrar sesión
        setCartItems([]);
        // Opcional: redirige al usuario a la página de inicio o de login
        window.location.href = '/'; // Redirige a la página principal o de login
      } catch (error) {
        Swal.fire('cerrar sesión.');
      }
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogin = () => {
    login(); 
    closeMenu(); 
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



