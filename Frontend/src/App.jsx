import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  MainDashboard,
  MainZone,
  BuyNowPage,
  ProfilePage,
  ShoppingCart,
} from '../features/customer/index';

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/mainzone" element={<MainZone />} />
        <Route path="/buynow" element={<BuyNowPage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
   
  );
};

export default App;
