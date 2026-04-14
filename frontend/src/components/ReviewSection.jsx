import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

const ReviewSection = ({ entityType, entityId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const { data } = await reviewAPI.getReviews(entityType, entityId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchReviews();
    }
  }, [entityType, entityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await reviewAPI.createReview({
        entityType,
        entityId,
        rating,
        comment
      });
      setSuccess('Review added successfully!');
      setComment('');
      setRating(5);
      
      // Add the new review to the list immediately
      setReviews(prev => [res.data.review, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading reviews...</div>;
  }

  // Calculate Average Rating
  const validReviews = reviews.filter(r => r.rating);
  const avgRating = validReviews.length 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Guest Reviews</h3>
        {reviews.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
            <div className="flex text-yellow-400">
              <Star className="h-6 w-6 fill-yellow-400" />
            </div>
            <span className="text-gray-500">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review Form - Only show if logged in */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  {star <= rating ? (
                    <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="h-8 w-8 text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              id="comment"
              rows={3}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">You must be logged in to leave a review.</p>
          <a href="/login" className="inline-block px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">Log In</a>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
                  {review.user?.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.user?.firstName} {review.user?.lastName}
                  </h4>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 mr-2">
                       {/* Render stars, clamping visual to 5 max just in case */}
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? 
                           <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : 
                           <Star key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
