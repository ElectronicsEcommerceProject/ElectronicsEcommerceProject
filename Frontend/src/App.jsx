// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "../features/auth/LoginForm";
import Header from "../components/Header/CustomerHeader";
import Footer from "../components/Footer/Footer";
import Product from "../components/ProductCard/CustomerProductCard";
import SignupForm from "../features/auth/SignupForm";
import ShowAllCategory from "../components/ShowAllCategory/ShowAllCategory";
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
              <div>
                <ShowAllCategory />
                {/* <div>
                  <div>
                    <Product />
                    <Product />
                    <Product />
                  </div>
                </div> */}
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
