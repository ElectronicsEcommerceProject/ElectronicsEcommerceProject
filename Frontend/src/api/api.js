import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this is the correct environment variable
let ROUTE_ENDPOINT;

// const token = localStorage.getItem("token");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInVzZXJfaWQiOiJiMzRlMzYzYS1hMGQ1LTQ2ZDYtOWQ5NS1iY2M3Mjc5ZjJmMmYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDc3NTU3ODUsImV4cCI6MTc0ODAwNzc4NX0.fOJhDO_eUMJ6ZCdVm7_-j5WhJx3tCsF1l-z6hwbbm94";

let decodedToken;

if (token) {
  decodedToken = jwtDecode(token);
  const { role } = decodedToken;
  ROUTE_ENDPOINT = role === "admin" ? `admin` : `user`;
}

// Helper function to construct the API URL without double slashes
const constructApiUrl = (baseUrl, routeEndpoint) => {
  return `${baseUrl.replace(/\/+$/, "")}/${routeEndpoint.replace(/^\/+/, "")}`;
};

// 🔐 Create API
const createApi = async (routeEndpoint, data) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.post(`${API_ENDPOINT}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Create API failed" };
  }
};

// 🔍 Get All API
const getApi = async (routeEndpoint) => {
  try {
    console.log(
      "testing form routeEndpoint passed by function to getApi",
      routeEndpoint
    );
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    // console.log("API_ENDPOINT:", API_ENDPOINT); // Debugging: Log the constructed API URL
    const response = await axios.get(`${API_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get API failed" };
  }
};

// 🔍 Get API by ID
const getApiById = async (routeEndpoint, id) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.get(`${API_ENDPOINT}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get API by ID failed" };
  }
};

// 🔄 Update API
const updateApi = async (routeEndpoint, id, data) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.put(`${API_ENDPOINT}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Update API failed" };
  }
};

// 🔄 Update API by ID
const updateApiById = async (routeEndpoint, id, data) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.patch(`${API_ENDPOINT}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Update API by ID failed" };
  }
};

// 🗑️ Delete API
const deleteApi = async (routeEndpoint) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.delete(`${API_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Delete API failed" };
  }
};

// 🗑️ Delete API by ID
const deleteApiById = async (routeEndpoint, id) => {
  try {
    const API_ENDPOINT = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}`
    ); // Construct the API URL
    const response = await axios.delete(`${API_ENDPOINT}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Delete API by ID failed" };
  }
};

export {
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
};
