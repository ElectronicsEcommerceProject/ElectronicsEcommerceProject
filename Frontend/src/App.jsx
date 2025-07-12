import React, { Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Lazy loaded components (User side)
const MainDashboard = React.lazy(() =>
  import("../features/customer/Dashboard/MainDashboard.jsx")
);
const MainZone = React.lazy(() =>
  import("../features/customer/Dashboard/MainZone.jsx")
);
const BuyNowPage = React.lazy(() =>
  import("../features/customer/Dashboard/BuyNowPage.jsx")
);
const ProfilePage = React.lazy(() =>
  import("../features/customer/Profile/ProfilePage.jsx")
);
const ShoppingCart = React.lazy(() =>
  import("../components/CartSummary/ShoppingCart.jsx")
);
const UserNotification = React.lazy(() =>
  import("../components/UserNotification/UserNotification.jsx")
);

// ✅ Lazy loaded components (Admin side)
const AdminLayout = React.lazy(() =>
  import("../features/admin/AdminLayout/AdminLayout.jsx")
);
const ProductForm = React.lazy(() =>
  import("../features/admin/ProductManagement/ProductForm.jsx")
);

// ✅ Loading Spinner shown while components are loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* User Routes */}
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
      </Suspense>
    </Router>
  );
};

export default App;
