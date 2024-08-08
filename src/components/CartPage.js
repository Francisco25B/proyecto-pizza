import React from 'react';
import Swal from 'sweetalert2';
import { useCart } from './CartContext';
import { useAuthentication } from '../components/authentication';
import jsPDF from 'jspdf';
import './CartPage.css';

function CartPage({ toggleLoginModal }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, getUserRole } = useAuthentication();
  const [isOrderConfirmed, setIsOrderConfirmed] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [transferReference, setTransferReference] = React.useState('');

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
      Swal.fire({
        title: 'Selecciona Método de Pago',
        html: `
          <select id="payment-method" class="swal2-select">
            <option value="">Selecciona una opción</option>
            <option value="bank_transfer">Transferencia Bancaria</option>
            <option value="cash_on_delivery">Pago al Repartidor</option>
          </select>
          <div id="bank-transfer-info" style="display: none;">
            <p>Datos Bancarios de la Pizzería:</p>
            <p>Banco: Banco Ejemplo</p>
            <p>Cuenta: 1234567890</p>
            <p>IBAN: ES1234567890123456789012</p>
            <input id="transfer-reference" class="swal2-input" placeholder="Número de referencia de la transferencia">
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        didOpen: () => {
          const paymentMethodSelect = Swal.getPopup().querySelector('#payment-method');
          const bankTransferInfo = Swal.getPopup().querySelector('#bank-transfer-info');

          paymentMethodSelect.addEventListener('change', (event) => {
            const method = event.target.value;
            if (method === 'bank_transfer') {
              bankTransferInfo.style.display = 'block';
            } else {
              bankTransferInfo.style.display = 'none';
            }
          });
        },
        preConfirm: () => {
          const paymentMethod = Swal.getPopup().querySelector('#payment-method').value;
          const transferReference = Swal.getPopup().querySelector('#transfer-reference').value;

          if (!paymentMethod) {
            Swal.showValidationMessage('Debes seleccionar un método de pago');
          } else if (paymentMethod === 'bank_transfer' && !transferReference) {
            Swal.showValidationMessage('Debes ingresar el número de referencia de la transferencia');
          }
          return { paymentMethod, transferReference };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setPaymentMethod(result.value.paymentMethod);
          setTransferReference(result.value.transferReference);
          completeOrder(result.value);
        }
      });
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    // Configuración del estilo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Encabezado
    doc.setFontSize(16);
    doc.text('Pizzería Ejemplo', 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${date}`, 10, 20);
    doc.text(`Hora: ${time}`, 10, 30);

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Productos
    let yOffset = 40;
    cartItems.forEach(item => {
      doc.text(`${item.pizza.name} - ${item.size} x ${item.quantity}`, 10, yOffset);
      doc.text(`$${item.totalPrice}`, 150, yOffset);
      yOffset += 10;
    });

    // Total
    doc.text(`Total: $${calculateTotal()}`, 10, yOffset + 10);

    // Información de referencia
    if (paymentMethod === 'bank_transfer') {
      doc.text(`Referencia Transferencia: ${transferReference}`, 10, yOffset + 20);
    }

    // Línea divisoria inferior
    doc.line(10, yOffset + 30, 200, yOffset + 30);
    doc.text('¡Gracias por tu compra!', 10, yOffset + 40);

    // Guardar el PDF
    doc.save('ticket-pedido.pdf');
  };

  const completeOrder = (paymentDetails) => {
    const userRole = getUserRole();
    const message =
      userRole === 'admin'
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
      if (paymentDetails.paymentMethod === 'bank_transfer') {
        generatePDF(); // Generar y descargar el PDF cuando se usa transferencia bancaria
      }
    });

    // Aquí puedes enviar los detalles del pedido y el método de pago al backend
    fetch('/confirmar-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderItems: cartItems,
        paymentMethod: paymentDetails.paymentMethod,
        transferReference: paymentDetails.transferReference
      })
    }).then(response => response.json())
      .then(data => {
        console.log('Pago confirmado:', data);
      })
      .catch(error => {
        console.error('Error al confirmar el pago:', error);
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


