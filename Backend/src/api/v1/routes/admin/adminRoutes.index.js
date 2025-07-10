import express from "express";

import adminProductRoutes from "./adminProduct.route.js";
import adminCategoryRoutes from "./adminCategory.route.js";
import adminCouponRoutes from "./adminCoupon.route.js";
import adminUserRoutes from "./adminUser.route.js";
import adminStockAlertRoutes from "./adminStockAlert.route.js";
import adminBrandsRoutes from "./adminBrand.routes.js";
import adminProductAttributesRoutes from "./adminProductAttributes.routes.js";
import adminProductAttributesValuesRoutes from "./adminProductAttributesValues.routes.js";
import adminProductVariantRoutes from "./adminProductVariant.routes.js";
import adminProductVariantAttributeValuesRoutes from "./adminProductVariantAttributeValues.routes.js";
import adminProductMediaRoutes from "./adminProductMedia.routes.js";
import adminProductMediaUrlRoutes from "./adminProductMediaUrl.routes.js";
import adminDiscountRuleRoutes from "./adminDiscountRule.routes.js";
import adminOrderRoutes from "./adminOrder.routes.js";
import adminUsersManagmentDashboardDataRoutes from "./adminUserManagmentDashboardData.routes.js";
import adminProductReviewRoutes from "./adminProductReview.routes.js";
import adminDashboardDataRoutes from "./adminDashboardData.routes.js";
import adminProductManagmentDataRoutes from "./adminProductManagmentData.routes.js";
import adminAnalyticsDashboardDataRoutes from "./adminReportsAndAnalyticsData.routes.js";
import adminStockManagementDataRoutes from "./adminStockManagementData.routes.js";
import adminNotificationRoutes from "./adminNotification.routes.js";
import adminBannerRoutes from "./adminBanner.routes.js";

// Export all route modules
export {
  //export all above routes
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
  adminProductMediaUrlRoutes,
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
};
