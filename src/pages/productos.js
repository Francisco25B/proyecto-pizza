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
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    price_small: '', 
    price_medium: '', 
    price_large: '', 
    cheese_crust_price: '', 
    image: null // Añadir campo para la imagen
  });

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
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProduct({ ...newProduct, image: files[0] });
    } else {
      if (name.includes('price') && isNaN(value)) return;
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price_small', newProduct.price_small);
    formData.append('price_medium', newProduct.price_medium);
    formData.append('price_large', newProduct.price_large);
    formData.append('cheese_crust_price', newProduct.cheese_crust_price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      await axios.post('http://localhost:3001/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProductos();
      setShowModal(false);
      setNewProduct({ name: '', description: '', price_small: '', price_medium: '', price_large: '', cheese_crust_price: '', image: null });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price_small', newProduct.price_small);
    formData.append('price_medium', newProduct.price_medium);
    formData.append('price_large', newProduct.price_large);
    formData.append('cheese_crust_price', newProduct.cheese_crust_price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }
    if (currentProduct) {
      try {
        await axios.put(`http://localhost:3001/productos/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        fetchProductos();
        setShowModal(false);
        setNewProduct({ name: '', description: '', price_small: '', price_medium: '', price_large: '', cheese_crust_price: '', image: null });
        setCurrentProduct(null);
      } catch (error) {
        console.error('Error editing product:', error);
      }
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
    setNewProduct({
      name: product.name,
      description: product.description,
      price_small: product.price_small,
      price_medium: product.price_medium,
      price_large: product.price_large,
      cheese_crust_price: product.cheese_crust_price,
      image: null // No asignar la imagen aquí, solo el resto de los datos
    });
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
            <th>Imagen</th>
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
              <td>
                {producto.url_imagen && (
                  <img src={producto.url_imagen} alt={producto.name} width="100" />
                )}
              </td>
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
                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
              </label>
              <label>
                Descripción:
                <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
              </label>
              <label>
                Precio Pequeña:
                <input type="text" name="price_small" value={newProduct.price_small} onChange={handleInputChange} />
              </label>
              <label>
                Precio Mediana:
                <input type="text" name="price_medium" value={newProduct.price_medium} onChange={handleInputChange} />
              </label>
              <label>
                Precio Grande:
                <input type="text" name="price_large" value={newProduct.price_large} onChange={handleInputChange} />
              </label>
              <label>
                Precio Orilla con Queso:
                <input type="text" name="cheese_crust_price" value={newProduct.cheese_crust_price} onChange={handleInputChange} />
              </label>
              <label>
                Imagen:
                <input type="file" name="image" onChange={handleInputChange} />
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
