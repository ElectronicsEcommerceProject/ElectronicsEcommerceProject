
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
  OrderCheckoutPage,
} from '../features/customer/index.js';
import AdminLayout from '../features/admin/AdminLayout/AdminLayout.jsx'; //AdminLayout
import ProductForm from '../features/admin/ProductManagement/ProductForm.jsx'; //AdminLayout

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/mainzone" element={<MainZone />} />
        <Route path="/buynow" element={<BuyNowPage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path = "/orderCheckout" element={<OrderCheckoutPage />} />

        //AdminRoutes
        <Route path="/adminDashboard" element={<AdminLayout />} />
        <Route path="/admin/product-Form" element={<ProductForm />} />
      </Routes>
   
  );
};

export default App;

