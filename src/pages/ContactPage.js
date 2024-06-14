import React from 'react';
import './ContactPage.css'; // Importamos los estilos para ContactPage
import { FaPhone, FaEnvelope, FaFacebook, FaWhatsapp } from 'react-icons/fa'; // Importamos los iconos de react-icons

function ContactPage() {
  return (
    <div className="ContactPage">
      <div className="contact-container">
        <h1>Contacto</h1>
        <div className="contact-info">
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>Teléfono: (123) 456-7890</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <span>Correo Electrónico: info@giovannispizza.com</span>
          </div>
          <div className="contact-item">
            <FaFacebook className="icon" />
            <span>Facebook: GiovannisPizza</span>
          </div>
          <div className="contact-item">
            <FaWhatsapp className="icon" />
            <span>WhatsApp: +1234567890</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
