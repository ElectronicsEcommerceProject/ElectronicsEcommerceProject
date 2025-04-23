import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_PRODUCT_ENDPOINT = import.meta.env.VITE_PRODUCT_ENDPOINT;

const VITE_PRODUCT_ENDPOINT_API = `${BASE_URL}${VITE_PRODUCT_ENDPOINT}`;


// 🔐 ShowAllProducts API
const getAllProducts = async (token) => {
  try {
    const response = await axios.get(`${VITE_PRODUCT_ENDPOINT_API}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // console.log('response', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'products failed to fetch' };
  }
};

const getProductById = async (id, token) => {
  try {
    const response = await axios.get(`${VITE_PRODUCT_ENDPOINT_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'product failed to fetch' };
  }
};



export default {
    getAllProducts,
    getProductById
};