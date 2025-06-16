import React, { useState } from "react";

// Hardcoded mock addresses based on address.model.js
const mockAddresses = [
  {
    address_id: "550e8400-e29b-41d4-a716-446655440002",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "Delhi",
    state: "Delhi",
    postal_code: "110001",
    country: "India",
    is_default: true,
    is_active: true,
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-10T08:30:00Z"
  },
  {
    address_id: "550e8400-e29b-41d4-a716-446655440003",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    address_line1: "456 Business Park",
    address_line2: "Office Complex B, Floor 3",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    country: "India",
    is_default: false,
    is_active: true,
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z"
  },
  {
    address_id: "550e8400-e29b-41d4-a716-446655440004",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    address_line1: "789 Tech Hub",
    address_line2: "Building A, Wing 2",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "560001",
    country: "India",
    is_default: false,
    is_active: true,
    createdAt: "2024-01-08T11:45:00Z",
    updatedAt: "2024-01-08T11:45:00Z"
  },
  {
    address_id: "550e8400-e29b-41d4-a716-446655440005",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    address_line1: "321 Heritage Villa",
    address_line2: null,
    city: "Jaipur",
    state: "Rajasthan",
    postal_code: "302001",
    country: "India",
    is_default: false,
    is_active: false, // Inactive address
    createdAt: "2024-01-05T16:10:00Z",
    updatedAt: "2024-01-15T09:25:00Z"
  }
];

// Indian states for dropdown
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh"
];

const AddressForm = ({ 
  isOpen, 
  onClose, 
  onAddressSelect, 
  selectedAddressId = null,
  mode = "select" // "select", "add", "edit"
}) => {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(mode === "add");
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form state for new/edit address
  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Get active addresses only
  const activeAddresses = addresses.filter(addr => addr.is_active);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.address_line1.trim()) {
      errors.address_line1 = "Address Line 1 is required";
    }
    
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    
    if (!formData.postal_code.trim()) {
      errors.postal_code = "Postal code is required";
    } else if (!/^\d{6}$/.test(formData.postal_code)) {
      errors.postal_code = "Postal code must be 6 digits";
    }
    
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newAddress = {
      address_id: editingAddress?.address_id || `550e8400-e29b-41d4-a716-${Date.now()}`,
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      ...formData,
      is_active: true,
      createdAt: editingAddress?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.address_id === editingAddress.address_id ? newAddress : addr
      ));
    } else {
      // Add new address
      // If this is set as default, make others non-default
      if (newAddress.is_default) {
        setAddresses(prev => prev.map(addr => ({ ...addr, is_default: false })));
      }
      setAddresses(prev => [...prev, newAddress]);
    }

    // Reset form
    setFormData({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
    onClose();
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setFormData({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  // Handle delete address
  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.map(addr => 
        addr.address_id === addressId 
          ? { ...addr, is_active: false, updatedAt: new Date().toISOString() }
          : addr
      ));
    }
  };

  // Handle set as default
  const handleSetDefault = (addressId) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      is_default: addr.address_id === addressId,
      updatedAt: addr.address_id === addressId ? new Date().toISOString() : addr.updatedAt
    })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {showAddForm 
              ? (editingAddress ? "Edit Address" : "Add New Address")
              : "Select Delivery Address"
            }
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {!showAddForm ? (
            // Address Selection View
            <div className="space-y-4">
              {/* Add New Address Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full p-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                + Add New Address
              </button>

              {/* Address List */}
              {activeAddresses.map((address) => (
                <div
                  key={address.address_id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddressId === address.address_id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {address.is_default && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-medium">
                          {address.address_line1}
                        </div>
                        {address.address_line2 && (
                          <div>{address.address_line2}</div>
                        )}
                        <div>
                          {address.city}, {address.state} - {address.postal_code}
                        </div>
                        <div>{address.country}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      {!address.is_default && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.address_id);
                            }}
                            className="text-green-600 text-sm hover:underline"
                          >
                            Set as Default
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.address_id);
                            }}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Add/Edit Address Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    formErrors.address_line1 ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="House No, Building Name, Street"
                />
                {formErrors.address_line1 && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address_line1}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Apartment, Suite, Unit, etc. (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="City"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      formErrors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      formErrors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                  />
                  {formErrors.postal_code && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.postal_code}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      formErrors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Country"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setFormErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;