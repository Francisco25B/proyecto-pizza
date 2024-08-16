import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

function Dashboard() {
  const [ganancias, setGanancias] = useState(0);
  const [productosPizzas, setProductosPizzas] = useState([]);
  const [productosRefrescos, setProductosRefrescos] = useState([]);
  const [productosAntojitos, setProductosAntojitos] = useState([]);
  const [pedidosNuevos, setPedidosNuevos] = useState([]);
  const [fechaReporte, setFechaReporte] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosResponse = await fetch('http://localhost:3001/pedidos');
  
        if (!pedidosResponse.ok ) {
          throw new Error('Error al obtener los datos');
        }
  
        const pedidos = await pedidosResponse.json();
  
        const currentDate = new Date().toDateString(); // Formato de fecha del día actual
  
        const filteredPedidos = pedidos.filter(pedido => new Date(pedido.fecha).toDateString() === currentDate);
  
        const totalGanancias = filteredPedidos.reduce((total, pedido) => total + parseFloat(pedido.precio) * parseInt(pedido.cantidad), 0);
        setGanancias(totalGanancias);
  
        setPedidosNuevos(filteredPedidos.slice(0, 4));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
  
    fetchData();
  }, [fechaReporte]);
   

  const generateReport = () => {
    if (
     
      pedidosNuevos.length === 0 &&
      ganancias === 0
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Sin registros',
        text: 'No hubo registros para el día correspondiente.',
      });
      return;
    }
  
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte Del Dia', 10, 10);
    doc.setFontSize(12);
  
    const fechaTexto = fechaReporte.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Fecha: ${fechaTexto}`, 10, 20);
  
    doc.text(`Ganancias Totales: $${ganancias.toFixed(2)}`, 10, 30);
  
    
  
    const pedidosTable = pedidosNuevos.map(pedido => [pedido.nombre_completo, pedido.nombre_producto]);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Nombre Completo', 'Nombre Producto']],
      body: pedidosTable,
    });
  
    doc.save(`reporte_dashboard_${fechaReporte.toLocaleDateString('es-ES')}.pdf`);
  
    // Borrar registros después de generar el reporte
    setGanancias(0);
    setProductosPizzas([]);
    setProductosRefrescos([]);
    setProductosAntojitos([]);
    setPedidosNuevos([]);
  };
  

  return (
    <div className="dashboard-container">
      <h1>Inicio</h1>
      <p>Bienvenido al panel de administración. Aquí puedes ver un resumen de las actividades y estadísticas.</p>
      <button onClick={generateReport} className="report-button">Generar Reporte</button>
      <div id="dashboard-report" className="dashboard-stats">
        <div className="stat-card">
          <h2>Ganancias Totales</h2>
          <p>${ganancias.toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h2>Últimos 4 Pedidos Nuevos</h2>
          <ul>
            {pedidosNuevos.map(pedido => (
              <li key={pedido.id}>Pedido De {pedido.nombre_completo} - {pedido.nombre_producto}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
