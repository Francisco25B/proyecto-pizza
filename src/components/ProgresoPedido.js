import React from 'react';

const ProgresoPedido = ({ estado }) => {
  if (!estado) {
    return <p>Estado no disponible</p>;
  }

  return (
    <div>
      <h2>Estado de tu pedido</h2>
      <p>{estado}</p>
    </div>
  );
};

export default ProgresoPedido;
