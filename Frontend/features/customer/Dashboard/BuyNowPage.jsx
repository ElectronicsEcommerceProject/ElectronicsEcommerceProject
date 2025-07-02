import { useState, useRef, useEffect } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { AddressForm } from "../../../components/index.js";

import {
  getApiById,
  userPanelProductByIdDetailsRoute,
  cartRoute,
  cartItemFindOrCreateRoute,
  createApi,
  orderRoute,
  orderItemRoute,
  userCouponUserRoute,
  getUserIdFromToken,
  userProductReviewRoute,
} from "../../../src/index.js";

const BuyNowPage = () => {
  // Get product ID from URL parameters
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isRightScrollAtEnd, setIsRightScrollAtEnd] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);

  // New state for Personalized Coupons and Quantity
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [showPersonalizedOffers, setShowPersonalizedOffers] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [minQuantity, setMinQuantity] = useState(1);

  // State for tracking applied coupon discounts
  const [appliedCouponData, setAppliedCouponData] = useState(null);

  // New state for review filtering
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [selectedSortFilter, setSelectedSortFilter] = useState("newest");

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: "",
    review: "",
    product_variant_id: null,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Address state for Buy Now
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Update review form data when selected variant changes
  useEffect(() => {
    if (selectedVariant && productData?.mainProduct?.variants) {
      const variantData = productData.mainProduct.variants.find(
        (v) => v.description === selectedVariant
      );
      if (variantData) {
        setReviewFormData((prev) => ({
          ...prev,
          product_variant_id: variantData.product_variant_id,
        }));
      }
    }
  }, [selectedVariant, productData]);

  const rightScrollRef = useRef(null);
  const leftScrollRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Fetch product data from API
  const fetchProductData = async () => {
    if (productId) {
      try {
        console.log("🛍️ BuyNowPage loaded for Product ID:", productId);

        // Call the API to get product details
        const response = await getApiById(
          userPanelProductByIdDetailsRoute,
          productId
        );

        if (response.success && response.data) {
          setProductData(response.data);
          // Set the main image from API response
          const mainImage = response.data.mainProduct.mainImage || "";
          setCurrentImage(mainImage);
        } else {
          console.error("Failed to fetch product data:", response);
          // You could set an error state here if needed
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        // You could set an error state here if needed
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]); // Re-run when productId changes

  useEffect(() => {
    if (productData && productData.mainProduct) {
      // Use the first variant's description as the selected variant
      const firstVariant =
        productData.mainProduct.variants?.[0]?.description ||
        productData.mainProduct.variantNames?.[0] ||
        "";
      setSelectedVariant(firstVariant);

      // Set minimum quantity from the first variant's min_retailer_quantity
      const firstVariantData = productData.mainProduct.variants?.[0];
      const minRetailerQty = firstVariantData?.min_retailer_quantity || 1;
      setMinQuantity(minRetailerQty);
      setQuantity(minRetailerQty); // Start quantity from minimum required

      // Check if there are applied coupons from the backend response
      if (productData.appliedCoupons && productData.appliedCoupons.length > 0) {
        // For now, we'll use the first applied coupon (you can enhance this logic later)
        const firstAppliedCoupon = productData.appliedCoupons[0];
        setAppliedCouponData({
          coupon_id: firstAppliedCoupon.coupon_id,
          code: firstAppliedCoupon.code,
          type: firstAppliedCoupon.type,
          discount_value: firstAppliedCoupon.discount_value,
          description: firstAppliedCoupon.description,
        });
      }
    }
  }, [productData]);

  // Update minimum quantity and image when selected variant changes
  useEffect(() => {
    if (selectedVariant && productData?.mainProduct?.variants) {
      const variantData = productData.mainProduct.variants.find(
        (v) => v.description === selectedVariant
      );
      if (variantData) {
        const minRetailerQty = variantData.min_retailer_quantity || 1;
        setMinQuantity(minRetailerQty);
        // Update quantity to minimum if current quantity is less than minimum
        if (quantity < minRetailerQty) {
          setQuantity(minRetailerQty);
        }

        // Update current image to variant image if available
        if (
          variantData.base_variant_image_url &&
          variantData.base_variant_image_url.trim() !== "" &&
          !variantData.base_variant_image_url.includes("placeholder")
        ) {
          setCurrentImage(variantData.base_variant_image_url);
        }
      }
    }
  }, [selectedVariant, productData, quantity]);

  useEffect(() => {
    const handleRightScroll = () => {
      const element = rightScrollRef.current;
      if (element) {
        const isAtEnd =
          element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
        setIsRightScrollAtEnd(isAtEnd);
      }
    };

    const rightElement = rightScrollRef.current;
    if (rightElement && productData) {
      rightElement.addEventListener("scroll", handleRightScroll);
      handleRightScroll();
    }

    return () => {
      if (rightElement) {
        rightElement.removeEventListener("scroll", handleRightScroll);
      }
    };
  }, [productData]);

  const handleWindowScroll = () => {
    if (isRightScrollAtEnd) {
      const leftElement = leftScrollRef.current;
      if (leftElement) {
        const scrollAmount = window.scrollY;
        leftElement.scrollLeft = scrollAmount;
        rightScrollRef.current.scrollTop = rightScrollRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [isRightScrollAtEnd]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    let x = e.clientX - left - 50; // lensSize/2
    let y = e.clientY - top - 50; // lensSize/2

    // Keep lens within bounds
    x = Math.max(0, Math.min(x, width - 100));
    y = Math.max(0, Math.min(y, height - 100));

    setLensPosition({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Calculate zoom position
  const lensCenterX = lensPosition.x + 50; // lensSize/2
  const lensCenterY = lensPosition.y + 50; // lensSize/2
  const zoomLevel = 2;
  const zoomedPixelX = lensCenterX * zoomLevel;
  const zoomedPixelY = lensCenterY * zoomLevel;
  const zoomContainerWidth = 400;
  const zoomContainerHeight = 400;
  const bgPosX = zoomedPixelX - zoomContainerWidth / 2;
  const bgPosY = zoomedPixelY - zoomContainerHeight / 2;

  // Convert to percentage for backgroundPosition
  const zoomedImageWidth = imageContainerRef.current
    ? imageContainerRef.current.offsetWidth * zoomLevel
    : 0;
  const zoomedImageHeight = imageContainerRef.current
    ? imageContainerRef.current.offsetHeight * zoomLevel
    : 0;
  const bgPosXPercent =
    zoomedImageWidth > 0
      ? (bgPosX / (zoomedImageWidth - zoomContainerWidth)) * 100
      : 0;
  const bgPosYPercent =
    zoomedImageHeight > 0
      ? (bgPosY / (zoomedImageHeight - zoomContainerHeight)) * 100
      : 0;

  if (!productData || !productData.mainProduct) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const { mainProduct } = productData;
  const relatedProducts = productData.relatedProducts || [];

  // Additional safety check for mainProduct properties
  if (!mainProduct || typeof mainProduct !== "object") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading product data</p>
        </div>
      </div>
    );
  }

  // Function to get all valid available images from API response
  const getAvailableImages = () => {
    const images = [];

    // Add main product image if valid
    if (
      mainProduct.mainImage &&
      mainProduct.mainImage.trim() !== "" &&
      !mainProduct.mainImage.includes("placeholder")
    ) {
      images.push(mainProduct.mainImage);
    }

    // Add thumbnail images if valid (from API response)
    if (mainProduct.thumbnails && Array.isArray(mainProduct.thumbnails)) {
      mainProduct.thumbnails.forEach((thumbnail) => {
        if (
          thumbnail &&
          thumbnail.trim() !== "" &&
          !thumbnail.includes("placeholder") &&
          !thumbnail.includes("via.placeholder.com") &&
          !images.includes(thumbnail)
        ) {
          images.push(thumbnail);
        }
      });
    }

    // Add variant images if available
    if (mainProduct.variants && Array.isArray(mainProduct.variants)) {
      mainProduct.variants.forEach((variant) => {
        if (
          variant.base_variant_image_url &&
          variant.base_variant_image_url.trim() !== "" &&
          !variant.base_variant_image_url.includes("placeholder") &&
          !variant.base_variant_image_url.includes("via.placeholder.com") &&
          !images.includes(variant.base_variant_image_url)
        ) {
          images.push(variant.base_variant_image_url);
        }
      });
    }

    // Add product media images if available
    if (mainProduct.media && Array.isArray(mainProduct.media)) {
      mainProduct.media.forEach((media) => {
        if (media.urls && Array.isArray(media.urls)) {
          media.urls.forEach((url) => {
            if (
              url.product_media_url &&
              url.product_media_url.trim() !== "" &&
              !url.product_media_url.includes("placeholder") &&
              !url.product_media_url.includes("via.placeholder.com") &&
              !images.includes(url.product_media_url)
            ) {
              images.push(url.product_media_url);
            }
          });
        }
      });
    }

    return images;
  };

  const availableImages = getAvailableImages();

  // Helper function to filter reviews by rating
  const filterReviewsByRating = (reviews, ratingFilter) => {
    if (!reviews || !Array.isArray(reviews)) return [];

    if (ratingFilter === "all") {
      return reviews;
    }

    const targetRating = parseInt(ratingFilter);
    return reviews.filter((review) => review.rating === targetRating);
  };

  // Helper function to sort reviews
  const sortReviews = (reviews, sortFilter) => {
    if (!reviews || !Array.isArray(reviews)) return [];

    const sortedReviews = [...reviews];

    switch (sortFilter) {
      case "newest":
        return sortedReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sortedReviews.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "helpful":
        return sortedReviews.sort(
          (a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)
        );
      case "rating-high":
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case "rating-low":
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  };

  // Get filtered and sorted reviews
  const getFilteredAndSortedReviews = () => {
    if (!mainProduct.reviews) return [];

    const filteredReviews = filterReviewsByRating(
      mainProduct.reviews,
      selectedRatingFilter
    );
    const sortedReviews = sortReviews(filteredReviews, selectedSortFilter);

    return sortedReviews;
  };

  const filteredAndSortedReviews = getFilteredAndSortedReviews();

  // Helper function to get current variant price
  const getCurrentVariantPrice = () => {
    if (selectedVariant && mainProduct.variants) {
      const variantData = mainProduct.variants.find(
        (v) => v.description === selectedVariant
      );
      return variantData
        ? parseFloat(variantData.price)
        : parseFloat(mainProduct.base_price || mainProduct.price || 0);
    }
    return parseFloat(mainProduct.base_price || mainProduct.price || 0);
  };

  // Helper function to calculate the best discount (quantity vs coupon)
  const calculateBestDiscount = (
    variantData,
    quantity,
    appliedCoupon = null
  ) => {
    if (!variantData)
      return { discountValue: 0, discountType: null, discountSource: null };

    const basePrice = parseFloat(variantData.price);
    if (isNaN(basePrice) || basePrice <= 0) {
      console.warn(
        "Invalid base price for discount calculation:",
        variantData.price
      );
      return { discountValue: 0, discountType: null, discountSource: null };
    }

    if (!quantity || quantity <= 0) {
      console.warn("Invalid quantity for discount calculation:", quantity);
      return { discountValue: 0, discountType: null, discountSource: null };
    }
    const regularDiscountQty = variantData.discount_quantity || 0;
    const regularDiscountPercent = parseFloat(
      variantData.discount_percentage || 0
    );
    const bulkDiscountQty = variantData.bulk_discount_quantity || 0;
    const bulkDiscountPercent = parseFloat(
      variantData.bulk_discount_percentage || 0
    );

    // Calculate quantity-based discount
    let quantityDiscountValue = 0;
    let quantityDiscountType = null;
    let quantityDiscountSource = null;

    if (quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
      quantityDiscountValue = bulkDiscountPercent;
      quantityDiscountType = "percentage";
      quantityDiscountSource = "bulk_discount";
    } else if (quantity >= regularDiscountQty && regularDiscountQty > 0) {
      quantityDiscountValue = regularDiscountPercent;
      quantityDiscountType = "percentage";
      quantityDiscountSource = "quantity_discount";
    }

    // Calculate coupon discount if applied
    let couponDiscountValue = 0;
    let couponDiscountType = null;
    let couponDiscountSource = null;

    if (appliedCoupon) {
      couponDiscountValue = parseFloat(appliedCoupon.discount_value);
      if (isNaN(couponDiscountValue) || couponDiscountValue < 0) {
        console.warn(
          "Invalid coupon discount value:",
          appliedCoupon.discount_value
        );
        couponDiscountValue = 0;
      } else {
        couponDiscountType = appliedCoupon.type; // "percentage" or "fixed"
        couponDiscountSource = "coupon";
      }
    }

    // Calculate actual discount amounts to compare
    let quantityDiscountAmount = 0;
    if (quantityDiscountType === "percentage") {
      quantityDiscountAmount = (basePrice * quantityDiscountValue) / 100;
    } else if (quantityDiscountType === "fixed") {
      quantityDiscountAmount = quantityDiscountValue;
    }

    let couponDiscountAmount = 0;
    if (couponDiscountType === "percentage") {
      couponDiscountAmount = (basePrice * couponDiscountValue) / 100;
    } else if (couponDiscountType === "fixed") {
      couponDiscountAmount = couponDiscountValue;
    }

    // Return the better discount
    if (couponDiscountAmount > quantityDiscountAmount) {
      return {
        discountValue: couponDiscountValue,
        discountType: couponDiscountType,
        discountSource: couponDiscountSource,
        couponData: appliedCoupon,
      };
    } else if (quantityDiscountAmount > 0) {
      return {
        discountValue: quantityDiscountValue,
        discountType: quantityDiscountType,
        discountSource: quantityDiscountSource,
      };
    }

    return { discountValue: 0, discountType: null, discountSource: null };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Product Section */}
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Product Image Section */}
        <div className="w-full lg:w-1/3 relative">
          {/* Wishlist button - top right corner */}
          <button
            className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={isWishlisted ? "red" : "none"}
              viewBox="0 0 24 24"
              stroke={isWishlisted ? "red" : "currentColor"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Main Image Container - Dynamic height based on available images */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col sm:flex-row h-[300px] sm:h-[360px] lg:h-[400px]">
            {/* Thumbnails Row/Column - Shows only valid available images */}
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden no-scrollbar w-full sm:w-[60px] h-[60px] sm:h-full border-b sm:border-b-0 sm:border-r border-gray-200">
              {availableImages.length > 0 ? (
                availableImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`
                relative flex-shrink-0 w-[60px] h-[60px]
                border-r sm:border-r-0 sm:border-b border-gray-200 last:border-r-0 sm:last:border-b-0
                cursor-pointer transition-all duration-100
                ${hoveredThumbnail === index ? "bg-blue-50" : "bg-white"}
              `}
                    onMouseEnter={() => {
                      setHoveredThumbnail(index);
                      setCurrentImage(imageUrl);
                    }}
                    onClick={() => setCurrentImage(imageUrl)}
                  >
                    <div
                      className={`
                absolute inset-0 border-2 pointer-events-none
                ${
                  hoveredThumbnail === index
                    ? "border-blue-500"
                    : "border-transparent"
                }
              `}
                    ></div>

                    <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Product Image ${index + 1}`}
                        className="h-full w-full object-contain hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500 text-xs">
                  No images available
                </div>
              )}
            </div>

            {/* Main Image Area with Magnifier */}
            <div
              ref={imageContainerRef}
              className="flex-grow flex items-center justify-center p-4 bg-white relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={
                  currentImage ||
                  mainProduct.mainImage ||
                  "https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=No+Image"
                }
                alt="Main Product"
                className="max-w-full max-h-[220px] sm:max-h-[280px] lg:max-h-[340px] object-contain"
              />

              {/* Magnifier Lens */}
              {showMagnifier && (
                <div
                  className="absolute pointer-events-none border border-green-400 z-50"
                  style={{
                    left: lensPosition.x,
                    top: lensPosition.y,
                    width: `100px`,
                    height: `100px`,
                    backgroundColor: "rgba(0, 255, 0, 0.15)",
                    backgroundImage: `
                  linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)
                `,
                    backgroundSize: "10px 10px",
                  }}
                />
              )}
            </div>
          </div>

          {/* Zoom Window - Hidden on mobile and tablet */}
          {showMagnifier && (
            <div
              className="hidden xl:block absolute left-full top-0 ml-4 w-[900px] h-[700px] border-2 border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
              style={{
                backgroundImage: `url(${
                  currentImage || mainProduct.mainImage || ""
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
                backgroundPosition: `${bgPosXPercent}% ${bgPosYPercent}%`,
              }}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={async () => {
                const variantData = mainProduct.variants?.find(
                  (v) => v.description === selectedVariant
                );

                // Get user_id from JWT token
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Please login to add items to cart");
                  return;
                }

                let user_id;
                try {
                  const decodedToken = jwtDecode(token);
                  user_id = decodedToken.user_id;
                } catch (error) {
                  console.error("Error decoding token:", error);
                  alert("Authentication error. Please login again.");
                  return;
                }

                setAddingToCart(true);

                try {
                  // Calculate discount information using the best discount function
                  const basePrice = parseFloat(variantData?.price || 0);

                  // Use calculateBestDiscount to get the best available discount
                  const bestDiscount = calculateBestDiscount(
                    variantData,
                    quantity,
                    appliedCouponData
                  );

                  // Calculate final price based on best discount
                  let discountedPrice = basePrice;
                  if (bestDiscount.discountType === "percentage") {
                    discountedPrice =
                      basePrice * (1 - bestDiscount.discountValue / 100);
                  } else if (bestDiscount.discountType === "fixed") {
                    discountedPrice = Math.max(
                      0,
                      basePrice - bestDiscount.discountValue
                    );
                  }

                  const finalPrice = discountedPrice * quantity;

                  // Step 1: Find or create cart for user
                  console.log("Finding or creating cart for user:", user_id);
                  let cart_id;

                  try {
                    // Use getApiById to get cart by user_id
                    const cartResponse = await getApiById(cartRoute, user_id);
                    console.log("Cart response:", cartResponse);

                    if (cartResponse.success && cartResponse.cart_id) {
                      // Cart exists, use existing cart_id
                      cart_id = cartResponse.cart_id;
                      console.log("Using existing cart:", cart_id);
                    } else if (
                      cartResponse.success &&
                      cartResponse.data &&
                      cartResponse.data.cart_id
                    ) {
                      // Alternative response structure
                      cart_id = cartResponse.data.cart_id;
                      console.log(
                        "Using existing cart (alt structure):",
                        cart_id
                      );
                    } else {
                      throw new Error("Cart not found");
                    }
                  } catch (cartError) {
                    // Cart doesn't exist, create a new one
                    console.log(
                      "Cart not found, creating new cart:",
                      cartError.message
                    );

                    try {
                      const createCartResponse = await createApi(cartRoute, {
                        user_id,
                      });
                      console.log("Create cart response:", createCartResponse);

                      if (
                        createCartResponse.success &&
                        createCartResponse.data &&
                        createCartResponse.data.cart_id
                      ) {
                        cart_id = createCartResponse.data.cart_id;
                        console.log("Created new cart:", cart_id);
                      } else if (
                        createCartResponse.success &&
                        createCartResponse.cart_id
                      ) {
                        cart_id = createCartResponse.cart_id;
                        console.log(
                          "Created new cart (alt structure):",
                          cart_id
                        );
                      } else {
                        throw new Error(
                          createCartResponse.message || "Failed to create cart"
                        );
                      }
                    } catch (createError) {
                      console.error("Failed to create cart:", createError);
                      throw new Error("Unable to create or access cart");
                    }
                  }

                  // Calculate the actual discount amount
                  const totalOriginalPrice = basePrice * quantity;
                  const actualDiscountAmount = totalOriginalPrice - finalPrice;

                  // Step 2: Use findOrCreate for cart item
                  const cartItemData = {
                    cart_id: cart_id,
                    product_id: productId,
                    product_variant_id: variantData?.product_variant_id,
                    total_quantity: quantity,
                    price_at_time: basePrice,
                    final_price: finalPrice,
                    discount_quantity:
                      bestDiscount.discountSource === "quantity_discount" ||
                      bestDiscount.discountSource === "bulk_discount"
                        ? bestDiscount.discountSource === "bulk_discount"
                          ? variantData?.bulk_discount_quantity
                          : variantData?.discount_quantity
                        : null,
                    discount_applied:
                      actualDiscountAmount > 0 ? actualDiscountAmount : null,
                    discount_type: bestDiscount.discountType,
                    coupon_id: appliedCouponData
                      ? appliedCouponData.coupon_id
                      : null,
                  };

                  console.log(
                    "Finding or creating cart item with data:",
                    cartItemData
                  );
                  const cartItemResponse = await createApi(
                    cartItemFindOrCreateRoute,
                    cartItemData
                  );
                  console.log(
                    "Cart item findOrCreate response:",
                    cartItemResponse
                  );

                  if (cartItemResponse.success) {
                    const action = cartItemResponse.created
                      ? "Added"
                      : "Updated";
                    alert(
                      `${action} ${quantity} item(s) in cart successfully!`
                    );

                    // Navigate to cart page after successful add to cart
                    setTimeout(() => {
                      navigate("/cart");
                    }, 1000);
                  } else {
                    throw new Error(
                      cartItemResponse.message || "Failed to add item to cart"
                    );
                  }
                } catch (error) {
                  console.error("Error adding to cart:", error);
                  alert(`Failed to add to cart: ${error.message}`);
                } finally {
                  setAddingToCart(false);
                }
              }}
              disabled={addingToCart}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                addingToCart
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {addingToCart ? "ADDING..." : `ADD TO CART (${quantity})`}
            </button>

            <button
              onClick={async () => {
                const variantData = mainProduct.variants?.find(
                  (v) => v.description === selectedVariant
                );

                // Get user_id from JWT token
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Please login to place order");
                  return;
                }

                let user_id;
                try {
                  const decodedToken = jwtDecode(token);
                  user_id = decodedToken.user_id;
                } catch (error) {
                  console.error("Error decoding token:", error);
                  alert("Authentication error. Please login again.");
                  return;
                }

                setBuyingNow(true);

                try {
                  // Calculate discount information
                  const basePrice = parseFloat(variantData?.price || 0);
                  const bestDiscount = calculateBestDiscount(
                    variantData,
                    quantity,
                    appliedCouponData
                  );

                  // Calculate final price
                  let discountedPrice = basePrice;
                  if (bestDiscount.discountType === "percentage") {
                    discountedPrice =
                      basePrice * (1 - bestDiscount.discountValue / 100);
                  } else if (bestDiscount.discountType === "fixed") {
                    discountedPrice = Math.max(
                      0,
                      basePrice - bestDiscount.discountValue
                    );
                  }

                  const finalPrice = discountedPrice * quantity;
                  const totalOriginalPrice = basePrice * quantity;
                  const actualDiscountAmount = totalOriginalPrice - finalPrice;

                  // Check if address is selected
                  if (!selectedAddress) {
                    alert("Please select a delivery address");
                    setShowAddressForm(true);
                    return;
                  }

                  const subtotal = finalPrice;
                  const delivery = subtotal > 5000 ? 0 : 99;
                  const tax = subtotal * 0.18; // 18% GST
                  const total = subtotal + delivery + tax;

                  // Prepare order data with original prices
                  const originalSubtotal = basePrice * quantity;
                  const orderData = {
                    user_id: user_id,
                    address_id: selectedAddress.address_id,
                    payment_method: "cod", // Default to Cash on Delivery
                    subtotal: originalSubtotal,
                    shipping_cost: delivery,
                    tax_amount: tax,
                    discount_amount: actualDiscountAmount,
                    total_amount:
                      originalSubtotal + delivery + tax - actualDiscountAmount,
                    notes: appliedCouponData
                      ? `Coupon applied: ${appliedCouponData.code}`
                      : "",
                  };

                  // Add coupon_id if a coupon is applied
                  if (appliedCouponData && appliedCouponData.coupon_id) {
                    orderData.coupon_id = appliedCouponData.coupon_id;
                  }

                  // Step 1: Create order
                  const orderResponse = await createApi(orderRoute, orderData);

                  if (orderResponse && orderResponse.success) {
                    const orderId = orderResponse.data.order.order_id;

                    // Step 2: Create order item with original pricing
                    const orderItemData = {
                      order_id: orderId,
                      product_id: productId,
                      product_variant_id:
                        variantData?.product_variant_id || null,
                      total_quantity: quantity,
                      discount_quantity:
                        bestDiscount.discountSource === "quantity_discount" ||
                        bestDiscount.discountSource === "bulk_discount"
                          ? bestDiscount.discountSource === "bulk_discount"
                            ? variantData?.bulk_discount_quantity
                            : variantData?.discount_quantity
                          : 0,
                      price_at_time: basePrice,
                      discount_applied: actualDiscountAmount || 0,
                      final_price: basePrice * quantity,
                    };

                    const orderItemResponse = await createApi(
                      orderItemRoute,
                      orderItemData
                    );

                    if (orderItemResponse && orderItemResponse.success) {
                      alert(`Order placed successfully! Total: ₹${total}`);
                      navigate("/profile/orders");
                    } else {
                      throw new Error(
                        orderItemResponse?.message ||
                          "Failed to create order item"
                      );
                    }
                  } else {
                    throw new Error(
                      orderResponse?.message || "Failed to place order"
                    );
                  }
                } catch (error) {
                  console.error("Error placing order:", error);
                  alert(`Failed to place order: ${error.message}`);
                } finally {
                  setBuyingNow(false);
                }
              }}
              disabled={buyingNow}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                buyingNow
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {(() => {
                if (buyingNow) return "ORDERING...";

                const variantData = mainProduct.variants?.find(
                  (v) => v.description === selectedVariant
                );
                if (!variantData)
                  return `BUY NOW (₹${getCurrentVariantPrice() * quantity})`;

                const basePrice = parseFloat(variantData.price);
                const bestDiscount = calculateBestDiscount(
                  variantData,
                  quantity,
                  appliedCouponData
                );

                let discountedPrice = basePrice;
                if (bestDiscount.discountType === "percentage") {
                  discountedPrice =
                    basePrice * (1 - bestDiscount.discountValue / 100);
                } else if (bestDiscount.discountType === "fixed") {
                  discountedPrice = Math.max(
                    0,
                    basePrice - bestDiscount.discountValue
                  );
                }

                const finalPrice = discountedPrice * quantity;
                const originalPrice = basePrice * quantity;

                if (finalPrice < originalPrice) {
                  return (
                    <div className="text-center">
                      <div>BUY NOW</div>
                      <div className="text-xs opacity-90">
                        <span className="line-through">₹{originalPrice}</span>
                        <span className="ml-1">₹{finalPrice}</span>
                      </div>
                    </div>
                  );
                }

                return `BUY NOW (₹${finalPrice})`;
              })()}
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div
          ref={rightScrollRef}
          className="w-full lg:w-2/3 max-h-[60vh] lg:max-h-[80vh] overflow-y-auto pr-2 lg:pr-4 no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`,
            }}
          />

          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
            {mainProduct.title || mainProduct.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
              {mainProduct.rating} ★
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              {mainProduct.rating_count} reviews
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              ₹{getCurrentVariantPrice()}
            </span>
            {mainProduct.originalPrice && (
              <span className="text-gray-500 line-through ml-2 text-sm sm:text-base">
                {mainProduct.originalPrice}
              </span>
            )}
            {mainProduct.discount && (
              <span className="text-green-600 ml-2 text-sm sm:text-base">
                {mainProduct.discount}
              </span>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-sm sm:text-base">Variant</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {mainProduct.variants &&
              Array.isArray(mainProduct.variants) &&
              mainProduct.variants.length > 0 ? (
                mainProduct.variants.map((variantData, index) => {
                  const displayName =
                    variantData.sku ||
                    variantData.name ||
                    variantData.description ||
                    `Variant ${index + 1}`;
                  const variantName =
                    variantData.description || `Variant ${index + 1}`;
                  return (
                    <button
                      key={variantData.product_variant_id}
                      className={`px-3 sm:px-4 py-2 border rounded-md text-xs sm:text-sm font-medium ${
                        selectedVariant === variantName
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      } transition-colors`}
                      onClick={() => setSelectedVariant(variantName)}
                    >
                      <div className="text-center">
                        <div className="font-medium">{displayName}</div>
                        <div className="text-xs opacity-75">
                          ₹{variantData?.price}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No variants available.</p>
              )}
            </div>
            <p className="text-sm mt-2">Selected Variant: {selectedVariant}</p>

            {/* Display selected variant details */}
            {selectedVariant && mainProduct.variants && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                {(() => {
                  const variantData = mainProduct.variants.find(
                    (v) => v.description === selectedVariant
                  );
                  if (!variantData) return null;

                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span>₹{variantData.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">SKU:</span>
                        <span className="text-gray-600">{variantData.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Min. Order Qty:</span>
                        <span className="text-blue-600 font-semibold">
                          {variantData.min_retailer_quantity || 1} units
                        </span>
                      </div>
                      {/* Show both discount tiers */}
                      {variantData.discount_percentage > 0 && (
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Quantity Discount:
                          </span>
                          <span className="text-green-600">
                            {variantData.discount_percentage}% off on{" "}
                            {variantData.discount_quantity}+ units
                          </span>
                        </div>
                      )}
                      {variantData.bulk_discount_percentage > 0 && (
                        <div className="flex justify-between">
                          <span className="font-medium">Bulk Discount:</span>
                          <span className="text-orange-600">
                            {variantData.bulk_discount_percentage}% off on{" "}
                            {variantData.bulk_discount_quantity}+ units
                          </span>
                        </div>
                      )}
                      {/* Display variant attributes */}
                      {variantData.variantAttributes &&
                        variantData.variantAttributes.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Specifications:</span>
                            <div className="mt-1 space-y-1">
                              {variantData.variantAttributes.map((attr) => (
                                <div
                                  key={attr.variant_attribute_value_id}
                                  className="flex justify-between text-sm"
                                >
                                  <span>{attr.attribute.name}:</span>
                                  <span>{attr.attributeValue.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="font-semibold text-sm sm:text-base">Quantity</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    setQuantity(Math.max(minQuantity, quantity - 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= minQuantity}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || minQuantity;
                    setQuantity(Math.max(minQuantity, value));
                  }}
                  className="w-16 px-2 py-2 text-center border-0 focus:outline-none"
                  min={minQuantity}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Show minimum quantity info */}
              {minQuantity > 1 && (
                <div className="text-sm text-gray-600 mt-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    ℹ️ Minimum order quantity: {minQuantity}
                  </span>
                </div>
              )}

              {/* Show discount info if applicable */}
              {selectedVariant &&
                mainProduct.variants &&
                (() => {
                  const variantData = mainProduct.variants.find(
                    (v) => v.description === selectedVariant
                  );
                  if (!variantData) return null;

                  const regularDiscountQty = variantData.discount_quantity || 0;
                  const regularDiscountPercent = parseFloat(
                    variantData.discount_percentage || 0
                  );
                  const bulkDiscountQty =
                    variantData.bulk_discount_quantity || 0;
                  const bulkDiscountPercent = parseFloat(
                    variantData.bulk_discount_percentage || 0
                  );

                  // Check which discount applies
                  if (quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
                    // 20% bulk discount applies
                    return (
                      <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                          🎉 Bulk Discount Applied: {bulkDiscountPercent}% OFF
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          You're getting the maximum discount!
                        </p>
                      </div>
                    );
                  } else if (
                    quantity >= regularDiscountQty &&
                    regularDiscountQty > 0
                  ) {
                    // 10% regular discount applies
                    const remainingForBulk = bulkDiscountQty - quantity;
                    return (
                      <div className="space-y-2">
                        <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                          <p className="text-green-700 text-sm font-medium">
                            🎉 Discount Applied: {regularDiscountPercent}% OFF
                          </p>
                        </div>
                        {bulkDiscountQty > 0 && (
                          <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                            <p className="text-blue-700 text-sm">
                              💰 Add {remainingForBulk} more to get{" "}
                              {bulkDiscountPercent}% OFF
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    // No discount yet, show what's needed
                    const remainingForRegular = regularDiscountQty - quantity;
                    const remainingForBulk = bulkDiscountQty - quantity;

                    return (
                      <div className="space-y-2">
                        {regularDiscountQty > 0 && (
                          <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                            <p className="text-blue-700 text-sm">
                              💰 Add {remainingForRegular} more to get{" "}
                              {regularDiscountPercent}% OFF
                            </p>
                          </div>
                        )}
                        {bulkDiscountQty > 0 && (
                          <div className="bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg">
                            <p className="text-purple-700 text-sm">
                              🚀 Add {remainingForBulk} more to get{" "}
                              {bulkDiscountPercent}% OFF (Best Deal!)
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
            </div>

            {/* Total Price Calculation with Coupon Support */}
            {selectedVariant &&
              mainProduct.variants &&
              (() => {
                const variantData = mainProduct.variants.find(
                  (v) => v.description === selectedVariant
                );
                if (variantData) {
                  const basePrice = parseFloat(variantData.price);

                  // Use the calculateBestDiscount function to get the best discount
                  const bestDiscount = calculateBestDiscount(
                    variantData,
                    quantity,
                    appliedCouponData
                  );

                  // Calculate final price based on best discount
                  let discountedPrice = basePrice;
                  if (bestDiscount.discountType === "percentage") {
                    discountedPrice =
                      basePrice * (1 - bestDiscount.discountValue / 100);
                  } else if (bestDiscount.discountType === "fixed") {
                    discountedPrice = Math.max(
                      0,
                      basePrice - bestDiscount.discountValue
                    );
                  }

                  const totalPrice = discountedPrice * quantity;
                  const savings = (basePrice - discountedPrice) * quantity;

                  // Determine display type for discount
                  let discountDisplayType = "";
                  if (bestDiscount.discountSource === "coupon") {
                    discountDisplayType = `Coupon (${appliedCouponData.code})`;
                  } else if (bestDiscount.discountSource === "bulk_discount") {
                    discountDisplayType = "Bulk Discount";
                  } else if (
                    bestDiscount.discountSource === "quantity_discount"
                  ) {
                    discountDisplayType = "Quantity Discount";
                  }

                  return (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      {/* Show applied coupon info if any */}
                      {appliedCouponData && (
                        <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded-md">
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium text-sm">
                              🎉 Coupon Applied: {appliedCouponData.code}
                            </span>
                            <button
                              onClick={() => setAppliedCouponData(null)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-green-600 text-xs mt-1">
                            {appliedCouponData.description}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Price:</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-600">
                            ₹{totalPrice.toFixed(2)}
                          </span>
                          {savings > 0 && (
                            <div className="text-sm text-gray-500">
                              <span className="line-through">
                                ₹{(basePrice * quantity).toFixed(2)}
                              </span>
                              <span className="text-green-600 ml-2">
                                Save ₹{savings.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ₹{discountedPrice.toFixed(2)} × {quantity}{" "}
                        {quantity > 1 ? "items" : "item"}
                        {bestDiscount.discountValue > 0 && (
                          <span className="text-green-600 ml-2">
                            ({discountDisplayType}:{" "}
                            {bestDiscount.discountType === "percentage"
                              ? `${bestDiscount.discountValue}%`
                              : `₹${bestDiscount.discountValue}`}{" "}
                            OFF)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Product Description</h3>
            {Array.isArray(mainProduct.description) ? (
              mainProduct.description.map((line, index) => (
                <p key={index} className="text-sm mt-2">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm mt-2">
                {mainProduct.description || "No description available."}
              </p>
            )}
          </div>

          {/* Available Coupons Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">
              Available Offers & Coupons
            </h3>
            <div className="mt-3 space-y-3">
              {mainProduct.coupons &&
              Array.isArray(mainProduct.coupons) &&
              mainProduct.coupons.length > 0 ? (
                mainProduct.coupons.map((coupon) => (
                  <div
                    key={coupon.coupon_id}
                    className="border border-dashed border-green-400 bg-green-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-mono">
                            {coupon.code}
                          </span>
                          <span className="text-sm font-medium">
                            {coupon.type === "percentage"
                              ? `${coupon.discount_value}% OFF`
                              : `₹${coupon.discount_value} OFF`}
                          </span>
                          {coupon.is_user_new && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              New Users Only
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {coupon.description || "Special discount offer"}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          {coupon.min_cart_value &&
                            `Min. order: ₹${coupon.min_cart_value} | `}
                          Valid till:{" "}
                          {new Date(coupon.valid_to).toLocaleDateString()}
                          {coupon.usage_per_user &&
                            ` | Usage limit: ${coupon.usage_per_user} per user`}
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            // Get user ID from token
                            const user_id = getUserIdFromToken();
                            if (!user_id) {
                              alert("Please login to apply coupons");
                              return;
                            }

                            // Check if coupon is already applied
                            if (
                              appliedCouponData &&
                              appliedCouponData.coupon_id === coupon.coupon_id
                            ) {
                              alert("This coupon is already applied!");
                              return;
                            }

                            // Get selected variant data
                            const variantData = mainProduct.variants?.find(
                              (v) => v.description === selectedVariant
                            );

                            // Make API call to apply coupon with additional IDs
                            const couponData = {
                              coupon_id: coupon.coupon_id,
                              user_id: user_id,
                              category_id: mainProduct.category?.category_id || null,
                              brand_id: mainProduct.brand?.brand_id || null,
                              product_id: productId,
                              product_variant_id: variantData?.product_variant_id || null,
                            };

                            console.log(
                              "Applying coupon with data:",
                              couponData
                            );

                            const response = await createApi(
                              userCouponUserRoute,
                              couponData
                            );

                            if (response.success) {
                              // Store the applied coupon data for price calculation
                              setAppliedCouponData({
                                coupon_id: coupon.coupon_id,
                                code: coupon.code,
                                type: coupon.type,
                                discount_value: coupon.discount_value,
                                description: coupon.description,
                              });

                              alert(
                                `Coupon applied successfully! Code: ${coupon.code}`
                              );
                            } else {
                              alert(
                                `Failed to apply coupon: ${
                                  response.message || "Unknown error"
                                }`
                              );
                            }
                          } catch (error) {
                            console.error("Error applying coupon:", error);
                            alert(
                              `An error occurred while applying the coupon: ${
                                error.message || "Unknown error"
                              }`
                            );
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          appliedCouponData &&
                          appliedCouponData.coupon_id === coupon.coupon_id
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        disabled={
                          appliedCouponData &&
                          appliedCouponData.coupon_id === coupon.coupon_id
                        }
                      >
                        {appliedCouponData &&
                        appliedCouponData.coupon_id === coupon.coupon_id
                          ? "Applied"
                          : "Apply"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No coupons available at the moment.
                </p>
              )}
            </div>
          </div>

          {/* Personalized Coupons Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">🎁 Your Personal Offers</h3>
              <button
                onClick={() =>
                  setShowPersonalizedOffers(!showPersonalizedOffers)
                }
                className="text-blue-600 text-sm hover:underline"
              >
                {showPersonalizedOffers ? "Hide Offers" : "Show Offers"}
              </button>
            </div>

            {showPersonalizedOffers && (
              <div className="space-y-3">
                {/* Coupon Input */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">
                    💳 Have a Coupon Code?
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => {
                        if (couponInput.trim()) {
                          alert(
                            `Coupon "${couponInput}" applied successfully!`
                          );
                          setAppliedCoupons([...appliedCoupons, couponInput]);
                          setCouponInput("");
                        }
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupons.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-purple-700">
                        Applied coupons:
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {appliedCoupons.map((coupon, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                          >
                            {coupon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Personalized Coupons List */}
                {mainProduct.personalizedCoupons &&
                Array.isArray(mainProduct.personalizedCoupons) &&
                mainProduct.personalizedCoupons.length > 0 ? (
                  mainProduct.personalizedCoupons.map((coupon) => (
                    <div
                      key={coupon.coupon_id}
                      className={`border rounded-lg p-4 ${
                        coupon.applicable
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-mono ${
                                coupon.applicable
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-400 text-white"
                              }`}
                            >
                              {coupon.code}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                coupon.type === "percentage"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {coupon.type === "percentage"
                                ? `${coupon.discount_value}% OFF`
                                : `₹${coupon.discount_value} OFF`}
                            </span>
                            {coupon.is_user_specific && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                Personal
                              </span>
                            )}
                          </div>

                          <h4 className="font-medium text-gray-800">
                            {coupon.description || "Special offer"}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {coupon.personalization_reason ||
                              "Personalized for you"}
                          </p>

                          <div className="mt-2 text-xs text-gray-500">
                            <span>Min. order: ₹{coupon.min_cart_value}</span>
                            {coupon.max_discount_value && (
                              <span>
                                {" "}
                                | Max discount: ₹{coupon.max_discount_value}
                              </span>
                            )}
                            <span>
                              {" "}
                              | Valid till:{" "}
                              {new Date(coupon.valid_to).toLocaleDateString()}
                            </span>
                            {coupon.usage_count && (
                              <span>
                                {" "}
                                | Used: {coupon.usage_count}/
                                {coupon.usage_per_user}
                              </span>
                            )}
                          </div>

                          {coupon.applicable && (
                            <div className="mt-2 text-green-700 font-medium text-sm">
                              💰 You'll save ₹{coupon.savings_amount}
                            </div>
                          )}

                          {!coupon.applicable && coupon.availability_note && (
                            <div className="mt-2 text-orange-700 text-sm">
                              ℹ️ {coupon.availability_note}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          {coupon.applicable ? (
                            <button
                              onClick={() => {
                                alert(
                                  `Coupon "${coupon.code}" applied! You saved ₹${coupon.savings_amount}`
                                );
                                setAppliedCoupons([
                                  ...appliedCoupons,
                                  coupon.code,
                                ]);
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                              Apply Now
                            </button>
                          ) : (
                            <button
                              disabled
                              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                            >
                              Not Available
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No personalized offers available at the moment.</p>
                    <p className="text-sm mt-1">
                      Check back later for exclusive deals!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Brand & Category Information */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Product Information</h3>
            <div className="mt-3 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600">Brand</h4>
                  <p className="text-lg font-semibold">
                    {mainProduct.brand.name}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600">
                    Category
                  </h4>
                  <p className="text-lg font-semibold">
                    {mainProduct.category.name}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-600">Status</h4>
                  <div className="flex gap-2">
                    {mainProduct.is_active && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                    {mainProduct.is_featured && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Customer Reviews Section - Horizontally Scrollable */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.round(mainProduct.rating_average)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {mainProduct.rating_average}
                    </span>
                    <span className="text-gray-600">
                      ({mainProduct.rating_count} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {mainProduct.reviews && Array.isArray(mainProduct.reviews)
                      ? mainProduct.reviews.filter(
                          (r) => r.is_verified_purchase
                        ).length
                      : 0}{" "}
                    verified purchases
                  </div>
                  {/* Filter Status */}
                  {selectedRatingFilter !== "all" && (
                    <div className="text-sm text-blue-600 font-medium">
                      Showing {filteredAndSortedReviews.length} of{" "}
                      {mainProduct.reviews?.length || 0} reviews (
                      {selectedRatingFilter} star
                      {selectedRatingFilter !== "1" ? "s" : ""})
                    </div>
                  )}
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedRatingFilter}
                  onChange={(e) => setSelectedRatingFilter(e.target.value)}
                  className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reviews</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select
                  value={selectedSortFilter}
                  onChange={(e) => setSelectedSortFilter(e.target.value)}
                  className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                </select>
                {(selectedRatingFilter !== "all" ||
                  selectedSortFilter !== "newest") && (
                  <button
                    onClick={() => {
                      setSelectedRatingFilter("all");
                      setSelectedSortFilter("newest");
                    }}
                    className="px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-300 rounded-md transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Horizontally Scrollable Reviews Container */}
            <div className="relative">
              <div
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredAndSortedReviews.length > 0 ? (
                  filteredAndSortedReviews.map((review) => {
                    // Safety check for review object
                    if (
                      !review ||
                      typeof review !== "object" ||
                      !review.product_review_id
                    ) {
                      return null;
                    }
                    return (
                      <div
                        key={review.product_review_id}
                        className="flex-shrink-0 w-72 sm:w-80 lg:w-96 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Review Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <img
                            src={
                              review.user?.profileImage_url ||
                              "https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=U"
                            }
                            alt={review.user?.name || "User"}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {review.user?.name || "Anonymous User"}
                              </h4>
                              {review.is_verified_purchase && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>
                                {review.user?.totalReviews || 0} reviews
                              </span>
                              <span>•</span>
                              <span>
                                {review.user?.helpfulVotes || 0} helpful votes
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating and Variant */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              ({review.rating}/5)
                            </span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {review.variant || "Standard"}
                          </span>
                        </div>

                        {/* Review Title */}
                        <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {review.title || "No title"}
                        </h5>

                        {/* Review Content */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                          {review.review || "No review content"}
                        </p>

                        {/* Review Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.helpfulCount > 0 && (
                              <span>{review.helpfulCount} found helpful</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                              Helpful
                            </button>
                            {review.reportCount === 0 && (
                              <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                Report
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">
                      {mainProduct.reviews && mainProduct.reviews.length > 0
                        ? "🔍"
                        : "📝"}
                    </div>
                    <h4 className="text-lg font-medium mb-2">
                      {mainProduct.reviews && mainProduct.reviews.length > 0
                        ? "No reviews match your filter"
                        : "No reviews yet"}
                    </h4>
                    <p className="text-sm">
                      {mainProduct.reviews && mainProduct.reviews.length > 0
                        ? "Try adjusting your filter criteria to see more reviews."
                        : "Be the first to review this product!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Scroll Indicators */}
              {filteredAndSortedReviews.length > 3 && (
                <div className="flex justify-center mt-4">
                  <div className="flex gap-1">
                    {[
                      ...Array(Math.ceil(filteredAndSortedReviews.length / 3)),
                    ].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-300"
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Review Summary Stats */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                Review Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Rating Distribution */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Rating Distribution
                  </h5>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        mainProduct.reviews &&
                        Array.isArray(mainProduct.reviews)
                          ? mainProduct.reviews.filter(
                              (r) => r.rating === rating
                            ).length
                          : 0;
                      const percentage =
                        mainProduct.reviews &&
                        Array.isArray(mainProduct.reviews)
                          ? (count / mainProduct.reviews.length) * 100
                          : 0;
                      return (
                        <div
                          key={rating}
                          className={`flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors ${
                            selectedRatingFilter === rating.toString()
                              ? "bg-blue-50 border border-blue-200"
                              : ""
                          }`}
                          onClick={() => {
                            if (selectedRatingFilter === rating.toString()) {
                              setSelectedRatingFilter("all");
                            } else {
                              setSelectedRatingFilter(rating.toString());
                            }
                          }}
                          title={`Click to filter ${rating} star reviews`}
                        >
                          <span className="w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedRatingFilter === rating.toString()
                                  ? "bg-blue-500"
                                  : "bg-yellow-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-gray-600">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Variant Reviews */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Reviews by Variant
                  </h5>
                  <div className="space-y-2">
                    {(
                      mainProduct.variants?.map((v) => v.description) || [
                        "Standard",
                        "Pro",
                        "Pro+",
                      ]
                    ).map((variant) => {
                      const count =
                        mainProduct.reviews &&
                        Array.isArray(mainProduct.reviews)
                          ? mainProduct.reviews.filter(
                              (r) => r.variant === variant
                            ).length
                          : 0;
                      const avgRating =
                        mainProduct.reviews &&
                        Array.isArray(mainProduct.reviews) &&
                        count > 0
                          ? (
                              mainProduct.reviews
                                .filter((r) => r.variant === variant)
                                .reduce((sum, r) => sum + r.rating, 0) / count
                            ).toFixed(1)
                          : 0;
                      return (
                        <div
                          key={variant}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-medium">{variant}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">
                              ★ {avgRating}
                            </span>
                            <span className="text-gray-600">({count})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Write Review Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  // Set the selected variant ID if available
                  if (selectedVariant && mainProduct.variants) {
                    const variantData = mainProduct.variants.find(
                      (v) => v.description === selectedVariant
                    );
                    if (variantData) {
                      setReviewFormData((prev) => ({
                        ...prev,
                        product_variant_id: variantData.product_variant_id,
                      }));
                    }
                  }
                  setShowReviewForm(true);
                }}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Write a Review
              </button>
            </div>

            {/* Review Form Modal */}
            {showReviewForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Write a Review</h2>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        // Get user_id from JWT token
                        const token = localStorage.getItem("token");
                        if (!token) {
                          alert("Please login to submit a review");
                          return;
                        }

                        let user_id;
                        try {
                          const decodedToken = jwtDecode(token);
                          user_id = decodedToken.user_id;
                        } catch (error) {
                          console.error("Error decoding token:", error);
                          alert("Authentication error. Please login again.");
                          return;
                        }

                        setSubmittingReview(true);

                        try {
                          const reviewData = {
                            product_id: productId,
                            product_variant_id:
                              reviewFormData.product_variant_id,
                            user_id: user_id,
                            rating: reviewFormData.rating,
                            title: reviewFormData.title,
                            review: reviewFormData.review,
                            is_verified_purchase: false, // This would be determined by the backend
                            created_by: user_id,
                          };

                          console.log("Submitting review:", reviewData);

                          const response = await createApi(
                            userProductReviewRoute,
                            reviewData
                          );

                          if (response.success) {
                            alert(
                              "Thank you! Your review has been submitted successfully."
                            );
                            setShowReviewForm(false);
                            // Reset form data
                            setReviewFormData({
                              rating: 5,
                              title: "",
                              review: "",
                              product_variant_id: null,
                            });
                            // Refresh product data to show the new review
                            fetchProductData();
                          } else {
                            throw new Error(
                              response.message || "Failed to submit review"
                            );
                          }
                        } catch (error) {
                          console.error("Error submitting review:", error);
                          alert(`Failed to submit review: ${error.message}`);
                        } finally {
                          setSubmittingReview(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      {/* Rating Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating *
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewFormData((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className="text-2xl focus:outline-none"
                            >
                              <span
                                className={
                                  star <= reviewFormData.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({reviewFormData.rating} out of 5 stars)
                          </span>
                        </div>
                      </div>

                      {/* Review Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review Title *
                        </label>
                        <input
                          type="text"
                          value={reviewFormData.title}
                          onChange={(e) =>
                            setReviewFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Summarize your experience"
                          required
                        />
                      </div>

                      {/* Review Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review *
                        </label>
                        <textarea
                          value={reviewFormData.review}
                          onChange={(e) =>
                            setReviewFormData((prev) => ({
                              ...prev,
                              review: e.target.value,
                            }))
                          }
                          className="w-full p-2 border border-gray-300 rounded h-32"
                          placeholder="Share your experience with this product"
                          required
                        />
                      </div>

                      {/* Variant Selection - Show all product variants */}
                      {mainProduct.variants &&
                        mainProduct.variants.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Product Variant
                            </label>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Currently reviewing:{" "}
                                {selectedVariant || "Standard variant"}
                              </span>
                            </div>
                            <select
                              value={reviewFormData.product_variant_id || ""}
                              onChange={(e) =>
                                setReviewFormData((prev) => ({
                                  ...prev,
                                  product_variant_id: e.target.value || null,
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded"
                            >
                              <option value="">Select a variant</option>
                              {mainProduct.variants.map((variant) => {
                                const isCurrentVariant =
                                  variant.description === selectedVariant;
                                return (
                                  <option
                                    key={variant.product_variant_id}
                                    value={variant.product_variant_id}
                                    selected={isCurrentVariant}
                                  >
                                    {variant.sku ||
                                      `Variant ${variant.product_variant_id}`}
                                    {isCurrentVariant
                                      ? " (Currently Selected)"
                                      : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className={`px-4 py-2 bg-blue-600 text-white rounded ${
                            submittingReview
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isRightScrollAtEnd && (
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            Related Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts && Array.isArray(relatedProducts) ? (
              relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm lg:text-base font-medium line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold mt-2">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No related products available.</p>
            )}
          </div>
        </div>
      )}
      <Footer />

      {/* Address Form Popup */}
      <AddressForm
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onAddressSelect={(address) => {
          setSelectedAddress(address);
          setShowAddressForm(false);
        }}
        selectedAddressId={selectedAddress?.address_id}
        mode="select"
      />
    </div>
  );
};

export default BuyNowPage;
