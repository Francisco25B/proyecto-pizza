import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import ImageCarousel from './components/Carousel';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CartPage from '../src/components/CartPage'; // Ajusta la ruta según la estructura de tu proyecto

import { CartProvider } from '../src/components/CartContext'; // Importa CartProvider si lo estás utilizando


import './App.css';

function ServiceHours() {
  const daysOfWeek = [
    { day: 'Lunes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Martes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Miércoles', hours: '2:00 PM - 10:00 PM' },
    { day: 'Jueves', hours: 'Sin Servicio' },
    { day: 'Viernes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Sábado', hours: '2:00 PM - 10:00 PM' },
    { day: 'Domingo', hours: '2:00 PM - 10:00 PM' },
  ];

  const today = new Date().getDay();

  return (
    <div className="service-hours">
      <h2>Horario de Servicio</h2>
      <ul>
        {daysOfWeek.map((item, index) => (
          <li 
            key={index} 
            className={index + 1 === today ? 'highlight' : ''}
          >
            {item.day}: {item.hours}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);
  };

  const toggleRegisterModal = () => {
    setRegisterModalVisible(!isRegisterModalVisible);
  };

  const openLoginModal = () => {
    setLoginModalVisible(true);
    setRegisterModalVisible(false);
  };

  const openRegisterModal = () => {
    setLoginModalVisible(false);
    setRegisterModalVisible(true);
  };

  const addToCart = (order) => {
    setCartItems([...cartItems, order]);
  };

  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header toggleLoginModal={toggleLoginModal} />
          <nav>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/about">Sobre Nosotros</Link></li>
              <li><Link to="/menu">Menú</Link></li>
              <li><Link to="/cart">Carrito</Link></li>
            </ul>
            <ImageCarousel />
          </nav>
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <section id="home" className="home">
                    <h1>Bienvenidos a Giovannis Pizza</h1>
                    <p>¡Las mejores pizzas!</p>
                    <ServiceHours />
                  </section>
                </>
              } />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
