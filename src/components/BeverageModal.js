import React, { useState } from 'react';
import './BeverageModal.css'; // Usa un archivo CSS específico si es necesario
import { useCart } from './CartContext';

function BeverageModal({ beverage, closeModal }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    const precio = parseFloat(beverage.precio); // Convierte el precio a número
    return precio * quantity;
  };

  const handleOrder = () => {
    const order = {
      orderId: Date.now(),
      nombre: beverage.nombre,
      refresco: { // Cambia la estructura a refresco
        id: beverage.id,
        nombre: beverage.nombre,
        precio: beverage.precio,
      },
      quantity: quantity,
      totalPrice: calculateTotalPrice(),
    };
    addToCart(order);
    closeModal();
  };

  const precio = parseFloat(beverage.precio).toFixed(2); // Convierte y formatea el precio unitario
  const totalPrice = calculateTotalPrice().toFixed(2); // Calcula y formatea el precio total

  return (
    <div className="beverage-modal">
      <div className="beverage-modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <div className="beverage-details">
          <div className="beverage-image">
            <img src={beverage.url_imagen} alt={beverage.nombre} />
          </div>
          <div className="beverage-info">
            <h2>{beverage.nombre}</h2>
            <p><strong>Descripción:</strong> {beverage.descripcion}</p>
            <div className="quantity-control">
              <button className="quantity-button" onClick={handleDecrement}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button" onClick={handleIncrement}>+</button>
            </div>
            <p><strong>Precio Unitario:</strong> ${precio}</p>
            <p><strong>Precio Total:</strong> ${totalPrice}</p>
            <button className="order-button" onClick={handleOrder}>Agregar al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeverageModal;
