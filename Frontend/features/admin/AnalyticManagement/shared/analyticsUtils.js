// Shared utilities for Analytics Dashboard components

// Enhanced Helper functions
export const filterDataByDateRange = (timelineData, range) => {
  const today = new Date("2025-05-02");

  if (typeof range === "string") {
    if (range === "Today") {
      // Return today's data from daily dataset
      const todayStr = today.toISOString().split("T")[0];
      const todayData = timelineData.daily.filter(
        (item) => item.date === todayStr
      );
      return todayData.length > 0 ? todayData : timelineData.daily.slice(-1);
    } else if (range === "Week") {
      // Return last 7 days from daily dataset
      return timelineData.daily.slice(-7);
    } else if (range === "Month") {
      // Return last 30 days from daily dataset, but show as monthly view
      return timelineData.monthly.slice(-6); // Last 6 months for better visualization
    } else {
      return timelineData.monthly; // Default fallback
    }
  } else if (range && range.start && range.end) {
    // Custom date range filtering
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);

    // Determine which dataset to use based on date range
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    let dataToFilter;
    if (daysDiff <= 7) {
      dataToFilter = timelineData.daily;
    } else if (daysDiff <= 90) {
      dataToFilter = timelineData.weekly;
    } else {
      dataToFilter = timelineData.monthly;
    }

    const filtered = dataToFilter.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    return filtered.length > 0 ? filtered : dataToFilter.slice(-1);
  }

  return timelineData.monthly; // Default fallback
};

// Global styles to prevent horizontal scrolling
export const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  canvas {
    max-width: 100% !important;
    height: auto !important;
  }

  .chart-container {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
`;

// Inject styles function
export const injectGlobalStyles = () => {
  if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
  }
};

// Chart title helper function
export const getChartTitle = (baseTitle, dateRange, section = "") => {
  let title = baseTitle;
  let suffix = "";
  
  if (typeof dateRange === "string") {
    switch (dateRange) {
      case "Today":
        suffix = section ? `Today's ${section}` : "Today's Performance";
        break;
      case "Week":
        suffix = section ? `Weekly ${section} (Last 7 Days)` : "Weekly Performance (Last 7 Days)";
        break;
      case "Month":
        suffix = section ? `Monthly ${section} (Last 6 Months)` : "Monthly Performance (Last 6 Months)";
        break;
      default:
        suffix = `(${dateRange})`;
    }
  } else {
    suffix = "(Custom Range)";
  }
  
  return `${title} ${suffix}`;
};

// Y-axis title helper function
export const getYAxisTitle = (baseTitle, dateRange) => {
  if (typeof dateRange === "string") {
    switch (dateRange) {
      case "Today":
        return `${baseTitle} - Today`;
      case "Week":
        return `${baseTitle} - Daily`;
      case "Month":
        return `${baseTitle} - Monthly`;
      default:
        return baseTitle;
    }
  }
  return `${baseTitle} - Custom Range`;
};
