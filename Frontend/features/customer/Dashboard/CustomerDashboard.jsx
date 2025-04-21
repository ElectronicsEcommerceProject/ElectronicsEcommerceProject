import React, { useState } from "react";
import CustomerHeader from "../../../components/Header/CustomerHeader";
import ShowAllCategory from "../../../components/ShowAllCategory/ShowAllCategory";
import CustomerProductCard from "../../../components/ProductCard/ProductCard";

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Header */}
      <CustomerHeader setSearchQuery={setSearchQuery} />

      {/* Main Content */}
      <div className="d-flex">
        {/* Sidebar for Categories */}
        <div style={{ flex: "0 0 250px", marginRight: "1rem" }}>
          <ShowAllCategory />
        </div>

        {/* Product Cards */}
        <div style={{ flex: "1" }}>
          <CustomerProductCard searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
