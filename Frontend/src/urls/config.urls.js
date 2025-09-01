// Auth Endpoints
export const AUTH_LOGIN_ENDPOINT = "/auth/login";
export const AUTH_SIGNUP_ENDPOINT = "/auth/register";
export const USER_FORGOT_PASSWORD_ENDPOINT = "/auth/forgot-Password";
export const RESET_PASSWORD_ENDPOINT = "/auth/reset-Password";

// User Profile & Address Endpoints
export const PROFILE_ENDPOINT = "/profile";
export const ADDRESSES_ENDPOINT = "/addresses";

// Cart Endpoints
export const CART_ENDPOINT = "/cart";
export const CART_BY_ID_ENDPOINT = "/cart/:cart_id";
export const CART_ITEM_ENDPOINT = "/cart-Item";
export const TOTAL_CART_ITEM_NUMBER_ENDPOINT = "/Cart-Item/totalCartItemNumber";
export const CART_ITEM_BY_ID_ENDPOINT = "/cart-Item/:cart_item_id";
export const CART_ITEM_FIND_OR_CREATE_ENDPOINT = "/cart-Item/findOrCreate";

// Wishlist Endpoints
export const WISHLIST_ENDPOINT = "/wishList";
export const WISHLIST_BY_ID_ENDPOINT = "/wishList/:wishlist_id";
export const WISHLIST_ITEM_ENDPOINT = "/wishList-Item";
export const WISHLIST_ITEM_BY_ID_ENDPOINT = "/wishList-Item/:wishlist_item_id";

// Order Endpoints
export const ORDER_ENDPOINT = "/order";
export const ORDER_BY_ID_ENDPOINT = "/order/:order_id";
export const ORDER_CANCEL_ENDPOINT = "/order/cancel";
export const ORDER_ITEM_ENDPOINT = "/order-Item";
export const ORDER_ITEM_ORDER_ID_ENDPOINT = "/order-Item/order";
export const ORDER_ITEM_BY_ID_ENDPOINT = "/order-Item/:order_item_id";
export const LATEST_ORDER_ENDPOINT = "/order/latest";

// Coupon Endpoints
export const COUPON_ENDPOINT = "/coupon";
export const COUPON_BY_ID_ENDPOINT = "/coupon/:coupon_id";
export const COUPON_REDEMPTION_ENDPOINT = "/coupon-Redemption";
export const USER_COUPON_ENDPOINT = "/coupon-User";
export const COUPON_USER_BY_ID_ENDPOINT = "/coupon-User/:id";

// Product Review Endpoints
export const PRODUCT_REVIEW_ENDPOINT = "/product-Reviews";

// User Dashboard
export const USER_PRODUCT_BY_ID_DETAILS_ENDPOINT = "/productById-Details-Page/product";
export const USER_DASHBOARD_DATA_ENDPOINT = "/user-Dashboard-Data";

// Category & Brand Endpoints
export const CATEGORIES_ENDPOINT = "/category";
export const CATEGORY_BY_ID_ENDPOINT = "/category/:category_id";
export const BRANDS_ENDPOINT = "/brand";
export const BRAND_BY_ID_ENDPOINT = "/brand/:brand_id";

// Product Endpoints
export const PRODUCT_ENDPOINT = "/product";
export const PRODUCT_BY_ID_ENDPOINT = "/product/:id";
export const PRODUCT_BY_CATEGORY_ENDPOINT = "/product-Catalog/product/category";
export const PRODUCT_BY_BRAND_ENDPOINT = "/product/brand";

// Product Variant Endpoints
export const PRODUCT_VARIANT_ENDPOINT = "/product-Variant";
export const PRODUCT_VARIANT_BY_ID_ENDPOINT = "/product-Variant/:id";
export const PRODUCT_VARIANT_BY_PRODUCT_ENDPOINT = "/product-Variant/product/:product_id";
export const PRODUCT_VARIANT_BY_PRODUCT_ID_ENDPOINT = "/product-Variant/product/:product_id";

// Product Attributes Endpoints
export const PRODUCT_ATTRIBUTES_ENDPOINT = "/product-Attributes";
export const PRODUCT_ATTRIBUTES_BY_ID_ENDPOINT = "/product-Attributes/:id";
export const PRODUCT_ATTRIBUTES_VALUES_ENDPOINT = "/product-Attributes-Values";
export const PRODUCT_ATTRIBUTES_VALUES_BY_ID_ENDPOINT = "/product-Attributes-Values/:id";
export const PRODUCT_VARIANT_ATTRIBUTE_VALUES_ENDPOINT = "/product-Variant-Attribute-Values";
export const PRODUCT_VARIANT_ATTRIBUTE_VALUES_BY_ID_ENDPOINT = "/product-Variant-Attribute-Values/:id";

// Product Media Endpoints
export const PRODUCT_MEDIA_ENDPOINT = "/product-Media";
export const PRODUCT_MEDIA_BY_ID_ENDPOINT = "/product-Media/:id";
export const PRODUCT_MEDIA_BY_PRODUCT_ENDPOINT = "/product-Media/product/:productId";
export const PRODUCT_MEDIA_URL_ENDPOINT = "/product-Media-Url";
export const PRODUCT_MEDIA_URL_BY_ID_ENDPOINT = "/product-Media-Url/:id";

// Admin Panel Endpoints
export const USER_ENDPOINT = "/users";
export const CUSTOMER_ENDPOINT = "/users/all-Customers";
export const RETAILER_ENDPOINT = "/users/all-Retailers";
export const ADMIN_DASHBOARD_DATA_ENDPOINT = "/admin-Dashboard-Data";
export const PRODUCT_MANAGMENT_DASHBOARD_DATA_ENDPOINT = "/product-Management-Dashboard-Data";
export const USER_MANAGMENT_DASHBOARD_DATA_ENDPOINT = "/users-Management-Dashboard-Data";
export const USER_MANAGMENT_DASHBOARD_USER_ORDERS_DATA_ENDPOINT = "/users-Management-Dashboard-Data/users-Orders-Data";

// Review Management Endpoints
export const REVIEW_MANAGMENT_DASHBOARD_DATA_ENDPOINT = "/product-Reviews";
export const REVIEW_CHANGE_STATUS_ENDPOINT = "/product-Reviews/change-Status";
export const DELETE_REVIEW_BY_PRODUCT_REVIEW_ID_ENDPOINT = "/product-Reviews";
export const UPDATE_PRODUCT_REVIEW_BY_ID_ENDPOINT = "/product-Reviews";
export const REVIEW_MANAGMENT_ANALYTICS_DASHBOARD_DATA_ENDPOINT = "/product-Reviews/analytics";

// Coupon & Offers Dashboard Endpoints
export const COUPON_AND_OFFERS_DASHBOARD_DATA_ENDPOINT = "/coupon";
export const COUPON_AND_OFFERS_DASHBOARD_CHANGE_COUPON_STATUS_ENDPOINT = "/coupon/change-Status";
export const COUPON_AND_OFFERS_DASHBOARD_ANALYTICS_DATA_ENDPOINT = "/coupon/analytics";

// Admin Product Catalog Endpoints
export const ADMIN_PRODUCT_CATALOG_BY_CATEGORY_AND_BRAND_ID_ENDPOINT = "/product/category/:category_id/brand/:brand_id";

// Admin Reports & Analytics Endpoints
export const ADMIN_REPORT_ANALYTICS_DASHBOARD_DATA_ENDPOINT = "/reports-Analytics-Dashboard-Data/dashboard";
export const ADMIN_REPORT_ANALYTICS_PRODUCTS_DATA_ENDPOINT = "/reports-Analytics-Dashboard-Data/products";
export const ADMIN_REPORT_ANALYTICS_COUPONS_DATA_ENDPOINT = "/reports-Analytics-Dashboard-Data/coupons";

// Banner Endpoints
export const ADMIN_BANNER_ENDPOINT = "/banners";
export const USER_BANNER_ENDPOINT = "/banners/active";

// User Management Endpoints
export const USER_BY_ID_ENDPOINT = "/user/:id";
export const DISCOUNT_RULE_ENDPOINT = "/discount-Rule";
export const DISCOUNT_RULE_BY_ID_ENDPOINT = "/discount-Rule/:id";
export const STOCK_ALERT_ENDPOINT = "/stock-Alert";
export const STOCK_ALERT_BY_ID_ENDPOINT = "/stock-Alert/:alert_id";
export const REVIEW_ENDPOINT = "/review";
export const REVIEW_BY_ID_ENDPOINT = "/review/:review_id";

// Stock Management Endpoints
export const STOCK_MANAGEMENT_VARIANTS_ENDPOINT = "/stock-management/stock-variants";
export const STOCK_MANAGEMENT_VARIANT_BY_ID_ENDPOINT = "/stock-management/stock-variants/:variant_id";
export const STOCK_MANAGEMENT_ANALYTICS_ENDPOINT = "/stock-management/stock-analytics";

// Notification Endpoints for Admin Panel
export const ADMIN_NOTIFICATION_ENDPOINT = "/notifications";
export const ADMIN_NOTIFICATION_ADD_ENDPOINT = "/notifications/add-Notification";
export const ADMIN_NOTIFICATION_LOGS_ENDPOINT = "/notifications/logs";
export const ADMIN_NOTIFICATION_STATS_ENDPOINT = "/notifications/stats";
export const ADMIN_NOTIFICATION_TEMPLATES_ENDPOINT = "/notifications/templates";

// Notification Endpoints for Users
export const USER_NOTIFICATION_ENDPOINT = "/notifications";
export const USER_TOTAL_NUMBER_OF_UNREAD_NOTIFICATIONS_ENDPOINT = "/notifications/total-Number-Of-Un-Read-Notifications";