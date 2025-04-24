// filepath: c:\Users\satyam singh\Desktop\vite-project\maaLaxmiEcommerceWebsite\ElectronicsEcommerceProject\Frontend\src\App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "../features/auth/LoginForm";
import SignupForm from "../features/auth/SignupForm";
import CustomerDashboard from "../features/customer/Dashboard/CustomerDashboard";
import ProfilePage from "../features/customer/Profile/ProfilePage";
import ShowProductDescription from "../components/ProductCard/ShowProductDescription";
import ShowAllCartItems from "../components/ShowAllCartItems/Cart";
const App = () => {
  return (
    <div className="app-container">
      <ToastContainer />

      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route
          path="/product/:productId"
          element={<ShowProductDescription />}
        />
        <Route path="/showCartItems" element={<ShowAllCartItems />} />"
      </Routes>
    </div>
  );
};

export default App;
