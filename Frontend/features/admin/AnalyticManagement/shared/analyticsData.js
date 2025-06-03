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
  topSellingProducts: [
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
  ],
  thisMonthVsLast: {
    thisMonthRevenue: 150000,
    lastMonthRevenue: 140000,
    thisMonthOrders: 570,
    lastMonthOrders: 550,
  },
  customerSatisfaction: 71,
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
