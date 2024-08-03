import axios from 'axios';

export const createBill = async (billData) => {
  try {
    const response = await axios.post('http://localhost:9091/api/bills/create', billData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create bill');
  }
};

