//     auth controller
export { default as loginController } from "./auth/login.controller.js";
export { default as registerController } from "./auth/register.controller.js";

// common controller
export { default as profileController } from "./commonControllers/profile/profile.controller.js";
export { default as addressController } from "./commonControllers/address/address.controller.js";
export { default as cartController } from "./commonControllers/cart/cart.controller.js";
export { default as cartItemController } from "./commonControllers/cart/cartItem.controller.js";
export { default as wishListController } from "./commonControllers/wishList/wishList.controller.js";
export { default as wishListItemController } from "./commonControllers/wishList/wishListItem.controller.js";
export { default as orderController } from "./commonControllers/order/order.controller.js";
//     admin controller
export { default as adminCategoryController } from "./admin/category.controller.js";
export { default as adminCouponController } from "./admin/coupon.controller.js";
export { default as adminUserController } from "./admin/user.controller.js";
export { default as adminProductController } from "./admin/product.controller.js";
export { default as adminProductVariantController } from "./admin/productVariant.controller.js";
export { default as adminProductMediaController } from "./admin/productMedia.controller.js";
export { default as adminProductMediaURLController } from "./admin/productMediaURL.controller.js";
export { default as adminVariantAttributeValueController } from "./admin/productVariantAttributeValues.controller.js";
export { default as adminStockAlertController } from "./admin/stockAlert.controller.js";

// export { default as adminProfileController } from './admin/profile.controller.js';
export { default as adminCartController } from "./admin/cart.controller.js";
export { default as adminReviewController } from "./admin/review.controller.js";
export { default as adminBrandController } from "./admin/brand.controller.js";
export { default as adminAttributeController } from "./admin/productAttributes.controller.js";
export { default as adminAttributeValueController } from "./admin/productAttributesValues.controller.js";

//     customer controller
export { default as customerOrderController } from "./customer/order.controller.js";
export { default as customerProductController } from "./customer/product.controller.js";
// export { default as customerProfileController } from './customer/profile.controller.js';
export { default as customerReviewController } from "./customer/review.controller.js";
export { default as customerWishlistController } from "./customer/wishlist.controller.js";
export { default as customerCartController } from "./customer/cart.controller.js";

//     retailer controller
export { default as retailerOrderController } from "./retailer/order.controller.js";
export { default as retailerProductController } from "./retailer/product.controller.js";
// export { default as retailerProfileController } from './retailer/profile.controller.js';
export { default as retailerReviewController } from "./retailer/review.controller.js";
export { default as retailerCartController } from "./retailer/cart.controller.js";
export { default as retailerrWishlistController } from "./retailer/wishlist.controller.js";
