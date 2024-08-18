import axios from 'axios';

// Actualiza esta URL con la URL de tu backend en Render
const API_URL = 'https://backend-pizza-p9w9.onrender.com';

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo los usuarios:', error);
    throw error;
  }
};
