import React, { useState, useEffect, useRef } from "react";

import {
  getApi,
  MESSAGE,
  createApi,
  updateApiById,
  deleteApiById,
  couponAndOffersDashboardDataRoute,
  couponAndOffersDashboardChangeStatusRoute,
  couponAndOffersDashboardAnalyticsDataRoute,
  getAllCategoryRoute,
  getAllProductsRoute,
  getAllBrandsRoute,
  productVariantByProductIdRoute,
} from "../../../src/index.js";

const CouponManagement = () => {
  const [activeTab, setActiveTab] = useState("All Coupons");
  const [search, setSearch] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const couponApi = async () => {
      try {
        setLoading(true);
        const couponApiResponse = await getApi(
          couponAndOffersDashboardDataRoute
        );
        if (couponApiResponse.message === MESSAGE.get.succ) {
          // Transform API response data to match component's expected format
          const formattedCoupons = couponApiResponse.data.map((coupon) => ({
            id: coupon.coupon_id,
            code: coupon.code,
            discount:
              coupon.type === "percentage"
                ? `${coupon.discount_value}%`
                : `${coupon.discount_value}`,
            validity: coupon.valid_to
              ? new Date(coupon.valid_to).toISOString().split("T")[0]
              : "",
            minOrder: parseFloat(coupon.min_cart_value) || 0,
            status: coupon.is_active ? "Active" : "Inactive",
            type: coupon.type === "percentage" ? "Percentage" : "Flat",
            product: coupon.Product?.name || "All",
            role: coupon.target_role || "Customer",
            usageLimit: coupon.usage_limit,
            autoApply: false,
            stackable: false,
            // Additional fields from API
            description: coupon.description,
            productId: coupon.product_id,
            productVariantId: coupon.product_variant_id,
            maxDiscountValue: coupon.max_discount_value,
            usagePerUser: coupon.usage_per_user,
            validFrom: coupon.valid_from,
            isUserNew: coupon.is_user_new,
          }));

          setCoupons(formattedCoupons);
          setError(null);
        } else {
          setError("Failed to fetch coupon data");
          console.error("Error fetching data:", couponApiResponse);
        }
      } catch (error) {
        setError("An error occurred while fetching coupon data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    couponApi();
  }, []);

  const [analyticsData, setAnalyticsData] = useState({
    usageStatistics: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
    redemptionRate: "0%",
    topCoupons: [],
  });

  useEffect(() => {
    const analyticsApi = async () => {
      try {
        const analyticsApiResponse = await getApi(
          couponAndOffersDashboardAnalyticsDataRoute
        );

        if (analyticsApiResponse.success === true) {
          // Store the analytics data in state
          setAnalyticsData(analyticsApiResponse.data);
          // console.log("Analytics data loaded:", analyticsApiResponse.data);
        } else {
          console.error(
            "Failed to fetch analytics data:",
            analyticsApiResponse
          );
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    analyticsApi();
  }, []);

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
        newErrors.maxDiscountValue =
          "Maximum discount value cannot be negative";
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
          usage_limit: formData.usageLimit
            ? parseInt(formData.usageLimit)
            : null,
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
              ? products.find(
                  (p) => String(p.id) === String(formData.productId)
                )?.name || "Selected Product"
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
          console.log(
            "Updating coupon with ID:",
            coupon.id,
            "Data:",
            couponData
          );

          const response = await updateApiById(
            couponAndOffersDashboardDataRoute,
            coupon.id,
            couponData
          );
          console.log("Update API response:", response);

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

          if (response.success) {
            alert(`Coupon created successfully}`);
            console.log("Create API response:", response);
            onSave({ ...uiCoupon, id: response.data.coupon_id });
          } else {
            setErrors({ form: response.message || "Failed to create coupon" });
          }
        }
      } catch (error) {
        console.error("Error saving coupon:", error);
        setErrors({ form: "An error occurred while saving the coupon" });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
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
                    <p className="text-red-500 text-xs mt-1">
                      {errors.brandId}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Product Variant Dropdown - shown if targetType is "product_variant" and a product is selected */}
            {formData.targetType === "product_variant" &&
              formData.productId && (
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.usageLimit}
                  </p>
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

  const CouponTable = ({ coupons, onAction, onEdit }) => (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
              <th className="py-4 px-6 text-left font-bold">CODE</th>
              <th className="py-4 px-6 text-left font-bold">DISCOUNT</th>
              <th className="py-4 px-6 text-left font-bold">VALIDITY</th>
              <th className="py-4 px-6 text-center font-bold">MIN ORDER</th>
              <th className="py-4 px-6 text-center font-bold">STATUS</th>
              <th className="py-4 px-6 text-center font-bold">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 font-bold">{coupon.code}</td>
                <td className="py-4 px-6 font-bold">{coupon.discount}</td>
                <td className="py-4 px-6 font-bold">{coupon.validity}</td>
                <td className="py-4 px-6 text-center font-bold">
                  ₹{coupon.minOrder}
                </td>
                <td className="py-4 px-6 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coupon.status === "Active"}
                      onChange={() =>
                        onAction(
                          coupon.id,
                          coupon.status === "Active" ? "Deactivate" : "Activate"
                        )
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer ${
                        coupon.status === "Active"
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </td>
                <td className="py-4 px-6 text-center flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition font-bold"
                    onClick={() => onEdit(coupon)}
                  >
                    EDIT
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-bold"
                    onClick={() => onAction(coupon.id, "Delete")}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-lg shadow p-4 border"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {coupon.code}
                </h3>
                <p className="text-sm text-gray-600">
                  Discount: <span className="font-bold">{coupon.discount}</span>
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coupon.status === "Active"}
                    onChange={() =>
                      onAction(
                        coupon.id,
                        coupon.status === "Active" ? "Deactivate" : "Activate"
                      )
                    }
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full peer ${
                      coupon.status === "Active"
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Valid Until:</span>
                <p className="font-bold">{coupon.validity}</p>
              </div>
              <div>
                <span className="text-gray-500">Min Order:</span>
                <p className="font-bold">${coupon.minOrder}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition font-bold text-sm"
                onClick={() => onEdit(coupon)}
              >
                EDIT
              </button>
              <button
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition font-bold text-sm"
                onClick={() => onAction(coupon.id, "Delete")}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const AnalyticsDashboard = ({ analyticsData }) => (
    <div className="p-3 sm:p-6 animate-slide-in">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        COUPON ANALYTICS
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            USAGE STATISTICS
          </h4>
          <svg className="w-full h-32 sm:h-48" viewBox="0 0 400 200">
            {/* Calculate bar heights based on data */}
            <rect
              x="50"
              y={120 - analyticsData.usageStatistics.Q1 / 2}
              width="50"
              height={80 + analyticsData.usageStatistics.Q1 / 2}
              fill="#3B82F6"
            />
            <rect
              x="120"
              y={80 - analyticsData.usageStatistics.Q2 / 2}
              width="50"
              height={120 + analyticsData.usageStatistics.Q2 / 2}
              fill="#10B981"
            />
            <rect
              x="190"
              y={50 - analyticsData.usageStatistics.Q3 / 2}
              width="50"
              height={150 + analyticsData.usageStatistics.Q3 / 2}
              fill="#8B5CF6"
            />
            <rect
              x="260"
              y={100 - analyticsData.usageStatistics.Q4 / 2}
              width="50"
              height={100 + analyticsData.usageStatistics.Q4 / 2}
              fill="#F59E0B"
            />
            <text
              x="75"
              y="195"
              fontSize="12"
              fill="#4B5563"
              textAnchor="middle"
              fontWeight="bold"
            >
              Q1
            </text>
            <text
              x="145"
              y="195"
              fontSize="12"
              fill="#4B5563"
              textAnchor="middle"
              fontWeight="bold"
            >
              Q2
            </text>
            <text
              x="215"
              y="195"
              fontSize="12"
              fill="#4B5563"
              textAnchor="middle"
              fontWeight="bold"
            >
              Q3
            </text>
            <text
              x="285"
              y="195"
              fontSize="12"
              fill="#4B5563"
              textAnchor="middle"
              fontWeight="bold"
            >
              Q4
            </text>
            <text
              x="75"
              y="110"
              fontSize="12"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              {analyticsData.usageStatistics.Q1}
            </text>
            <text
              x="145"
              y="70"
              fontSize="12"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              {analyticsData.usageStatistics.Q2}
            </text>
            <text
              x="215"
              y="40"
              fontSize="12"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              {analyticsData.usageStatistics.Q3}
            </text>
            <text
              x="285"
              y="90"
              fontSize="12"
              fill="white"
              textAnchor="middle"
              fontWeight="bold"
            >
              {analyticsData.usageStatistics.Q4}
            </text>
          </svg>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            REDEMPTION RATE
          </h4>
          <svg className="w-full h-32 sm:h-48" viewBox="0 0 200 200">
            {/* Calculate redemption rate percentage */}
            {(() => {
              const redemptionRate =
                parseInt(analyticsData.redemptionRate) || 0;
              const dashArray = 251.2; // Circumference of circle with r=80 (2πr)
              const dashOffset = dashArray * (1 - redemptionRate / 100);

              return (
                <>
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="#14B8A6"
                    stroke="#fff"
                    strokeWidth="10"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="#F87171"
                    stroke="#fff"
                    strokeWidth="10"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashArray - dashOffset}
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold"
                  >
                    {analyticsData.redemptionRate}
                  </text>
                  <text
                    x="100"
                    y="130"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#4B5563"
                    fontWeight="bold"
                  >
                    REDEMPTION RATE
                  </text>
                </>
              );
            })()}
          </svg>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow lg:col-span-2">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            TOP-PERFORMING COUPONS
          </h4>
          <div className="space-y-4">
            {analyticsData.topCoupons.length > 0 ? (
              analyticsData.topCoupons.map((item, index) => {
                // Assign different colors based on index
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
                const color = colors[index % colors.length];

                // Calculate text color based on redemption rate
                const redemptionRate = parseInt(item.redemptionRate) || 0;
                let textColor = "text-purple-600";
                if (redemptionRate > 80) textColor = "text-green-600";
                else if (redemptionRate > 60) textColor = "text-blue-600";

                return (
                  <div
                    key={item.id || item.code || index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span
                      className={`inline-block w-4 h-4 ${color} rounded-full mr-3`}
                    ></span>
                    <span className="flex-1 font-bold">{item.code}</span>
                    <span className={`font-bold ${textColor}`}>
                      {item.redemptionRate} REDEMPTION
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                No coupon data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const handleAction = async (id, action) => {
    try {
      setLoading(true);
      if (action === "Delete") {
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete this coupon`)) {
          setLoading(false);
          return;
        }

        // Call delete API endpoint
        // console.log(`Deleting coupon with ID: ${id}`);
        const response = await deleteApiById(
          couponAndOffersDashboardDataRoute,
          id
        );

        // console.log("teting response", response);

        if (response.message === MESSAGE.delete.succ) {
          alert(`Coupon deleted successfully!`);
          setCoupons(coupons.filter((coupon) => coupon.id !== id));
        } else {
          setError("Failed to delete coupon");
          alert(`Failed to delete coupon with ID: ${id}`);
        }
      } else {
        // Call update API endpoint to activate/deactivate
        const isActive = action === "Activate";
        console.log(
          `Changing coupon status with ID: ${id} to ${
            isActive ? "Active" : "Inactive"
          }`
        );

        const response = await updateApiById(
          couponAndOffersDashboardChangeStatusRoute,
          id,
          {
            is_active: isActive,
          }
        );

        if (response.message === MESSAGE.patch.succ) {
          alert(`Coupon status changed to ${isActive ? "Active" : "Inactive"}`);
          setCoupons(
            coupons.map((coupon) =>
              coupon.id === id
                ? {
                    ...coupon,
                    status: isActive ? "Active" : "Inactive",
                  }
                : coupon
            )
          );
        } else {
          setError(`Failed to ${action.toLowerCase()} coupon`);
          alert(`Failed to change status for coupon with ID: ${id}`);
        }
      }
    } catch (error) {
      setError(`An error occurred while performing ${action}`);
      console.error(`Error during ${action}:`, error);
      alert(`Error performing ${action} on coupon with ID: ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoupon = (newCoupon) => {
    if (editingCoupon) {
      setCoupons(
        coupons.map((c) => (c.id === editingCoupon.id ? newCoupon : c))
      );
    } else {
      setCoupons([...coupons, newCoupon]);
    }
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const searchTerm = search.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(searchTerm) ||
      coupon.discount.toLowerCase().includes(searchTerm) ||
      coupon.product.toLowerCase().includes(searchTerm) ||
      coupon.role.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          COUPON MANAGEMENT
        </h2>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold w-full sm:w-auto"
        >
          + CREATE COUPON
        </button>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
        <div className="flex space-x-1 min-w-max">
          {["All Coupons", "Analytics"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              } transition-colors`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {activeTab === "All Coupons" && (
        <>
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="SEARCH COUPONS..."
              className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <CouponTable
              coupons={filteredCoupons}
              onAction={handleAction}
              onEdit={(coupon) => {
                setEditingCoupon(coupon);
                setIsFormOpen(true);
              }}
            />
          )}
        </>
      )}

      {activeTab === "Analytics" && (
        <AnalyticsDashboard analyticsData={analyticsData} />
      )}

      {isFormOpen && (
        <CouponForm
          coupon={editingCoupon}
          onSave={handleSaveCoupon}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCoupon(null);
          }}
        />
      )}
    </div>
  );
};

export default CouponManagement;
