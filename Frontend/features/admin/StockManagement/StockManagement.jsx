/**
 * ProductVariant Stock Management Component with Hardcoded Data
 *
 * ✅ CURRENT STATUS: Using hardcoded data for UI testing
 *
 * FEATURES:
 * - Multi-level filtering (Category, Brand, Product, Variant, Status)
 * - Global search across multiple fields
 * - Summary cards for stock overview (based on filtered data)
 * - Detailed stock table
 * - Stock update modal (Reason dropdown removed)
 * - Pagination and sorting
 * - CSV export
 * - Filter chips and clear all filters
 * - Aligned with models: ProductVariant, Product, Category, Brand
 * - Replaced SKU with Product Variant Name for better user understanding
 * - Enhanced action icons with tooltips and modals for functionality
 * - Improved Update icon in stock update modal
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaBox, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTruck,
  FaShoppingCart, FaEdit, FaTimes, FaSearch, FaFilter, FaTimes as FaClear, FaChevronDown,
  FaBoxes, FaInfoCircle
} from 'react-icons/fa';

// Hardcoded Sample Data
const sampleCategories = [
  { category_id: 'cat1', name: 'Electronics' },
  { category_id: 'cat2', name: 'Clothing' },
  { category_id: 'cat3', name: 'Home Appliances' },
];

const sampleBrands = [
  { brand_id: 'brand1', name: 'BrandA' },
  { brand_id: 'brand2', name: 'BrandB' },
  { brand_id: 'brand3', name: 'BrandC' },
];

const sampleProductVariants = [
  {
    product_variant_id: 'var1',
    product_id: 'prod1',
    variant_name: 'Laptop - 8GB RAM',
    price: 999.99,
    stock_quantity: 10,
    in_carts_wishlists: 2,
    sold: 5,
    updatedAt: '2023-10-01T10:00:00Z',
    product_name: 'Laptop',
    category_name: 'Electronics',
    brand_name: 'BrandA',
  },
  {
    product_variant_id: 'var2',
    product_id: 'prod1',
    variant_name: 'Laptop - 16GB RAM',
    price: 1099.99,
    stock_quantity: 5,
    in_carts_wishlists: 1,
    sold: 3,
    updatedAt: '2023-10-02T11:00:00Z',
    product_name: 'Laptop',
    category_name: 'Electronics',
    brand_name: 'BrandA',
  },
  {
    product_variant_id: 'var3',
    product_id: 'prod2',
    variant_name: 'T-shirt - Blue Medium',
    price: 19.99,
    stock_quantity: 50,
    in_carts_wishlists: 10,
    sold: 20,
    updatedAt: '2023-10-03T12:00:00Z',
    product_name: 'T-shirt',
    category_name: 'Clothing',
    brand_name: 'BrandB',
  },
  {
    product_variant_id: 'var4',
    product_id: 'prod3',
    variant_name: 'Microwave - 30L',
    price: 299.99,
    stock_quantity: 0,
    in_carts_wishlists: 0,
    sold: 10,
    updatedAt: '2023-10-04T13:00:00Z',
    product_name: 'Microwave',
    category_name: 'Home Appliances',
    brand_name: 'BrandC',
  },
];

// SearchableDropdown Component
const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  displayKey = 'name',
  valueKey = 'id',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, displayKey]);

  const selectedOption = options.find(option => option[valueKey] === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray=900' : 'text-gray-500'}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full left-auto mt-1 bg-white border-b rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b">
            <div className="relative">
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input w-full pl-2 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <button
              className="w-full px-4 py-2 bg-left bg-gray-50 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => { onChange(''); setIsOpen(false); setSearchTerm(''); }}
            >
              Clear {placeholder}
            </button>
            {filteredOptions.map(option => (
              <button
                key={option[valueKey]}
                className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100"
                onClick={() => { onChange(option[valueKey]); setIsOpen(false); setSearchTerm(''); }}
              >
                {option[displayKey]}
              </button>
            ))}
          </div>
        </div>
        )}
      
    </div>
  );
};

// FilterChip Component
const FilterChip = ({ label, onRemove }) => (
  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
    <span>{label.trim()}</span>
    <button onClick={onRemove} className="ml-2 text-blue-600 hover:text-blue-800">
      <FaClear className="w-3 h-3" />
    </button>
  </div>
);

// Debounced Search Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const StockManagement = () => {
  const [productVariants, setProductVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [variantFilter, setVariantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'product_name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [addStock, setAddStock] = useState(0);
  const [reduceStock, setReduceStock] = useState(0);
  const [editVariantName, setEditVariantName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const itemsPerPage = 10;
  const debouncedGlobalSearch = useDebounce(globalSearch, 300);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProductVariants(sampleProductVariants);
    setCategories(sampleCategories);
    setBrands(sampleBrands);
    setLoading(false);
  };

  const getStatus = (stock_quantity) => {
    if (stock_quantity <= 0) return 'Out of Stock';
    if (stock_quantity < 5) return 'Low';
    return 'In Stock';
  };

  const getAvailableStock = (stock_quantity, in_carts_wishlists) => {
    return Math.max(0, (stock_quantity || 0) - (in_carts_wishlists || 0));
  };

  const uniqueProducts = useMemo(() => {
    const productMap = new Map();
    productVariants.forEach(variant => {
      if (!productMap.has(variant.product_id)) {
        productMap.set(variant.product_id, { id: variant.product_id, name: variant.product_name });
      }
    });
    return Array.from(productMap.values());
  }, [productVariants]);

  const uniqueVariants = useMemo(() => {
    let variants = productVariants;
    if (productFilter) variants = variants.filter(v => v.product_id === productFilter);
    return variants.map(v => ({ id: v.product_variant_id, name: v.variant_name }));
  }, [productVariants, productFilter]);

  const filteredVariants = useMemo(() => {
    let filtered = productVariants.map(variant => ({
      ...variant,
      status: getStatus(variant.stock_quantity),
      availableStock: getAvailableStock(variant.stock_quantity, variant.in_carts_wishlists),
      lastUpdated: variant.updatedAt || new Date().toISOString()
    }));

    if (debouncedGlobalSearch) {
      const searchLower = debouncedGlobalSearch.toLowerCase();
      filtered = filtered.filter(variant =>
        variant.product_name.toLowerCase().includes(searchLower) ||
        variant.variant_name.toLowerCase().includes(searchLower) ||
        variant.brand_name.toLowerCase().includes(searchLower) ||
        variant.category_name.toLowerCase().includes(searchLower) ||
        variant.product_variant_id.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter) filtered = filtered.filter(v => v.category_name === sampleCategories.find(c => c.category_id === categoryFilter)?.name);
    if (brandFilter) filtered = filtered.filter(v => v.brand_name === sampleBrands.find(b => b.brand_id === brandFilter)?.name);
    if (productFilter) filtered = filtered.filter(v => v.product_id === productFilter);
    if (variantFilter) filtered = filtered.filter(v => v.product_variant_id === variantFilter);
    if (statusFilter) filtered = filtered.filter(v => v.status === statusFilter);

    switch (activeFilter) {
      case 'inStock': filtered = filtered.filter(v => v.status === 'In Stock'); break;
      case 'lowStock': filtered = filtered.filter(v => v.status === 'Low'); break;
      case 'outStock': filtered = filtered.filter(v => v.status === 'Out of Stock'); break;
      case 'in_carts_wishlists': filtered = filtered.filter(v => v.in_carts_wishlists > 0); break;
      case 'sold': filtered = filtered.filter(v => v.sold > 0); break;
      default: break;
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (sortConfig.direction === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [
    productVariants,
    debouncedGlobalSearch,
    categoryFilter,
    brandFilter,
    productFilter,
    variantFilter,
    statusFilter,
    activeFilter,
    sortConfig
  ]);

  const summaryData = useMemo(() => ({
    totalVariants: filteredVariants.length,
    inStock: filteredVariants.filter(v => v.status === 'In Stock').length,
    lowStock: filteredVariants.filter(v => v.status === 'Low').length,
    outStock: filteredVariants.filter(v => v.status === 'Out of Stock').length,
    itemsInCartsWishlists: filteredVariants.reduce((sum, v) => sum + (v.in_carts_wishlists || 0), 0),
    soldItems: filteredVariants.reduce((sum, v) => sum + (v.sold || 0), 0),
    totalStockValue: filteredVariants.reduce((sum, v) => sum + ((v.stock_quantity || 0) * (v.price || 0)), 0)
  }), [filteredVariants]);

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
  const paginatedVariants = filteredVariants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActiveFilters = useCallback(() => {
    const filters = [];
    if (categoryFilter) {
      const category = sampleCategories.find(c => c.category_id === categoryFilter);
      filters.push({ key: 'category', label: `Category: ${category?.name || categoryFilter}`, onRemove: () => setCategoryFilter('') });
    }
    if (brandFilter) {
      const brand = sampleBrands.find(b => b.brand_id === brandFilter);
      filters.push({ key: 'brand', label: `Brand: ${brand?.name || brandFilter}`, onRemove: () => setBrandFilter('') });
    }
    if (productFilter) {
      const product = uniqueProducts.find(p => p.id === productFilter);
      filters.push({ key: 'product', label: `Product: ${product?.name || productFilter}`, onRemove: () => setProductFilter('') });
    }
    if (variantFilter) {
      const variant = uniqueVariants.find(v => v.id === variantFilter);
      filters.push({ key: 'variant', label: `Variant: ${variant?.name || variantFilter}`, onRemove: () => setVariantFilter('') });
    }
    if (statusFilter) filters.push({ key: 'status', label: `Status: ${statusFilter}`, onRemove: () => setStatusFilter('') });
    return filters;
  }, [categoryFilter, brandFilter, productFilter, variantFilter, statusFilter, uniqueProducts, uniqueVariants]);

  const clearAllFilters = useCallback(() => {
    setGlobalSearch('');
    setCategoryFilter('');
    setBrandFilter('');
    setProductFilter('');
    setVariantFilter('');
    setStatusFilter('');
    setActiveFilter('all');
    setCurrentPage(1);
  }, []);

  const requestSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRefresh = () => {
    clearAllFilters();
    loadData();
  };

  const handleExportCSV = () => {
    const headers = ['Variant ID', 'Product Name', 'Brand', 'Category', 'Variant Name', 'Price', 'Stock Quantity', 'Items in Carts/Wishlists', 'Available', 'Sold', 'Status', 'Last Updated'];
    const csvRows = [headers.join(',')];
    filteredVariants.forEach(variant => {
      csvRows.push([
        variant.product_variant_id,
        `"${variant.product_name}"`,
        `"${variant.brand_name}"`,
        `"${variant.category_name}"`,
        `"${variant.variant_name}"`,
        variant.price || 0,
        variant.stock_quantity || 0,
        variant.in_carts_wishlists || 0,
        variant.availableStock || 0,
        variant.sold || 0,
        `"${variant.status}"`,
        `"${new Date(variant.lastUpdated).toLocaleString()}"`
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert(`Exported ${filteredVariants.length} variants to CSV`);
  };

  const handleStockUpdate = () => {
    if (!currentVariant) return;
    const newStockQuantity = (currentVariant.stock_quantity || 0) + addStock - reduceStock;
    if (newStockQuantity < 0) {
      alert('Stock cannot be negative.');
      return;
    }
    setProductVariants(prev => prev.map(v =>
      v.product_variant_id === currentVariant.product_variant_id
        ? { ...v, stock_quantity: newStockQuantity, updatedAt: new Date().toISOString() }
        : v
    ));
    setShowStockModal(false);
    setAddStock(0);
    setReduceStock(0);
    alert(`Stock updated successfully for ${currentVariant.variant_name}! New Stock: ${newStockQuantity}`);
  };

  const handleEditVariant = () => {
    if (!currentVariant) return;
    if (!editVariantName.trim() || editPrice <= 0) {
      alert('Variant name and price must be valid.');
      return;
    }
    setProductVariants(prev => prev.map(v =>
      v.product_variant_id === currentVariant.product_variant_id
        ? { ...v, variant_name: editVariantName, price: editPrice, updatedAt: new Date().toISOString() }
        : v
    ));
    setShowEditModal(false);
    setEditVariantName('');
    setEditPrice(0);
    alert(`Variant ${currentVariant.variant_name} updated successfully!`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-center p-6"><h2 className="text-2xl font-bold text-red-600">Error</h2><p>{error}</p><button onClick={loadData} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Retry</button></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock Management</h1>
          <p className="text-sm text-gray-500">Total Variants: {summaryData.totalVariants} • Stock Value: ₹{summaryData.totalStockValue.toFixed(2)}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleRefresh}>Refresh</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center"><FaFilter className="mr-2" /> Filters</h2>
          <button onClick={clearAllFilters} className="text-sm text-gray-600 hover:text-red-600 flex items-center"><FaClear className="mr-1" /> Clear All</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Global Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, variant, brand, category, variant ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <SearchableDropdown options={categories} value={categoryFilter} onChange={setCategoryFilter} placeholder="Select Category" valueKey="category_id" />
          <SearchableDropdown options={brands} value={brandFilter} onChange={setBrandFilter} placeholder="Select Brand" valueKey="brand_id" />
          <SearchableDropdown options={uniqueProducts} value={productFilter} onChange={setProductFilter} placeholder="Select Product" />
          <SearchableDropdown options={uniqueVariants} value={variantFilter} onChange={setVariantFilter} placeholder="Select Variant" displayKey="name" />
          <SearchableDropdown options={[{ id: 'In Stock', name: 'In Stock' }, { id: 'Low', name: 'Low' }, { id: 'Out of Stock', name: 'Out of Stock' }]} value={statusFilter} onChange={setStatusFilter} placeholder="Select Status" />
        </div>
        {getActiveFilters().length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {getActiveFilters().map(filter => <FilterChip key={filter.key} label={filter.label} onRemove={filter.onRemove} />)}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { key: 'all', title: 'Total Variants', value: summaryData.totalVariants, icon: FaBox, color: 'blue' },
          { key: 'inStock', title: 'In Stock', value: summaryData.inStock, icon: FaCheckCircle, color: 'green' },
          { key: 'lowStock', title: 'Low Stock', value: summaryData.lowStock, icon: FaExclamationTriangle, color: 'yellow' },
          { key: 'outStock', title: 'Out of Stock', value: summaryData.outStock, icon: FaTimesCircle, color: 'red' },
          { key: 'in_carts_wishlists', title: 'Items in Carts/Wishlists', value: summaryData.itemsInCartsWishlists, icon: FaTruck, color: 'gray' },
          { key: 'sold', title: 'Sold Items', value: summaryData.soldItems, icon: FaShoppingCart, color: 'purple' },
        ].map(card => (
          <div
            key={card.key}
            className={`p-4 rounded-lg shadow cursor-pointer ${activeFilter === card.key ? `bg-${card.color}-100 border-${card.color}-500 border-2` : 'bg-white'}`}
            onClick={() => setActiveFilter(card.key)}
          >
            <div className="flex items-center space-x-2">
              <card.icon className={`text-${card.color}-500 text-2xl`} />
              <div>
                <h3 className="font-semibold text-gray-700">{card.title}</h3>
                <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variants Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Details ({filteredVariants.length} variants)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {['product_name', 'brand_name', 'category_name', 'variant_name', 'price', 'stock_quantity', 'in_carts_wishlists', 'availableStock', 'sold', 'status', 'lastUpdated', ''].map((key, idx) => (
                  <th
                    key={idx}
                    className="p-2 text-left text-gray-600 font-semibold cursor-pointer"
                    onClick={() => key && key !== '' && requestSort(key)}
                  >
                    {key === '' ? 'Actions' : key === 'variant_name' ? 'Variant Name' : key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    {sortConfig.key === key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedVariants.map(variant => (
                <tr key={variant.product_variant_id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{variant.product_name}</td>
                  <td className="p-2">{variant.brand_name}</td>
                  <td className="p-2">{variant.category_name}</td>
                  <td className="p-2">{variant.variant_name}</td>
                  <td className="p-2">₹{(variant.price || 0).toFixed(2)}</td>
                  <td className="p-2 text-blue-600 cursor-pointer" onClick={() => { setCurrentVariant(variant); setShowStockModal(true); }}>{variant.stock_quantity || 0}</td>
                  <td className="p-2 text-orange-600">{variant.in_carts_wishlists || 0}</td>
                  <td className="p-2 text-green-600">{variant.availableStock}</td>
                  <td className="p-2 text-purple-600">{variant.sold || 0}</td>
                  <td className={`p-2 ${variant.status === 'In Stock' ? 'text-green-600' : variant.status === 'Low' ? 'text-yellow-600' : 'text-red-600'}`}>{variant.status}</td>
                  <td className="p-2 text-gray-500 text-sm">{new Date(variant.lastUpdated).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex space-x-1">
                      <button title="Update Stock" className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700" onClick={() => { setCurrentVariant(variant); setShowStockModal(true); }}><FaBoxes /></button>
                      <button title="Edit Variant" className="bg-green-600 text-white p-1 rounded hover:bg-green-700" onClick={() => { setCurrentVariant(variant); setEditVariantName(variant.variant_name); setEditPrice(variant.price); setShowEditModal(true); }}><FaEdit /></button>
                      <button title="View Details" className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700" onClick={() => { setCurrentVariant(variant); setShowDetailsModal(true); }}><FaInfoCircle /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVariants.length)} of {filteredVariants.length} variants
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-lg disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
            <button className="px-3 py-1 border rounded-lg disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">{currentPage} of {totalPages}</span>
            <button className="px-3 py-1 border rounded-lg disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
            <button className="px-3 py-1 border rounded-lg disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Update Stock: {currentVariant.variant_name}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Variant ID</label><input className="w-full p-2 border rounded-lg bg-gray-100" value={currentVariant.product_variant_id} readOnly /></div>
                <div><label className="block text-sm font-medium">Variant Name</label><input className="w-full p-2 border rounded-lg bg-gray-100" value={currentVariant.variant_name} readOnly /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Brand</label><input className="w-full p-2 border rounded-lg bg-gray-100" value={currentVariant.brand_name} readOnly /></div>
                <div><label className="block text-sm font-medium">Category</label><input className="w-full p-2 border rounded-lg bg-gray-100" value={currentVariant.category_name} readOnly /></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium">Stock</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-blue-600" value={currentVariant.stock_quantity || 0} readOnly /></div>
                <div><label className="block text-sm font-medium">Items in Carts/Wishlists</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-orange-600" value={currentVariant.in_carts_wishlists || 0} readOnly /></div>
                <div><label className="block text-sm font-medium">Available</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-green-600" value={currentVariant.availableStock} readOnly /></div>
                <div><label className="block text-sm font-medium">Sold</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-purple-600" value={currentVariant.sold || 0} readOnly /></div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Stock Adjustment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium">Add Stock</label><input type="number" min="0" className="w-full p-2 border rounded-lg" value={addStock} onChange={(e) => setAddStock(parseInt(e.target.value) || 0)} /></div>
                  <div><label className="block text-sm font-medium">Reduce Stock</label><input type="number" min="0" className="w-full p-2 border rounded-lg" value={reduceStock} onChange={(e) => setAddStock(parseInt(e.target.value) || 0)} /></div>
                </div>
                {(addStock > 0 || reduceStock > 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p><strong>New Stock:</strong> {(currentVariant.stock_quantity || 0) + addStock - reduceStock}</p>
                    <p><strong>New Available:</strong> {Math.max(0, (currentVariant.stock_quantity || 0) + addStock - reduceStock - (currentVariant.in_carts_wishlists || 0))}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center" onClick={() => { setShowStockModal(false); setAddStock(0); setReduceStock(0); }}>
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  onClick={handleStockUpdate}
                  disabled={addStock === 0 && reduceStock === 0}
                >
                  <FaCheckCircle className="mr-2 text-lg" /> Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Variant Modal */}
      {showEditModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Variant: {currentVariant.variant_name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Variant Name</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  value={editVariantName}
                  onChange={(e) => setEditVariantName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-lg"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center" onClick={() => { setShowEditModal(false); setEditVariantName(''); setEditPrice(0); }}>
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  onClick={handleEditVariant}
                >
                  <FaCheckCircle className="mr-2 text-lg" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">View Details: {currentVariant.variant_name}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Variant ID</label><p className="p-2 text-sm bg-gray-100 rounded-lg">{currentVariant.product_variant_id}</p></div>
                <div><label className="block text-sm font-medium">Variant Name</label><p className="p-2 text-sm bg-gray-100 rounded-lg">{currentVariant.variant_name}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Product</label><p className="p-2 text-sm bg-gray-100 rounded-lg">{currentVariant.product_name}</p></div>
                <div><label className="block text-sm font-medium">Brand</label><p className="p-2 text-sm bg-gray-100 rounded-lg">{currentVariant.brand_name}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Category</label><p className="p-2 text-sm bg-gray-100 rounded-lg">{currentVariant.category_name}</p></div>
                <div><label className="block text-sm font-medium">Price</label><p className="p-2 text-sm bg-gray-100 rounded-lg">₹{currentVariant.price.toFixed(2)}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Stock</label><p className="p-2 text-sm bg-gray-100 rounded-lg text-blue-600">{currentVariant.stock_quantity}</p></div>
                <div><label className="block text-sm font-medium">Items in Carts/Wishlists</label><p className="p-2 text-sm bg-gray-100 rounded-lg text-orange-600">{currentVariant.in_carts_wishlists}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Available</label><p className="p-2 text-sm bg-gray-100 rounded-lg text-green-600">{currentVariant.availableStock}</p></div>
                <div><label className="block text-sm font-medium">Sold</label><p className="p-2 text-sm bg-gray-100 rounded-lg text-purple-600">{currentVariant.sold}</p></div>
              </div>
              <div>
                <label className="block text-sm font-medium">Last Updated</label>
                <p className="p-2 text-sm bg-gray-100 rounded-lg">{new Date(currentVariant.lastUpdated).toLocaleString()}</p>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center" onClick={() => { setShowDetailsModal(false); setCurrentVariant(null); }}>
                  <FaTimes className="mr-2" /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;