import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// import AdminLogin from "../features/auth/AdminLogin.jsx";
// import ForgotPassword from "../features/auth/ForgotPassword.jsx";
import LoginForm from "../features/auth/LoginForm.jsx";
import SignupForm from "../features/auth/SignupForm.jsx";

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

// Components
import AlertMessage from "../components/Alert/AlertMessage.jsx";

import {
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
} from "../src/api/api.js";
import MESSAGE from "./api/message.js";

//import .env routes
const allUserRoute = import.meta.env.VITE_USER_ENDPOINT;
const orderRoute = import.meta.env.VITE_ORDER_ENDPOINT;
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

const couponAndOffersDashboardAnalyticsDataRoute = import.meta.env
  .VITE_COUPON_AND_OFFERS_DASHBOARD_ANALYTICS_DATA_ENDPOINT;

export {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  AdminLogin,
  ForgotPassword,
  LoginForm,
  SignupForm,
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
  AlertMessage,
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  deleteApi,
  deleteApiById,
  MESSAGE,
  allUserRoute,
  orderRoute,
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
  couponAndOffersDashboardAnalyticsDataRoute,
};
