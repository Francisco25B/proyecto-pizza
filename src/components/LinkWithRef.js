// src/components/LinkWithRef.js
import React, { useContext } from 'react';
import MyContext from '../MyContext';

function LinkWithRef(props) {
  const context = useContext(MyContext);

  if (!context) {
    // Manejo de error si el contexto es nulo
    console.error('El contexto es nulo');
    return null;
  }

  const { basename } = context;

  return (
    <a href={`${basename}/somepath`}>Link</a>
  );
}

export default LinkWithRef;
