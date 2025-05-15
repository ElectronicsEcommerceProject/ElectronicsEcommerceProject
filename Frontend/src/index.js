import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Auth
// import AuthService from "../features/auth/authService";
// import AuthSlice from "../features/auth/authSlice";
import AdminLogin from "../features/auth/AdminLogin.jsx";
import ForgotPassword from "../features/auth/ForgotPassword.jsx";
import LoginForm from "../features/auth/LoginForm.jsx";
import OtpVerification from "../features/auth/OtpVerification.jsx";
import SignupForm from "../features/auth/SignupForm.jsx";

// Cart
// import CartSlice from "../features/cart/CartSlice";
// import CartUtils from "../features/cart/CartUtils";

// UI and Common
// import UiSlice from "../features/common/UiSlice";
// import UserSlice from "../features/common/userSlice";

// Customer
import CustomerDashboard from "../features/customer/Dashboard/CustomerDashboard.jsx";
import CustomerMenu from "../features/customer/Dashboard/CustomerMenu.jsx";
import AddressList from "../features/customer/Addresses/AddressList.jsx";
import CustomerLogout from "../features/customer/Logout/CustomerLogout.jsx";
import CustomerAlert from "../features/customer/CustomerAlert/CustomerAlert.jsx";
import CustomerOrderList from "../features/customer/Orders/CustomerOrderList.jsx";
import PrivacySettings from "../features/customer/Privacy/PrivacySettings.jsx";
import ProfilePage from "../features/customer/Profile/ProfilePage.jsx";
import ProfilePageService from "../features/customer/Profile/ProfilePageService";
import SavedCards from "../features/customer/SavedCards/SavedCards.jsx";

// Order
// import OrderService from "../features/Order/OrderService";
// import OrderSlice from "../features/Order/OrderSlice";
// import UseOrderPlacer from "../features/Order/UseOrderPlacer";

// Payment
// import PaymentService from "../features/Payment/PaymentService";
// import PaymentSlice from "../features/Payment/PaymentSlice";
import RazorpayButton from "../features/Payment/RazorpayButton.jsx";

// Product
// import ProductService from "../features/Product/ProductService";

// Retailer

import RetailerDashboard from "../features/retailer/Dashboard/RetailerDashboard.jsx";
import RetailerMenu from "../features/retailer/Dashboard/RetailerMenu.jsx";

///// Logout
import RetailerLogout from "../features/retailer/Logout/RetailerLogout.jsx";

//Orders
import RetailerOrderList from "../features/retailer/Orders/RetailerOrderList.jsx";

//AdminHooks
// import useProducts from "./AdminHooks/UseProduct";

//***************************************************************************************************** */

//Ordermanagement
import CustomModal from "../components/OrderManagement/CustomModal.jsx";
import FiltersSection from "../components/OrderManagement/FilterSection.jsx";
import Header from "../components/OrderManagement/Header.jsx";
import ManualOrderModal from "../components/OrderManagement/ManualOrderModal.jsx";
import MetricsSection from "../components/OrderManagement/MetricsSection.jsx";
import Notifications from "../components/OrderManagement/Notifications.jsx";
import OrderDetailModal from "../components/OrderManagement/OrderDetailModal.jsx";
import OrdersTable from "../components/OrderManagement/OrdersTable.jsx";
import QuickActions from "../components/OrderManagement/QuickActions.jsx";

//Product
import ShowProductDescription from "../components/ProductCard/ShowProductDescription.jsx";
import ProductCard from "../components/ProductCard/ProductCard.jsx";
// import ProductCardService from "../components/ProductCard/ProductCardService";
// import Store from "../components/Redux/Store";
// import ProductSlice from "../components/Redux/ProductSlice";
// import SearchSlice from "../components/Redux/SearchSlice";

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
import AlertService from "../components/Alert/AlertService";
import AlertSlice from "../components/Alert/AlertSlice";
import CustomerCartSummary from "../components/CartSummary/CustomerCartSummary.jsx";
import RetailerCartSummary from "../components/CartSummary/RetailerCartSummary.jsx";
import Footer from "../components/Footer/Footer.jsx";
import CustomerHeader from "../components/Header/CustomerHeader.jsx";
import Layout from "../components/Layout/Layout.jsx";
import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Spinner from "../components/Loader/Spinner.jsx";
import StockAlerts from "../components/StockAlerts.jsx";

// // Pages
// import CartPage from "../pages/CartPage";
// import CheckoutPage from "../pages/CheckoutPage";
// import HomePage from "../pages/HomePage";
// import NotFoundPage from "../pages/NotFoundPage";
// import ProductPage from "../pages/ProductPage";

// Review
import ReviewForm from "../components/ReviewForm.jsx";
import ReviewList from "../components/ReviewList.jsx";

// Wishlist
import Wishlist from "../components/Wishlist.jsx";

// AddCoupon
import AddCoupon from "../components/AddCoupon.jsx";

// Other Features
import Cart from "../components/ShowAllCartItems/Cart.jsx";
// import CartService from "../components/ShowAllCartItems/CartService";
import ShowAllCategory from "../components/ShowAllCategory/ShowAllCategory.jsx";
// import ShowAllCategoryService from "../components/ShowAllCategory/ShowAllCategoryService";

export {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  // AuthService,
  // AuthSlice,
  AdminLogin,
  ForgotPassword,
  LoginForm,
  OtpVerification,
  SignupForm,
  // CartSlice,
  // CartUtils,
  // CartService,
  // UiSlice,
  // UserSlice,
  CustomerDashboard,
  CustomerMenu,
  AddressList,
  CustomerLogout,
  CustomerAlert,
  CustomerOrderList,
  PrivacySettings,
  ProfilePage,
  ProfilePageService,
  SavedCards,
  // OrderService,
  // OrderSlice,
  // UseOrderPlacer,
  // PaymentService,
  // PaymentSlice,
  RazorpayButton,
  // ProductService,
  RetailerDashboard,
  RetailerMenu,
  RetailerLogout,
  RetailerOrderList,
  // useProducts,
  CustomModal,
  FiltersSection,
  Header,
  ManualOrderModal,
  MetricsSection,
  Notifications,
  OrderDetailModal,
  OrdersTable,
  QuickActions,
  ProductCard,
  // ProductCardService,
  ShowProductDescription,
  // Store,
  // ProductSlice,
  // SearchSlice,
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
  AlertService,
  AlertSlice,
  CustomerCartSummary,
  RetailerCartSummary,
  Footer,
  CustomerHeader,
  Layout,
  Navbar,
  SearchBar,
  Spinner,
  StockAlerts,
  ReviewForm,
  ReviewList,
  Wishlist,
  AddCoupon,
  Cart,
  ShowAllCategory,
  // ShowAllCategoryService,
};
