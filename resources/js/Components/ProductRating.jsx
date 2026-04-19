import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';

const ProductRating = ({ productId, isAuthenticated, initialRating = 0, initialCount = 0, showRatingForm = true }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(Number(initialRating) || 0);
    const [totalRatings, setTotalRatings] = useState(Number(initialCount) || 0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [distribution, setDistribution] = useState({});

    useEffect(() => {
        if (productId) {
            fetchRatings();
        }
    }, [productId]);

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`/product/${productId}/ratings`);

            if (response.data.success) {
                const fetchedRatings = response.data.ratings || [];
                let fetchedDistribution = response.data.distribution || {};

                if (!fetchedDistribution || Object.keys(fetchedDistribution).length === 0) {
                    fetchedDistribution = calculateDistribution(fetchedRatings);
                }

                setRatings(fetchedRatings);
                setAverageRating(Number(response.data.average_rating) || 0);
                setTotalRatings(Number(response.data.total_ratings) || fetchedRatings.length);
                setDistribution(fetchedDistribution);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const calculateDistribution = (ratingsArray) => {
        const dist = {};
        const total = ratingsArray.length;

        [5, 4, 3, 2, 1].forEach(star => {
            dist[star] = { count: 0, percentage: 0 };
        });

        ratingsArray.forEach(rating => {
            const stars = Math.round(Number(rating.rating));
            if (stars >= 1 && stars <= 5) {
                dist[stars].count += 1;
            }
        });

        Object.keys(dist).forEach(star => {
            if (total > 0) {
                dist[star].percentage = Math.round((dist[star].count / total) * 100);
            }
        });

        return dist;
    };

    const swalOptions = (opts = {}) => ({
        confirmButtonColor: '#000',
        showClass: { popup: 'animate__animated animate__zoomIn animate__faster' },
        hideClass: { popup: 'animate__animated animate__zoomOut animate__faster' },
        customClass: {
            popup: 'swal-modern-popup',
            title: 'swal-modern-title',
            content: 'swal-modern-content',
            confirmButton: 'swal-modern-confirm',
        },
        ...opts,
    });

    const handleStarClick = (star) => {
        if (!isAuthenticated) {
            Swal.fire(swalOptions({
                title: 'Login Required',
                text: 'Please login to rate this product',
                icon: 'warning',
                confirmButtonText: 'Okay',
            }));
            return;
        }
        setUserRating(star);
        setShowCommentModal(true);
    };

    const handleRatingSubmit = async () => {
        if (!isAuthenticated) {
            Swal.fire(swalOptions({
                title: 'Login Required',
                text: 'Please login to rate this product',
                icon: 'warning',
                confirmButtonText: 'Okay',
            }));
            return;
        }

        if (userRating === 0) {
            Swal.fire(swalOptions({
                title: 'Rating Required',
                text: 'Please select a star rating',
                icon: 'warning',
                confirmButtonText: 'Okay',
            }));
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`/product/${productId}/rate`, {
                rating: userRating,
                comment: userComment
            });

            if (response.data.success) {
                Swal.fire(swalOptions({
                    title: 'Thanks for your review',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Done',
                    timer: 2000,
                }));
                setUserRating(0);
                setUserComment('');
                await fetchRatings();

                setTimeout(() => {
                    const reviewsSection = document.querySelector('.recent-reviews-preview');
                    if (reviewsSection) {
                        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 500);
            }
        } catch (error) {
            Swal.fire(swalOptions({
                title: 'Something went wrong',
                text: error.response?.data?.message || 'An error occurred while submitting rating',
                icon: 'error',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#000',
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const ratingLabel = (n) => {
        if (n === 1) return 'Poor';
        if (n === 2) return 'Fair';
        if (n === 3) return 'Good';
        if (n === 4) return 'Very Good';
        if (n === 5) return 'Excellent';
        return '';
    };

    const renderStars = (rating, interactive = false, size = null) => {
        const displayRating = interactive ? (hoverRating || userRating) : rating;
        const fontSize = size || (interactive ? '36px' : '16px');

        return (
            <div className="d-flex gap-1 align-items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    return (
                        <span
                            key={star}
                            className={`material-symbols-outlined ${interactive ? 'rating-star-interactive' : ''}`}
                            style={{
                                fontSize,
                                color: isFilled ? '#f97316' : '#e5e5e5',
                                fontVariationSettings: isFilled
                                    ? '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 24'
                                    : '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 24',
                                cursor: interactive ? 'pointer' : 'default',
                                transition: 'transform 0.15s ease, color 0.15s ease',
                            }}
                            onClick={interactive ? () => handleStarClick(star) : undefined}
                            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                        >
                            star
                        </span>
                    );
                })}
            </div>
        );
    };

    const renderRatingDistribution = () => {
        return (
            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((stars) => {
                    const count = distribution[stars]?.count || 0;
                    const percentage = distribution[stars]?.percentage || 0;

                    return (
                        <div key={stars} className="d-flex align-items-center" style={{ marginBottom: '10px' }}>
                            <span style={{
                                minWidth: '32px',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#000',
                            }}>
                                {stars}
                            </span>
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '14px',
                                    color: '#f97316',
                                    fontVariationSettings: '"FILL" 1',
                                    marginRight: '10px',
                                }}
                            >
                                star
                            </span>
                            <div className="flex-grow-1" style={{ marginRight: '12px' }}>
                                <div style={{
                                    height: '6px',
                                    background: '#f5f5f7',
                                    borderRadius: '9999px',
                                    overflow: 'hidden',
                                }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: '#f97316',
                                            borderRadius: '9999px',
                                            transition: 'width 0.3s ease',
                                        }}
                                    />
                                </div>
                            </div>
                            <span style={{
                                minWidth: '32px',
                                fontSize: '12px',
                                color: '#86868b',
                                textAlign: 'right',
                            }}>
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const Eyebrow = ({ children }) => (
        <div style={{ marginBottom: '16px' }}>
            <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#86868b',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '6px',
            }}>
                {children}
            </div>
            <div style={{ width: '28px', height: '2px', background: '#f97316', borderRadius: '2px' }} />
        </div>
    );

    return (
        <div className="product-rating-container">
            {totalRatings > 0 && (
                <div style={{
                    marginBottom: '24px',
                    background: '#f5f5f7',
                    borderRadius: '16px',
                    overflow: 'hidden',
                }}>
                    <div className="row g-0 align-items-center">
                        <div className="col-md-4 text-center" style={{ padding: '20px 24px', borderRight: '1px solid #e5e5e5' }}>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontSize: '44px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
                                    {Number(averageRating).toFixed(1)}
                                </span>
                                <span style={{ fontSize: '16px', color: '#86868b', marginLeft: '2px' }}>/5</span>
                            </div>
                            <div className="d-flex justify-content-center" style={{ marginBottom: '8px' }}>
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <p style={{ fontSize: '12px', color: '#86868b', margin: 0 }}>
                                {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>

                        <div className="col-md-8" style={{ padding: '20px 24px' }}>
                            <Eyebrow>Breakdown</Eyebrow>
                            {totalRatings > 0 ? (
                                renderRatingDistribution()
                            ) : (
                                <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>No ratings yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showRatingForm && (
                <div className="add-rating-section">
                    <div style={{ padding: '8px 0' }}>
                        <div className="d-flex justify-content-center" style={{ marginBottom: '12px' }}>
                            {renderStars(userRating, true)}
                        </div>
                        <p style={{
                            fontSize: '13px',
                            color: '#86868b',
                            textAlign: 'center',
                            margin: 0,
                            minHeight: '20px',
                        }}>
                            {userRating > 0 ? ratingLabel(userRating) : 'Tap a star to rate this tool'}
                        </p>
                    </div>
                </div>
            )}

            {/* Comment Modal */}
            <Modal
                show={showCommentModal}
                onHide={() => setShowCommentModal(false)}
                centered
                dialogClassName="edatsu-rating-modal"
            >
                <Modal.Body style={{ padding: '32px' }}>
                    <div className="d-flex align-items-start justify-content-between" style={{ marginBottom: '20px' }}>
                        <div>
                            <Eyebrow>Your Review</Eyebrow>
                            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#000', margin: 0, letterSpacing: '-0.01em' }}>
                                Share your experience
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowCommentModal(false)}
                            aria-label="Close"
                            style={{
                                border: 'none',
                                background: '#f5f5f7',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>close</span>
                        </button>
                    </div>

                    <div style={{
                        background: '#f5f5f7',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}>
                        <div className="d-flex justify-content-center" style={{ marginBottom: '10px' }}>
                            {renderStars(userRating, false, '28px')}
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#000', margin: 0 }}>
                            {ratingLabel(userRating) || 'Select a rating'}
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#000',
                            marginBottom: '8px',
                            letterSpacing: '0.02em',
                        }}>
                            Your review <span style={{ color: '#86868b', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea
                            rows="4"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="What did you like? What could be better?"
                            maxLength={1000}
                            style={{
                                width: '100%',
                                border: '1px solid #e5e5e5',
                                borderRadius: '12px',
                                padding: '12px 14px',
                                fontSize: '14px',
                                color: '#000',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.15s ease',
                                fontFamily: 'inherit',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#000')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                        />
                        <div style={{ textAlign: 'right', fontSize: '11px', color: '#86868b', marginTop: '6px' }}>
                            {userComment.length}/1000
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            onClick={() => {
                                setShowCommentModal(false);
                                setUserRating(0);
                                setUserComment('');
                            }}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '9999px',
                                border: '1px solid #e5e5e5',
                                background: '#fff',
                                color: '#000',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f7')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setShowCommentModal(false);
                                handleRatingSubmit();
                            }}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '9999px',
                                border: 'none',
                                background: '#000',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#333')}
                            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = '#000')}
                        >
                            {isLoading ? 'Submitting…' : 'Submit review'}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* All Reviews (inline) */}
            {ratings && ratings.length > 0 && (
                <div className="all-reviews-section recent-reviews-preview" style={{ marginTop: '32px' }}>
                    <Eyebrow>Reviews ({ratings.length})</Eyebrow>

                    {ratings.map((rating) => (
                        <div
                            key={rating.id}
                            className="review-item"
                            style={{
                                padding: '20px 0',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                        >
                            <div className="d-flex align-items-start gap-3">
                                <div
                                    className="edatsu-avatar"
                                    aria-hidden="true"
                                >
                                    {(rating.user?.name || 'A')[0].toUpperCase()}
                                </div>
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ marginBottom: '4px' }}>
                                        <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#000', margin: 0 }}>
                                            {rating.user?.name || 'Anonymous'}
                                        </h6>
                                        <span style={{ fontSize: '12px', color: '#86868b' }}>
                                            {new Date(rating.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        {renderStars(rating.rating)}
                                    </div>
                                    {rating.comment && (
                                        <p style={{
                                            fontSize: '13px',
                                            color: '#424245',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}>
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
            <Modal
                show={showAllReviewsModal}
                onHide={() => setShowAllReviewsModal(false)}
                size="lg"
                centered
                dialogClassName="edatsu-rating-modal"
            >
                <Modal.Body style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="d-flex align-items-start justify-content-between" style={{ marginBottom: '24px' }}>
                        <div>
                            <Eyebrow>Customer Reviews</Eyebrow>
                            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#000', margin: 0, letterSpacing: '-0.01em' }}>
                                {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAllReviewsModal(false)}
                            aria-label="Close"
                            style={{
                                border: 'none',
                                background: '#f5f5f7',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>close</span>
                        </button>
                    </div>

                    <div style={{
                        background: '#f5f5f7',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px',
                    }}>
                        <div className="row align-items-center g-3">
                            <div className="col-md-4 text-center">
                                <div style={{ marginBottom: '6px' }}>
                                    <span style={{ fontSize: '40px', fontWeight: 600, color: '#000', letterSpacing: '-0.02em' }}>
                                        {Number(averageRating).toFixed(1)}
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#86868b', marginLeft: '2px' }}>/5</span>
                                </div>
                                <div className="d-flex justify-content-center" style={{ marginBottom: '6px' }}>
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <p style={{ fontSize: '12px', color: '#86868b', margin: 0 }}>
                                    {totalRatings} total
                                </p>
                            </div>
                            <div className="col-md-8">
                                {renderRatingDistribution()}
                            </div>
                        </div>
                    </div>

                    {ratings && ratings.length > 0 ? (
                        <div className="reviews-list">
                            {ratings.map((rating) => (
                                <div
                                    key={rating.id}
                                    style={{
                                        padding: '20px 0',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}
                                >
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="edatsu-avatar" aria-hidden="true">
                                            {(rating.user?.name || 'A')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ marginBottom: '4px' }}>
                                                <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#000', margin: 0 }}>
                                                    {rating.user?.name || 'Anonymous'}
                                                </h6>
                                                <span style={{ fontSize: '12px', color: '#86868b' }}>
                                                    {new Date(rating.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                {renderStars(rating.rating)}
                                            </div>
                                            {rating.comment && (
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: '#424245',
                                                    lineHeight: 1.6,
                                                    margin: 0,
                                                }}>
                                                    {rating.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '48px', color: '#e5e5e5', marginBottom: '12px' }}
                            >
                                rate_review
                            </span>
                            <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>No reviews yet</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                .product-rating-container {
                    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .rating-star-interactive:hover {
                    transform: scale(1.12);
                }

                .edatsu-rating-modal .modal-content {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
                    overflow: hidden;
                }

                .edatsu-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f5f5f7;
                    color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .review-item:last-child,
                .reviews-list > div:last-child {
                    border-bottom: none !important;
                }

                .recent-reviews-preview {
                    animation: fadeIn 0.4s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProductRating;
