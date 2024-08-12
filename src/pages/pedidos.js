import React, { useState, useEffect } from 'react';
import './Pedidos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch, faTrash, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [editingPedido, setEditingPedido] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre_pizza: '',
    tamano: '',
    cantidad: '',
    precio: ''
  });
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/pedidos')
      .then(response => response.json())
      .then(data => setPedidos(data))
      .catch(error => console.error('Error al obtener los pedidos:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/pedidos/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        setPedidos(pedidos.filter(pedido => pedido.id !== id));
      })
      .catch(error => console.error('Error al eliminar el pedido:', error));
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido.id);
    setEditForm({
      nombre_pizza: pedido.nombre_pizza,
      tamano: pedido.tamano,
      cantidad: pedido.cantidad,
      precio: pedido.precio
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
    fetch(`http://localhost:3001/pedidos/${editingPedido}`, {
      method: 'PUT',
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
          nombre_pizza: '',
          tamano: '',
          cantidad: '',
          precio: ''
        });
      })
      .catch(error => console.error('Error al actualizar el pedido:', error));
  };

  const handleShowOrders = (cliente_id) => {
    if (selectedCliente === cliente_id) {
      setSelectedCliente(null);  // Ocultar si ya está visible
    } else {
      fetch(`http://localhost:3001/pedidos/${cliente_id}`)
        .then(response => response.json())
        .then(data => {
          setClientOrders(data);
          setSelectedCliente(cliente_id);
        })
        .catch(error => console.error('Error al obtener los pedidos del cliente:', error));
    }
  };

  return (
    <div className="pedidos-container">
      <h2>Pedidos a Domicilio</h2>

      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button><FontAwesomeIcon icon={faSearch} /></button>
      </div>

      <table className="pedidos-table">
        <thead>
          <tr>
            <th>Cliente ID</th>
            <th>Pizza</th>
            <th>Tamaño</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <React.Fragment key={pedido.id}>
              <tr>
                <td>{pedido.cliente_id}</td>
                <td>{pedido.nombre_pizza}</td>
                <td>{pedido.tamano}</td>
                <td>{pedido.cantidad}</td>
                <td>{pedido.precio}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleEdit(pedido)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(pedido.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="orders-button"
                    onClick={() => handleShowOrders(pedido.cliente_id)}
                  >
                    <FontAwesomeIcon icon={selectedCliente === pedido.cliente_id ? faArrowUp : faArrowDown} />
                  </button>
                </td>
              </tr>
              {selectedCliente === pedido.cliente_id && (
                <tr>
                  <td colSpan="6">
                    <div className="orders-list">
                      <h4>Pedidos de Cliente {pedido.cliente_id}</h4>
                      <ul>
                        {clientOrders.map(order => (
                          <li key={order.id}>
                            {order.nombre_pizza} - Tamaño: {order.tamano} - Cantidad: {order.cantidad} - Precio: ${order.precio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
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
              Pizza:
              <input
                type="text"
                name="nombre_pizza"
                value={editForm.nombre_pizza}
                onChange={handleChange}
              />
            </label>
            <label>
              Tamaño:
              <input
                type="text"
                name="tamano"
                value={editForm.tamano}
                onChange={handleChange}
              />
            </label>
            <label>
              Cantidad:
              <input
                type="number"
                name="cantidad"
                value={editForm.cantidad}
                onChange={handleChange}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                name="precio"
                value={editForm.precio}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setEditingPedido(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
