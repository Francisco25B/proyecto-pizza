import React, { useContext } from 'react';
import { CartContext } from '../CartContext'; // Ajusta la ruta según sea necesario

function CartPage() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const handleRemoveFromCart = (index) => {
    removeFromCart(index);
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <p>{item.pizza.name} - {item.size}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio total: ${item.totalPrice}</p>
              <button onClick={() => handleRemoveFromCart(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
