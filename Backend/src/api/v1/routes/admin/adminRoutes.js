import express from "express";

import {
  adminProductRoutes,
  adminCategoryRoutes,
  adminCouponRoutes,
  adminUserRoutes,
  adminStockAlertRoutes,
  adminBrandsRoutes,
  adminProductAttributesRoutes,
  adminProductAttributesValuesRoutes,
  adminProductVariantRoutes,
  adminProductVariantAttributeValuesRoutes,
  adminProductMediaRoutes,
  adminproductMediaUrlRoutes,
  adminDiscountRuleRoutes,
  adminOrderRoutes,
  adminUsersManagmentDashboardDataRoutes,
  adminProductReviewRoutes,
  adminDashboardDataRoutes,
  adminProductManagmentDataRoutes,
  adminAnalyticsDashboardDataRoutes,
  adminStockManagementDataRoutes,
  adminNotificationRoutes,
  adminBannerRoutes,
} from "./adminRoutes.index.js";

const app = express();

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

app.use("/product-Media-Url", adminproductMediaUrlRoutes);

app.use("/notifications", adminNotificationRoutes); // Notification Management Routes

app.use("/order", adminOrderRoutes);

app.use("/order-Item", adminOrderRoutes);

app.use("/coupon", adminCouponRoutes);

app.use("/users", adminUserRoutes);

app.use("/admin-Dashboard-Data", adminDashboardDataRoutes);

app.use("/product-Management-Dashboard-Data", adminProductManagmentDataRoutes);

app.use("/reports-Analytics-Dashboard-Data", adminAnalyticsDashboardDataRoutes);

app.use(
  "/users-Management-Dashboard-Data",
  adminUsersManagmentDashboardDataRoutes
);

app.use("/discount-Rule", adminDiscountRuleRoutes);

app.use("/stock-Alert", adminStockAlertRoutes);

app.use("/stock-management", adminStockManagementDataRoutes);

app.use("/product-Reviews", adminProductReviewRoutes);

app.use("/banners", adminBannerRoutes);

export default app;
