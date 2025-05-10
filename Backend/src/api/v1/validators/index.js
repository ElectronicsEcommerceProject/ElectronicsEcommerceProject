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

import { profileValidator } from "./profileAndAddress/profile.validators.js";
import {
  addressValidator,
  id,
  updateAddressValidator,
} from "./profileAndAddress/address.validators.js";
import {
  categoryValidator,
  categoryUpdateValidator,
  category_id,
} from "./category/category.validators.js";
import {
  brandValidator,
  brandUpdateValidator,
  brand_id,
} from "./brands/brands.validators.js";

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
import {
  variantAttributeValueValidator,
  variantAttributeValueUpdateValidator,
} from "./product/productVariantAttributeValues/productVariantAttributeValues.validators.js";
import {
  productMediaURLValidator,
  productMediaURLUpdateValidator,
} from "./product/productMediaUrl/productMediaUrl.validators.js";

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
    id: id,
  },
  address: {
    addressValidator: addressValidator,
    updateAddressValidator: updateAddressValidator,
    id: id,
  },
  category: {
    categoryValidator: categoryValidator,
    categoryUpdateValidator: categoryUpdateValidator,
    category_id: category_id,
  },
  brand: {
    brandValidator: brandValidator,
    brandUpdateValidator: brandUpdateValidator,
    brand_id: brand_id,
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
  productVariantAttributeValues: {
    variantAttributeValueValidator: variantAttributeValueValidator,
    variantAttributeValueUpdateValidator: variantAttributeValueUpdateValidator,
    id: id,
  },
  productMedia: {
    productMediaValidator: productMediaValidator,
    productMediaUpdateValidator: productMediaUpdateValidator,
    id: id,
  },
  productMediaUrl: {
    productMediaUrlValidator: productMediaURLValidator,
    productMediaUrlUpdateValidator: productMediaURLUpdateValidator,
    id: id,
  },
};
