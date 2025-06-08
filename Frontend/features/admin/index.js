// External
import React from "react";

// Pages & Features
import Dashboard from "../../features/admin/Dashboard/AdminDashboard.jsx";
import ProductManagement from "../../features/admin/ProductManagement/ProductDashboard.jsx";
import ProductForm from "../../features/admin/ProductManagement/ProductForm.jsx";
import OrderManagement from "../../features/admin/OrderDashboard/OrderDashboard.jsx";
import Header from "../../components/OrderManagement/Header.jsx";
import FiltersSection from "../../components/OrderManagement/FilterSection.jsx";
import MetricsSection from "../../components/OrderManagement/MetricsSection.jsx";
import OrdersTable from "../../components/OrderManagement/OrdersTable.jsx";
import OrderDetailModal from "../../components/OrderManagement/OrderDetailModal.jsx";
import ManualOrderModal from "../../components/OrderManagement/ManualOrderModal.jsx";
import QuickActions from "../../components/OrderManagement/QuickActions.jsx";
import Notifications from "../../components/OrderManagement/Notifications.jsx";
import CustomModal from "../../components/OrderManagement/CustomModal.jsx";
import UserManagement from "../../features/admin/UserManagement/UserDashboard.jsx";
import UserProfileView from "../../features/admin/UserManagement/UserProfileView.jsx";

import ReviewManagement from "../../features/admin/ReviewManagement/ReviewDashboard.jsx";
import CouponsOffers from "../../features/admin/CouponManagement/CouponDashboard.jsx";
import NotificationPage from "../../features/admin/NotificationManagement/NotificationPage.jsx";
import ReportsAnalytics from "../../features/admin/AnalyticManagement/AnalyticDashboard.jsx";
import StockManagement from "../../features/admin/StockManagement/StockManagement.jsx"; //import StockManagement from "../../features/admin/StockManagement/StockDashboard.jsx";
// Layout Components
import AdminHeader from "../../components/Header/AdminHeader.jsx";

// Export all for global use
export {
  Dashboard,
  ProductManagement,
  ProductForm,
  OrderManagement,
  Header,
  FiltersSection,
  MetricsSection,
  OrderDetailModal,
  OrdersTable,
  ManualOrderModal,
  QuickActions,
  CustomModal,
  UserManagement,
  UserProfileView,
  ReviewManagement,
  CouponsOffers,
  Notifications,
  NotificationPage,
  ReportsAnalytics,
  AdminHeader,
  StockManagement,
};
