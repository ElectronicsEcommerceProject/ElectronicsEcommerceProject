import React, { useState } from "react";
import { toast } from "react-toastify";

const ProductForm = ({ onSubmit, categories = [], brands = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    stock: "",
    retailPrice: "",
    customerPrice: "",
    isPublished: true,
    tags: [],
    seoMetadata: { title: "", description: "" },
    images: [],
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Product name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.name = "Product name should only contain letters and spaces";
        } else {
          delete newErrors.name;
        }
        break;
      case "category":
        if (!value) {
          newErrors.category = "Category is required";
        } else {
          delete newErrors.category;
        }
        break;
      case "brand":
        if (!value) {
          newErrors.brand = "Brand is required";
        } else {
          delete newErrors.brand;
        }
        break;
      case "stock":
        if (value === "") {
          newErrors.stock = "Stock is required";
        } else if (!/^\d+$/.test(value) || Number(value) < 0) {
          newErrors.stock = "Stock must be a non-negative integer";
        } else {
          delete newErrors.stock;
        }
        break;
      case "retailPrice":
        if (value === "") {
          newErrors.retailPrice = "Retail price is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          newErrors.retailPrice = "Retail price must be greater than 0";
        } else {
          delete newErrors.retailPrice;
        }
        // Re-validate customerPrice if retailPrice changes
        if (formData.customerPrice && Number(formData.customerPrice) < Number(value)) {
          newErrors.customerPrice = "Customer price should be ≥ retail price";
        } else if (!newErrors.customerPrice && formData.customerPrice) {
          delete newErrors.customerPrice;
        }
        break;
      case "customerPrice":
        if (value === "") {
          newErrors.customerPrice = "Customer price is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          newErrors.customerPrice = "Customer price must be greater than 0";
        } else if (Number(value) < Number(formData.retailPrice)) {
          newErrors.customerPrice = "Customer price should be ≥ retail price";
        } else {
          delete newErrors.customerPrice;
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

    // Prevent numbers in name field
    if (name === "name" && /\d/.test(value)) {
      return;
    }

    // Restrict stock to digits only
    if (name === "stock" && value && !/^\d*$/.test(value)) {
      return;
    }

    // Restrict prices to valid numbers
    if ((name === "retailPrice" || name === "customerPrice") && value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["name", "category", "brand", "stock", "retailPrice", "customerPrice"];
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.customerPrice),
      stock: Number(formData.stock),
      visibility: formData.isPublished ? "Published" : "Draft",
      image:
        formData.images.length > 0
          ? URL.createObjectURL(formData.images[0])
          : "https://via.placeholder.com/50?text=" + formData.name.trim(),
    });

    // Reset form after submission
    setFormData({
      name: "",
      category: "",
      brand: "",
      stock: "",
      retailPrice: "",
      customerPrice: "",
      isPublished: true,
      tags: [],
      seoMetadata: { title: "", description: "" },
      images: [],
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.category ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.brand ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.stock ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>

        {/* Retail Price */}
        <div>
          <label className="block text-sm font-medium">
            Retail Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="retailPrice"
            value={formData.retailPrice}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.retailPrice ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.retailPrice && <p className="text-red-500 text-xs mt-1">{errors.retailPrice}</p>}
        </div>

        {/* Customer Price */}
        <div>
          <label className="block text-sm font-medium">
            Customer Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customerPrice"
            value={formData.customerPrice}
            onChange={handleInputChange}
            className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
              errors.customerPrice ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.customerPrice && <p className="text-red-500 text-xs mt-1">{errors.customerPrice}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(",")}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              })
            }
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SEO Title */}
        <div>
          <label className="block text-sm font-medium">SEO Title</label>
          <input
            type="text"
            value={formData.seoMetadata.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                seoMetadata: { ...formData.seoMetadata, title: e.target.value },
              })
            }
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="60"
          />
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-medium">SEO Description</label>
          <textarea
            value={formData.seoMetadata.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                seoMetadata: { ...formData.seoMetadata, description: e.target.value },
              })
            }
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="160"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium">Product Images (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.images.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{formData.images.length} image(s) selected</p>
          )}
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium">Publish Product</label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={() => onSubmit(null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;