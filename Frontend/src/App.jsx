import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "../features/auth/LoginForm";
import SignupForm from "../features/auth/SignupForm";
import CustomerDashboard from "../features/customer/Dashboard/CustomerDashboard";

const App = () => {
  return (
    <div className="app-container">
      <ToastContainer />

      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<CustomerDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
