import React, { useState, useEffect } from 'react';
import './Productos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [tipoProducto, setTipoProducto] = useState('Pizzas');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    price_small: '',
    price_medium: '',
    price_large: '',
    cheese_crust_price: '',
    tamaño: '',
    image: null,
  });

  useEffect(() => {
    fetchProductos();
  }, [tipoProducto]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/${tipoProducto.toLowerCase()}`);
      setProductos(response.data);
    } catch (error) {
      console.error(`Error fetching ${tipoProducto.toLowerCase()}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProduct((prevState) => ({ ...prevState, image: files[0] }));
    } else {
      if (name.includes('price') && isNaN(value)) return;
      setNewProduct((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleTipoProductoChange = (e) => {
    setTipoProducto(e.target.value);
    resetNewProduct();
  };

  const resetNewProduct = () => {
    setNewProduct({
      nombre: '',
      descripcion: '',
      precio: '',
      price_small: '',
      price_medium: '',
      price_large: '',
      cheese_crust_price: '',
      tamaño: '',
      image: null,
    });
  };

  const handleAddOrEditProduct = async () => {
    if (!newProduct.nombre) {
      console.error('El nombre es obligatorio');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', newProduct.nombre);
    formData.append('descripcion', newProduct.descripcion);

    if (tipoProducto === 'Pizzas') {
      formData.append('price_small', newProduct.price_small);
      formData.append('price_medium', newProduct.price_medium);
      formData.append('price_large', newProduct.price_large);
      formData.append('cheese_crust_price', newProduct.cheese_crust_price);
    } else if (tipoProducto === 'Refrescos') {
      formData.append('precio', newProduct.precio);
      formData.append('tamaño', newProduct.tamaño);
    } else if (tipoProducto === 'Antojitos') {
      formData.append('precio', newProduct.precio);
    }
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      if (editMode && currentProduct) {
        await axios.put(`http://localhost:3001/${tipoProducto.toLowerCase()}/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`http://localhost:3001/${tipoProducto.toLowerCase()}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchProductos();
      setShowModal(false);
      resetNewProduct();
      setCurrentProduct(null);
    } catch (error) {
      console.error(`Error ${editMode ? 'editing' : 'adding'} ${tipoProducto.toLowerCase()}:`, error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/${tipoProducto.toLowerCase()}/${id}`);
      fetchProductos();
    } catch (error) {
      console.error(`Error deleting ${tipoProducto.toLowerCase()}:`, error);
    }
  };

  const handleEditButtonClick = (product) => {
    setCurrentProduct(product);
    setNewProduct({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      price_small: product.price_small,
      price_medium: product.price_medium,
      price_large: product.price_large,
      cheese_crust_price: product.cheese_crust_price,
      tamaño: product.tamaño || '',
      image: null,
    });
    setShowModal(true);
    setEditMode(true);
  };

  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
    setEditMode(false);
  };

  return (
    <div className="productos-container">
      <h2>Productos de la Pizzería</h2>

      <button
        className="add-button"
        onClick={() => {
          setShowModal(true);
          setEditMode(false);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Agregar
      </button>

      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className="filter-box">
        <label>Tipo de Producto</label>
        <select value={tipoProducto} onChange={handleTipoProductoChange}>
          <option value="Pizzas">Pizzas</option>
          <option value="Refrescos">Refrescos</option>
          <option value="Antojitos">Antojitos</option>
        </select>
      </div>

      <table className="productos-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            {tipoProducto === 'Pizzas' ? (
              <>
                <th>Precio Pequeña</th>
                <th>Precio Mediana</th>
                <th>Precio Grande</th>
                <th>Precio Orilla con Queso</th>
              </>
            ) : (
              <>
                {tipoProducto === 'Refrescos' && <th>Tamaño</th>}
                <th>Precio</th>
              </>
            )}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>
                {producto.url_imagen && (
                  <img src={`http://localhost:3001/${producto.url_imagen}`} alt={producto.nombre} width="100" />
                )}
              </td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              {tipoProducto === 'Pizzas' ? (
                <>
                  <td>${producto.price_small}</td>
                  <td>${producto.price_medium}</td>
                  <td>${producto.price_large}</td>
                  <td>${producto.cheese_crust_price}</td>
                </>
              ) : (
                <>
                  {tipoProducto === 'Refrescos' && <td>{producto.tamaño}</td>}
                  <td>${producto.precio}</td>
                </>
              )}
              <td>
                <button className="edit-button" onClick={() => handleEditButtonClick(producto)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button" onClick={() => handleDeleteProduct(producto.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="view-button" onClick={() => handleViewProduct(producto)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={newProduct.nombre}
                onChange={handleInputChange}
                required
              />
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={newProduct.descripcion}
                onChange={handleInputChange}
              ></textarea>
              {tipoProducto === 'Pizzas' ? (
                <>
                  <label>Precio Pequeña</label>
                  <input
                    type="text"
                    name="price_small"
                    value={newProduct.price_small}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Precio Mediana</label>
                  <input
                    type="text"
                    name="price_medium"
                    value={newProduct.price_medium}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Precio Grande</label>
                  <input
                    type="text"
                    name="price_large"
                    value={newProduct.price_large}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Precio Orilla con Queso</label>
                  <input
                    type="text"
                    name="cheese_crust_price"
                    value={newProduct.cheese_crust_price}
                    onChange={handleInputChange}
                    required
                  />
                </>
              ) : tipoProducto === 'Refrescos' ? (
                <>
                  <label>Tamaño</label>
                  <input
                    type="text"
                    name="tamaño"
                    value={newProduct.tamaño}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleInputChange}
                    required
                  />
                </>
              ) : (
                <>
                  <label>Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
              <label>Imagen</label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={handleAddOrEditProduct}
              >
                {editMode ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetNewProduct();
                  setCurrentProduct(null);
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
