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
  adminProductManagementDashboardDataRoute,
} from "../../../src/index.js";

// Initial data - will be replaced with API data
const initialData = {
  categories: [],
  brands: [],
  products: [],
  variants: [],
  attributeValues: [],
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
  selectedItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Add debugging to see what selectedItem is being passed
  console.log(`${title} selectedItem:`, selectedItem);

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Convert title to lowercase for use in onSelect
  const entityType = title.toLowerCase().replace(/\s+/g, " ");

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
              filteredData.map((item) => {
                // Fix the highlighting logic
                const isSelected = selectedItem && selectedItem.id === item.id;
                console.log(
                  `Row ${item.id} selected:`,
                  isSelected,
                  `(selectedItem?.id: ${selectedItem?.id}, item.id: ${item.id})`
                );

                return (
                  <tr
                    key={item.id}
                    className={`cursor-pointer ${
                      isSelected
                        ? "bg-blue-100 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onSelect(entityType, item)}
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={fields.length + 1}
                  className="p-2 text-center text-gray-500 italic"
                >
                  No data available
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
  const [data, setData] = useState({
    categories: [],
    brands: [],
    products: [],
    variants: [],
    attributeValues: [],
  });
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

  // Add a useEffect to log when selectedItems changes
  useEffect(() => {
    console.log("selectedItems state updated:", selectedItems);
  }, [selectedItems]);

  // Debug function to check attribute values filtering
  const debugAttributeValuesFiltering = (productId) => {
    console.log(
      "Debugging attribute values filtering for product ID:",
      productId
    );
    console.log("All attribute values:", data.attributeValues);

    const matchingAttributeValues = data.attributeValues.filter((attrVal) => {
      const hasProductId =
        attrVal.product_ids && attrVal.product_ids.includes(productId);
      console.log(
        `Attribute value ${attrVal.id} (${attrVal.attribute}: ${attrVal.value}):`,
        `product_ids:`,
        attrVal.product_ids,
        `includes ${productId}:`,
        hasProductId
      );
      return hasProductId;
    });

    console.log("Matching attribute values:", matchingAttributeValues);
    return matchingAttributeValues;
  };

  // Add this useEffect to log the structure of attribute values when data is loaded
  useEffect(() => {
    if (data && data.attributeValues && data.attributeValues.length > 0) {
      console.log("Attribute Values structure:", data.attributeValues[0]);
      console.log("Sample product_ids:", data.attributeValues[0].product_ids);
    }
  }, [data]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getApi(adminProductManagementDashboardDataRoute);
        console.log("API Response:", response); // Debug log

        if (response && response.success === true) {
          // Transform API response to match component's expected format
          const transformedData = {
            categories: response.data.categories.map((category) => ({
              id: category.category_id,
              name: category.name,
              slug: category.name.toLowerCase().replace(/\s+/g, "-"),
              target_role: category.target_role,
              product_ids: category.product_ids || [],
            })),

            brands: response.data.brands.map((brand) => ({
              id: brand.brand_id,
              name: brand.name,
              slug: brand.slug,
              product_ids: brand.product_ids || [],
              // For compatibility with existing filtering logic
              category_id: [],
            })),

            products: response.data.products.map((product) => ({
              id: product.product_id,
              name: product.name,
              category: product.category_name,
              category_id: product.category_id,
              brand: product.brand_name,
              brand_id: product.brand_id,
              // Default values for fields not in the API response
              price: 0,
              stock: 0,
              visibility: "Published",
              image: `https://via.placeholder.com/50?text=${encodeURIComponent(
                product.name
              )}`,
            })),

            variants: response.data.productVariants.map((variant) => ({
              id: variant.product_variant_id,
              product_id: variant.product_id,
              product_name: variant.product_name,
              sku: variant.sku,
              // Default values for fields not in the API response
              price: 0,
              stock: 0,
            })),

            attributeValues: response.data.attributeValues.map((attrVal) => ({
              id: attrVal.product_attribute_value_id,
              attribute_id: attrVal.product_attribute_id,
              attribute: attrVal.attribute_name,
              value: attrVal.value,
              product_ids: attrVal.product_ids || [],
            })),
          };

          console.log("Transformed Data:", transformedData); // Debug log

          setData(transformedData);
          setFilteredCategories(transformedData.categories);
          setFilteredBrands(transformedData.brands);
          setFilteredProducts(transformedData.products);
          setFilteredVariants(transformedData.variants);
          setFilteredAttributeValues(transformedData.attributeValues);
        } else {
          console.error("Error in API response:", response);
          setError("Failed to load data. Please try again.");
          // Initialize with empty arrays instead of initialData
          setData({
            categories: [],
            brands: [],
            products: [],
            variants: [],
            attributeValues: [],
          });
          resetFilters({
            categories: [],
            brands: [],
            products: [],
            variants: [],
            attributeValues: [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        // Initialize with empty arrays instead of initialData
        setData({
          categories: [],
          brands: [],
          products: [],
          variants: [],
          attributeValues: [],
        });
        resetFilters({
          categories: [],
          brands: [],
          products: [],
          variants: [],
          attributeValues: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset all filters
  const resetFilters = (dataToUse) => {
    const dataSource = dataToUse || data;

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

    setFilteredCategories(dataSource.categories || []);
    setFilteredBrands(dataSource.brands || []);
    setFilteredProducts(dataSource.products || []);
    setFilteredVariants(dataSource.variants || []);
    setFilteredAttributes(dataSource.attributes || []);
    setFilteredAttributeValues(dataSource.attributeValues || []);
  };

  // Handle item selection for filtering
  const handleSelect = (entityType, item) => {
    console.log(`Selected ${entityType}:`, item); // Debug log

    // Normalize entity types
    if (entityType === "product variants") {
      entityType = "variants";
    } else if (entityType === "attribute values") {
      entityType = "attributeValues";
    }

    // Create a new selectedItems object with all properties set to null
    const newSelectedItems = {
      categories: null,
      brands: null,
      products: null,
      variants: null,
      attributes: null,
      attributeValues: null,
    };

    // Set the selected item for the current entity type
    newSelectedItems[entityType] = item;

    // Handle variant selection
    if (entityType === "variants") {
      const variantProduct = data.products.find(
        (product) => product.id === item.product_id
      );

      if (variantProduct) {
        newSelectedItems.products = variantProduct;

        const relatedCategory = data.categories.find(
          (cat) => cat.id === variantProduct.category_id
        );
        if (relatedCategory) {
          newSelectedItems.categories = relatedCategory;
        }

        const relatedBrand = data.brands.find(
          (brand) => brand.id === variantProduct.brand_id
        );
        if (relatedBrand) {
          newSelectedItems.brands = relatedBrand;
        }
      }
    }
    // Handle attribute value selection
    else if (entityType === "attributeValues") {
      // Find all products related to this attribute value
      const productIds = item.product_ids || [];
      console.log("Attribute value product IDs:", productIds);

      if (productIds.length > 0) {
        // Find the first related product (we can only highlight one)
        const relatedProduct = data.products.find((product) =>
          productIds.includes(product.id)
        );

        if (relatedProduct) {
          newSelectedItems.products = relatedProduct;
          console.log("Related product found:", relatedProduct);

          // Find related category and brand
          const relatedCategory = data.categories.find(
            (cat) => cat.id === relatedProduct.category_id
          );
          if (relatedCategory) {
            newSelectedItems.categories = relatedCategory;
          }

          const relatedBrand = data.brands.find(
            (brand) => brand.id === relatedProduct.brand_id
          );
          if (relatedBrand) {
            newSelectedItems.brands = relatedBrand;
          }

          // Find related variants
          const relatedVariant = data.variants.find(
            (variant) => variant.product_id === relatedProduct.id
          );
          if (relatedVariant) {
            newSelectedItems.variants = relatedVariant;
          }
        }
      }
    }

    console.log("Setting selectedItems to:", newSelectedItems);
    setSelectedItems(newSelectedItems);

    // Keep all items visible
    setFilteredVariants(data.variants);
    setFilteredProducts(data.products);
    setFilteredCategories(data.categories);
    setFilteredBrands(data.brands);
    setFilteredAttributeValues(data.attributeValues);
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
    // Pass the current data to ProductForm via state
    navigate(`/admin/product-form`, {
      state: {
        dashboardData: data,
        entityType: entityType,
      },
    });
  };

  // Handler for editing entities
  const handleEdit = (entityType, id, item) => {
    // For direct editing in modal
    setEditModal({
      isOpen: true,
      entityType,
      item,
    });
  };

  // Handler for saving edited entities
  const handleSave = async (entityType, updatedItem) => {
    setIsLoading(true);
    try {
      // Map the entityType to the correct property name in the data object and API endpoint
      let entityKey, idField;
      switch (entityType.toLowerCase()) {
        case "categories":
          entityKey = "categories";
          idField = "category_id";
          break;
        case "brands":
          entityKey = "brands";
          idField = "brand_id";
          break;
        case "products":
          entityKey = "products";
          idField = "product_id";
          break;
        case "product variants":
        case "variants":
          entityKey = "variants";
          idField = "product_variant_id";
          break;
        case "product attributes":
        case "attributes":
          entityKey = "attributes";
          idField = "product_attribute_id";
          break;
        case "attribute values":
        case "attributevalues":
          entityKey = "attributeValues";
          idField = "product_attribute_value_id";
          break;
        default:
          entityKey = entityType.toLowerCase() + "s";
          idField = entityType.toLowerCase() + "_id";
      }

      // Check if the entityKey exists in the data object
      if (!data[entityKey]) {
        console.error(`Entity key "${entityKey}" not found in data object`);
        toast.error(`Failed to update ${entityType}. Invalid entity type.`);
        setIsLoading(false);
        return;
      }

      // Get the API endpoint for this entity type
      const endpoint = apiEndpoints[entityType.toLowerCase()];
      if (!endpoint) {
        console.error(`API endpoint for "${entityType}" not found`);
        toast.error(`Failed to update ${entityType}. Invalid entity type.`);
        setIsLoading(false);
        return;
      }

      // Prepare the item for the API
      const apiItem = { ...updatedItem };

      // In a real implementation, you would call the API to update the item
      // const response = await updateApiById(endpoint, apiItem[idField], apiItem);

      // For now, we'll just update the local state
      const updatedData = { ...data };
      const itemIndex = updatedData[entityKey].findIndex(
        (item) => item.id === updatedItem.id
      );

      if (itemIndex !== -1) {
        updatedData[entityKey][itemIndex] = updatedItem;
        setData(updatedData);

        // Update filtered data
        switch (entityKey) {
          case "categories":
            setFilteredCategories([...updatedData.categories]);
            break;
          case "brands":
            setFilteredBrands([...updatedData.brands]);
            break;
          case "products":
            setFilteredProducts([...updatedData.products]);
            break;
          case "variants":
            setFilteredVariants([...updatedData.variants]);
            break;
          case "attributes":
            setFilteredAttributes([...updatedData.attributes]);
            break;
          case "attributeValues":
            setFilteredAttributeValues([...updatedData.attributeValues]);
            break;
        }

        toast.success(`${entityType} updated successfully`);
      } else {
        toast.error(`${entityType} not found`);
      }
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      toast.error(`Failed to update ${entityType}`);
    } finally {
      setIsLoading(false);
      setEditModal({ isOpen: false, entityType: "", item: null });
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
      const endpoint = endpoint[entityType.toLowerCase()];

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

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => navigate("/admin/product-form")}
          >
            Add New Product
          </button>
          <button
            onClick={() => resetFilters(data)}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Add debugging to see what's being passed to each EntityCard */}
          {console.log(
            "Rendering EntityCards with selectedItems:",
            selectedItems
          )}

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
      )}

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
