import React, { useState, useEffect } from 'react';
import '../pages/MenuPage.css';
import PizzaModal from '../components/PizzaModal';
import axios from 'axios';

function MenuPage() {
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/productos');
      setPizzas(response.data);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    }
  };

  const openModal = (pizza) => {
    setSelectedPizza(pizza);
  };

  const closeModal = () => {
    setSelectedPizza(null);
  };

  return (
    <div id="menu" className="menu">
      <h1>Menú</h1>
      <div className="pizza-list">
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
      {selectedPizza && <PizzaModal pizza={selectedPizza} closeModal={closeModal} />}
    </div>
  );
}

export default MenuPage;
