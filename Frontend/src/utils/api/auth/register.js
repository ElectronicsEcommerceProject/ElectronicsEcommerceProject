import {StatusCodes} from "http-status-codes";

import { headers } from "../../../config/config";
import { request } from "../../api";
import MESSAGE from "../../../../../Backend/src/constants/message";


const { post } = request;

const initialRoute = "/";

export const register = async (payload) => {
  try {
    const payload = JSON.stringify(payload);
    const endpoint = `${initialRoute}auth/register`;
    const response = await post(endpoint, payload, headers);

    if (response) {
      const {
        data: { message },
      } = response;

      if(message==MESSAGE.post.succ){
        
        const {data:{result}}=response;
        return result
      }
      throw new Error();
    }
    throw new Error();
  } catch (error) {
    if(error.response.status==StatusCodes.BAD_REQUEST){
        const {message}=error.response.data;

        alert(message);
    }else{
        throw error;
    }
  }
};
