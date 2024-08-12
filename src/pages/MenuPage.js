import React, { useState, useEffect, useRef } from 'react';
import '../pages/MenuPage.css';
import PizzaModal from '../components/PizzaModal';
import axios from 'axios';
import fondoMenu from '../assets/fondomenu.jpeg';

function MenuPage() {
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [refrescos, setRefrescos] = useState([]);
  const [antojitos, setAntojitos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Pizzas');

  // Crear refs para cada sección
  const pizzasRef = useRef(null);
  const refrescosRef = useRef(null);
  const antojitosRef = useRef(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const [pizzasResponse, refrescosResponse, antojitosResponse] = await Promise.all([
        axios.get('http://localhost:3001/pizzas'),
        axios.get('http://localhost:3001/refrescos'),
        axios.get('http://localhost:3001/antojitos')
      ]);

      setPizzas(pizzasResponse.data);
      setRefrescos(refrescosResponse.data);
      setAntojitos(antojitosResponse.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const openModal = (item) => {
    setSelectedPizza(item);
  };

  const closeModal = () => {
    setSelectedPizza(null);
  };

  // Función para hacer scroll a una sección
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 100, // Ajusta el desplazamiento vertical si es necesario
      behavior: 'smooth',
    });
  };

  return (
    <div id="menu" className="menu">
      <h1>Menú</h1>
      <div className="menu-options">
        <button
          onClick={() => {
            setActiveCategory('Pizzas');
            scrollToSection(pizzasRef);
          }}
          className={`menu-option ${activeCategory === 'Pizzas' ? 'active' : ''}`}
        >
          Pizzas
        </button>
        <button
          onClick={() => {
            setActiveCategory('Refrescos');
            scrollToSection(refrescosRef);
          }}
          className={`menu-option ${activeCategory === 'Refrescos' ? 'active' : ''}`}
        >
          Refrescos
        </button>
        <button
          onClick={() => {
            setActiveCategory('Antojitos');
            scrollToSection(antojitosRef);
          }}
          className={`menu-option ${activeCategory === 'Antojitos' ? 'active' : ''}`}
        >
          Antojitos
        </button>
      </div>
      <div className="item-list" ref={pizzasRef}>
        <h2>Pizzas</h2>
        {pizzas.map((pizza) => (
          <div className="pizza-item" key={pizza.id} onClick={() => openModal(pizza)}>
            <div className="pizza-image-container">
              {pizza.url_imagen ? (
                <img src={pizza.url_imagen} alt={pizza.name} className="pizza-image" />
              ) : (
                <div className="pizza-image-placeholder">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>
            <div className="pizza-details">
              <h3>{pizza.name}</h3>
              <p>{pizza.description}</p>
              <p>Pequeña: ${pizza.price_small}</p>
              <p>Mediana: ${pizza.price_medium}</p>
              <p>Grande: ${pizza.price_large}</p>
              <p>Orilla con Queso: ${pizza.cheese_crust_price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="item-list" ref={refrescosRef}>
        <h2>Refrescos</h2>
        {refrescos.map((refresco) => (
          <div className="pizza-item" key={refresco.id} onClick={() => openModal(refresco)}>
            <div className="pizza-image-container">
              {refresco.url_imagen ? (
                <img src={refresco.url_imagen} alt={refresco.name} className="pizza-image" />
              ) : (
                <div className="pizza-image-placeholder">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>
            <div className="pizza-details">
              <h3>{refresco.name}</h3>
              <p>{refresco.description}</p>
              <p>Precio: ${refresco.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="item-list" ref={antojitosRef}>
        <h2>Antojitos</h2>
        {antojitos.map((antojito) => (
          <div className="pizza-item" key={antojito.id} onClick={() => openModal(antojito)}>
            <div className="pizza-image-container">
              {antojito.url_imagen ? (
                <img src={antojito.url_imagen} alt={antojito.name} className="pizza-image" />
              ) : (
                <div className="pizza-image-placeholder">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>
            <div className="pizza-details">
              <h3>{antojito.name}</h3>
              <p>{antojito.description}</p>
              <p>Precio: ${antojito.price}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPizza && <PizzaModal pizza={selectedPizza} closeModal={closeModal} />}
    </div>
  );
}

export default MenuPage;
