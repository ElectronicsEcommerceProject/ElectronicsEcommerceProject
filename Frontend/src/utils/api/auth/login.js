import {StatusCodes} from "http-status-codes";

import { headers } from "../../../config/config";
import { request } from "../../api";
import { AUTHORIZATION } from "../../../constants/api/auth";


const { post } = request;

const { Authorization, Bearer } = AUTHORIZATION;

export const login = async (payload) => {
  try {
    const payload = JSON.stringify(payload);
    const endpoint = "auth/login";
    const response = await post(endpoint, payload, headers);

    if (response) {
      const {
        data: { message },
      } = response;

      if(message=="Authothentication Successful"){
        
        const {data:{message,result,token}}=response;
        return {
          message,
          result,
          token,
        };
      }
      throw new Error();
    }
    throw new Error();
  } catch (error) {
    if(error.response.status==StatusCodes.BAD_REQUEST){
        const {message}=error.response.data;

        alert(message);
    }else if(error.response.status==StatusCodes.UNAUTHORIZED){
        const {message}=error.response.data;

        if(message=="Authentication Failed!"){
        alert(message);
        }else{
            throw error;
        }
    }else{
        throw error;
    }
  }
};
