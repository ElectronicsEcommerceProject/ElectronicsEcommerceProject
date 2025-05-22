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
    const formattedData = {
      categoryFormData: stepFormData[1] || {},
      brandFormData: stepFormData[2] || {},
      productFormData: stepFormData[3] || {},
      variantFormData: stepFormData[4] || {},
      attributeFormData: stepFormData[5] || {},
      attributeValueFormData: stepFormData[6] || {},
      mediaFormData: stepFormData[7] || {},
    };
    return formattedData;
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

  // Simulate API calls
  const apiCall = async (url, method, body) => {
    const endpoint = url.replace("{{baseUrl}}", "");
    console.log(`API Call: ${method} ${endpoint}`, body);

    let responseData;
    switch (endpoint) {
      case "/admin/categories":
        responseData = { ...body, category_id: `cat-${Date.now()}` };
        setFormData((prev) => ({
          ...prev,
          categories: [...prev.categories, responseData],
        }));
        break;
      case "/admin/brands":
        responseData = { ...body, brand_id: `brand-${Date.now()}` };
        setFormData((prev) => ({
          ...prev,
          brands: [...prev.brands, responseData],
        }));
        break;
      case "/admin/product":
        responseData = { ...body, product_id: `prod-${Date.now()}` };
        setFormData((prev) => ({
          ...prev,
          products: [...prev.products, responseData],
        }));
        break;
      case "/admin/product-variant":
        responseData = { ...body, product_variant_id: `var-${Date.now()}` };
        setFormData((prev) => ({
          ...prev,
          variants: [...prev.variants, responseData],
        }));
        break;
      case "/admin/product-attributes":
        responseData = { ...body, product_attribute_id: `attr-${Date.now()}` };
        setFormData((prev) => ({
          ...prev,
          attributes: [...prev.attributes, responseData],
        }));
        break;
      case "/admin/product-attribute-values":
        responseData = {
          ...body,
          product_attribute_value_id: `attrval-${Date.now()}`,
        };
        setFormData((prev) => ({
          ...prev,
          attributeValues: [...prev.attributeValues, responseData],
        }));
        break;
      case "/admin/product-media":
        responseData = {
          ...body,
          product_media_id: `media-${Date.now()}`,
          media_url: body.media_file
            ? URL.createObjectURL(body.media_file)
            : "https://example.com/default.jpg",
        };
        setFormData((prev) => ({
          ...prev,
          media: [...prev.media, responseData],
        }));
        break;
      default:
        console.error("Unknown endpoint:", endpoint);
        throw new Error("Unknown endpoint");
    }

    console.log("API Response:", responseData);
    return responseData;
  };

  const handleSubmit = async (e, endpoint, data, nextStep) => {
    e.preventDefault();
    try {
      // Save the form data for the current step
      setStepFormData((prev) => ({
        ...prev,
        [step]: data,
      }));

      const response = await apiCall(endpoint, "POST", data);
      console.log("Form submitted successfully:", response);
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
    disabled,
    required,
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

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="mt-1 flex items-center justify-between w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 text-sm md:text-base cursor-pointer"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex-1 truncate">
            {selectedOption ? selectedOption[displayKey] : placeholder}
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
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

        {isOpen && (
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
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Stepper />

        {step === 1 && (
          <FormComponent
            title="Create Category"
            fields={[
              {
                name: "name",
                label: "Category Name",
                type: "text",
                placeholder: "e.g., Mobiles",
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., mobiles",
              },
              {
                name: "target_role",
                label: "Target Role",
                type: "select",
                placeholder: "Select target role",
                options: [
                  { id: "customer", name: "Customer" },
                  { id: "retailer", name: "Retailer" },
                  { id: "both", name: "Both" },
                ],
              },
            ]}
            endpoint="{{baseUrl}}/admin/categories"
            nextStep={2}
          />
        )}

        {step === 2 && (
          <FormComponent
            title="Create Brand"
            fields={[
              {
                name: "name",
                label: "Brand Name",
                type: "text",
                placeholder: "e.g., Apple",
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., apple",
              },
            ]}
            endpoint="{{baseUrl}}/admin/brands"
            nextStep={3}
          />
        )}

        {step === 3 && (
          <FormComponent
            title="Create Product"
            fields={[
              {
                name: "name",
                label: "Product Name",
                type: "text",
                placeholder: "e.g., iPhone 15",
              },
              {
                name: "slug",
                label: "Slug",
                type: "text",
                placeholder: "e.g., iphone-15",
              },
              {
                name: "base_price",
                label: "Base Price",
                type: "number",
                placeholder: "e.g., 79999",
              },
              {
                name: "category_id",
                label: "Category",
                type: "select",
                placeholder: "Select category",
                options: [
                  // Include the newly created category from step 1 if it exists
                  ...(stepFormData[1]?.name
                    ? [
                        {
                          id:
                            stepFormData[1].category_id ||
                            `cat-temp-${Date.now()}`,
                          name: stepFormData[1].name,
                        },
                      ]
                    : []),
                  // Include existing categories from formData
                  ...formData.categories.map((c) => ({
                    id: c.category_id,
                    name: c.name,
                  })),
                ],
              },
              {
                name: "brand_id",
                label: "Brand",
                type: "select",
                placeholder: "Select brand",
                options: [
                  // Include the newly created brand from step 2 if it exists
                  ...(stepFormData[2]?.name
                    ? [
                        {
                          id:
                            stepFormData[2].brand_id ||
                            `brand-temp-${Date.now()}`,
                          name: stepFormData[2].name,
                        },
                      ]
                    : []),
                  // Include existing brands from formData
                  ...formData.brands.map((b) => ({
                    id: b.brand_id,
                    name: b.name,
                  })),
                ],
              },
            ]}
            endpoint="{{baseUrl}}/admin/product"
            nextStep={4}
          />
        )}

        {step === 4 && (
          <FormComponent
            title="Create Variant"
            fields={[
              {
                name: "product_id",
                label: "Product",
                type: "select",
                placeholder: "Select product",
                options: formData.products.map((p) => ({
                  id: p.product_id,
                  name: p.name,
                })),
              },
              {
                name: "price",
                label: "Price",
                type: "number",
                placeholder: "e.g., 79999",
              },
              {
                name: "stock_quantity",
                label: "Stock Quantity",
                type: "number",
                placeholder: "e.g., 50",
              },
              {
                name: "sku",
                label: "SKU",
                type: "text",
                placeholder: "e.g., IPH15-128-BLK",
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-variant"
            nextStep={5}
          />
        )}

        {step === 5 && (
          <FormComponent
            title="Create Attribute"
            fields={[
              {
                name: "name",
                label: "Attribute Name",
                type: "text",
                placeholder: "e.g., Color",
              },
              {
                name: "type",
                label: "Type",
                type: "select",
                placeholder: "Select type",
                options: [
                  { id: "select", name: "Select" },
                  { id: "text", name: "Text" },
                ],
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-attributes"
            nextStep={6}
          />
        )}

        {step === 6 && (
          <FormComponent
            title="Create Attribute Value"
            fields={[
              {
                name: "attribute_id",
                label: "Attribute",
                type: "select",
                placeholder: "Select attribute",
                options: formData.attributes.map((a) => ({
                  id: a.product_attribute_id,
                  name: a.name,
                })),
              },
              {
                name: "value",
                label: "Value",
                type: "text",
                placeholder: "e.g., Black",
              },
            ]}
            endpoint="{{baseUrl}}/admin/product-attribute-values"
            nextStep={7}
          />
        )}

        {step === 7 && (
          <FormComponent
            title="Upload Product Media"
            fields={[
              {
                name: "product_id",
                label: "Product",
                type: "select",
                placeholder: "Select product",
                options: formData.products.map((p) => ({
                  id: p.product_id,
                  name: p.name,
                })),
              },
              {
                name: "media_type",
                label: "Media Type",
                type: "select",
                placeholder: "Select media type",
                options: [
                  { id: "image", name: "Image" },
                  { id: "video", name: "Video" },
                ],
              },
              { name: "media_file", label: "Upload Media", type: "file" },
            ]}
            endpoint="{{baseUrl}}/admin/product-media"
            nextStep={8}
          />
        )}

        {step === 8 && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border-2 border-green-500 text-center">
            <div className="mb-4">
              <svg
                className="w-12 h-12 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-green-600">
              Process Completed!
            </h2>
            <div className="mt-4 mb-4 text-left bg-gray-50 p-3 rounded-lg overflow-auto max-h-60">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(getFormattedStepData(), null, 2)}
              </pre>
            </div>
            <button
              onClick={() => {
                alert(JSON.stringify(getFormattedStepData(), null, 2));
                setStep(1);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 text-sm md:text-base mt-4"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogManagement;
