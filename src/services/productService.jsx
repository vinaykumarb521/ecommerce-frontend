import axios from 'axios';

const API_URL = 'http://localhost:9091/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products/all`);
  return response.data;
};

export const fetchCategories = async () => {
    const response = await fetch('/api/categories/all');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  };