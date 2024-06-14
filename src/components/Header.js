import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import inicioImg from '../assets/inicio.png';
import menuImg from '../assets/menu.png';
import aboutImg from '../assets/nosotros.png';
import contactImg from '../assets/contacto.png';

function Header({ toggleLoginModal }) {
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
        <button className="icon-button">
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>
    </header>
  );
}

export default Header;
