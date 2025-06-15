import { useState, useRef, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";

const BuyNowPage = () => {
  // Get product ID from URL parameters
  const { productId } = useParams();

  const [productData, setProductData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isRightScrollAtEnd, setIsRightScrollAtEnd] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);

  // New state for Stock Alerts and Personalized Coupons
  const [stockAlertEmail, setStockAlertEmail] = useState("");
  const [stockAlertPhone, setStockAlertPhone] = useState("");
  const [showStockAlertForm, setShowStockAlertForm] = useState(false);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [showPersonalizedOffers, setShowPersonalizedOffers] = useState(true);

  const rightScrollRef = useRef(null);
  const leftScrollRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    // Show alert with product ID when component loads
    if (productId) {
      alert(
        `🛍️ Product Details Page Loaded!\n\nProduct ID: ${productId}\n\nThis product will be displayed with all its details.`
      );
      console.log("🛍️ BuyNowPage loaded for Product ID:", productId);
    }

    const mockApiResponse = {
      mainProduct: {
        // Product Model Fields
        product_id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Premium Wireless Bluetooth Neckband - Pro Series",
        slug: "premium-wireless-bluetooth-neckband-pro-series",
        description:
          "Experience premium audio quality with our latest Bluetooth neckband featuring advanced noise cancellation, 48-hour battery life, and IPX5 water resistance. Perfect for music lovers and professionals who demand the best in wireless audio technology.",
        short_description:
          "Premium Bluetooth neckband with 48hr battery, noise cancellation & IPX5 rating",
        base_price: 2999.0,
        rating_average: 4.3,
        rating_count: 1247,
        is_active: true,
        is_featured: true,

        // Brand Information
        brand: {
          brand_id: "550e8400-e29b-41d4-a716-446655440010",
          name: "AudioTech Pro",
          slug: "audiotech-pro",
        },

        // Category Information
        category: {
          category_id: "550e8400-e29b-41d4-a716-446655440020",
          name: "Audio & Headphones",
          slug: "audio-headphones",
          target_role: "both",
        },

        // Product Media with URLs
        media: [
          {
            product_media_id: "550e8400-e29b-41d4-a716-446655440030",
            media_type: "image",
            urls: [
              {
                product_media_url_id: "550e8400-e29b-41d4-a716-446655440031",
                product_media_url:
                  "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
                media_type: "image",
              },
            ],
          },
          {
            product_media_id: "550e8400-e29b-41d4-a716-446655440032",
            media_type: "image",
            urls: [
              {
                product_media_url_id: "550e8400-e29b-41d4-a716-446655440033",
                product_media_url:
                  "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
                media_type: "image",
              },
            ],
          },
          {
            product_media_id: "550e8400-e29b-41d4-a716-446655440034",
            media_type: "video",
            urls: [
              {
                product_media_url_id: "550e8400-e29b-41d4-a716-446655440035",
                product_media_url:
                  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                media_type: "video",
              },
            ],
          },
        ],

        // Product Level Attributes (not variant specific)
        attributes: [
          {
            product_attribute_id: "550e8400-e29b-41d4-a716-446655440040",
            name: "Brand",
            data_type: "string",
            is_variant_level: false,
            value: "AudioTech Pro",
          },
          {
            product_attribute_id: "550e8400-e29b-41d4-a716-446655440041",
            name: "Warranty Period",
            data_type: "string",
            is_variant_level: false,
            value: "1 Year Manufacturer Warranty",
          },
          {
            product_attribute_id: "550e8400-e29b-41d4-a716-446655440042",
            name: "Water Resistance",
            data_type: "string",
            is_variant_level: false,
            value: "IPX5",
          },
        ],

        // Product Variants with comprehensive data
        variants: [
          {
            product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
            description: "Standard variant with essential features",
            short_description: "Standard - Essential features",
            price: 1999.0,
            stock_quantity: 45,
            sku: "ATP-NBP-STD-001",
            base_variant_image_url:
              "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
            discount_quantity: 5,
            discount_percentage: 10.0,
            min_retailer_quantity: 20,
            bulk_discount_quantity: 50,
            bulk_discount_percentage: 15.0,

            // Variant-specific attributes
            variantAttributes: [
              {
                variant_attribute_value_id:
                  "550e8400-e29b-41d4-a716-446655440051",
                attribute: {
                  product_attribute_id: "550e8400-e29b-41d4-a716-446655440052",
                  name: "Color",
                  data_type: "enum",
                  is_variant_level: true,
                },
                attributeValue: {
                  product_attribute_value_id:
                    "550e8400-e29b-41d4-a716-446655440053",
                  value: "Midnight Black",
                },
              },
              {
                variant_attribute_value_id:
                  "550e8400-e29b-41d4-a716-446655440054",
                attribute: {
                  product_attribute_id: "550e8400-e29b-41d4-a716-446655440055",
                  name: "Battery Life",
                  data_type: "string",
                  is_variant_level: true,
                },
                attributeValue: {
                  product_attribute_value_id:
                    "550e8400-e29b-41d4-a716-446655440056",
                  value: "24 Hours",
                },
              },
            ],
          },
          {
            product_variant_id: "550e8400-e29b-41d4-a716-446655440060",
            description: "Pro variant with advanced noise cancellation",
            short_description: "Pro - Advanced features",
            price: 2999.0,
            stock_quantity: 32,
            sku: "ATP-NBP-PRO-001",
            base_variant_image_url:
              "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
            discount_quantity: 3,
            discount_percentage: 15.0,
            min_retailer_quantity: 15,
            bulk_discount_quantity: 30,
            bulk_discount_percentage: 20.0,

            variantAttributes: [
              {
                variant_attribute_value_id:
                  "550e8400-e29b-41d4-a716-446655440061",
                attribute: {
                  product_attribute_id: "550e8400-e29b-41d4-a716-446655440052",
                  name: "Color",
                  data_type: "enum",
                  is_variant_level: true,
                },
                attributeValue: {
                  product_attribute_value_id:
                    "550e8400-e29b-41d4-a716-446655440062",
                  value: "Ocean Blue",
                },
              },
            ],
          },
          {
            product_variant_id: "550e8400-e29b-41d4-a716-446655440070",
            description:
              "Pro+ variant with premium features and extended warranty",
            short_description: "Pro+ - Premium features",
            price: 3999.0,
            stock_quantity: 18,
            sku: "ATP-NBP-PROPLUS-001",
            base_variant_image_url:
              "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Pro+",
            discount_quantity: 2,
            discount_percentage: 20.0,
            min_retailer_quantity: 10,
            bulk_discount_quantity: 20,
            bulk_discount_percentage: 25.0,

            variantAttributes: [
              {
                variant_attribute_value_id:
                  "550e8400-e29b-41d4-a716-446655440071",
                attribute: {
                  product_attribute_id: "550e8400-e29b-41d4-a716-446655440052",
                  name: "Color",
                  data_type: "enum",
                  is_variant_level: true,
                },
                attributeValue: {
                  product_attribute_value_id:
                    "550e8400-e29b-41d4-a716-446655440072",
                  value: "Crimson Red",
                },
              },
            ],
          },
        ],

        // Enhanced Product Reviews with complete model data
        reviews: [
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440080",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
            user_id: "550e8400-e29b-41d4-a716-446655440081",
            rating: 5,
            title: "Outstanding audio quality and battery life!",
            review:
              "I've been using this neckband for 3 months now and I'm thoroughly impressed. The sound quality is crystal clear with deep bass. Battery easily lasts 2 days with moderate usage. The noise cancellation works great during calls. Highly recommend for anyone looking for reliable wireless audio.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440081",
            updated_by: null,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440081",
              name: "Rajesh Kumar",
              profileImage_url:
                "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=RK",
              verified_buyer: true,
              totalReviews: 23,
              helpfulVotes: 156,
            },
            variant: "Standard",
            helpfulCount: 45,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440082",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440060",
            user_id: "550e8400-e29b-41d4-a716-446655440083",
            rating: 4,
            title: "Great value for money, minor connectivity issues",
            review:
              "Overall a solid product. Sound quality is good and the design is comfortable for long usage. Had some connectivity issues initially but they resolved after firmware update. The Pro variant has better noise cancellation than expected. Would buy again.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440083",
            updated_by: null,
            createdAt: "2024-01-10T14:20:00Z",
            updatedAt: "2024-01-10T14:20:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440083",
              name: "Priya Sharma",
              profileImage_url:
                "https://via.placeholder.com/40x40/EC4899/FFFFFF?text=PS",
              verified_buyer: true,
              totalReviews: 8,
              helpfulVotes: 67,
            },
            variant: "Pro",
            helpfulCount: 32,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440084",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440070",
            user_id: "550e8400-e29b-41d4-a716-446655440085",
            rating: 3,
            title: "Average performance, expected more from Pro+",
            review:
              "The Pro+ variant is decent but I expected more premium features for the price. Bass response could be better. Build quality is good though. Delivery was fast and packaging was excellent.",
            is_verified_purchase: false,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440085",
            updated_by: null,
            createdAt: "2024-01-05T09:15:00Z",
            updatedAt: "2024-01-05T09:15:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440085",
              name: "Amit Patel",
              profileImage_url:
                "https://via.placeholder.com/40x40/10B981/FFFFFF?text=AP",
              verified_buyer: false,
              totalReviews: 3,
              helpfulVotes: 12,
            },
            variant: "Pro+",
            helpfulCount: 18,
            reportCount: 1,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440086",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
            user_id: "550e8400-e29b-41d4-a716-446655440087",
            rating: 5,
            title: "Perfect for workouts and daily commute",
            review:
              "Been using this for my daily gym sessions and office commute. Sweat resistant and stays in place during workouts. Call quality is excellent. The magnetic earbuds feature is very convenient. Definitely worth the investment!",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440087",
            updated_by: null,
            createdAt: "2024-01-20T16:45:00Z",
            updatedAt: "2024-01-20T16:45:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440087",
              name: "Sneha Reddy",
              profileImage_url:
                "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=SR",
              verified_buyer: true,
              totalReviews: 15,
              helpfulVotes: 89,
            },
            variant: "Standard",
            helpfulCount: 67,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440088",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440060",
            user_id: "550e8400-e29b-41d4-a716-446655440089",
            rating: 4,
            title: "Impressive noise cancellation",
            review:
              "The active noise cancellation on the Pro variant is really impressive. Blocks out most of the ambient noise during flights. Battery life is as advertised. Only complaint is the charging cable could be longer.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440089",
            updated_by: null,
            createdAt: "2024-01-18T11:30:00Z",
            updatedAt: "2024-01-18T11:30:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440089",
              name: "Vikram Singh",
              profileImage_url:
                "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=VS",
              verified_buyer: true,
              totalReviews: 31,
              helpfulVotes: 234,
            },
            variant: "Pro",
            helpfulCount: 89,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440090",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440070",
            user_id: "550e8400-e29b-41d4-a716-446655440091",
            rating: 2,
            title: "Disappointed with Pro+ features",
            review:
              "Expected much more from the Pro+ variant. The premium features don't justify the price difference. Sound quality is good but not exceptional. Customer service was helpful though.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440091",
            updated_by: null,
            createdAt: "2024-01-12T08:20:00Z",
            updatedAt: "2024-01-12T08:20:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440091",
              name: "Rohit Gupta",
              profileImage_url:
                "https://via.placeholder.com/40x40/EF4444/FFFFFF?text=RG",
              verified_buyer: true,
              totalReviews: 7,
              helpfulVotes: 23,
            },
            variant: "Pro+",
            helpfulCount: 34,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440092",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
            user_id: "550e8400-e29b-41d4-a716-446655440093",
            rating: 5,
            title: "Excellent build quality and comfort",
            review:
              "The build quality is top-notch. Very comfortable to wear for extended periods. The magnetic earbuds are a nice touch. Fast charging works great - 15 minutes gives hours of playback. Highly satisfied with the purchase.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440093",
            updated_by: null,
            createdAt: "2024-01-22T19:15:00Z",
            updatedAt: "2024-01-22T19:15:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440093",
              name: "Kavya Nair",
              profileImage_url:
                "https://via.placeholder.com/40x40/06B6D4/FFFFFF?text=KN",
              verified_buyer: true,
              totalReviews: 12,
              helpfulVotes: 78,
            },
            variant: "Standard",
            helpfulCount: 56,
            reportCount: 0,
          },
          {
            product_review_id: "550e8400-e29b-41d4-a716-446655440094",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440060",
            user_id: "550e8400-e29b-41d4-a716-446655440095",
            rating: 4,
            title: "Good for the price range",
            review:
              "Solid performance in this price range. The Pro variant offers good value. Bluetooth connectivity is stable. Would recommend to friends and family. Packaging was premium and delivery was on time.",
            is_verified_purchase: true,
            review_action: "approve",
            created_by: "550e8400-e29b-41d4-a716-446655440095",
            updated_by: null,
            createdAt: "2024-01-08T13:45:00Z",
            updatedAt: "2024-01-08T13:45:00Z",
            user: {
              user_id: "550e8400-e29b-41d4-a716-446655440095",
              name: "Arjun Mehta",
              profileImage_url:
                "https://via.placeholder.com/40x40/84CC16/FFFFFF?text=AM",
              verified_buyer: true,
              totalReviews: 19,
              helpfulVotes: 134,
            },
            variant: "Pro",
            helpfulCount: 43,
            reportCount: 0,
          },
        ],

        // Available Coupons
        coupons: [
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440090",
            code: "WELCOME20",
            description: "Welcome discount for new users",
            type: "percentage",
            discount_value: 20.0,
            target_type: "cart",
            target_role: "customer",
            min_cart_value: 1000.0,
            max_discount_value: 500.0,
            usage_limit: 1000,
            usage_per_user: 1,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-12-31T23:59:59Z",
            is_active: true,
            is_user_new: true,
          },
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440091",
            code: "AUDIO50",
            description: "Fixed discount on audio products",
            type: "fixed",
            discount_value: 50.0,
            target_type: "category",
            target_role: "both",
            min_cart_value: 500.0,
            max_discount_value: null,
            usage_limit: 500,
            usage_per_user: 3,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-06-30T23:59:59Z",
            is_active: true,
            is_user_new: false,
            category_id: "550e8400-e29b-41d4-a716-446655440020",
          },
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440092",
            code: "BULK15",
            description: "Bulk purchase discount",
            type: "percentage",
            discount_value: 15.0,
            target_type: "product",
            target_role: "retailer",
            min_cart_value: 5000.0,
            max_discount_value: 1000.0,
            usage_limit: 100,
            usage_per_user: 5,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-12-31T23:59:59Z",
            is_active: true,
            is_user_new: false,
            product_id: "550e8400-e29b-41d4-a716-446655440001",
          },
        ],

        // Discount Rules
        discountRules: [
          {
            discount_rule_id: "550e8400-e29b-41d4-a716-446655440100",
            rule_type: "bulk",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            min_retailer_quantity: 50,
            bulk_discount_quantity: 100,
            bulk_discount_percentage: 25.0,
            discount_quantity: null,
            discount_percentage: null,
            is_active: true,
          },
          {
            discount_rule_id: "550e8400-e29b-41d4-a716-446655440101",
            rule_type: "quantity",
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            min_retailer_quantity: null,
            bulk_discount_quantity: null,
            bulk_discount_percentage: null,
            discount_quantity: 5,
            discount_percentage: 10.0,
            is_active: true,
          },
        ],

        // Stock Alerts with enhanced data
        stockAlerts: [
          {
            stock_alert_id: "550e8400-e29b-41d4-a716-446655440110",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440070",
            stock_level: 5,
            status: "pending",
            alert_threshold: 10,
            message: "Only 5 left in stock!",
            urgency: "high",
          },
          {
            stock_alert_id: "550e8400-e29b-41d4-a716-446655440111",
            product_id: "550e8400-e29b-41d4-a716-446655440001",
            product_variant_id: "550e8400-e29b-41d4-a716-446655440060",
            stock_level: 15,
            status: "active",
            alert_threshold: 20,
            message: "Limited stock - 15 units remaining",
            urgency: "medium",
          },
        ],

        // Personalized Coupons for User
        personalizedCoupons: [
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440200",
            code: "FIRSTBUY15",
            description: "First time buyer special discount",
            type: "percentage",
            discount_value: 15.0,
            target_type: "cart",
            min_cart_value: 999.0,
            max_discount_value: 300.0,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-12-31T23:59:59Z",
            is_active: true,
            is_user_specific: true,
            user_eligibility: "new_user",
            usage_per_user: 1,
            personalization_reason: "Welcome offer for new customers",
            applicable: true,
            savings_amount: 299.85, // calculated based on current cart
          },
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440201",
            code: "BIRTHDAY25",
            description: "Birthday month special - 25% off",
            type: "percentage",
            discount_value: 25.0,
            target_type: "cart",
            min_cart_value: 1500.0,
            max_discount_value: 500.0,
            valid_from: "2024-06-01T00:00:00Z",
            valid_to: "2024-06-30T23:59:59Z",
            is_active: true,
            is_user_specific: true,
            user_eligibility: "birthday_month",
            usage_per_user: 1,
            personalization_reason: "Special birthday month offer",
            applicable: false,
            savings_amount: 499.75,
            availability_note: "Available in your birthday month (June)",
          },
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440202",
            code: "LOYALTY10",
            description: "Loyal customer appreciation discount",
            type: "percentage",
            discount_value: 10.0,
            target_type: "product",
            min_cart_value: 500.0,
            max_discount_value: 200.0,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-12-31T23:59:59Z",
            is_active: true,
            is_user_specific: true,
            user_eligibility: "returning_customer",
            usage_per_user: 3,
            personalization_reason: "Thank you for being a loyal customer",
            applicable: true,
            savings_amount: 199.9,
            usage_count: 1, // user has used this 1 time out of 3
          },
          {
            coupon_id: "550e8400-e29b-41d4-a716-446655440203",
            code: "CART500",
            description: "₹500 off on orders above ₹3000",
            type: "fixed",
            discount_value: 500.0,
            target_type: "cart",
            min_cart_value: 3000.0,
            max_discount_value: null,
            valid_from: "2024-01-01T00:00:00Z",
            valid_to: "2024-12-31T23:59:59Z",
            is_active: true,
            is_user_specific: true,
            user_eligibility: "high_value_customer",
            usage_per_user: 2,
            personalization_reason: "Exclusive offer for high-value customers",
            applicable: false,
            savings_amount: 500.0,
            availability_note: "Add ₹1,001 more to unlock this offer",
          },
        ],

        // Stock Alert Preferences for User
        stockAlertPreferences: {
          email_notifications: true,
          sms_notifications: false,
          in_app_notifications: true,
          price_drop_alerts: true,
          back_in_stock_alerts: true,
          low_stock_warnings: true,
        },

        // Wishlist and Cart Information
        wishlistInfo: {
          wishlist_id: "550e8400-e29b-41d4-a716-446655440120",
          user_id: "550e8400-e29b-41d4-a716-446655440121",
          items: [
            {
              wish_list_item_id: "550e8400-e29b-41d4-a716-446655440122",
              product_id: "550e8400-e29b-41d4-a716-446655440001",
              product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
              createdAt: "2024-01-20T10:00:00Z",
            },
          ],
        },

        cartInfo: {
          cart_id: "550e8400-e29b-41d4-a716-446655440130",
          user_id: "550e8400-e29b-41d4-a716-446655440121",
          items: [
            {
              cart_item_id: "550e8400-e29b-41d4-a716-446655440131",
              product_id: "550e8400-e29b-41d4-a716-446655440001",
              product_variant_id: "550e8400-e29b-41d4-a716-446655440050",
              total_quantity: 2,
              discount_quantity: 0,
              price_at_time: 1999.0,
              discount_applied: 0.0,
              final_price: 3998.0,
              createdAt: "2024-01-22T15:30:00Z",
            },
          ],
        },

        // Legacy format for UI compatibility - Only fields used in UI
        title: "Premium Wireless Bluetooth Neckband - Pro Series",
        rating: "4.3",
        reviews: "1,247 Ratings & 156 Reviews",
        price: "₹1,999",
        originalPrice: "₹2,999",
        discount: "33% off",
        mainImage:
          "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
        thumbnails: [
          "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
          "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
          "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Pro+",
          "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Audio",
          "https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Tech",
        ],
        variantNames: ["Standard", "Pro", "Pro+"],
        description: [
          "Experience premium audio quality with our latest Bluetooth neckband featuring advanced noise cancellation technology.",
          "Designed for music lovers and professionals who demand the best in wireless audio technology.",
          "Features 48-hour battery life, IPX5 water resistance, and crystal-clear sound quality.",
          "Compatible with all Bluetooth-enabled devices and supports multiple codec formats.",
        ],
      },
      relatedProducts: [
        {
          product_id: "550e8400-e29b-41d4-a716-446655440200",
          name: "AudioTech Pro Wireless Earbuds",
          slug: "audiotech-pro-wireless-earbuds",
          base_price: 1999.0,
          rating_average: 4.1,
          rating_count: 892,
          is_featured: true,
          brand: {
            brand_id: "550e8400-e29b-41d4-a716-446655440010",
            name: "AudioTech Pro",
          },
          category: {
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            name: "Audio & Headphones",
          },
          mainImage:
            "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
          // Legacy format for UI
          id: 1,
          title: "AudioTech Pro Wireless Earbuds",
          price: "₹1,999",
          image:
            "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
        },
        {
          product_id: "550e8400-e29b-41d4-a716-446655440201",
          name: "AudioTech Pro Bluetooth Headphones",
          slug: "audiotech-pro-bluetooth-headphones",
          base_price: 2499.0,
          rating_average: 4.5,
          rating_count: 1156,
          is_featured: false,
          brand: {
            brand_id: "550e8400-e29b-41d4-a716-446655440010",
            name: "AudioTech Pro",
          },
          category: {
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            name: "Audio & Headphones",
          },
          mainImage:
            "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
          // Legacy format for UI
          id: 2,
          title: "AudioTech Pro Bluetooth Headphones",
          price: "₹2,499",
          image:
            "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
        },
        {
          product_id: "550e8400-e29b-41d4-a716-446655440202",
          name: "Premium Noise Cancelling Headset",
          slug: "premium-noise-cancelling-headset",
          base_price: 3999.0,
          rating_average: 4.7,
          rating_count: 743,
          is_featured: true,
          brand: {
            brand_id: "550e8400-e29b-41d4-a716-446655440011",
            name: "SoundMax",
          },
          category: {
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            name: "Audio & Headphones",
          },
          mainImage:
            "https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headset",
          // Legacy format for UI
          id: 3,
          title: "Premium Noise Cancelling Headset",
          price: "₹3,999",
          image:
            "https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headset",
        },
        {
          product_id: "550e8400-e29b-41d4-a716-446655440203",
          name: "Bass Boost Wired Earphones",
          slug: "bass-boost-wired-earphones",
          base_price: 1599.0,
          rating_average: 3.9,
          rating_count: 567,
          is_featured: false,
          brand: {
            brand_id: "550e8400-e29b-41d4-a716-446655440012",
            name: "BassLine",
          },
          category: {
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            name: "Audio & Headphones",
          },
          mainImage:
            "https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Bass",
          // Legacy format for UI
          id: 4,
          title: "Bass Boost Wired Earphones",
          price: "₹1,599",
          image: "https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Bass",
        },
        {
          product_id: "550e8400-e29b-41d4-a716-446655440204",
          name: "Premium Sports Neckband",
          slug: "premium-sports-neckband",
          base_price: 2299.0,
          rating_average: 4.2,
          rating_count: 423,
          is_featured: false,
          brand: {
            brand_id: "550e8400-e29b-41d4-a716-446655440013",
            name: "SportAudio",
          },
          category: {
            category_id: "550e8400-e29b-41d4-a716-446655440020",
            name: "Audio & Headphones",
          },
          mainImage:
            "https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Sport",
          // Legacy format for UI
          id: 5,
          title: "Premium Sports Neckband",
          price: "₹2,299",
          image: "https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Sport",
        },
      ],
    };

    setProductData(mockApiResponse);
    setCurrentImage(mockApiResponse.mainProduct.mainImage);
  }, [productId]); // Re-run when productId changes

  useEffect(() => {
    if (productData && productData.mainProduct) {
      setSelectedVariant(productData.mainProduct.variantNames?.[0] || "");
    }
  }, [productData]);

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

  if (!productData) {
    return <div>Loading...</div>;
  }

  const { mainProduct, relatedProducts } = productData;

  return (
    <div className="min-h-screen bg-gray-100">
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

          {/* Main Image Container - Responsive height */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col sm:flex-row h-[300px] sm:h-[360px] lg:h-[400px]">
            {/* Thumbnails Row/Column - Responsive layout */}
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden no-scrollbar w-full sm:w-[60px] h-[60px] sm:h-full border-b sm:border-b-0 sm:border-r border-gray-200">
              {mainProduct.thumbnails.slice(0, 6).map((thumbnail, index) => (
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
                    setCurrentImage(thumbnail);
                  }}
                  onClick={() => setCurrentImage(thumbnail)}
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
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-contain hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Image Area with Magnifier */}
            <div
              ref={imageContainerRef}
              className="flex-grow flex items-center justify-center p-4 bg-white relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={currentImage || mainProduct.mainImage}
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
                  currentImage || mainProduct.mainImage
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
                backgroundPosition: `${bgPosXPercent}% ${bgPosYPercent}%`,
              }}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base">
              ADD TO CART
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base">
              BUY NOW
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
            {mainProduct.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
              {mainProduct.rating} ★
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              {mainProduct.reviews}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {mainProduct.price}
            </span>
            <span className="text-gray-500 line-through ml-2 text-sm sm:text-base">
              {mainProduct.originalPrice}
            </span>
            <span className="text-green-600 ml-2 text-sm sm:text-base">
              {mainProduct.discount}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-sm sm:text-base">Variant</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {mainProduct.variantNames &&
              Array.isArray(mainProduct.variantNames) &&
              mainProduct.variantNames.length > 0 ? (
                mainProduct.variantNames.map((variant, index) => {
                  const variantData = mainProduct.variants[index];
                  return (
                    <button
                      key={variant}
                      className={`px-3 sm:px-4 py-2 border rounded-md text-xs sm:text-sm font-medium ${
                        selectedVariant === variant
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      } transition-colors`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="text-center">
                        <div>{variant}</div>
                        <div className="text-xs opacity-75">
                          ₹{variantData?.price}
                        </div>
                        <div className="text-xs opacity-75">
                          Stock: {variantData?.stock_quantity}
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
            {selectedVariant &&
              mainProduct.variantNames &&
              mainProduct.variants && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  {(() => {
                    const selectedIndex =
                      mainProduct.variantNames.indexOf(selectedVariant);
                    const variantData = mainProduct.variants[selectedIndex];
                    if (!variantData) return null;

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Price:</span>
                          <span>₹{variantData.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Stock:</span>
                          <span
                            className={
                              variantData.stock_quantity > 10
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {variantData.stock_quantity} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">SKU:</span>
                          <span className="text-gray-600">
                            {variantData.sku}
                          </span>
                        </div>
                        {variantData.discount_percentage > 0 && (
                          <div className="flex justify-between">
                            <span className="font-medium">Bulk Discount:</span>
                            <span className="text-green-600">
                              {variantData.discount_percentage}% off on{" "}
                              {variantData.discount_quantity}+ units
                            </span>
                          </div>
                        )}
                        {/* Display variant attributes */}
                        {variantData.variantAttributes &&
                          variantData.variantAttributes.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium">
                                Specifications:
                              </span>
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

          <div className="mt-4">
            <h3 className="font-semibold">Product Description</h3>
            {mainProduct.description.map((line, index) => (
              <p key={index} className="text-sm mt-2">
                {line}
              </p>
            ))}
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
                          {coupon.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          Min. order: ₹{coupon.min_cart_value} | Valid till:{" "}
                          {new Date(coupon.valid_to).toLocaleDateString()} |
                          Usage limit: {coupon.usage_per_user} per user
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

          {/* Stock Information */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Stock Information</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {mainProduct.variants &&
              Array.isArray(mainProduct.variants) &&
              mainProduct.variants.length > 0 ? (
                mainProduct.variants.map((variant, index) => (
                  <div
                    key={variant.product_variant_id}
                    className="border border-gray-200 p-3 rounded-lg"
                  >
                    <h4 className="font-medium">
                      {mainProduct.variantNames[index]}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span
                          className={
                            variant.stock_quantity > 10
                              ? "text-green-600"
                              : "text-orange-600"
                          }
                        >
                          {variant.stock_quantity} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span>₹{variant.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SKU:</span>
                        <span className="text-gray-600">{variant.sku}</span>
                      </div>
                      {variant.bulk_discount_percentage > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          Bulk: {variant.bulk_discount_percentage}% off on{" "}
                          {variant.bulk_discount_quantity}+ units
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No variant information available.
                </p>
              )}
            </div>
          </div>

          {/* Stock Alerts Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">📦 Stock Alerts</h3>
            <div className="mt-3 space-y-3">
              {/* Display current stock warnings */}
              {mainProduct.stockAlerts &&
              Array.isArray(mainProduct.stockAlerts) &&
              mainProduct.stockAlerts.length > 0 ? (
                mainProduct.stockAlerts.map((alert) => {
                  const variant = mainProduct.variants.find(
                    (v) => v.product_variant_id === alert.product_variant_id
                  );
                  const variantName = variant
                    ? mainProduct.variantNames[
                        mainProduct.variants.indexOf(variant)
                      ]
                    : "Unknown";

                  return (
                    <div
                      key={alert.stock_alert_id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.urgency === "high"
                          ? "bg-red-50 border-red-400 text-red-800"
                          : "bg-orange-50 border-orange-400 text-orange-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {alert.urgency === "high" ? "🚨" : "⚠️"}{" "}
                            {alert.message}
                          </p>
                          <p className="text-sm opacity-75">
                            Variant: {variantName} | Stock Level:{" "}
                            {alert.stock_level} units
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setShowStockAlertForm(!showStockAlertForm)
                          }
                          className="bg-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          Get Notified
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg">
                  <p className="text-green-800">
                    ✅ All variants are well stocked!
                  </p>
                </div>
              )}

              {/* Stock Alert Subscription Form */}
              {showStockAlertForm && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">🔔 Get Stock Alerts</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={stockAlertEmail}
                        onChange={(e) => setStockAlertEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={stockAlertPhone}
                        onChange={(e) => setStockAlertPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Alert Preferences */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Alert Preferences:
                      </p>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm">Back in stock alerts</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm">Low stock warnings</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">
                            Price drop notifications
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          alert(
                            `Stock alerts enabled for ${
                              stockAlertEmail || "your account"
                            }!`
                          );
                          setShowStockAlertForm(false);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Enable Alerts
                      </button>
                      <button
                        onClick={() => setShowStockAlertForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
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
                            {coupon.description}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {coupon.personalization_reason}
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
                  mainProduct.reviews.map((review) => (
                    <div
                      key={review.product_review_id}
                      className="flex-shrink-0 w-72 sm:w-80 lg:w-96 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Review Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <img
                          src={review.user.profileImage_url}
                          alt={review.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {review.user.name}
                            </h4>
                            {review.is_verified_purchase && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{review.user.totalReviews} reviews</span>
                            <span>•</span>
                            <span>
                              {review.user.helpfulVotes} helpful votes
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
                          {review.variant}
                        </span>
                      </div>

                      {/* Review Title */}
                      <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {review.title}
                      </h5>

                      {/* Review Content */}
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                        {review.review}
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
                  ))
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
                    {["Standard", "Pro", "Pro+"].map((variant) => {
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
