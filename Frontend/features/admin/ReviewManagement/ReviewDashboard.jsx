import React, { useState, useEffect } from "react";
import {
  getApi,
  reviewManagmentDashboardDataRoute,
  MESSAGE,
  reviewChangeStatusRoute,
  updateApiById,
  deleteApiById,
  deleteReviewByProductReviewIdRoute,
  updateProductReviewByIdRoute,
  reviewManagmentAnalyticsDataRoute,
} from "../../../src/index.js";

const ReviewTable = ({ reviews, onAction, onRowClick }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-xs uppercase">
          {/* Hide less critical columns on smaller screens */}
          <th className="py-3 px-4 text-left font-bold hidden sm:table-cell">
            Product Image
          </th>
          <th className="py-3 px-4 text-left font-bold">Product</th>
          <th className="py-3 px-4 text-left font-bold hidden md:table-cell">
            Reviewer
          </th>
          <th className="py-3 px-4 text-center font-bold">Rating</th>
          <th className="py-3 px-4 text-left font-bold hidden lg:table-cell">
            Date
          </th>
          <th className="py-3 px-4 text-center font-bold hidden md:table-cell">
            Status
          </th>
          <th className="py-3 px-4 text-center font-bold">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm">
        {reviews.map((review) => (
          <tr
            key={review.product_review_id}
            className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onRowClick(review)}
          >
            <td className="py-3 px-4 hidden sm:table-cell">
              <img
                src={
                  review.product.image?.url ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={review.product.name}
                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
              />
            </td>
            <td className="py-3 px-4 font-medium text-xs sm:text-sm">
              {review.product.name}
            </td>
            <td className="py-3 px-4 font-medium hidden md:table-cell">
              {review.reviewer.name}
            </td>
            <td className="py-3 px-4 text-center font-medium">
              {review.rating}/5
            </td>
            <td className="py-3 px-4 font-medium hidden lg:table-cell">
              {new Date(review.date).toLocaleDateString()}
            </td>
            <td className="py-3 px-4 text-center hidden md:table-cell">
              <span
                className={`px-2 py-1 rounded font-medium text-xs sm:text-sm ${
                  review.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : review.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : review.status === "flagged"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            </td>
            <td className="py-3 px-4 text-center">
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                {review.status === "pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition font-medium text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(review.product_review_id, "Approve");
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition font-medium text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(review.product_review_id, "Reject");
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition font-medium text-xs sm:text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(
                      review.product_review_id,
                      review.status === "flagged" ? "Mark Safe" : "Flag"
                    );
                  }}
                >
                  {review.status === "flagged" ? "Mark Safe" : "Flag"}
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition font-medium text-xs sm:text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(review.product_review_id, "Delete");
                  }}
                >
                  Delete
                </button>
                {review.status === "flagged" && (
                  <button
                    className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition font-medium text-xs sm:text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(review.product_review_id, "Ban User");
                    }}
                  >
                    Ban User
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Analytics = ({ analyticsData }) => {
  const reviewCounts = analyticsData?.reviewCounts || {
    pending: 0,
    approve: 0,
    flag: 0,
    reject: 0,
  };
  const ratingDistribution = analyticsData?.ratingDistribution || {
    average: "0.0/5",
    total: 0,
  };
  const topRatedProducts = analyticsData?.topRatedProducts || [];

  const maxCount = Math.max(
    reviewCounts.pending || 0,
    reviewCounts.approve || 0,
    reviewCounts.flag || 0,
    reviewCounts.reject || 0,
    1
  );

  const averageRating =
    parseFloat(ratingDistribution.average?.split("/")[0]) || 0;
  const maxRating = 5;
  const ratingPercentage = (averageRating / maxRating) * 100;
  const circumference = 2 * Math.PI * 80;

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Review Analytics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            Review Counts
          </h4>
          {/* Responsive SVG with viewBox */}
          <svg className="w-full h-32 sm:h-48" viewBox="0 0 400 200">
            <rect
              x="50"
              y={200 - (reviewCounts.pending / maxCount) * 180}
              width="60"
              height={(reviewCounts.pending / maxCount) * 180}
              fill="#3B82F6"
            />
            <text
              x="80"
              y="190"
              textAnchor="middle"
              className="text-[10px] sm:text-xs"
            >
              Pending ({reviewCounts.pending})
            </text>
            <rect
              x="130"
              y={200 - (reviewCounts.approve / maxCount) * 180}
              width="60"
              height={(reviewCounts.approve / maxCount) * 180}
              fill="#10B981"
            />
            <text
              x="160"
              y="190"
              textAnchor="middle"
              className="text-[10px] sm:text-xs"
            >
              Approved ({reviewCounts.approve})
            </text>
            <rect
              x="210"
              y={200 - (reviewCounts.flag / maxCount) * 180}
              width="60"
              height={(reviewCounts.flag / maxCount) * 180}
              fill="#F59E0B"
            />
            <text
              x="240"
              y="190"
              textAnchor="middle"
              className="text-[10px] sm:text-xs"
            >
              Flagged ({reviewCounts.flag})
            </text>
            <rect
              x="290"
              y={200 - (reviewCounts.reject / maxCount) * 180}
              width="60"
              height={(reviewCounts.reject / maxCount) * 180}
              fill="#8B5CF6"
            />
            <text
              x="320"
              y="190"
              textAnchor="middle"
              className="text-[10px] sm:text-xs"
            >
              Rejected ({reviewCounts.reject})
            </text>
          </svg>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            Rating Distribution
          </h4>
          <svg className="w-full h-32 sm:h-48" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="#14B8A6"
              stroke="#fff"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ratingPercentage / 100)}
              transform="rotate(-90 100 100)"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="#F87171"
              stroke="#fff"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
            />
            <text
              x="100"
              y="90"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg sm:text-xl font-bold"
            >
              {ratingDistribution.average}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs sm:text-sm"
            >
              Total: {ratingDistribution.total}
            </text>
          </svg>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">
            Top-Rated Products
          </h4>
          {topRatedProducts.length > 0 ? (
            <ul className="text-gray-600 text-xs sm:text-sm">
              {topRatedProducts.map((product, index) => {
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-orange-500",
                  "bg-purple-500",
                  "bg-pink-500",
                ];
                const textColors = [
                  "text-blue-600",
                  "text-green-600",
                  "text-orange-600",
                  "text-purple-600",
                  "text-pink-600",
                ];
                const colorIndex = index % colors.length;

                return (
                  <li key={index} className="py-1 sm:py-2 flex items-center">
                    <span
                      className={`inline-block w-2 h-2 sm:w-3 sm:h-3 ${colors[colorIndex]} rounded-full mr-2`}
                    ></span>
                    <span className="font-medium">{product.name}</span> -{" "}
                    <span
                      className={`ml-1 font-bold ${textColors[colorIndex]}`}
                    >
                      {product.rating}
                    </span>
                    <span className="ml-2 text-gray-400">
                      ({product.reviewCount}{" "}
                      {product.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No product reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewDetailModal = ({ review, onClose, onRespond }) => {
  const [updatedReviewData, setUpdatedReviewData] = useState({
    ...review,
    rating: review.rating,
    title: review.title || "",
    review: review.review || "",
  });

  const originalValues = {
    rating: review.rating,
    title: review.title || "",
    review: review.review || "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReviewData({
      ...updatedReviewData,
      [name]: name === "rating" ? Number(value) : value,
    });
  };

  const handleUpdate = () => {
    const changedData = {};
    if (updatedReviewData.rating !== originalValues.rating) {
      changedData.rating = updatedReviewData.rating;
    }
    if (updatedReviewData.title !== originalValues.title) {
      changedData.title = updatedReviewData.title;
    }
    if (updatedReviewData.review !== originalValues.review) {
      changedData.review = updatedReviewData.review;
    }

    if (Object.keys(changedData).length === 0) {
      alert("No changes detected");
      return;
    }

    const updateReview = async () => {
      try {
        const response = await updateApiById(
          updateProductReviewByIdRoute,
          review.product_review_id,
          changedData
        );

        if (response.success === true) {
          alert("Review updated successfully");
          onRespond(review.product_review_id, updatedReviewData);
        } else {
          alert(
            "Failed to update review: " + (response.message || "Unknown error")
          );
          console.error("Error updating review:", response);
        }
      } catch (error) {
        alert("An error occurred while updating the review");
        console.error("Error updating review:", error);
      }
    };

    updateReview();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg my-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Review Details
        </h3>
        <div className="space-y-3 text-gray-600 text-sm sm:text-base">
          <div className="flex items-center space-x-4">
            <img
              src={
                review.product.image?.url ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt={review.product.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
            />
            <p>
              <strong>Product:</strong>{" "}
              <span className="font-medium">{review.product.name}</span>
            </p>
          </div>
          <p>
            <strong>Reviewer:</strong>{" "}
            <span className="font-medium">{review.reviewer.name}</span>
          </p>
          <div>
            <strong>Rating:</strong>{" "}
            <select
              name="rating"
              value={updatedReviewData.rating}
              onChange={handleChange}
              className="ml-2 border rounded p-1 focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="ml-1">/5</span>
          </div>
          <p>
            <strong>Date:</strong>{" "}
            <span className="font-medium">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="font-medium">
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </span>
          </p>
          <div>
            <strong>Title:</strong>{" "}
            <input
              type="text"
              name="title"
              value={updatedReviewData.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <strong>Review:</strong>{" "}
            <textarea
              name="review"
              value={updatedReviewData.review}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {review.abuseReason && (
            <p>
              <strong>Abuse Reason:</strong>{" "}
              <span className="font-medium">{review.abuseReason}</span>
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold text-sm sm:text-base"
            onClick={handleUpdate}
          >
            Update Review
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-bold text-sm sm:text-base"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewDashboard = () => {
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [search, setSearch] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    const reviewManagmentDashboardData = async () => {
      try {
        setLoading(true);
        const reviewChangeStatusResponse = await getApi(
          reviewManagmentDashboardDataRoute
        );
        if (reviewChangeStatusResponse.success === true) {
          const { reviews, pagination } = reviewChangeStatusResponse.data;
          setReviewData(reviews || []);
          setPagination(
            pagination || {
              total: reviews?.length || 0,
              page: 1,
              limit: 10,
              pages: 1,
            }
          );
          setError(null);
        } else {
          setError("Failed to fetch dashboard data");
          console.error("Error fetching data:", reviewChangeStatusResponse);
        }
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    reviewManagmentDashboardData();

    const analyticsDashboardData = async () => {
      try {
        setLoading(true);
        const analyticsDashboardResponse = await getApi(
          reviewManagmentAnalyticsDataRoute
        );
        if (analyticsDashboardResponse.success === true) {
          const analyticsData = analyticsDashboardResponse.data;
          setAnalyticsData(analyticsData);
          setError(null);
        } else {
          setError("Failed to fetch analytics data");
          console.error(
            "Error fetching analytics data:",
            analyticsDashboardResponse
          );
        }
      } catch (error) {
        setError("An error occurred while fetching analytics data");
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    analyticsDashboardData();
  }, []);

  const handleAction = (id, action) => {
    console.log(`Action for review ${id}: ${action}`);
    const changeReviewStatus = async () => {
      try {
        if (action === "Delete") {
          const deleteReview = await deleteApiById(reviewManagmentDashboardDataRoute, id);

          if (deleteReview.success === true) {
            console.log("Review deleted successfully");
            setReviewData(
              reviewData.filter((review) => review.product_review_id !== id)
            );
          } else {
            console.error("Error deleting review:", deleteReview);
          }
        } else if (action === "Mark Safe") {
          const reviewChangeStatusResponse = await updateApiById(
            reviewChangeStatusRoute,
            id,
            {
              action: "pending",
            }
          );

          if (reviewChangeStatusResponse.success === true) {
            console.log("Review status changed successfully");
            setReviewData(
              reviewData.map((review) => {
                if (review.product_review_id === id) {
                  return { ...review, status: "pending" };
                }
                return review;
              })
            );
          }
        } else {
          const reviewChangeStatusResponse = await updateApiById(
            reviewChangeStatusRoute,
            id,
            {
              action: action.toLowerCase(),
            }
          );

          if (reviewChangeStatusResponse.success === true) {
            console.log("Review status changed successfully");
            setReviewData(
              reviewData
                .map((review) => {
                  if (review.product_review_id === id) {
                    if (action === "Approve")
                      return { ...review, status: "approve" };
                    if (action === "Reject")
                      return { ...review, status: "reject" };
                    if (action === "Flag")
                      return { ...review, status: "flag" };
                    if (action === "Mark Safe")
                      return { ...review, status: "pending" };
                    if (action === "Ban User")
                      return { ...review, status: "banned" };
                  }
                  return review;
                })
                .filter(Boolean)
            );
          } else {
            console.error(
              "Error changing review status:",
              reviewChangeStatusResponse
            );
          }
        }
      } catch (error) {
        console.error("Error changing review status:", error);
      }
    };

    changeReviewStatus();
  };

  const handleRespond = (id, updatedReviewData) => {
    console.log(`Updating review ${id} with complete data:`, updatedReviewData);

    setReviewData(
      reviewData.map((review) => {
        if (review.product_review_id === id) {
          return { ...review, ...updatedReviewData };
        }
        return review;
      })
    );

    setSelectedReview(null);
  };

  const handleFilterChange = (e) => {
    const newTab = e.target.value;
    setActiveTab(newTab);
    setShowAnalytics(newTab === "Analytics");
  };

  const filteredReviews = reviewData
    .filter((review) => {
      if (!review.status) return activeTab === "All Reviews";
      const status = review.status.toLowerCase();
      if (activeTab === "Flagged Reviews") return status === "flag";
      if (activeTab === "Approved Reviews") return status === "approve";
      if (activeTab === "Rejected Reviews") return status === "reject";
      return true;
    })
    .filter(
      (review) =>
        review.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        review.reviewer?.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Review Management
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <select
            className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-white"
            value={activeTab}
            onChange={handleFilterChange}
          >
            <option value="All Reviews">All Reviews</option>
            <option value="Flagged Reviews">Flagged Reviews</option>
            <option value="Approved Reviews">Approved Reviews</option>
            <option value="Rejected Reviews">Rejected Reviews</option>
            <option value="Analytics">Analytics</option>
          </select>
        </div>

        {!showAnalytics && (
          <div className="w-full sm:w-64 md:w-96">
            <input
              type="text"
              placeholder="Search by product or reviewer..."
              className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading review data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
        </div>
      ) : showAnalytics ? (
        <Analytics analyticsData={analyticsData} />
      ) : filteredReviews.length > 0 ? (
        <>
          <ReviewTable
            reviews={filteredReviews}
            onAction={handleAction}
            onRowClick={setSelectedReview}
          />
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      console.log(`Navigate to page ${i + 1}`);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">No reviews found.</p>
        </div>
      )}

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onRespond={handleRespond}
        />
      )}
    </div>
  );
};

export default ReviewDashboard;
