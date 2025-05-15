import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

// External Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Auth
import AuthService from '../features/auth/authService';
import AuthSlice from '../features/auth/authSlice';
import AdminLogin from '../features/auth/AdminLogin';
import ForgotPassword from "../features/auth/ForgotPassword"; 
import LoginForm from "../features/auth/LoginForm";
import OtpVerification from '../features/auth/OtpVerification';
import SignupForm from "../features/auth/SignupForm";

// Cart
import CartSlice from '../features/cart/CartSlice';
import CartUtils from '../features/cart/CartUtils';
 
// UI and Common
import UiSlice from '../features/common/UiSlice';
import UserSlice from '../features/common/userSlice';
 
// Customer
import CustomerDashboard from '../features/customer/Dashboard/CustomerDashboard';
import CustomerMenu from '../features/customer/Dashboard/CustomerMenu';
import AddressList  from '../features/customer/Addresses/AddressList';
import CustomerLogout from '../features/customer/Logout/CustomerLogout';
 import CustomerAlert from "../features/customer/CustomerAlert/CustomerAlert";
import CustomerOrderList from '../features/customer/Orders/CustomerOrderList';
import PrivacySettings from '../features/customer/Privacy/PrivacySettings';
import ProfilePage from '../features/customer/Profile/ProfilePage';
import ProfilePageService from '../features/customer/Profile/ProfilePageService';
import SavedCards from "../features/customer/SavedCards/SavedCards";





// Order
import OrderService from "../features/Order/OrderService";
import OrderSlice   from "../features/Order/OrderSlice";
import UseOrderPlacer from '../features/Order/UseOrderPlacer';

// Payment
import PaymentService from '../features/Payment/PaymentService';
import PaymentSlice from '../features/Payment/PaymentSlice';
 import RazorpayButton from '../features/Payment/RazorpayButton'; 

// Product
import ProductService from "../features/Product/ProductService";

// Retailer

import RetailerDashboard from "../features/retailer/Dashboard/RetailerDashboard";
import RetailerMenu from "../features/retailer/Dashboard/RetailerMenu";

///// Logout
import RetailerLogout from "../features/retailer/Logout/RetailerLogout";

//Orders
import  RetailerOrderList from "../features/retailer/Orders/RetailerOrderList";

//AdminHooks
import useProducts from './AdminHooks/UseProduct';


//***************************************************************************************************** */

//Ordermanagement
import CustomModal from '../components/OrderManagement/CustomModal';
import FiltersSection from '../components/OrderManagement/FilterSection';
import Header from '../components/OrderManagement/Header';
import ManualOrderModal from '../components/OrderManagement/ManualOrderModal';
import MetricsSection from '../components/OrderManagement/MetricsSection';
import Notifications from '../components/OrderManagement/Notifications';
import OrderDetailModal from '../components/OrderManagement/OrderDetailModal';
import OrdersTable from '../components/OrderManagement/OrdersTable';    
import QuickActions from '../components/OrderManagement/QuickActions';




//Product
import ShowProductDescription from '../components/ProductCard/ShowProductDescription';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductCardService from '../components/ProductCard/ProductCardService';
import Store from "../components/Redux/Store";
import ProductSlice from "../components/Redux/ProductSlice";
import SearchSlice    from "../components/Redux/SearchSlice";
 
// Admin
import AdminDashboard from '../features/admin/Dashboard/AdminDashboard';
import AdminSlidebar from '../features/admin/Dashboard/AdminSidebar';
import AnalyticsDashboard from '../features/admin/AnalyticManagement/AnalyticDashboard';
import CoupanDashboard from '../features/admin/CouponManagement/CouponDashboard';
import NotificationPage from '../features/admin/NotificationManagement/NotificationPage';
import OrderDashboard from "../features/admin/OrderDashboard/OrderDashboard";
import ReviewDashboard from '../features/admin/ReviewManagement/ReviewDashboard';
import UserDashboard from '../features/admin/UserManagement/UserDashboard';
import UserProfileView from '../features/admin/UserManagement/UserProfileView';

// Components
import AlertMessage from "../components/Alert/AlertMessage";
import AlertService from '../components/Alert/AlertService';
import AlertSlice from '../components/Alert/AlertSlice';
import CustomerCartSummary  from "../components/CartSummary/CustomerCartSummary";
import RetailerCartSummary from "../components/CartSummary/RetailerCartSummary";
import Footer from "../components/Footer/Footer";
import CustomerHeader from "../components/Header/CustomerHeader";
import Layout from "../components/Layout/Layout";
 import Navbar from "../components/Navbar";
 import SearchBar from "../components/SearchBar";
import Spinner from "../components/Loader/Spinner";
import StockAlerts from "../components/StockAlerts";

// // Pages
// import CartPage from "../pages/CartPage";
// import CheckoutPage from "../pages/CheckoutPage";
// import HomePage from "../pages/HomePage";
// import NotFoundPage from "../pages/NotFoundPage";
// import ProductPage from "../pages/ProductPage";

// Review
 import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
 

// Wishlist
import Wishlist from "../components/Wishlist";

// AddCoupon
import AddCoupon from '../components/AddCoupon';
 

// Other Features
  import Cart from "../components/ShowAllCartItems/Cart";
import CartService from '../components/ShowAllCartItems/CartService';
   import ShowAllCategory from '../components/ShowAllCategory/ShowAllCategory';
import ShowAllCategoryService from '../components/ShowAllCategory/ShowAllCategoryService';
   





export { 
    FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, 
    AuthService, AuthSlice, AdminLogin, ForgotPassword, LoginForm, OtpVerification, SignupForm, 
    CartSlice, CartUtils, CartService, 
    UiSlice, UserSlice,
    CustomerDashboard, CustomerMenu, AddressList, CustomerLogout, CustomerAlert, CustomerOrderList, PrivacySettings, ProfilePage, ProfilePageService, SavedCards, 
    OrderService, OrderSlice, UseOrderPlacer, 
    PaymentService, PaymentSlice, RazorpayButton, 
    ProductService, 
    RetailerDashboard, RetailerMenu, RetailerLogout, RetailerOrderList, 
    useProducts, 
    CustomModal, FiltersSection, Header, ManualOrderModal, MetricsSection, Notifications, OrderDetailModal, OrdersTable, QuickActions, 
    ProductCard, ProductCardService, ShowProductDescription, 
    Store, ProductSlice, SearchSlice, 
    AdminDashboard, AdminSlidebar, AnalyticsDashboard, CoupanDashboard, NotificationPage, OrderDashboard, ReviewDashboard, UserDashboard, UserProfileView, 
    AlertMessage, AlertService, AlertSlice, CustomerCartSummary, RetailerCartSummary, Footer, CustomerHeader, Layout, Navbar, SearchBar, Spinner, StockAlerts, 
     
    ReviewForm, ReviewList, 
    Wishlist, 
    AddCoupon, 
    Cart, ShowAllCategory, ShowAllCategoryService 
  };
  