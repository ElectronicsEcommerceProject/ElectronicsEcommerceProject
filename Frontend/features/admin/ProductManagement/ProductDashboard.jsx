import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
  import{ ProductForm} from "../../../features/admin/index.js";

const productsData = [
  {
    id: 1,
    name: "Dell XPS 13",
    category: "Laptops",
    price: 1299.99,
    stock: 50,
    visibility: "Published",
    image: "https://via.placeholder.com/50?text=Dell+XPS+13",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    category: "Laptops",
    price: 1999.99,
    stock: 30,
    visibility: "Draft",
    image: "https://via.placeholder.com/50?text=MacBook+Pro+14",
  },
  {
    id: 3,
    name: "HP Spectre x360",
    category: "Laptops",
    price: 1499.99,
    stock: 20,
    visibility: "Published",
    image: "https://via.placeholder.com/50?text=HP+Spectre+x360",
  },
  {
    id: 4,
    name: "Lenovo ThinkPad X1",
    category: "Laptops",
    price: 1799.99,
    stock: 0,
    visibility: "Published",
    image: "https://via.placeholder.com/50?text=Lenovo+ThinkPad+X1",
  },
];

const ProductTable = ({ products }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 text-left">Image</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Price</th>
          <th className="p-3 text-left">Stock</th>
          <th className="p-3 text-left">Visibility</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t">
            <td className="p-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            </td>
            <td className="p-3">{product.name}</td>
            <td className="p-3">{product.category}</td>
            <td className="p-3">${product.price.toFixed(2)}</td>
            <td className="p-3">{product.stock}</td>
            <td className="p-3">{product.visibility}</td>
            <td className="p-3">
              <button className="text-blue-600 hover:underline mr-2">
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button className="text-red-600 hover:underline">
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map((product) => (
      <div key={product.id} className="bg-white p-4 rounded-lg shadow">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded mb-2"
        />
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">Category: {product.category}</p>
        <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
        <p className="text-gray-600">Stock: {product.stock}</p>
        <p className="text-gray-600">Status: {product.visibility}</p>
        <div className="mt-2">
          <button className="text-blue-600 hover:underline mr-2">Edit</button>
          <button className="text-red-600 hover:underline">Delete</button>
        </div>
      </div>
    ))}
  </div>
);

const ProductModal = ({ isOpen, closeModal, addProduct }) => {
  const categories = [
    { id: "Laptops", name: "Laptops" },
    { id: "Accessories", name: "Accessories" },
    { id: "Components", name: "Components" },
  ];
  const brands = [
    { id: "Dell", name: "Dell" },
    { id: "Apple", name: "Apple" },
    { id: "HP", name: "HP" },
    { id: "Lenovo", name: "Lenovo" },
  ];

  const handleSubmit = (newProduct) => {
    if (newProduct) {
      addProduct(newProduct);
    }
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <ProductForm
          onSubmit={handleSubmit}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
};

const ProductDashboard = () => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState(productsData);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in" && product.stock > 0) ||
      (stockFilter === "out" && product.stock === 0);
    const matchesVisibility =
      visibilityFilter === "all" || product.visibility === visibilityFilter;
    return (
      matchesSearch && matchesCategory && matchesStock && matchesVisibility
    );
  });

  const addProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Product
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Accessories">Accessories</option>
            <option value="Components">Components</option>
          </select>
          <select
            className="p-2 border rounded"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select
            className="p-2 border rounded"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <div className="flex gap-2">
            <button
              className={`p-2 ${view === "table" ? "bg-gray-200" : ""}`}
              onClick={() => setView("table")}
            >
              Table
            </button>
            <button
              className={`p-2 ${view === "grid" ? "bg-gray-200" : ""}`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
          </div>
        </div>
      </div>
      {view === "table" ? (
        <ProductTable products={filteredProducts} />
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
      <ProductModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        addProduct={addProduct}
      />
    </div>
  );
};

export default ProductDashboard;