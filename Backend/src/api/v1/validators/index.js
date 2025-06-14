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

import {
  stockAlertValidator,
  stockAlertUpdateValidator,
  alertId,
} from "./stockAlert/stockAlert.validators.js";

import {
  createCartValidator,
  cartIdValidator,
} from "./cart/cart.validators.js";

// Import cart item validators
import {
  createCartItemValidator,
  updateCartItemValidator,
  cartItemIdValidator,
} from "./cart/cartItem.validators.js";

// Import wishlist validators
import {
  createWishlistValidator,
  wishlistIdValidator,
} from "./wishList/wishList.validators.js";

import {
  createWishlistItemValidator,
  wishlistItemIdValidator,
} from "./wishList/wishListItem.validators.js";

import {
  createOrderValidator,
  updateOrderValidator,
  orderIdValidator,
} from "./order/order.validators.js";

import {
  createOrderItemValidator,
  updateOrderItemValidator,
  orderItemIdValidator,
} from "./order/orderItem.validators.js";
import {
  couponValidator,
  couponUpdateValidator,
  couponIdValidator,
} from "./coupon/coupon.validators.js";

import {
  couponUserValidator,
  couponUserIdValidator,
  userIdValidator,
} from "./coupon/couponUser.validators.js";

import {
  couponRedemptionValidator,
  couponRedemptionIdValidator,
} from "./coupon/couponRedemption.validator.js";

import {
  discountRuleIdValidator,
  discountRuleValidator,
  discountRuleUpdateValidator,
} from "./discountRule/discountRule.validator.js";

import {
  createReviewValidator,
  updateReviewValidator,
  productIdValidator,
  reviewIdValidator,
} from "./product/productReview/productReview.validators.js";

import { addProductManagementValidator } from "./product/ProductManagment/addProductManagment.validators.js";

import {
  updateStockValidator,
  variantIdValidator as stockVariantIdValidator,
} from "./stockManagement.validator.js";

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
    updateStockValidator: updateStockValidator,
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
    category_id: category_id,
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
  stockAlert: {
    stockAlertValidator,
    stockAlertUpdateValidator,
    alertId,
  },
  cart: {
    createCart: createCartValidator,
    userId: cartIdValidator,
  },
  cartItem: {
    createCartItem: createCartItemValidator,
    updateCartItem: updateCartItemValidator,
    cartItemId: cartItemIdValidator,
  },
  wishList: {
    createWishlist: createWishlistValidator,
    wishListIdValidator: wishlistIdValidator,
  },
  wishListItem: {
    createWishlistItemValidator,
    wishlistItemIdValidator,
  },
  order: {
    createOrderValidator: createOrderValidator,
    updateOrderValidator: updateOrderValidator,
    orderIdValidator: orderIdValidator,
  },
  orderItem: {
    createOrderItemValidator: createOrderItemValidator,
    updateOrderItemValidator: updateOrderItemValidator,
    orderItemIdValidator: orderItemIdValidator,
  },
  coupon: {
    couponValidator,
    couponUpdateValidator,
    couponIdValidator,
  },
  couponUser: {
    couponUserValidator,
    couponUserIdValidator,
    userIdValidator,
    couponIdValidator,
  },
  couponRedemption: {
    couponRedemptionValidator,
    couponRedemptionIdValidator,
    userIdValidator,
    couponIdValidator,
    orderIdValidator,
  },
  discountRule: {
    discountRuleValidator,
    discountRuleUpdateValidator,
    discountRuleIdValidator,
  },
  productReview: {
    createReviewValidator,
    updateReviewValidator,
    productIdValidator,
    reviewIdValidator,
  },
  productManagement: {
    addProductManagementValidator,
  },
};
