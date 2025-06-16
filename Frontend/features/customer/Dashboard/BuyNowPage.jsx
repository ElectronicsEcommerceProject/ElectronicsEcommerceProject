import { useState, useRef, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";

import {
  getApiById,
  userPanelProductByIdDetailsRoute,
  cartRoute,
  cartItemRoute,
  createApi,
} from "../../../src/index.js";

const BuyNowPage = () => {
  // Get product ID from URL parameters
  const { productId } = useParams();

  const [productData, setProductData] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
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

  const rightScrollRef = useRef(null);
  const leftScrollRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
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
    }
  }, [productData]);

  // Update minimum quantity when selected variant changes
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
                  // Calculate discount information
                  const basePrice = parseFloat(variantData?.price || 0);
                  const regularDiscountQty =
                    variantData?.discount_quantity || 0;
                  const regularDiscountPercent = parseFloat(
                    variantData?.discount_percentage || 0
                  );
                  const bulkDiscountQty =
                    variantData?.bulk_discount_quantity || 0;
                  const bulkDiscountPercent = parseFloat(
                    variantData?.bulk_discount_percentage || 0
                  );

                  // Determine which discount applies
                  let discountPercent = 0;
                  let discountQuantity = null;

                  if (quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
                    discountPercent = bulkDiscountPercent;
                    discountQuantity = bulkDiscountQty;
                  } else if (
                    quantity >= regularDiscountQty &&
                    regularDiscountQty > 0
                  ) {
                    discountPercent = regularDiscountPercent;
                    discountQuantity = regularDiscountQty;
                  }

                  const discountedPrice =
                    basePrice * (1 - discountPercent / 100);
                  const finalPrice = discountedPrice * quantity;

                  // Step 1: Use getApiById to check for existing cart
                  console.log("Checking for existing cart for user:", user_id);
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

                  // Step 2: Add item to cart using cartItem controller
                  const cartItemData = {
                    cart_id: cart_id,
                    product_id: productId,
                    product_variant_id: variantData?.product_variant_id,
                    total_quantity: quantity,
                    price_at_time: basePrice,
                    final_price: finalPrice,
                    discount_quantity: discountQuantity,
                    discount_applied:
                      discountPercent > 0 ? discountPercent : null,
                  };

                  console.log("Adding item to cart with data:", cartItemData);
                  const cartItemResponse = await createApi(
                    cartItemRoute,
                    cartItemData
                  );
                  console.log("Cart item response:", cartItemResponse);

                  if (
                    cartItemResponse.success ||
                    cartItemResponse.message === "Item quantity updated in cart"
                  ) {
                    alert(`Added ${quantity} item(s) to cart successfully!`);
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
              onClick={() => {
                const variantData = mainProduct.variants?.find(
                  (v) => v.description === selectedVariant
                );
                console.log("Buy now:", {
                  product_id: productId,
                  variant_id: variantData?.product_variant_id,
                  quantity: quantity,
                  price: variantData?.price,
                });
                alert(`Proceeding to buy ${quantity} item(s)!`);
              }}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              BUY NOW ({quantity})
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
              {mainProduct.price}
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
                        <div>{variantName}</div>
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

            {/* Total Price Calculation */}
            {selectedVariant &&
              mainProduct.variants &&
              (() => {
                const variantData = mainProduct.variants.find(
                  (v) => v.description === selectedVariant
                );
                if (variantData) {
                  const basePrice = parseFloat(variantData.price);

                  // Get discount values
                  const regularDiscountQty = variantData.discount_quantity || 0;
                  const regularDiscountPercent = parseFloat(
                    variantData.discount_percentage || 0
                  );
                  const bulkDiscountQty =
                    variantData.bulk_discount_quantity || 0;
                  const bulkDiscountPercent = parseFloat(
                    variantData.bulk_discount_percentage || 0
                  );

                  // Determine which discount applies
                  let discountPercent = 0;
                  let discountType = "";

                  if (quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
                    discountPercent = bulkDiscountPercent;
                    discountType = "Bulk Discount";
                  } else if (
                    quantity >= regularDiscountQty &&
                    regularDiscountQty > 0
                  ) {
                    discountPercent = regularDiscountPercent;
                    discountType = "Quantity Discount";
                  }

                  const discountedPrice =
                    basePrice * (1 - discountPercent / 100);
                  const totalPrice = discountedPrice * quantity;
                  const savings = (basePrice - discountedPrice) * quantity;

                  return (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
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
                        {discountPercent > 0 && (
                          <span className="text-green-600 ml-2">
                            ({discountType}: {discountPercent}% OFF)
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
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Apply
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
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Reviews</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Horizontally Scrollable Reviews Container */}
            <div className="relative">
              <div
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {mainProduct.reviews &&
                Array.isArray(mainProduct.reviews) &&
                mainProduct.reviews.length > 0 ? (
                  mainProduct.reviews.map((review) => {
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
                    <div className="text-6xl mb-4">📝</div>
                    <h4 className="text-lg font-medium mb-2">No reviews yet</h4>
                    <p className="text-sm">
                      Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>

              {/* Scroll Indicators */}
              {mainProduct.reviews && mainProduct.reviews.length > 3 && (
                <div className="flex justify-center mt-4">
                  <div className="flex gap-1">
                    {[...Array(Math.ceil(mainProduct.reviews.length / 3))].map(
                      (_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-300"
                        ></div>
                      )
                    )}
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
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
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
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                Write a Review
              </button>
            </div>
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
    </div>
  );
};

export default BuyNowPage;
