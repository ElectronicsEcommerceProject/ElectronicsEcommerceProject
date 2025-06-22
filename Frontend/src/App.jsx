import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
  OrderCheckoutPage,
  OrderStatus,
} from "../features/customer/index.js";

import { AdminLayout, ProductForm } from "../features/index.js";

import { UserNotification } from "../src/index.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/mainzone" element={<MainZone />} />
        <Route path="/buynow" element={<BuyNowPage />} />
        <Route path="/product/:productId" element={<BuyNowPage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/profile/orders" element={<ProfilePage />} />
        <Route path="/profile/wishlist" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/notifications" element={<UserNotification />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/product-Form" element={<ProductForm />} />
      </Routes>
    </Router>
  );
};

export default App;
