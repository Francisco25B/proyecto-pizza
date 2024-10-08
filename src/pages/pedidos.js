import React, { useState, useEffect } from 'react';
import './Pedidos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const Pedidos = ({ onNewNotification }) => {
  const [pedidos, setPedidos] = useState([]);
  const [editingPedido, setEditingPedido] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre_producto: '',
    tipo_producto: '',
    tamano: '',
    cantidad: '',
    precio: '',
    metodo_pago: ''
  });
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    fetch('https://backend-pizza-p9w9.onrender.com/pedidos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        return response.json();
      })
      .then(data => setPedidos(data))
      .catch(error => console.error('Error al obtener los pedidos:', error));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://backend-pizza-p9w9.onrender.com/pedidos/${id}`)
          .then((response) => {
            Swal.fire(
              'Eliminado!',
              'El pedido ha sido eliminado.',
              'success'
            );
            // Actualiza manualmente la interfaz
            setPedidos(pedidos.filter(pedido => pedido.id !== id));
          })
          .catch((error) => {
            console.error('Error al eliminar el pedido:', error);
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar el pedido.',
              'error'
            );
          });
      }
    });
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido.id);
    setEditForm({
      nombre_producto: pedido.nombre_producto || '',
      tipo_producto: pedido.tipo_producto || '',
      tamano: pedido.tamano || '',
      cantidad: pedido.cantidad || '',
      precio: pedido.precio || '',
      metodo_pago: pedido.metodo_pago || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://backend-pizza-p9w9.onrender.com/pedidos/${editingPedido}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm)
    })
      .then(response => response.json())
      .then(() => {
        setPedidos(pedidos.map(pedido =>
          pedido.id === editingPedido ? { ...pedido, ...editForm } : pedido
        ));
        setEditingPedido(null);
        setEditForm({
          nombre_producto: '',
          tipo_producto: '',
          tamano: '',
          cantidad: '',
          precio: '',
          metodo_pago: ''
        });
      })
      .catch(error => console.error('Error al actualizar el pedido:', error));
  };

  const handleShowOrders = (cliente_id) => {
    if (selectedCliente === cliente_id) {
      setSelectedCliente(null);
    } else {
      fetch(`https://backend-pizza-p9w9.onrender.com/pedidos/${cliente_id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los pedidos del cliente');
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setClientOrders(data);
            setSelectedCliente(cliente_id);
          } else {
            console.error('Los datos no son un array:', data);
          }
        })
        .catch(error => console.error('Error al obtener los pedidos del cliente:', error));
    }
  };

  const handleAccept = (id) => {
    Swal.fire({
      icon: 'success',
      title: 'Pedido Aceptado',
      text: 'El pedido ha sido aceptado correctamente.'
    });
    fetch(`https://backend-pizza-p9w9.onrender.com/pedidos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado_pedido: 'aceptado' })  // Cambiado a `estado_pedido`
    })
      .then(response => response.json())
      .then(() => {
        setPedidos(pedidos.map(pedido =>
          pedido.id === id ? { ...pedido, estado_pedido: 'aceptado' } : pedido  // Cambiado a `estado_pedido`
        ));
        if (typeof onNewNotification === 'function') {
          onNewNotification(); // Notificación cuando un pedido es aceptado
        }
      })
      .catch(error => console.error('Error al actualizar el estado del pedido:', error));
  };
  
  const handleReject = (id) => {
    Swal.fire({
      icon: 'error',
      title: 'Rechazado',
      text: 'El pedido ha sido rechazado.'
    });
    fetch(`https://backend-pizza-p9w9.onrender.com/pedidos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado_pedido: 'Rechazado' })  // Cambiado a `estado_pedido`
    })
      .then(response => response.json())
      .then(() => {
        setPedidos(pedidos.map(pedido =>
          pedido.id === id ? { ...pedido, estado_pedido: 'Rechazado' } : pedido  // Cambiado a `estado_pedido`
        ));
      })
      .catch(error => console.error('Error al actualizar el estado del pedido:', error));
  };
  
  const handleDelivered = (id) => {
    Swal.fire({
      icon: 'success',
      title: 'Pedido Entregado',
      text: 'El pedido ha sido marcado como entregado.'
    });
    fetch(`https://backend-pizza-p9w9.onrender.com/pedidos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado_pedido: 'Pedido Entregado' })  // Cambiado a `estado_pedido`
    })
      .then(response => response.json())
      .then(() => {
        setPedidos(pedidos.map(pedido =>
          pedido.id === id ? { ...pedido, estado_pedido: 'Pedido Entregado' } : pedido  // Cambiado a `estado_pedido`
        ));
      })
      .catch(error => console.error('Error al actualizar el estado del pedido:', error));
  };
  
  const groupedPedidos = pedidos.reduce((acc, pedido) => {
    (acc[pedido.cliente_id] = acc[pedido.cliente_id] || []).push(pedido);
    return acc;
  }, {});

  // Filtrar los pedidos según el término de búsqueda
  const filteredPedidos = Object.entries(groupedPedidos).filter(([cliente_id, pedidos]) =>
    pedidos.some(pedido =>
      pedido.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.tipo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.tamano.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="pedidos-container">
      <h2>Pedidos</h2>

      <table className="pedidos-table">
        <thead>
          <tr>
            <th>Cliente ID</th>
            <th>Nombre Completo</th>
            <th>Dirección</th>
            <th>Fecha</th>
            <th>Nombre Producto</th>
            <th>Tipo Producto</th>
            <th>Tamaño</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Método de Pago</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedPedidos).map(([cliente_id, pedidos]) => (
            <React.Fragment key={cliente_id}>
              <tr>
                <td colSpan="11" className="cliente-row">
                  <button
                    className="orders-button"
                    onClick={() => handleShowOrders(cliente_id)}
                  >
                    <FontAwesomeIcon icon={selectedCliente === cliente_id ? faArrowUp : faArrowDown} />
                    {selectedCliente === cliente_id ? 'Ocultar Pedidos' : 'Mostrar Pedidos'}
                  </button>
                </td>
              </tr>
              {selectedCliente === cliente_id && (
                pedidos.map(pedido => (
                  <tr key={pedido.id}>
                    <td>{pedido.cliente_id}</td>
                    <td>{pedido.nombre_cliente}</td>
                    <td>{pedido.direccion}</td>
                    <td>{pedido.fecha}</td>
                    <td>{pedido.nombre_producto}</td>
                    <td>{pedido.tipo_producto}</td>
                    <td>{pedido.tamano}</td>
                    <td>{pedido.cantidad}</td>
                    <td>{pedido.precio}</td>
                    <td>{pedido.metodo_pago}</td>
                    <td>
                      {pedido.estado_pedido !== 'entregado' && (
                        <>
                          <button onClick={() => handleAccept(pedido.id)}>Aceptar</button>
                          <button onClick={() => handleReject(pedido.id)}>Rechazar</button>
                        </>
                      )}
                      {pedido.estado_pedido === 'aceptado' && (
                        <button onClick={() => handleDelivered(pedido.id)}>Marcar como Entregado</button>
                      )}
                      <button onClick={() => handleEdit(pedido)}>Editar</button>
                      <button onClick={() => handleDelete(pedido.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {editingPedido && (
        <div className="edit-form">
          <h3>Editar Pedido</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Nombre del Producto:
              <input
                type="text"
                name="nombre_producto"
                value={editForm.nombre_producto}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Tipo de Producto:
              <input
                type="text"
                name="tipo_producto"
                value={editForm.tipo_producto}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Tamaño:
              <input
                type="text"
                name="tamano"
                value={editForm.tamano}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Cantidad:
              <input
                type="number"
                name="cantidad"
                value={editForm.cantidad}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                name="precio"
                value={editForm.precio}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Método de Pago:
              <input
                type="text"
                name="metodo_pago"
                value={editForm.metodo_pago}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Actualizar</button>
            <button onClick={() => setEditingPedido(null)}>Cancelar</button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} />
      </div>
    </div>
  );
};

export default Pedidos;
