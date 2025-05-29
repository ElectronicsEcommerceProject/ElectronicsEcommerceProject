import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this is the correct environment variable
let ROUTE_ENDPOINT;

// const token = localStorage.getItem("token");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInVzZXJfaWQiOiI5MjBhNzRiZi04MDE0LTQ0NmEtYTE4YS0zMzdlY2Y4NjdjNDkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDgzNTQ2NjAsImV4cCI6MTc1MDg3NDY2MH0.UPbOCNUTwZ44XFkTamHllHw95cLqHBQ9VcIsIsd2rsc";

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

// const deleteApiByCondition = async (routeEndpoint, id, data) => {
//   console.log("data", data);
//   try {
//     const API_ENDPOINT = constructApiUrl(
//       BASE_URL,
//       `${ROUTE_ENDPOINT}${routeEndpoint}`
//     ); // Construct the API URL
//     const response = await axios({
//       method: "delete",
//       url: `${API_ENDPOINT}/${id}`,
//       headers: { Authorization: `Bearer ${token}` },
//       data: data, // Pass data directly in request body
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Delete API by ID failed" };
//   }
// };

const deleteApiByCondition = async (routeEndpoint, id, data) => {
  try {
    console.log("Data being sent:", data);

    const apiUrl = constructApiUrl(
      BASE_URL,
      `${ROUTE_ENDPOINT}${routeEndpoint}/${id}`
    );

    const response = await axios.delete(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
      data: { data: data }, // Send JSON body in DELETE request
    });

    return response.data;
  } catch (error) {
    console.error("Delete API Error:", error);
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
  deleteApiByCondition,
};
