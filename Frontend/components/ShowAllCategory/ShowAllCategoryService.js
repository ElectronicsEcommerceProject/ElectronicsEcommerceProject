import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_CATEGORY_ENDPOINT = import.meta.env.VITE_CATEGORY_ENDPOINT;
const VITE_PRODUCT_ENDPOINT = import.meta.env.VITE_PRODUCT_ENDPOINT;

const CATEGORY_ENDPOINT_API = `${BASE_URL}${VITE_CATEGORY_ENDPOINT}`;
const PRODUCT_ENDPOINT_API = `${BASE_URL}${VITE_PRODUCT_ENDPOINT}`;

// 🔐 ShowAllCategory API
const getAllCategories = async (token) => {
  try {
    const response = await axios.get(`${CATEGORY_ENDPOINT_API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "categories failed" };
  }
};

// 🔐 Fetch products based on category_id
const fetchProductsBasedOnCategoryId = async (categoryId, token) => {
  try {
    const response = await axios.get(
      `${PRODUCT_ENDPOINT_API}/category/${categoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

// 🔐 Fetch all products
const fetchAllProducts = async (token) => {
  try {
    const response = await axios.get(`${PRODUCT_ENDPOINT_API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch all products" };
  }
};

export default {
  getAllCategories,
  fetchProductsBasedOnCategoryId,
  fetchAllProducts,
};