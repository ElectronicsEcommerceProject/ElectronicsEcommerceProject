import React, { useState, useEffect } from "react";

const FilterBar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showFilters, setShowFilters] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle = {
    width: isMobile ? "100%" : "250px",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f9f9f9",
    marginBottom: isMobile ? "1rem" : "0",
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    display: isMobile ? "none" : "block",
  };

  const filterSummaryStyle = {
    cursor: "pointer",
    fontWeight: "600",
    padding: "0.5rem 0",
  };

  const filterOptionStyle = {
    display: "block",
    marginBottom: "0.5rem",
    cursor: "pointer",
  };

  const toggleButtonStyle = {
    display: isMobile ? "block" : "none",
    marginBottom: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
  };

  return (
    <>
      {isMobile && (
        <button
          style={toggleButtonStyle}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      )}

      {(!isMobile || showFilters) && (
        <div style={containerStyle}>
          <h3 style={titleStyle}>Filters</h3>

          <details>
            <summary style={filterSummaryStyle}>Brand</summary>
            <div>
              {["HP", "Apple", "Dell"].map((brand) => (
                <label key={brand} style={filterOptionStyle}>
                  <input type="checkbox" /> {brand}
                </label>
              ))}
            </div>
          </details>

          <details>
            <summary style={filterSummaryStyle}>Price Range</summary>
            <input type="range" min="10000" max="200000" />
          </details>

          <details>
            <summary style={filterSummaryStyle}>Rating</summary>
            <label style={filterOptionStyle}>
              <input type="checkbox" /> 4★ & above
            </label>
          </details>

          <details>
            <summary style={filterSummaryStyle}>Availability</summary>
            <div>
              {["In Stock", "Upcoming"].map((status) => (
                <label key={status} style={filterOptionStyle}>
                  <input type="checkbox" /> {status}
                </label>
              ))}
            </div>
          </details>

          <details>
            <summary style={filterSummaryStyle}>Processor</summary>
            <div>
              {["i3", "i5", "Ryzen"].map((proc) => (
                <label key={proc} style={filterOptionStyle}>
                  <input type="checkbox" /> {proc}
                </label>
              ))}
            </div>
          </details>

          <details>
            <summary style={filterSummaryStyle}>RAM</summary>
            <div>
              {["8GB", "16GB"].map((ram) => (
                <label key={ram} style={filterOptionStyle}>
                  <input type="checkbox" /> {ram}
                </label>
              ))}
            </div>
          </details>

          <details>
            <summary style={filterSummaryStyle}>Storage</summary>
            <div>
              {["256GB SSD", "1TB HDD"].map((storage) => (
                <label key={storage} style={filterOptionStyle}>
                  <input type="checkbox" /> {storage}
                </label>
              ))}
            </div>
          </details>

          <details>
            <summary style={filterSummaryStyle}>Screen Size</summary>
            <div>
              {['13"', '15"'].map((size) => (
                <label key={size} style={filterOptionStyle}>
                  <input type="checkbox" /> {size}
                </label>
              ))}
            </div>
          </details>
        </div>
      )}
    </>
  );
};

export default FilterBar;
