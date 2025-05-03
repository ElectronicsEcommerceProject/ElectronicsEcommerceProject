import Joi from 'joi';
import { loginValidator } from './auth/login.validators.js';
import { registerValidator } from './auth/register.validators.js';

import { productValidationSchema } from './product/product.validators.js';
import { profileValidator } from './profile/profile.validators.js';


export const validators = {
    auth: {
        register:registerValidator,
        login: loginValidator
    },
    product:{
        createProduct:productValidationSchema,
        updateProduct:productValidationSchema,
    },
    profile:{
        profile:profileValidator
    }
};