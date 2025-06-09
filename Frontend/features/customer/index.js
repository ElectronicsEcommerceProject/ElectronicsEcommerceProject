// 📁 Customer Dashboard Pages
import MainDashboard from "../../features/customer/Dashboard/MainDashboard";
import MainZone from "../../features/customer/Dashboard/MainZone";
import BuyNowPage from "../../features/customer/Dashboard/Buy Now Page";

// 📁 Customer Profile
import ProfilePage from "../../features/customer/Profile/ProfilePage";

// 🛒 Cart
import ShoppingCart from "../../components/CartSummary/ShoppingCart";

// 🧭 Common UI
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HoverMenu from "../common/HoverMenu";

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
import FilterSidebar from "../../components/ProductZone/FilterSidebar";
import ProductGrid from "../../components/ProductZone/ProductGrid";
import SortOptions from "../../components/ProductZone/SortOptions";

// 📊 Dummy Data
import categoriesData from "../../components/Data/categories";
import { brandsData } from "../../components/Data/brands";
import { dummyProducts } from "../../components/Data/products";

// ✅ Named Exports (excluding Redux actions)
export {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
  Header,
  Footer,
  HoverMenu,
  FilterSidebar,
  ProductGrid,
  SortOptions,
  
  categoriesData,
  brandsData,
  dummyProducts,
};
