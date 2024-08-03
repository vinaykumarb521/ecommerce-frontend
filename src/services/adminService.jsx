import axios from 'axios';

const API_URL = 'http://localhost:9091/api';

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const addCategory = async (category) => {
  await axios.post(`${API_URL}/categories/`, { category });
};

export const fetchGstRates = async () => {
  const response = await axios.get(`${API_URL}/gstRate/all`);
  return response.data;
};

export const addGstRate = async (gstRate) => {
  await axios.post(`${API_URL}/gstRate/set`, gstRate);
};

export const addProduct = async (product) => {
  await axios.post(`${API_URL}/products/create`, product);
};

export const adminLogin = async (credentials) => {
  return await axios.post(`${API_URL}/admin/login`, credentials);
};

export const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/all');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products", error);
      throw error;
    }
  };