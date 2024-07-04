import React from 'react';
import './Productos.css'; // Archivo CSS para estilos específicos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'; // Importación de los iconos de FontAwesome

const Productos = () => {
  return (
    <div className="productos-container">
      <h2>Productos de la Pizzería</h2>

      {/* Botón circular verde con icono de más */}
      <button className="add-button">
        <FontAwesomeIcon icon={faPlus} />Agregar
      </button>

      {/* Cuadro de búsqueda */}
      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button><FontAwesomeIcon icon={faSearch} /></button>
      </div>

      {/* Tabla de productos */}
      <table className="productos-table">
        <thead>
          <tr>
            <th>Imagen de Pizza</th>
            <th>Nombre de Pizza</th>
            <th>Ingredientes</th>
            <th>Precio</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src="ruta/a/imagen.jpg" alt="Pizza" className="pizza-image" /></td>
            <td>Pizza Hawaiana</td>
            <td>Jamón, piña, queso</td>
            <td>$150</td>
            <td>
              <button className="view-button"><FontAwesomeIcon icon={faEye} /></button>
              <button className="edit-button"><FontAwesomeIcon icon={faEdit} /></button>
              <button className="delete-button"><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>
          {/* Aquí se agregarían más filas según los productos */}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
