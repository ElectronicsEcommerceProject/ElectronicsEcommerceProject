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

// Export all route modules
export {
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
};
