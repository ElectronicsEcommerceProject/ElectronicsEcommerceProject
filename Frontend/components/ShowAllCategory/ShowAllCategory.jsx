import React, { useState, useEffect } from "react";
import ShowAllCategoryService from "./ShowAllCategoryService";

const ShowAllCategory = ({ onCategorySelect }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ShowAllCategoryService.getAllCategories(token);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCheckboxChange = async (categoryId, checked) => {
    let updatedCategories;
    if (checked) {
      updatedCategories = [...selectedCategories, categoryId];
    } else {
      updatedCategories = selectedCategories.filter((id) => id !== categoryId);
    }
    setSelectedCategories(updatedCategories);

    try {
      const token = localStorage.getItem("token");

      // If no categories are selected, fetch all products
      if (updatedCategories.length === 0) {
        const allProducts = await ShowAllCategoryService.fetchAllProducts(
          token
        );
        onCategorySelect(allProducts); // Pass all products to parent component
      } else {
        // Fetch products for selected categories
        const categoryProducts = await Promise.all(
          updatedCategories.map((id) =>
            ShowAllCategoryService.fetchProductsBasedOnCategoryId(id, token)
          )
        );
        const combinedProducts = categoryProducts.flat(); // Combine all products into a single array
        onCategorySelect(combinedProducts); // Pass combined products to parent component
      }
    } catch (error) {
      console.error("Error fetching products for categories:", error);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          style={{
            display: "block",
            marginBottom: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>
      )}

      {(!isMobile || showCategories) && (
        <div
          style={{
            width: isMobile ? "100%" : "250px",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
            marginBottom: isMobile ? "1rem" : "0",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              display: isMobile ? "none" : "block",
            }}
          >
            Categories
          </h3>

          <details open>
            <summary
              style={{
                cursor: "pointer",
                fontWeight: "600",
                padding: "0.5rem 0",
              }}
            >
              Category
            </summary>
            <div>
              {categories.map((cat) => (
                <label
                  key={cat.category_id}
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(cat.category_id, e.target.checked)
                    }
                  />{" "}
                  {cat.name}
                </label>
              ))}
            </div>
          </details>
        </div>
      )}
    </>
  );
};

export default ShowAllCategory;
