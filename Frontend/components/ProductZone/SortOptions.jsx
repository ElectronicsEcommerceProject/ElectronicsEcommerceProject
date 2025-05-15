import React from 'react';

const SortOptions = ({ sortOption, handleSort }) => {
  return (
    <div className="flex gap-6 mb-4">
      <span
        className={`cursor-pointer ${sortOption === 'popularity' ? 'font-bold text-blue-600' : ''}`}
        onClick={() => handleSort('popularity')}
      >
        Popularity
      </span>
      <span
        className={`cursor-pointer ${sortOption === 'low-to-high' ? 'font-bold text-blue-600' : ''}`}
        onClick={() => handleSort('low-to-high')}
      >
        Price -- Low to High
      </span>
      <span
        className={`cursor-pointer ${sortOption === 'high-to-low' ? 'font-bold text-blue-600' : ''}`}
        onClick={() => handleSort('high-to-low')}
      >
        Price -- High to Low
      </span>
      <span
        className={`cursor-pointer ${sortOption === 'discount' ? 'font-bold text-blue-600' : ''}`}
        onClick={() => handleSort('discount')}
      >
        Discount
      </span>
    </div>
  );
};

export default SortOptions;
