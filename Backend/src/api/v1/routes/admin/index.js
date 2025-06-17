import express from "express";

import productRoutes from "./product.route.js";

import categoryRoutes from "./category.route.js";
import couponRoutes from "./coupon.route.js";
import userRoutes from "./user.route.js";
import stockAlertRoutes from "./stockAlert.route.js";
import brandsRoutes from "./brand.routes.js";
import productAttributesRoutes from "./productAttributes.routes.js";
import productAttributesValuesRoutes from "./productAttributesValues.routes.js";
import productVariantRoutes from "./productVariant.routes.js";
import productVariantAttributeValuesRoutes from "./productVariantAttributeValues.routes.js";
import productMediaRoutes from "./productMedia.routes.js";
import productMediaUrlRoutes from "./productMediaUrl.routes.js";
import discountRuleRoutes from "./discountRule.routes.js";
import orderRoutes from "./order.routes.js";
import usersManagmentDashboardDataRoutes from "./userManagmentDashboardData.routes.js";
import adminProductReviewRoutes from "./adminProductReview.routes.js";
import adminDashboardDataRoutes from "./adminDashboardData.routes.js";
import adminProductManagmentDataRoutes from "./adminProductManagmentData.routes.js";
import adminAnalyticsDashboardDataRoutes from "./adminReportsAndAnalyticsData.routes.js";
import adminStockManagementDataRoutes from "./adminStockManagementData.routes.js";
import adminNotificationRoutes from "./adminNotification.routes.js";

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

app.use("/order", orderRoutes);

app.use("/coupon", couponRoutes);

app.use("/users", userRoutes);

app.use("/admin-Dashboard-Data", adminDashboardDataRoutes);

app.use("/product-Management-Dashboard-Data", adminProductManagmentDataRoutes);

app.use("/reports-Analytics-Dashboard-Data", adminAnalyticsDashboardDataRoutes);

app.use("/users-Management-Dashboard-Data", usersManagmentDashboardDataRoutes);

app.use("/discount-Rule", discountRuleRoutes);

app.use("/stock-Alert", stockAlertRoutes);

app.use("/product-Reviews", adminProductReviewRoutes);

app.use("/stock-management", adminStockManagementDataRoutes);

app.use("/notifications", adminNotificationRoutes); // Notification Management Routes

export default app;
