import {  default as authService } from "./auth/auth.service.js";

// example
const services ={
    auth: {
        isRegisteredEmail: authService.isRegisteredEmail,
        isRegisteredPhoneNumber:authService.isRegisteredPhoneNumber
    },
    
}

export default services;