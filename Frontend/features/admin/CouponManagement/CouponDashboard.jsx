import React, { useState } from 'react';

// Sample coupon data
const initialCoupons = [
  { 
    id: 1, 
    code: "SAVE10", 
    discount: "10%", 
    validity: "2025-12-31", 
    minOrder: 50, 
    status: "Active", 
    type: "Percentage", 
    product: "All", 
    role: "Customer" 
  },
  { 
    id: 2, 
    code: "FLAT50", 
    discount: "$50", 
    validity: "2025-06-30", 
    minOrder: 100, 
    status: "Inactive", 
    type: "Flat", 
    product: "Laptop", 
    role: "Retailer" 
  }
];

const CouponForm = ({ coupon = null, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discountType: coupon?.type || "Percentage",
    discountValue: coupon?.discount ? parseFloat(coupon.discount.replace(/%|\$/g, '')) || 0 : 0,
    validity: coupon?.validity || "",
    product: coupon?.product || "All",
    role: coupon?.role || "Customer",
    minOrder: coupon?.minOrder || 0,
    usageLimit: coupon?.usageLimit || "",
    autoApply: coupon?.autoApply || false,
    stackable: coupon?.stackable || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      alert("Coupon code is required");
      return;
    }
    if (formData.discountValue <= 0) {
      alert("Discount value must be greater than 0");
      return;
    }
    if (!formData.validity) {
      alert("Validity date is required");
      return;
    }

    const newCoupon = {
      id: coupon?.id || Date.now(),
      code: formData.code,
      discount: formData.discountType === "Percentage" 
        ? `${formData.discountValue}%` 
        : `$${formData.discountValue}`,
      type: formData.discountType,
      validity: formData.validity,
      minOrder: parseFloat(formData.minOrder) || 0,
      status: coupon?.status || "Active",
      product: formData.product,
      role: formData.role,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      autoApply: formData.autoApply,
      stackable: formData.stackable,
    };

    onSave(newCoupon);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-slide-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {coupon ? "EDIT COUPON" : "CREATE COUPON"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">COUPON CODE *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              placeholder="e.g., SAVE10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">DISCOUNT TYPE *</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                required
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {formData.discountType === "Percentage" ? "DISCOUNT % *" : "DISCOUNT AMOUNT *"}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">VALIDITY DATE *</label>
            <input
              type="date"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">APPLICABLE PRODUCT *</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                required
              >
                <option value="All">All Products</option>
                <option value="Laptop">Laptops</option>
                <option value="Smartphone">Smartphones</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">USER ROLE *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
                required
              >
                <option value="Customer">Customer</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">MINIMUM ORDER ($)</label>
            <input
              type="number"
              name="minOrder"
              value={formData.minOrder}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">USAGE LIMIT</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              min="1"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="autoApply"
                checked={formData.autoApply}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-bold text-gray-700">AUTO-APPLY</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="stackable"
                checked={formData.stackable}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-bold text-gray-700">STACKABLE</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
            >
              {coupon ? "UPDATE COUPON" : "CREATE COUPON"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CouponTable = ({ coupons, onAction, onEdit }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
          <th className="py-4 px-6 text-left font-bold">CODE</th>
          <th className="py-4 px-6 text-left font-bold">DISCOUNT</th>
          <th className="py-4 px-6 text-left font-bold">VALIDITY</th>
          <th className="py-4 px-6 text-center font-bold">MIN ORDER</th>
          <th className="py-4 px-6 text-center font-bold">STATUS</th>
          <th className="py-4 px-6 text-center font-bold">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm">
        {coupons.map(coupon => (
          <tr key={coupon.id} className="border-b hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6 font-bold">{coupon.code}</td>
            <td className="py-4 px-6 font-bold">{coupon.discount}</td>
            <td className="py-4 px-6 font-bold">{coupon.validity}</td>
            <td className="py-4 px-6 text-center font-bold">${coupon.minOrder}</td>
            <td className="py-4 px-6 text-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={coupon.status === "Active"}
                  onChange={() => onAction(coupon.id, coupon.status === "Active" ? "Deactivate" : "Activate")}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${coupon.status === "Active" ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </td>
            <td className="py-4 px-6 text-center flex justify-center space-x-2">
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition font-bold"
                onClick={() => onEdit(coupon)}
              >
                EDIT
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-bold"
                onClick={() => onAction(coupon.id, "Delete")}
              >
                DELETE
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnalyticsDashboard = () => (
  <div className="p-6 animate-slide-in">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">COUPON ANALYTICS</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">USAGE STATISTICS</h4>
        <svg className="w-full h-48" viewBox="0 0 400 200">
          <rect x="50" y="120" width="50" height="80" fill="#3B82F6" />
          <rect x="120" y="80" width="50" height="120" fill="#10B981" />
          <rect x="190" y="50" width="50" height="150" fill="#8B5CF6" />
          <rect x="260" y="100" width="50" height="100" fill="#F59E0B" />
          <text x="75" y="195" fontSize="12" fill="#4B5563" textAnchor="middle" fontWeight="bold">Q1</text>
          <text x="145" y="195" fontSize="12" fill="#4B5563" textAnchor="middle" fontWeight="bold">Q2</text>
          <text x="215" y="195" fontSize="12" fill="#4B5563" textAnchor="middle" fontWeight="bold">Q3</text>
          <text x="285" y="195" fontSize="12" fill="#4B5563" textAnchor="middle" fontWeight="bold">Q4</text>
          <text x="75" y="110" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">320</text>
          <text x="145" y="70" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">480</text>
          <text x="215" y="40" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">600</text>
          <text x="285" y="90" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">400</text>
        </svg>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">REDEMPTION RATE</h4>
        <svg className="w-full h-48" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="#14B8A6" stroke="#fff" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="50.24" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="80" fill="#F87171" stroke="#fff" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="200.96" transform="rotate(-90 100 100)" />
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">75%</text>
          <text x="100" y="130" textAnchor="middle" fontSize="12" fill="#4B5563" fontWeight="bold">REDEMPTION RATE</text>
        </svg>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">TOP-PERFORMING COUPONS</h4>
        <div className="space-y-4">
          {[
            { code: "SAVE10", redemption: "85%", color: "bg-blue-500" },
            { code: "FLAT50", redemption: "70%", color: "bg-green-500" },
            { code: "FREESHIP", redemption: "65%", color: "bg-purple-500" }
          ].map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className={`inline-block w-4 h-4 ${item.color} rounded-full mr-3`}></span>
              <span className="flex-1 font-bold">{item.code}</span>
              <span className={`font-bold ${
                item.redemption > "80%" ? "text-green-600" : 
                item.redemption > "60%" ? "text-blue-600" : "text-purple-600"
              }`}>
                {item.redemption} REDEMPTION
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CouponManagement = () => {
  const [activeTab, setActiveTab] = useState("All Coupons");
  const [search, setSearch] = useState("");
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleAction = (id, action) => {
    if (action === "Delete") {
      setCoupons(coupons.filter(coupon => coupon.id !== id));
    } else {
      setCoupons(coupons.map(coupon => 
        coupon.id === id 
          ? { ...coupon, status: action === "Activate" ? "Active" : "Inactive" } 
          : coupon
      ));
    }
  };

  const handleSaveCoupon = (newCoupon) => {
    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id ? newCoupon : c
      ));
    } else {
      setCoupons([...coupons, newCoupon]);
    }
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const searchTerm = search.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(searchTerm) ||
      coupon.discount.toLowerCase().includes(searchTerm) ||
      coupon.product.toLowerCase().includes(searchTerm) ||
      coupon.role.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">COUPON MANAGEMENT</h2>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
        >
          + CREATE COUPON
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {["All Coupons", "Analytics"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-bold ${
              activeTab === tab 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "text-gray-600 hover:text-blue-600"
            } transition-colors`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "All Coupons" && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="SEARCH COUPONS..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CouponTable 
            coupons={filteredCoupons} 
            onAction={handleAction} 
            onEdit={(coupon) => {
              setEditingCoupon(coupon);
              setIsFormOpen(true);
            }} 
          />
        </>
      )}

      {activeTab === "Analytics" && <AnalyticsDashboard />}

      {isFormOpen && (
        <CouponForm
          coupon={editingCoupon}
          onSave={handleSaveCoupon}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCoupon(null);
          }}
        />
      )}
    </div>
  );
};

export default CouponManagement;