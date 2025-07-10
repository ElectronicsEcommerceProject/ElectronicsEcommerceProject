import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from "react-icons/fi";

const BannerManagement = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "🎧 Premium Headphones",
      description: "Experience crystal-clear sound with our premium collection of headphones from top brands.",
      price: "Starting ₹1,999",
      discount: "Up to 40% OFF",
      bgClass: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
      isActive: true,
    },
    {
      id: 2,
      title: "⚡ Fast Charging Solutions",
      description: "Power up your devices with our range of high-speed chargers and wireless charging pads.",
      price: "Starting ₹1,199",
      discount: "Up to 35% OFF",
      bgClass: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
      buttonText: "Explore Now",
      image: "https://images.unsplash.com/photo-1609592806596-4d3b0c3b7e3e?w=400&h=300&fit=crop&crop=center",
      isActive: true,
    },
    {
      id: 3,
      title: "🔊 Wireless Speakers",
      description: "Fill your space with rich, immersive sound from our premium speaker collection.",
      price: "Starting ₹2,999",
      discount: "Up to 50% OFF",
      bgClass: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
      buttonText: "Listen Now",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&crop=center",
      isActive: true,
    },
  ]);

  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    bgClass: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
    buttonText: "",
    image: "",
    isActive: true,
  });

  const bgClassOptions = [
    { value: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700", label: "Purple to Blue" },
    { value: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700", label: "Green to Cyan" },
    { value: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700", label: "Orange to Pink" },
    { value: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700", label: "Blue to Purple" },
    { value: "bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700", label: "Yellow to Red" },
    { value: "bg-gradient-to-br from-green-500 via-blue-600 to-purple-700", label: "Green to Purple" },
  ];

  const handleEdit = (banner) => {
    setEditingBanner(banner.id);
    setFormData(banner);
  };

  const handleSave = () => {
    if (editingBanner) {
      setBanners(banners.map(banner => 
        banner.id === editingBanner ? { ...formData, id: editingBanner } : banner
      ));
      setEditingBanner(null);
    } else {
      setBanners([...banners, { ...formData, id: Date.now() }]);
      setShowAddForm(false);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter(banner => banner.id !== id));
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
      bgClass: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      buttonText: "",
      image: "",
      isActive: true,
    });
  };

  const toggleActive = (id) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banner Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add New Banner
        </button>
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter banner title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter button text"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Starting ₹1,999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount</label>
              <input
                type="text"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Up to 40% OFF"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Style</label>
              <select
                value={formData.bgClass}
                onChange={(e) => setFormData({ ...formData, bgClass: e.target.value })}
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
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
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
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Banner Preview */}
            <div className={`${banner.bgClass} text-white p-4 relative`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block">
                  {banner.discount}
                </div>
                <h3 className="text-lg font-bold mb-2">{banner.title}</h3>
                <p className="text-sm opacity-90 mb-2 line-clamp-2">{banner.description}</p>
                <div className="text-lg font-bold mb-2">{banner.price}</div>
                <button className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {banner.buttonText} →
                </button>
              </div>
              {banner.image && (
                <div className="absolute right-2 top-2 w-16 h-16 rounded-lg overflow-hidden">
                  <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Banner Controls */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      banner.isActive 
                        ? "bg-red-100 text-red-800 hover:bg-red-200" 
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>ID:</strong> {banner.id}</p>
                <p><strong>Created:</strong> {new Date().toLocaleDateString()}</p>
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