import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    type: 'pizza',
    name: '',
    description: '',
    price_small: '',
    price_medium: '',
    price_large: '',
    cheese_crust_price: '',
    size: '',
    price: '',
    image: null
  });
  const [productType, setProductType] = useState('pizza');

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
    for (const key in newProduct) {
      if (newProduct[key] !== null) {
        formData.append(key, newProduct[key]);
      }
    }

    try {
      await axios.post('http://localhost:3001/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProductos();
      handleCancel();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    const formData = new FormData();
    for (const key in newProduct) {
      if (newProduct[key] !== null) {
        formData.append(key, newProduct[key]);
      }
    }

    if (currentProduct) {
      try {
        await axios.put(`http://localhost:3001/productos/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        fetchProductos();
        handleCancel();
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
      type: product.tipo,
      name: product.name,
      description: product.description,
      price_small: product.price_small || '',
      price_medium: product.price_medium || '',
      price_large: product.price_large || '',
      cheese_crust_price: product.cheese_crust_price || '',
      size: product.size || '',
      price: product.price || '',
      image: null
    });
    setShowModal(true);
    setEditMode(true);
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
    setNewProduct({
      ...newProduct,
      type: e.target.value,
      size: '',
      price: ''
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewProduct({
      type: 'pizza',
      name: '',
      description: '',
      price_small: '',
      price_medium: '',
      price_large: '',
      cheese_crust_price: '',
      size: '',
      price: '',
      image: null
    });
    setProductType('pizza');
    setEditMode(false);
    setCurrentProduct(null);
  };

  const renderTable = (type) => {
    const filteredProductos = productos.filter(producto => producto.tipo === type.toLowerCase());

    return (
      <div key={type}>
        <h2>{type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
        <table className={`${type.toLowerCase()}-table`}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              {type === 'pizza' && (
                <>
                  <th>Precio Pequeña</th>
                  <th>Precio Mediana</th>
                  <th>Precio Grande</th>
                  <th>Precio Orilla con Queso</th>
                </>
              )}
              {type === 'refresco' && (
                <th>Tamaño</th>
              )}
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length > 0 ? (
              filteredProductos.map(producto => (
                <tr key={producto.id}>
                  <td>
                    {producto.url_imagen && (
                      <img src={producto.url_imagen} alt={producto.name} className="producto-image" width="100" />
                    )}
                  </td>
                  <td>{producto.name}</td>
                  <td>{producto.description}</td>
                  {type === 'pizza' && (
                    <>
                      <td>${producto.price_small}</td>
                      <td>${producto.price_medium}</td>
                      <td>${producto.price_large}</td>
                      <td>${producto.cheese_crust_price}</td>
                    </>
                  )}
                  {type === 'refresco' && (
                    <td>{producto.size}</td>
                  )}
                  <td>
                    <button className="edit-button" onClick={() => handleEditButtonClick(producto)}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="delete-button" onClick={() => handleDeleteProduct(producto.id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay productos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
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

      {['pizza', 'refresco', 'antojo'].map(t => (
        renderTable(t)
      ))}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCancel}>&times;</span>
            <h2>{editMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form>
              <label>
                Tipo:
                <select name="type" value={productType} onChange={handleProductTypeChange}>
                  <option value="pizza">Pizza</option>
                  <option value="refresco">Refresco</option>
                  <option value="antojo">Antojito</option>
                </select>
              </label>

              {productType === 'pizza' && (
                <>
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
                </>
              )}

              {productType === 'refresco' && (
                <>
                  <label>
                    Nombre:
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
                  </label>
                  <label>
                    Descripción:
                    <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
                  </label>
                  <label>
                    Tamaño:
                    <input type="text" name="size" value={newProduct.size} onChange={handleInputChange} />
                  </label>
                  <label>
                    Precio:
                    <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} />
                  </label>
                </>
              )}

              {productType === 'antojo' && (
                <>
                  <label>
                    Nombre:
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
                  </label>
                  <label>
                    Descripción:
                    <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
                  </label>
                  <label>
                    Precio:
                    <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} />
                  </label>
                </>
              )}

              <label>
                Imagen:
                <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
              </label>

              <button type="button" onClick={editMode ? handleEditProduct : handleAddProduct}>
                {editMode ? 'Actualizar Producto' : 'Agregar Producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
