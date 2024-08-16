import React, { useState, useEffect } from 'react';

const usePedidoEstado = (pedidoId) => {
  const [pedido, setPedido] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pedidoId) {
      setLoading(true);
      fetch(`http://localhost:3001/api/pedidos/${pedidoId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la red o en el servidor');
          }
          return response.json();
        })
        .then(data => {
          setPedido(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pedidoId]);

  return { pedido, loading, error };
};

export default usePedidoEstado;

