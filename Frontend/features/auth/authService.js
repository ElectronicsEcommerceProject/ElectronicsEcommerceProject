import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;

const AUTH_API = `${BASE_URL}${AUTH_ENDPOINT}`;


// console.log('AUTH_API:', AUTH_API); // Debugging: Log the constructed API URL

// 🔐 Login API
const login = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_API}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// 📝 Signup API
const signup = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API}/register`, userData);
    console.log('Signup response:', response.data); // Debugging: Log the signup response
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

// 🔁 Forgot Password API
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_API}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

export default {
  login,
  signup,
  forgotPassword,
};