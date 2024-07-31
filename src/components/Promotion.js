// Promotion.js

import React from 'react';
import { useCart } from './CartContext';

const Promotion = ({ imageSrc, promotionName, promotionPrice }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const newItem = {
      id: Math.floor(Math.random() * 1000),
      pizza: {
        name: promotionName,
        price: promotionPrice
      },
      size: 'N/A', // Aquí puedes definir el tamaño si es aplicable
      quantity: 1,
      totalPrice: promotionPrice // Puedes ajustar la lógica según sea necesario
    };
    addToCart(newItem);
  };

  return (
    <div className="promotion-item" onClick={handleAddToCart}>
      <img src={imageSrc} alt={promotionName} />
      <p>{promotionName}</p>
      <p>${promotionPrice}</p>
    </div>
  );
};

export default Promotion;

