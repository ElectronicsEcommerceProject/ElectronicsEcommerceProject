import { StatusCodes } from "http-status-codes";

import { headers } from "../../../config/config";
import { request } from "../../api";
import { AUTHORIZATION } from "../../../constants/api/auth";

const { put } = request;

const { Authorization, Bearer } = AUTHORIZATION;

const initialRoute = "profile";

export const updateProfile = async (payload) => {
  try {
    const payload = JSON.stringify(payload);
    const endpoint = `${initialRoute}`;
    const token = localStorage.getItem("token"); // Get the token from local storage or jwt
    const response = await put(endpoint, payload, {
      ...headers,
      [Authorization]: `${Bearer} ${token}`,
    });

    if (response) {
      const {
        data: { message },
      } = response;

      if (message == "Data edited successfully") {
        const {
          data: { message },
        } = response;
        return  message
          
        
      }
      throw new Error();
    }
    throw new Error();
  } catch (error) {
    if (error.response.status == StatusCodes.BAD_REQUEST) {
      const { message } = error.response.data;

      alert(message);
    } else if (error.response.status == StatusCodes.UNAUTHORIZED) {
      const { message } = error.response.data;

      if (message == "Authentication Failed!") {
        alert(message);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};
