import React, { useState, useEffect } from "react";

const ProductCatalogManagement = () => {
  const [step, setStep] = useState(1);
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

  // Dummy data for each entity
  const dummyData = {
    categories: [
      {
        category_id: "47d05299-e4b8-4b4f-9a1b-c581b568a54b",
        name: "Mobiles",
        slug: "mobiles",
        target_role: "both",
      },
      {
        category_id: "57e713ca-8b4d-4fef-aba2-2256fbdb460b",
        name: "Laptops",
        slug: "laptops",
        target_role: "both",
      },
      {
        category_id: "68f824db-9c5e-4f5f-bcb3-3367fcfe571c",
        name: "Tablets",
        slug: "tablets",
        target_role: "both",
      },
    ],
    brands: [
      {
        brand_id: "de6a067c-c6d4-45f8-9c22-e2f08b4c9e1f",
        name: "Apple",
        slug: "apple",
      },
      {
        brand_id: "1a584622-16c0-4e33-9c6f-3c56dec1b87c",
        name: "Samsung",
        slug: "samsung",
      },
      {
        brand_id: "2b695733-27d1-5f44-ad7f-4d67efd2c98d",
        name: "Dell",
        slug: "dell",
      },
    ],
    products: [
      {
        product_id: "bb896a5d-2338-4627-b6b7-6f24bb931629",
        name: "iPhone 15",
        slug: "iphone-15",
        base_price: 79999,
        category_id: "47d05299-e4b8-4b4f-9a1b-c581b568a54b",
        brand_id: "de6a067c-c6d4-45f8-9c22-e2f08b4c9e1f",
      },
      {
        product_id: "cc907b6e-3449-5738-c7c8-7f35cc042730",
        name: "Galaxy S23",
        slug: "galaxy-s23",
        base_price: 69999,
        category_id: "47d05299-e4b8-4b4f-9a1b-c581b568a54b",
        brand_id: "1a584622-16c0-4e33-9c6f-3c56dec1b87c",
      },
      {
        product_id: "dd018c7f-4550-6849-d8d9-8f46dd153841",
        name: "XPS 13",
        slug: "xps-13",
        base_price: 99999,
        category_id: "57e713ca-8b4d-4fef-aba2-2256fbdb460b",
        brand_id: "2b695733-27d1-5f44-ad7f-4d67efd2c98d",
      },
    ],
    variants: [
      {
        product_variant_id: "1b5133a1-7b3e-414f-9001-99f04f06f618",
        product_id: "bb896a5d-2338-4627-b6b7-6f24bb931629",
        price: 79999,
        stock_quantity: 50,
        sku: "IPH15-128-BLK",
      },
      {
        product_variant_id: "2c6244b2-8c4f-525f-a112-aaf15f07f729",
        product_id: "cc907b6e-3449-5738-c7c8-7f35cc042730",
        price: 69999,
        stock_quantity: 40,
        sku: "GAL23-256-BLU",
      },
      {
        product_variant_id: "3d7355c3-9d5f-636f-b223-bbf26f08f830",
        product_id: "dd018c7f-4550-6849-d8d9-8f46dd153841",
        price: 99999,
        stock_quantity: 30,
        sku: "XPS13-512-SIL",
      },
    ],
    attributes: [
      {
        product_attribute_id: "e2f327e5-086a-412d-8dba-7795dfda2df1",
        name: "Color",
        type: "select",
      },
      {
        product_attribute_id: "f3f438f6-197b-523e-9ecb-88a6efeb3ef2",
        name: "Storage",
        type: "select",
      },
      {
        product_attribute_id: "g4f549g7-2a8c-634f-afgc-99b7ffgc4ff3",
        name: "RAM",
        type: "select",
      },
    ],
    attributeValues: [
      {
        product_attribute_value_id: "b386ca8c-2297-4c2b-88d6-128691348fed",
        attribute_id: "e2f327e5-086a-412d-8dba-7795dfda2df1",
        value: "Black",
      },
      {
        product_attribute_value_id: "c497db9d-33a8-5d3c-99e7-2397a2f459fe",
        attribute_id: "f3f438f6-197b-523e-9ecb-88a6efeb3ef2",
        value: "128GB",
      },
      {
        product_attribute_value_id: "d5a8eca0-44b9-6e4d-aaf8-34a8b3f56aff",
        attribute_id: "g4f549g7-2a8c-634f-afgc-99b7ffgc4ff3",
        value: "16GB",
      },
    ],
    media: [
      {
        product_media_id: "554f9e01-d06d-435f-85b6-dbd20aadbedf",
        product_id: "bb896a5d-2338-4627-b6b7-6f24bb931629",
        media_type: "image",
        media_url: "https://example.com/iphone15.jpg",
      },
      {
        product_media_id: "665faf12-e17e-546f-96c7-ece31bbe0cf0",
        product_id: "cc907b6e-3449-5738-c7c8-7f35cc042730",
        media_type: "image",
        media_url: "https://example.com/galaxys23.jpg",
      },
      {
        product_media_id: "776fbg23-f28f-657f-a7d8-fdf42ccf1df1",
        product_id: "dd018c7f-4550-6849-d8d9-8f46dd153841",
        media_type: "image",
        media_url: "https://example.com/xps13.jpg",
      },
    ],
  };

  // Initialize with dummy data
  useEffect(() => {
    console.log("Initializing with dummy data");
    setFormData({
      categories: dummyData.categories,
      brands: dummyData.brands,
      products: dummyData.products,
      variants: dummyData.variants,
      attributes: dummyData.attributes,
      attributeValues: dummyData.attributeValues,
      media: dummyData.media,
    });
  }, []);

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
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={localData[field.name] || ""}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 text-sm md:text-base"
                  disabled={index > 0 && !filledFields[fields[index - 1].name]}
                  required
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
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
                  { id: "both", name: "Both" },
                  { id: "admin", name: "Admin" },
                  { id: "owner", name: "Owner" },
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
                options: formData.categories.map((c) => ({
                  id: c.category_id,
                  name: c.name,
                })),
              },
              {
                name: "brand_id",
                label: "Brand",
                type: "select",
                placeholder: "Select brand",
                options: formData.brands.map((b) => ({
                  id: b.brand_id,
                  name: b.name,
                })),
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
            <button
              onClick={() => setStep(1)}
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
