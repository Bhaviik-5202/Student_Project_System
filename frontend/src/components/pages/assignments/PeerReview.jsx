import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PeerReview = () => {
  const navigate = useNavigate();
  const [reviews] = useState([
    {
      id: 1,
      assignment: "Database Design Project",
      reviewee: "John Doe",
      reviewer: "Jane Smith",
      status: "Pending",
      dueDate: "2024-01-20",
    },
    {
      id: 2,
      assignment: "Web App Prototype",
      reviewee: "Robert Johnson",
      reviewer: "Sarah Williams",
      status: "Completed",
      dueDate: "2024-01-18",
    },
    {
      id: 3,
      assignment: "Algorithm Analysis",
      reviewee: "Michael Brown",
      reviewer: "Emily Davis",
      status: "In Progress",
      dueDate: "2024-01-22",
    },
  ]);

  const [currentReview, setCurrentReview] = useState({
    criteria: [
      { id: 1, name: "Code Quality", rating: 0, comments: "" },
      { id: 2, name: "Documentation", rating: 0, comments: "" },
      { id: 3, name: "Functionality", rating: 0, comments: "" },
      { id: 4, name: "Design", rating: 0, comments: "" },
    ],
    overallComments: "",
  });

  const submitReview = () => {
    toast.success("Peer review submitted successfully");
    navigate("/assignments");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/assignments")}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Assignments
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Peer Review</h1>
          <p className="text-gray-600">Review and evaluate peer submissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Reviews
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm ${
                      review.status === "Pending"
                        ? "border-yellow-300 bg-yellow-50"
                        : review.status === "Completed"
                        ? "border-green-300 bg-green-50"
                        : "border-blue-300 bg-blue-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {review.assignment}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Reviewee: {review.reviewee}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          review.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : review.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {review.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Due: {review.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Database Design Project
                </h2>
                <div className="text-gray-600">
                  Reviewing submission from: John Doe
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Due: January 20, 2024
                </div>
              </div>

              <div className="space-y-6">
                {currentReview.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Rate the quality of {criterion.name.toLowerCase()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {criterion.rating}/5
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              const newCriteria = currentReview.criteria.map(
                                (c) =>
                                  c.id === criterion.id
                                    ? { ...c, rating: star }
                                    : c
                              );
                              setCurrentReview({
                                ...currentReview,
                                criteria: newCriteria,
                              });
                            }}
                            className={`text-2xl ${
                              star <= criterion.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments
                      </label>
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={criterion.comments}
                        onChange={(e) => {
                          const newCriteria = currentReview.criteria.map((c) =>
                            c.id === criterion.id
                              ? { ...c, comments: e.target.value }
                              : c
                          );
                          setCurrentReview({
                            ...currentReview,
                            criteria: newCriteria,
                          });
                        }}
                        placeholder="Provide specific feedback..."
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Comments
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentReview.overallComments}
                    onChange={(e) =>
                      setCurrentReview({
                        ...currentReview,
                        overallComments: e.target.value,
                      })
                    }
                    placeholder="Provide overall feedback and suggestions..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitReview}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => navigate("/assignments")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerReview;
