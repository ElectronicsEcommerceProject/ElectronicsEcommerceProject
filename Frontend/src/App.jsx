import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
  OrderCheckoutPage,
  OrderStatus,
} from "../features/customer/index.js";

import { AdminLayout, ProductForm } from "../features/admin/index.js";

import { UserNotification } from "../src/index.js";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/mainzone" element={<MainZone />} />
      <Route path="/buynow" element={<BuyNowPage />} />
      <Route path="/product/:productId" element={<BuyNowPage />} />
      <Route path="/profilepage" element={<ProfilePage />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/orderCheckout" element={<OrderCheckoutPage />} />
      <Route path="/OrderStatus" element={<OrderStatus />} />
      <Route path="/notifications" element={<UserNotification />} />
      //AdminRoutes
      <Route path="/admin" element={<AdminLayout />} />
      <Route path="/admin/product-Form" element={<ProductForm />} />
    </Routes>
  );
};

export default App;
