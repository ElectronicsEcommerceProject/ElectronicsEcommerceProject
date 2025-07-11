import React, { useState, useEffect, useRef } from "react";
import {
  getApi,
  MESSAGE,
  createApi,
  updateApiById,
  couponAndOffersDashboardDataRoute,
  getAllCategoryRoute,
  getAllProductsRoute,
  getAllBrandsRoute,
  productVariantByProductIdRoute,
} from "../../../src/index.js";

const CouponForm = ({ coupon = null, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "Summer sale discount",
    discountType:
      coupon?.type?.toLowerCase() === "flat" ? "fixed" : "percentage",
    discountValue: coupon?.discount
      ? parseFloat(coupon.discount.replace(/%|\$/g, "")) || 0
      : 20,
    // Initialize targetType: if variantId exists, it's product_variant. If productId, it's product. Else, cart.
    // This assumes coupon object from props doesn't yet have distinct categoryId/brandId or a specific target_type field.
    targetType: coupon?.productVariantId
      ? "product_variant"
      : coupon?.productId
      ? "product"
      : "cart",
    productId: coupon?.productId || null,
    productVariantId: coupon?.productVariantId || null,
    categoryId: null, // Will be populated if editing a coupon that was category-specific (requires API support)
    brandId: null, // Will be populated if editing a coupon that was brand-specific (requires API support)
    role: coupon?.role?.toLowerCase() || "customer",
    minCartValue: coupon?.minOrder || 1000,
    maxDiscountValue: coupon?.maxDiscountValue || 500,
    usageLimit: coupon?.usageLimit || 100,
    usagePerUser: coupon?.usagePerUser || 1,
    validFrom: coupon?.validFrom
      ? new Date(coupon.validFrom).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    validTo: coupon?.validity
      ? new Date(coupon.validity).toISOString().split("T")[0]
      : new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0],
    isActive: coupon?.status === "Active" || true,
    isUserNew: coupon?.isUserNew || false,
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const prevTargetTypeRef = useRef();

  useEffect(() => {
    // This effect runs after formData is updated.
    // We check if targetType *changed* to 'product_variant' and if no product is selected.
    // The prevTargetTypeRef.current !== undefined condition prevents the alert on the very first render
    // if the initial state happens to meet the criteria, ensuring it only triggers on a user-driven change.
    if (
      formData.targetType === "product_variant" &&
      prevTargetTypeRef.current !== "product_variant" &&
      prevTargetTypeRef.current !== undefined && // Ensures it's not the initial render causing this
      !formData.productId // productId would be null if targetType just changed to product_variant
    ) {
      alert(
        "You've selected 'Specific Product Variant'. Please select a Product first."
      );
    }
    prevTargetTypeRef.current = formData.targetType;
  }, [formData.targetType, formData.productId]);

  useEffect(() => {
    // Log initial form data when component mounts
    console.log("CouponForm initialized with data:", {
      isEditMode: !!coupon,
      couponId: coupon?.id,
      initialFormData: formData,
    });
  }, []);

  // Fetch data for dropdowns based on targetType
  useEffect(() => {
    const loadDropdownData = async () => {
      setProducts([]); // Reset related data states
      setCategories([]);
      setBrands([]);

      if (
        formData.targetType === "product" ||
        formData.targetType === "product_variant"
      ) {
        try {
          const response = await getApi(getAllProductsRoute);
          if (response.message === MESSAGE.get.succ) {
            console.log("fetched all products", response.data);
            setProducts(response.data || []);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else if (formData.targetType === "category") {
        try {
          const response = await getApi(getAllCategoryRoute);
          if (response.message === MESSAGE.get.succ) {
            setCategories(response.data || []);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      } else if (formData.targetType === "brand") {
        try {
          const response = await getApi(getAllBrandsRoute);
          if (response.message === MESSAGE.get.succ) {
            setBrands(response.data || []);
          }
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      }
    };

    // Actually call the async function
    loadDropdownData();
  }, [formData.targetType]);

  // Fetch product variants when a product is selected and target type is product_variant
  useEffect(() => {
    const fetchProductVariants = async () => {
      if (formData.targetType === "product_variant" && formData.productId) {
        try {
          // Replace :product_id parameter with actual product ID
          const apiUrl = productVariantByProductIdRoute.replace(
            ":product_id",
            formData.productId
          );
          const response = await getApi(apiUrl);
          if (response.message === MESSAGE.get.succ) {
            setProductVariants(response.data || []);
          } else {
            setProductVariants([]);
          }
        } catch (error) {
          console.error("Error fetching product variants:", error);
          setProductVariants([]);
        }
      } else {
        setProductVariants([]);
      }
    };
    fetchProductVariants();
  }, [formData.targetType, formData.productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: newValue,
      };

      // Reset dependent fields when targetType changes
      if (name === "targetType") {
        updatedFormData.productId = null;
        updatedFormData.productVariantId = null;
        updatedFormData.categoryId = null;
        updatedFormData.brandId = null;
      }

      // Log the updated form data after each change
      console.log("Form data updated:", {
        field: name,
        newValue: newValue,
        allFormData: updatedFormData,
      });

      return updatedFormData;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "Start date is required";
    }

    if (!formData.validTo) {
      newErrors.validTo = "End date is required";
    }

    if (
      formData.validFrom &&
      formData.validTo &&
      new Date(formData.validFrom) >= new Date(formData.validTo)
    ) {
      newErrors.validTo = "End date must be after start date";
    }

    if (formData.targetType === "product" && !formData.productId) {
      newErrors.productId = "Product is required when target type is product";
    }
    if (formData.targetType === "category" && !formData.categoryId) {
      newErrors.categoryId =
        "Category is required when target type is category";
    }
    if (formData.targetType === "brand" && !formData.brandId) {
      newErrors.brandId = "Brand is required when target type is brand";
    }
    if (formData.targetType === "product_variant") {
      if (!formData.productId)
        newErrors.productId = "Product is required for product variant";
      if (!formData.productVariantId) {
        newErrors.productVariantId = "Product variant is required";
      }
    }

    if (
      formData.usageLimit !== null &&
      (isNaN(formData.usageLimit) || formData.usageLimit < 1)
    ) {
      newErrors.usageLimit = "Usage limit must be at least 1";
    }

    if (
      formData.usagePerUser !== null &&
      (isNaN(formData.usagePerUser) || formData.usagePerUser < 1)
    ) {
      newErrors.usagePerUser = "Usage per user must be at least 1";
    }

    if (formData.minCartValue < 0) {
      newErrors.minCartValue = "Minimum cart value cannot be negative";
    }

    if (formData.maxDiscountValue !== null && formData.maxDiscountValue < 0) {
      newErrors.maxDiscountValue = "Maximum discount value cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log all form data before validation
    console.log("Form submission - Raw form data:", formData);

    if (!validateForm()) {
      console.log("Form validation failed with errors:", errors);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API in the exact format required
      const couponData = {
        code: formData.code,
        description: formData.description,
        type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        target_type: formData.targetType,
        product_id:
          formData.targetType === "product" ||
          formData.targetType === "product_variant"
            ? formData.productId
            : null,
        category_id:
          formData.targetType === "category" ? formData.categoryId : null,
        brand_id: formData.targetType === "brand" ? formData.brandId : null,
        product_variant_id:
          formData.targetType === "product_variant"
            ? formData.productVariantId
            : null,
        target_role: formData.role,
        min_cart_value: parseFloat(formData.minCartValue) || 0,
        max_discount_value: formData.maxDiscountValue
          ? parseFloat(formData.maxDiscountValue)
          : null,
        usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        usage_per_user: formData.usagePerUser
          ? parseInt(formData.usagePerUser)
          : null,
        valid_from: formData.validFrom
          ? `${formData.validFrom}T00:00:00Z`
          : null,
        valid_to: formData.validTo ? `${formData.validTo}T23:59:59Z` : null,
        is_active: formData.isActive,
        is_user_new: formData.isUserNew,
      };

      // Log the formatted API data
      console.log("Form submission - Formatted API data:", {
        rawFormData: formData,
        formattedApiData: couponData,
      });

      // For UI display
      const uiCoupon = {
        id: coupon?.id || Date.now(),
        code: formData.code,
        discount:
          formData.discountType === "percentage"
            ? `${formData.discountValue}%`
            : `$${formData.discountValue}`,
        type: formData.discountType === "percentage" ? "Percentage" : "Flat",
        validity: formData.validTo,
        minOrder: parseFloat(formData.minCartValue) || 0,
        status: formData.isActive ? "Active" : "Inactive",
        product:
          formData.targetType === "cart"
            ? "All"
            : formData.targetType === "product"
            ? products.find((p) => String(p.id) === String(formData.productId))
                ?.name || "Selected Product"
            : formData.targetType === "category"
            ? categories.find(
                (c) => String(c.id) === String(formData.categoryId)
              )?.name || "Selected Category"
            : formData.targetType === "brand"
            ? brands.find((b) => String(b.id) === String(formData.brandId))
                ?.name || "Selected Brand"
            : formData.targetType === "product_variant"
            ? productVariants.find(
                (v) => String(v.id) === String(formData.productVariantId)
              )?.name || "Selected Variant"
            : "N/A",
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
        usageLimit: formData.usageLimit,
        description: formData.description,
        productId: formData.productId,
        productVariantId: formData.productVariantId,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        maxDiscountValue: formData.maxDiscountValue,
        usagePerUser: formData.usagePerUser,
        validFrom: formData.validFrom,
        isUserNew: formData.isUserNew,
      };

      // Log the UI display data
      console.log("Form submission - UI display data:", uiCoupon);

      // If editing existing coupon
      if (coupon?.id) {
        // Log all form data when updating
        console.log("Updating coupon with ID:", coupon.id, "Data:", couponData);

        const response = await updateApiById(
          couponAndOffersDashboardDataRoute,
          coupon.id,
          couponData
        );
        // console.log("Update API response:", response);

        if (response.message === MESSAGE.put.succ) {
          alert(`Coupon updated successfully! Coupon ID: ${coupon.id}`);
          onSave(uiCoupon);
        } else {
          setErrors({ form: response.message || "Failed to update coupon" });
        }
      } else {
        // If creating new coupon
        console.log("Creating new coupon with data:", couponData);

        const response = await createApi(
          couponAndOffersDashboardDataRoute,
          couponData
        );

        console.log("testing", response);

        if (response.success) {
          alert(`Coupon created successfully}`);
          // console.log("Create API response:", response);
          onSave({ ...uiCoupon, id: response.data.coupon_id });
        } else {
          alert(response.message || "Failed to create coupon");
          setErrors({ form: response.message || "Failed to create coupon" });
        }
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      // Check if error response contains structured data
      if (error.response?.data?.message) {
        alert(error.response.data.message);
        setErrors({ form: error.response.data.message });
      } else if (error.message) {
        alert(error.message);
        setErrors({ form: error.message });
      } else {
        alert("An error occurred while saving the coupon");
        setErrors({ form: "An error occurred while saving the coupon" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          type="button"
        >
          ×
        </button>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pr-8">
          {coupon ? "EDIT COUPON" : "CREATE COUPON"}
        </h3>

        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                COUPON CODE *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.code ? "border-red-500" : ""
                }`}
                placeholder="e.g., SAVE10"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                DESCRIPTION
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                DISCOUNT TYPE *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option key="percentage" value="percentage">
                  Percentage
                </option>
                <option key="fixed" value="fixed">
                  Fixed Amount
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                {formData.discountType === "percentage"
                  ? "DISCOUNT % *"
                  : "DISCOUNT AMOUNT (₹) *"}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.discountValue ? "border-red-500" : ""
                }`}
                min="0"
                step={formData.discountType === "percentage" ? "1" : "0.01"}
              />
              {errors.discountValue && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                VALID FROM *
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                VALID TO *
              </label>
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.validTo ? "border-red-500" : ""
                }`}
              />
              {errors.validTo && (
                <p className="text-red-500 text-xs mt-1">{errors.validTo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                TARGET TYPE *
              </label>
              <select
                name="targetType"
                value={formData.targetType}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option key="cart" value="cart">
                  Cart (All Products)
                </option>
                <option key="category" value="category">
                  Specific Category
                </option>
                <option key="brand" value="brand">
                  Specific Brand
                </option>
                <option key="product" value="product">
                  Specific Product
                </option>
                <option key="product_variant" value="product_variant">
                  Specific Product Variant
                </option>
              </select>
            </div>

            {/* Product Dropdown - shown for "product" and "product_variant" target types */}
            {(formData.targetType === "product" ||
              formData.targetType === "product_variant") && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  PRODUCT *
                </label>
                <select
                  name="productId"
                  value={formData.productId || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                    errors.productId ? "border-red-500" : ""
                  }`}
                >
                  <option key="select-product" value="">
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option
                      key={product.product_id || product.id}
                      value={product.product_id || product.id}
                    >
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.productId}
                  </p>
                )}
              </div>
            )}

            {/* Category Dropdown */}
            {formData.targetType === "category" && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  CATEGORY *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                    errors.categoryId ? "border-red-500" : ""
                  }`}
                >
                  <option key="select-category" value="">
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            )}

            {/* Brand Dropdown */}
            {formData.targetType === "brand" && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  BRAND *
                </label>
                <select
                  name="brandId"
                  value={formData.brandId || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                    errors.brandId ? "border-red-500" : ""
                  }`}
                >
                  <option key="select-brand" value="">
                    Select a brand
                  </option>
                  {brands.map((brand) => (
                    <option
                      key={brand.brand_id || brand.id}
                      value={brand.brand_id || brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="text-red-500 text-xs mt-1">{errors.brandId}</p>
                )}
              </div>
            )}
          </div>

          {/* Product Variant Dropdown - shown if targetType is "product_variant" and a product is selected */}
          {formData.targetType === "product_variant" && formData.productId && (
            <div className="mt-4">
              {" "}
              {/* Ensure it's part of the grid or styled appropriately */}
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                PRODUCT VARIANT *
              </label>
              <select
                name="productVariantId"
                value={formData.productVariantId || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.productVariantId ? "border-red-500" : ""
                }`}
              >
                <option key="select-variant" value="">
                  Select a variant
                </option>
                {productVariants.map((variant, index) => (
                  <option
                    key={
                      variant.variant_id ||
                      variant.id ||
                      variant.product_variant_id ||
                      `variant-${index}`
                    }
                    value={
                      variant.variant_id ||
                      variant.id ||
                      variant.product_variant_id
                    }
                  >
                    {variant.name} (SKU: {variant.sku || "N/A"})
                  </option>
                ))}
              </select>
              {errors.productVariantId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productVariantId}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                USER ROLE *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option key="customer" value="customer">
                  Customer
                </option>
                <option key="retailer" value="retailer">
                  Retailer
                </option>
                <option key="both" value="both">
                  Both
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                FOR NEW USERS ONLY
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="isUserNew"
                  checked={formData.isUserNew}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">
                  Limit to new users only
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                MINIMUM CART VALUE (₹)
              </label>
              <input
                type="number"
                name="minCartValue"
                value={formData.minCartValue}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                min="0"
                step="0.01"
              />
            </div>

            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                  MAX DISCOUNT VALUE (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                  min="0"
                  step="0.01"
                  placeholder="No maximum"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                TOTAL USAGE LIMIT
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.usageLimit ? "border-red-500" : ""
                }`}
                min="1"
                placeholder="Unlimited"
              />
              {errors.usageLimit && (
                <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                USAGE PER USER
              </label>
              <input
                type="number"
                name="usagePerUser"
                value={formData.usagePerUser || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm ${
                  errors.usagePerUser ? "border-red-500" : ""
                }`}
                min="1"
                placeholder="Unlimited"
              />
              {errors.usagePerUser && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.usagePerUser}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-xs sm:text-sm font-bold text-gray-700">
                ACTIVE
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-bold text-sm sm:text-base"
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold flex items-center justify-center text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                  SAVING...
                </>
              ) : coupon ? (
                "UPDATE COUPON"
              ) : (
                "CREATE COUPON"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
