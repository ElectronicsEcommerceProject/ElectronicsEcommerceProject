// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "../features/auth/LoginForm";
import Header from "../components/Header/CustomerHeader";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer/Footer";
import Product from "../components/ProductCard/CustomerProductCard";
import SignupForm from "../features/auth/SignupForm";
const App = () => {
  return (
    <div className="app-container">
      <ToastContainer />

      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/"
          element={
            <>
              <Header />
              <div className="main-container">
                <FilterBar />
                <div className="product-section">
                  <div className="product-grid">
                    <Product />
                    <Product />
                    <Product />
                  </div>
                </div>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
