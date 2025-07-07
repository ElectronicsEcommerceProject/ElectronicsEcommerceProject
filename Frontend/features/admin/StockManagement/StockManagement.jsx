import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTruck,
  FaShoppingCart,
  FaTimes,
  FaSearch,
  FaFilter,
  FaTimes as FaClear,
  FaChevronDown,
  FaBoxes,
  FaInfoCircle,
} from "react-icons/fa";

// API imports
import {
  getApi,
  updateApiById,
  adminStockManagementVariantsRoute,
  adminStockManagementAnalyticsRoute,
  getAllCategoryRoute,
  getAllBrandsRoute,
} from "../../../src/index.js";

// SearchableDropdown Component
const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  displayKey = "name",
  valueKey = "id",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, displayKey]);

  const selectedOption = options.find((option) => option[valueKey] === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
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
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              Clear {placeholder}
            </button>
            {filteredOptions.map((option) => (
              <button
                key={option[valueKey]}
                className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                  onChange(option[valueKey]);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
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
    <button
      onClick={onRemove}
      className="ml-2 text-blue-600 hover:text-blue-800"
    >
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
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [globalSearch, setGlobalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "product_name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const [editVariantName, setEditVariantName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const itemsPerPage = 10;
  const debouncedGlobalSearch = useDebounce(globalSearch, 300);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading stock management data...");

      // Load all data in parallel
      const [
        variantsResponse,
        analyticsResponse,
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        getApi(adminStockManagementVariantsRoute),
        getApi(adminStockManagementAnalyticsRoute),
        getApi(getAllCategoryRoute),
        getApi(getAllBrandsRoute),
      ]);

      console.log(
        "✅ Stock variants loaded:",
        variantsResponse.data?.length || 0
      );
      console.log("✅ Analytics loaded:", analyticsResponse.data);
      console.log(
        "✅ Categories loaded:",
        categoriesResponse.data?.length || 0
      );
      console.log("✅ Brands loaded:", brandsResponse.data?.length || 0);

      setProductVariants(variantsResponse.data || []);
      setAnalyticsData(analyticsResponse.data || {});
      setCategories(categoriesResponse.data || []);
      setBrands(brandsResponse.data || []);
      setLowStockThreshold(
        analyticsResponse.lowStockThreshold ||
          variantsResponse.lowStockThreshold ||
          5
      );
    } catch (error) {
      console.error("❌ Error loading stock management data:", error);
      setError(error.message || "Failed to load stock management data");
    } finally {
      setLoading(false);
    }
  };

  const uniqueProducts = useMemo(() => {
    const productMap = new Map();
    productVariants.forEach((variant) => {
      if (!productMap.has(variant.product_id)) {
        productMap.set(variant.product_id, {
          id: variant.product_id,
          name: variant.product_name,
        });
      }
    });
    return Array.from(productMap.values());
  }, [productVariants]);

  const uniqueVariants = useMemo(() => {
    let variants = productVariants;
    if (productFilter)
      variants = variants.filter((v) => v.product_id === productFilter);
    return variants.map((v) => ({
      id: v.product_variant_id,
      name:
        v.description || v.sku || `Variant ${v.product_variant_id.slice(-8)}`,
    }));
  }, [productVariants, productFilter]);

  const filteredVariants = useMemo(() => {
    // Use the data as-is from API since it already includes calculated fields
    let filtered = productVariants.map((variant) => ({
      ...variant,
      // Ensure we have the calculated fields from API
      status: variant.status || "Unknown",
      availableStock: variant.availableStock || 0,
      reserved: variant.reserved || 0,
      sold: variant.sold || 0,
      lastUpdated:
        variant.updatedAt || variant.createdAt || new Date().toISOString(),
      // Map API field names to frontend expectations
      variant_name:
        variant.description ||
        variant.sku ||
        `Variant ${variant.product_variant_id.slice(-8)}`,
      in_carts_wishlists: variant.cartItems || 0, // Items currently in customer carts and wishlists
    }));

    if (debouncedGlobalSearch) {
      const searchLower = debouncedGlobalSearch.toLowerCase();
      filtered = filtered.filter(
        (variant) =>
          (variant.product_name || "").toLowerCase().includes(searchLower) ||
          (variant.variant_name || "").toLowerCase().includes(searchLower) ||
          (variant.brand_name || "").toLowerCase().includes(searchLower) ||
          (variant.category_name || "").toLowerCase().includes(searchLower) ||
          (variant.product_variant_id || "")
            .toLowerCase()
            .includes(searchLower) ||
          (variant.sku || "").toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (categoryFilter) {
      const category = categories.find((c) => c.category_id === categoryFilter);
      if (category) {
        filtered = filtered.filter((v) => v.category_name === category.name);
      }
    }

    // Filter by brand
    if (brandFilter) {
      const brand = brands.find((b) => b.brand_id === brandFilter);
      if (brand) {
        filtered = filtered.filter((v) => v.brand_name === brand.name);
      }
    }

    if (productFilter)
      filtered = filtered.filter((v) => v.product_id === productFilter);
    if (variantFilter)
      filtered = filtered.filter((v) => v.product_variant_id === variantFilter);
    if (statusFilter)
      filtered = filtered.filter((v) => v.status === statusFilter);

    switch (activeFilter) {
      case "inStock":
        filtered = filtered.filter((v) => v.status === "In Stock");
        break;
      case "lowStock":
        filtered = filtered.filter((v) => v.status === "Low");
        break;
      case "outStock":
        filtered = filtered.filter((v) => v.status === "Out of Stock");
        break;
      case "in_carts_wishlists":
        filtered = filtered.filter((v) => (v.in_carts_wishlists || 0) > 0);
        break;
      case "sold":
        filtered = filtered.filter((v) => (v.sold || 0) > 0);
        break;
      default:
        break;
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (sortConfig.direction === "asc") return aValue > bValue ? 1 : -1;
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
    brands,
  ]);

  const summaryData = useMemo(() => {
    // Use analytics data from API if available, otherwise calculate from filtered variants
    if (analyticsData && Object.keys(analyticsData).length > 0) {
      return {
        totalVariants: analyticsData.totalVariants || 0,
        inStock: analyticsData.inStock || 0,
        lowStock: analyticsData.lowStock || 0,
        outStock: analyticsData.outStock || 0,
        itemsInCartsWishlists: analyticsData.cartItems || 0,
        soldItems: analyticsData.soldItems || 0,
        totalStockValue: analyticsData.totalStockValue || 0,
      };
    }

    // Fallback to calculating from filtered variants
    return {
      totalVariants: filteredVariants.length,
      inStock: filteredVariants.filter((v) => v.status === "In Stock").length,
      lowStock: filteredVariants.filter((v) => v.status === "Low").length,
      outStock: filteredVariants.filter((v) => v.status === "Out of Stock")
        .length,
      itemsInCartsWishlists: filteredVariants.reduce(
        (sum, v) => sum + (v.in_carts_wishlists || 0),
        0
      ),
      soldItems: filteredVariants.reduce((sum, v) => sum + (v.sold || 0), 0),
      totalStockValue: filteredVariants.reduce(
        (sum, v) => sum + (v.stock_quantity || 0) * (v.price || 0),
        0
      ),
    };
  }, [filteredVariants, analyticsData]);

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
  const paginatedVariants = filteredVariants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActiveFilters = useCallback(() => {
    const filters = [];
    if (categoryFilter) {
      const category = categories.find((c) => c.category_id === categoryFilter);
      filters.push({
        key: "category",
        label: `Category: ${category?.name || categoryFilter}`,
        onRemove: () => setCategoryFilter(""),
      });
    }
    if (brandFilter) {
      const brand = brands.find((b) => b.brand_id === brandFilter);
      filters.push({
        key: "brand",
        label: `Brand: ${brand?.name || brandFilter}`,
        onRemove: () => setBrandFilter(""),
      });
    }
    if (productFilter) {
      const product = uniqueProducts.find((p) => p.id === productFilter);
      filters.push({
        key: "product",
        label: `Product: ${product?.name || productFilter}`,
        onRemove: () => setProductFilter(""),
      });
    }
    if (variantFilter) {
      const variant = uniqueVariants.find((v) => v.id === variantFilter);
      filters.push({
        key: "variant",
        label: `Variant: ${variant?.name || variantFilter}`,
        onRemove: () => setVariantFilter(""),
      });
    }
    if (statusFilter)
      filters.push({
        key: "status",
        label: `Status: ${statusFilter}`,
        onRemove: () => setStatusFilter(""),
      });
    return filters;
  }, [
    categoryFilter,
    brandFilter,
    productFilter,
    variantFilter,
    statusFilter,
    uniqueProducts,
    uniqueVariants,
    categories,
    brands,
  ]);

  const clearAllFilters = useCallback(() => {
    setGlobalSearch("");
    setCategoryFilter("");
    setBrandFilter("");
    setProductFilter("");
    setVariantFilter("");
    setStatusFilter("");
    setActiveFilter("all");
    setCurrentPage(1);
  }, []);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRefresh = () => {
    clearAllFilters();
    loadData();
  };

  const handleExportCSV = () => {
    const headers = [
      "Variant ID",
      "Product Name",
      "Brand",
      "Category",
      "Variant Name",
      "Price",
      "Stock Quantity",
      "In Carts/Wishlists",
      "Available",
      "Sold",
      "Status",
      "Last Updated",
    ];
    const csvRows = [headers.join(",")];
    filteredVariants.forEach((variant) => {
      csvRows.push(
        [
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
          `"${new Date(variant.lastUpdated).toLocaleString()}"`,
        ].join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stock_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert(`Exported ${filteredVariants.length} variants to CSV`);
  };

  const handleStockUpdate = async () => {
    if (!currentVariant || newStockQuantity < 0) {
      alert("Stock quantity cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      console.log(
        `🔄 Updating stock for variant ${currentVariant.product_variant_id} to ${newStockQuantity}`
      );

      // Use the stock management API endpoint with updateApiById
      const response = await updateApiById(
        adminStockManagementVariantsRoute,
        currentVariant.product_variant_id,
        {
          stock_quantity: parseInt(newStockQuantity),
        }
      );

      console.log("✅ Stock updated successfully:", response);

      // Update the local state with the response data
      setProductVariants((prev) =>
        prev.map((v) =>
          v.product_variant_id === currentVariant.product_variant_id
            ? { ...v, ...response.data, updatedAt: new Date().toISOString() }
            : v
        )
      );

      // Refresh analytics data
      const analyticsResponse = await getApi(
        adminStockManagementAnalyticsRoute
      );
      setAnalyticsData(analyticsResponse.data || {});

      setShowStockModal(false);
      setNewStockQuantity(0);
      alert(
        `Stock updated successfully for ${
          currentVariant.variant_name || currentVariant.sku
        }! New Stock: ${response.data.stock_quantity}`
      );
    } catch (error) {
      console.error("❌ Error updating stock:", error);
      alert(`Failed to update stock: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVariant = () => {
    if (!currentVariant) return;
    if (!editVariantName.trim() || editPrice <= 0) {
      alert("Variant name and price must be valid.");
      return;
    }
    // Note: This would need a separate API endpoint for updating variant details
    // For now, just update locally
    setProductVariants((prev) =>
      prev.map((v) =>
        v.product_variant_id === currentVariant.product_variant_id
          ? {
              ...v,
              variant_name: editVariantName,
              price: editPrice,
              updatedAt: new Date().toISOString(),
            }
          : v
      )
    );
    setShowEditModal(false);
    setEditVariantName("");
    setEditPrice(0);
    alert(`Variant ${currentVariant.variant_name} updated successfully!`);
  };

  if (loading)
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Loading Stock Data
              </h2>
              <p className="text-gray-600">
                Please wait while we fetch the latest inventory information...
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-red-200 max-w-md w-full">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimesCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Error Loading Data
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Please check your connection and try again.
              </p>
            </div>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <FaBoxes className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-2 md:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-md mb-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Stock Management
            </h1>
            <p className="text-sm text-gray-600">
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                <FaBox className="w-4 h-4 mr-2" />
                {summaryData.totalVariants} Variants
              </span>
              <span className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <FaShoppingCart className="w-4 h-4 mr-2" />₹
                {summaryData.totalStockValue.toFixed(2)} Total Value
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium text-sm"
              onClick={handleRefresh}
            >
              <FaBoxes className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-medium text-sm"
              onClick={handleExportCSV}
            >
              <FaShoppingCart className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-md mb-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <FaFilter className="mr-2 text-blue-600" /> Filters
          </h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200 flex items-center"
          >
            <FaClear className="mr-1" /> Clear All
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Global Search
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, variant, brand, category, or variant ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <SearchableDropdown
            options={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Category"
            valueKey="category_id"
          />
          <SearchableDropdown
            options={brands}
            value={brandFilter}
            onChange={setBrandFilter}
            placeholder="Brand"
            valueKey="brand_id"
          />
          <SearchableDropdown
            options={uniqueProducts}
            value={productFilter}
            onChange={setProductFilter}
            placeholder="Product"
          />
          <SearchableDropdown
            options={uniqueVariants}
            value={variantFilter}
            onChange={setVariantFilter}
            placeholder="Variant"
            displayKey="name"
          />
          <SearchableDropdown
            options={[
              { id: "In Stock", name: "In Stock" },
              { id: "Low", name: "Low" },
              { id: "Out of Stock", name: "Out of Stock" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
          />
        </div>

        {getActiveFilters().length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-800 mb-2 block">
              Active Filters ({getActiveFilters().length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {getActiveFilters().map((filter) => (
                <FilterChip
                  key={filter.key}
                  label={filter.label}
                  onRemove={filter.onRemove}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          {
            key: "all",
            title: "Total Variants",
            value: summaryData.totalVariants,
            icon: FaBox,
            color: "blue",
          },
          {
            key: "inStock",
            title: "In Stock",
            value: summaryData.inStock,
            icon: FaCheckCircle,
            color: "green",
          },
          {
            key: "lowStock",
            title: `Low Stock (<${lowStockThreshold})`,
            tooltip: `Items with available stock below ${lowStockThreshold} units`,
            value: summaryData.lowStock,
            icon: FaExclamationTriangle,
            color: "yellow",
          },
          {
            key: "outStock",
            title: "Out Stock",
            value: summaryData.outStock,
            icon: FaTimesCircle,
            color: "red",
          },
          {
            key: "in_carts_wishlists",
            title: "In Carts/Wishlists",
            value: summaryData.itemsInCartsWishlists,
            icon: FaTruck,
            color: "gray",
            tooltip:
              "Items temporarily allocated to customer carts and wishlists",
          },
          {
            key: "sold",
            title: "Sold/Delivered",
            value: summaryData.soldItems,
            icon: FaShoppingCart,
            color: "purple",
          },
        ].map((card) => (
          <div
            key={card.key}
            className={`p-3 rounded-lg shadow cursor-pointer transition-all duration-200 ${
              activeFilter === card.key
                ? `bg-${card.color}-100 border-${card.color}-500 border-2`
                : "bg-white hover:shadow-md"
            }`}
            onClick={() => setActiveFilter(card.key)}
            title={card.tooltip || ""}
          >
            <div className="flex flex-col items-center text-center space-y-1">
              <card.icon
                className={`text-${card.color}-500 text-lg flex-shrink-0`}
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-700 text-xs leading-tight truncate">
                  {card.title}
                </h3>
                <p className={`text-lg font-bold text-${card.color}-600`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variants Table */}
      <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Stock Details ({filteredVariants.length} variants)
          </h2>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {paginatedVariants.map((variant) => (
            <div
              key={variant.product_variant_id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {variant.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {variant.variant_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {variant.brand_name} • {variant.category_name}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    title="Update Stock"
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-xs"
                    onClick={() => {
                      setCurrentVariant(variant);
                      setNewStockQuantity(variant.stock_quantity || 0);
                      setShowStockModal(true);
                    }}
                  >
                    <FaBoxes />
                  </button>
                  <button
                    title="View Details"
                    className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 text-xs"
                    onClick={() => {
                      setCurrentVariant(variant);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FaInfoCircle />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">
                    ₹{(variant.price || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span
                    className="font-semibold text-blue-600 cursor-pointer"
                    onClick={() => {
                      setCurrentVariant(variant);
                      setNewStockQuantity(variant.stock_quantity || 0);
                      setShowStockModal(true);
                    }}
                  >
                    {variant.stock_quantity || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Carts:</span>
                  <span className="font-semibold text-orange-600">
                    {variant.in_carts_wishlists || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">
                    {variant.availableStock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sold:</span>
                  <span className="font-semibold text-purple-600">
                    {variant.sold || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${
                      variant.status === "In Stock"
                        ? "text-green-600"
                        : variant.status === "Low"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {variant.status === "Low"
                      ? `Low (<${lowStockThreshold})`
                      : variant.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                Updated: {new Date(variant.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View - Responsive for all desktop sizes */}
        <div className="hidden md:block">
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table
              className="w-full border-collapse bg-white"
              style={{ minWidth: "800px" }}
            >
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[15%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("product_name")}
                    >
                      <span>Product</span>
                      {sortConfig.key === "product_name" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[10%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("brand_name")}
                    >
                      <span>Brand</span>
                      {sortConfig.key === "brand_name" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[12%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("variant_name")}
                    >
                      <span>Variant</span>
                      {sortConfig.key === "variant_name" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[8%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("price")}
                    >
                      <span>Price</span>
                      {sortConfig.key === "price" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[6%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("stock_quantity")}
                    >
                      <span>Stock</span>
                      {sortConfig.key === "stock_quantity" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[6%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("in_carts_wishlists")}
                    >
                      <span>Carts</span>
                      {sortConfig.key === "in_carts_wishlists" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[7%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("availableStock")}
                    >
                      <span>Available</span>
                      {sortConfig.key === "availableStock" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[6%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("sold")}
                    >
                      <span>Sold</span>
                      {sortConfig.key === "sold" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[8%]">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("status")}
                    >
                      <span>Status</span>
                      {sortConfig.key === "status" && (
                        <span className="text-blue-600">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-gray-700 font-semibold text-xs uppercase tracking-wide w-[12%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedVariants.map((variant, index) => (
                  <tr
                    key={variant.product_variant_id}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td
                      className="px-2 py-2 text-gray-900 font-medium text-xs"
                      title={variant.product_name}
                    >
                      <div className="truncate">{variant.product_name}</div>
                    </td>
                    <td
                      className="px-2 py-2 text-gray-700 text-xs"
                      title={variant.brand_name}
                    >
                      <div className="truncate">{variant.brand_name}</div>
                    </td>
                    <td
                      className="px-2 py-2 text-gray-700 text-xs"
                      title={variant.variant_name}
                    >
                      <div className="truncate">{variant.variant_name}</div>
                    </td>
                    <td className="px-2 py-2 text-gray-900 font-semibold text-xs whitespace-nowrap">
                      ₹{(variant.price || 0).toFixed(0)}
                    </td>
                    <td
                      className="px-2 py-2 text-blue-600 font-bold cursor-pointer hover:text-blue-800 hover:bg-blue-100 rounded transition-all duration-150 text-xs text-center"
                      onClick={() => {
                        setCurrentVariant(variant);
                        setNewStockQuantity(variant.stock_quantity || 0);
                        setShowStockModal(true);
                      }}
                      title="Click to update stock"
                    >
                      {variant.stock_quantity || 0}
                    </td>
                    <td className="px-2 py-2 text-orange-600 font-semibold text-xs text-center">
                      {variant.in_carts_wishlists || 0}
                    </td>
                    <td className="px-2 py-2 text-green-600 font-semibold text-xs text-center">
                      {variant.availableStock}
                    </td>
                    <td className="px-2 py-2 text-purple-600 font-semibold text-xs text-center">
                      {variant.sold || 0}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-flex px-1 py-0.5 rounded text-xs font-semibold ${
                          variant.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : variant.status === "Low"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {variant.status === "In Stock"
                          ? "In"
                          : variant.status === "Out of Stock"
                          ? "Out"
                          : variant.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center space-x-1">
                        <button
                          title="Update Stock"
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors duration-150"
                          onClick={() => {
                            setCurrentVariant(variant);
                            setNewStockQuantity(variant.stock_quantity || 0);
                            setShowStockModal(true);
                          }}
                        >
                          <FaBoxes className="w-3 h-3" />
                        </button>
                        <button
                          title="View Details"
                          className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700 transition-colors duration-150"
                          onClick={() => {
                            setCurrentVariant(variant);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaInfoCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredVariants.length)} of{" "}
            {filteredVariants.length} variants
          </p>

          <div className="flex justify-center sm:justify-end">
            <nav className="flex items-center space-x-1">
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                First
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>

              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {currentPage} of {totalPages}
              </span>

              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Update Stock:{" "}
              <span className="text-blue-600">
                {currentVariant.variant_name}
              </span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Variant ID
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-sm"
                    value={currentVariant.product_variant_id}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Variant Name
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-sm"
                    value={currentVariant.variant_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-sm"
                    value={currentVariant.brand_name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-sm"
                    value={currentVariant.category_name}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">
                    Stock
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-blue-600 text-sm"
                    value={currentVariant.stock_quantity || 0}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">
                    In Carts
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-orange-600 text-sm"
                    value={currentVariant.in_carts_wishlists || 0}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">
                    Available
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-green-600 text-sm"
                    value={currentVariant.availableStock}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">
                    Sold
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg bg-gray-100 text-purple-600 text-sm"
                    value={currentVariant.sold || 0}
                    readOnly
                  />
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-base md:text-lg font-semibold mb-3">
                  Update Stock Quantity
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border rounded-lg text-lg"
                    value={newStockQuantity === 0 ? "" : newStockQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value) || 0;
                      setNewStockQuantity(
                        value === "" ? 0 : Math.max(0, numValue)
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter new stock quantity"
                  />
                </div>
                {newStockQuantity !== (currentVariant.stock_quantity || 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <strong>Current Stock:</strong>{" "}
                        {currentVariant.stock_quantity || 0}
                      </p>
                      <p>
                        <strong>New Stock:</strong> {newStockQuantity}
                      </p>
                      <p>
                        <strong>Change:</strong>
                        <span
                          className={
                            newStockQuantity -
                              (currentVariant.stock_quantity || 0) >=
                            0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {newStockQuantity -
                            (currentVariant.stock_quantity || 0) >=
                          0
                            ? "+"
                            : ""}
                          {newStockQuantity -
                            (currentVariant.stock_quantity || 0)}
                        </span>
                      </p>
                      <p>
                        <strong>New Available:</strong>
                        <span className="text-green-600">
                          {Math.max(
                            0,
                            newStockQuantity -
                              (currentVariant.in_carts_wishlists || 0)
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center"
                  onClick={() => {
                    setShowStockModal(false);
                    setNewStockQuantity(0);
                  }}
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                  onClick={handleStockUpdate}
                  disabled={
                    newStockQuantity === (currentVariant.stock_quantity || 0) ||
                    loading
                  }
                >
                  <FaCheckCircle className="mr-2 text-lg" />{" "}
                  {loading ? "Updating..." : "Update Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Variant Modal */}
      {showEditModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Edit Variant:{" "}
              <span className="text-green-600">
                {currentVariant.variant_name}
              </span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Variant Name
                </label>
                <input
                  className="w-full p-3 border rounded-lg text-sm"
                  value={editVariantName}
                  onChange={(e) => setEditVariantName(e.target.value)}
                  placeholder="Enter variant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border rounded-lg text-sm"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter price in rupees"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditVariantName("");
                    setEditPrice(0);
                  }}
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  onClick={handleEditVariant}
                >
                  <FaCheckCircle className="mr-2 text-lg" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && currentVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              View Details:{" "}
              <span className="text-gray-600">
                {currentVariant.variant_name}
              </span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Variant ID
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg break-all">
                    {currentVariant.product_variant_id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Variant Name
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg">
                    {currentVariant.variant_name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg">
                    {currentVariant.product_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Brand
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg">
                    {currentVariant.brand_name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg">
                    {currentVariant.category_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <p className="p-2 text-sm bg-gray-100 rounded-lg font-semibold">
                    ₹{currentVariant.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Stock Information Grid */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Stock Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <label className="block text-xs font-medium text-gray-600">
                      Current Stock
                    </label>
                    <p className="text-lg font-bold text-blue-600">
                      {currentVariant.stock_quantity}
                    </p>
                  </div>
                  <div className="text-center">
                    <label className="block text-xs font-medium text-gray-600">
                      In Carts/Wishlists
                    </label>
                    <p className="text-lg font-bold text-orange-600">
                      {currentVariant.in_carts_wishlists || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <label className="block text-xs font-medium text-gray-600">
                      Available
                    </label>
                    <p className="text-lg font-bold text-green-600">
                      {currentVariant.availableStock}
                    </p>
                  </div>
                  <div className="text-center">
                    <label className="block text-xs font-medium text-gray-600">
                      Sold
                    </label>
                    <p className="text-lg font-bold text-purple-600">
                      {currentVariant.sold}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Updated
                </label>
                <p className="p-2 text-sm bg-gray-100 rounded-lg">
                  {new Date(currentVariant.lastUpdated).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setCurrentVariant(null);
                  }}
                >
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
