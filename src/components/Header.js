import React, { useContext } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import logo from '../assets/logo.png';
import inicioImg from '../assets/inicio.png';
import menuImg from '../assets/menu.png';
import aboutImg from '../assets/nosotros.png';
import contactImg from '../assets/contacto.png';

function Header({ toggleLoginModal }) {
  const { cartItems } = useContext(CartContext);

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Pizzería Chida Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <ul>
          <li><Link to="/"><img src={inicioImg} alt="Inicio" /> Inicio</Link></li>
          <li><Link to="/menu"><img src={menuImg} alt="Menú" /> Menú</Link></li>
          <li><Link to="/about"><img src={aboutImg} alt="Sobre Nosotros" /> Sobre Nosotros</Link></li>
          <li><Link to="/contact"><img src={contactImg} alt="Contacto" /> Contacto</Link></li>
        </ul>
      </nav>
      <div className="icons">
        <button className="icon-button" onClick={toggleLoginModal}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        <Link to="/cart" className="icon-button">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartItems.length > 0 && <span className="cart-counter">{cartItems.length}</span>}
        </Link>
      </div>
    </header>
  );
}

export default Header;
