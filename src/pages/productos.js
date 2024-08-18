import React, { useState, useEffect } from 'react';
import './Productos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SearchBox from './SearchBox'; // Importa el componente SearchBox

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
    tamano: '',
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    fetchProductos();
  }, [tipoProducto]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`https://backend-pizza-p9w9.onrender.com/${tipoProducto.toLowerCase()}`);
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
      tamano: '',
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
      formData.append('tamaño', newProduct.tamano);
    } else if (tipoProducto === 'Antojitos') {
      formData.append('precio', newProduct.precio);
    }
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      if (editMode && currentProduct) {
        await axios.put(`https://backend-pizza-p9w9.onrender.com/${tipoProducto.toLowerCase()}/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`https://backend-pizza-p9w9.onrender.com/${tipoProducto.toLowerCase()}`, formData, {
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
      await axios.delete(`https://backend-pizza-p9w9.onrender.com/${tipoProducto.toLowerCase()}/${id}`);
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
      tamano: product.tamano,
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

  // Filtrar productos según el término de búsqueda
  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Agrega el cuadro de búsqueda */}

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
                {tipoProducto === 'Refrescos' }
                <th>Precio</th>
              </>
            )}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((producto) => (
            <tr key={producto.id}>
              <td>
                {producto.url_imagen && (
                  <img src={`https://backend-pizza-p9w9.onrender.com/${producto.url_imagen}`} alt={producto.nombre} width="100" />
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
              />
              {tipoProducto === 'Pizzas' ? (
                <>
                  <label>Precio Pequeña</label>
                  <input
                    type="text"
                    name="price_small"
                    value={newProduct.price_small}
                    onChange={handleInputChange}
                  />
                  <label>Precio Mediana</label>
                  <input
                    type="text"
                    name="price_medium"
                    value={newProduct.price_medium}
                    onChange={handleInputChange}
                  />
                  <label>Precio Grande</label>
                  <input
                    type="text"
                    name="price_large"
                    value={newProduct.price_large}
                    onChange={handleInputChange}
                  />
                  <label>Precio Orilla con Queso</label>
                  <input
                    type="text"
                    name="cheese_crust_price"
                    value={newProduct.cheese_crust_price}
                    onChange={handleInputChange}
                  />
                </>
              ) : tipoProducto === 'Refrescos' ? (
                <>
                  <label>Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleInputChange}
                  />
                  <label>Tamaño</label>
                  <input
                    type="text"
                    name="tamano"
                    value={newProduct.tamano}
                    onChange={handleInputChange}
                  />
                </>
              ) : tipoProducto === 'Antojitos' ? (
                <>
                  <label>Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleInputChange}
                  />
                </>
              ) : null}
              <label>Imagen (opcional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={handleAddOrEditProduct}
              >
                {editMode ? 'Actualizar' : 'Agregar'}
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
