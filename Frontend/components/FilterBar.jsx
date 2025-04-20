import React from 'react';

const FilterBar = () => (
  <div className="filter-bar">
    <h3 className="filter-title">Filters</h3>
    <details className="filter-section">
      <summary className="filter-summary">Brand</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> HP
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> Apple
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> Dell
        </label>
      </div>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Price Range</summary>
      <input type="range" min="10000" max="200000" className="filter-range" />
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Rating</summary>
      <label className="filter-option">
        <input type="checkbox" className="filter-checkbox" /> 4★ & above
      </label>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Availability</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> In Stock
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> Upcoming
        </label>
      </div>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Processor</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> i3
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> i5
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> Ryzen
        </label>
      </div>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">RAM</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 8GB
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 16GB
        </label>
      </div>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Storage</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 256GB SSD
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 1TB HDD
        </label>
      </div>
    </details>
    <details className="filter-section">
      <summary className="filter-summary">Screen Size</summary>
      <div className="filter-options">
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 13"
        </label>
        <label className="filter-option">
          <input type="checkbox" className="filter-checkbox" /> 15"
        </label>
      </div>
    </details>
  </div>
);

export default FilterBar;