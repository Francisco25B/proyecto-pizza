import React, { useState } from 'react';
import './PizzaModal.css';
import { useCart } from './CartContext'; // Importa useCart

function PizzaModal({ pizza, closeModal }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Mediana');
  const [cheeseCrust, setCheeseCrust] = useState(false);
  const { addToCart } = useCart(); // Usa useCart para obtener addToCart

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
    let totalPrice = pizza.price;
    if (selectedSize === 'Grande') {
      totalPrice += 2;
    }
    if (cheeseCrust) {
      totalPrice += 1;
    }
    return totalPrice * quantity;
  };

  const handleOrder = () => {
    const order = {
      orderId: Date.now(),
      pizza,
      quantity,
      size: selectedSize,
      cheeseCrust,
      totalPrice: calculateTotalPrice(),
    };
    addToCart(order); // Llama a addToCart con los detalles del pedido
    closeModal(); // Cierra el modal después de agregar al carrito
  };

  return (
    <div className="pizza-modal">
      <div className="pizza-modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <div className="pizza-details">
          <div className="pizza-image">
            <img src={pizza.image} alt={pizza.name} />
          </div>
          <div className="pizza-info">
            <h2>{pizza.name}</h2>
            <p><strong>Ingredientes:</strong> {pizza.ingredients}</p>
            <p>{pizza.description}</p>
            <p><strong>Tamaño:</strong> {selectedSize}</p>
            <div className="size-buttons">
              <button
                className={`size-button ${selectedSize === 'Pequeña' && 'selected'}`}
                onClick={() => handleSizeSelection('Pequeña')}
              >
                Pequeña
              </button>
              <button
                className={`size-button ${selectedSize === 'Mediana' && 'selected'}`}
                onClick={() => handleSizeSelection('Mediana')}
              >
                Mediana
              </button>
              <button
                className={`size-button ${selectedSize === 'Grande' && 'selected'}`}
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
              <label htmlFor="cheese-crust">Orilla de Queso</label>
            </div>
            <div className="quantity-control">
              <button className="quantity-button" onClick={handleDecrement}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button" onClick={handleIncrement}>+</button>
            </div>
            <p><strong>Precio:</strong> ${calculateTotalPrice()}</p>
            <button className="order-button" onClick={handleOrder}>Agregar al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaModal;

