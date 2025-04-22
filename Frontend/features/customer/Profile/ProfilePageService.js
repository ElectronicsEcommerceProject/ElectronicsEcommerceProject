import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_PROFILE_ENDPOINT = import.meta.env.VITE_PROFILE_ENDPOINT;

const PROFILE_ENDPOINT_API = `${BASE_URL}${VITE_PROFILE_ENDPOINT}`;

// 🔐 Get profile data
const getProfileData = async (token) => {
  const response = await axios.get(PROFILE_ENDPOINT_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✏️ Update profile data
const updateProfileData = async (formData, token) => {
  const response = await axios.put(PROFILE_ENDPOINT_API, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default {
  getProfileData,
  updateProfileData,
};
