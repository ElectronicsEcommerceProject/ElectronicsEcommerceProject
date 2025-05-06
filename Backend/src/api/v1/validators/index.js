import Joi from "joi";
import { loginValidator } from "./auth/login.validators.js";
import { registerValidator } from "./auth/register.validators.js";

import {
  productValidationSchema,
  productUpdateValidationSchema,
  productIdSchema,
} from "./product/product.validators.js";

import {
  productVariantValidator,
  productVariantUpdateValidator,
  variantIdSchema,
} from "./product/productVariant/productVariant.validators.js";

import { profileValidator } from "./profile/profile.validators.js";
import {
  addressValidator,
  id,
  updateAddressValidator,
} from "./profile/address.validators.js";
import {
  categoryValidator,
  categoryUpdateValidator,
} from "./category/category.validators.js";
import {
  brandValidator,
  brandUpdateValidator,
} from "./brands/brands.validators.js";
import {
  productTypeValidator,
  productTypeUpdateValidator,
} from "./product/productTypes/productTypes.validators.js";
import {
  attributeValidator,
  attributeUpdateValidator,
} from "./product/productAttributes/productAttributes.validators.js";
import {
  attributeValueValidator,
  attributeValueUpdateValidator,
} from "./product/productAttributesValues/productAttributesValues.validators.js";
import {
  productMediaValidator,
  productMediaUpdateValidator,
} from "./product/productMedia/productMedia.validators.js";

export const validators = {
  auth: {
    register: registerValidator,
    login: loginValidator,
  },
  product: {
    createProduct: productValidationSchema,
    updateProduct: productUpdateValidationSchema,
    id: id,
  },
  productVariant: {
    createVariant: productVariantValidator,
    updateVariant: productVariantUpdateValidator,
    id: id,
  },
  profile: {
    profile: profileValidator,
  },
  address: {
    addressValidator: addressValidator,
    updateAddressValidator: updateAddressValidator,
    id: id,
  },
  category: {
    categoryValidator: categoryValidator,
    categoryUpdateValidator: categoryUpdateValidator,
    id: id,
  },
  brand: {
    brandValidator: brandValidator,
    brandUpdateValidator: brandUpdateValidator,
    id: id,
  },
  productType: {
    productTypeValidator: productTypeValidator,
    productTypeUpdateValidator: productTypeUpdateValidator,
    id: id,
  },
  attribute: {
    attributeValidator: attributeValidator,
    attributeUpdateValidator: attributeUpdateValidator,
    id: id,
  },
  attributeValue: {
    attributeValueValidator: attributeValueValidator,
    attributeValueUpdateValidator: attributeValueUpdateValidator,
    id: id,
  },
  productMedia: {
    productMediaValidator: productMediaValidator,
    productMediaUpdateValidator: productMediaUpdateValidator,
    id: id,
  },
};
