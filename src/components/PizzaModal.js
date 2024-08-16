import React, { useState } from 'react';
import './PizzaModal.css';
import { useCart } from './CartContext';

function PizzaModal({ pizza, closeModal }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Mediana');
  const [cheeseCrust, setCheeseCrust] = useState(false);
  const { addToCart } = useCart();

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const toggleCheeseCrust = () => {
    setCheeseCrust(!cheeseCrust);
  };

  const calculateTotalPrice = () => {
    let basePrice = pizza.price_medium;
    if (selectedSize === 'Pequeña') {
      basePrice = pizza.price_small;
    } else if (selectedSize === 'Grande') {
      basePrice = pizza.price_large;
    }

    const cheeseCrustPrice = parseFloat(pizza.cheese_crust_price) || 0;

    let totalPrice = basePrice;
    if (cheeseCrust) {
      totalPrice += cheeseCrustPrice;
    }

    return totalPrice * quantity;
  };

  const handleOrder = () => {
    const order = {
      orderId: Date.now(),
      nombre: pizza.nombre,
      pizza: pizza,
      quantity: quantity,
      size: selectedSize,
      cheeseCrust: cheeseCrust,
      totalPrice: calculateTotalPrice(),
    };
    addToCart(order);
    closeModal();
  };

  return (
    <div className="pizza-modal">
      <div className="pizza-modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <div className="pizza-details">
          <div className="pizza-image">
            <img src={pizza.url_imagen} alt={pizza.nombre} />
          </div>
          <div className="pizza-info">
            <h2>{pizza.nombre}</h2>
            <p><strong>Ingredientes:</strong> {pizza.descripcion}</p>
            <p><strong>Tamaño:</strong> {selectedSize}</p>
            <div className="size-buttons">
              <button
                className={`size-button ${selectedSize === 'Pequeña' ? 'selected' : ''}`}
                onClick={() => handleSizeSelection('Pequeña')}
              >
                Pequeña
              </button>
              <button
                className={`size-button ${selectedSize === 'Mediana' ? 'selected' : ''}`}
                onClick={() => handleSizeSelection('Mediana')}
              >
                Mediana
              </button>
              <button
                className={`size-button ${selectedSize === 'Grande' ? 'selected' : ''}`}
                onClick={() => handleSizeSelection('Grande')}
              >
                Grande
              </button>
            </div>
            <div className="crust-option">
              <input
                type="checkbox"
                id="cheese-crust"
                checked={cheeseCrust}
                onChange={toggleCheeseCrust}
              />
              <label htmlFor="cheese-crust">Orilla de Queso (+${parseFloat(pizza.cheese_crust_price).toFixed(2)})</label>
            </div>
            <div className="quantity-control">
              <button className="quantity-button" onClick={handleDecrement}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button" onClick={handleIncrement}>+</button>
            </div>
            <p><strong>Precio Total:</strong> ${calculateTotalPrice().toFixed(2)}</p>
            <button className="order-button" onClick={handleOrder}>Agregar al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaModal;
