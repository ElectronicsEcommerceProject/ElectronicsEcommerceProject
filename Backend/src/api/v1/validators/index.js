import Joi from 'joi';
import { loginValidator } from './auth/login.validators';
import { registerValidator } from './auth/register.validators';
import { productValidationSchema } from './product/product.validators';

export const validators = {
    auth: {
        register:registerValidator,
        login: loginValidator
    },
    product:{
        createProduct:productValidationSchema,
        updateProduct:productValidationSchema,
    }
};