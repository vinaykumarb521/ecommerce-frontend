import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091/api';

export const addToCart = async (username, product) => {
  const response = await axios.post(`${API_BASE_URL}/cart`, { username, productId: product.id, quantity: 1 });
  return response.data;
};

export const getCartItems = async (username) => {
  const response = await axios.get(`${API_BASE_URL}/cart`, { params: { username } });
  return response.data;
};
