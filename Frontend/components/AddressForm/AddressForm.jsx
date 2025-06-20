import React, { useState, useEffect } from "react";

import { 
  createApi, 
  getApi, 
  updateApiById, 
  deleteApiById, 
  userAddressesRoute 
} from "../../src/index.js";

// Indian states for dropdown
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Jammu and Kashmir",
  "Ladakh",
];

const AddressForm = ({
  isOpen,
  onClose,
  onAddressSelect,
  selectedAddressId = null,
  mode = "select", // "select", "add", "edit"
}) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(mode === "add");
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getApi(userAddressesRoute);
      console.log("Address API response:", response);

      if (response && response.success) {
        if (response.addresses) {
          console.log("Setting addresses from response.addresses:", response.addresses);
          setAddresses(response.addresses);
        } else if (response.data && response.data.addresses) {
          console.log("Setting addresses from response.data.addresses:", response.data.addresses);
          setAddresses(response.data.addresses);
        } else if (Array.isArray(response.data)) {
          console.log("Setting addresses from response.data array:", response.data);
          setAddresses(response.data);
        } else {
          console.log("No valid addresses found in successful response");
          setAddresses([]);
        }
      } else {
        console.log("API request was not successful:", response?.message);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Load addresses when component mounts
  useEffect(() => {
    if (isOpen) {
      console.log("AddressForm opened, fetching addresses from:", userAddressesRoute);
      fetchAddresses();
    }
  }, [isOpen]);

  // Form state for new/edit address
  const [formData, setFormData] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Get active addresses only
  const activeAddresses = addresses.filter(addr => addr && addr.is_active);

  // Debug log addresses
  useEffect(() => {
    console.log("Current addresses:", addresses);
    console.log("Active addresses:", activeAddresses);
  }, [addresses, activeAddresses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const addressData = {
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || null,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        is_default: formData.is_default,
      };

      let response;

      if (editingAddress) {
        // Update existing address
        response = await updateApiById(
          userAddressesRoute,
          editingAddress.address_id,
          addressData
        );

        if (response && response.success) {
          alert("Address updated successfully!");
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.address_id === editingAddress.address_id
                ? response.address
                : addr
            )
          );
          
          // Reset form
          setFormData({
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "India",
            is_default: false,
          });
          setEditingAddress(null);
          setShowAddForm(false);
          
          // Fetch updated addresses
          fetchAddresses();
        } else {
          alert(response?.message || "Failed to update address. Please try again.");
        }
      } else {
        // Add new address
        response = await createApi(userAddressesRoute, addressData);

        if (response && response.success) {
          alert("Address added successfully!");
          // If this is set as default, the backend will handle making others non-default
          if (response.address) {
            setAddresses((prev) => [...prev, response.address]);
          }
          
          // Reset form
          setFormData({
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "India",
            is_default: false,
          });
          setShowAddForm(false);
          
          // Fetch updated addresses
          fetchAddresses();
        } else {
          alert(response?.message || "Failed to add address. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      is_default: address.is_default,
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await deleteApiById(userAddressesRoute, addressId);
        
        if (response && response.success) {
          alert("Address deleted successfully!");
          // Remove from local state
          setAddresses((prev) =>
            prev.filter((addr) => addr.address_id !== addressId)
          );
        } else {
          alert(response?.message || "Failed to delete address. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  // Handle set as default
  const handleSetDefault = async (addressId) => {
    try {
      // Update the address with is_default set to true
      const response = await updateApiById(
        userAddressesRoute,
        addressId,
        { is_default: true }
      );

      if (response && response.success) {
        alert("Address set as default successfully!");
        // Update local state - set this address as default and others as non-default
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            is_default: addr.address_id === addressId,
          }))
        );
      } else {
        alert(response?.message || "Failed to set address as default. Please try again.");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      alert("Failed to set default address. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {showAddForm
              ? editingAddress
                ? "Edit Address"
                : "Add New Address"
              : "Select Delivery Address"}
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

              {/* Loading State */}
              {loading && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading addresses...</p>
                </div>
              )}

              {/* Debug Info */}
              {!loading && activeAddresses.length > 0 && (
                <div className="mb-2 text-xs text-gray-500">
                  Found {activeAddresses.length} addresses
                </div>
              )}

              {/* Empty State */}
              {!loading && activeAddresses.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    No addresses found. Add a new address to continue.
                  </p>
                </div>
              )}
              
              {/* Address List */}
              {!loading && activeAddresses.length > 0 && activeAddresses.map((address) => (
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
                          {address.city}, {address.state} -{" "}
                          {address.postal_code}
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
                    formErrors.address_line1
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="House No, Building Name, Street"
                />
                {formErrors.address_line1 && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address_line1}
                  </p>
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
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
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
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.state}
                    </p>
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
                      formErrors.postal_code
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                  />
                  {formErrors.postal_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.postal_code}
                    </p>
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
                <label
                  htmlFor="is_default"
                  className="ml-2 text-sm text-gray-700"
                >
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
                  disabled={submitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded ${
                    submitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {submitting
                    ? editingAddress
                      ? "Updating..."
                      : "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Save Address"}
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