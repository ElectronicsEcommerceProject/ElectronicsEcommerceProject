import express from "express";

import {
  productRoutes,
  categoryRoutes,
  couponRoutes,
  userRoutes,
  stockAlertRoutes,
  brandsRoutes,
  productAttributesRoutes,
  productAttributesValuesRoutes,
  productVariantRoutes,
  productVariantAttributeValuesRoutes,
  productMediaRoutes,
  productMediaUrlRoutes,
  discountRuleRoutes,
  orderRoutes,
  usersManagmentDashboardDataRoutes,
  adminProductReviewRoutes,
  adminDashboardDataRoutes,
  adminProductManagmentDataRoutes,
  adminAnalyticsDashboardDataRoutes,
  adminStockManagementDataRoutes,
  adminNotificationRoutes,
} from "./adminRoutes.index.js";

const app = express();

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

app.use("/notifications", adminNotificationRoutes); // Notification Management Routes

app.use("/order", orderRoutes);

app.use("/coupon", couponRoutes);

app.use("/users", userRoutes);

app.use("/admin-Dashboard-Data", adminDashboardDataRoutes);

app.use("/product-Management-Dashboard-Data", adminProductManagmentDataRoutes);

app.use("/reports-Analytics-Dashboard-Data", adminAnalyticsDashboardDataRoutes);

app.use("/users-Management-Dashboard-Data", usersManagmentDashboardDataRoutes);

app.use("/discount-Rule", discountRuleRoutes);

app.use("/stock-Alert", stockAlertRoutes);

app.use("/stock-management", adminStockManagementDataRoutes);

app.use("/product-Reviews", adminProductReviewRoutes);

export default app;
