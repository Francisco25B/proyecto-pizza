import React, { useState } from 'react';
import { useCart } from './CartContext';
import './CartPage.css';
import Swal from 'sweetalert2';
import { useAuthentication } from '../components/authContext';

function CartPage({ toggleLoginModal }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, getUserId } = useAuthentication();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

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
        Swal.fire('Eliminado', 'La pizza ha sido eliminada del carrito.', 'success');
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

    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario.', 'error');
      return;
    }

    const orderDetails = cartItems.map(item => {
      const productoTipo = item.pizza.type || 'pizza'; // Valor predeterminado
      return {
        cliente_id: userId,
        producto_id: item.pizza.id,
        producto_tipo: productoTipo,
        tamano: item.size,
        cantidad: item.quantity,
        precio: item.totalPrice
      };
    });

    fetch('http://localhost:3001/register_order', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      Swal.fire('¡Pedido realizado!', 'Gracias por tu compra.', 'success')
      .then(() => {
        clearCart();
        setIsOrderConfirmed(false);
      });
    })
    .catch(error => {
      console.error('Error al registrar el pedido:', error);
      Swal.fire('Error', 'Hubo un problema al registrar tu pedido. Inténtalo de nuevo.', 'error');
    });
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
      {cartItems.length > 0 && (
        <button className="order-button" onClick={handleOrder}>Ordenar</button>
      )}
    </div>
  );
}

export default CartPage;
