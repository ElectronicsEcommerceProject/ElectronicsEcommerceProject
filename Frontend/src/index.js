import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLogin from "../features/auth/AdminLogin.jsx";
import ForgotPassword from "../features/auth/ForgotPassword.jsx";
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

// Components
import AlertMessage from "../components/Alert/AlertMessage.jsx";

import {
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
} from "../src/api/api.js";
import MESSAGE from "./api/message.js";

//import .env routes
const allUserRoute = import.meta.env.VITE_USER_ENDPOINT;
const orderRoute = import.meta.env.VITE_ORDER_ENDPOINT;
const latestOrderRoute = import.meta.env.VITE_LATEST_ORDER_ENDPOINT;

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
  AlertMessage,
  createApi,
  getApi,
  getApiById,
  updateApi,
  updateApiById,
  MESSAGE,
  allUserRoute,
  orderRoute,
  latestOrderRoute,
};
