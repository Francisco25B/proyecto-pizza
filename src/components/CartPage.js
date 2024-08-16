import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useCart } from './CartContext';
import jsPDF from 'jspdf';
import { useAuthentication } from './authContext';
import './CartPage.css';
import axios from 'axios'; // Asegúrate de que axios está importado

function CartPage({ toggleLoginModal }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, getUserId } = useAuthentication();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
 
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
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
        Swal.fire('Eliminado', 'El producto ha sido eliminado del carrito.', 'success');
      }
    });
  };

  const handleOrder = () => {
    if (!isAuthenticated()) {
      promptLogin();
    } else {
      promptPaymentMethod();
    }
  };

  const promptLogin = () => {
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
  };

  const promptPaymentMethod = () => {
    Swal.fire({
      title: 'Selecciona Método de Pago',
      html: `
        <select id="payment-method" class="swal2-select">
          <option value="">Selecciona una opción</option>
          <option value="Transferencia Bancaria">Transferencia Bancaria</option>
          <option value="Pago al Repartidor">Pago al Repartidor</option>
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
          bankTransferInfo.style.display = event.target.value === 'Transferencia Bancaria' ? 'block' : 'none';
        });
      },
      preConfirm: () => {
        const paymentMethod = Swal.getPopup().querySelector('#payment-method').value;
        const transferReference = Swal.getPopup().querySelector('#transfer-reference').value;

        if (!paymentMethod) {
          Swal.showValidationMessage('Debes seleccionar un método de pago');
        } else if (paymentMethod === 'Transferencia Bancaria' && !transferReference) {
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
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      doc.setFontSize(16);
      doc.text('Giovannis Pizza', 10, 10);
      doc.setFontSize(12);
      doc.text(`Fecha: ${date}`, 10, 20);
      doc.text(`Hora: ${time}`, 10, 30);

      doc.setLineWidth(0.5);
      doc.line(10, 35, 200, 35);

      let yOffset = 40;
      cartItems.forEach(item => {
        doc.text(`${item.nombre} - ${item.size} x ${item.quantity}`, 10, yOffset);
        doc.text(`$${item.totalPrice.toFixed(2)}`, 150, yOffset);
        yOffset += 10;
      });

      doc.text(`Total: $${calculateTotal().toFixed(2)}`, 10, yOffset + 10);

      if (paymentMethod === 'Transferencia Bancaria') {
        doc.text(`Referencia Transferencia: ${transferReference}`, 10, yOffset + 20);
      }

      doc.line(10, yOffset + 30, 200, yOffset + 30);
      doc.text('¡Gracias por tu compra!', 10, yOffset + 40);

      doc.save('ticket-pedido.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Swal.fire('Error', 'Hubo un problema al generar el PDF.', 'error');
    }
  };

  const completeOrder = async ({ paymentMethod, transferReference }) => {
    const orderItems = cartItems.map(item => {
      let productType;
      let productId;
      let productName;
  
      if (item.pizza) {
        productType = 'pizza';
        productId = item.pizza.id;
        productName = item.pizza.nombre;
      } else if (item.refresco) {
        productType = 'refresco';
        productId = item.refresco.id;
        productName = item.refresco.nombre;
      } else if (item.antojito) {
        productType = 'antojito';
        productId = item.antojito.id;
        productName = item.antojito.nombre;
      }
  
      // Validar si los campos están definidos
      if (!productId || !productName || !productType) {
        console.error('Datos de ítem incompletos:', item);
        Swal.fire('Error', 'Uno o más ítems en el carrito tienen datos incompletos.', 'error');
        return null; // No agregar el ítem al pedido
      }
  
      return {
        productId,
        productName,
        productType,
        size: item.size || 'default',
        quantity: item.quantity,
        totalPrice: item.totalPrice
      };
    }).filter(item => item !== null); // Filtrar los ítems nulos
  
    if (orderItems.length === 0) {
      return; // No enviar la solicitud si no hay ítems válidos
    }
  
    try {
      const response = await axios.post('/register_order', {
        userId: getUserId(),
        items: orderItems,
        paymentMethod: paymentMethod,
        transferReference: paymentMethod === 'Transferencia Bancaria' ? transferReference : null
      });
  
      if (response.status === 200) {
        console.log('Pedido registrado exitosamente');
        setIsOrderConfirmed(true);
        generatePDF();
        clearCart();
      }
    } catch (error) {
      console.error('Error al registrar el pedido:', error);
      Swal.fire('Error', 'Hubo un problema al registrar el pedido.', 'error');
    }
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
                    <p className="item-nombre">{item.nombre} - {item.size}</p>
                    <p className="item-details">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-actions">
                    <p className="item-details">Precio total: ${item.totalPrice.toFixed(2)}</p>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(index)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p>Total: ${calculateTotal().toFixed(2)}</p>
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
