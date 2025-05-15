import React, { useState } from 'react';

const reviews = [
  { id: 1, product: "Laptop Pro", reviewer: "John Doe", rating: 4, date: "2025-04-20", status: "Pending", text: "Great product, fast delivery!", media: [], flagged: false, productImage: "https://via.placeholder.com/150?text=Laptop" },
  { id: 2, product: "Smartphone X", reviewer: "Jane Smith", rating: 5, date: "2025-04-19", status: "Approved", text: "Absolutely love it!", media: [], flagged: false, productImage: "https://via.placeholder.com/150?text=Smartphone" },
  { id: 3, product: "Tablet Air", reviewer: "Bob Lee", rating: 3, date: "2025-04-18", status: "Flagged", text: "Had some issues.", media: [], flagged: true, abuseReason: "Inappropriate content", productImage: "https://via.placeholder.com/150?text=Tablet" },
];

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
        {reviews.map(review => (
          <tr key={review.id} className="border-b hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onRowClick(review)}>
            <td className="py-4 px-6">
              <img src={review.productImage} alt={review.product} className="w-10 h-10 object-cover rounded" />
            </td>
            <td className="py-4 px-6 font-medium">{review.product}</td>
            <td className="py-4 px-6 font-medium">{review.reviewer}</td>
            <td className="py-4 px-6 text-center font-medium">{review.rating}/5</td>
            <td className="py-4 px-6 font-medium">{review.date}</td>
            <td className="py-4 px-6 text-center">
              <span className={`px-2 py-1 rounded font-medium ${review.status === 'Approved' ? 'bg-green-100 text-green-700' : review.status === 'Rejected' ? 'bg-red-100 text-red-700' : review.status === 'Flagged' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                {review.status}
              </span>
            </td>
            <td className="py-4 px-6 text-center flex justify-center space-x-2">
              {review.status === "Pending" && (
                <>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition font-medium" onClick={(e) => { e.stopPropagation(); onAction(review.id, "Approve"); }}>Approve</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium" onClick={(e) => { e.stopPropagation(); onAction(review.id, "Reject"); }}>Reject</button>
                </>
              )}
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition font-medium" onClick={(e) => { e.stopPropagation(); onAction(review.id, review.flagged ? "Mark Safe" : "Flag"); }}>
                {review.flagged ? "Mark Safe" : "Flag"}
              </button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition font-medium" onClick={(e) => { e.stopPropagation(); onAction(review.id, "Delete"); }}>Delete</button>
              {review.flagged && (
                <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition font-medium" onClick={(e) => { e.stopPropagation(); onAction(review.id, "Ban User"); }}>Ban User</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Analytics = () => (
  <div className="p-6 animate-slide-in">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Review Analytics</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">Review Counts</h4>
        <svg className="w-full h-48" viewBox="0 0 400 200">
          <rect x="50" y="100" width="60" height="100" fill="#3B82F6" />
          <text x="80" y="190" textAnchor="middle" className="text-xs">Pending</text>
          <rect x="130" y="50" width="60" height="150" fill="#10B981" />
          <text x="160" y="190" textAnchor="middle" className="text-xs">Approved</text>
          <rect x="210" y="80" width="60" height="120" fill="#F59E0B" />
          <text x="240" y="190" textAnchor="middle" className="text-xs">Flagged</text>
          <rect x="290" y="20" width="60" height="180" fill="#8B5CF6" />
          <text x="320" y="190" textAnchor="middle" className="text-xs">Rejected</text>
        </svg>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">Rating Distribution</h4>
        <svg className="w-full h-48" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="#14B8A6" stroke="#fff" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="50.24" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="80" fill="#F87171" stroke="#fff" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="200.96" transform="rotate(-90 100 100)" />
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">4.2/5</text>
        </svg>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-4">Top-Rated Products</h4>
        <ul className="text-gray-600">
          <li className="py-2 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="font-medium">Smartphone X</span> - <span className="ml-1 font-bold text-blue-600">4.8/5</span>
          </li>
          <li className="py-2 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="font-medium">Laptop Pro</span> - <span className="ml-1 font-bold text-green-600">4.5/5</span>
          </li>
          <li className="py-2 flex items-center">
            <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            <span className="font-medium">Tablet Air</span> - <span className="ml-1 font-bold text-orange-600">4.2/5</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ReviewDetailModal = ({ review, onClose, onRespond }) => {
  const [response, setResponse] = useState("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg animate-slide-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Review Details</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center space-x-4">
            <img src={review.productImage} alt={review.product} className="w-16 h-16 object-cover rounded" />
            <p><strong>Product:</strong> <span className="font-medium">{review.product}</span></p>
          </div>
          <p><strong>Reviewer:</strong> <span className="font-medium">{review.reviewer}</span></p>
          <p><strong>Rating:</strong> <span className="font-medium">{review.rating}/5</span></p>
          <p><strong>Date:</strong> <span className="font-medium">{review.date}</span></p>
          <p><strong>Status:</strong> <span className="font-medium">{review.status}</span></p>
          <p><strong>Review:</strong> <span className="font-medium">{review.text}</span></p>
          {review.flagged && <p><strong>Abuse Reason:</strong> <span className="font-medium">{review.abuseReason}</span></p>}
        </div>
        <div className="mt-6">
          <label className="block font-bold text-gray-700">Admin Response</label>
          <textarea
            className="w-full p-3 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Enter your response..."
            rows="4"
          />
          <button
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
            onClick={() => onRespond(review.id, response)}
          >
            Submit Response
          </button>
        </div>
        <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-bold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const ReviewDashboard = () => {
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [search, setSearch] = useState("");
  const [reviewData, setReviewData] = useState(reviews);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleAction = (id, action) => {
    setReviewData(reviewData.map(review => {
      if (review.id === id) {
        if (action === "Approve") return { ...review, status: "Approved" };
        if (action === "Reject") return { ...review, status: "Rejected" };
        if (action === "Delete") return null;
        if (action === "Flag") return { ...review, flagged: true, status: "Flagged" };
        if (action === "Mark Safe") return { ...review, flagged: false, status: "Pending" };
        if (action === "Ban User") return { ...review, status: "Banned" };
      }
      return review;
    }).filter(Boolean));
  };

  const handleRespond = (id, response) => {
    console.log(`Response for review ${id}: ${response}`);
    setSelectedReview(null);
  };

  const filteredReviews = reviewData.filter(review => {
    if (activeTab === "Flagged Reviews") return review.flagged;
    if (activeTab === "Approved Reviews") return review.status === "Approved";
    if (activeTab === "Rejected Reviews") return review.status === "Rejected";
    return true;
  }).filter(review =>
    review.product.toLowerCase().includes(search.toLowerCase()) ||
    review.reviewer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Management</h2>
      <div className="flex border-b border-gray-200 mb-6">
        {["All Reviews", "Flagged Reviews", "Approved Reviews", "Rejected Reviews", "Analytics"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-bold ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"} transition-colors`}
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
      {activeTab === "Analytics" ? (
        <Analytics />
      ) : (
        <ReviewTable reviews={filteredReviews} onAction={handleAction} onRowClick={setSelectedReview} />
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