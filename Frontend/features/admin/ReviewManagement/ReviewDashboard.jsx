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
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
          <th className="py-4 px-6 text-left font-bold">Product Image</th>
          <th className="py-4 px-6 text-left font-bold">Product</th>
          <th className="py-4 px-6 text-left font-bold">Reviewer</th>
          <th className="py-4 px-6 text-center font-bold">Rating</th>
          <th className="py-4 px-6 text-left font-bold">Date</th>
          <th className="py-4 px-6 text-center font-bold">Status</th>
          <th className="py-4 px-6 text-center font-bold">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm">
        {reviews.map((review) => (
          <tr
            key={review.product_review_id}
            className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onRowClick(review)}
          >
            <td className="py-4 px-6">
              <img
                src={
                  review.product.image?.url ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={review.product.name}
                className="w-10 h-10 object-cover rounded"
              />
            </td>
            <td className="py-4 px-6 font-medium">{review.product.name}</td>
            <td className="py-4 px-6 font-medium">{review.reviewer.name}</td>
            <td className="py-4 px-6 text-center font-medium">
              {review.rating}/5
            </td>
            <td className="py-4 px-6 font-medium">
              {new Date(review.date).toLocaleDateString()}
            </td>
            <td className="py-4 px-6 text-center">
              <span
                className={`px-2 py-1 rounded font-medium ${
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
            <td className="py-4 px-6 text-center flex justify-center space-x-2">
              {review.status === "pending" && (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(review.product_review_id, "Approve");
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
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
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition font-medium"
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
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(review.product_review_id, "Delete");
                }}
              >
                Delete
              </button>
              {review.status === "flagged" && (
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(review.product_review_id, "Ban User");
                  }}
                >
                  Ban User
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Analytics = ({ analyticsData }) => {
  // Default values in case data is not available
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

  // Calculate the maximum count for scaling the bar heights
  const maxCount = Math.max(
    reviewCounts.pending || 0,
    reviewCounts.approve || 0,
    reviewCounts.flag || 0,
    reviewCounts.reject || 0,
    1 // Ensure we don't divide by zero
  );

  // Extract the average rating as a number for the pie chart
  const averageRating =
    parseFloat(ratingDistribution.average?.split("/")[0]) || 0;
  const maxRating = 5;

  // Calculate the percentage for the pie chart
  const ratingPercentage = (averageRating / maxRating) * 100;
  const circumference = 2 * Math.PI * 80; // 2πr where r=80
  const dashOffset = circumference * (1 - ratingPercentage / 100);

  return (
    <div className="p-6 animate-slide-in">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Review Analytics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4">Review Counts</h4>
          <svg className="w-full h-48" viewBox="0 0 400 200">
            {/* Pending */}
            <rect
              x="50"
              y={200 - (reviewCounts.pending / maxCount) * 180}
              width="60"
              height={(reviewCounts.pending / maxCount) * 180}
              fill="#3B82F6"
            />
            <text x="80" y="190" textAnchor="middle" className="text-xs">
              Pending ({reviewCounts.pending})
            </text>

            {/* Approved */}
            <rect
              x="130"
              y={200 - (reviewCounts.approve / maxCount) * 180}
              width="60"
              height={(reviewCounts.approve / maxCount) * 180}
              fill="#10B981"
            />
            <text x="160" y="190" textAnchor="middle" className="text-xs">
              Approved ({reviewCounts.approve})
            </text>

            {/* Flagged */}
            <rect
              x="210"
              y={200 - (reviewCounts.flag / maxCount) * 180}
              width="60"
              height={(reviewCounts.flag / maxCount) * 180}
              fill="#F59E0B"
            />
            <text x="240" y="190" textAnchor="middle" className="text-xs">
              Flagged ({reviewCounts.flag})
            </text>

            {/* Rejected */}
            <rect
              x="290"
              y={200 - (reviewCounts.reject / maxCount) * 180}
              width="60"
              height={(reviewCounts.reject / maxCount) * 180}
              fill="#8B5CF6"
            />
            <text x="320" y="190" textAnchor="middle" className="text-xs">
              Rejected ({reviewCounts.reject})
            </text>
          </svg>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4">Rating Distribution</h4>
          <svg className="w-full h-48" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="#14B8A6"
              stroke="#fff"
              strokeWidth="10"
              strokeDasharray={circumference}
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
              strokeDasharray={circumference}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
            />
            <text
              x="100"
              y="90"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold"
            >
              {ratingDistribution.average}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm"
            >
              Total: {ratingDistribution.total}
            </text>
          </svg>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-700 mb-4">Top-Rated Products</h4>
          {topRatedProducts.length > 0 ? (
            <ul className="text-gray-600">
              {topRatedProducts.map((product, index) => {
                // Assign different colors based on index
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
                  <li key={index} className="py-2 flex items-center">
                    <span
                      className={`inline-block w-3 h-3 ${colors[colorIndex]} rounded-full mr-2`}
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
  // Create a state variable that contains ALL the original review data
  const [updatedReviewData, setUpdatedReviewData] = useState({
    ...review, // Copy all original fields first
    rating: review.rating,
    title: review.title || "",
    review: review.review || "",
  });

  // Store original values to compare later for the alert
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
    // Create an object with only the fields that have changed
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

    // Check if any data has changed
    if (Object.keys(changedData).length === 0) {
      alert("No changes detected");
      return;
    }
    // Call the API to update the review
    const updateReview = async () => {
      try {
        console.log("Updating review with changed data:", changedData);
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg animate-slide-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Review Details</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center space-x-4">
            <img
              src={
                review.product.image?.url ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt={review.product.name}
              className="w-16 h-16 object-cover rounded"
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
        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
            onClick={handleUpdate}
          >
            Update Review
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-bold"
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
          // Extract reviews and pagination from the reviewChangeStatusResponse
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
          // Extract analytics data from the analyticsDashboardResponse
          const analyticsData = analyticsDashboardResponse.data;
          // Update state with analytics data
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
          const deleteReview = await deleteApiById(
            deleteReviewByProductReviewIdRoute,
            id
          );

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
                      return { ...review, status: "approved" };
                    if (action === "Reject")
                      return { ...review, status: "rejected" };
                    if (action === "Flag")
                      return { ...review, status: "flagged" };
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

    // Update the review in the local state
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

  const filteredReviews = reviewData
    .filter((review) => {
      // Check if the review has a status property
      if (!review.status) return activeTab === "All Reviews";

      // Convert status to lowercase for case-insensitive comparison
      const status = review.status.toLowerCase();

      if (activeTab === "Flagged Reviews") return status === "flagged";
      if (activeTab === "Approved Reviews") return status === "approved";
      if (activeTab === "Rejected Reviews") return status === "rejected";

      // If activeTab is "All Reviews" or any other tab, show all reviews
      return true;
    })
    .filter(
      (review) =>
        review.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        review.reviewer?.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Review Management
      </h2>
      <div className="flex border-b border-gray-200 mb-6">
        {[
          "All Reviews",
          "Flagged Reviews",
          "Approved Reviews",
          "Rejected Reviews",
          "Analytics",
        ].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-bold ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab !== "Analytics" && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by product or reviewer..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading review data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
        </div>
      ) : activeTab === "Analytics" ? (
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
              <div className="flex space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      // Here you would implement pagination logic
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
