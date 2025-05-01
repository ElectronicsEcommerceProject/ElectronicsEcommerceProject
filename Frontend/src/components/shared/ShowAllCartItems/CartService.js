import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_CART_ENDPOINT = import.meta.env.VITE_CART_ENDPOINT;
const VITE_CART_ENDPOINT_API = `${BASE_URL}${VITE_CART_ENDPOINT}`;

// ✅ Add item to cart
const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axios.post(
      `${VITE_CART_ENDPOINT_API}`,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to cart" };
  }
};

// ✅ Get all items in user's cart
const getAllCartItems = async (token) => {
  try {
    const response = await axios.get(`${VITE_CART_ENDPOINT_API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch cart items" };
  }
};

// ✅ Update quantity of a specific item
const updateCartItem = async (productId, quantity, token) => {
  try {
    const response = await axios.put(
      `${VITE_CART_ENDPOINT_API}/${productId}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update cart item" };
  }
};

// ✅ Remove item from cart
const removeFromCart = async (productId, token) => {
  try {
    const response = await axios.delete(`${VITE_CART_ENDPOINT_API}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove item from cart" };
  }
};

export default {
  addToCart,
  getAllCartItems,
  updateCartItem,
  removeFromCart,
};