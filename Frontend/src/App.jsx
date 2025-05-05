// filepath: c:\Users\satyam singh\Deskt
// op\vite-project\maaLaxmiEcommerceWebsite\ElectronicsEcommerceProject\Frontend\src\App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; 
// import {AnalyticDashboard} from "../src/index.js"
import AnalyticDashboard  from "../features/admin/AnalyticManagement/AnalyticDashboard";
import OrderDashboard from "../features/admin/OrderDashboard/OrderDashboard";
import AdminDashboard from "../features/admin/Dashboard/AdminDashboard";
 
 const App = () => {
  return (
    <div className="app-container">
      <ToastContainer />

      <Routes>
        {/* <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route
          path="/product/:productId"
          element={<ShowProductDescription />}
        />
        <Route path="/showCartItems" element={<ShowAllCartItems />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/admindashboard"
          element={
            <div className="admin-container">
              <Layout />
            </div>
          }
        />
        <Route path="/productform" element={<ProductForm />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/productdashboard" element={<ProductDashboard />} />
        <Route path="/orderdashboard" element={<OrderDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/reviewdashboard" element={<ReviewDashboard />} />
        <Route path="/coupondashboard" element={<CouponDashboard />} />
        <Route path="/notification" element={<NotificationPage />} /> */}
        <Route path="/analyticdashboard" element={<AnalyticDashboard/>} />
        <Route path="/orderdashboard" element={<OrderDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />

        {/* <Route path="/userprofileview" element={<UserProfileView />} /> */}
      </Routes>
    </div>
  );
};

export default App;
