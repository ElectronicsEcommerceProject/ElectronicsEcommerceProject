import React, { useState } from 'react';

const ManualOrderModal = ({ showCreateOrderModal, setShowCreateOrderModal, createOrder }) => {
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    phone: '',
    address: '',
    itemName: '',
    itemQty: '1',
    itemPrice: '1',
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'customer':
        if (!value.trim()) {
          newErrors.customer = 'Customer name is required';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.customer = 'Name should only contain letters and spaces';
        } else {
          delete newErrors.customer;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^@]+@[^@]+\.com$/.test(value)) {
          newErrors.email = 'Email must contain @ and end with .com';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.phone = 'Phone number must be exactly 10 digits';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'address':
        if (!value.trim()) {
          newErrors.address = 'Address is required';
        } else {
          delete newErrors.address;
        }
        break;
      case 'itemName':
        if (!value.trim()) {
          newErrors.itemName = 'Item name is required';
        } else {
          delete newErrors.itemName;
        }
        break;
      case 'itemQty':
        if (!value) {
          newErrors.itemQty = 'Quantity is required';
        } else if (!/^\d+$/.test(value) || Number(value) < 1) {
          newErrors.itemQty = 'Quantity must be a positive integer';
        } else {
          delete newErrors.itemQty;
        }
        break;
      case 'itemPrice':
        if (!value) {
          newErrors.itemPrice = 'Price is required';
        } else if (isNaN(value) || Number(value) <= 0) {
          newErrors.itemPrice = 'Price must be a positive number';
        } else {
          delete newErrors.itemPrice;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in customer name input
    if (name === 'customer' && /\d/.test(value)) {
      return;
    }

    // Restrict phone to digits only
    if (name === 'phone' && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = Object.keys(formData).every((key) => validateField(key, formData[key]));

    if (!isValid) return;

    createOrder({
      customer: formData.customer.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      items: [
        {
          name: formData.itemName.trim(),
          qty: Number(formData.itemQty),
          price: Number(formData.itemPrice),
        },
      ],
    });
    setErrors({});
    setFormData({
      customer: '',
      email: '',
      phone: '',
      address: '',
      itemName: '',
      itemQty: '1',
      itemPrice: '1',
    });
    setShowCreateOrderModal(false);
  };

  if (!showCreateOrderModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Manual Order</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => {
              setErrors({});
              setShowCreateOrderModal(false);
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                placeholder="Customer Name"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.customer ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
              />
              {errors.customer && <p className="text-red-500 text-sm mt-1">{errors.customer}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Customer Email"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Customer Phone"
                maxLength="10"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Customer Address"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                required
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Item Name"
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.itemName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity <span className="text-red-500'*"></span>
                </label>
                <input
                  type="number"
                  name="itemQty"
                  value={formData.itemQty}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  min="1"
                  step="1"
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.itemQty ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.itemQty && <p className="text-red-500 text-sm mt-1">{errors.itemQty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="itemPrice"
                  value={formData.itemPrice}
                  onChange={handleInputChange}
                  placeholder="Price"
                  min="0.01"
                  step="0.01"
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.itemPrice ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.itemPrice && <p className="text-red-500 text-sm mt-1">{errors.itemPrice}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                setErrors({});
                setShowCreateOrderModal(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOrderModal;