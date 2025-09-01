import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Features
import {
  Dashboard as AdminDashboard,
  AdminSidebar as AdminSlidebar,
  AnalyticsDashboard,
  CouponsOffers as CoupanDashboard,
  NotificationPage,
  OrderManagement as OrderDashboard,
  ReviewManagement as ReviewDashboard,
  UserManagement as UserDashboard,
  UserProfileView,
  AdminLogin,
  ForgotPassword,
  ProductManagement as ProductDashboard,
  ProductForm,
  AdminLayout,
  StockManagement,
} from "../features/index.js";

// Components
import {
  AlertMessage,
  AddressForm,
  UserNotification,
} from "../components/index.js";

import {
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
  deleteApiByCondition,
} from "../src/api/api.js";
import MESSAGE from "./api/message.js";
import {
  getUserFromToken,
  getUserIdFromToken,
  isAuthenticated,
  getUserRole,
} from "./utils/auth.js";

// Import URL constants from config
import {
  ADMIN_DASHBOARD_DATA_ENDPOINT as adminDashboardDataRoute,
  PRODUCT_MANAGMENT_DASHBOARD_DATA_ENDPOINT as adminProductManagementDashboardDataRoute,
  ADMIN_BANNER_ENDPOINT as adminBannerRoute,
  USER_BANNER_ENDPOINT as userBannerRoute,
  USER_ENDPOINT as allUserRoute,
  CUSTOMER_ENDPOINT as allCustomerRoute,
  RETAILER_ENDPOINT as allRetailerRoute,
  CART_ENDPOINT as cartRoute,
  CART_ITEM_ENDPOINT as cartItemRoute,
  CART_ITEM_FIND_OR_CREATE_ENDPOINT as cartItemFindOrCreateRoute,
  TOTAL_CART_ITEM_NUMBER_ENDPOINT as totalCartItemNumberRoute,
  ORDER_ENDPOINT as orderRoute,
  ORDER_CANCEL_ENDPOINT as cancelOrderRoute,
  ORDER_ITEM_ENDPOINT as orderItemRoute,
  ORDER_ITEM_ORDER_ID_ENDPOINT as orderItemByOrderIdRoute,
  LATEST_ORDER_ENDPOINT as latestOrderRoute,
  USER_MANAGMENT_DASHBOARD_DATA_ENDPOINT as userManagmentDashboardDataRoute,
  USER_MANAGMENT_DASHBOARD_USER_ORDERS_DATA_ENDPOINT as userManagmentDashboardUsersOrdersDataRoute,
  REVIEW_MANAGMENT_DASHBOARD_DATA_ENDPOINT as reviewManagmentDashboardDataRoute,
  REVIEW_CHANGE_STATUS_ENDPOINT as reviewChangeStatusRoute,
  DELETE_REVIEW_BY_PRODUCT_REVIEW_ID_ENDPOINT as deleteReviewByProductReviewIdRoute,
  UPDATE_PRODUCT_REVIEW_BY_ID_ENDPOINT as updateProductReviewByIdRoute,
  REVIEW_MANAGMENT_ANALYTICS_DASHBOARD_DATA_ENDPOINT as reviewManagmentAnalyticsDataRoute,
  COUPON_AND_OFFERS_DASHBOARD_DATA_ENDPOINT as couponAndOffersDashboardDataRoute,
  COUPON_AND_OFFERS_DASHBOARD_CHANGE_COUPON_STATUS_ENDPOINT as couponAndOffersDashboardChangeStatusRoute,
  PRODUCT_ENDPOINT as getAllProductsRoute,
  CATEGORIES_ENDPOINT as getAllCategoryRoute,
  BRANDS_ENDPOINT as getAllBrandsRoute,
  BRANDS_ENDPOINT as getBrandsByCategoryRoute,
  PRODUCT_BY_BRAND_ENDPOINT as getProductsByBrandRoute,
  ADMIN_PRODUCT_CATALOG_BY_CATEGORY_AND_BRAND_ID_ENDPOINT as adminProductCatalogByCategoryAndBrandIdRoute,
  PRODUCT_VARIANT_BY_PRODUCT_ID_ENDPOINT as productVariantByProductIdRoute,
  COUPON_AND_OFFERS_DASHBOARD_ANALYTICS_DATA_ENDPOINT as couponAndOffersDashboardAnalyticsDataRoute,
  ADMIN_REPORT_ANALYTICS_DASHBOARD_DATA_ENDPOINT as adminReportsAnalyticsDashboardDataRoute,
  ADMIN_REPORT_ANALYTICS_PRODUCTS_DATA_ENDPOINT as adminReportsAnalyticsProductsDataRoute,
  ADMIN_REPORT_ANALYTICS_COUPONS_DATA_ENDPOINT as adminReportsAnalyticsCouponsDataRoute,
  STOCK_MANAGEMENT_VARIANTS_ENDPOINT as adminStockManagementVariantsRoute,
  STOCK_MANAGEMENT_VARIANT_BY_ID_ENDPOINT as adminStockManagementVariantByIdRoute,
  STOCK_MANAGEMENT_ANALYTICS_ENDPOINT as adminStockManagementAnalyticsRoute,
  ADMIN_NOTIFICATION_ENDPOINT as adminNotificationRoute,
  ADMIN_NOTIFICATION_ADD_ENDPOINT as adminNotificationAddRoute,
  ADMIN_NOTIFICATION_LOGS_ENDPOINT as adminNotificationLogsRoute,
  ADMIN_NOTIFICATION_STATS_ENDPOINT as adminNotificationStatsRoute,
  ADMIN_NOTIFICATION_TEMPLATES_ENDPOINT as adminNotificationTemplatesRoute,
  USER_NOTIFICATION_ENDPOINT as userNotificationRoute,
  USER_TOTAL_NUMBER_OF_UNREAD_NOTIFICATIONS_ENDPOINT as userTotalNumberOfUnReadNotificationsRoute,
  AUTH_LOGIN_ENDPOINT as userPanelLoginRoute,
  AUTH_SIGNUP_ENDPOINT as userPanelRegisterRoute,
  USER_PRODUCT_BY_ID_DETAILS_ENDPOINT as userPanelProductByIdDetailsRoute,
  USER_FORGOT_PASSWORD_ENDPOINT as userPanelForgotPasswordRoute,
  RESET_PASSWORD_ENDPOINT as resetPasswordRoute,
  ADDRESSES_ENDPOINT as userAddressesRoute,
  PROFILE_ENDPOINT as userProfileRoute,
  USER_DASHBOARD_DATA_ENDPOINT as userDashboardDataRoute,
  PRODUCT_BY_CATEGORY_ENDPOINT as userProductsByCategoryId,
  USER_COUPON_ENDPOINT as userCouponUserRoute,
  PRODUCT_REVIEW_ENDPOINT as userProductReviewRoute,
} from "./urls/config.urls.js";

export {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  AdminLogin,
  ForgotPassword,
  AdminDashboard,
  AdminSlidebar,
  AnalyticsDashboard,
  CoupanDashboard,
  NotificationPage,
  OrderDashboard,
  ReviewDashboard,
  UserDashboard,
  UserProfileView,
  ProductDashboard,
  ProductForm,
  AdminLayout,
  StockManagement,
  AlertMessage,
  AddressForm,
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
  deleteApiByCondition,
  MESSAGE,
  adminDashboardDataRoute,
  adminProductManagementDashboardDataRoute,
  allUserRoute,
  allCustomerRoute,
  allRetailerRoute,
  orderRoute,
  orderItemRoute,
  orderItemByOrderIdRoute,
  latestOrderRoute,
  cancelOrderRoute,
  userManagmentDashboardDataRoute,
  userManagmentDashboardUsersOrdersDataRoute,
  reviewManagmentDashboardDataRoute,
  reviewChangeStatusRoute,
  deleteReviewByProductReviewIdRoute,
  updateProductReviewByIdRoute,
  reviewManagmentAnalyticsDataRoute,
  couponAndOffersDashboardDataRoute,
  couponAndOffersDashboardChangeStatusRoute,
  getAllCategoryRoute,
  getAllProductsRoute,
  getAllBrandsRoute,
  getBrandsByCategoryRoute,
  getProductsByBrandRoute,
  adminProductCatalogByCategoryAndBrandIdRoute,
  productVariantByProductIdRoute,
  couponAndOffersDashboardAnalyticsDataRoute,
  adminReportsAnalyticsDashboardDataRoute,
  adminReportsAnalyticsProductsDataRoute,
  adminReportsAnalyticsCouponsDataRoute,
  adminStockManagementVariantsRoute,
  adminStockManagementVariantByIdRoute,
  adminStockManagementAnalyticsRoute,
  adminNotificationRoute,
  adminNotificationAddRoute,
  adminNotificationLogsRoute,
  adminNotificationStatsRoute,
  adminNotificationTemplatesRoute,
  userNotificationRoute,
  userTotalNumberOfUnReadNotificationsRoute,

  //User Panel Routes
  userPanelLoginRoute,
  userPanelRegisterRoute,
  userPanelProductByIdDetailsRoute,
  userAddressesRoute,
  userDashboardDataRoute,
  userProductsByCategoryId,

  //Auth Routes
  userPanelForgotPasswordRoute,
  resetPasswordRoute,

  //profile Routes
  userProfileRoute,

  // Cart Routes
  cartRoute,
  cartItemRoute,
  cartItemFindOrCreateRoute,
  totalCartItemNumberRoute,

  //coupon related routes
  userCouponUserRoute,

  // Auth utilities
  getUserFromToken,
  getUserIdFromToken,
  isAuthenticated,
  getUserRole,

  //user review
  userProductReviewRoute,

  //components
  UserNotification,

  //Banner routes
  adminBannerRoute,
  userBannerRoute,
};
