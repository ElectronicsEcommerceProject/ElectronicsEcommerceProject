import React, { useState, useEffect } from 'react';

const StockAdminPanel = () => {
  // Data
  const initialProducts = [
    { id: 1, image: '🧥', product: 'Hoodie', brand: 'Puma', category: 'Fashion', sku: 'PUM123', inStock: 8, reserved: 2, sold: 35, totalStock: 10, status: '🔴 Low', minStock: 10, lastUpdated: '06-Jun-2025 14:30' },
    { id: 2, image: '👟', product: 'Sneakers', brand: 'Nike', category: 'Footwear', sku: 'NIK456', inStock: 15, reserved: 5, sold: 50, totalStock: 20, status: '🟢 In Stock', minStock: 8, lastUpdated: '06-Jun-2025 15:00' },
    { id: 3, image: '📱', product: 'Galaxy S23', brand: 'Samsung', category: 'Electronics', sku: 'SAM789', inStock: 3, reserved: 1, sold: 20, totalStock: 4, status: '🔴 Low', minStock: 5, lastUpdated: '06-Jun-2025 10:00' },
    { id: 4, image: '🧢', product: 'Cap', brand: 'Adidas', category: 'Fashion', sku: 'ADI101', inStock: 0, reserved: 0, sold: 15, totalStock: 0, status: '⚫ Out of Stock', minStock: 5, lastUpdated: '06-Jun-2025 12:00' },
    { id: 5, image: '🎧', product: 'Headphones', brand: 'Sony', category: 'Electronics', sku: 'SON202', inStock: 12, reserved: 3, sold: 40, totalStock: 15, status: '🟢 In Stock', minStock: 10, lastUpdated: '06-Jun-2025 09:30' },
    { id: 6, image: '👕', product: 'T-Shirt', brand: 'Under Armour', category: 'Fashion', sku: 'UND303', inStock: 20, reserved: 4, sold: 60, totalStock: 24, status: '🟢 In Stock', minStock: 15, lastUpdated: '06-Jun-2025 11:45' },
    { id: 7, image: '🏀', product: 'Basketball', brand: 'Wilson', category: 'Sports', sku: 'WIL404', inStock: 5, reserved: 2, sold: 25, totalStock: 7, status: '🔴 Low', minStock: 8, lastUpdated: '06-Jun-2025 13:20' },
    { id: 8, image: '⌚', product: 'Smartwatch', brand: 'Apple', category: 'Electronics', sku: 'APP505', inStock: 2, reserved: 1, sold: 30, totalStock: 3, status: '🔴 Low', minStock: 5, lastUpdated: '06-Jun-2025 16:00' },
    { id: 9, image: '🩳', product: 'Shorts', brand: 'Reebok', category: 'Fashion', sku: 'REE606', inStock: 10, reserved: 0, sold: 18, totalStock: 10, status: '🟢 In Stock', minStock: 8, lastUpdated: '06-Jun-2025 08:00' },
    { id: 10, image: '⚽', product: 'Soccer Ball', brand: 'Adidas', category: 'Sports', sku: 'ADI707', inStock: 7, reserved: 3, sold: 22, totalStock: 10, status: '🔴 Low', minStock: 10, lastUpdated: '06-Jun-2025 17:00' }
  ];

  // State
  const [products, setProducts] = useState(initialProducts);
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [addStock, setAddStock] = useState(0);
  const [reduceStock, setReduceStock] = useState(0);
  const [reason, setReason] = useState('New batch');
  const [activeFilter, setActiveFilter] = useState('all');

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filteredData = initialProducts.filter(product => {
      const matchesSearch = !searchTerm ||
        product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesBrand = !brandFilter || product.brand === brandFilter;
      const matchesStatus = !statusFilter || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
    
    // Apply the active summary card filter
    let finalFilteredData = filteredData;
    switch (activeFilter) {
      case 'inStock':
        finalFilteredData = filteredData.filter(p => p.status.includes('In Stock'));
        break;
      case 'lowStock':
        finalFilteredData = filteredData.filter(p => p.status.includes('Low'));
        break;
      case 'outStock':
        finalFilteredData = filteredData.filter(p => p.status.includes('Out'));
        break;
      case 'reserved':
        finalFilteredData = filteredData.filter(p => p.reserved > 0);
        break;
      case 'sold':
        finalFilteredData = filteredData.filter(p => p.sold > 0);
        break;
      default:
        finalFilteredData = filteredData;
    }
    
    setDisplayedProducts(finalFilteredData);
  }, [searchTerm, categoryFilter, brandFilter, statusFilter, activeFilter]);

  // Update summary cards
  const summaryData = {
    totalProducts: initialProducts.length,
    inStock: initialProducts.filter(p => p.status.includes('In Stock')).length,
    lowStock: initialProducts.filter(p => p.status.includes('Low')).length,
    outStock: initialProducts.filter(p => p.status.includes('Out')).length,
    reservedItems: initialProducts.reduce((sum, p) => sum + p.reserved, 0),
    soldItems: initialProducts.reduce((sum, p) => sum + p.sold, 0)
  };

  // Handle stock update
  const handleStockUpdate = () => {
    if (!currentProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === currentProduct.id) {
        const newInStock = Math.max(0, p.inStock + (addStock || 0) - (reduceStock || 0));
        return {
          ...p,
          inStock: newInStock,
          totalStock: newInStock + p.reserved,
          status: newInStock <= 0 ? '⚫ Out of Stock' : newInStock < p.minStock ? '🔴 Low' : '🟢 In Stock',
          lastUpdated: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setDisplayedProducts(updatedProducts);
    setShowStockModal(false);
    setAddStock(0);
    setReduceStock(0);
    alert(`Stock updated for ${currentProduct.product}. Reason: ${reason}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setStatusFilter('');
    setActiveFilter('all');
    setDisplayedProducts(products);
    alert('Stock data refreshed.');
  };

  // Handle export to CSV
  const handleExport = () => {
    const headers = ['Image', 'Product', 'Brand', 'Category', 'SKU', 'In Stock', 'Reserved', 'Sold', 'Total Stock', 'Status', 'Min Stock', 'Last Updated'];
    const csvRows = [headers.join(',')];
    
    const dataToExport = displayedProducts.map(product => [
      product.image,
      `"${product.product}"`,
      product.brand,
      product.category,
      product.sku,
      product.inStock,
      product.reserved,
      product.sold,
      product.totalStock,
      `"${product.status}"`,
      product.minStock,
      `"${product.lastUpdated}"`
    ].join(','));
    
    csvRows.push(...dataToExport);
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Bar */}
      <div className="bg-white p-4 shadow flex flex-wrap justify-between items-center gap-4">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by product, SKU, brand..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="p-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fashion">Fashion</option>
            <option value="Footwear">Footwear</option>
            <option value="Electronics">Electronics</option>
            <option value="Sports">Sports</option>
          </select>
          <select
            className="p-2 border rounded"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">All Brands</option>
            <option value="Puma">Puma</option>
            <option value="Nike">Nike</option>
            <option value="Samsung">Samsung</option>
            <option value="Adidas">Adidas</option>
            <option value="Sony">Sony</option>
            <option value="Under Armour">Under Armour</option>
            <option value="Wilson">Wilson</option>
            <option value="Apple">Apple</option>
            <option value="Reebok">Reebok</option>
          </select>
          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="🟢 In Stock">In Stock</option>
            <option value="🔴 Low">Low Stock</option>
            <option value="⚫ Out of Stock">Out of Stock</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleRefresh}
          >
            Refresh
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleExport}
          >
            Export CSV
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={() => alert('Bulk upload CSV feature triggered.')}
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'all' ? 'bg-blue-200' : 'bg-blue-100'
          }`}
          onClick={() => setActiveFilter('all')}
        >
          <h3 className="font-bold">Total Products</h3>
          <p className="text-2xl text-blue-600">{summaryData.totalProducts}</p>
        </div>
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'inStock' ? 'bg-green-200' : 'bg-green-100'
          }`}
          onClick={() => setActiveFilter('inStock')}
        >
          <h3 className="font-bold">In Stock</h3>
          <p className="text-2xl text-green-600">{summaryData.inStock}</p>
        </div>
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'lowStock' ? 'bg-orange-200' : 'bg-orange-100'
          }`}
          onClick={() => setActiveFilter('lowStock')}
        >
          <h3 className="font-bold">Low Stock (&lt;10 pcs)</h3>
          <p className="text-2xl text-orange-600">{summaryData.lowStock}</p>
        </div>
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'outStock' ? 'bg-red-200' : 'bg-red-100'
          }`}
          onClick={() => setActiveFilter('outStock')}
        >
          <h3 className="font-bold">Out of Stock</h3>
          <p className="text-2xl text-red-600">{summaryData.outStock}</p>
        </div>
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'reserved' ? 'bg-gray-200' : 'bg-gray-100'
          }`}
          onClick={() => setActiveFilter('reserved')}
        >
          <h3 className="font-bold">Reserved Items</h3>
          <p className="text-2xl text-gray-600">{summaryData.reservedItems}</p>
        </div>
        <div
          className={`summary-card p-4 rounded shadow cursor-pointer hover:transform hover:scale-105 transition-transform ${
            activeFilter === 'sold' ? 'bg-yellow-200' : 'bg-yellow-100'
          }`}
          onClick={() => setActiveFilter('sold')}
        >
          <h3 className="font-bold">Sold Items</h3>
          <p className="text-2xl text-yellow-600">{summaryData.soldItems}</p>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white p-4 m-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Product Stock</h2>
        <div className="table-container max-h-[500px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Product Image</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Product Name</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Brand</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Category</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">SKU</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">In Stock</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Reserved</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Sold</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Total Stock</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Status</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Min Stock</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Last Updated</th>
                <th className="p-2 text-left border-b bg-gray-100 sticky top-0 z-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">
                    <span className="thumbnail hover:transform hover:scale-200 transition-transform">
                      {product.image}
                    </span>
                  </td>
                  <td className="p-2">
                    <a href={`#edit/${product.id}`} className="text-blue-500 hover:underline">
                      {product.product}
                    </a>
                  </td>
                  <td className="p-2">{product.brand}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">
                    <span className="flex items-center">
                      {product.sku}
                      <span
                        className="copy-btn ml-2 hover:cursor-pointer hover:text-blue-500"
                        onClick={() => {
                          navigator.clipboard.writeText(product.sku);
                          alert('SKU copied!');
                        }}
                      >
                        📋
                      </span>
                    </span>
                  </td>
                  <td
                    className="p-2 in-stock font-bold hover:underline cursor-pointer"
                    onClick={() => {
                      setCurrentProduct(product);
                      setShowStockModal(true);
                    }}
                  >
                    {product.inStock}
                  </td>
                  <td className="p-2 relative tooltip">
                    {product.reserved}
                    <span className="tooltip-text bg-gray-800 text-white p-1 rounded absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible transition-opacity">
                      {product.reserved} orders
                    </span>
                  </td>
                  <td className="p-2">{product.sold}</td>
                  <td className="p-2">{product.totalStock}</td>
                  <td className={`p-2 ${
                    product.status.includes('In Stock') ? 'text-green-600' :
                    product.status.includes('Low') ? 'text-orange-500' : 'text-red-600'
                  }`}>
                    {product.status}
                  </td>
                  <td className="p-2">{product.minStock}</td>
                  <td className="p-2 text-gray-500 text-sm">{product.lastUpdated}</td>
                  <td className="p-2">
                    <button
                      className="edit-btn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setCurrentProduct(product);
                        setShowStockModal(true);
                      }}
                    >
                      ✏️ Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Stock</h2>
            <div className="mb-4">
              <label className="block font-semibold">Product Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentProduct.product}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Current Stock</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={currentProduct.inStock}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Add Stock</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={addStock}
                onChange={(e) => setAddStock(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Reduce Stock</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={reduceStock}
                onChange={(e) => setReduceStock(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Reason for Change</label>
              <select
                className="w-full p-2 border rounded"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="New batch">New batch</option>
                <option value="Return">Return</option>
                <option value="Manual fix">Manual fix</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => {
                  setShowStockModal(false);
                  setAddStock(0);
                  setReduceStock(0);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleStockUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAdminPanel;