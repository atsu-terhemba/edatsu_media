import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';

const ProductRating = ({ productId, isAuthenticated, initialRating = 0, initialCount = 0 }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(Number(initialRating) || 0);
    const [totalRatings, setTotalRatings] = useState(Number(initialCount) || 0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
    const [distribution, setDistribution] = useState({});

    useEffect(() => {
        fetchRatings();
    }, [productId]);

    const fetchRatings = async () => {
        try {
            console.log('Fetching ratings for product:', productId);
            const response = await axios.get(`/product/${productId}/ratings`);
            console.log('Ratings response:', response.data);
            
            if (response.data.success) {
                const fetchedRatings = response.data.ratings || [];
                const fetchedDistribution = response.data.distribution || {};
                
                console.log('Fetched ratings array:', fetchedRatings);
                console.log('Fetched distribution:', fetchedDistribution);
                console.log('Number of ratings:', fetchedRatings.length);
                
                setRatings(fetchedRatings);
                setAverageRating(Number(response.data.average_rating) || 0);
                setTotalRatings(Number(response.data.total_ratings) || 0);
                setDistribution(fetchedDistribution);
                
                console.log('State updated - ratings count:', fetchedRatings.length);
                console.log('State updated - distribution:', fetchedDistribution);
            } else {
                console.error('API returned success:false', response.data);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            console.error('Error details:', error.response?.data);
        }
    };

    const handleRatingSubmit = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to rate this product',
                icon: 'warning',
                confirmButtonColor: '#0078d4'
            });
            return;
        }

        if (userRating === 0) {
            Swal.fire({
                title: 'Rating Required',
                text: 'Please select a star rating',
                icon: 'warning',
                confirmButtonColor: '#0078d4'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`/product/${productId}/rate`, {
                rating: userRating,
                comment: userComment
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#0078d4',
                    timer: 2000
                });
                setUserRating(0);
                setUserComment('');
                await fetchRatings(); // Wait for ratings to refresh
                
                // Scroll to reviews section to show the new review
                setTimeout(() => {
                    const reviewsSection = document.querySelector('.recent-reviews-preview');
                    if (reviewsSection) {
                        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 500);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'An error occurred while submitting rating',
                icon: 'error',
                confirmButtonColor: '#d13438'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating, interactive = false) => {
        const displayRating = interactive ? (hoverRating || userRating) : rating;
        
        return (
            <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`material-symbols-outlined ${interactive ? 'rating-star-interactive' : 'rating-star'}`}
                        style={{
                            fontSize: interactive ? '32px' : '20px',
                            color: star <= displayRating ? '#fbbf24' : '#d1d5db',
                            fontVariationSettings: star <= displayRating ? '"FILL" 1, "wght" 400' : '"FILL" 0, "wght" 400',
                            cursor: interactive ? 'pointer' : 'default',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={interactive ? () => setUserRating(star) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    >
                        star
                    </span>
                ))}
            </div>
        );
    };

    const renderRatingDistribution = () => {
        console.log('Rendering distribution with data:', distribution);
        
        return (
            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((stars) => {
                    const count = distribution[stars]?.count || 0;
                    const percentage = distribution[stars]?.percentage || 0;
                    console.log(`${stars} stars: ${count} ratings (${percentage}%)`);
                    
                    return (
                        <div key={stars} className="d-flex align-items-center mb-2">
                            <span className="me-2" style={{ minWidth: '60px', fontSize: '14px' }}>
                                {stars} {stars === 1 ? 'star' : 'stars'}
                            </span>
                            <div className="flex-grow-1 me-3">
                                <div className="progress" style={{ height: '8px', backgroundColor: '#e5e7eb' }}>
                                    <div
                                        className="progress-bar"
                                        style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: '#fbbf24',
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="text-muted" style={{ minWidth: '35px', fontSize: '14px' }}>
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="product-rating-container">
            {/* Overall Rating Summary - E-commerce Style */}
            <div className="rating-overview mb-4 p-4 border rounded">
                <div className="row">
                    {/* Left: Average Rating */}
                    <div className="col-md-4 text-center border-end">
                        <div className="mb-2">
                            <span className="display-4 fw-bold">{Number(averageRating).toFixed(1)}</span>
                            <span className="text-muted fs-5">/5</span>
                        </div>
                        <div className="mb-2">
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <p className="text-muted mb-0">
                            Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Right: Rating Distribution */}
                    <div className="col-md-8">
                        <h6 className="mb-3 fw-bold">Rating Breakdown</h6>
                        {totalRatings > 0 ? (
                            renderRatingDistribution()
                        ) : (
                            <p className="text-muted text-center py-3">No ratings yet</p>
                        )}
                    </div>
                </div>

                {/* View All Reviews Button */}
                {totalRatings > 0 && (
                    <div className="text-center mt-3 pt-3 border-top">
                        <button
                            className="action-button btn-outline-modern"
                            onClick={() => setShowAllReviewsModal(true)}
                        >
                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>rate_review</span>
                            View All {totalRatings} Reviews
                        </button>
                    </div>
                )}
            </div>

            {/* Add Your Rating Section */}
            <div className="add-rating-section p-4 border rounded">
                <h5 className="mb-3 fw-bold">Rate This Tool</h5>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Your Rating</label>
                    {renderStars(userRating, true)}
                    {userRating > 0 && (
                        <p className="text-muted small mt-2 mb-0">
                            {userRating === 1 && 'Poor'}
                            {userRating === 2 && 'Fair'}
                            {userRating === 3 && 'Good'}
                            {userRating === 4 && 'Very Good'}
                            {userRating === 5 && 'Excellent'}
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Your Review (Optional)</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Share your experience with this tool..."
                        maxLength={1000}
                    />
                    <small className="text-muted">{userComment.length}/1000</small>
                </div>

                <button
                    className="action-button btn-primary-modern"
                    onClick={handleRatingSubmit}
                    disabled={isLoading || userRating === 0}
                >
                    {isLoading ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>

            {/* Recent Reviews Preview - Shows latest 3 reviews */}
            {console.log('Checking recent reviews render condition:', { hasRatings: !!ratings, ratingsLength: ratings?.length })}
            {ratings && ratings.length > 0 && (
                <div className="recent-reviews-preview mb-4 p-4 border rounded">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="fw-bold mb-0">Recent Reviews ({ratings.length} total)</h5>
                        {ratings.length > 3 && (
                            <button
                                className="btn btn-link text-decoration-none p-0"
                                onClick={() => setShowAllReviewsModal(true)}
                            >
                                View all {totalRatings} reviews →
                            </button>
                        )}
                    </div>
                    
                    {ratings.slice(0, 3).map((rating) => (
                        <div key={rating.id} className="review-item mb-3 pb-3 border-bottom last-child-no-border">
                            <div className="d-flex align-items-start justify-content-between mb-2">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="avatar-circle me-2" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                                            {(rating.user?.name || 'A')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-semibold">{rating.user?.name || 'Anonymous'}</h6>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex align-items-center">
                                                    {renderStars(rating.rating)}
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(rating.created_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="mb-0 text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                            {rating.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* All Reviews Modal */}
            <Modal show={showAllReviewsModal} onHide={() => setShowAllReviewsModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">
                        Customer Reviews ({totalRatings})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* Rating Summary in Modal */}
                    <div className="mb-4 pb-4 border-bottom">
                        <div className="row align-items-center">
                            <div className="col-md-4 text-center">
                                <div className="mb-2">
                                    <span className="display-5 fw-bold">{Number(averageRating).toFixed(1)}</span>
                                    <span className="text-muted fs-6">/5</span>
                                </div>
                                <div className="mb-2">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <p className="text-muted small mb-0">{totalRatings} total reviews</p>
                            </div>
                            <div className="col-md-8">
                                {renderRatingDistribution()}
                            </div>
                        </div>
                    </div>

                    {/* All Reviews List */}
                    {ratings && ratings.length > 0 ? (
                        <div className="reviews-list">
                            {ratings.map((rating) => (
                                <div key={rating.id} className="review-item mb-4 pb-4 border-bottom">
                                    <div className="d-flex align-items-start justify-content-between mb-2">
                                        <div>
                                            <div className="d-flex align-items-center mb-2">
                                                <div className="avatar-circle me-2">
                                                    {(rating.user?.name || 'A')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-semibold">{rating.user?.name || 'Anonymous'}</h6>
                                                    <small className="text-muted">
                                                        {new Date(rating.created_at).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {renderStars(rating.rating)}
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="mb-0 text-secondary" style={{ lineHeight: '1.6' }}>
                                            {rating.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <span className="material-symbols-outlined text-muted mb-3" style={{fontSize: '48px'}}>
                                rate_review
                            </span>
                            <p className="text-muted">No reviews yet</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                .rating-star-interactive:hover {
                    transform: scale(1.1);
                }
                
                .product-rating-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }

                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                }

                .review-item:last-child {
                    border-bottom: none !important;
                    padding-bottom: 0 !important;
                    margin-bottom: 0 !important;
                }

                .rating-overview {
                    background: #fafafa;
                }
                
                .recent-reviews-preview {
                    animation: fadeIn 0.5s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProductRating;
