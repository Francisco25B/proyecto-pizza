import React from 'react';
import './ContactPage.css'; // Importamos los estilos para ContactPage
import { FaPhone, FaFacebook, FaWhatsapp } from 'react-icons/fa'; // Importamos los iconos de react-icons
import backgroundImage from '../assets/fondocontacto.jpeg'; // Importa la imagen desde la carpeta assets

function ContactPage() {
  return (
    <div className="ContactPage">
      <div className="contact-container">
        <h1>Contacto</h1>
        <div className="contact-info">
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>Teléfono: (774) 742-1418</span>
          </div>
          <div className="contact-item">
            <FaFacebook className="icon" />
            <span>Facebook: Giovanni's Pizzas</span>
          </div>
          <div className="contact-item">
            <FaWhatsapp className="icon" />
            <span>WhatsApp: +52 7712172139</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
