import React, { useState } from 'react';
import '../pages/MenuPage.css';
import PizzaModal from '../components/PizzaModal'; // Ajusta la ruta

function MenuPage() {
  const [selectedPizza, setSelectedPizza] = useState(null);

  const openModal = (pizza) => {
    setSelectedPizza(pizza);
  };

  const closeModal = () => {
    setSelectedPizza(null);
  };

  // Datos de ejemplo para pizzas
  const pizzas = [
    {
      id: 1,
      name: 'Pizza Margarita',
      description: 'Salsa de tomate, mozzarella, albahaca',
      price: 12.99, // Añadido un precio para cada pizza
    },
    {
      id: 2,
      name: 'Pizza Pepperoni',
      description: 'Salsa de tomate, mozzarella, pepperoni',
      price: 14.99,
    },
    {
      id: 3,
      name: 'Pizza Hawaiana',
      description: 'Salsa de tomate, mozzarella, jamón, piña',
      price: 13.99,
    },
    // Agrega más objetos de pizza aquí...
  ];

  return (
    <div id="menu" className="menu">
      <h1>Menú</h1>
      <div className="pizza-list">
        {pizzas.map((pizza) => (
          <div className="pizza-item" key={pizza.id} onClick={() => openModal(pizza)}>
            <div className="pizza-image-placeholder">
              <i className="fas fa-image"></i> {/* Ícono de imagen */}
            </div>
            <div className="pizza-details">
              <h3>{pizza.name}</h3>
              <p>{pizza.description}</p>
              <p>${pizza.price}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPizza && <PizzaModal pizza={selectedPizza} closeModal={closeModal} />}
    </div>
  );
}

export default MenuPage;
