import express from "express";

import productRoutes from "./product.route.js";
import orderRoutes from "./order.route.js";
import profileRoutes from "./profile.route.js";
import categoryRoutes from "./category.route.js";
import couponRoutes from "./coupon.route.js";
import userRoutes from "./user.route.js";
import stockAlertRoutes from "./stockAlert.route.js";
import reviewRoutes from "./review.route.js";
import brandsRoutes from "./brand.routes.js";
import ProductTypesRoutes from "./productTypes.routes.js";
import productAttributesRoutes from "./productAttributes.routes.js";
import productAttributesValuesRoutes from "./productAttributesValues.routes.js";
import productVariantRoutes from "./productVariant.routes.js";
import productMediaRoutes from "./productMedia.routes.js";

const app = express();

app.use("/category", categoryRoutes);

app.use("/brands", brandsRoutes);

app.use("/product-Types", ProductTypesRoutes);

app.use("/product-Attributes", productAttributesRoutes);

app.use("/product-Attributes-Values", productAttributesValuesRoutes);

app.use("/product", productRoutes);

app.use("/product-Variant", productVariantRoutes);

app.use("/product-Media", productMediaRoutes); //done upto here...

app.use("/order", orderRoutes);

app.use("/profile", profileRoutes);

app.use("/coupon", couponRoutes);

app.use("/user", userRoutes);

app.use("/stock-alert", stockAlertRoutes);

app.use("/review", reviewRoutes);

export default app;
