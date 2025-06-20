import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// import AdminLogin from "../features/auth/AdminLogin.jsx";
// import ForgotPassword from "../features/auth/ForgotPassword.jsx";

//***************************************************************************************************** */

// Admin
import AdminDashboard from "../features/admin/Dashboard/AdminDashboard.jsx";
import AdminSlidebar from "../features/admin/Dashboard/AdminSidebar.jsx";
import AnalyticsDashboard from "../features/admin/AnalyticManagement/AnalyticDashboard.jsx";
import CoupanDashboard from "../features/admin/CouponManagement/CouponDashboard.jsx";
import NotificationPage from "../features/admin/NotificationManagement/NotificationPage.jsx";
import OrderDashboard from "../features/admin/OrderDashboard/OrderDashboard.jsx";
import ReviewDashboard from "../features/admin/ReviewManagement/ReviewDashboard.jsx";
import UserDashboard from "../features/admin/UserManagement/UserDashboard.jsx";
import UserProfileView from "../features/admin/UserManagement/UserProfileView.jsx";
import AdminLogin from "../features/admin/AdminLayout/AdminLogin.jsx";
import ForgotPassword from "../features/admin/AdminLayout/ForgotPassword.jsx";
import ProductDashboard from "../features/admin/ProductManagement/ProductDashboard.jsx";
import ProductForm from "../features/admin/ProductManagement/ProductForm.jsx";
import AdminLayout from "../features/admin/AdminLayout/AdminLayout.jsx";
import StockManagement from "../features/admin/StockManagement/StockManagement.jsx";

// Components
import AlertMessage from "../components/Alert/AlertMessage.jsx";
import AddressForm from "../components/AddressForm/AddressForm.jsx";
import UserNotification from "../components/UserNotification/UserNotification.jsx";

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

//import .env routes
const adminDashboardDataRoute = import.meta.env
  .VITE_ADMIN_DASHBOARD_DATA_ENDPOINT;

const adminProductManagementDashboardDataRoute = import.meta.env
  .VITE_PRODUCT_MANAGMENT_DASHBOARD_DATA_ENDPOINT;

const allUserRoute = import.meta.env.VITE_USER_ENDPOINT;
const allCustomerRoute = import.meta.env.VITE_CUSTOMER_ENDPOINT;
const allRetailerRoute = import.meta.env.VITE_RETAILER_ENDPOINT;

// Cart endpoints
const cartRoute = import.meta.env.VITE_CART_ENDPOINT;
const cartItemRoute = import.meta.env.VITE_CART_ITEM_ENDPOINT;
const cartItemFindOrCreateRoute = import.meta.env
  .VITE_CART_ITEM_FIND_OR_CREATE_ENDPOINT;
const totalCartItemNumberRoute = import.meta.env
  .VITE_TOTAL_CART_ITEM_NUMBER_ENDPOINT;

const orderRoute = import.meta.env.VITE_ORDER_ENDPOINT;
const orderItemRoute = import.meta.env.VITE_ORDER_ITEM_ENDPOINT;

const latestOrderRoute = import.meta.env.VITE_LATEST_ORDER_ENDPOINT;
const userManagmentDashboardDataRoute = import.meta.env
  .VITE_USER_MANAGMENT_DASHBOARD_DATA_ENDPOINT;

const userManagmentDashboardUsersOrdersDataRoute = import.meta.env
  .VITE_USER_MANAGMENT_DASHBOARD_USER_ORDERS_DATA_ENDPOINT;

const reviewManagmentDashboardDataRoute = import.meta.env
  .VITE_REVIEW_MANAGMENT_DASHBOARD_DATA_ENDPOINT;

const reviewChangeStatusRoute = import.meta.env
  .VITE_REVIEW_CHANGE_STATUS_ENDPOINT;

const deleteReviewByProductReviewIdRoute = import.meta.env
  .VITE_DELETE_REVIEW_BY_PRODUCT_REVIEW_ID_ENDPOINT;

const updateProductReviewByIdRoute = import.meta.env
  .VITE_UPDATE_PRODUCT_REVIEW_BY_ID_ENDPOINT;

const reviewManagmentAnalyticsDataRoute = import.meta.env
  .VITE_REVIEW_MANAGMENT_ANALYTICS_DASHBOARD_DATA_ENDPOINT;

const couponAndOffersDashboardDataRoute = import.meta.env
  .VITE_COUPON_AND_OFFERS_DASHBOARD_DATA_ENDPOINT;

const couponAndOffersDashboardChangeStatusRoute = import.meta.env
  .VITE_COUPON_AND_OFFERS_DASHBOARD_CHANGE_COUPON_STATUS_ENDPOINT;

const getAllProductsRoute = import.meta.env.VITE_PRODUCT_ENDPOINT;
const getAllCategoryRoute = import.meta.env.VITE_CATEGORIES_ENDPOINT;
const getAllBrandsRoute = import.meta.env.VITE_BRANDS_ENDPOINT;
const getBrandsByCategoryRoute = import.meta.env.VITE_BRANDS_ENDPOINT; // Will use with getApiById
const getProductsByBrandRoute = import.meta.env.VITE_PRODUCT_BY_BRAND_ENDPOINT;

const adminProductCatalogByCategoryAndBrandIdRoute = import.meta.env
  .VITE_ADMIN_PRODUCT_CATALOG_BY_CATEGORY_AND_BRAND_ID_ENDPOINT;

const productVariantByProductIdRoute = import.meta.env
  .VITE_PRODUCT_VARIANT_BY_PRODUCT_ID_ENDPOINT;

const couponAndOffersDashboardAnalyticsDataRoute = import.meta.env
  .VITE_COUPON_AND_OFFERS_DASHBOARD_ANALYTICS_DATA_ENDPOINT;

const adminReportsAnalyticsDashboardDataRoute = import.meta.env
  .VITE_ADMIN_REPORT_ANALYTICS_DASHBOARD_DATA_ENDPOINT;

const adminReportsAnalyticsProductsDataRoute = import.meta.env
  .VITE_ADMIN_REPORT_ANALYTICS_PRODUCTS_DATA_ENDPOINT;

const adminReportsAnalyticsCouponsDataRoute = import.meta.env
  .VITE_ADMIN_REPORT_ANALYTICS_COUPONS_DATA_ENDPOINT;

// Stock Management Routes
const stockManagementVariantsRoute = import.meta.env
  .VITE_STOCK_MANAGEMENT_VARIANTS_ENDPOINT;
const stockManagementVariantByIdRoute = import.meta.env
  .VITE_STOCK_MANAGEMENT_VARIANT_BY_ID_ENDPOINT;
const stockManagementAnalyticsRoute = import.meta.env
  .VITE_STOCK_MANAGEMENT_ANALYTICS_ENDPOINT;

// Notification Management Routes
const adminNotificationRoute = import.meta.env.VITE_ADMIN_NOTIFICATION_ENDPOINT;
const adminNotificationAddRoute = import.meta.env
  .VITE_ADMIN_NOTIFICATION_ADD_ENDPOINT;
const adminNotificationLogsRoute = import.meta.env
  .VITE_ADMIN_NOTIFICATION_LOGS_ENDPOINT;
const adminNotificationStatsRoute = import.meta.env
  .VITE_ADMIN_NOTIFICATION_STATS_ENDPOINT;
const adminNotificationTemplatesRoute = import.meta.env
  .VITE_ADMIN_NOTIFICATION_TEMPLATES_ENDPOINT;

const userNotificationRoute = import.meta.env.VITE_USER_NOTIFICATION_ENDPOINT;
const userTotalNumberOfUnReadNotificationsRoute = import.meta.env
  .VITE_USER_TOTAL_NUMBER_OF_UNREAD_NOTIFICATIONS_ENDPOINT;

//user Panel Routes

const userPanelLoginRoute = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT;
const userPanelRegisterRoute = import.meta.env.VITE_AUTH_SIGNUP_ENDPOINT;
const userPanelProductByIdDetailsRoute = import.meta.env
  .VITE_USER_PRODUCT_BY_ID_DETAILS_ENDPOINT;
const userPanelForgotPasswordRoute = import.meta.env
  .VITE_USER_FORGOT_PASSWORD_ENDPOINT;
const resetPasswordRoute = import.meta.env.VITE_RESET_PASSWORD_ENDPOINT;

const userAddressesRoute = import.meta.env.VITE_ADDRESSES_ENDPOINT;
const userProfileRoute = import.meta.env.VITE_PROFILE_ENDPOINT;

//user coupon realted routes
const userCouponUserRoute = import.meta.env.VITE_USER_COUPON_ENDPOINT;

// user review related routes
const userProductReviewRoute = import.meta.env.VITE_PRODUCT_REVIEW_ENDPOINT;

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
  latestOrderRoute,
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
  stockManagementVariantsRoute,
  stockManagementVariantByIdRoute,
  stockManagementAnalyticsRoute,
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
};
