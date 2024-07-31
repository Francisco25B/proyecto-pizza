import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useCart } from './CartContext';
import { useAuthentication } from '../components/authentication';
import './CartPage.css';

function CartPage({ toggleLoginModal }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, getUserRole, getUserId } = useAuthentication();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  const handleRemoveFromCart = (index) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(index);
        Swal.fire(
          'Eliminado',
          'El artículo ha sido eliminado del carrito.',
          'success'
        );
      }
    });
  };

  const handleOrder = () => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión primero',
        text: 'Debes iniciar sesión para realizar tu pedido.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          toggleLoginModal();
        }
      });
    } else {
      if (!isOrderConfirmed) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres confirmar el pedido?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, confirmar pedido',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            setIsOrderConfirmed(true);
            completeOrder();
          }
        });
      } else {
        completeOrder();
      }
    }
  };

  const completeOrder = () => {
    const userId = getUserId();
    const userRole = getUserRole();
    const orderDetails = cartItems.map(item => ({
      cliente_id: userId,
      producto_id: item.pizza.id,
      tamano: item.size,
      cantidad: item.quantity,
      precio: item.totalPrice
    }));

    fetch('http://localhost:3001/register_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
    })
    .then(response => response.json())
    .then(data => {
      const message = userRole === 'admin'
        ? 'Gracias por tu compra como administrador.'
        : 'Gracias por tu compra como usuario regular.';

      Swal.fire({
        title: '¡Pedido realizado!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        clearCart();
        setIsOrderConfirmed(false);
      });
    })
    .catch(error => {
      console.error('Error al registrar el pedido:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al registrar tu pedido. Inténtalo de nuevo.',
        'error'
      );
    });
  };

  return (
    <div className="cart-container">
      <h1 className="cart-header">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-info">
                  <div>
                    <p className="item-name">
                      {item.pizza.name} - {item.size}
                    </p>
                    <p className="item-details">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-actions">
                    <p className="item-details">
                      Precio total: ${item.totalPrice}
                    </p>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p>Total: ${calculateTotal()}</p>
          </div>
          <button className="order-button" onClick={handleOrder}>
            {isOrderConfirmed ? 'Confirmar Pedido' : 'Ordenar'}
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;
