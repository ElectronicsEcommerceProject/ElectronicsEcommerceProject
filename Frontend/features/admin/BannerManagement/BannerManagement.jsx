import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from "react-icons/fi";

import {
  createApi,
  getApi,
  updateApiById,
  deleteApiById,
  adminBannerRoute,
} from "../../../src/index.js";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    bg_class: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
    button_text: "",
    image: null,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getApi(adminBannerRoute);
      if (response.success) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const bgClassOptions = [
    {
      value: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700",
      label: "Purple to Blue",
    },
    {
      value: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
      label: "Green to Cyan",
    },
    {
      value: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
      label: "Orange to Pink",
    },
    {
      value: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      label: "Blue to Purple",
    },
    {
      value: "bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700",
      label: "Yellow to Red",
    },
    {
      value: "bg-gradient-to-br from-green-500 via-blue-600 to-purple-700",
      label: "Green to Purple",
    },
  ];

  const handleEdit = (banner) => {
    setEditingBanner(banner.banner_id);
    setFormData({
      title: banner.title,
      description: banner.description,
      price: banner.price,
      discount: banner.discount,
      bg_class: banner.bg_class,
      button_text: banner.button_text,
      image: null,
      is_active: banner.is_active,
      display_order: banner.display_order,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const bannerData = new FormData();
      bannerData.append("title", formData.title);
      bannerData.append("description", formData.description);
      bannerData.append("price", formData.price);
      bannerData.append("discount", formData.discount);
      bannerData.append("bg_class", formData.bg_class);
      bannerData.append("button_text", formData.button_text);
      bannerData.append("is_active", formData.is_active);
      bannerData.append("display_order", formData.display_order);
      if (formData.image) {
        bannerData.append("image", formData.image);
      }

      if (editingBanner) {
        // Update existing banner
        const response = await updateApiById(
          adminBannerRoute,
          editingBanner,
          bannerData
        );
        if (response.success) {
          setBanners(
            banners.map((banner) =>
              banner.banner_id === editingBanner
                ? {
                    ...banner,
                    ...formData,
                    image_url: formData.image
                      ? URL.createObjectURL(formData.image)
                      : banner.image_url,
                  }
                : banner
            )
          );
          setEditingBanner(null);
          resetForm();
        }
      } else {
        // Create new banner
        const response = await createApi(adminBannerRoute, bannerData);
        if (response.success) {
          const newBanner = {
            banner_id: Date.now(),
            title: formData.title,
            description: formData.description,
            price: formData.price,
            discount: formData.discount,
            bg_class: formData.bg_class,
            button_text: formData.button_text,
            image_url: formData.image
              ? URL.createObjectURL(formData.image)
              : null,
            is_active: formData.is_active,
            display_order: formData.display_order,
            createdAt: new Date().toISOString(),
            creator: { name: "Current User" },
          };
          setBanners([newBanner, ...banners]);
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        setLoading(true);
        const response = await deleteApiById(adminBannerRoute, id);
        if (response.success) {
          setBanners(banners.filter((banner) => banner.banner_id !== id));
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingBanner(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      discount: "",
      bg_class: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      button_text: "",
      image: null,
      is_active: true,
      display_order: 0,
    });
  };

  const toggleActive = async (id) => {
    try {
      const banner = banners.find((b) => b.banner_id === id);
      const updateData = new FormData();
      updateData.append("is_active", !banner.is_active);

      const response = await updateApiById(adminBannerRoute, id, updateData);
      if (response.success) {
        setBanners(
          banners.map((banner) =>
            banner.banner_id === id
              ? { ...banner, is_active: !banner.is_active }
              : banner
          )
        );
      }
    } catch (error) {
      console.error("Error toggling banner status:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banner Management</h1>
        {!showAddForm && !editingBanner && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiPlus /> Add New Banner
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingBanner) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingBanner ? "Edit Banner" : "Add New Banner"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Enter banner title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Enter button text"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                rows="3"
                placeholder="Enter banner description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Starting ₹1,999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount</label>
              <input
                type="text"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Up to 40% OFF"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Background Style
              </label>
              <select
                value={formData.bg_class}
                onChange={(e) =>
                  setFormData({ ...formData, bg_class: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                {bgClassOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    const allowedExtensions = ["jpeg", "jpg", "png"];
                    const fileExtension = file.name
                      .split(".")
                      .pop()
                      .toLowerCase();

                    if (file.size > maxSize) {
                      alert(
                        `Image size is ${(file.size / (1024 * 1024)).toFixed(
                          2
                        )}MB. Maximum allowed size is 10MB.`
                      );
                      e.target.value = "";
                      return;
                    }

                    if (!allowedExtensions.includes(fileExtension)) {
                      alert(
                        `File extension '${fileExtension}' is not allowed. Only jpeg, jpg, png are allowed.`
                      );
                      e.target.value = "";
                      return;
                    }

                    setFormData({ ...formData, image: file });
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.image && typeof formData.image === "object" && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-2">
                    Selected: {formData.image.name}
                  </div>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Banner preview"
                    className="max-w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <FiSave /> Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700"
            >
              <FiX /> Cancel
            </button>
          </div>

          {/* Real-time Banner Preview */}
          {(formData.title || formData.description || formData.image) && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Live Preview (MainDashboard Style)
              </h3>
              <div className="max-w-4xl mx-auto">
                <div
                  className={`${formData.bg_class} text-white p-6 relative rounded-lg overflow-hidden flex items-center`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="w-full flex flex-col md:flex-row items-center justify-between relative z-10">
                    <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0">
                      {formData.discount && (
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3">
                          {formData.discount}
                        </div>
                      )}
                      <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                        {formData.title || "Banner Title"}
                      </h1>
                      <p className="text-sm lg:text-base opacity-90 mb-4 leading-relaxed">
                        {formData.description ||
                          "Banner description will appear here"}
                      </p>
                      {formData.price && (
                        <div className="text-xl lg:text-2xl font-bold mb-4">
                          {formData.price}
                        </div>
                      )}
                      <button className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                        {formData.button_text || "Button Text"} →
                      </button>
                    </div>
                    {formData.image && (
                      <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                        <div className="relative w-full max-w-sm">
                          <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl"></div>
                          <img
                            src={
                              typeof formData.image === "object"
                                ? URL.createObjectURL(formData.image)
                                : formData.image
                            }
                            alt={formData.title || "Banner"}
                            className="relative w-full h-48 md:h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.banner_id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Banner Preview */}
            <div
              className={`${banner.bg_class} text-white p-4 relative flex items-center min-h-[200px]`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="w-full flex flex-col sm:flex-row items-center justify-between relative z-10">
                <div className="sm:w-1/2 text-center sm:text-left mb-4 sm:mb-0">
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block">
                    {banner.discount}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{banner.title}</h3>
                  <p className="text-sm opacity-90 mb-2 line-clamp-2">
                    {banner.description}
                  </p>
                  <div className="text-lg font-bold mb-2">{banner.price}</div>
                  <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {banner.button_text} →
                  </button>
                </div>
                {banner.image_url && (
                  <div className="sm:w-1/2 flex justify-center mt-4 sm:mt-0">
                    <div className="relative w-full max-w-[150px]">
                      <div className="absolute inset-0 bg-white/10 rounded-2xl blur-2xl"></div>
                      <img
                        src={banner.image_url}
                        alt="Banner"
                        className="relative w-full h-24 sm:h-32 object-cover rounded-xl shadow-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Controls */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    banner.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {banner.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.banner_id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      banner.is_active
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {banner.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.banner_id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>ID:</strong> {banner.banner_id}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(banner.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Creator:</strong> {banner.creator?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No banners found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
