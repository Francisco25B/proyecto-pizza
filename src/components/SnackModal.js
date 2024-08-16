import React, { useState } from 'react';
import './SnackModal.css'; // Usa un archivo CSS específico si es necesario
import { useCart } from './CartContext';

function SnackModal({ antojito, closeModal }) {
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
    const price = parseFloat(antojito.precio);
    return price * quantity;
  };

  const handleOrder = () => {
    const order = {
      orderId: Date.now(),
      nombre: antojito.nombre,
      antojito: antojito,
      quantity: quantity,
      totalPrice: calculateTotalPrice(),
    };
    addToCart(order);
    closeModal();
  };

  const price = parseFloat(antojito.precio).toFixed(2);
  const totalPrice = calculateTotalPrice().toFixed(2);

  return (
    <div className="snack-modal">
      <div className="snack-modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <div className="snack-details">
          <div className="snack-image">
            <img src={antojito.url_imagen} alt={antojito.nombre} />
          </div>
          <div className="snack-info">
            <h2>{antojito.nombre}</h2>
            <p><strong>Descripción:</strong> {antojito.descripcion}</p>
            <div className="quantity-control">
              <button className="quantity-button" onClick={handleDecrement}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button" onClick={handleIncrement}>+</button>
            </div>
            <p><strong>Precio Unitario:</strong> ${price}</p>
            <p><strong>Precio Total:</strong> ${totalPrice}</p>
            <button className="order-button" onClick={handleOrder}>Agregar al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnackModal;
