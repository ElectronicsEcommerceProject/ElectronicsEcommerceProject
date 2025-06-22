// 🔧 Common Features
export { default as HoverMenu } from "./common/HoverMenu.jsx";
export { default as UiSlice } from "./common/UiSlice.jsx";
export { default as UserSlice } from "./common/UserSlice.jsx";

// 👥 Customer Features
export { default as MainDashboard } from "./customer/Dashboard/MainDashboard.jsx";
export { default as MainZone } from "./customer/Dashboard/MainZone.jsx";
export { default as BuyNowPage } from "./customer/Dashboard/BuyNowPage.jsx";
export { default as ProfilePage } from "./customer/Profile/ProfilePage.jsx";
export { default as ShoppingCart } from "../components/CartSummary/ShoppingCart.jsx";
export { default as OrderCheckoutPage } from "./Order/OrderCheckoutPage.jsx";
export { default as OrderDetails } from "./Order/OrderDetails.jsx";
export { default as OrderStatus } from "./Order/OrderStatus.jsx";
export { default as Header } from "../components/Header/Header.jsx";
export { default as Footer } from "../components/Footer/Footer.jsx";
export { default as FilterSidebar } from "../components/ProductZone/FilterSidebar.jsx";
export { default as ProductGrid } from "../components/ProductZone/ProductGrid.jsx";
export { default as SortOptions } from "../components/ProductZone/SortOptions.jsx";
export { default as categoriesData } from "../components/Data/categories.jsx";

// 🛡️ Admin Features
export { default as Dashboard } from "./admin/Dashboard/AdminDashboard.jsx";
export { default as ProductManagement } from "./admin/ProductManagement/ProductDashboard.jsx";
export { default as OrderManagement } from "./admin/OrderDashboard/OrderDashboard.jsx";
export { default as UserManagement } from "./admin/UserManagement/UserDashboard.jsx";
export { default as UserProfileView } from "./admin/UserManagement/UserProfileView.jsx";
export { default as ReviewManagement } from "./admin/ReviewManagement/ReviewDashboard.jsx";
export { default as CouponsOffers } from "./admin/CouponManagement/CouponDashboard.jsx";
export { default as NotificationPage } from "./admin/NotificationManagement/NotificationPage.jsx";
export { default as ReportsAnalytics } from "./admin/AnalyticManagement/AnalyticDashboard.jsx";
export { default as StockManagement } from "./admin/StockManagement/StockManagement.jsx";
export { default as AdminLayout } from "./admin/AdminLayout/AdminLayout.jsx";
export { default as ProductForm } from "./admin/ProductManagement/ProductForm.jsx";
export { default as AdminLogin } from "./admin/AdminLayout/AdminLogin.jsx";
export { default as ForgotPassword } from "./admin/AdminLayout/ForgotPassword.jsx";
export { default as AdminSidebar } from "./admin/Dashboard/AdminSidebar.jsx";
export { default as AnalyticsDashboard } from "./admin/AnalyticManagement/AnalyticDashboard.jsx";
export { default as CouponDashboard } from "./admin/CouponManagement/CouponDashboard.jsx";

// Admin Components from components directory
export { default as AdminHeader } from "../components/Header/AdminHeader.jsx";
export { default as Notifications } from "../components/OrderManagement/Notifications.jsx";
export { default as CustomModal } from "../components/OrderManagement/CustomModal.jsx";
export { default as FiltersSection } from "../components/OrderManagement/FilterSection.jsx";
export { default as OrderHeader } from "../components/OrderManagement/Header.jsx";
export { default as ManualOrderModal } from "../components/OrderManagement/ManualOrderModal.jsx";
export { default as MetricsSection } from "../components/OrderManagement/MetricsSection.jsx";
export { default as OrderDetailModal } from "../components/OrderManagement/OrderDetailModal.jsx";
export { default as OrdersTable } from "../components/OrderManagement/OrdersTable.jsx";
export { default as QuickActions } from "../components/OrderManagement/QuickActions.jsx";

// Auth utility
export { isAuthenticated } from "../src/utils/auth.js";

// 📦 Order Features
// Note: OrderCheckoutPage, OrderDetails, and OrderStatus are exported through customer/index.js

// 💳 Payment Features
export { default as RazorpayButton } from "./Payment/RazorpayButton.jsx";

// 🏪 Retailer Features
export { default as RetailerDashboard } from "./Retailer/Dashboard/RetailerDashboard.jsx";
export { default as RetailerOrderList } from "./Retailer/Orders/RetailerOrderList.jsx";
export { default as RetailerLogout } from "./Retailer/Logout/RetailerLogout.jsx";

// 🔐 Customer Authentication
export { default as Login } from "./customer/SignIn/Login.jsx";
export { default as Signup } from "./customer/SignIn/Signup.jsx";
export { default as LogoutModal } from "./customer/SignIn/Logout.jsx";

// 👤 Customer Profile & Settings
export { default as PrivacySettings } from "./customer/Privacy/PrivacySettings.jsx";
export { default as SavedCards } from "./customer/SavedCards/SavedCards.jsx";
export { default as CustomerAlert } from "./customer/CustomerAlert/CustomerAlert.jsx";
