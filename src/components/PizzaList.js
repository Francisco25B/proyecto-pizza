// src/components/PizzaList.js

import React from 'react';
import './PizzaList.css';

const pizzas = [
  { name: 'Margherita', description: 'Tomate, mozzarella, albahaca', price: '$10.00' },
  { name: 'Pepperoni', description: 'Pepperoni, mozzarella, tomate', price: '$12.00' },
  { name: 'Hawaiana', description: 'Jamón, piña, mozzarella', price: '$11.00' },
  // Agrega más pizzas según sea necesario
];

function PizzaList() {
  return (
    <div className="pizza-list">
      {pizzas.map((pizza, index) => (
        <div key={index} className="pizza-item">
          <h3>{pizza.name}</h3>
          <p>{pizza.description}</p>
          <p className="price">{pizza.price}</p>
        </div>
      ))}
    </div>
  );
}

export default PizzaList;
