import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getApi,
  updateApiById,
  deleteApiById,
  MESSAGE,
} from "../../../src/index.js";

// Initial data - will be replaced with API data
const initialData = {
  categories: [
    { id: 1, name: "Laptops", slug: "laptops", target_role: "Both" },
    {
      id: 2,
      name: "Smartphones",
      slug: "smartphones",
      target_role: "Customer",
    },
    {
      id: 3,
      name: "Accessories",
      slug: "accessories",
      target_role: "Retailer",
    },
  ],
  brands: [
    { id: 1, name: "Dell", slug: "dell", category_id: 1 },
    { id: 2, name: "Apple", slug: "apple", category_id: [1, 2] },
    { id: 3, name: "Samsung", slug: "samsung", category_id: [2, 3] },
  ],
  products: [
    {
      id: 1,
      name: "Dell XPS 13",
      category: "Laptops",
      category_id: 1,
      brand: "Dell",
      brand_id: 1,
      price: 1299.99,
      stock: 50,
      visibility: "Published",
      image: "https://via.placeholder.com/50?text=Dell+XPS+13",
    },
    {
      id: 2,
      name: "MacBook Pro 14",
      category: "Laptops",
      category_id: 1,
      brand: "Apple",
      brand_id: 2,
      price: 1999.99,
      stock: 30,
      visibility: "Draft",
      image: "https://via.placeholder.com/50?text=MacBook+Pro+14",
    },
    {
      id: 3,
      name: "iPhone 14",
      category: "Smartphones",
      category_id: 2,
      brand: "Apple",
      brand_id: 2,
      price: 999.99,
      stock: 100,
      visibility: "Published",
      image: "https://via.placeholder.com/50?text=iPhone+14",
    },
    {
      id: 4,
      name: "Samsung Galaxy S23",
      category: "Smartphones",
      category_id: 2,
      brand: "Samsung",
      brand_id: 3,
      price: 899.99,
      stock: 75,
      visibility: "Published",
      image: "https://via.placeholder.com/50?text=Samsung+Galaxy+S23",
    },
  ],
  variants: [
    {
      id: 1,
      product_id: 1,
      product_name: "Dell XPS 13",
      sku: "XPS13-8GB-256",
      price: 1299.99,
      stock: 25,
    },
    {
      id: 2,
      product_id: 1,
      product_name: "Dell XPS 13",
      sku: "XPS13-16GB-512",
      price: 1599.99,
      stock: 15,
    },
    {
      id: 3,
      product_id: 2,
      product_name: "MacBook Pro 14",
      sku: "MBP14-16GB-512",
      price: 1999.99,
      stock: 20,
    },
    {
      id: 4,
      product_id: 3,
      product_name: "iPhone 14",
      sku: "IP14-128GB-BLK",
      price: 999.99,
      stock: 50,
    },
    {
      id: 5,
      product_id: 4,
      product_name: "Samsung Galaxy S23",
      sku: "SGS23-256GB-GRN",
      price: 899.99,
      stock: 35,
    },
  ],
  attributes: [
    { id: 1, name: "RAM", type: "select", product_categories: [1] },
    { id: 2, name: "Storage", type: "select", product_categories: [1, 2] },
    { id: 3, name: "Color", type: "select", product_categories: [1, 2, 3] },
  ],
  attributeValues: [
    { id: 1, attribute_id: 1, attribute: "RAM", value: "8GB" },
    { id: 2, attribute_id: 1, attribute: "RAM", value: "16GB" },
    { id: 3, attribute_id: 2, attribute: "Storage", value: "256GB" },
    { id: 4, attribute_id: 2, attribute: "Storage", value: "512GB" },
    { id: 5, attribute_id: 3, attribute: "Color", value: "Silver" },
    { id: 6, attribute_id: 3, attribute: "Color", value: "Space Gray" },
  ],
};

// API endpoints for each entity
const apiEndpoints = {
  category: "/admin/categories",
  brand: "/admin/brands",
  product: "/admin/products",
  variant: "/admin/product-variants",
  attribute: "/admin/product-attributes",
  "attribute-value": "/admin/attribute-values",
};

// Card component for each entity
const EntityCard = ({
  title,
  data,
  searchPlaceholder,
  fields,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  activeFilter,
  onClearFilter,
  selectedItem, // Add this new prop to track the selected item
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
          {activeFilter && (
            <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="mr-1">Filtered</span>
              <button
                onClick={onClearFilter}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Clear filter"
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 flex-shrink-0"
          aria-label={`Add new ${title.toLowerCase()}`}
        >
          <FaPlus className="text-xs sm:text-sm" />
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1.5 sm:p-2 pl-7 sm:pl-8 border rounded text-sm"
        />
        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-grow max-h-48 sm:max-h-64 custom-scrollbar">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              {fields.map((field, index) => (
                <th
                  key={index}
                  className="p-1.5 sm:p-2 text-left text-xs sm:text-sm font-medium text-gray-600"
                >
                  {field.label}
                </th>
              ))}
              <th className="p-1.5 sm:p-2 text-left text-xs sm:text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t hover:bg-gray-50 cursor-pointer ${
                    selectedItem && selectedItem.id === item.id
                      ? "bg-blue-100 hover:bg-blue-100"
                      : ""
                  }`}
                  onClick={() => onSelect(title.toLowerCase(), item)}
                >
                  {fields.map((field, index) => (
                    <td
                      key={index}
                      className="p-1.5 sm:p-2 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                    >
                      {item[field.key]}
                    </td>
                  ))}
                  <td className="p-1.5 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(title.toLowerCase(), item.id, item);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      aria-label={`Edit ${title.toLowerCase()}`}
                    >
                      <FaEdit className="text-xs sm:text-sm" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(title.toLowerCase(), item.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                      aria-label={`Delete ${title.toLowerCase()}`}
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={fields.length + 1}
                  className="p-3 text-center text-xs sm:text-sm text-gray-500"
                >
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Edit modal component
const EditModal = ({ isOpen, onClose, entityType, item, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(entityType, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit {entityType}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => {
            // Skip id field and any image fields
            if (key === "id" || key === "image") return null;

            return (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace("_", " ")}
                </label>
                <input
                  type={typeof formData[key] === "number" ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            );
          })}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    entityType: "",
    item: null,
  });

  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    categories: null,
    brands: null,
    products: null,
    variants: null,
    attributes: null,
    attributeValues: null,
  });

  // Filtered data states
  const [filteredCategories, setFilteredCategories] = useState(
    initialData.categories
  );
  const [filteredBrands, setFilteredBrands] = useState(initialData.brands);
  const [filteredProducts, setFilteredProducts] = useState(
    initialData.products
  );
  const [filteredVariants, setFilteredVariants] = useState(
    initialData.variants
  );
  const [filteredAttributes, setFilteredAttributes] = useState(
    initialData.attributes
  );
  const [filteredAttributeValues, setFilteredAttributeValues] = useState(
    initialData.attributeValues
  );

  // Selected items for highlighting
  const [selectedItems, setSelectedItems] = useState({
    categories: null,
    brands: null,
    products: null,
    variants: null,
    attributes: null,
    attributeValues: null,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch data for each entity type
        // For now, we'll use the initial data
        setData(initialData);
        resetFilters();
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      categories: null,
      brands: null,
      products: null,
      variants: null,
      attributes: null,
      attributeValues: null,
    });
    setSelectedItems({
      categories: null,
      brands: null,
      products: null,
      variants: null,
      attributes: null,
      attributeValues: null,
    });
    setFilteredCategories(data.categories);
    setFilteredBrands(data.brands);
    setFilteredProducts(data.products);
    setFilteredVariants(data.variants);
    setFilteredAttributes(data.attributes);
    setFilteredAttributeValues(data.attributeValues);
  };

  // Handle item selection for filtering
  const handleSelect = (entityType, item) => {
    // Reset all filters first
    const newActiveFilters = {
      categories: null,
      brands: null,
      products: null,
      variants: null,
      attributes: null,
      attributeValues: null,
    };

    // Reset all selected items
    const newSelectedItems = {
      categories: null,
      brands: null,
      products: null,
      variants: null,
      attributes: null,
      attributeValues: null,
    };

    // Set the active filter and selected item for the selected entity
    newActiveFilters[entityType] = item;
    newSelectedItems[entityType] = item;

    setActiveFilters(newActiveFilters);
    setSelectedItems(newSelectedItems);

    // Apply filters based on the selected entity
    switch (entityType) {
      case "categories":
        // Filter brands by category
        const categoryBrands = data.brands.filter((brand) => {
          if (Array.isArray(brand.category_id)) {
            return brand.category_id.includes(item.id);
          }
          return brand.category_id === item.id;
        });
        setFilteredBrands(categoryBrands);

        // Filter products by category
        const categoryProducts = data.products.filter(
          (product) => product.category_id === item.id
        );
        setFilteredProducts(categoryProducts);

        // Filter variants by products
        const categoryProductIds = categoryProducts.map((p) => p.id);
        const categoryVariants = data.variants.filter((variant) =>
          categoryProductIds.includes(variant.product_id)
        );
        setFilteredVariants(categoryVariants);

        // Filter attributes by category
        const categoryAttributes = data.attributes.filter(
          (attr) =>
            attr.product_categories && attr.product_categories.includes(item.id)
        );
        setFilteredAttributes(categoryAttributes);

        // Filter attribute values by attributes
        const categoryAttributeIds = categoryAttributes.map((a) => a.id);
        const categoryAttributeValues = data.attributeValues.filter((attrVal) =>
          categoryAttributeIds.includes(attrVal.attribute_id)
        );
        setFilteredAttributeValues(categoryAttributeValues);

        // Keep all categories visible
        setFilteredCategories(data.categories);
        break;

      case "brands":
        // Filter products by brand
        const brandProducts = data.products.filter(
          (product) => product.brand_id === item.id
        );
        setFilteredProducts(brandProducts);

        // Filter variants by products
        const brandProductIds = brandProducts.map((p) => p.id);
        const brandVariants = data.variants.filter((variant) =>
          brandProductIds.includes(variant.product_id)
        );
        setFilteredVariants(brandVariants);

        // Get categories from filtered products
        const brandCategoryIds = [
          ...new Set(brandProducts.map((p) => p.category_id)),
        ];
        const brandCategories = data.categories.filter((category) =>
          brandCategoryIds.includes(category.id)
        );
        setFilteredCategories(brandCategories);

        // Filter attributes by categories
        const brandAttributes = data.attributes.filter(
          (attr) =>
            attr.product_categories &&
            attr.product_categories.some((catId) =>
              brandCategoryIds.includes(catId)
            )
        );
        setFilteredAttributes(brandAttributes);

        // Filter attribute values by attributes
        const brandAttributeIds = brandAttributes.map((a) => a.id);
        const brandAttributeValues = data.attributeValues.filter((attrVal) =>
          brandAttributeIds.includes(attrVal.attribute_id)
        );
        setFilteredAttributeValues(brandAttributeValues);

        // Keep all brands visible
        setFilteredBrands(data.brands);
        break;

      case "products":
        // Filter variants by product
        const productVariants = data.variants.filter(
          (variant) => variant.product_id === item.id
        );
        setFilteredVariants(productVariants);

        // Get brand and category from product
        const product = data.products.find((p) => p.id === item.id);
        if (product) {
          // Filter brands
          const productBrands = data.brands.filter(
            (brand) => brand.id === product.brand_id
          );
          setFilteredBrands(productBrands);

          // Filter categories
          const productCategories = data.categories.filter(
            (category) => category.id === product.category_id
          );
          setFilteredCategories(productCategories);

          // Filter attributes by category
          const productAttributes = data.attributes.filter(
            (attr) =>
              attr.product_categories &&
              attr.product_categories.includes(product.category_id)
          );
          setFilteredAttributes(productAttributes);

          // Filter attribute values by attributes
          const productAttributeIds = productAttributes.map((a) => a.id);
          const productAttributeValues = data.attributeValues.filter(
            (attrVal) => productAttributeIds.includes(attrVal.attribute_id)
          );
          setFilteredAttributeValues(productAttributeValues);
        }
        break;

      case "variants":
        // Get product from variant
        const variant = data.variants.find((v) => v.id === item.id);
        if (variant) {
          // Filter products
          const variantProducts = data.products.filter(
            (product) => product.id === variant.product_id
          );
          setFilteredProducts(variantProducts);

          // Get brand and category from product
          const variantProduct = variantProducts[0];
          if (variantProduct) {
            // Filter brands
            const variantBrands = data.brands.filter(
              (brand) => brand.id === variantProduct.brand_id
            );
            setFilteredBrands(variantBrands);

            // Filter categories
            const variantCategories = data.categories.filter(
              (category) => category.id === variantProduct.category_id
            );
            setFilteredCategories(variantCategories);

            // Filter attributes by category
            const variantAttributes = data.attributes.filter(
              (attr) =>
                attr.product_categories &&
                attr.product_categories.includes(variantProduct.category_id)
            );
            setFilteredAttributes(variantAttributes);

            // Filter attribute values by attributes
            const variantAttributeIds = variantAttributes.map((a) => a.id);
            const variantAttributeValues = data.attributeValues.filter(
              (attrVal) => variantAttributeIds.includes(attrVal.attribute_id)
            );
            setFilteredAttributeValues(variantAttributeValues);
          }
        }
        break;

      case "attributes":
        // Filter attribute values by attribute
        const attributeValues = data.attributeValues.filter(
          (attrVal) => attrVal.attribute_id === item.id
        );
        setFilteredAttributeValues(attributeValues);

        // Get categories from attribute
        const attribute = data.attributes.find((a) => a.id === item.id);
        if (attribute && attribute.product_categories) {
          // Filter categories
          const attributeCategories = data.categories.filter((category) =>
            attribute.product_categories.includes(category.id)
          );
          setFilteredCategories(attributeCategories);
        }
        break;
    }
  };

  // Clear filter for a specific entity
  const clearFilter = (entityType) => {
    const newActiveFilters = { ...activeFilters };
    delete newActiveFilters[entityType];
    setActiveFilters(newActiveFilters);

    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[entityType];
    setSelectedItems(newSelectedItems);

    // Reset filtered data for the cleared entity
    switch (entityType) {
      case "categories":
        setFilteredCategories(data.categories);
        break;
      case "brands":
        setFilteredBrands(data.brands);
        break;
      case "products":
        setFilteredProducts(data.products);
        break;
      case "variants":
        setFilteredVariants(data.variants);
        break;
      case "attributes":
        setFilteredAttributes(data.attributes);
        break;
      case "attributeValues":
        setFilteredAttributeValues(data.attributeValues);
        break;
    }
  };

  // Handler for adding new entities
  const handleAdd = (entityType) => {
    // For simplicity, we'll navigate to the product form for all entity types
    navigate(`/admin/product-form`);
  };

  // Handler for editing entities
  const handleEdit = (entityType, id, item) => {
    setEditModal({
      isOpen: true,
      entityType,
      item,
    });
  };

  // Handler for saving edited entities
  const handleSave = async (entityType, updatedItem) => {
    try {
      setIsLoading(true);

      // In a real implementation, you would call the API to update the item
      const endpoint = apiEndpoints[entityType.toLowerCase()];

      // Simulate API call
      // const response = await updateApiById(endpoint, updatedItem.id, updatedItem);

      // Map the entityType to the correct property name in the data object
      let entityKey;
      switch (entityType.toLowerCase()) {
        case "product variants":
        case "variants":
          // In a real implementation, you would call the API to update the item
          const endpoint = apiEndpoints[entityType.toLowerCase()];

        // Simulate API call
        // const response = await updateApiById(endpoint, updatedItem.id, updatedItem);

        case "attributevalues":
          entityKey = "attributeValues";
          break;
        default:
          entityKey = entityType.toLowerCase() + "s";
      }

      // Check if the entityKey exists in the data object
      if (!data[entityKey]) {
        console.error(`Entity key "${entityKey}" not found in data object`);
        toast.error(`Failed to update ${entityType}. Invalid entity type.`);
        setIsLoading(false);
        return;
      }

      // Update the local state
      setData((prevData) => ({
        ...prevData,
        [entityKey]: prevData[entityKey].map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      }));

      toast.success(`${entityType} updated successfully!`);
      setEditModal({ isOpen: false, entityType: "", item: null });
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      toast.error(`Failed to update ${entityType}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting entities
  const handleDelete = async (entityType, id) => {
    // Confirm deletion
    if (
      !window.confirm(`Are you sure you want to delete this ${entityType}?`)
    ) {
      return;
    }

    try {
      setIsLoading(true);

      // In a real implementation, you would call the API to delete the item
      const endpoint = apiEndpoints[entityType.toLowerCase()];

      // Simulate API call
      // const response = await deleteApiById(endpoint, id);

      // Map the entityType to the correct property name in the data object
      let entityKey;
      switch (entityType.toLowerCase()) {
        case "product variants":
        case "variants":
          entityKey = "variants";
          break;
        case "product attributes":
        case "attributes":
          entityKey = "attributes";
          break;
        case "attribute values":
        case "attributevalues":
          entityKey = "attributeValues";
          break;
        default:
          entityKey = entityType.toLowerCase() + "s";
      }

      // Check if the entityKey exists in the data object
      if (!data[entityKey]) {
        console.error(`Entity key "${entityKey}" not found in data object`);
        toast.error(`Failed to delete ${entityType}. Invalid entity type.`);
        setIsLoading(false);
        return;
      }

      // Update the local state
      setData((prevData) => ({
        ...prevData,
        [entityKey]: prevData[entityKey].filter((item) => item.id !== id),
      }));

      toast.success(`${entityType} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      toast.error(`Failed to delete ${entityType}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && Object.keys(data).length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Product Management</h1>
        <button
          className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => navigate("/admin/product-form")}
        >
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Categories Card */}
        <EntityCard
          title="Categories"
          data={filteredCategories}
          searchPlaceholder="Search categories..."
          fields={[
            { key: "name", label: "Name" },
            { key: "target_role", label: "Target Role" },
          ]}
          onAdd={() => handleAdd("category")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.categories}
          onClearFilter={() => clearFilter("categories")}
          selectedItem={selectedItems.categories}
        />

        {/* Brands Card */}
        <EntityCard
          title="Brands"
          data={filteredBrands}
          searchPlaceholder="Search brands..."
          fields={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
          ]}
          onAdd={() => handleAdd("brand")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.brands}
          onClearFilter={() => clearFilter("brands")}
          selectedItem={selectedItems.brands}
        />

        {/* Products Card */}
        <EntityCard
          title="Products"
          data={filteredProducts}
          searchPlaceholder="Search products..."
          fields={[
            { key: "name", label: "Name" },
            { key: "category", label: "Category" },
          ]}
          onAdd={() => handleAdd("product")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.products}
          onClearFilter={() => clearFilter("products")}
          selectedItem={selectedItems.products}
        />

        {/* Variants Card */}
        <EntityCard
          title="Product Variants"
          data={filteredVariants}
          searchPlaceholder="Search variants..."
          fields={[
            { key: "product_name", label: "Product" },
            { key: "sku", label: "SKU" },
          ]}
          onAdd={() => handleAdd("variant")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.variants}
          onClearFilter={() => clearFilter("variants")}
          selectedItem={selectedItems.variants}
        />

        {/* Attributes Card */}
        <EntityCard
          title="Product Attributes"
          data={filteredAttributes}
          searchPlaceholder="Search attributes..."
          fields={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
          ]}
          onAdd={() => handleAdd("attribute")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.attributes}
          onClearFilter={() => clearFilter("attributes")}
          selectedItem={selectedItems.attributes}
        />

        {/* Attribute Values Card */}
        <EntityCard
          title="Attribute Values"
          data={filteredAttributeValues}
          searchPlaceholder="Search attribute values..."
          fields={[
            { key: "attribute", label: "Attribute" },
            { key: "value", label: "Value" },
          ]}
          onAdd={() => handleAdd("attribute-value")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          activeFilter={activeFilters.attributeValues}
          onClearFilter={() => clearFilter("attributeValues")}
          selectedItem={selectedItems.attributeValues}
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() =>
          setEditModal({ isOpen: false, entityType: "", item: null })
        }
        entityType={editModal.entityType}
        item={editModal.item}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductDashboard;
