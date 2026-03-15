import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const PeerReview = memo(() => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/assignments/peer-reviews");
        setReviews(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch peer reviews", error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const [currentReview, setCurrentReview] = useState({
    criteria: [
      { id: 1, name: "Code Quality", rating: 0, comments: "" },
      { id: 2, name: "Documentation", rating: 0, comments: "" },
      { id: 3, name: "Functionality", rating: 0, comments: "" },
      { id: 4, name: "Design", rating: 0, comments: "" },
    ],
    overallComments: "",
  });

  const submitReview = useCallback(() => {
    toast.success("Peer review submitted successfully");
    navigate("/assignments");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/assignments")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
          >
            ← Back to Assignments
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Peer Review
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Review and evaluate peer submissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                My Reviews
              </h3>
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="text-center py-4 text-slate-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">No peer reviews assigned.</div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id || review._id}
                      className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm ${
                        review.status === "Pending"
                          ? "border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                          : review.status === "Completed"
                            ? "border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      }`}
                    >
                      <div className="font-medium text-slate-900 dark:text-white">
                        {review.assignment || (review.assignmentId ? review.assignmentId.title : "N/A")}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Reviewee: {review.reviewee || (review.revieweeId ? review.revieweeId.name : "N/A")}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            review.status === "Pending"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                              : review.status === "Completed"
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          }`}
                        >
                          {review.status || "Pending"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Due: {review.dueDate || new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Database Design Project
                </h2>
                <div className="text-slate-600 dark:text-slate-400">
                  Reviewing submission from: John Doe
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Due: January 20, 2024
                </div>
              </div>

              <div className="space-y-6">
                {currentReview.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {criterion.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Rate the quality of {criterion.name.toLowerCase()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
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
                                    : c,
                              );
                              setCurrentReview({
                                ...currentReview,
                                criteria: newCriteria,
                              });
                            }}
                            className={`text-2xl ${
                              star <= criterion.rating
                                ? "text-amber-400 dark:text-amber-500"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Comments
                      </label>
                      <textarea
                        rows="2"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-sm"
                        value={criterion.comments}
                        onChange={(e) => {
                          const newCriteria = currentReview.criteria.map((c) =>
                            c.id === criterion.id
                              ? { ...c, comments: e.target.value }
                              : c,
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Overall Comments
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
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
                    className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-800"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => navigate("/assignments")}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
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
});

PeerReview.displayName = "PeerReview";

export default PeerReview;
