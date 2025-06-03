import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { reviewsData } from "./shared/analyticsData.js";

// Reviews Component
const Reviews = ({ dateRange }) => {
  const ratingDistributionChartRef = useRef(null);
  const reviewVolumeChartRef = useRef(null);
  const sentimentChartRef = useRef(null);

  useEffect(() => {
    const ctxRatingDistribution = document
      .getElementById("reviewsRatingDistributionChart")
      ?.getContext("2d");
    if (ctxRatingDistribution) {
      ratingDistributionChartRef.current = new Chart(ctxRatingDistribution, {
        type: "bar",
        data: {
          labels: Object.keys(reviewsData.ratingDistribution),
          datasets: [
            {
              label: "Reviews",
              data: Object.values(reviewsData.ratingDistribution),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: { scales: { y: { beginAtZero: true } } },
      });
    }

    const ctxReviewVolume = document
      .getElementById("reviewsReviewVolumeChart")
      ?.getContext("2d");
    if (ctxReviewVolume) {
      reviewVolumeChartRef.current = new Chart(ctxReviewVolume, {
        type: "line",
        data: {
          labels: reviewsData.reviewVolume.map((r) => r.month),
          datasets: [
            {
              label: "Review Volume",
              data: reviewsData.reviewVolume.map((r) => r.volume),
              borderColor: "rgba(54, 162, 235, 1)",
              fill: false,
            },
          ],
        },
        options: { scales: { y: { beginAtZero: true } } },
      });
    }

    const ctxSentiment = document
      .getElementById("reviewsSentimentChart")
      ?.getContext("2d");
    if (ctxSentiment) {
      sentimentChartRef.current = new Chart(ctxSentiment, {
        type: "pie",
        data: {
          labels: Object.keys(reviewsData.sentiment),
          datasets: [
            {
              data: Object.values(reviewsData.sentiment),
              backgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        },
      });
    }

    return () => {
      if (ratingDistributionChartRef.current)
        ratingDistributionChartRef.current.destroy();
      if (reviewVolumeChartRef.current)
        reviewVolumeChartRef.current.destroy();
      if (sentimentChartRef.current) sentimentChartRef.current.destroy();
    };
  }, [dateRange]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Rating Distribution {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="reviewsRatingDistributionChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Review Volume {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="reviewsReviewVolumeChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Review Sentiment {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="reviewsSentimentChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
