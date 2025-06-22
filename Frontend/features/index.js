// 🔧 Common Features
export { default as HoverMenu } from "./common/HoverMenu.jsx";
export { default as UiSlice } from "./common/UiSlice.js";
export { default as UserSlice } from "./common/UserSlice.js";

// 👥 Customer Features
export {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
  OrderCheckoutPage,
  OrderDetails,
  OrderStatus,
  Header,
  Footer,
  FilterSidebar,
  ProductGrid,
  SortOptions,
  categoriesData,
  brandsData,
} from "./customer/index.js";

// 🛡️ Admin Features
export {
  Dashboard,
  ProductManagement,
  OrderManagement,
  UserManagement,
  UserProfileView,
  ReviewManagement,
  CouponsOffers,
  Notifications,
  NotificationPage,
  ReportsAnalytics,
  AdminHeader,
  StockManagement,
  AdminLayout,
  ProductForm,
  isAuthenticated,
} from "./admin/index.js";

// 📦 Order Features
export { default as OrderCheckoutPage } from "./Order/OrderCheckoutPage.jsx";
export { default as OrderDetails } from "./Order/OrderDetails.jsx";
export { default as OrderService } from "./Order/OrderService.js";
export { default as OrderSlice } from "./Order/OrderSlice.js";
export { default as OrderStatus } from "./Order/OrderStatus.jsx";

// 💳 Payment Features
export { default as RazorpayButton } from "./Payment/RazorpayButton.jsx";

// 🏪 Retailer Features
export { default as RetailerDashboard } from "./Retailer/Dashboard/RetailerDashboard.jsx";
export { default as RetailerOrderList } from "./Retailer/Orders/RetailerOrderList.jsx";
export { default as RetailerLogout } from "./Retailer/Logout/RetailerLogout.jsx";

// 🔐 Customer Authentication
export { default as Login } from "./customer/SignIn/Login.jsx";
export { default as Signup } from "./customer/SignIn/Signup.jsx";
export { default as ForgotPassword } from "./customer/SignIn/ForgotPassword.jsx";
export { default as LogoutModal } from "./customer/SignIn/Logout.jsx";

// 👤 Customer Profile & Settings
export { default as PrivacySettings } from "./customer/Privacy/PrivacySettings.jsx";
export { default as SavedCards } from "./customer/SavedCards/SavedCards.jsx";
export { default as CustomerAlert } from "./customer/CustomerAlert/CustomerAlert.jsx";