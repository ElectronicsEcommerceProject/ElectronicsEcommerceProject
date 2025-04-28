// filepath: c:\Users\satyam singh\Desktop\vite-project\maaLaxmiEcommerceWebsite\ElectronicsEcommerceProject\Frontend\src\App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "./components/pages/auth/LoginForm";
import SignupForm from "./components/pages/auth/SignupForm";
import CustomerDashboard from "./components/pages/customer/Dashboard/CustomerDashboard";
import ProfilePage from "./components/pages/customer/Profile/ProfilePage";
import ShowProductDescription from "./components/shared/ProductCard/ShowProductDescription"
import ShowAllCartItems from "./components/shared/ShowAllCartItems/Cart";
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
