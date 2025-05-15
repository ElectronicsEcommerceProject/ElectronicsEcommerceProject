// External
import React from "react";

// Pages & Features
import Dashboard from "../../features/admin/Dashboard/AdminDashboard";
import ProductManagement from "../../features/admin/ProductManagement/ProductDashboard";
import ProductForm from "../../features/admin/ProductManagement/ProductForm";
import OrderManagement from "../../features/admin/OrderDashboard/OrderDashboard";
import Header from "../../components/OrderManagement/Header";
import FiltersSection from "../../components/OrderManagement/FilterSection";
import MetricsSection from "../../components/OrderManagement/MetricsSection";
import OrdersTable from "../../components/OrderManagement/OrdersTable";
import OrderDetailModal from "../../components/OrderManagement/OrderDetailModal";
import ManualOrderModal from "../../components/OrderManagement/ManualOrderModal";
import QuickActions from "../../components/OrderManagement/QuickActions";
import Notifications from "../../components/OrderManagement/Notifications";
import CustomModal from "../../components/OrderManagement/CustomModal.JSX";
import UserManagement from "../../features/admin/UserManagement/UserDashboard";
import UserProfileView from "../../features/admin/UserManagement/UserProfileView";

import ReviewManagement from "../../features/admin/ReviewManagement/ReviewDashboard";
import CouponsOffers from "../../features/admin/CouponManagement/CouponDashboard";
import NotificationPage from "../../features/admin/NotificationManagement/NotificationPage";
import ReportsAnalytics from "../../features/admin/AnalyticManagement/AnalyticDashboard";

// Layout Components
import AdminHeader from "../../components/Header/AdminHeader";

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
};
