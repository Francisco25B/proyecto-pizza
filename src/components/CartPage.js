import React, { useState } from 'react';
import { useCart } from './CartContext';
import './CartPage.css';
import Swal from 'sweetalert2';
import { useAuthentication } from '../components/authentication'; // Ajusta la ruta según la estructura de tu proyecto

function CartPage({ toggleLoginModal }) {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, getUserRole } = useAuthentication(); // Obtén la información de autenticación
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
        const newCartItems = cartItems.filter((_, i) => i !== index);
        clearCart(newCartItems);
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
        // Si el pedido no ha sido confirmado después de iniciar sesión, muestra el mensaje de confirmación
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
            setIsOrderConfirmed(true); // Marca el pedido como confirmado
            completeOrder(); // Lógica para completar el pedido
          }
        });
      } else {
        completeOrder(); // Si ya se confirmó el pedido, procede directamente a completarlo
      }
    }
  };

  const completeOrder = () => {
    const userRole = getUserRole(); // Obtén el rol del usuario
    if (userRole === 'admin') {
      // Lógica específica para usuario administrador
      Swal.fire(
        '¡Pedido realizado!',
        'Gracias por tu compra como administrador.',
        'success'
      ).then(() => {
        clearCart(); // Limpia el carrito después de hacer el pedido
        setIsOrderConfirmed(false); // Reinicia el estado de confirmación
      });
    } else {
      // Lógica para otros roles de usuario
      Swal.fire(
        '¡Pedido realizado!',
        'Gracias por tu compra como usuario regular.',
        'success'
      ).then(() => {
        clearCart(); // Limpia el carrito después de hacer el pedido
        setIsOrderConfirmed(false); // Reinicia el estado de confirmación
      });
    }
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
