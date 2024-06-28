import React, { useContext } from 'react';
import { CartContext } from './CartContext'; // Ajusta la ruta según la estructura de tu proyecto
import './CartPage.css'; // Ajusta la ruta según la estructura de tu proyecto
import Swal from 'sweetalert2'; // Importa SweetAlert

function CartPage() {
  const { cartItems, setCartItems } = useContext(CartContext);

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
        setCartItems(newCartItems);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems)); // Actualiza localStorage

        Swal.fire(
          'Eliminado',
          'La pizza ha sido eliminada del carrito.',
          'success'
        );
      }
    });
  };

  const handleOrder = () => {
    // Aquí puedes implementar la lógica para realizar el pedido
    // Puedes mostrar un SweetAlert al confirmar el pedido
    Swal.fire(
      '¡Pedido realizado!',
      'Gracias por tu compra.',
      'success'
    ).then(() => {
      // Puedes redirigir a la página de inicio o hacer alguna acción adicional
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
