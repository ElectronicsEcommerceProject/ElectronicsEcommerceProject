import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  createApi,
  adminProductManagementDashboardDataRoute,
} from "../../../src/index.js";

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
    const entityKey = entityKeyMap[entity];
    if (!entityKey) {
      console.error(`Invalid entity: ${entity}`);
      return;
    }

    // Just use the data as is, without generating any new IDs
    const responseData = {
      ...data,
      ...(entity === "product-media" && data.media_file
        ? { media_url: URL.createObjectURL(data.media_file) }
        : {}),
    };

    setFormData((prev) => ({
      ...prev,
      [entityKey]: [...(prev[entityKey] || []), responseData],
    }));

    setStepFormData((prev) => ({ ...prev, [step]: data }));

    // Always update relatedSelections with the current step's data
    // Map step to entity type for relatedSelections
    const stepToEntityMap = {
      1: "categories",
      2: "brands",
      3: "products",
      4: "variants",
      5: "attributeValues",
    };

    const currentEntityType = stepToEntityMap[step];
    if (currentEntityType) {
      setRelatedSelections((prev) => ({
        ...prev,
        [currentEntityType]: responseData,
      }));
    }

    setTimeout(() => setStep(nextStep), 500);
  };

  const submitAllFormData = async () => {
    // First, create the basic structure
    let allFormData = {
      category: {
        ...stepFormData[1],
        category_id: stepFormData[1].id || stepFormData[1].category_id,
      },
      brand: {
        ...stepFormData[2],
        brand_id: stepFormData[2].id || stepFormData[2].brand_id,
      },
      product: {
        ...stepFormData[3],
        product_id: stepFormData[3].id || stepFormData[3].product_id,
      },
      variant: {
        ...stepFormData[4],
        product_variant_id:
          stepFormData[4].id || stepFormData[4].product_variant_id,
      },
      attributeValue: {
        ...stepFormData[5],
        product_attribute_value_id:
          stepFormData[5].id || stepFormData[5].product_attribute_value_id,
      },
      media: {
        ...stepFormData[3],
        product_media_id:
          stepFormData[3].id || stepFormData[3].product_media_id,
      },
    };

    // Fix misspelled field names
    const fixFieldNames = (obj) => {
      const newObj = { ...obj };

      // Replace categorie_id with category_id
      if (newObj.categorie_id !== undefined) {
        newObj.category_id = newObj.categorie_id;
        delete newObj.categorie_id;
      }

      // Replace categorie_name with category_name
      if (newObj.categorie_name !== undefined) {
        newObj.category_name = newObj.categorie_name;
        delete newObj.categorie_name;
      }

      // Replace variant_id with product_variant_id if needed
      if (newObj.variant_id !== undefined && !newObj.product_variant_id) {
        newObj.product_variant_id = newObj.variant_id;
        delete newObj.variant_id;
      }

      return newObj;
    };

    // Apply the fix to each object
    allFormData = {
      category: fixFieldNames(allFormData.category),
      brand: fixFieldNames(allFormData.brand),
      product: fixFieldNames(allFormData.product),
      variant: fixFieldNames(allFormData.variant),
      attributeValue: fixFieldNames(allFormData.attributeValue),
      media: fixFieldNames(allFormData.media),
    };

    console.log("Submitting all form data:", allFormData);

    try {
      // Create a FormData object for multipart/form-data submission
      const formData = new FormData();

      // Add the product media file if it exists
      if (stepFormData[3]?.media_file instanceof File) {
        formData.append("media_file", stepFormData[3].media_file);
      }

      // Add the variant media file if it exists
      if (stepFormData[4]?.variant_media_file instanceof File) {
        formData.append("variant_media_file", stepFormData[4].variant_media_file);
      }

      // Add all other data as JSON strings
      formData.append("category", JSON.stringify(allFormData.category));
      formData.append("brand", JSON.stringify(allFormData.brand));
      formData.append("product", JSON.stringify(allFormData.product));
      formData.append("variant", JSON.stringify(allFormData.variant));
      formData.append(
        "attributeValue",
        JSON.stringify(allFormData.attributeValue)
      );
      formData.append("media", JSON.stringify(allFormData.media));

      // Check if this is a new form submission by verifying dashboardData is undefined
      if (dashboardData === undefined) {
        formData.append("newFormData", JSON.stringify(true));
      }
      // Make the API call with FormData using createApi
      const response = await createApi(
        adminProductManagementDashboardDataRoute,
        formData
      );

      const data = response; // Since createApi already returns parsed JSON
      // console.log("API Response of ProductForm:", data);
      if (data && data.success) {
        alert("Product data successfully submitted!");
        // Navigate to admin panel after successful submission
        navigate("/admin");
      } else {
        alert(
          "Error submitting product data: " + (data?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error submitting product data:", error);
      alert(
        "Error submitting product data: " + (error?.message || "Unknown error")
      );
    }
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
      const currentStepData = { ...stepFormData[step] };

      // Set default values for fields that have them
      fields.forEach((field) => {
        if (field.defaultValue && !currentStepData[field.name]) {
          currentStepData[field.name] = field.defaultValue;
        }
      });

      setLocalData(currentStepData);
      setFilledFields(
        Object.keys(currentStepData).reduce(
          (acc, key) => ({ ...acc, [key]: !!currentStepData[key] }),
          {}
        )
      );
    }, [step, fields]);

    const handleChange = (e) => {
      const { name, value, type, files, newItem } = e.target;

      if (type === "file" && files[0]) {
        const file = files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB (will be compressed to 2MB on backend)
        const allowedExtensions = ["jpeg", "jpg", "png"];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        // Check file size
        if (file.size > maxSize) {
          alert(
            `Image size is ${(file.size / (1024 * 1024)).toFixed(
              2
            )}MB. Maximum allowed size is 10MB (will be compressed to 2MB automatically).`
          );
          e.target.value = ""; // Clear the input
          return;
        }

        // Check file extension
        if (!allowedExtensions.includes(fileExtension)) {
          alert(
            `File extension '${fileExtension}' is not allowed. Only jpeg, jpg, png are allowed.`
          );
          e.target.value = ""; // Clear the input
          return;
        }
      }

      // Prevent negative values for number inputs
      if (type === "number" && parseFloat(value) < 0) {
        return; // Don't update state with negative values
      }

      // Validate average_rating to be between 1 and 5
      if (name === "average_rating" && value !== "") {
        const rating = parseFloat(value);
        if (rating < 1 || rating > 5) {
          return; // Don't update state with invalid rating values
        }
      }

      // Validate discount, bulk discount, and minimum order quantities against stock quantity
      if ((name === "discount_quantity" || name === "bulk_discount_quantity" || name === "min_retailer_quantity") && value !== "") {
        const quantity = parseFloat(value);
        const stockQuantity = parseFloat(localData.stock_quantity) || 0;
        if (stockQuantity > 0 && quantity > stockQuantity) {
          return; // Don't update if quantity exceeds stock
        }
      }

      // Validate percentage fields to not exceed 100
      if ((name === "discount_percentage" || name === "bulk_discount_percentage") && value !== "") {
        const percentage = parseFloat(value);
        if (percentage > 100) {
          return; // Don't update if percentage exceeds 100
        }
      }

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
      
      // Generic form pre-filling for any entity selection
      const entityToStepMap = {
        categories: 1,
        brands: 2,
        products: 3,
        variants: 4,
        attributes: 5,
        attributeValues: 5
      };
      
      const targetStep = entityToStepMap[entityType];
      if (targetStep && targetStep !== step) {
        setStepFormData((prev) => ({
          ...prev,
          [targetStep]: {
            ...entity,
            [`${entityType.slice(0, -1)}_id`]: entity.id || entity[`${entityType.slice(0, -1)}_id`]
          }
        }));
      }
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

      // Ensure we have the proper ID fields for related entities
      relatedEntities.forEach((e) => {
        if (relatedSelections[e]) {
          const entityIdField = `${e.slice(0, -1)}_id`;
          dataToSubmit[entityIdField] =
            relatedSelections[e].id || relatedSelections[e][entityIdField];
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
                    // Always use the correct relatedSelections key for value
                    relatedSelections[entity]?.id ||
                    relatedSelections[entity]?.[`${entity.slice(0, -1)}_id`] ||
                    ""
                  }
                  onChange={(e) => {
                    // Always update the correct relatedSelections key
                    const found = formData[entity].find(
                      (item) =>
                        item.id === e.target.value ||
                        item[`${entity.slice(0, -1)}_id`] === e.target.value
                    );
                    handleRelatedEntitySelect(entity, found);
                  }}
                  placeholder={
                    // Always use the correct relatedSelections key for placeholder
                    relatedSelections[entity]?.name ||
                    relatedSelections[entity]?.sku ||
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
                    // Use a robust mapping from field name to entity type
                    (() => {
                      // Map field names to entity types
                      const fieldToEntityType = {
                        category_id: "categories",
                        brand_id: "brands",
                        product_id: "products",
                        variant_id: "variants",
                        product_variant_id: "variants",
                        attribute_id: "attributes",
                        attribute_name: "attributes",
                        // fallback for attribute value step
                        attribute_value_id: "attributeValues",
                        // fallback for media step
                        media_id: "media",
                        // fallback for type and media_type (use field.options)
                        type: null,
                        media_type: null,
                        target_role: null,
                      };
                      const entityType = fieldToEntityType[field.name];
                      // If field.options is provided, use it (for static selects)
                      if (field.options) return field.options;
                      // If entityType is mapped, use getFilteredOptions
                      if (entityType) return getFilteredOptions(entityType);
                      // fallback: empty array
                      return [];
                    })()
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
      "Review",
    ];

    const canNavigateToStep = (targetStep) => {
      // Can navigate to any previous step if it has been filled
      return targetStep < step && Object.keys(stepFormData[targetStep]).length > 0;
    };

    const handleStepClick = (targetStep) => {
      if (canNavigateToStep(targetStep)) {
        setStep(targetStep);
      }
    };

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
                    ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    : i + 1 === step
                    ? "border-2 border-blue-600 text-blue-600"
                    : "border-2 border-gray-300 text-gray-400"
                } ${canNavigateToStep(i + 1) ? "cursor-pointer" : ""}`}
                onClick={() => handleStepClick(i + 1)}
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

  const ReviewStep = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await submitAllFormData();
      } catch (error) {
        console.error('Error saving data:', error);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Review Product Information
        </h2>
        
        <div className="space-y-6">
          {/* Category Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {stepFormData[1]?.name || "N/A"}</div>
              <div><span className="font-medium">Slug:</span> {stepFormData[1]?.slug || "N/A"}</div>
              <div><span className="font-medium">Target Role:</span> {stepFormData[1]?.target_role || "N/A"}</div>
            </div>
          </div>

          {/* Brand Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Brand</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {stepFormData[2]?.name || "N/A"}</div>
              <div><span className="font-medium">Slug:</span> {stepFormData[2]?.slug || "N/A"}</div>
            </div>
          </div>

          {/* Product Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Product</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {stepFormData[3]?.name || "N/A"}</div>
              <div><span className="font-medium">Slug:</span> {stepFormData[3]?.slug || "N/A"}</div>
              <div><span className="font-medium">Base Price:</span> ₹{stepFormData[3]?.base_price || "N/A"}</div>
              <div><span className="font-medium">Average Rating:</span> {stepFormData[3]?.average_rating || "N/A"}</div>
              <div className="md:col-span-2"><span className="font-medium">Description:</span> {stepFormData[3]?.description || "N/A"}</div>
            </div>
          </div>

          {/* Variant Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Product Variant</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">SKU:</span> {stepFormData[4]?.sku || "N/A"}</div>
              <div><span className="font-medium">Price:</span> ₹{stepFormData[4]?.price || "N/A"}</div>
              <div><span className="font-medium">Stock Quantity:</span> {stepFormData[4]?.stock_quantity || "N/A"}</div>
              <div><span className="font-medium">Min Order Quantity:</span> {stepFormData[4]?.min_retailer_quantity || "N/A"}</div>
              <div><span className="font-medium">Discount Quantity:</span> {stepFormData[4]?.discount_quantity || "N/A"}</div>
              <div><span className="font-medium">Discount %:</span> {stepFormData[4]?.discount_percentage || "N/A"}%</div>
              <div><span className="font-medium">Bulk Discount Quantity:</span> {stepFormData[4]?.bulk_discount_quantity || "N/A"}</div>
              <div><span className="font-medium">Bulk Discount %:</span> {stepFormData[4]?.bulk_discount_percentage || "N/A"}%</div>
              <div className="md:col-span-2"><span className="font-medium">Description:</span> {stepFormData[4]?.description || "N/A"}</div>
            </div>
          </div>

          {/* Variant Media Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Variant Media</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Media Type:</span> {stepFormData[4]?.variant_media_type || "N/A"}</div>
              {stepFormData[4]?.variant_media_file && (
                <div><span className="font-medium">File:</span> {stepFormData[4].variant_media_file.name}</div>
              )}
            </div>
            {stepFormData[4]?.variant_media_file && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(stepFormData[4].variant_media_file)}
                  alt="Variant media preview"
                  className="max-w-full h-auto max-h-40 rounded border"
                />
              </div>
            )}
          </div>

          {/* Attribute Value Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Attribute Value</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Attribute Name:</span> {stepFormData[5]?.attribute_name || "N/A"}</div>
              <div><span className="font-medium">Type:</span> {stepFormData[5]?.type || "N/A"}</div>
              <div><span className="font-medium">Value:</span> {stepFormData[5]?.value || "N/A"}</div>
            </div>
          </div>

          {/* Product Media Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">Product Media</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Media Type:</span> {stepFormData[3]?.media_type || "N/A"}</div>
              {stepFormData[3]?.media_file && (
                <div><span className="font-medium">File:</span> {stepFormData[3].media_file.name}</div>
              )}
            </div>
            {stepFormData[3]?.media_file && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(stepFormData[3].media_file)}
                  alt="Media preview"
                  className="max-w-full h-auto max-h-40 rounded border"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setStep(5)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Attribute Value
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 bg-green-600 text-white rounded-lg font-semibold transition-colors ${
              isSaving 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    );
  };

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
          placeholder: "Give rating from range 1-5 e.g., 4.5",
          required: false,
        },
        {
          name: "media_type",
          label: "Product Media Type",
          type: "select",
          placeholder: "Select media type",
          required: true,
          defaultValue: "image",
          options: [
            { id: "image", name: "Image" },
            { id: "video", name: "Video" },
          ],
        },
        {
          name: "media_file",
          label: "Upload Media",
          type: "file",
          placeholder: "Select media file",
          required: true,
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
          label: "Product Variant Name",
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
          name: "min_retailer_quantity",
          label: "Minimum Order Quantity for Retailers and Customers",
          type: "number",
          placeholder: "e.g., 5",
          required: false,
        },
        {
          name: "discount_quantity",
          label: "Discount Quantity for (Customer)",
          type: "number",
          placeholder: "e.g., 3",
          required: false,
        },
        {
          name: "discount_percentage",
          label: "Discount Percentage (%) for (Customer)",
          type: "number",
          placeholder: "e.g., 10",
          required: false,
        },
        {
          name: "bulk_discount_quantity",
          label: "Bulk Discount Quantity",
          type: "number",
          placeholder: "e.g., 10",
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
          name: "variant_media_type",
          label: "Product Variant Media Type",
          type: "select",
          placeholder: "Select media type",
          required: true,
          defaultValue: "image",
          options: [
            { id: "image", name: "Image" },
            { id: "video", name: "Video" },
          ],
        },
        {
          name: "variant_media_file",
          label: "Upload Variant Media",
          type: "file",
          placeholder: "Select variant media file",
          required: true,
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
          defaultValue: "string",
          options: [
            { id: "string", name: "String" },
            { id: "select", name: "Select" },
            { id: "integer", name: "int" },
            { id: "float", name: "float" },
            { id: "enum", name: "enum" },
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
  ];



  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Stepper />
        {step === 6 ? (
          <ReviewStep />
        ) : (
          <EnhancedFormComponent {...stepsConfig[step - 1]} />
        )}
      </div>
    </div>
  );
};

export default ProductCatalogManagement;
