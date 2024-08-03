import axios from 'axios';

const API_URL = 'http://localhost:9091/api';

export const registerUser = async (user) => {
  await axios.post(`${API_URL}/user/register`, user);
};

export const loginUser = async (user) => {
  return await axios.post(`${API_URL}/user/login`, user);
};
