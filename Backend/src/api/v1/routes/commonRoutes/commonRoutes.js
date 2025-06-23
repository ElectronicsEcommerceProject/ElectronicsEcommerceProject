import express from "express";
import {
  authRoutes,
  adminRoutes,
  profileRoutes,
  addressesRoutes,
  cartRoutes,
  cartItemRoutes,
  wishListRoutes,
  wishListItemRoutes,
  orderRoutes,
  orderItemRoutes,
  couponRedemptionRoutes,
  productReviewRoutes,
  userProductByIdDetailsPageRoutes,
  userCouponUserRoutes,
} from "./commonRoutes.index.js";

import {
  productRoutes,
  categoryRoutes,
  brandsRoutes,
  productAttributesRoutes,
  productAttributesValuesRoutes,
  productVariantRoutes,
  productVariantAttributeValuesRoutes,
  productMediaRoutes,
  productMediaUrlRoutes,
  orderRoutes,
  adminNotificationRoutes,
} from "../admin/adminRoutes.index.js";

const app = express();

app.use("/auth", authRoutes);

app.use("/category", categoryRoutes);

app.use("/brand", brandsRoutes);

app.use("/product", productRoutes);

app.use("/product-Variant", productVariantRoutes);

app.use("/product-Attributes", productAttributesRoutes);

app.use("/product-Attributes-Values", productAttributesValuesRoutes);

app.use(
  "/product-Variant-Attribute-Values",
  productVariantAttributeValuesRoutes
);

app.use("/product-Media", productMediaRoutes); //done upto here...

app.use("/product-Media-Url", productMediaUrlRoutes);

app.use("/productById-Details-Page", userProductByIdDetailsPageRoutes);

app.use("/profile", profileRoutes);

app.use("/addresses", addressesRoutes);

app.use("/product-Catalog/product", adminRoutes);

app.use("/cart", cartRoutes);

app.use("/cart-Item", cartItemRoutes);

app.use("/wishList", wishListRoutes);

app.use("/wishList-Item", wishListItemRoutes);

app.use("/coupon-User", userCouponUserRoutes);
app.use("/coupon-Redemption", couponRedemptionRoutes);

app.use("/order", orderRoutes);

app.use("/order-Item", orderItemRoutes);

app.use("/product-Reviews", productReviewRoutes);

app.use("/notifications", adminNotificationRoutes); // Notification Management Routes

export default app;
