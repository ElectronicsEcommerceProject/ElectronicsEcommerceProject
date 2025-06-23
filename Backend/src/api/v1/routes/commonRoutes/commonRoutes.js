import express from "express";
import {
  authRoutes,
  profileRoutes,
  addressesRoutes,
  cartRoutes,
  cartItemRoutes,
  wishListRoutes,
  wishListItemRoutes,
  orderItemRoutes,
  couponRedemptionRoutes,
  productReviewRoutes,
  userProductByIdDetailsPageRoutes,
  userCouponUserRoutes,
} from "./commonRoutes.index.js";

import {
  adminProductRoutes,
  adminCategoryRoutes,
  adminBrandsRoutes,
  adminProductAttributesRoutes,
  adminProductAttributesValuesRoutes,
  adminProductVariantRoutes,
  adminProductVariantAttributeValuesRoutes,
  adminProductMediaRoutes,
  adminProductMediaUrlRoutes,
  adminOrderRoutes,
  adminNotificationRoutes,
} from "../admin/adminRoutes.index.js";

const app = express();

app.use("/auth", authRoutes);

app.use("/category", adminCategoryRoutes);

app.use("/brand", adminBrandsRoutes);

app.use("/product", adminProductRoutes);

app.use("/product-Variant", adminProductVariantRoutes);

app.use("/product-Attributes", adminProductAttributesRoutes);

app.use("/product-Attributes-Values", adminProductAttributesValuesRoutes);

app.use(
  "/product-Variant-Attribute-Values",
  adminProductVariantAttributeValuesRoutes
);

app.use("/product-Media", adminProductMediaRoutes); //done upto here...

app.use("/product-Media-Url", adminProductMediaUrlRoutes);

app.use("/productById-Details-Page", userProductByIdDetailsPageRoutes);

app.use("/profile", profileRoutes);

app.use("/addresses", addressesRoutes);

app.use("/product-Catalog/product", adminProductRoutes); // Product Catalog Routes

app.use("/cart", cartRoutes);

app.use("/cart-Item", cartItemRoutes);

app.use("/wishList", wishListRoutes);

app.use("/wishList-Item", wishListItemRoutes);

app.use("/coupon-User", userCouponUserRoutes);
app.use("/coupon-Redemption", couponRedemptionRoutes);

app.use("/order", adminOrderRoutes);

app.use("/order-Item", orderItemRoutes);

app.use("/product-Reviews", productReviewRoutes);

app.use("/notifications", adminNotificationRoutes); // Notification Management Routes

export default app;
