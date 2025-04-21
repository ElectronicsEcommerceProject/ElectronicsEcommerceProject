import React, { useState, useEffect } from "react";
import ShowAllCategoryService from "./ShowAllCategoryService";

const ShowAllCategory = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await ShowAllCategoryService.getAllCategories(token); // Pass token to the function
        console.log("Categories fetched:", response);
        setCategories(response); // dynamic category list from backend
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                  <input type="checkbox" /> {cat.name}
                </label>
              ))}
            </div>
          </details>

          {/* Static filters below remain the same */}
          <details>
            <summary style={{ fontWeight: "600", padding: "0.5rem 0" }}>
              Brand
            </summary>
            <div>
              {["HP", "Apple", "Dell"].map((brand) => (
                <label
                  key={brand}
                  style={{ display: "block", marginBottom: "0.5rem" }}
                >
                  <input type="checkbox" /> {brand}
                </label>
              ))}
            </div>
          </details>

          {/* Add rest of static filters here as before... */}
        </div>
      )}
    </>
  );
};

export default ShowAllCategory;
