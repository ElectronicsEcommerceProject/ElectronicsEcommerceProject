import express from "express";

import authRoutes from "./commonRoutes/auth/auth.route.js";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import retailerRoutes from "./retailer/index.js";
import profileRoutes from "./commonRoutes/profile/profile.route.js";
import addressesRoutes from "./commonRoutes/addresses/addresses.route.js";
import cartRoutes from "./commonRoutes/cart/cart.route.js";
import cartItemRoutes from "./commonRoutes/cart/cartItem.route.js";
import wishListRoutes from "./commonRoutes/wishList/wishList.routes.js";
import wishListItemRoutes from "./commonRoutes/wishList/wishListItem.routes.js";
import orderRoutes from "./commonRoutes/order/order.routes.js";
import orderItemRoutes from "./commonRoutes/order/orderItem.routes.js";
import couponRedemptionRoutes from "./commonRoutes/coupon/couponRedemption.routes.js";
import productReviewRoutes from "./commonRoutes/product/productReview/productReview.routes.js";

const app = express();

app.use("/user/auth", authRoutes);


//this below user routes is for getAllCategory, brands, products, variants, attributes,values...
app.use("/user", adminRoutes)

app.use("/user/profile", profileRoutes);

app.use("/user/addresses", addressesRoutes);

app.use("/user/product-Catalog", adminRoutes);

// app.use("/user/product-variant", adminRoutes);

app.use("/user/cart", cartRoutes);

app.use("/user/cart-Item", cartItemRoutes);

app.use("/user/wishList", wishListRoutes);

app.use("/user/wishList-Item", wishListItemRoutes);

app.use("/user/order", orderRoutes);

app.use("/user/order-Item", orderItemRoutes);

app.use("/user/coupon-Redemption", couponRedemptionRoutes);

app.use("/user/product-Reviews", productReviewRoutes);

app.use("/admin", adminRoutes);

app.use("/customer", customerRoutes);

app.use("/retailer", retailerRoutes);

export default app;
