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
export { default as OrderDetails } from "./Order/OrderDetails.jsx";
export { default as Header } from "../components/Header/Header.jsx";
export { default as Footer } from "../components/Footer/Footer.jsx";
export { default as FilterSidebar } from "../components/ProductZone/FilterSidebar.jsx";
export { default as ProductGrid } from "../components/ProductZone/ProductGrid.jsx";
export { default as SortOptions } from "../components/ProductZone/SortOptions.jsx";
export { default as RelatedProducts } from "./customer/Dashboard/RelatedProducts.jsx";

// 🛡️ Admin Features
export { default as Dashboard } from "./admin/Dashboard/AdminDashboard.jsx";
export { default as BannerManagement } from "./admin/BannerManagement/BannerManagement.jsx";
export { default as ProductManagement } from "./admin/ProductManagement/ProductDashboard.jsx";
export { default as OrderManagement } from "./admin/OrderDashboard/OrderDashboard.jsx";
export { default as UserManagement } from "./admin/UserManagement/UserDashboard.jsx";
export { default as UserProfileView } from "./admin/UserManagement/UserProfileView.jsx";
export { default as RetailerApprovalManager } from "./admin/UserManagement/RetailerApprovalManager.jsx";
export { default as ReviewManagement } from "./admin/ReviewManagement/ReviewDashboard.jsx";
export { default as CouponsOffers } from "./admin/CouponManagement/CouponDashboard.jsx";
export { default as NotificationPage } from "./admin/NotificationManagement/NotificationPage.jsx";
export { default as ReportsAnalytics } from "./admin/AnalyticManagement/AnalyticDashboard.jsx";
export { default as StockManagement } from "./admin/StockManagement/StockManagement.jsx";
export { default as AdminLayout } from "./admin/AdminLayout/AdminLayout.jsx";
export { default as ProductForm } from "./admin/ProductManagement/ProductForm.jsx";
export { default as AdminLogin } from "./admin/AdminLayout/AdminLogin.jsx";
export { default as AdminSidebar } from "./admin/Dashboard/AdminSidebar.jsx";
export { default as AnalyticsDashboard } from "./admin/AnalyticManagement/AnalyticDashboard.jsx";
export { default as CouponDashboard } from "./admin/CouponManagement/CouponDashboard.jsx";

// Auth utility
export { isAuthenticated } from "../src/utils/auth.js";

// 💳 Payment Features
export { default as RazorpayButton } from "./Payment/RazorpayButton.jsx";

// 🔐 Customer Authentication
export { default as Login } from "./customer/SignIn/Login.jsx";
export { default as Signup } from "./customer/SignIn/Signup.jsx";
export { default as LogoutModal } from "./customer/SignIn/Logout.jsx";
export { default as ForgotPassword } from "./customer/SignIn/ForgotPassword.jsx";

// Order Management Components
export { default as CustomModal } from "./admin/OrderManagement/CustomModal.jsx";
export { default as FiltersSection } from "./admin/OrderManagement/FilterSection.jsx";
export { default as OrderHeader } from "./admin/OrderManagement/Header.jsx";
export { default as ManualOrderModal } from "./admin/OrderManagement/ManualOrderModal.jsx";
export { default as MetricsSection } from "./admin/OrderManagement/MetricsSection.jsx";
export { default as Notifications } from "./admin/OrderManagement/Notifications.jsx";
export { default as OrderDetailModal } from "./admin/OrderManagement/OrderDetailModal.jsx";
export { default as OrdersTable } from "./admin/OrderManagement/OrdersTable.jsx";
export { default as QuickActions } from "./admin/OrderManagement/QuickActions.jsx";
export { default as AdminHeader } from "../components/Header/AdminHeader.jsx";
