import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this is the correct environment variable
let ROUTE_ENDPOINT;

const token = localStorage.getItem("token");
let decodedToken;

if (token) {
  decodedToken = jwt_decode(token);
  const { role } = decodedToken;
  ROUTE_ENDPOINT =
    role === "admin" ? `admin${ROUTE_ENDPOINT}` : `user${ROUTE_ENDPOINT}`;
}

const API_ENDPOINT = `${BASE_URL}${ROUTE_ENDPOINT}`; // Construct the API URL

// console.log('API_ENDPOINT:', API_ENDPOINT); // Debugging: Log the constructed API URL

// 🔐 Create API
const createApi = async (data, ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Create API failed" };
  }
};

// 🔍 Get All API
const getApi = async (ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get API failed" };
  }
};

// 🔍 Get API by ID
const getApiById = async (id, ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get API by ID failed" };
  }
};

// 🔄 Update API
const updateApi = async (id, data, ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Update API failed" };
  }
};

// 🔄 Update API by ID
const updateApiById = async (id, data, ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.patch(`${API_ENDPOINT}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Update API by ID failed" };
  }
};

// 🗑️ Delete API
const deleteApi = async (ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Delete API failed" };
  }
};

// 🗑️ Delete API by ID
const deleteApiById = async (id, ROUTE_ENDPOINT = routeEndpoint) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Delete API by ID failed" };
  }
};

export default {
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
};
