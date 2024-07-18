import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo los usuarios:', error);
    throw error;
  }
};
