import React, { useState } from "react";
import { AddressForm } from "../../src/index.js";

// Hardcoded mock data based on backend models
const mockUser = {
  user_id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Satyam Kumar",
  email: "satyam@example.com",
  phone_number: "+91-9876543210",
  profileImage_url: "/assets/profile.jpg",
  role: "customer",
  status: "active",
};

// Import address from AddressForm's mockAddresses (first address which is default)
const mockAddress = {
  address_id: "550e8400-e29b-41d4-a716-446655440002",
  user_id: "550e8400-e29b-41d4-a716-446655440001",
  address_line1: "123 Main Street",
  address_line2: "Apt 4B",
  city: "Delhi",
  state: "Delhi",
  postal_code: "110001",
  country: "India",
  is_default: true,
  is_active: true,
};

const mockCoupons = [
  {
    coupon_id: "550e8400-e29b-41d4-a716-446655440010",
    code: "SAVE10",
    description: "10% off on electronics",
    type: "percentage",
    discount_value: 10,
    target_type: "cart",
    target_role: "customer",
    min_cart_value: 1000,
    max_discount_value: 500,
    usage_limit: 100,
    usage_per_user: 1,
    valid_from: "2024-01-01",
    valid_to: "2024-12-31",
    is_active: true,
    is_user_new: false,
  },
  {
    coupon_id: "550e8400-e29b-41d4-a716-446655440011",
    code: "WELCOME10",
    description: "₹500 off on your first order",
    type: "fixed",
    discount_value: 500,
    target_type: "cart",
    target_role: "customer",
    min_cart_value: 2000,
    max_discount_value: 500,
    usage_limit: 1000,
    usage_per_user: 1,
    valid_from: "2024-01-01",
    valid_to: "2024-12-31",
    is_active: true,
    is_user_new: true,
  },
  {
    coupon_id: "550e8400-e29b-41d4-a716-446655440012",
    code: "SUMMER25",
    description: "₹1000 off on orders above ₹10000",
    type: "fixed",
    discount_value: 1000,
    target_type: "cart",
    target_role: "both",
    min_cart_value: 10000,
    max_discount_value: 1000,
    usage_limit: 500,
    usage_per_user: 2,
    valid_from: "2024-06-01",
    valid_to: "2024-08-31",
    is_active: true,
    is_user_new: false,
  },
  {
    coupon_id: "550e8400-e29b-41d4-a716-446655440013",
    code: "FREESHIP",
    description: "Free shipping on all orders",
    type: "fixed",
    discount_value: 99,
    target_type: "cart",
    target_role: "both",
    min_cart_value: 500,
    max_discount_value: 99,
    usage_limit: null,
    usage_per_user: null,
    valid_from: "2024-01-01",
    valid_to: "2024-12-31",
    is_active: true,
    is_user_new: false,
  },
];

const mockCartItems = [
  {
    cart_item_id: "550e8400-e29b-41d4-a716-446655440020",
    cart_id: "550e8400-e29b-41d4-a716-446655440030",
    product_id: "550e8400-e29b-41d4-a716-446655440040",
    product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
    total_quantity: 2,
    min_order_quantity: 2, // Minimum order quantity
    quantity_discount: {
      threshold: 3, // Add 3 or more to get discount
      type: "percentage",
      value: 10, // 10% off
      message: "Add 1 more to get 10% off!",
    },
    bulk_discount: {
      threshold: 5,
      type: "fixed",
      value: 100, // ₹100 off
      message: "Add 3 more to get ₹100 off!",
    },
    price_at_time: 2999.0,
    discount_applied: 10.0,
    discount_type: "percentage",
    final_price: 5398.2,
    product: {
      product_id: "550e8400-e29b-41d4-a716-446655440040",
      name: "Wireless Headphones",
      slug: "wireless-headphones-sony",
      description:
        "Premium Noise Cancelling Wireless Headphones with Bluetooth 5.0, 30-hour battery life, and superior sound quality",
      short_description: "Noise Cancelling, Bluetooth 5.0",
      base_price: 2999.0,
      rating_average: 4.5,
      rating_count: 128,
      is_active: true,
      is_featured: true,
      category_id: "550e8400-e29b-41d4-a716-446655440060",
      brand_id: "550e8400-e29b-41d4-a716-446655440070",
      brand: {
        brand_id: "550e8400-e29b-41d4-a716-446655440070",
        name: "Sony",
        slug: "sony",
      },
      category: {
        category_id: "550e8400-e29b-41d4-a716-446655440060",
        name: "Audio & Headphones",
        slug: "audio-headphones",
        target_role: "both",
      },
      mainImage: "/assets/shop.jpg",
      price: 2999.0,
      variant: {
        product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
        description: "Black Color, Standard Size",
        short_description: "Black Standard",
        price: 2999.0,
        stock_quantity: 25,
        sku: "SONY-WH-1000XM4-BLK",
        base_variant_image_url: "/assets/shop.jpg",
        discount_quantity: 5,
        discount_percentage: 10.0,
        min_retailer_quantity: 10,
        bulk_discount_quantity: 20,
        bulk_discount_percentage: 15.0,
        attributes: {
          color: "Black",
          size: "Standard",
          connectivity: "Bluetooth 5.0",
          battery_life: "30 hours",
        },
      },
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    cart_item_id: "550e8400-e29b-41d4-a716-446655440021",
    cart_id: "550e8400-e29b-41d4-a716-446655440030",
    product_id: "550e8400-e29b-41d4-a716-446655440041",
    product_variant_id: "550e8400-e29b-41d4-a716-446655440051",
    total_quantity: 1,
    discount_quantity: null,
    price_at_time: 15999.0,
    discount_applied: null,
    discount_type: null,
    final_price: 15999.0,
    product: {
      product_id: "550e8400-e29b-41d4-a716-446655440041",
      name: "Smart Watch Series 7",
      slug: "smart-watch-apple-series-7",
      description:
        "Apple Watch Series 7 with 44mm case, GPS, Always-On Retina display, and comprehensive health tracking features",
      short_description: "Series 7, 44mm, GPS",
      base_price: 15999.0,
      rating_average: 4.8,
      rating_count: 89,
      is_active: false, // Out of stock
      is_featured: true,
      category_id: "550e8400-e29b-41d4-a716-446655440061",
      brand_id: "550e8400-e29b-41d4-a716-446655440071",
      brand: {
        brand_id: "550e8400-e29b-41d4-a716-446655440071",
        name: "Apple",
        slug: "apple",
      },
      category: {
        category_id: "550e8400-e29b-41d4-a716-446655440061",
        name: "Wearables & Smart Watches",
        slug: "wearables-smart-watches",
        target_role: "both",
      },
      mainImage: "/assets/logo.png",
      price: 15999.0,
      variant: {
        product_variant_id: "550e8400-e29b-41d4-a716-446655440051",
        description: "Silver Aluminum Case with White Sport Band",
        short_description: "Silver 44mm",
        price: 15999.0,
        stock_quantity: 0, // Out of stock
        sku: "APPLE-WATCH-S7-44-SLV",
        base_variant_image_url: "/assets/logo.png",
        discount_quantity: null,
        discount_percentage: null,
        min_retailer_quantity: 5,
        bulk_discount_quantity: null,
        bulk_discount_percentage: null,
        attributes: {
          color: "Silver",
          size: "44mm",
          case_material: "Aluminum",
          band_color: "White",
          connectivity: "GPS",
        },
      },
    },
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    cart_item_id: "550e8400-e29b-41d4-a716-446655440022",
    cart_id: "550e8400-e29b-41d4-a716-446655440030",
    product_id: "550e8400-e29b-41d4-a716-446655440042",
    product_variant_id: "550e8400-e29b-41d4-a716-446655440052",
    total_quantity: 3,
    discount_quantity: 2,
    price_at_time: 1299.0,
    discount_applied: 5.0,
    discount_type: "percentage",
    final_price: 3703.05,
    product: {
      product_id: "550e8400-e29b-41d4-a716-446655440042",
      name: "USB-C Fast Charging Cable",
      slug: "usb-c-fast-charging-cable",
      description:
        "High-quality USB-C to USB-C fast charging cable, 6ft length, supports up to 100W power delivery and data transfer speeds up to 480 Mbps",
      short_description: "6ft, 100W Power Delivery",
      base_price: 1299.0,
      rating_average: 4.2,
      rating_count: 45,
      is_active: true,
      is_featured: false,
      category_id: "550e8400-e29b-41d4-a716-446655440062",
      brand_id: "550e8400-e29b-41d4-a716-446655440072",
      brand: {
        brand_id: "550e8400-e29b-41d4-a716-446655440072",
        name: "Anker",
        slug: "anker",
      },
      category: {
        category_id: "550e8400-e29b-41d4-a716-446655440062",
        name: "Cables & Accessories",
        slug: "cables-accessories",
        target_role: "both",
      },
      mainImage: "/assets/shop.jpg",
      price: 1299.0,
      variant: {
        product_variant_id: "550e8400-e29b-41d4-a716-446655440052",
        description: "Black 6ft USB-C to USB-C Cable",
        short_description: "Black 6ft",
        price: 1299.0,
        stock_quantity: 150,
        sku: "ANKER-USBC-6FT-BLK",
        base_variant_image_url: "/assets/shop.jpg",
        discount_quantity: 2,
        discount_percentage: 5.0,
        min_retailer_quantity: 50,
        bulk_discount_quantity: 10,
        bulk_discount_percentage: 12.0,
        attributes: {
          color: "Black",
          length: "6ft",
          connector_type: "USB-C to USB-C",
          power_delivery: "100W",
          data_speed: "480 Mbps",
        },
      },
    },
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(mockAddress);
  const [savedForLater, setSavedForLater] = useState([]);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [selectedItemForWishlist, setSelectedItemForWishlist] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] =
    useState("3-5 business days");

  // Calculate price details based on backend model structure
  const subtotal = cartItems.reduce(
    (sum, item) =>
      item.product.is_active ? sum + parseFloat(item.final_price) : sum,
    0
  );
  const discount = appliedCoupon ? appliedCoupon.discount_value : 0;
  const delivery = subtotal > 5000 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal - discount + delivery + tax;

  // Handlers
  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.cart_item_id !== id));
  };

  const handleSaveForLater = (item) => {
    setSavedForLater([...savedForLater, item]);
    setCartItems(
      cartItems.filter(
        (cartItem) => cartItem.cart_item_id !== item.cart_item_id
      )
    );
  };

  const handleMoveToCart = (item) => {
    setCartItems([...cartItems, item]);
    setSavedForLater(
      savedForLater.filter(
        (savedItem) => savedItem.cart_item_id !== item.cart_item_id
      )
    );
  };

  const handleAddToWishlist = (item) => {
    setSelectedItemForWishlist(item);
    setShowWishlistPopup(true);
  };
  const handleQuantityChange = (id, delta) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.cart_item_id === id) {
          const minQty = item.min_order_quantity || 1;
          const newQuantity = Math.max(minQty, item.total_quantity + delta);
          const priceAtTime = parseFloat(item.price_at_time);

          // Discount logic
          let discount = 0;
          let discountType = null;
          let discountMsg = null;

          // Quantity discount
          if (
            item.quantity_discount &&
            newQuantity >= item.quantity_discount.threshold
          ) {
            discountType = item.quantity_discount.type;
            if (discountType === "percentage") {
              discount =
                priceAtTime *
                newQuantity *
                (item.quantity_discount.value / 100);
              discountMsg = item.quantity_discount.message;
            } else if (discountType === "fixed") {
              discount = item.quantity_discount.value;
              discountMsg = item.quantity_discount.message;
            }
          }
          // Bulk discount
          if (
            item.bulk_discount &&
            newQuantity >= item.bulk_discount.threshold
          ) {
            discountType = item.bulk_discount.type;
            if (discountType === "percentage") {
              discount =
                priceAtTime * newQuantity * (item.bulk_discount.value / 100);
              discountMsg = item.bulk_discount.message;
            } else if (discountType === "fixed") {
              discount = item.bulk_discount.value;
              discountMsg = item.bulk_discount.message;
            }
          }

          let finalPrice = priceAtTime * newQuantity - discount;

          return {
            ...item,
            total_quantity: newQuantity,
            final_price: finalPrice.toFixed(2),
            discount_applied: discount,
            discount_type: discountType,
            discount_message: discountMsg,
          };
        }
        return item;
      })
    );
  };
  const handleApplyCoupon = () => {
    const found = mockCoupons.find((c) => c.code === couponInput.trim());
    if (found) {
      // Check if coupon is valid for current cart value
      if (found.min_cart_value && subtotal < found.min_cart_value) {
        alert(
          `Minimum cart value of ₹${found.min_cart_value} required for this coupon`
        );
        return;
      }
      setAppliedCoupon(found);
    } else {
      alert("Invalid coupon code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => setShowLogoutPopup(true)}
          >
            Logout
          </button>
        </div>

        {/* Cart Summary Bar */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                cart
              </span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm font-medium">
                Subtotal: ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {delivery === 0 ? "Free delivery" : `+₹${delivery} delivery`}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Cart
              </span>
            </div>
            <div
              className={`w-16 h-1 ${
                selectedAddress ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 ${
                  selectedAddress
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } rounded-full flex items-center justify-center text-sm ${
                  selectedAddress ? "font-medium" : ""
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm ${
                  selectedAddress
                    ? "font-medium text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Address
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Payment</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Left: Cart Items */}
        <section className="md:w-2/3 bg-white rounded-lg shadow-md p-6">
          {/* Address */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Deliver to:</h2>
            <div className="bg-gray-50 p-3 rounded border flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-semibold">{mockUser.name}</span> |{" "}
                {mockUser.phone_number}
                <div className="text-sm text-gray-700">
                  {selectedAddress.address_line1},{" "}
                  {selectedAddress.address_line2}, {selectedAddress.city},{" "}
                  {selectedAddress.state} - {selectedAddress.postal_code},{" "}
                  {selectedAddress.country}
                </div>
              </div>
              <button
                className="text-blue-600 text-sm mt-2 md:mt-0"
                onClick={() => setShowAddressForm(true)}
              >
                Change
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y">
            {cartItems.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Your cart is empty
              </div>
            )}
            {cartItems.map((item) => {
              // Extract values from backend model structure
              const priceAtTime = parseFloat(item.price_at_time);
              const quantity = item.total_quantity;
              const isActive = item.product.is_active;
              const finalPrice = parseFloat(item.final_price);
              const discountApplied = item.discount_applied
                ? parseFloat(item.discount_applied)
                : 0;
              const discountType = item.discount_type;
              const stockQuantity = item.product.variant?.stock_quantity || 0;
              const minQty = item.min_order_quantity || 1;

              // Calculate individual item price (final price / quantity)
              const itemPrice =
                quantity > 0 ? finalPrice / quantity : priceAtTime;

              // --- NEW: Show next discount message if available ---
              let nextDiscountMsg = null;
              if (
                item.quantity_discount &&
                quantity < item.quantity_discount.threshold
              ) {
                const needed = item.quantity_discount.threshold - quantity;
                if (item.quantity_discount.type === "percentage") {
                  nextDiscountMsg = `Add ${needed} more to get ${item.quantity_discount.value}% off!`;
                } else if (item.quantity_discount.type === "fixed") {
                  nextDiscountMsg = `Add ${needed} more to get ₹${item.quantity_discount.value} off!`;
                }
              } else if (
                item.bulk_discount &&
                quantity < item.bulk_discount.threshold
              ) {
                const needed = item.bulk_discount.threshold - quantity;
                if (item.bulk_discount.type === "percentage") {
                  nextDiscountMsg = `Add ${needed} more to get ${item.bulk_discount.value}% off!`;
                } else if (item.bulk_discount.type === "fixed") {
                  nextDiscountMsg = `Add ${needed} more to get ₹${item.bulk_discount.value} off!`;
                }
              }

              return (
                <div
                  key={item.cart_item_id}
                  className={`flex gap-4 py-6 ${!isActive ? "opacity-60" : ""}`}
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {item.product.name}
                      </h3>
                      <span className="text-xs bg-gray-200 rounded px-2 py-1">
                        {item.product.brand.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {item.product.short_description}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Category: {item.product.category?.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Variant: {item.product.variant?.short_description}
                      {item.product.variant?.sku && (
                        <span className="ml-2">
                          SKU: {item.product.variant.sku}
                        </span>
                      )}
                    </div>
                    {item.product.rating_average && (
                      <div className="text-xs text-gray-500 mb-2">
                        ⭐ {item.product.rating_average} (
                        {item.product.rating_count} reviews)
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                          ₹{itemPrice.toLocaleString()}
                        </span>
                        {discountApplied > 0 && (
                          <span className="text-xs text-green-600">
                            {discountType === "percentage"
                              ? `${discountApplied}% off`
                              : `₹${discountApplied} off`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center border rounded">
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            handleQuantityChange(item.cart_item_id, -1)
                          }
                          disabled={quantity <= minQty}
                        >
                          −
                        </button>
                        <span className="px-3 py-1 min-w-[40px] text-center">
                          {quantity}
                        </span>
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            handleQuantityChange(item.cart_item_id, 1)
                          }
                          disabled={
                            !isActive ||
                            (stockQuantity > 0 && quantity >= stockQuantity)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span className="ml-auto font-semibold">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                    </div>
                    {!isActive && (
                      <div className="text-red-600 text-xs mt-2">
                        Out of Stock
                      </div>
                    )}
                    {isActive && stockQuantity <= 5 && stockQuantity > 0 && (
                      <div className="text-orange-600 text-xs mt-2">
                        Only {stockQuantity} left in stock
                      </div>
                    )}
                    {item.discount_quantity &&
                      quantity >= item.discount_quantity && (
                        <div className="text-green-600 text-xs mt-2">
                          Bulk discount applied!
                          {item.product.variant?.bulk_discount_quantity &&
                            quantity >=
                              item.product.variant.bulk_discount_quantity && (
                              <span className="ml-1">
                                (Bulk:{" "}
                                {item.product.variant.bulk_discount_percentage}%
                                off)
                              </span>
                            )}
                        </div>
                      )}
                    {nextDiscountMsg && (
                      <div className="text-blue-600 text-xs mt-2">
                        {nextDiscountMsg}
                      </div>
                    )}
                    {item.discount_message && (
                      <div className="text-blue-600 text-xs mt-2">
                        {item.discount_message}
                      </div>
                    )}
                    <div className="flex gap-4 mt-3">
                      <button
                        className="text-blue-600 text-sm hover:underline"
                        onClick={() => handleSaveForLater(item)}
                      >
                        Save for Later
                      </button>
                      <button
                        className="text-purple-600 text-sm hover:underline"
                        onClick={() => handleAddToWishlist(item)}
                      >
                        Add to Wishlist
                      </button>
                      <button
                        className="text-red-600 text-sm hover:underline"
                        onClick={() => handleRemove(item.cart_item_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Saved for Later ({savedForLater.length})
              </h2>
              <div className="divide-y">
                {savedForLater.map((item) => (
                  <div key={item.cart_item_id} className="flex gap-4 py-4">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.product.short_description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-semibold">
                          ₹{parseFloat(item.price_at_time).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() =>
                            setSavedForLater(
                              savedForLater.filter(
                                (savedItem) =>
                                  savedItem.cart_item_id !== item.cart_item_id
                              )
                            )
                          }
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right: Price Details & Coupon */}
        <section className="md:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Price Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">
                  -₹{discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                Estimated delivery: {estimatedDelivery}
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              PLACE ORDER
            </button>
            {discount > 0 && (
              <p className="text-green-600 text-sm mt-4">
                You will save ₹{discount.toLocaleString()} on this order
              </p>
            )}

            {/* Coupon Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Apply Coupon</h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter cart coupon code"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 bg-green-50 border border-green-200 p-2 rounded flex justify-between items-center">
                  <div>
                    <span className="text-green-700 font-medium">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Secure Info */}
          <div className="text-sm text-gray-600 mt-2 flex flex-col gap-1 items-center">
            <span>🔒 Safe & secure payments</span>
            <span>↩️ Easy returns</span>
            <span>✅ 100% Authentic products</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 text-center text-gray-500 text-sm">
        © 2023 Electronics Store. All rights reserved.
      </footer>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? Your cart items will be saved.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  // Logout logic would go here
                  setShowLogoutPopup(false);
                  // Redirect to login page or perform actual logout
                  alert("Logged out successfully");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Wishlist Confirmation Popup */}
      {showWishlistPopup && selectedItemForWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Add to Wishlist</h3>
            <div className="flex gap-3 mb-4">
              <img
                src={selectedItemForWishlist.product.mainImage}
                alt={selectedItemForWishlist.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h4 className="font-medium">
                  {selectedItemForWishlist.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedItemForWishlist.product.short_description}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Do you want to add this item to your wishlist and remove it from
              cart?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setShowWishlistPopup(false);
                  setSelectedItemForWishlist(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => {
                  // Add to wishlist logic would go here
                  handleRemove(selectedItemForWishlist.cart_item_id);
                  setShowWishlistPopup(false);
                  setSelectedItemForWishlist(null);
                  alert("Item added to wishlist!");
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart State */}
      {cartItems.length === 0 && savedForLater.length === 0 && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
