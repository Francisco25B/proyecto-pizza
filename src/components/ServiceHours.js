import React from 'react';

function ServiceHours() {
  const daysOfWeek = [
    { day: 'Lunes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Martes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Miércoles', hours: '2:00 PM - 10:00 PM' },
    { day: 'Jueves', hours: 'Sin Servicio' },
    { day: 'Viernes', hours: '2:00 PM - 10:00 PM' },
    { day: 'Sábado', hours: '2:00 PM - 10:00 PM' },
    { day: 'Domingo', hours: '2:00 PM - 10:00 PM' },
  ];

  const today = new Date().getDay();

  return (
    <div className="service-hours">
      <h2>Horario de Servicio</h2>
      <ul>
        {daysOfWeek.map((item, index) => (
          <li 
            key={index} 
            className={index + 1 === today ? 'highlight' : ''}
          >
            {item.day}: {item.hours}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ServiceHours;
