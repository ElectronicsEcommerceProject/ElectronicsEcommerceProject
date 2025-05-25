import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductCatalogManagement = () => {
  const [step, setStep] = useState(1);
  const [startedFromStep1, setStartedFromStep1] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardData = location.state?.dashboardData;
  const initialEntityType = location.state?.entityType;
  const [formData, setFormData] = useState({
    categories: [],
    brands: [],
    products: [],
    variants: [],
    attributes: [],
    attributeValues: [],
    media: [],
  });
  const [stepFormData, setStepFormData] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
  });
  const [relatedSelections, setRelatedSelections] = useState({});

  useEffect(() => {
    const stepMap = {
      category: 1,
      brand: 2,
      product: 3,
      variant: 4,
      attribute: 5,
      attributevalue: 5,
      media: 6,
    };
    if (initialEntityType) {
      setStartedFromStep1(false);
      setStep(stepMap[initialEntityType.toLowerCase().replace("s", "")] || 1);
    } else {
      setStartedFromStep1(true);
      setStep(1);
    }
  }, [initialEntityType]);

  useEffect(() => {
    if (dashboardData) {
      setFormData({
        categories: dashboardData.categories || [],
        brands: dashboardData.brands || [],
        products: dashboardData.products || [],
        variants: dashboardData.variants || [],
        attributes: dashboardData.attributes || [],
        attributeValues: dashboardData.attributeValues || [],
        media: dashboardData.media || [],
      });
      const selections = location.state?.selectedItems || {};
      setStepFormData((prev) => ({
        ...prev,
        1: selections.categories || {},
        2: selections.brands || {},
        3: selections.products || {},
        4: selections.variants || {},
        5: selections.attributeValues || {},
        6: selections.media || {},
      }));
      setRelatedSelections(selections);
    }
  }, [dashboardData, location.state?.selectedItems]);

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleNewItemCreation = (fieldName, newItem) => {
    const entityMap = {
      category: "categories",
      brand: "brands",
      product: "products",
      attribute: "attributes",
    };
    const entity = fieldName.split("_").pop();
    if (entityMap[entity]) {
      const newEntity = {
        id: newItem.id,
        [`${entity}_id`]: newItem.id,
        name: newItem.name,
        slug: entity !== "attribute" ? generateSlug(newItem.name) : undefined,
        isNew: true,
      };
      setFormData((prev) => ({
        ...prev,
        [entityMap[entity]]: [...(prev[entityMap[entity]] || []), newEntity],
      }));
    }
  };

  const getFilteredOptions = (entityType) => {
    const entityMap = {
      products: "product_id",
      variants: "product_variant_id",
      attributes: "product_attribute_id",
    };
    const nameField = entityType === "variants" ? "sku" : "name";
    if (entityType === "brands" || !relatedSelections.categories) {
      return formData[entityType].map((item) => ({
        id: item[entityMap[entityType]] || item.id,
        name:
          item[nameField] ||
          (entityType === "variants"
            ? `Variant of ${
                formData.products.find((p) => p.id === item.product_id)?.name ||
                "Unknown"
              }`
            : item.name),
      }));
    }
    const categoryId =
      relatedSelections.categories?.id ||
      relatedSelections.categories?.category_id;
    if (entityType === "products") {
      const filtered = formData.products.filter(
        (p) => p.category_id === categoryId
      );
      if (relatedSelections.brands) {
        const brandId =
          relatedSelections.brands?.id || relatedSelections.brands?.brand_id;
        return filtered
          .filter((p) => p.brand_id === brandId)
          .map((p) => ({ id: p.product_id || p.id, name: p.name }));
      }
      return filtered.map((p) => ({ id: p.product_id || p.id, name: p.name }));
    }
    if (entityType === "variants") {
      const productIds = formData.products
        .filter((p) => p.category_id === categoryId)
        .map((p) => p.id || p.product_id);
      return formData.variants
        .filter((v) => productIds.includes(v.product_id))
        .map((v) => ({
          id: v.product_variant_id || v.id,
          name:
            v.sku ||
            `Variant of ${
              formData.products.find((p) => p.id === v.product_id)?.name ||
              "Unknown"
            }`,
        }));
    }
    return formData[entityType].map((item) => ({
      id: item[entityMap[entityType]] || item.id,
      name: item[nameField],
    }));
  };

  const handleSubmit = async (e, endpoint, data, nextStep) => {
    e.preventDefault();
    const entity = endpoint.split("/").pop();
    const entityKeyMap = {
      categories: "categories",
      brands: "brands",
      product: "products",
      "product-variant": "variants",
      "product-attributes": "attributes",
      "product-attribute-values": "attributeValues",
      "product-media": "media",
    };
    const idMap = {
      categories: "category_id",
      brands: "brand_id",
      product: "product_id",
      "product-variant": "product_variant_id",
      "product-attributes": "product_attribute_id",
      "product-attribute-values": "product_attribute_value_id",
      "product-media": "product_media_id",
    };
    const entityKey = entityKeyMap[entity];
    if (!entityKey) {
      console.error(`Invalid entity: ${entity}`);
      return;
    }
    const responseData = {
      ...data,
      [idMap[entity]]: `${entity.slice(0, 4)}-${Date.now()}`,
      ...(entity === "product-media" && data.media_file
        ? { media_url: URL.createObjectURL(data.media_file) }
        : {}),
    };
    if (
      entity === "product-attribute-values" &&
      data.attribute_name &&
      !data.attribute_id
    ) {
      const attrId = `attr-${Date.now()}`;
      setFormData((prev) => ({
        ...prev,
        attributes: [
          ...(prev.attributes || []),
          {
            id: attrId,
            product_attribute_id: attrId,
            name: data.attribute_name,
            type: "select",
            isNew: true,
          },
        ],
      }));
      responseData.attribute_id = attrId;
    }
    setFormData((prev) => ({
      ...prev,
      [entityKey]: [...(prev[entityKey] || []), responseData],
    }));
    setStepFormData((prev) => ({ ...prev, [step]: data }));
    setTimeout(() => setStep(nextStep), 500);
  };

  const submitAllFormData = async () => {
    const allFormData = {
      category: stepFormData[1],
      brand: stepFormData[2],
      product: stepFormData[3],
      variant: stepFormData[4],
      attributeValue: stepFormData[5],
      media: {
        ...stepFormData[6],
        ...(stepFormData[6].media_file
          ? { fileName: stepFormData[6].media_file.name }
          : {}),
      },
    };
    console.log(
      "Submitting all form data:",
      JSON.stringify(
        allFormData,
        (key, value) => {
          if (value instanceof File) {
            return { fileName: value.name, type: value.type, size: value.size };
          }
          return value;
        },
        2
      )
    );
    alert("Product data successfully submitted!");
  };

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
    allowCreate,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((opt) => opt[valueKey] === value);
    const filteredOptions = options.filter((opt) =>
      opt[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target))
          setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
      onChange({ target: { name, value: option[valueKey] } });
      setIsOpen(false);
      setSearchTerm("");
    };

    const handleCreateNew = () => {
      if (!searchTerm.trim()) return;
      const newId = `new-${name}-${Date.now()}`;
      onChange({
        target: {
          name,
          value: newId,
          newItem: { id: newId, [displayKey]: searchTerm.trim() },
        },
      });
      setIsOpen(false);
      setSearchTerm("");
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className={`mt-1 flex items-center justify-between w-full rounded-md border-2 ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
              : "border-gray-300 focus:border-blue-500"
          } p-2 text-sm`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className={`flex-1 truncate ${disabled ? "text-gray-400" : ""}`}>
            {selectedOption ? selectedOption[displayKey] : placeholder}
          </div>
          <svg
            className={`h-5 w-5 ${
              disabled ? "text-gray-300" : "text-gray-400"
            } ${isOpen ? "transform rotate-180" : ""}`}
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
          <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
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
            {filteredOptions.length ? (
              <ul>
                {filteredOptions.map((opt, i) => (
                  <li
                    key={opt[valueKey] || i}
                    onClick={() => handleSelect(opt)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {opt[displayKey]}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
            {allowCreate && searchTerm.trim() && (
              <div
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm border-t"
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

  const EnhancedFormComponent = ({
    title,
    fields,
    endpoint,
    nextStep,
    relatedEntities = [],
  }) => {
    const [localData, setLocalData] = useState(stepFormData[step]);
    const [filledFields, setFilledFields] = useState(() =>
      Object.keys(localData).reduce(
        (acc, key) => ({ ...acc, [key]: !!localData[key] }),
        {}
      )
    );

    useEffect(() => {
      setLocalData(stepFormData[step]);
      setFilledFields(
        Object.keys(stepFormData[step]).reduce(
          (acc, key) => ({ ...acc, [key]: !!stepFormData[step][key] }),
          {}
        )
      );
    }, [step]);

    const handleChange = (e) => {
      const { name, value, type, files, newItem } = e.target;
      const newValue = type === "file" ? files[0] : value;
      setLocalData((prev) => ({ ...prev, [name]: newValue }));
      setFilledFields((prev) => ({ ...prev, [name]: !!newValue }));
      if (name === "name" && [1, 2, 3].includes(step)) {
        const slug = generateSlug(newValue);
        setLocalData((prev) => ({ ...prev, slug }));
        setFilledFields((prev) => ({ ...prev, slug: !!slug }));
      }
      if (newItem) handleNewItemCreation(name, newItem);
    };

    const handleRelatedEntitySelect = (entityType, entity) => {
      if (!entity) return;
      setRelatedSelections((prev) => ({ ...prev, [entityType]: entity }));
      setLocalData((prev) => ({
        ...prev,
        [`${entityType.slice(0, -1)}_id`]:
          entity.id || entity[`${entityType.slice(0, -1)}_id`],
        [`selected_${entityType.slice(0, -1)}`]: entity.name,
        [`${entityType.slice(0, -1)}_name`]: entity.name,
      }));
    };

    const isFormValid = () =>
      fields.every(
        (f) =>
          !f.required ||
          (f.type === "file"
            ? localData[f.name] instanceof File
            : localData[f.name]?.toString().trim())
      ) && relatedEntities.every((e) => relatedSelections[e]);

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      const dataToSubmit = { ...localData };
      relatedEntities.forEach((e) => {
        if (relatedSelections[e]) {
          dataToSubmit[`${e.slice(0, -1)}_id`] =
            relatedSelections[e].id ||
            relatedSelections[e][`${e.slice(0, -1)}_id`];
          dataToSubmit[`${e.slice(0, -1)}_name`] = relatedSelections[e].name;
        }
      });
      await handleSubmit(e, endpoint, dataToSubmit, nextStep);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border-2 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        {relatedEntities.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-md font-semibold mb-3">Select Related Items</h3>
            {relatedEntities.map((entity, i) => (
              <div key={entity} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {i + 1}.{" "}
                  {entity.charAt(0).toUpperCase() + entity.slice(1, -1)}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  name={`related_${entity.slice(0, -1)}`}
                  value={
                    relatedSelections[entity]?.id ||
                    relatedSelections[entity]?.[`${entity.slice(0, -1)}_id`] ||
                    ""
                  }
                  onChange={(e) =>
                    handleRelatedEntitySelect(
                      entity,
                      formData[entity].find(
                        (item) =>
                          item.id === e.target.value ||
                          item[`${entity.slice(0, -1)}_id`] === e.target.value
                      )
                    )
                  }
                  placeholder={
                    (startedFromStep1 && stepFormData[step - i - 1]?.name) ||
                    stepFormData[step - i - 1]?.sku ||
                    `Select a ${entity.slice(0, -1)}`
                  }
                  options={getFilteredOptions(entity)}
                  allowCreate
                />
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.name} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <SearchableDropdown
                  name={field.name}
                  value={localData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  options={
                    field.options ||
                    getFilteredOptions(
                      field.name === "category_id"
                        ? "categories"
                        : field.name === "brand_id"
                        ? "brands"
                        : field.name === "product_id"
                        ? "products"
                        : "attributes"
                    )
                  }
                  disabled={i > 0 && !filledFields[fields[i - 1].name]}
                  required={field.required}
                  allowCreate={field.allowCreate}
                />
              ) : field.type === "file" ? (
                <div>
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    accept="image/*,video/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={i > 0 && !filledFields[fields[i - 1].name]}
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 p-2 text-sm"
                  disabled={i > 0 && !filledFields[fields[i - 1].name]}
                  required={field.required}
                  list={`${field.name}-suggestions`}
                />
              )}
              {field.type === "text" && (
                <datalist id={`${field.name}-suggestions`}>
                  {formData[
                    field.name === "sku"
                      ? "variants"
                      : field.name === "value"
                      ? "attributeValues"
                      : field.name === "attribute_name"
                      ? "attributes"
                      : field.name === "name" && step === 1
                      ? "categories"
                      : step === 2
                      ? "brands"
                      : "products"
                  ].map((item, idx) => (
                    <option
                      key={idx}
                      value={
                        item[
                          field.name === "sku"
                            ? "sku"
                            : field.name === "value"
                            ? "value"
                            : field.name === "attribute_name"
                            ? "name"
                            : "name"
                        ]
                      }
                    />
                  ))}
                </datalist>
              )}
            </div>
          ))}
          <div className="flex space-x-4 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm ${
                !isFormValid() ? "opacity-70 cursor-not-allowed" : ""
              } ${step === 1 ? "w-full" : ""}`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  const Stepper = () => {
    const steps = [
      "Category",
      "Brand",
      "Product",
      "Variant",
      "Attribute Value",
      "Media",
      "Review",
    ];
    return (
      <div className="mb-6 flex items-center justify-between">
        {steps.map((name, i) => (
          <React.Fragment key={i}>
            <div
              className={`flex flex-col items-center ${
                i + 1 <= step ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ${
                  i + 1 < step
                    ? "bg-blue-600 text-white"
                    : i + 1 === step
                    ? "border-2 border-blue-600 text-blue-600"
                    : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <div className="text-xs mt-1 hidden sm:block">{name}</div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  i + 1 < step ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const ReviewStep = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="text-green-500 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Product Creation Complete!
          </h2>
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
      <h3 className="text-xl font-bold mb-4">Product Information Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "Category",
          "Brand",
          "Product",
          "Variant",
          "Attribute Value",
          "Media",
        ].map((label, i) => (
          <div key={label} className="bg-gray-50 p-3 rounded">
            <h4 className="font-medium text-gray-700">{label}</h4>
            <p className="font-semibold">
              {stepFormData[i + 1]?.[
                i < 4 ? "name" : i === 4 ? "value" : "media_type"
              ] || "N/A"}
            </p>
            {i === 4 && stepFormData[5]?.attribute_name && (
              <p className="text-sm text-gray-500">
                For: {stepFormData[5].attribute_name}
              </p>
            )}
            {i === 5 && stepFormData[6]?.media_file && (
              <>
                <p className="text-sm text-gray-500">
                  File: {stepFormData[6].media_file.name}
                </p>
                <img
                  src={URL.createObjectURL(stepFormData[6].media_file)}
                  alt="Media preview"
                  className="mt-2 max-w-full h-auto max-h-32 rounded"
                />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(6)}
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
  );

  const stepsConfig = [
    {
      title: "Create Category",
      endpoint: "{{baseUrl}}/admin/categories",
      nextStep: 2,
      relatedEntities: [],
      fields: [
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
      ],
    },
    {
      title: "Create Brand",
      endpoint: "{{baseUrl}}/admin/brands",
      nextStep: 3,
      relatedEntities: ["categories"],
      fields: [
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
      ],
    },
    {
      title: "Create Product",
      endpoint: "{{baseUrl}}/admin/product",
      nextStep: 4,
      relatedEntities: ["categories", "brands"],
      fields: [
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
          placeholder: "e.g., Latest iPhone model",
          required: false,
        },
        {
          name: "average_rating",
          label: "Average Rating",
          type: "number",
          placeholder: "e.g., 4.5",
          required: false,
        },
      ],
    },
    {
      title: "Create Variant",
      endpoint: "{{baseUrl}}/admin/product-variant",
      nextStep: 5,
      relatedEntities: ["categories", "brands", "products"],
      fields: [
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
          placeholder: "e.g., 128GB Black variant",
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
      ],
    },
    {
      title: "Create Attribute Value",
      endpoint: "{{baseUrl}}/admin/product-attribute-values",
      nextStep: 6,
      relatedEntities: ["categories", "brands", "products", "variants"],
      fields: [
        {
          name: "attribute_name",
          label: "Attribute Name",
          type: "text",
          placeholder: "e.g., Storage, Color",
          required: true,
        },
        {
          name: "type",
          label: "Attribute Type",
          type: "select",
          placeholder: "Select attribute type",
          required: true,
          options: [
            { id: "select", name: "Select" },
            { id: "text", name: "Text" },
          ],
        },
        {
          name: "value",
          label: "Value",
          type: "text",
          placeholder: "e.g., 128GB, Black",
          required: true,
        },
      ],
    },
    {
      title: "Upload Product Media",
      endpoint: "{{baseUrl}}/admin/product-media",
      nextStep: 7,
      relatedEntities: ["categories", "brands", "products", "variants"],
      fields: [
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
          placeholder: "Upload an image or video",
          required: true,
        },
      ],
    },
  ];

  useEffect(() => {
    if (step === 7) {
      submitAllFormData();
    }
    // eslint-disable-next-line
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Stepper />
        {step === 7 ? (
          <ReviewStep />
        ) : (
          <EnhancedFormComponent {...stepsConfig[step - 1]} />
        )}
      </div>
    </div>
  );
};

export default ProductCatalogManagement;
