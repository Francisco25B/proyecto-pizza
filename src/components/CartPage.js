import React, { useState } from 'react';
import { useCart } from './CartContext';
import './CartPage.css';
import Swal from 'sweetalert2';
import { useAuthentication } from '../components/authContext'; // Asegúrate de que la ruta es correcta

function CartPage({ toggleLoginModal }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, getUserId } = useAuthentication(); // Obtén la información de autenticación
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); // Estado para controlar si el pedido ha sido confirmado después de iniciar sesión

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
        removeFromCart(index); // Usa removeFromCart en lugar de clearCart
        Swal.fire(
          'Eliminado',
          'La pizza ha sido eliminada del carrito.',
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
          toggleLoginModal(); // Muestra el modal de inicio de sesión
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
    const userId = getUserId(); // Obtén el ID del usuario

    const orderDetails = cartItems.map(item => ({
      cliente_id: userId,
      producto_id: item.pizza.id, // Cambia para enviar el ID del producto
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
      Swal.fire(
        '¡Pedido realizado!',
        'Gracias por tu compra.',
        'success'
      ).then(() => {
        clearCart(); // Limpia el carrito después de hacer el pedido
        setIsOrderConfirmed(false); // Reinicia el estado de confirmación
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

