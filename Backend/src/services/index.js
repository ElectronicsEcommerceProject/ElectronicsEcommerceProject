import {  isRegisteredEmail, isRegisteredPhoneNumber } from "./auth/auth.service";

// example
const services ={
    auth: {
        isRegisteredEmail: isRegisteredEmail,
        isRegisteredPhoneNumber:isRegisteredPhoneNumber
    },
    
}

export default services;