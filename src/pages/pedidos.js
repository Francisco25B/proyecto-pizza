import React from 'react';
import './Pedidos.css'; // Archivo CSS para estilos específicos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importación de los iconos de FontAwesome

const Pedidos = () => {
  return (
    <div className="pedidos-container">
      <h2>Pedidos a Domicilio</h2>

      {/* Cuadro de búsqueda */}
      <div className="search-box">
        <input type="text" placeholder="Buscar..." />
        <button><FontAwesomeIcon icon={faSearch} /></button>
      </div>

      {/* Tabla de pedidos */}
      <table className="pedidos-table">
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Teléfono</th>
            <th>Domicilio y Referencias</th>
            <th>Precio</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pizza Hawaiana</td>
            <td>555-1234</td>
            <td>Calle Principal #123, Col. Centro</td>
            <td>$150</td>
            
            <td>
            <button className="view-button"><FontAwesomeIcon icon={faEye} /></button>
                <button className="delete-button"><FontAwesomeIcon icon={faTrash} /></button></td>
          </tr>
          {/* Aquí se agregarían más filas según los pedidos */}
        </tbody>
      </table>
    </div>
  );
};

export default Pedidos;
