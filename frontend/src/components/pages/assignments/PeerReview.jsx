import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

/**
 * PeerReview Component
 *
 * Facilitates the collaborative evaluation process where students
 * assess each other's work based on predefined criteria.
 * Features rating scales, comment sections, and an overview
 * of assigned reviews.
 */
const PeerReview = memo(() => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    criteria: [
      { id: 1, name: 'Code Quality', rating: 0, comments: '' },
      { id: 2, name: 'Documentation', rating: 0, comments: '' },
      { id: 3, name: 'Functionality', rating: 0, comments: '' },
      { id: 4, name: 'Design', rating: 0, comments: '' },
    ],
    overallComments: '',
  });

  useEffect(() => {
    const fetchPeerReviews = async () => {
      try {
        setReviewsLoading(true);
        // Standardized endpoint for assigned peer reviews
        const response = await api.get('/assignments/peer-reviews/mine');
        if (response.data && response.data.success) {
          setReviews(response.data.data || []);
          if (response.data.data?.length > 0) {
            setSelectedReview(response.data.data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch peer reviews', error);
        // Fallback for demonstration if API fails or is not yet implemented
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchPeerReviews();
  }, []);

  const handleRatingChange = useCallback((criterionId, rating) => {
    setReviewForm((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criterionId ? { ...c, rating } : c
      ),
    }));
  }, []);

  const handleCommentChange = useCallback((criterionId, comments) => {
    setReviewForm((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criterionId ? { ...c, comments } : c
      ),
    }));
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedReview) return;

    try {
      const toastId = toast.loading('Submitting peer review...');
      const response = await api.post(
        `/assignments/peer-reviews/${selectedReview.id || selectedReview._id}`,
        reviewForm
      );

      if (response.data && response.data.success) {
        toast.success('Peer review submitted successfully', { id: toastId });
        navigate('/assignments');
      } else {
        toast.error(response.data?.message || 'Failed to submit review', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('An error occurred during submission');
    }
  };

  if (reviewsLoading) {
    return (
      <div
        className='assignment-page'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p className='assignment-subtitle'>Loading peer reviews...</p>
      </div>
    );
  }

  return (
    <div className='assignment-page'>
      <div className='assignment-container'>
        <div className='assignment-header'>
          <div>
            <h1 className='assignment-title'>Peer Review</h1>
            <p className='assignment-subtitle'>
              Evaluate and provide feedback on peer submissions
            </p>
          </div>
        </div>

        <div className='assignment-grid assignment-grid-3'>
          {/* Review List Sidebar */}
          <div className='lg:col-span-1'>
            <div className='assignment-card'>
              <h3 className='assignment-detail-title'>Assigned Reviews</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {reviews.length === 0 ? (
                  <p
                    className='assignment-subtitle'
                    style={{ fontSize: '14px' }}
                  >
                    No reviews currently assigned.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id || review._id}
                      onClick={() => setSelectedReview(review)}
                      className={`assignment-card ${selectedReview?.id === review.id ? 'border-primary' : ''}`}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        backgroundColor:
                          selectedReview?.id === (review.id || review._id)
                            ? 'var(--assignment-bg-light)'
                            : 'transparent',
                        border:
                          selectedReview?.id === (review.id || review._id)
                            ? '1px solid var(--assignment-primary)'
                            : '1px solid var(--assignment-border)',
                      }}
                    >
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        {review.assignmentTitle ||
                          review.assignmentId?.title ||
                          'Project Assignment'}
                      </p>
                      <p
                        className='assignment-subtitle'
                        style={{ fontSize: '12px' }}
                      >
                        Reviewee:{' '}
                        {review.revieweeName ||
                          review.revieweeId?.name ||
                          'Student'}
                      </p>
                      <span
                        className={`assignment-badge ${review.status === 'Completed' ? 'badge-submitted' : 'badge-pending'}`}
                        style={{ marginTop: '8px' }}
                      >
                        {review.status || 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Review Form Component */}
          <div className='lg:col-span-2'>
            {!selectedReview ? (
              <div
                className='assignment-card'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '300px',
                }}
              >
                <p className='assignment-subtitle'>
                  Select a submission from the list to start reviewing.
                </p>
              </div>
            ) : (
              <div className='assignment-card'>
                <div
                  className='assignment-header'
                  style={{ marginBottom: '24px' }}
                >
                  <div>
                    <h2
                      className='assignment-title'
                      style={{ fontSize: '20px' }}
                    >
                      {selectedReview.assignmentTitle ||
                        selectedReview.assignmentId?.title ||
                        'Submission Evaluation'}
                    </h2>
                    <p className='assignment-subtitle'>
                      Reviewing:{' '}
                      <strong>
                        {selectedReview.revieweeName ||
                          selectedReview.revieweeId?.name ||
                          'Peer Student'}
                      </strong>
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  {reviewForm.criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className='assignment-detail-section'
                      style={{
                        borderBottom: '1px solid var(--assignment-border)',
                        paddingBottom: '24px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <h4 style={{ margin: 0, fontWeight: '600' }}>
                          {criterion.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type='button'
                              onClick={() =>
                                handleRatingChange(criterion.id, star)
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '20px',
                                color:
                                  star <= criterion.rating
                                    ? 'var(--color-warning)'
                                    : 'var(--assignment-border)',
                              }}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        className='assignment-textarea'
                        placeholder={`Feedback for ${criterion.name.toLowerCase()}...`}
                        value={criterion.comments}
                        onChange={(e) =>
                          handleCommentChange(criterion.id, e.target.value)
                        }
                        rows='2'
                      />
                    </div>
                  ))}

                  <div className='assignment-form-group'>
                    <label className='assignment-label'>Overall Feedback</label>
                    <textarea
                      className='assignment-textarea'
                      placeholder='Summary and constructive suggestions'
                      value={reviewForm.overallComments}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          overallComments: e.target.value,
                        })
                      }
                      rows='4'
                    />
                  </div>

                  <div
                    style={{ display: 'flex', gap: '12px', marginTop: '16px' }}
                  >
                    <button
                      onClick={() => navigate('/assignments')}
                      className='assignment-btn assignment-btn-outline'
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      className='assignment-btn assignment-btn-primary'
                      style={{ flex: 2 }}
                    >
                      Submit Peer Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PeerReview.displayName = 'PeerReview';

export default PeerReview;
