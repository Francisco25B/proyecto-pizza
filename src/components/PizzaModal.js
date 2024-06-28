import React, { useState, useContext } from 'react';
import './PizzaModal.css';
import { CartContext } from './CartContext';

function PizzaModal({ pizza, closeModal }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Mediana');
  const [cheeseCrust, setCheeseCrust] = useState(false);
  const { addToCart } = useContext(CartContext);

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
      totalPrice += 2; // Añadir $2 al precio total si la pizza es grande
    }
    if (cheeseCrust) {
      totalPrice += 1; // Añadir $1 al precio total si se selecciona la orilla de queso
    }
    return totalPrice * quantity; // Multiplicar por la cantidad de pizzas
  };

  const handleOrder = () => {
    const order = {
      orderId: Date.now(), // Genera un ID único para el pedido
      pizza,
      quantity,
      size: selectedSize,
      cheeseCrust,
      totalPrice: calculateTotalPrice(),
    };
    addToCart(order); // Llama a la función addToCart desde el contexto
    closeModal();
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
            <p><strong>Con:</strong> {pizza.ingredients}</p>
            <div className="crust-option">
              <input
                type="checkbox"
                id="cheese-crust"
                checked={cheeseCrust}
                onChange={toggleCheeseCrust}
              />
              <label htmlFor="cheese-crust">Orilla de Queso</label>
            </div>
            <p><strong>Cantidad:</strong> {quantity}</p>
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
