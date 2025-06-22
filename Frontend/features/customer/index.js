// 📁 Customer Dashboard Pages
import MainDashboard from "../../features/customer/Dashboard/MainDashboard.jsx";
import MainZone from "../../features/customer/Dashboard/MainZone.jsx";
import BuyNowPage from "./Dashboard/BuyNowPage.jsx";

// 📁 Customer Profile
import ProfilePage from "../../features/customer/Profile/ProfilePage.jsx";

// 🛒 Cart
import ShoppingCart from "../../components/CartSummary/ShoppingCart.jsx";

import OrderCheckoutPage from "../../features/Order/OrderCheckoutPage.jsx";
import OrderDetails from "../Order/OrderDetails.jsx";
import OrderStatus from "../../features/Order/OrderStatus.jsx";

// 🧭 Common UI
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import HoverMenu from "../common/HoverMenu.jsx";

//  import {
//   setSearchTerm,
//   setSelectedCategories,
//   setSelectedBrands,
//   setPriceRange,
//   setCustomPrice,
//   setRating,
//   setDiscounts,
//   setInStockOnly,
//   setNewArrivals,
//   setSortOption,
//   resetFilters,
// } from "../../components/Redux/filterSlice";

// 🧱 Product Zone Components
import FilterSidebar from "../../components/ProductZone/FilterSidebar.jsx";
import ProductGrid from "../../components/ProductZone/ProductGrid.jsx";
import SortOptions from "../../components/ProductZone/SortOptions.jsx";

// 📊 Dummy Data
import categoriesData from "../../components/Data/categories.js";
import { brandsData } from "../../components/Data/brands.js";

// ✅ Named Exports (excluding Redux actions)
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
  HoverMenu,
  FilterSidebar,
  ProductGrid,
  SortOptions,
  categoriesData,
  brandsData,
};
