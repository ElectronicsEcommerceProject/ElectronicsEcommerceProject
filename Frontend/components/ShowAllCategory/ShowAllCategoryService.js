import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_CATEGORY_ENDPOINT = import.meta.env.VITE_CATEGORY_ENDPOINT;

const CATEGORY_ENDPOINT_API = `${BASE_URL}${VITE_CATEGORY_ENDPOINT}`;


// 🔐 ShowAllCategory API
const getAllCategories = async (token) => {
  try {
    const response = await axios.get(`${CATEGORY_ENDPOINT_API}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'categories failed' };
  }
};



export default {
    getAllCategories
};