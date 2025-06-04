// Shared data and utilities for Analytics Dashboard components

// Enhanced Data with different time periods
export const generateTimelineData = () => {
  const today = new Date("2025-05-02");
  const data = {
    daily: [],
    weekly: [],
    monthly: [],
  };

  // Generate daily data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.daily.push({
      date: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      totalSales: Math.floor(Math.random() * 50) + 10,
      productA: Math.floor(Math.random() * 20) + 5,
      productB: Math.floor(Math.random() * 15) + 3,
    });
  }

  // Generate weekly data for the last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i * 7);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    data.weekly.push({
      date: weekStart.toISOString().split("T")[0],
      label: `Week ${12 - i}`,
      totalSales: Math.floor(Math.random() * 200) + 50,
      productA: Math.floor(Math.random() * 80) + 20,
      productB: Math.floor(Math.random() * 60) + 15,
    });
  }

  // Generate monthly data for the last 24 months
  const monthlyData = [
    { month: "Jan 2022", totalSales: 5, productA: 2, productB: 1 },
    { month: "Apr 2022", totalSales: 8, productA: 3, productB: 2 },
    { month: "Jul 2022", totalSales: 12, productA: 5, productB: 3 },
    { month: "Oct 2022", totalSales: 15, productA: 6, productB: 4 },
    { month: "Jan 2023", totalSales: 18, productA: 7, productB: 5 },
    { month: "Apr 2023", totalSales: 22, productA: 9, productB: 6 },
    { month: "Jul 2023", totalSales: 25, productA: 10, productB: 7 },
    { month: "Oct 2023", totalSales: 28, productA: 12, productB: 8 },
    { month: "Jan 2024", totalSales: 32, productA: 14, productB: 9 },
    { month: "Apr 2024", totalSales: 35, productA: 16, productB: 10 },
    { month: "Jul 2024", totalSales: 38, productA: 18, productB: 11 },
    { month: "Oct 2024", totalSales: 42, productA: 20, productB: 12 },
    { month: "Jan 2025", totalSales: 40, productA: 22, productB: 11 },
    { month: "Apr 2025", totalSales: 41, productA: 20, productB: 10 },
  ];

  data.monthly = monthlyData.map((item) => ({
    date: new Date(item.month + " 01").toISOString().split("T")[0],
    label: item.month,
    totalSales: item.totalSales,
    productA: item.productA,
    productB: item.productB,
  }));

  return data;
};

export const dashboardData = {
  totalRevenue: { daily: 5000, weekly: 35000, monthly: 150000 },
  totalOrders: { pending: 50, shipped: 200, delivered: 300, cancelled: 20 },
  totalCustomers: 1200,
  totalRetailers: 150,
  lowStockAlerts: 10,

  // Enhanced product data
  topSellingProducts: [
    {
      name: "iPhone 14",
      sales: 300,
      details: "Category: Electronics, Price: $999",
    },
    {
      name: "Samsung Galaxy S23",
      sales: 250,
      details: "Category: Electronics, Price: $899",
    },
    {
      name: "MacBook Pro",
      sales: 200,
      details: "Category: Electronics, Price: $1299",
    },
    {
      name: "AirPods Pro",
      sales: 150,
      details: "Category: Electronics, Price: $249",
    },
    {
      name: "iPad Air",
      sales: 100,
      details: "Category: Electronics, Price: $599",
    },
  ],

  // Worst selling products
  worstSellingProducts: [
    {
      name: "Old Phone Case",
      sales: 5,
      details: "Category: Accessories, Price: $15",
    },
    {
      name: "Outdated Charger",
      sales: 8,
      details: "Category: Accessories, Price: $20",
    },
    {
      name: "Legacy Headphones",
      sales: 12,
      details: "Category: Audio, Price: $50",
    },
    {
      name: "Basic Mouse",
      sales: 15,
      details: "Category: Computer, Price: $25",
    },
    {
      name: "Simple Keyboard",
      sales: 18,
      details: "Category: Computer, Price: $40",
    },
  ],

  // Out of stock products
  outOfStockProducts: [
    { name: "iPhone 15 Pro", stock: 0, category: "Electronics" },
    { name: "PlayStation 5", stock: 0, category: "Gaming" },
    { name: "RTX 4090", stock: 0, category: "Computer" },
    { name: "MacBook Air M3", stock: 0, category: "Electronics" },
  ],

  // Top wishlisted products
  topWishlistedProducts: [
    { name: "iPhone 15 Pro Max", wishlistCount: 450 },
    { name: "MacBook Pro M3", wishlistCount: 380 },
    { name: "PlayStation 5", wishlistCount: 320 },
    { name: "AirPods Max", wishlistCount: 280 },
    { name: "iPad Pro", wishlistCount: 250 },
  ],

  // Product ratings removed as requested

  // Orders by status for different time periods
  ordersByStatus: {
    today: { pending: 5, shipped: 15, delivered: 25, cancelled: 2 },
    week: { pending: 35, shipped: 105, delivered: 175, cancelled: 14 },
    month: { pending: 50, shipped: 200, delivered: 300, cancelled: 20 },
  },

  // Brand distribution data
  brandDistribution: {
    today: { Apple: 45, Samsung: 25, Sony: 15, Microsoft: 10, Others: 5 },
    week: { Apple: 40, Samsung: 30, Sony: 12, Microsoft: 8, Others: 10 },
    month: { Apple: 35, Samsung: 25, Sony: 15, Microsoft: 10, Others: 15 },
  },

  // User growth data for different periods
  userGrowth: {
    today: [
      { period: "Morning", newUsers: 15, activeUsers: 120 },
      { period: "Afternoon", newUsers: 25, activeUsers: 180 },
      { period: "Evening", newUsers: 20, activeUsers: 150 },
    ],
    week: [
      { period: "Mon", newUsers: 45, activeUsers: 320 },
      { period: "Tue", newUsers: 52, activeUsers: 380 },
      { period: "Wed", newUsers: 48, activeUsers: 350 },
      { period: "Thu", newUsers: 55, activeUsers: 420 },
      { period: "Fri", newUsers: 62, activeUsers: 480 },
      { period: "Sat", newUsers: 38, activeUsers: 280 },
      { period: "Sun", newUsers: 35, activeUsers: 250 },
    ],
    month: [
      { period: "Week 1", newUsers: 280, activeUsers: 1800 },
      { period: "Week 2", newUsers: 320, activeUsers: 2100 },
      { period: "Week 3", newUsers: 295, activeUsers: 1950 },
      { period: "Week 4", newUsers: 340, activeUsers: 2200 },
    ],
  },

  // Comparison data for different time periods
  thisDayVsYesterday: {
    thisPeriodRevenue: 5000,
    lastPeriodRevenue: 4800,
    thisPeriodOrders: 47,
    lastPeriodOrders: 45,
  },
  thisWeekVsLast: {
    thisPeriodRevenue: 35000,
    lastPeriodRevenue: 33000,
    thisPeriodOrders: 329,
    lastPeriodOrders: 315,
  },
  thisMonthVsLast: {
    thisPeriodRevenue: 150000,
    lastPeriodRevenue: 140000,
    thisPeriodOrders: 570,
    lastPeriodOrders: 550,
  },

  // Customer satisfaction for different periods
  customerSatisfaction: {
    today: 75,
    week: 73,
    month: 71,
  },

  // Average Order Value
  averageOrderValue: {
    today: 85.5,
    week: 92.3,
    month: 88.75,
  },

  // Sales by brand
  salesByCategory: {
    today: {
      Electronics: 3500,
      Fashion: 800,
      Home: 400,
      Beauty: 200,
      Sports: 100,
    },
    week: {
      Electronics: 24500,
      Fashion: 5600,
      Home: 2800,
      Beauty: 1400,
      Sports: 700,
    },
    month: {
      Electronics: 105000,
      Fashion: 24000,
      Home: 12000,
      Beauty: 6000,
      Sports: 3000,
    },
  },

  // Revenue over time data
  revenueOverTime: {
    today: [
      { period: "Morning", revenue: 1200 },
      { period: "Afternoon", revenue: 2100 },
      { period: "Evening", revenue: 1700 },
    ],
    week: [
      { period: "Mon", revenue: 4500 },
      { period: "Tue", revenue: 5200 },
      { period: "Wed", revenue: 4800 },
      { period: "Thu", revenue: 5500 },
      { period: "Fri", revenue: 6200 },
      { period: "Sat", revenue: 3800 },
      { period: "Sun", revenue: 3500 },
    ],
    month: [
      { period: "Week 1", revenue: 28000 },
      { period: "Week 2", revenue: 32000 },
      { period: "Week 3", revenue: 29500 },
      { period: "Week 4", revenue: 34000 },
    ],
  },
};

export const productsData = {
  topSelling: [
    {
      name: "Product A",
      sales: 300,
      details: "Category: Electronics, Price: $100",
    },
    {
      name: "Product B",
      sales: 250,
      details: "Category: Clothing, Price: $50",
    },
    { name: "Product C", sales: 200, details: "Category: Home, Price: $80" },
    {
      name: "Product D",
      sales: 150,
      details: "Category: Electronics, Price: $120",
    },
    {
      name: "Product E",
      sales: 100,
      details: "Category: Clothing, Price: $40",
    },
    { name: "Product F", sales: 90, details: "Category: Home, Price: $60" },
    {
      name: "Product G",
      sales: 80,
      details: "Category: Electronics, Price: $110",
    },
    {
      name: "Product H",
      sales: 70,
      details: "Category: Clothing, Price: $45",
    },
    { name: "Product I", sales: 60, details: "Category: Home, Price: $70" },
    {
      name: "Product J",
      sales: 50,
      details: "Category: Electronics, Price: $130",
    },
  ],
  stockSummary: [
    { name: "Product A", stock: 5, status: "Low" },
    { name: "Product B", stock: 0, status: "Out-of-Stock" },
    { name: "Product C", stock: 3, status: "Low" },
    { name: "Product D", stock: 1, status: "Low" },
  ],
  productRatingTrends: [
    { month: "Jan", rating: 4.2 },
    { month: "Feb", rating: 4.3 },
    { month: "Mar", rating: 4.1 },
    { month: "Apr", rating: 4.4 },
    { month: "May", rating: 4.5 },
  ],
};

export const ordersData = {
  ordersByStatus: [
    { day: "Mon", pending: 10, shipped: 20, delivered: 30, cancelled: 5 },
    { day: "Tue", pending: 15, shipped: 25, delivered: 35, cancelled: 3 },
  ],
  paymentMethods: { cod: 60, prepaid: 40 },
  orderTimeTrends: [
    { hour: "9 AM", orders: 20 },
    { hour: "12 PM", orders: 50 },
    { hour: "3 PM", orders: 30 },
  ],
};

export const usersData = {
  customers: {
    activeVsInactive: { active: 800, inactive: 400 },
    topCustomers: [
      {
        name: "John Doe",
        purchaseValue: 5000,
        details: "Orders: 15, Last Purchase: 2025-05-01",
      },
      {
        name: "Jane Smith",
        purchaseValue: 4500,
        details: "Orders: 12, Last Purchase: 2025-04-30",
      },
    ],
    purchaseFrequency: [
      { name: "John Doe", frequency: 5 },
      { name: "Jane Smith", frequency: 4 },
    ],
  },
  retailers: {
    salesVolume: [
      {
        name: "Retailer A",
        sales: 2000,
        details: "Products: 50, Active Listings: 45",
      },
      {
        name: "Retailer B",
        sales: 1800,
        details: "Products: 40, Active Listings: 38",
      },
    ],
    activeListings: [
      { name: "Retailer A", listings: 45 },
      { name: "Retailer B", listings: 38 },
    ],
  },
};

export const reviewsData = {
  ratingDistribution: { 1: 10, 2: 20, 3: 30, 4: 50, 5: 90 },
  reviewVolume: [
    { month: "Jan", volume: 20 },
    { month: "Feb", volume: 25 },
    { month: "Mar", volume: 30 },
  ],
  sentiment: { positive: 70, negative: 30 },
};

export const couponsData = {
  usageRate: [
    { code: "FLAT50", issued: 100, used: 70 },
    { code: "OFF20", issued: 200, used: 120 },
  ],
  couponTypeEffectiveness: { flat: 40, percentOff: 35, freeShipping: 25 },
  expiredUnused: [
    { code: "EXPIRED1", count: 30 },
    { code: "EXPIRED2", count: 20 },
    { code: "EXPIRED3", count: 15 },
  ],
};
