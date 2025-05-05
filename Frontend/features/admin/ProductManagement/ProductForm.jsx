 
import React, { useState } from "react";
import { toast } from "react-toastify";
        const ProductForm = ({ onSubmit, categories = [], brands = [] }) => {
          const [formData, setFormData] = useState({
              name: "",
              category: "",
              brand: "",
              stock: 0,
              retailPrice: 0,
              customerPrice: 0,
              isPublished: true,
              tags: [],
              seoMetadata: { title: "", description: "" },
              images: []
          });

          const handleImageUpload = (e) => {
              const files = Array.from(e.target.files);
              setFormData({ ...formData, images: [...formData.images, ...files] });
          };

          const handleFormSubmit = (e) => {
              e.preventDefault();
              onSubmit({
                  name: formData.name,
                  category: formData.category,
                  price: formData.customerPrice,
                  stock: formData.stock,
                  visibility: formData.isPublished ? "Published" : "Draft",
                  image: formData.images.length > 0 ? URL.createObjectURL(formData.images[0]) : "https://via.placeholder.com/50?text=" + formData.name
              });
          };

          return (
              <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium">Product Name</label>
                          <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="mt-1 p-2 w-full border rounded"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Category</label>
                          <select
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="mt-1 p-2 w-full border rounded"
                          >
                              <option value="">Select Category</option>
                              {categories.map((cat) => (
                                  <option key={cat.id} value={cat.name}>
                                      {cat.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Brand</label>
                          <select
                              value={formData.brand}
                              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                              className="mt-1 p-2 w-full border rounded"
                          >
                              <option value="">Select Brand</option>
                              {brands.map((brand) => (
                                  <option key={brand.id} value={brand.name}>
                                      {brand.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Stock</label>
                          <input
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                              className="mt-1 p-2 w-full border rounded"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Retailer Price</label>
                          <input
                              type="number"
                              value={formData.retailPrice}
                              onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                              className="mt-1 p-2 w-full border rounded"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Customer Price</label>
                          <input
                              type="number"
                              value={formData.customerPrice}
                              onChange={(e) => setFormData({ ...formData, customerPrice: parseFloat(e.target.value) || 0 })}
                              className="mt-1 p-2 w-full border rounded"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Tags (comma-separated)</label>
                          <input
                              type="text"
                              value={formData.tags.join(",")}
                              onChange={(e) =>
                                  setFormData({ ...formData, tags: e.target.value.split(",").map(tag => tag.trim()) })
                              }
                              className="mt-1 p-2 w-full border rounded"
                          />
                      </div>
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
                              className="mt-1 p-2 w-full border rounded"
                          />
                      </div>
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
                              className="mt-1 p-2 w-full border rounded"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Product Images</label>
                          <input
                              type="file"
                              multiple
                              onChange={handleImageUpload}
                              className="mt-1 p-2 w-full border rounded"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Publish</label>
                          <input
                              type="checkbox"
                              checked={formData.isPublished}
                              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                              className="mt-1"
                          />
                      </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                      <button
                          type="button"
                          onClick={() => onSubmit(null)}
                          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                          Add Product
                      </button>
                  </div>
              </form>
          );
      };

      export  default ProductForm;