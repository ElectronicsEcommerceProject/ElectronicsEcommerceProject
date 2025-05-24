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
      // If we're starting with a specific entity type, we're not starting from step 1
      setStartedFromStep1(false);

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
          setStep(5); // Updated from 6 to 5 since we removed the Attribute step
          break;
        case "media":
          setStep(6); // Updated from 7 to 6
          break;
        default:
          setStep(1);
          setStartedFromStep1(true); // If we're starting at step 1, set the flag
      }
    } else {
      // If no entity type is provided, we're starting from step 1
      setStartedFromStep1(true);
      setStep(1);
    }
  }, [initialEntityType]);

  // Add a state to track if the form was started from step 1
  const [startedFromStep1, setStartedFromStep1] = useState(false);

  // Update useEffect to detect if we're starting from step 1
  useEffect(() => {
    // If we're at step 1 and there's no entityType provided, we're starting fresh
    if (step === 1 && !initialEntityType) {
      setStartedFromStep1(true);
      console.log("Form started from step 1");
    }
  }, [step, initialEntityType]);

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
    console.log("Current stepFormData:", stepFormData);

    return {
      categoryFormData: stepFormData[1] || {},
      brandFormData: stepFormData[2] || {},
      productFormData: stepFormData[3] || {},
      variantFormData: stepFormData[4] || {},
      attributeValueFormData: stepFormData[5] || {}, // Previously step 6
      mediaFormData: stepFormData[6] || {}, // Previously step 7
      // Include the related selections from step 6 (previously step 7)
      relatedSelections: {
        category: stepFormData[1]?.name || "N/A",
        brand: stepFormData[2]?.name || "N/A",
        product: stepFormData[3]?.name || "N/A",
        variant: stepFormData[4]?.sku || "N/A",
        attributeValue: stepFormData[5]?.value || "N/A",
        attributeName: stepFormData[5]?.attribute_name || "N/A",
      },
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
      // Maintain the startedFromStep1 flag when going back
    }
  };

  const Stepper = () => {
    const steps = [
      "Category",
      "Brand",
      "Product",
      "Variant",
      "Attribute Value", // Changed from "Attribute"
      "Media",
      "Review",
    ];

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((stepName, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${
                  index + 1 < step
                    ? "text-blue-600"
                    : index + 1 === step
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xs md:text-sm font-semibold ${
                    index + 1 < step
                      ? "bg-blue-600 text-white"
                      : index + 1 === step
                      ? "border-2 border-blue-600 text-blue-600"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {index + 1 < step ? "✓" : index + 1}
                </div>
                <div className="text-xs mt-1 text-center hidden sm:block">
                  {stepName}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    index + 1 < step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

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
    const [relatedSelections, setRelatedSelections] = useState(() => {
      // First check if we have selections passed from the dashboard
      const dashboardSelections = location.state?.selectedItems;

      if (dashboardSelections) {
        console.log("Using selections from dashboard:", dashboardSelections);
        // Return the selections from dashboard directly
        return dashboardSelections;
      }

      // If we started from step 1 and have previous selections, use them
      if (startedFromStep1) {
        // Get previous selections from earlier steps
        const selections = {};

        // For step 2+, get category from step 1
        if (step > 1 && stepFormData[1]?.name) {
          selections.categories = {
            id: stepFormData[1].id || stepFormData[1].category_id || null,
            category_id:
              stepFormData[1].category_id || stepFormData[1].id || null,
            name: stepFormData[1].name,
          };
        }

        // For step 3+, get brand from step 2
        if (step > 2 && stepFormData[2]?.name) {
          selections.brands = {
            id: stepFormData[2].id || stepFormData[2].brand_id || null,
            brand_id: stepFormData[2].brand_id || stepFormData[2].id || null,
            name: stepFormData[2].name,
          };
        }

        // For step 4+, get product from step 3
        if (step > 3 && stepFormData[3]?.name) {
          selections.products = {
            id: stepFormData[3].id || stepFormData[3].product_id || null,
            product_id:
              stepFormData[3].product_id || stepFormData[3].id || null,
            name: stepFormData[3].name,
          };
        }

        // For step 5+, get variant from step 4
        if (step > 4 && stepFormData[4]?.sku) {
          selections.variants = {
            id:
              stepFormData[4].id || stepFormData[4].product_variant_id || null,
            product_variant_id:
              stepFormData[4].product_variant_id || stepFormData[4].id || null,
            sku: stepFormData[4].sku,
            name: stepFormData[4].sku, // Use SKU as name for display
          };
        }

        console.log(`Step ${step} - Using previous selections:`, selections);
        return selections;
      }

      // Default empty selections if not started from step 1
      return {};
    });

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

      // Add related entity data to submission
      if (
        relatedEntities.includes("categories") &&
        relatedSelections.categories
      ) {
        dataToSubmit.category_id =
          relatedSelections.categories.id ||
          relatedSelections.categories.category_id;
        dataToSubmit.category_name = relatedSelections.categories.name;
      }

      if (relatedEntities.includes("brands") && relatedSelections.brands) {
        dataToSubmit.brand_id =
          relatedSelections.brands.id || relatedSelections.brands.brand_id;
        dataToSubmit.brand_name = relatedSelections.brands.name;
      }

      if (relatedEntities.includes("products") && relatedSelections.products) {
        dataToSubmit.product_id =
          relatedSelections.products.id ||
          relatedSelections.products.product_id;
        dataToSubmit.product_name = relatedSelections.products.name;
      }

      if (relatedEntities.includes("variants") && relatedSelections.variants) {
        dataToSubmit.variant_id =
          relatedSelections.variants.id ||
          relatedSelections.variants.product_variant_id;
        dataToSubmit.variant_name =
          relatedSelections.variants.name || relatedSelections.variants.sku;
      }

      // Store the form data for this step
      setStepFormData((prev) => {
        const updatedStepData = {
          ...prev,
          [step]: dataToSubmit,
        };
        console.log(
          `Updated step form data for step ${step}:`,
          updatedStepData
        );
        return updatedStepData;
      });

      // Only make API call if we're on step 6 (or the final step before review)
      if (step === 6) {
        try {
          console.log(`Submitting all form data to API`);

          // Wait for state update to complete before getting form data
          setTimeout(() => {
            // Get all form data from all steps
            const allFormData = getFormattedStepData();

            // Get dashboard selections if available
            const dashboardSelections = location.state?.selectedItems;
            console.log("Dashboard selections:", dashboardSelections);

            // Create a single comprehensive object with all data to be sent to backend
            const apiSubmissionData = {
              category:
                allFormData.categoryFormData ||
                (dashboardSelections?.categories
                  ? {
                      id:
                        dashboardSelections.categories.id ||
                        dashboardSelections.categories.category_id,
                      name: dashboardSelections.categories.name,
                      category_id:
                        dashboardSelections.categories.category_id ||
                        dashboardSelections.categories.id,
                    }
                  : {}),

              brand:
                allFormData.brandFormData ||
                (dashboardSelections?.brands
                  ? {
                      id:
                        dashboardSelections.brands.id ||
                        dashboardSelections.brands.brand_id,
                      name: dashboardSelections.brands.name,
                      brand_id:
                        dashboardSelections.brands.brand_id ||
                        dashboardSelections.brands.id,
                    }
                  : {}),

              product:
                allFormData.productFormData ||
                (dashboardSelections?.products
                  ? {
                      id:
                        dashboardSelections.products.id ||
                        dashboardSelections.products.product_id,
                      name: dashboardSelections.products.name,
                      product_id:
                        dashboardSelections.products.product_id ||
                        dashboardSelections.products.id,
                    }
                  : {}),

              variant:
                allFormData.variantFormData ||
                (dashboardSelections?.variants
                  ? {
                      id:
                        dashboardSelections.variants.id ||
                        dashboardSelections.variants.product_variant_id,
                      sku:
                        dashboardSelections.variants.sku ||
                        dashboardSelections.variants.name,
                      product_variant_id:
                        dashboardSelections.variants.product_variant_id ||
                        dashboardSelections.variants.id,
                    }
                  : {}),

              attributeValue: allFormData.attributeValueFormData,
              media: allFormData.mediaFormData,

              // Include relationships for reference
              relationships: {
                categoryId:
                  allFormData.categoryFormData?.category_id ||
                  allFormData.categoryFormData?.id ||
                  (dashboardSelections?.categories
                    ? dashboardSelections.categories.category_id ||
                      dashboardSelections.categories.id
                    : null),

                brandId:
                  allFormData.brandFormData?.brand_id ||
                  allFormData.brandFormData?.id ||
                  (dashboardSelections?.brands
                    ? dashboardSelections.brands.brand_id ||
                      dashboardSelections.brands.id
                    : null),

                productId:
                  allFormData.productFormData?.product_id ||
                  allFormData.productFormData?.id ||
                  (dashboardSelections?.products
                    ? dashboardSelections.products.product_id ||
                      dashboardSelections.products.id
                    : null),

                variantId:
                  allFormData.variantFormData?.product_variant_id ||
                  allFormData.variantFormData?.id ||
                  (dashboardSelections?.variants
                    ? dashboardSelections.variants.product_variant_id ||
                      dashboardSelections.variants.id
                    : null),
              },
            };

            // Log the complete data as a single object
            console.log(
              "=== COMPLETE DATA BEING SENT TO BACKEND apiSubmissionData ===",
              apiSubmissionData
            );

            // Make API calls for each entity type
            submitAllFormData(allFormData);

            // Show success message
            alert("Product data successfully submitted to API!");

            // Move to review step
            setStep(nextStep);
          }, 100);
        } catch (error) {
          console.error("Error submitting form data to API:", error);
          alert("Error submitting form data. Please try again.");
        }
      } else {
        // For other steps, just move to next step without API call
        console.log(`Moving to next step without API call`);
        setStep(nextStep);
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
                    value={
                      relatedSelections.categories?.id ||
                      relatedSelections.categories?.category_id ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedCategory = formData.categories.find(
                        (cat) =>
                          cat.id === e.target.value ||
                          cat.category_id === e.target.value
                      );
                      handleRelatedEntitySelect("categories", selectedCategory);
                    }}
                    placeholder={
                      startedFromStep1 && step > 1 && stepFormData[1]?.name
                        ? stepFormData[1].name
                        : "First, select a category"
                    }
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

              {/* Brand dropdown - enabled after category */}
              {relatedEntities.includes("brands") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2. Brand <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    name="related_brand"
                    value={
                      relatedSelections.brands?.id ||
                      relatedSelections.brands?.brand_id ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedBrand = formData.brands.find(
                        (brand) =>
                          brand.id === e.target.value ||
                          brand.brand_id === e.target.value
                      );
                      handleRelatedEntitySelect("brands", selectedBrand);
                    }}
                    placeholder={
                      startedFromStep1 && step > 2 && stepFormData[2]?.name
                        ? stepFormData[2].name
                        : "Select a brand"
                    }
                    options={formData.brands.map((brand) => ({
                      id: brand.brand_id || brand.id,
                      name: brand.name,
                    }))}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
                  />
                </div>
              )}

              {/* Product dropdown - enabled after brand */}
              {relatedEntities.includes("products") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    3. Product <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    name="related_product"
                    value={
                      relatedSelections.products?.id ||
                      relatedSelections.products?.product_id ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedProduct = formData.products.find(
                        (product) =>
                          product.id === e.target.value ||
                          product.product_id === e.target.value
                      );
                      handleRelatedEntitySelect("products", selectedProduct);
                    }}
                    placeholder={
                      startedFromStep1 && step > 3 && stepFormData[3]?.name
                        ? stepFormData[3].name
                        : "Select a product"
                    }
                    options={getFilteredOptions("products")}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
                  />
                </div>
              )}

              {/* Variant dropdown - enabled after product */}
              {relatedEntities.includes("variants") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    4. Variant <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    name="related_variant"
                    value={
                      relatedSelections.variants?.id ||
                      relatedSelections.variants?.product_variant_id ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedVariant = formData.variants.find(
                        (variant) =>
                          variant.id === e.target.value ||
                          variant.product_variant_id === e.target.value
                      );
                      handleRelatedEntitySelect("variants", selectedVariant);
                    }}
                    placeholder={
                      startedFromStep1 && step > 4 && stepFormData[4]?.sku
                        ? stepFormData[4].sku
                        : "Select a variant"
                    }
                    options={getFilteredOptions("variants")}
                    displayKey="name"
                    valueKey="id"
                    allowCreate={true}
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

    // Handle different entity types
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

  // Add a new function to submit all form data
  const submitAllFormData = async (allFormData) => {
    console.log("Submitting all form data to API:", allFormData);

    // Get dashboard selections if available
    const dashboardSelections = location.state?.selectedItems;

    // Create a comprehensive data object that combines form data with dashboard selections
    const completeData = {
      category:
        allFormData.categoryFormData &&
        Object.keys(allFormData.categoryFormData).length > 0
          ? allFormData.categoryFormData
          : dashboardSelections?.categories
          ? {
              id:
                dashboardSelections.categories.id ||
                dashboardSelections.categories.category_id,
              name: dashboardSelections.categories.name,
              category_id:
                dashboardSelections.categories.category_id ||
                dashboardSelections.categories.id,
            }
          : {},

      brand:
        allFormData.brandFormData &&
        Object.keys(allFormData.brandFormData).length > 0
          ? allFormData.brandFormData
          : dashboardSelections?.brands
          ? {
              id:
                dashboardSelections.brands.id ||
                dashboardSelections.brands.brand_id,
              name: dashboardSelections.brands.name,
              brand_id:
                dashboardSelections.brands.brand_id ||
                dashboardSelections.brands.id,
            }
          : {},

      product:
        allFormData.productFormData &&
        Object.keys(allFormData.productFormData).length > 0
          ? allFormData.productFormData
          : dashboardSelections?.products
          ? {
              id:
                dashboardSelections.products.id ||
                dashboardSelections.products.product_id,
              name: dashboardSelections.products.name,
              product_id:
                dashboardSelections.products.product_id ||
                dashboardSelections.products.id,
            }
          : {},

      variant:
        allFormData.variantFormData &&
        Object.keys(allFormData.variantFormData).length > 0
          ? allFormData.variantFormData
          : dashboardSelections?.variants
          ? {
              id:
                dashboardSelections.variants.id ||
                dashboardSelections.variants.product_variant_id,
              sku:
                dashboardSelections.variants.sku ||
                dashboardSelections.variants.name,
              product_variant_id:
                dashboardSelections.variants.product_variant_id ||
                dashboardSelections.variants.id,
            }
          : {},

      attributeValue: allFormData.attributeValueFormData,
      media: allFormData.mediaFormData,

      // Add relationships for clarity
      relationships: {
        categoryId:
          allFormData.categoryFormData?.category_id ||
          allFormData.categoryFormData?.id ||
          (dashboardSelections?.categories
            ? dashboardSelections.categories.category_id ||
              dashboardSelections.categories.id
            : null),
        brandId:
          allFormData.brandFormData?.brand_id ||
          allFormData.brandFormData?.id ||
          (dashboardSelections?.brands
            ? dashboardSelections.brands.brand_id ||
              dashboardSelections.brands.id
            : null),
        productId:
          allFormData.productFormData?.product_id ||
          allFormData.productFormData?.id ||
          (dashboardSelections?.products
            ? dashboardSelections.products.product_id ||
              dashboardSelections.products.id
            : null),
        variantId:
          allFormData.variantFormData?.product_variant_id ||
          allFormData.variantFormData?.id ||
          (dashboardSelections?.variants
            ? dashboardSelections.variants.product_variant_id ||
              dashboardSelections.variants.id
            : null),
      },
    };

    // Log the complete data in a more readable format
    console.log("=== COMPLETE DATA BEING SENT TO BACKEND ===", completeData);

    // Add a new formatted log with form-by-form breakdown
    console.log("=== FORM DATA BREAKDOWN ===", {
      "Category Form": allFormData.categoryFormData || "Not filled",
      "Brand Form": allFormData.brandFormData || "Not filled",
      "Product Form": allFormData.productFormData || "Not filled",
      "Variant Form": allFormData.variantFormData || "Not filled",
      "Attribute Value Form":
        allFormData.attributeValueFormData || "Not filled",
      "Media Form": allFormData.mediaFormData || "Not filled",
    });

    // Here you would make API calls with the complete data
    // For example:
    // await createApi("/api/categories", completeData.category);
    // await createApi("/api/brands", completeData.brand);
    // etc.

    return Promise.resolve();
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
              {
                name: "average_rating",
                label: "Average Rating",
                type: "number",
                placeholder: "e.g., 4.5",
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
                label: "Product Variant SKU",
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
                name: "description",
                label: "Description",
                type: "text",
                placeholder:
                  "e.g., 128GB Black variant with extra battery life",
                required: false,
              },
              {
                name: "stock_quantity",
                label: "Stock Quantity",
                type: "number",
                placeholder: "e.g., 50",
                required: true,
              },
              {
                name: "discount_percentage",
                label: "Discount Percentage (%)",
                type: "number",
                placeholder: "e.g., 10",
                required: false,
              },
              {
                name: "discount_quantity",
                label: "Discount Quantity",
                type: "number",
                placeholder: "e.g., 3",
                required: false,
              },
              {
                name: "min_retailer_quantity",
                label: "Min Retailer Quantity",
                type: "number",
                placeholder: "e.g., 5",
                required: false,
              },
              {
                name: "bulk_discount_percentage",
                label: "Bulk Discount Percentage (%)",
                type: "number",
                placeholder: "e.g., 15",
                required: false,
              },
              {
                name: "bulk_discount_quantity",
                label: "Bulk Discount Quantity",
                type: "number",
                placeholder: "e.g., 10",
                required: false,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-variant"
            nextStep={5}
            relatedEntities={["categories", "brands", "products"]} // Variants are related to categories, brands, and products
          />
        )}

        {/* Step 5 is now Attribute Value (previously step 6) */}
        {step === 5 && (
          <EnhancedFormComponent
            title="Create Attribute Value"
            fields={[
              {
                name: "attribute_name",
                label: "Attribute Name",
                type: "text",
                placeholder: "e.g., Color",
                required: true,
              },
              {
                name: "value",
                label: "Attribute Value",
                type: "text",
                placeholder: "e.g., Black",
                required: true,
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-attribute-values"
            nextStep={6}
            relatedEntities={["categories", "brands", "products", "variants"]} // Show all related entities except attributes
          />
        )}

        {/* Step 6 is now Media (previously step 7) */}
        {step === 6 && (
          <EnhancedFormComponent
            title="Upload Product Media"
            fields={[
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
            nextStep={7}
            relatedEntities={["categories", "brands", "products", "variants"]} // Include all related entities
          />
        )}

        {/* Step 7 is now Review (previously step 8) */}
        {step === 7 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <div className="text-green-500 text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Product Creation Complete!
                </h2>
                <div className="flex justify-center">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">
              Product Information Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Category</h4>
                <p className="font-semibold">
                  {stepFormData[1]?.name || "N/A"}
                </p>
              </div>

              {/* Brand Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Brand</h4>
                <p className="font-semibold">
                  {stepFormData[2]?.name || "N/A"}
                </p>
              </div>

              {/* Product Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Product</h4>
                <p className="font-semibold">
                  {stepFormData[3]?.name || "N/A"}
                </p>
              </div>

              {/* Variant Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Variant</h4>
                <p className="font-semibold">
                  SKU: {stepFormData[4]?.sku || "N/A"}
                </p>
              </div>

              {/* Attribute Value Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Attribute Value</h4>
                <p className="font-semibold">
                  {stepFormData[5]?.value || "N/A"}
                </p>
                {stepFormData[5]?.attribute_name && (
                  <p className="text-sm text-gray-500">
                    For: {stepFormData[5].attribute_name}
                  </p>
                )}
              </div>

              {/* Media Information */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-gray-700">Media</h4>
                <p className="font-semibold">
                  Type: {stepFormData[6]?.media_type || "image"}
                </p>
                <p className="text-sm text-gray-500">
                  File: {stepFormData[6]?.media_file?.name || "N/A"}
                </p>
                {stepFormData[6]?.media_file && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(stepFormData[6].media_file)}
                      alt="Media preview"
                      className="max-w-full h-auto max-h-32 rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={() => navigate("/admin/product-dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogManagement;
