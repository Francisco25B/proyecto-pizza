// CartPage.js

import React, { useContext } from 'react';
import { CartContext } from './CartContext'; // Ajusta la ruta según la estructura de tu proyecto
import './CartPage.css'; // Ajusta la ruta según la estructura de tu proyecto

function CartPage() {
  const { cartItems, setCartItems } = useContext(CartContext);

  const handleRemoveFromCart = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems)); // Actualiza localStorage
  };

  return (
    <div className="cart-container">
      <h1 className="cart-header">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul className="cart-items">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <div className="item-info">
                <div>
                  <p className="item-name">{item.pizza.name} - {item.size}</p>
                  <p className="item-details">Cantidad: {item.quantity}</p>
                </div>
                <div className="item-actions">
                  <p className="item-details">Precio total: ${item.totalPrice}</p>
                  <button className="remove-button" onClick={() => handleRemoveFromCart(index)}>Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
