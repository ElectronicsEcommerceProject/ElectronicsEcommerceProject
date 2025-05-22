import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ProductCatalogManagement = () => {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const dashboardData = location.state?.dashboardData;
  const initialEntityType = location.state?.entityType;

  // Set initial step based on entityType if provided
  useEffect(() => {
    if (initialEntityType) {
      switch (initialEntityType.toLowerCase()) {
        case "categories":
        case "category":
          setStep(1);
          break;
        case "brands":
        case "brand":
          setStep(2);
          break;
        case "products":
        case "product":
          setStep(3);
          break;
        case "variants":
        case "variant":
          setStep(4);
          break;
        case "attributes":
        case "attribute":
          setStep(5);
          break;
        case "attributevalues":
        case "attribute-value":
          setStep(6);
          break;
        case "media":
          setStep(7);
          break;
        default:
          setStep(1);
      }
    }
  }, [initialEntityType]);

  const [formData, setFormData] = useState({
    categories: [],
    brands: [],
    products: [],
    variants: [],
    attributes: [],
    attributeValues: [],
    media: [],
  });

  // Store form data for each step
  const [stepFormData, setStepFormData] = useState({
    1: {}, // Category form data
    2: {}, // Brand form data
    3: {}, // Product form data
    4: {}, // Variant form data
    5: {}, // Attribute form data
    6: {}, // Attribute Value form data
    7: {}, // Media form data
  });

  // Add a new function to transform the stepFormData before displaying it
  const getFormattedStepData = () => {
    return {
      categoryFormData: stepFormData[1] || {},
      brandFormData: stepFormData[2] || {},
      productFormData: stepFormData[3] || {},
      variantFormData: stepFormData[4] || {},
      attributeFormData: stepFormData[5] || {},
      attributeValueFormData: stepFormData[6] || {},
      mediaFormData: stepFormData[7] || {},
      // Include the related selections from step 7
      relatedSelections: stepFormData[7]
        ? {
            category:
              stepFormData[7].selected_category ||
              stepFormData[7].selected_category_name,
            brand:
              stepFormData[7].selected_brand ||
              stepFormData[7].selected_brand_name,
            product:
              stepFormData[7].selected_product ||
              stepFormData[7].selected_product_name,
            variant:
              stepFormData[7].selected_variant ||
              stepFormData[7].selected_variant_name,
          }
        : {},
    };
  };

  // Initialize with data from dashboard only
  useEffect(() => {
    if (dashboardData) {
      console.log("Using data from ProductDashboard:", dashboardData);

      // Map dashboard data to our format
      setFormData({
        categories: dashboardData.categories || [],
        brands: dashboardData.brands || [],
        products: dashboardData.products || [],
        variants: dashboardData.variants || [],
        attributes: dashboardData.attributes || [],
        attributeValues: dashboardData.attributeValues || [],
        media: dashboardData.media || [],
      });
    } else {
      console.log(
        "No dashboard data available, initializing with empty arrays"
      );
      // Initialize with empty arrays instead of dummy data
      setFormData({
        categories: [],
        brands: [],
        products: [],
        variants: [],
        attributes: [],
        attributeValues: [],
        media: [],
      });
    }
  }, [dashboardData]);

  const handleSubmit = async (e, endpoint, data, nextStep) => {
    e.preventDefault();
    try {
      // Save the form data for the current step
      setStepFormData((prev) => ({
        ...prev,
        [step]: data,
      }));

      // Generate ID based on entity type
      let responseData;
      const entityType = endpoint.split("/").pop();

      switch (entityType) {
        case "categories":
          responseData = { ...data, category_id: `cat-${Date.now()}` };
          setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, responseData],
          }));
          break;
        case "brands":
          responseData = { ...data, brand_id: `brand-${Date.now()}` };
          setFormData((prev) => ({
            ...prev,
            brands: [...prev.brands, responseData],
          }));
          break;
        case "product":
          responseData = { ...data, product_id: `prod-${Date.now()}` };
          setFormData((prev) => ({
            ...prev,
            products: [...prev.products, responseData],
          }));
          break;
        case "product-variant":
          responseData = { ...data, product_variant_id: `var-${Date.now()}` };
          setFormData((prev) => ({
            ...prev,
            variants: [...prev.variants, responseData],
          }));
          break;
        case "product-attributes":
          responseData = {
            ...data,
            product_attribute_id: `attr-${Date.now()}`,
          };
          setFormData((prev) => ({
            ...prev,
            attributes: [...prev.attributes, responseData],
          }));
          break;
        case "product-attribute-values":
          responseData = {
            ...data,
            product_attribute_value_id: `attrval-${Date.now()}`,
          };
          setFormData((prev) => ({
            ...prev,
            attributeValues: [...prev.attributeValues, responseData],
          }));
          break;
        case "product-media":
          responseData = {
            ...data,
            product_media_id: `media-${Date.now()}`,
            media_url: data.media_file
              ? URL.createObjectURL(data.media_file)
              : "https://example.com/default.jpg",
          };
          setFormData((prev) => ({
            ...prev,
            media: [...prev.media, responseData],
          }));
          break;
      }

      console.log("Form submitted successfully:", responseData);
      setTimeout(() => {
        setStep(nextStep);
      }, 500);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const Stepper = () => (
    <div className="flex flex-wrap justify-between mb-6 md:mb-8 gap-2">
      {[
        "Category",
        "Brand",
        "Product",
        "Variant",
        "Attribute",
        "Attr Value",
        "Media",
      ].map((label, index) => (
        <div
          key={index}
          className={`flex-1 min-w-[60px] md:min-w-[80px] text-center ${
            step > index + 1
              ? "text-green-600"
              : step === index + 1
              ? "text-blue-600"
              : "text-gray-500"
          }`}
        >
          <div
            className={`w-6 h-6 md:w-8 md:h-8 mx-auto rounded-full flex items-center justify-center
            ${
              step > index + 1
                ? "bg-green-600"
                : step === index + 1
                ? "bg-blue-600"
                : "bg-gray-300"
            } text-white`}
          >
            {index + 1}
          </div>
          <span className="text-xs md:text-sm mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  );

  // Utility function to generate slug
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const FormComponent = ({ title, fields, endpoint, nextStep }) => {
    // Initialize with data from stepFormData if available
    const [localData, setLocalData] = useState(() => {
      return { ...stepFormData[step] };
    });

    const [filledFields, setFilledFields] = useState(() => {
      // Initialize filledFields based on existing data
      const filled = {};
      Object.keys(stepFormData[step] || {}).forEach((key) => {
        filled[key] = !!stepFormData[step][key];
      });
      return filled;
    });

    // Update localData when step changes to load saved data
    useEffect(() => {
      setLocalData({ ...stepFormData[step] });

      // Update filledFields based on the loaded data
      const filled = {};
      Object.keys(stepFormData[step] || {}).forEach((key) => {
        filled[key] = !!stepFormData[step][key];
      });
      setFilledFields(filled);
    }, [step]);

    const handleChange = (e) => {
      const { name, value, type, files } = e.target;
      const newValue = type === "file" ? files[0] : value;
      console.log(`Field changed: ${name} =`, newValue);

      setLocalData((prev) => ({ ...prev, [name]: newValue }));
      setFilledFields((prev) => ({ ...prev, [name]: !!newValue }));

      // Auto-generate slug from name for category, brand, and product
      if (name === "name" && (step === 1 || step === 2 || step === 3)) {
        const slug = generateSlug(newValue);
        setLocalData((prev) => ({ ...prev, slug }));
        setFilledFields((prev) => ({ ...prev, slug: !!slug }));
      }
    };

    const isFormValid = fields.every((field) => {
      if (field.type === "file") {
        return localData[field.name] instanceof File;
      }
      return (
        localData[field.name] && localData[field.name].toString().trim() !== ""
      );
    });

    // Store form data in parent component when submitting
    const handleFormSubmit = (e) => {
      e.preventDefault();
      // Save the current form data to the parent component
      handleSubmit(e, endpoint, localData, nextStep);
    };

    // Get dropdown options based on field name and step
    const getDropdownOptions = (fieldName) => {
      if (step === 1 && fieldName === "target_role") {
        return [
          { id: "customer", name: "Customer" },
          { id: "retailer", name: "Retailer" },
          { id: "both", name: "Both" },
        ];
      } else if (step === 3 && fieldName === "category_id") {
        return formData.categories.map((cat) => ({
          id: cat.category_id || cat.id,
          name: cat.name,
        }));
      } else if (step === 3 && fieldName === "brand_id") {
        return formData.brands.map((brand) => ({
          id: brand.brand_id || brand.id,
          name: brand.name,
        }));
      } else if (step === 4 && fieldName === "product_id") {
        return formData.products.map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
        }));
      } else if (step === 6 && fieldName === "attribute_id") {
        return formData.attributes.map((attr) => ({
          id: attr.product_attribute_id || attr.id,
          name: attr.name,
        }));
      } else if (step === 7 && fieldName === "product_id") {
        return formData.products.map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
        }));
      } else if (step === 5 && fieldName === "type") {
        return [
          { id: "select", name: "Select" },
          { id: "text", name: "Text" },
        ];
      } else if (step === 7 && fieldName === "media_type") {
        return [
          { id: "image", name: "Image" },
          { id: "video", name: "Video" },
        ];
      }
      return [];
    };

    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border-2 border-blue-500">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
          {title}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-3 md:space-y-4">
          {fields.map((field, index) => (
            <div key={field.name} className="mb-3">
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                {field.label}
              </label>

              {field.type === "select" ? (
                <SearchableDropdown
                  name={field.name}
                  value={localData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  options={getDropdownOptions(field.name)}
                  displayKey="name"
                  valueKey="id"
                  disabled={index > 0 && !filledFields[fields[index - 1].name]}
                  required
                />
              ) : field.type === "file" ? (
                <div className="mt-1">
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    accept="image/*,video/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-2 file:py-1 file:px-3
                      md:file:mr-4 md:file:py-2 md:file:px-4
                      file:rounded-md file:border-0
                      file:text-sm md:file:text-base
                      file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    disabled={
                      index > 0 && !filledFields[fields[index - 1].name]
                    }
                    required
                  />
                  {localData[field.name] && (
                    <div className="mt-2 text-xs text-gray-500">
                      Selected: {localData[field.name].name}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={localData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 text-sm md:text-base"
                  disabled={index > 0 && !filledFields[fields[index - 1].name]}
                  required
                  list={`${field.name}-suggestions`}
                />
              )}

              {/* Add datalist for text inputs to show suggestions */}
              {field.type === "text" && (
                <datalist id={`${field.name}-suggestions`}>
                  {step === 1 &&
                    field.name === "name" &&
                    formData.categories.map((cat, idx) => (
                      <option key={idx} value={cat.name} />
                    ))}
                  {step === 2 &&
                    field.name === "name" &&
                    formData.brands.map((brand, idx) => (
                      <option key={idx} value={brand.name} />
                    ))}
                  {step === 3 &&
                    field.name === "name" &&
                    formData.products.map((product, idx) => (
                      <option key={idx} value={product.name} />
                    ))}
                  {step === 4 &&
                    field.name === "sku" &&
                    formData.variants.map((variant, idx) => (
                      <option key={idx} value={variant.sku} />
                    ))}
                  {step === 5 &&
                    field.name === "name" &&
                    formData.attributes.map((attr, idx) => (
                      <option key={idx} value={attr.name} />
                    ))}
                  {step === 6 &&
                    field.name === "value" &&
                    formData.attributeValues.map((attrVal, idx) => (
                      <option key={idx} value={attrVal.value} />
                    ))}
                </datalist>
              )}
            </div>
          ))}

          <div className="flex space-x-2 md:space-x-4 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 text-sm md:text-base"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 text-sm md:text-base
                ${!isFormValid ? "opacity-70 cursor-not-allowed" : ""}
                ${step === 1 ? "w-full" : ""}`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Add this new component for searchable dropdown
  const SearchableDropdown = ({
    name,
    value,
    onChange,
    placeholder,
    options,
    displayKey = "name",
    valueKey = "id",
    disabled = false,
    required,
    allowCreate = false,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Find the selected option for display
    const selectedOption = options.find((option) => option[valueKey] === value);

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle outside click to close dropdown
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle option selection
    const handleSelect = (option) => {
      const syntheticEvent = {
        target: {
          name,
          value: option[valueKey],
        },
      };
      onChange(syntheticEvent);
      setIsOpen(false);
      setSearchTerm("");
    };

    // Handle creating a new item
    const handleCreateNew = () => {
      if (!searchTerm.trim()) return;

      const newId = `new-${name}-${Date.now()}`;
      const newItem = {
        [valueKey]: newId,
        [displayKey]: searchTerm.trim(),
      };

      const syntheticEvent = {
        target: {
          name,
          value: newId,
          newItem: newItem,
        },
      };

      onChange(syntheticEvent);
      setIsOpen(false);
      setSearchTerm("");
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className={`mt-1 flex items-center justify-between w-full rounded-md border-2 ${
            disabled
              ? "bg-gray-100 border-gray-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } p-2 text-sm md:text-base ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className={`flex-1 truncate ${disabled ? "text-gray-400" : ""}`}>
            {selectedOption ? selectedOption[displayKey] : placeholder}
          </div>
          <svg
            className={`h-5 w-5 ${
              disabled ? "text-gray-300" : "text-gray-400"
            } transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
            <div className="sticky top-0 bg-white p-2 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full p-2 border rounded-md text-sm"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {filteredOptions.length > 0 ? (
              <ul>
                {filteredOptions.map((option, index) => (
                  <li
                    key={option[valueKey] || index}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {option[displayKey]}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}

            {/* Add option to create new item if allowed and search term is not empty */}
            {allowCreate && searchTerm.trim() && (
              <div
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm border-t border-gray-300"
                onClick={handleCreateNew}
              >
                <span className="font-medium">Create new:</span> {searchTerm}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add a new component for the enhanced form with related entity dropdowns
  const EnhancedFormComponent = ({
    title,
    fields,
    endpoint,
    nextStep,
    relatedEntities = [], // Array of related entities to show as dropdowns
  }) => {
    // Initialize with data from stepFormData if available
    const [localData, setLocalData] = useState(() => {
      return { ...stepFormData[step] };
    });

    const [filledFields, setFilledFields] = useState(() => {
      // Initialize filledFields based on existing data
      const filled = {};
      Object.keys(stepFormData[step] || {}).forEach((key) => {
        filled[key] = !!stepFormData[step][key];
      });
      return filled;
    });

    // State for related entity selections
    const [relatedSelections, setRelatedSelections] = useState({});

    // Function to filter options based on selected related entities
    const getFilteredOptions = (entityType) => {
      // For brands, always return all brands regardless of category selection
      if (entityType === "brands") {
        return formData.brands.map((brand) => ({
          id: brand.brand_id || brand.id,
          name: brand.name,
        }));
      }

      // If no category is selected, return all options for other entity types
      if (!relatedSelections.categories) {
        return formData[entityType].map((item) => {
          const idField =
            entityType === "products"
              ? "product_id"
              : entityType === "variants"
              ? "product_variant_id"
              : "id";

          const nameField = entityType === "variants" ? "sku" : "name";

          return {
            id: item[idField] || item.id,
            name:
              item[nameField] ||
              (entityType === "variants"
                ? `Variant of ${
                    formData.products.find((p) => p.id === item.product_id)
                      ?.name || "Unknown Product"
                  }`
                : item.name),
          };
        });
      }

      const selectedCategoryId =
        relatedSelections.categories.id ||
        relatedSelections.categories.category_id;

      // Filter products based on selected category
      if (entityType === "products") {
        return formData.products
          .filter((product) => product.category_id === selectedCategoryId)
          .map((product) => ({
            id: product.product_id || product.id,
            name: product.name,
          }));
      }

      // Filter variants based on selected category
      if (entityType === "variants") {
        // Find products in this category
        const categoryProducts = formData.products.filter(
          (product) => product.category_id === selectedCategoryId
        );

        // Get product IDs
        const productIds = categoryProducts.map(
          (product) => product.id || product.product_id
        );

        // Filter variants by these product IDs
        return formData.variants
          .filter((variant) => productIds.includes(variant.product_id))
          .map((variant) => ({
            id: variant.product_variant_id || variant.id,
            name:
              variant.sku ||
              `Variant of ${
                formData.products.find((p) => p.id === variant.product_id)
                  ?.name || "Unknown Product"
              }`,
          }));
      }

      // Filter products based on selected brand
      if (entityType === "products" && relatedSelections.brands) {
        const selectedBrandId =
          relatedSelections.brands.id || relatedSelections.brands.brand_id;

        return formData.products
          .filter((product) => {
            // If category is selected, filter by both category and brand
            if (relatedSelections.categories) {
              const selectedCategoryId =
                relatedSelections.categories.id ||
                relatedSelections.categories.category_id;
              return (
                product.category_id === selectedCategoryId &&
                product.brand_id === selectedBrandId
              );
            }
            // Otherwise just filter by brand
            return product.brand_id === selectedBrandId;
          })
          .map((product) => ({
            id: product.product_id || product.id,
            name: product.name,
          }));
      }

      // Filter variants based on selected product
      if (entityType === "variants" && relatedSelections.products) {
        const selectedProductId =
          relatedSelections.products.id ||
          relatedSelections.products.product_id;

        return formData.variants
          .filter((variant) => variant.product_id === selectedProductId)
          .map((variant) => ({
            id: variant.product_variant_id || variant.id,
            name:
              variant.sku ||
              `Variant of ${
                formData.products.find((p) => p.id === variant.product_id)
                  ?.name || "Unknown Product"
              }`,
          }));
      }

      // Default case - return all items
      return formData[entityType].map((item) => ({
        id: item.id || item[`${entityType.slice(0, -1)}_id`],
        name: item.name || item.sku || item.value,
      }));
    };

    // Check if all required fields are filled and required related entities are selected
    const isFormValid = () => {
      // Check if all required form fields are filled
      const areRequiredFieldsFilled = fields.every(
        (field) => !field.required || filledFields[field.name]
      );

      // Check if required related entities are selected
      let areRelatedEntitiesSelected = true;

      if (relatedEntities.includes("categories")) {
        areRelatedEntitiesSelected = !!relatedSelections.categories;
      }

      if (relatedEntities.includes("brands") && areRelatedEntitiesSelected) {
        areRelatedEntitiesSelected = !!relatedSelections.brands;
      }

      if (relatedEntities.includes("products") && areRelatedEntitiesSelected) {
        areRelatedEntitiesSelected = !!relatedSelections.products;
      }

      // Variants are optional, so we don't check for them

      return areRequiredFieldsFilled && areRelatedEntitiesSelected;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form submitted with data:", localData);

      // Create a copy of localData to add related entity IDs and names
      const dataToSubmit = { ...localData };

      // Add related entity IDs and names from selections if they exist
      if (Object.keys(relatedSelections).length > 0) {
        Object.entries(relatedSelections).forEach(([entityType, entity]) => {
          if (entity) {
            // Add the ID and name based on entity type
            if (entityType === "categories") {
              dataToSubmit.category_id = entity.id || entity.category_id;
              dataToSubmit.selected_category = entity.name;
              dataToSubmit.selected_category_name = entity.name;
              dataToSubmit.category_name = entity.name;
            } else if (entityType === "brands") {
              dataToSubmit.brand_id = entity.id || entity.brand_id;
              dataToSubmit.selected_brand = entity.name;
              dataToSubmit.selected_brand_name = entity.name;
              dataToSubmit.brand_name = entity.name;
            } else if (entityType === "products") {
              dataToSubmit.product_id = entity.id || entity.product_id;
              dataToSubmit.selected_product = entity.name;
              dataToSubmit.selected_product_name = entity.name;
              dataToSubmit.product_name = entity.name;
            } else if (entityType === "variants") {
              dataToSubmit.variant_id = entity.id || entity.variant_id;
              dataToSubmit.selected_variant = entity.sku || entity.name;
              dataToSubmit.selected_variant_name = entity.sku || entity.name;
              dataToSubmit.variant_sku = entity.sku || entity.name;
            } else if (entityType === "attributes") {
              dataToSubmit.attribute_id = entity.id || entity.attribute_id;
              dataToSubmit.selected_attribute = entity.name;
              dataToSubmit.selected_attribute_name = entity.name;
              dataToSubmit.attribute_name = entity.name;
            } else if (entityType === "attributeValues") {
              dataToSubmit.attribute_value_id =
                entity.id || entity.attribute_value_id;
              dataToSubmit.selected_attribute_value = entity.value;
              dataToSubmit.attribute_value = entity.value;
            }
          }
        });
      }

      // Store the form data for this step
      setStepFormData((prev) => ({
        ...prev,
        [step]: dataToSubmit,
      }));

      // Simulate API call
      try {
        console.log(`Submitting to ${endpoint}:`, dataToSubmit);

        // Simulate API response
        await new Promise((resolve) => setTimeout(resolve, 500));
        const responseData = { success: true, data: dataToSubmit };

        // Handle the response based on the entity type
        handleApiResponse(endpoint, dataToSubmit);

        // For media upload (step 7), show an alert with all form data
        if (step === 7) {
          // Get all form data from all steps
          const allFormData = getFormattedStepData();

          // Create a formatted message for the alert
          let alertMessage = "Form Data Summary:\n\n";

          // Add category data
          if (
            allFormData.categoryFormData &&
            Object.keys(allFormData.categoryFormData).length > 0
          ) {
            alertMessage +=
              "Category: " +
              (allFormData.categoryFormData.name || "N/A") +
              "\n";
          }

          // Add brand data
          if (
            allFormData.brandFormData &&
            Object.keys(allFormData.brandFormData).length > 0
          ) {
            alertMessage +=
              "Brand: " + (allFormData.brandFormData.name || "N/A") + "\n";
          }

          // Add product data
          if (
            allFormData.productFormData &&
            Object.keys(allFormData.productFormData).length > 0
          ) {
            alertMessage +=
              "Product: " + (allFormData.productFormData.name || "N/A") + "\n";
          }

          // Add variant data
          if (
            allFormData.variantFormData &&
            Object.keys(allFormData.variantFormData).length > 0
          ) {
            alertMessage +=
              "Variant: " + (allFormData.variantFormData.sku || "N/A") + "\n";
          }

          // Add attribute data
          if (
            allFormData.attributeFormData &&
            Object.keys(allFormData.attributeFormData).length > 0
          ) {
            alertMessage +=
              "Attribute: " +
              (allFormData.attributeFormData.name || "N/A") +
              "\n";
          }

          // Add attribute value data
          if (
            allFormData.attributeValueFormData &&
            Object.keys(allFormData.attributeValueFormData).length > 0
          ) {
            alertMessage +=
              "Attribute Value: " +
              (allFormData.attributeValueFormData.value || "N/A") +
              "\n";
          }

          // Add media data
          alertMessage += "\nMedia Information:\n";
          alertMessage +=
            "Media Type: " + (dataToSubmit.media_type || "N/A") + "\n";
          alertMessage +=
            "File Name: " + (dataToSubmit.media_file?.name || "N/A") + "\n";

          // Add related selections
          alertMessage += "\nRelated Entities:\n";
          alertMessage +=
            "Selected Category: " +
            (relatedSelections.categories?.name || "N/A") +
            "\n";
          alertMessage +=
            "Selected Brand: " +
            (relatedSelections.brands?.name || "N/A") +
            "\n";
          alertMessage +=
            "Selected Product: " +
            (relatedSelections.products?.name || "N/A") +
            "\n";
          alertMessage +=
            "Selected Variant: " +
            (relatedSelections.variants?.name || "N/A") +
            "\n";

          // Show the alert
          alert(alertMessage);
        }

        // Move to the next step
        setStep(nextStep);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error (show error message, etc.)
      }
    };

    // Handle change in form fields
    const handleChange = (e) => {
      const { name, value, type, files, newItem } = e.target;
      const newValue = type === "file" ? files[0] : value;
      console.log(`Field changed: ${name} =`, newValue);

      setLocalData((prev) => ({ ...prev, [name]: newValue }));
      setFilledFields((prev) => ({ ...prev, [name]: !!newValue }));

      // Auto-generate slug from name for category, brand, and product
      if (name === "name" && (step === 1 || step === 2 || step === 3)) {
        const slug = generateSlug(newValue);
        setLocalData((prev) => ({ ...prev, slug }));
        setFilledFields((prev) => ({ ...prev, slug: !!slug }));
      }

      // Handle new item creation
      if (newItem) {
        handleNewItemCreation(name, newItem);
      }
    };

    // Add this function to the EnhancedFormComponent to handle related entity selections
    const handleRelatedEntitySelect = (entityType, entity) => {
      if (!entity) return;

      console.log(`Selected ${entityType}:`, entity);

      // Update the related selections state
      setRelatedSelections((prev) => ({
        ...prev,
        [entityType]: entity,
      }));

      // Update the form data with the selected entity information
      const updatedData = { ...localData };

      // Store both ID and name for each entity type
      if (entityType === "categories") {
        updatedData.category_id = entity.id || entity.category_id;
        updatedData.selected_category = entity.name;
        updatedData.selected_category_name = entity.name;
        updatedData.category_name = entity.name;
      } else if (entityType === "brands") {
        updatedData.brand_id = entity.id || entity.brand_id;
        updatedData.selected_brand = entity.name;
        updatedData.selected_brand_name = entity.name;
        updatedData.brand_name = entity.name;
      } else if (entityType === "products") {
        updatedData.product_id = entity.id || entity.product_id;
        updatedData.selected_product = entity.name;
        updatedData.selected_product_name = entity.name;
        updatedData.product_name = entity.name;
      } else if (entityType === "variants") {
        updatedData.variant_id = entity.id || entity.variant_id;
        updatedData.selected_variant = entity.sku || entity.name;
        updatedData.selected_variant_name = entity.sku || entity.name;
        updatedData.variant_sku = entity.sku || entity.name;
      } else if (entityType === "attributes") {
        updatedData.attribute_id = entity.id || entity.attribute_id;
        updatedData.selected_attribute = entity.name;
        updatedData.selected_attribute_name = entity.name;
        updatedData.attribute_name = entity.name;
      } else if (entityType === "attributeValues") {
        updatedData.attribute_value_id = entity.id || entity.attribute_value_id;
        updatedData.selected_attribute_value = entity.value;
        updatedData.attribute_value = entity.value;
      }

      setLocalData(updatedData);
      console.log("Updated localData with selection:", updatedData);
    };

    // Handle back button
    const handleBack = () => {
      setStep(step - 1);
    };

    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
          {title}
        </h2>

        {/* Related Entity Dropdowns */}
        {relatedEntities.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Select Related Items (in order)
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Category dropdown - always enabled first */}
              {relatedEntities.includes("categories") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1. Category <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    name="related_category"
                    value={relatedSelections.categories?.id || ""}
                    onChange={(e) => {
                      const selectedCategory = formData.categories.find(
                        (cat) =>
                          cat.id === e.target.value ||
                          cat.category_id === e.target.value
                      );
                      handleRelatedEntitySelect("categories", selectedCategory);
                    }}
                    placeholder="First, select a category"
                    options={formData.categories.map((cat) => ({
                      id: cat.category_id || cat.id,
                      name: cat.name,
                    }))}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
                  />
                </div>
              )}

              {/* Brand dropdown - enabled only if category is selected */}
              {relatedEntities.includes("brands") && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      !relatedSelections.categories
                        ? "text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    2. Brand{" "}
                    {relatedSelections.categories && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <SearchableDropdown
                    name="related_brand"
                    value={relatedSelections.brands?.id || ""}
                    onChange={(e) => {
                      const selectedBrand = formData.brands.find(
                        (brand) =>
                          brand.id === e.target.value ||
                          brand.brand_id === e.target.value
                      );
                      handleRelatedEntitySelect("brands", selectedBrand);
                    }}
                    placeholder={
                      relatedSelections.categories
                        ? "Now, select a brand"
                        : "Select a category first"
                    }
                    options={getFilteredOptions("brands")}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
                    disabled={!relatedSelections.categories}
                  />
                </div>
              )}

              {/* Product dropdown - enabled only if brand is selected */}
              {relatedEntities.includes("products") && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      !relatedSelections.brands
                        ? "text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    3. Product{" "}
                    {relatedSelections.brands && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <SearchableDropdown
                    name="related_product"
                    value={relatedSelections.products?.id || ""}
                    onChange={(e) => {
                      const selectedProduct = formData.products.find(
                        (product) =>
                          product.id === e.target.value ||
                          product.product_id === e.target.value
                      );
                      handleRelatedEntitySelect("products", selectedProduct);
                    }}
                    placeholder={
                      relatedSelections.brands
                        ? "Next, select a product"
                        : "Select a brand first"
                    }
                    options={getFilteredOptions("products")}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
                    disabled={!relatedSelections.brands}
                  />
                </div>
              )}

              {/* Variant dropdown - enabled only if product is selected */}
              {relatedEntities.includes("variants") && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      !relatedSelections.products
                        ? "text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    4. Product Variant
                  </label>
                  <SearchableDropdown
                    name="related_variant"
                    value={relatedSelections.variants?.id || ""}
                    onChange={(e) => {
                      const selectedVariant = formData.variants.find(
                        (variant) =>
                          variant.id === e.target.value ||
                          variant.product_variant_id === e.target.value
                      );
                      handleRelatedEntitySelect("variants", selectedVariant);
                    }}
                    placeholder={
                      relatedSelections.products
                        ? "Finally, select a variant (optional)"
                        : "Select a product first"
                    }
                    options={getFilteredOptions("variants")}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={false}
                    disabled={!relatedSelections.products}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "select" ? (
                <SearchableDropdown
                  name={field.name}
                  value={localData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  options={field.options || []}
                  displayKey="name"
                  valueKey="id"
                  disabled={index > 0 && !filledFields[fields[index - 1].name]}
                  required={field.required}
                  allowCreate={field.allowCreate || false}
                />
              ) : field.type === "file" ? (
                <div className="mt-1">
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    accept="image/*,video/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-2 file:py-1 file:px-3
                      md:file:mr-4 md:file:py-2 md:file:px-4
                      file:rounded-md file:border-0
                      file:text-sm md:file:text-base
                      file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    disabled={
                      index > 0 && !filledFields[fields[index - 1].name]
                    }
                    required={field.required}
                  />
                  {localData[field.name] && (
                    <div className="mt-2 text-xs text-gray-500">
                      Selected: {localData[field.name].name}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={localData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 text-sm md:text-base"
                  disabled={index > 0 && !filledFields[fields[index - 1].name]}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="flex space-x-2 md:space-x-4 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200 text-sm md:text-base"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 text-sm md:text-base
                ${!isFormValid() ? "opacity-70 cursor-not-allowed" : ""}
                ${step === 1 ? "w-full" : ""}`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Add a helper function to handle new item creation
  const handleNewItemCreation = (fieldName, newItem) => {
    console.log(`Creating new item for ${fieldName}:`, newItem);

    // Based on the field name and current step, add the new item to the appropriate array
    if (fieldName === "related_category" || fieldName.includes("category")) {
      const newCategory = {
        id: newItem.id,
        category_id: newItem.id,
        name: newItem.name,
        slug: generateSlug(newItem.name),
        isNew: true,
      };

      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    } else if (fieldName === "related_brand" || fieldName.includes("brand")) {
      const newBrand = {
        id: newItem.id,
        brand_id: newItem.id,
        name: newItem.name,
        slug: generateSlug(newItem.name),
        isNew: true,
      };

      setFormData((prev) => ({
        ...prev,
        brands: [...prev.brands, newBrand],
      }));
    } else if (
      fieldName === "related_product" ||
      fieldName.includes("product")
    ) {
      const newProduct = {
        id: newItem.id,
        product_id: newItem.id,
        name: newItem.name,
        slug: generateSlug(newItem.name),
        isNew: true,
      };

      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, newProduct],
      }));
    } else if (
      fieldName === "related_attribute" ||
      fieldName.includes("attribute")
    ) {
      const newAttribute = {
        id: newItem.id,
        product_attribute_id: newItem.id,
        name: newItem.name,
        isNew: true,
      };

      setFormData((prev) => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute],
      }));
    }
  };

  // Add a helper function to handle API responses
  const handleApiResponse = (endpoint, data) => {
    console.log(`API response from ${endpoint}:`, data);

    // Based on the endpoint, update the appropriate data in formData
    if (endpoint.includes("categories")) {
      const newCategory = {
        id: data.id || `temp-cat-${Date.now()}`,
        category_id: data.id || `temp-cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        target_role: data.target_role,
      };

      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    } else if (endpoint.includes("brands")) {
      const newBrand = {
        id: data.id || `temp-brand-${Date.now()}`,
        brand_id: data.id || `temp-brand-${Date.now()}`,
        name: data.name,
        slug: data.slug,
      };

      setFormData((prev) => ({
        ...prev,
        brands: [...prev.brands, newBrand],
      }));
    } else if (
      endpoint.includes("product") &&
      !endpoint.includes("variant") &&
      !endpoint.includes("attribute")
    ) {
      const newProduct = {
        id: data.id || `temp-product-${Date.now()}`,
        product_id: data.id || `temp-product-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        brand_id: data.brand_id,
      };

      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, newProduct],
      }));
    } else if (endpoint.includes("variant")) {
      const newVariant = {
        id: data.id || `temp-variant-${Date.now()}`,
        product_variant_id: data.id || `temp-variant-${Date.now()}`,
        product_id: data.product_id,
        sku: data.sku,
        price: data.price,
        stock_quantity: data.stock_quantity,
      };

      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, newVariant],
      }));
    } else if (endpoint.includes("attribute") && !endpoint.includes("value")) {
      const newAttribute = {
        id: data.id || `temp-attr-${Date.now()}`,
        product_attribute_id: data.id || `temp-attr-${Date.now()}`,
        name: data.name,
        type: data.type,
      };

      setFormData((prev) => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute],
      }));
    } else if (endpoint.includes("attribute-value")) {
      // Create a new attribute first if it doesn't exist
      let attributeId = data.attribute_id;

      if (!attributeId && data.attribute_name) {
        // Generate a temporary attribute ID
        attributeId = `temp-attr-${Date.now()}`;

        // Create a new attribute
        const newAttribute = {
          id: attributeId,
          product_attribute_id: attributeId,
          name: data.attribute_name,
          type: "select", // Default type
          isNew: true,
        };

        // Add the new attribute to formData
        setFormData((prev) => ({
          ...prev,
          attributes: [...prev.attributes, newAttribute],
        }));
      }

      // Now create the attribute value
      const newAttributeValue = {
        id: data.id || `temp-attr-val-${Date.now()}`,
        product_attribute_value_id: data.id || `temp-attr-val-${Date.now()}`,
        attribute_id: attributeId,
        attribute_name: data.attribute_name,
        value: data.value,
        product_id: data.product_id,
        variant_id: data.variant_id,
        category_id: data.category_id,
        brand_id: data.brand_id,
      };

      setFormData((prev) => ({
        ...prev,
        attributeValues: [...prev.attributeValues, newAttributeValue],
      }));
    }
  };

  // Add this function to filter options based on selected related entities
  const getFilteredOptions = (entityType) => {
    // For brands, always return all brands regardless of category selection
    if (entityType === "brands") {
      return formData.brands.map((brand) => ({
        id: brand.brand_id || brand.id,
        name: brand.name,
      }));
    }

    // If no category is selected, return all options for other entity types
    if (!relatedSelections.categories) {
      return formData[entityType].map((item) => {
        const idField =
          entityType === "products"
            ? "product_id"
            : entityType === "variants"
            ? "product_variant_id"
            : "id";

        const nameField = entityType === "variants" ? "sku" : "name";

        return {
          id: item[idField] || item.id,
          name:
            item[nameField] ||
            (entityType === "variants"
              ? `Variant of ${
                  formData.products.find((p) => p.id === item.product_id)
                    ?.name || "Unknown Product"
                }`
              : item.name),
        };
      });
    }

    const selectedCategoryId =
      relatedSelections.categories.id ||
      relatedSelections.categories.category_id;

    // Filter products based on selected category
    if (entityType === "products") {
      return formData.products
        .filter((product) => product.category_id === selectedCategoryId)
        .map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
        }));
    }

    // Filter variants based on selected category
    if (entityType === "variants") {
      // Find products in this category
      const categoryProducts = formData.products.filter(
        (product) => product.category_id === selectedCategoryId
      );

      // Get product IDs
      const productIds = categoryProducts.map(
        (product) => product.id || product.product_id
      );

      // Filter variants by these product IDs
      return formData.variants
        .filter((variant) => productIds.includes(variant.product_id))
        .map((variant) => ({
          id: variant.product_variant_id || variant.id,
          name:
            variant.sku ||
            `Variant of ${
              formData.products.find((p) => p.id === variant.product_id)
                ?.name || "Unknown Product"
            }`,
        }));
    }

    // Filter products based on selected brand
    if (entityType === "products" && relatedSelections.brands) {
      const selectedBrandId =
        relatedSelections.brands.id || relatedSelections.brands.brand_id;

      return formData.products
        .filter((product) => {
          // If category is selected, filter by both category and brand
          if (relatedSelections.categories) {
            const selectedCategoryId =
              relatedSelections.categories.id ||
              relatedSelections.categories.category_id;
            return (
              product.category_id === selectedCategoryId &&
              product.brand_id === selectedBrandId
            );
          }
          // Otherwise just filter by brand
          return product.brand_id === selectedBrandId;
        })
        .map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
        }));
    }

    // Filter variants based on selected product
    if (entityType === "variants" && relatedSelections.products) {
      const selectedProductId =
        relatedSelections.products.id || relatedSelections.products.product_id;

      return formData.variants
        .filter((variant) => variant.product_id === selectedProductId)
        .map((variant) => ({
          id: variant.product_variant_id || variant.id,
          name:
            variant.sku ||
            `Variant of ${
              formData.products.find((p) => p.id === variant.product_id)
                ?.name || "Unknown Product"
            }`,
        }));
    }

    // Default case - return all items
    return formData[entityType].map((item) => ({
      id: item.id || item[`${entityType.slice(0, -1)}_id`],
      name: item.name || item.sku || item.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Stepper />

        {step === 1 && (
          <EnhancedFormComponent
            title="Create Category"
            fields={[
              {
                name: "name",
                label: "Category Name",
                type: "text",
                placeholder: "e.g., Mobiles",
                required: true,
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., mobiles",
                required: true,
              },
              {
                name: "target_role",
                label: "Target Role",
                type: "select",
                placeholder: "Select target role",
                required: true,
                options: [
                  { id: "customer", name: "Customer" },
                  { id: "retailer", name: "Retailer" },
                  { id: "both", name: "Both" },
                ],
              },
            ]}
            endpoint="{{baseUrl}}/admin/categories"
            nextStep={2}
            relatedEntities={[]} // No related entities for categories
          />
        )}

        {step === 2 && (
          <EnhancedFormComponent
            title="Create Brand"
            fields={[
              {
                name: "name",
                label: "Brand Name",
                type: "text",
                placeholder: "e.g., Apple",
                required: true,
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., apple",
                required: true,
              },
            ]}
            endpoint="{{baseUrl}}/admin/brands"
            nextStep={3}
            relatedEntities={["categories"]} // Brands can be related to categories
          />
        )}

        {step === 3 && (
          <EnhancedFormComponent
            title="Create Product"
            fields={[
              {
                name: "name",
                label: "Product Name",
                type: "text",
                placeholder: "e.g., iPhone 15",
                required: true,
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., iphone-15",
                required: true,
              },
              {
                name: "base_price",
                label: "Base Price",
                type: "number",
                placeholder: "e.g., 79999",
                required: true,
              },
              {
                name: "description",
                label: "Description",
                type: "text",
                placeholder: "e.g., Latest iPhone model with A16 chip",
                required: false,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product"
            nextStep={4}
            relatedEntities={["categories", "brands"]} // Products are related to categories and brands
          />
        )}

        {step === 4 && (
          <EnhancedFormComponent
            title="Create Variant"
            fields={[
              {
                name: "sku",
                label: "SKU",
                type: "text",
                placeholder: "e.g., IPH15-128-BLK",
                required: true,
              },
              {
                name: "price",
                label: "Price",
                type: "number",
                placeholder: "e.g., 79999",
                required: true,
              },
              {
                name: "stock_quantity",
                label: "Stock Quantity",
                type: "number",
                placeholder: "e.g., 50",
                required: true,
              },
              {
                name: "color",
                label: "Color",
                type: "text",
                placeholder: "e.g., Black",
                required: false,
              },
              {
                name: "size",
                label: "Size",
                type: "text",
                placeholder: "e.g., 128GB",
                required: false,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-variant"
            nextStep={5}
            relatedEntities={["categories", "brands", "products"]} // Variants are related to categories, brands, and products
          />
        )}

        {step === 5 && (
          <EnhancedFormComponent
            title="Create Attribute"
            fields={[
              {
                name: "name",
                label: "Attribute Name",
                type: "text",
                placeholder: "e.g., Color",
                required: true,
              },
              {
                name: "type",
                label: "Type",
                type: "select",
                placeholder: "Select type",
                required: true,
                options: [
                  { id: "select", name: "Select" },
                  { id: "text", name: "Text" },
                ],
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-attributes"
            nextStep={6}
            relatedEntities={[]} // No related entities for attributes
          />
        )}

        {step === 6 && (
          <EnhancedFormComponent
            title="Create Attribute Value"
            fields={[
              {
                name: "attribute_name",
                label: "Product Attribute",
                type: "text",
                placeholder: "e.g., Color",
                required: true,
              },
              {
                name: "value",
                label: "Product Attribute Value",
                type: "text",
                placeholder: "e.g., Black",
                required: true,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-attribute-values"
            nextStep={7}
            relatedEntities={["categories", "brands", "products", "variants"]} // Show all related entities except attributes
          />
        )}

        {step === 7 && (
          <EnhancedFormComponent
            title="Upload Product Media"
            fields={[
              {
                name: "attribute_name",
                label: "Product Attribute",
                type: "text",
                placeholder: "e.g., Color",
                required: false,
              },
              {
                name: "attribute_value",
                label: "Product Attribute Value",
                type: "text",
                placeholder: "e.g., Red",
                required: false,
              },
              {
                name: "media_type",
                label: "Media Type",
                type: "select",
                placeholder: "Select media type",
                required: true,
                options: [
                  { id: "image", name: "Image" },
                  { id: "video", name: "Video" },
                ],
              },
              {
                name: "media_file",
                label: "Upload Media",
                type: "file",
                required: true,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-media"
            nextStep={8}
            relatedEntities={["categories", "brands", "products", "variants"]} // Include all related entities
          />
        )}

        {step === 8 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center text-green-600">
              Product Creation Complete!
            </h2>

            <div className="mb-6 text-center">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Product Information Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Category Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Category</h4>
                  <p className="font-semibold">
                    {stepFormData[1]?.name ||
                      stepFormData[7]?.selected_category ||
                      stepFormData[7]?.selected_category_name ||
                      stepFormData[7]?.category_name ||
                      "N/A"}
                  </p>
                  {stepFormData[1]?.slug && (
                    <p className="text-sm text-gray-500">
                      Slug: {stepFormData[1].slug}
                    </p>
                  )}
                  {stepFormData[1]?.target_role && (
                    <p className="text-sm text-gray-500">
                      Target Role: {stepFormData[1].target_role}
                    </p>
                  )}
                </div>

                {/* Brand Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Brand</h4>
                  <p className="font-semibold">
                    {stepFormData[2]?.name ||
                      stepFormData[7]?.selected_brand ||
                      stepFormData[7]?.selected_brand_name ||
                      stepFormData[7]?.brand_name ||
                      "N/A"}
                  </p>
                  {stepFormData[2]?.slug && (
                    <p className="text-sm text-gray-500">
                      Slug: {stepFormData[2].slug}
                    </p>
                  )}
                </div>

                {/* Product Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Product</h4>
                  <p className="font-semibold">
                    {stepFormData[3]?.name ||
                      stepFormData[7]?.selected_product ||
                      stepFormData[7]?.selected_product_name ||
                      stepFormData[7]?.product_name ||
                      "N/A"}
                  </p>
                  {stepFormData[3]?.base_price && (
                    <p className="text-sm text-gray-500">
                      Base Price: ${stepFormData[3].base_price}
                    </p>
                  )}
                  {stepFormData[3]?.description && (
                    <p className="text-sm text-gray-500">
                      Description: {stepFormData[3].description}
                    </p>
                  )}
                </div>

                {/* Variant Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Variant</h4>
                  <p className="font-semibold">
                    SKU:{" "}
                    {stepFormData[4]?.sku ||
                      stepFormData[7]?.selected_variant ||
                      stepFormData[7]?.selected_variant_name ||
                      stepFormData[7]?.variant_sku ||
                      "N/A"}
                  </p>
                  {stepFormData[4]?.price && (
                    <p className="text-sm text-gray-500">
                      Price: ${stepFormData[4].price}
                    </p>
                  )}
                  {stepFormData[4]?.stock_quantity && (
                    <p className="text-sm text-gray-500">
                      Stock: {stepFormData[4].stock_quantity}
                    </p>
                  )}
                </div>

                {/* Attribute Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Attribute</h4>
                  <p className="font-semibold">
                    {stepFormData[5]?.name ||
                      stepFormData[7]?.attribute_name ||
                      stepFormData[7]?.selected_attribute ||
                      stepFormData[7]?.selected_attribute_name ||
                      "N/A"}
                  </p>
                  {stepFormData[5]?.type && (
                    <p className="text-sm text-gray-500">
                      Type: {stepFormData[5].type}
                    </p>
                  )}
                </div>

                {/* Attribute Value Information */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700">Attribute Value</h4>
                  <p className="font-semibold">
                    {stepFormData[6]?.value ||
                      stepFormData[7]?.attribute_value ||
                      stepFormData[7]?.selected_attribute_value ||
                      "N/A"}
                  </p>
                  {stepFormData[6]?.attribute_name && (
                    <p className="text-sm text-gray-500">
                      For: {stepFormData[6].attribute_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Media Information */}
              <div className="bg-gray-50 p-3 rounded mb-4">
                <h4 className="font-medium text-gray-700">Media</h4>
                <p className="font-semibold">
                  Type: {stepFormData[7]?.media_type || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  File: {stepFormData[7]?.media_file?.name || "N/A"}
                </p>

                {stepFormData[7]?.attribute_name &&
                  stepFormData[7]?.attribute_value && (
                    <p className="text-sm text-gray-500">
                      For: {stepFormData[7].attribute_name}:{" "}
                      {stepFormData[7].attribute_value}
                    </p>
                  )}

                {stepFormData[7]?.media_file && (
                  <div className="mt-2">
                    {stepFormData[7].media_type === "image" ? (
                      <img
                        src={URL.createObjectURL(stepFormData[7].media_file)}
                        alt="Product"
                        className="max-h-40 rounded border"
                      />
                    ) : (
                      <div className="bg-gray-200 p-4 rounded text-center">
                        Video Preview Not Available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related Entities Section */}
              <div className="bg-gray-50 p-3 rounded mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Related Entities
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display selected brand */}
                  <div>
                    <p className="text-sm font-medium">Selected Brand:</p>
                    <p className="text-sm">
                      {stepFormData[7]?.selected_brand ||
                        stepFormData[7]?.selected_brand_name ||
                        stepFormData[7]?.brand_name ||
                        "N/A"}
                    </p>
                  </div>

                  {/* Display selected product */}
                  <div>
                    <p className="text-sm font-medium">Selected Product:</p>
                    <p className="text-sm">
                      {stepFormData[7]?.selected_product ||
                        stepFormData[7]?.selected_product_name ||
                        stepFormData[7]?.product_name ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/admin/product-dashboard")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => {
                  // Reset form and go back to step 1
                  setStepFormData({
                    1: {},
                    2: {},
                    3: {},
                    4: {},
                    5: {},
                    6: {},
                    7: {},
                  });
                  setStep(1);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Another Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogManagement;
