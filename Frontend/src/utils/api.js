import axios from "axios";

import { url,port,version } from "../config/config";

const get=async (endpoint,headers,params={})=>{
    try{
        const response = await axios.get(`${url}:${port}/api/${version}/${endpoint}`, {
            headers: headers,
            params: params
        });
        const {status} = response;
        if(status == 200){
            return response;
        }
        throw new Error(`Error: ${response}`);

    }catch(error){
        console.error("Error in GET request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
    
}

const post=async (endpoint,payload,headers)=>{
    try{
        const response = await axios.post(`${url}:${port}/api/${version}/${endpoint}`, payload, {
            headers: headers
        });
        const {status} = response;
        if(status == 200){
            return response;
        }
        throw new Error(`Error: ${response}`);

    }catch(error){
        console.error("Error in POST request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
const put=async (endpoint,payload,headers)=>{
    try{
        const response = await axios.put(`${url}:${port}/api/${version}/${endpoint}`, payload, {
            headers: headers
        });
        const {status} = response;
        if(status == 200){
            return response;
        }
        throw new Error(`Error: ${response}`);

    }catch(error){
        console.error("Error in PUT request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
const patch=async(endpoint,payload,headers)=>{
    try{
        const response = await axios.patch(`${url}:${port}/api/${version}/${endpoint}`, payload, {
            headers: headers
        });
        const {status} = response;
        if(status == 200){
            return response;
        }
        throw new Error(`Error: ${response}`);

    }catch(error){
        console.error("Error in PATCH request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
const del=async (endpoint,headers)=>{
    try{
        const response = await axios.delete(`${url}:${port}/api/${version}/${endpoint}`, {
            headers: headers
        });
        const {status} = response;
        if(status == 200){
            return response;
        }
        throw new Error(`Error: ${response}`);

    }catch(error){
        console.error("Error in DELETE request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const request = {
    get,
    post,
    put,
    patch,
    del
}
