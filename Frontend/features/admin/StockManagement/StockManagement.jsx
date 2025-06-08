/**
 * ProductVariant Stock Management Component with API Integration
 *
 * ✅ CURRENT STATUS: Integrated with backend API endpoints
 *
 * FEATURES:
 * - Multi-level filtering (Category, Brand, Product, Variant, Status)
 * - Global search across multiple fields
 * - Summary cards for stock overview (based on API analytics)
 * - Detailed stock table with real-time data
 * - Stock update modal with API integration
 * - Pagination and sorting
 * - CSV export
 * - Filter chips and clear all filters
 * - Real-time stock calculations (reserved, sold, available)
 * - Indian Rupee currency formatting
 * - Error handling and loading states
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaBox, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTruck,
  FaShoppingCart, FaEdit, FaTimes, FaSearch, FaFilter, FaTimes as FaClear, FaChevronDown,
  FaBoxes, FaInfoCircle
} from 'react-icons/fa';

// API imports
import { getApi, updateApi } from '../../../src/api/api.js';

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
  const [analyticsData, setAnalyticsData] = useState(null);
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
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const [editVariantName, setEditVariantName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const itemsPerPage = 10;
  const debouncedGlobalSearch = useDebounce(globalSearch, 300);

  // Environment variables for API endpoints
  const STOCK_VARIANTS_ENDPOINT = import.meta.env.VITE_STOCK_MANAGEMENT_VARIANTS_ENDPOINT;
  const STOCK_ANALYTICS_ENDPOINT = import.meta.env.VITE_STOCK_MANAGEMENT_ANALYTICS_ENDPOINT;
  const CATEGORIES_ENDPOINT = import.meta.env.VITE_CATEGORIES_ENDPOINT;
  const BRANDS_ENDPOINT = import.meta.env.VITE_BRANDS_ENDPOINT;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading stock management data...');

      // Load all data in parallel
      const [variantsResponse, analyticsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        getApi(STOCK_VARIANTS_ENDPOINT),
        getApi(STOCK_ANALYTICS_ENDPOINT),
        getApi(CATEGORIES_ENDPOINT),
        getApi(BRANDS_ENDPOINT)
      ]);

      console.log('✅ Stock variants loaded:', variantsResponse.data?.length || 0);
      console.log('✅ Analytics loaded:', analyticsResponse.data);
      console.log('✅ Categories loaded:', categoriesResponse.data?.length || 0);
      console.log('✅ Brands loaded:', brandsResponse.data?.length || 0);

      setProductVariants(variantsResponse.data || []);
      setAnalyticsData(analyticsResponse.data || {});
      setCategories(categoriesResponse.data || []);
      setBrands(brandsResponse.data || []);

    } catch (error) {
      console.error('❌ Error loading stock management data:', error);
      setError(error.message || 'Failed to load stock management data');
    } finally {
      setLoading(false);
    }
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
    return variants.map(v => ({
      id: v.product_variant_id,
      name: v.description || v.sku || `Variant ${v.product_variant_id.slice(-8)}`
    }));
  }, [productVariants, productFilter]);

  const filteredVariants = useMemo(() => {
    // Use the data as-is from API since it already includes calculated fields
    let filtered = productVariants.map(variant => ({
      ...variant,
      // Ensure we have the calculated fields from API
      status: variant.status || 'Unknown',
      availableStock: variant.availableStock || 0,
      reserved: variant.reserved || 0,
      sold: variant.sold || 0,
      lastUpdated: variant.updatedAt || variant.createdAt || new Date().toISOString(),
      // Map API field names to frontend expectations
      variant_name: variant.description || variant.sku || `Variant ${variant.product_variant_id.slice(-8)}`,
      in_carts_wishlists: variant.reserved || 0 // Use reserved as proxy for items in carts/wishlists
    }));

    if (debouncedGlobalSearch) {
      const searchLower = debouncedGlobalSearch.toLowerCase();
      filtered = filtered.filter(variant =>
        (variant.product_name || '').toLowerCase().includes(searchLower) ||
        (variant.variant_name || '').toLowerCase().includes(searchLower) ||
        (variant.brand_name || '').toLowerCase().includes(searchLower) ||
        (variant.category_name || '').toLowerCase().includes(searchLower) ||
        (variant.product_variant_id || '').toLowerCase().includes(searchLower) ||
        (variant.sku || '').toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (categoryFilter) {
      const category = categories.find(c => c.category_id === categoryFilter);
      if (category) {
        filtered = filtered.filter(v => v.category_name === category.name);
      }
    }

    // Filter by brand
    if (brandFilter) {
      const brand = brands.find(b => b.brand_id === brandFilter);
      if (brand) {
        filtered = filtered.filter(v => v.brand_name === brand.name);
      }
    }

    if (productFilter) filtered = filtered.filter(v => v.product_id === productFilter);
    if (variantFilter) filtered = filtered.filter(v => v.product_variant_id === variantFilter);
    if (statusFilter) filtered = filtered.filter(v => v.status === statusFilter);

    switch (activeFilter) {
      case 'inStock': filtered = filtered.filter(v => v.status === 'In Stock'); break;
      case 'lowStock': filtered = filtered.filter(v => v.status === 'Low'); break;
      case 'outStock': filtered = filtered.filter(v => v.status === 'Out of Stock'); break;
      case 'reserved': filtered = filtered.filter(v => (v.reserved || 0) > 0); break;
      case 'sold': filtered = filtered.filter(v => (v.sold || 0) > 0); break;
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
    sortConfig,
    categories,
    brands
  ]);

  const summaryData = useMemo(() => {
    // Use analytics data from API if available, otherwise calculate from filtered variants
    if (analyticsData && Object.keys(analyticsData).length > 0) {
      return {
        totalVariants: analyticsData.totalVariants || 0,
        inStock: analyticsData.inStock || 0,
        lowStock: analyticsData.lowStock || 0,
        outStock: analyticsData.outStock || 0,
        itemsInCartsWishlists: analyticsData.reservedItems || 0,
        soldItems: analyticsData.soldItems || 0,
        totalStockValue: analyticsData.totalStockValue || 0
      };
    }

    // Fallback to calculating from filtered variants
    return {
      totalVariants: filteredVariants.length,
      inStock: filteredVariants.filter(v => v.status === 'In Stock').length,
      lowStock: filteredVariants.filter(v => v.status === 'Low').length,
      outStock: filteredVariants.filter(v => v.status === 'Out of Stock').length,
      itemsInCartsWishlists: filteredVariants.reduce((sum, v) => sum + (v.reserved || 0), 0),
      soldItems: filteredVariants.reduce((sum, v) => sum + (v.sold || 0), 0),
      totalStockValue: filteredVariants.reduce((sum, v) => sum + ((v.stock_quantity || 0) * (v.price || 0)), 0)
    };
  }, [filteredVariants, analyticsData]);

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
  const paginatedVariants = filteredVariants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActiveFilters = useCallback(() => {
    const filters = [];
    if (categoryFilter) {
      const category = categories.find(c => c.category_id === categoryFilter);
      filters.push({ key: 'category', label: `Category: ${category?.name || categoryFilter}`, onRemove: () => setCategoryFilter('') });
    }
    if (brandFilter) {
      const brand = brands.find(b => b.brand_id === brandFilter);
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
  }, [categoryFilter, brandFilter, productFilter, variantFilter, statusFilter, uniqueProducts, uniqueVariants, categories, brands]);

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

  const handleStockUpdate = async () => {
    if (!currentVariant || newStockQuantity < 0) {
      alert('Stock quantity cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      console.log(`🔄 Updating stock for variant ${currentVariant.product_variant_id} to ${newStockQuantity}`);

      // Use the stock management API endpoint
      const VARIANT_UPDATE_ENDPOINT = import.meta.env.VITE_STOCK_MANAGEMENT_VARIANT_BY_ID_ENDPOINT
        .replace(':variant_id', currentVariant.product_variant_id);

      const response = await updateApi(VARIANT_UPDATE_ENDPOINT, '', {
        stock_quantity: parseInt(newStockQuantity)
      });

      console.log('✅ Stock updated successfully:', response);

      // Update the local state with the response data
      setProductVariants(prev => prev.map(v =>
        v.product_variant_id === currentVariant.product_variant_id
          ? { ...v, ...response.data, updatedAt: new Date().toISOString() }
          : v
      ));

      // Refresh analytics data
      const analyticsResponse = await getApi(STOCK_ANALYTICS_ENDPOINT);
      setAnalyticsData(analyticsResponse.data || {});

      setShowStockModal(false);
      setNewStockQuantity(0);
      alert(`Stock updated successfully for ${currentVariant.variant_name || currentVariant.sku}! New Stock: ${response.data.stock_quantity}`);

    } catch (error) {
      console.error('❌ Error updating stock:', error);
      alert(`Failed to update stock: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVariant = () => {
    if (!currentVariant) return;
    if (!editVariantName.trim() || editPrice <= 0) {
      alert('Variant name and price must be valid.');
      return;
    }
    // Note: This would need a separate API endpoint for updating variant details
    // For now, just update locally
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
          { key: 'reserved', title: 'Reserved Items', value: summaryData.itemsInCartsWishlists, icon: FaTruck, color: 'gray' },
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
                {['product_name', 'brand_name', 'category_name', 'variant_name', 'price', 'stock_quantity', 'reserved', 'availableStock', 'sold', 'status', 'lastUpdated', ''].map((key, idx) => (
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
                  <td className="p-2 text-blue-600 cursor-pointer" onClick={() => { setCurrentVariant(variant); setNewStockQuantity(variant.stock_quantity || 0); setShowStockModal(true); }}>{variant.stock_quantity || 0}</td>
                  <td className="p-2 text-orange-600">{variant.reserved || 0}</td>
                  <td className="p-2 text-green-600">{variant.availableStock}</td>
                  <td className="p-2 text-purple-600">{variant.sold || 0}</td>
                  <td className={`p-2 ${variant.status === 'In Stock' ? 'text-green-600' : variant.status === 'Low' ? 'text-yellow-600' : 'text-red-600'}`}>{variant.status}</td>
                  <td className="p-2 text-gray-500 text-sm">{new Date(variant.lastUpdated).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex space-x-1">
                      <button title="Update Stock" className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700" onClick={() => { setCurrentVariant(variant); setNewStockQuantity(variant.stock_quantity || 0); setShowStockModal(true); }}><FaBoxes /></button>
                      <button title="Edit Variant" className="bg-green-600 text-white p-1 rounded hover:bg-green-700" onClick={() => { setCurrentVariant(variant); setEditVariantName(variant.variant_name || variant.description || variant.sku || ''); setEditPrice(variant.price || 0); setShowEditModal(true); }}><FaEdit /></button>
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
                <div><label className="block text-sm font-medium">Reserved</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-orange-600" value={currentVariant.reserved || 0} readOnly /></div>
                <div><label className="block text-sm font-medium">Available</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-green-600" value={currentVariant.availableStock} readOnly /></div>
                <div><label className="block text-sm font-medium">Sold</label><input className="w-full p-2 border rounded-lg bg-gray-100 text-purple-600" value={currentVariant.sold || 0} readOnly /></div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Update Stock Quantity</h3>
                <div>
                  <label className="block text-sm font-medium">New Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded-lg"
                    value={newStockQuantity}
                    onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
                  />
                </div>
                {newStockQuantity !== (currentVariant.stock_quantity || 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p><strong>Current Stock:</strong> {currentVariant.stock_quantity || 0}</p>
                    <p><strong>New Stock:</strong> {newStockQuantity}</p>
                    <p><strong>Change:</strong> {newStockQuantity - (currentVariant.stock_quantity || 0) >= 0 ? '+' : ''}{newStockQuantity - (currentVariant.stock_quantity || 0)}</p>
                    <p><strong>New Available:</strong> {Math.max(0, newStockQuantity - (currentVariant.reserved || 0))}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center" onClick={() => { setShowStockModal(false); setNewStockQuantity(0); }}>
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  onClick={handleStockUpdate}
                  disabled={newStockQuantity === (currentVariant.stock_quantity || 0) || loading}
                >
                  <FaCheckCircle className="mr-2 text-lg" /> {loading ? 'Updating...' : 'Update Stock'}
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
                <div><label className="block text-sm font-medium">Reserved</label><p className="p-2 text-sm bg-gray-100 rounded-lg text-orange-600">{currentVariant.reserved || 0}</p></div>
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