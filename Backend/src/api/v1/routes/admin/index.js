import express from "express";

import productRoutes from "./product.route.js";

import categoryRoutes from "./category.route.js";
import couponRoutes from "./coupon.route.js";
import userRoutes from "./user.route.js";
import stockAlertRoutes from "./stockAlert.route.js";
import reviewRoutes from "./review.route.js";
import brandsRoutes from "./brand.routes.js";
import productAttributesRoutes from "./productAttributes.routes.js";
import productAttributesValuesRoutes from "./productAttributesValues.routes.js";
import productVariantRoutes from "./productVariant.routes.js";
import productVariantAttributeValuesRoutes from "./productVariantAttributeValues.routes.js";
import productMediaRoutes from "./productMedia.routes.js";
import productMediaUrlRoutes from "./productMediaUrl.routes.js";
import couponUserRoutes from "./couponUser.routes.js";
import discountRuleRoutes from "./discountRule.routes.js";

const app = express();

app.use("/categories", categoryRoutes);

app.use("/brands", brandsRoutes);

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

app.use("/coupon", couponRoutes);

app.use("/user", userRoutes);

app.use("/coupon-User", couponUserRoutes);

app.use("/discount-Rule", discountRuleRoutes);

app.use("/stock-Alert", stockAlertRoutes);

app.use("/review", reviewRoutes);

export default app;
