import React, { useState, useEffect, useRef } from "react";
import CouponForm from "./CouponForm";

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
                <p className="font-bold">₹{coupon.minOrder}</p>
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
