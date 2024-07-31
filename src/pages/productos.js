import React, { useState, useEffect } from 'react';
import './Productos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price_small: '', price_medium: '', price_large: '', cheese_crust_price: '' });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('price') && isNaN(value)) return;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:3001/productos', newProduct);
      fetchProductos();
      setShowModal(false);
      setNewProduct({ name: '', description: '', price_small: '', price_medium: '', price_large: '', cheese_crust_price: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:3001/productos/${currentProduct.id}`, newProduct);
      fetchProductos();
      setShowModal(false);
      setEditMode(false);
      setCurrentProduct(null);
      setNewProduct({ name: '', description: '', price_small: '', price_medium: '', price_large: '', cheese_crust_price: '' });
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/productos/${id}`);
      fetchProductos();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
    setEditMode(false);
  };

  const handleEditButtonClick = (product) => {
    setCurrentProduct(product);
    setNewProduct(product);
    setShowModal(true);
    setEditMode(true);
  };

  return (
    <div className="productos-container">
      <h2>Productos de la Pizzería</h2>
      <button className="add-button" onClick={() => { setShowModal(true); setEditMode(false); }}>
        <FontAwesomeIcon icon={faPlus} /> Agregar
      </button>

      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button><FontAwesomeIcon icon={faSearch} /></button>
      </div>

      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre de Pizza</th>
            <th>Ingredientes</th>
            <th>Precio Pequeña</th>
            <th>Precio Mediana</th>
            <th>Precio Grande</th>
            <th>Precio Orilla con Queso</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.name}</td>
              <td>{producto.description}</td>
              <td>${producto.price_small}</td>
              <td>${producto.price_medium}</td>
              <td>${producto.price_large}</td>
              <td>${producto.cheese_crust_price}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditButtonClick(producto)}><FontAwesomeIcon icon={faEdit} /></button>
                <button className="delete-button" onClick={() => handleDeleteProduct(producto.id)}><FontAwesomeIcon icon={faTrash} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{editMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form>
              <label>
                Nombre:
                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} disabled={!editMode} />
              </label>
              <label>
                Descripción:
                <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} disabled={!editMode} />
              </label>
              <label>
                Precio Pequeña:
                <input type="text" name="price_small" value={newProduct.price_small} onChange={handleInputChange} disabled={!editMode} />
              </label>
              <label>
                Precio Mediana:
                <input type="text" name="price_medium" value={newProduct.price_medium} onChange={handleInputChange} disabled={!editMode} />
              </label>
              <label>
                Precio Grande:
                <input type="text" name="price_large" value={newProduct.price_large} onChange={handleInputChange} disabled={!editMode} />
              </label>
              <label>
                Precio Orilla con Queso:
                <input type="text" name="cheese_crust_price" value={newProduct.cheese_crust_price} onChange={handleInputChange} disabled={!editMode} />
              </label>
              {editMode ? (
                <button type="button" onClick={handleEditProduct}>Guardar Cambios</button>
              ) : (
                <button type="button" onClick={handleAddProduct}>Agregar</button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
