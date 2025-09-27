import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';
import axios from 'axios';

const ProductRating = ({ productId, isAuthenticated, initialRating = 0, initialCount = 0 }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(initialRating);
    const [totalRatings, setTotalRatings] = useState(initialCount);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [distribution, setDistribution] = useState({});

    useEffect(() => {
        fetchRatings();
    }, [productId]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
    };

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`/product/${productId}/ratings`);
            if (response.data.success) {
                setRatings(response.data.ratings);
                setAverageRating(response.data.average_rating);
                setTotalRatings(response.data.total_ratings);
                setDistribution(response.data.distribution);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            showAlert('Please login to rate this product', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`/product/${productId}/rate`, {
                rating: userRating,
                comment: userComment
            });

            if (response.data.success) {
                showAlert(response.data.message, 'success');
                setShowRatingModal(false);
                setUserRating(0);
                setUserComment('');
                fetchRatings(); // Refresh ratings
            } else {
                showAlert(response.data.message, 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while submitting rating', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return (
            <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 24 : 16}
                        className={`${star <= rating ? 'text-warning' : 'text-muted'} ${interactive ? 'cursor-pointer' : ''}`}
                        fill={star <= rating ? 'currentColor' : 'none'}
                        onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
                        style={{ cursor: interactive ? 'pointer' : 'default' }}
                    />
                ))}
            </div>
        );
    };

    const renderRatingDistribution = () => {
        return (
            <div className="mb-4">
                <h6>Rating Breakdown</h6>
                {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="d-flex align-items-center mb-2">
                        <span className="me-2 text-muted" style={{ minWidth: '20px' }}>{stars}</span>
                        <Star size={14} className="text-warning me-2" fill="currentColor" />
                        <div className="flex-grow-1 me-2">
                            <div className="progress" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar bg-warning"
                                    style={{ width: `${distribution[stars]?.percentage || 0}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-muted" style={{ minWidth: '40px' }}>
                            {distribution[stars]?.count || 0}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {alert.show && (
                <Alert variant={alert.type} onClose={() => setAlert({show: false, message: '', type: 'success'})} dismissible>
                    {alert.message}
                </Alert>
            )}

            {/* Rating Summary */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <div className="me-3">
                        <div className="d-flex align-items-center mb-1">
                            {renderStars(Math.round(averageRating))}
                            <span className="ms-2 fw-bold">{averageRating}</span>
                            <span className="ms-1 text-muted">({totalRatings} ratings)</span>
                        </div>
                    </div>
                </div>
                
                <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowRatingModal(true)}
                    className="d-flex align-items-center gap-1"
                >
                    <Star size={16} />
                    Rate Product
                </Button>
            </div>

            {/* Rating Distribution */}
            {totalRatings > 0 && renderRatingDistribution()}

            {/* Recent Ratings */}
            <div>
                <h6 className="mb-3">Recent Reviews</h6>
                {ratings.length > 0 ? (
                    <div className="rating-list">
                        {ratings.slice(0, 3).map((rating) => (
                            <Card key={rating.id} className="mb-3 border-0 bg-light">
                                <Card.Body className="py-3">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center mb-2">
                                                <strong className="me-2">{rating.user?.name || 'Anonymous'}</strong>
                                                {renderStars(rating.rating)}
                                                <span className="ms-2 text-muted small">
                                                    {new Date(rating.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {rating.comment && (
                                                <p className="mb-0 text-muted">{rating.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                        
                        {ratings.length > 3 && (
                            <Button variant="outline-secondary" size="sm" className="w-100">
                                View All {totalRatings} Reviews
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <MessageCircle size={48} className="text-muted mb-3" />
                        <p className="text-muted">No reviews yet. Be the first to rate this product!</p>
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Rate This Product</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRatingSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Your Rating *</Form.Label>
                            <div className="d-flex align-items-center">
                                {renderStars(userRating, true, setUserRating)}
                                <span className="ms-3 text-muted">
                                    {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Click to rate'}
                                </span>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Your Review (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                maxLength={1000}
                            />
                            <Form.Text className="text-muted">
                                {userComment.length}/1000 characters
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={isLoading || userRating === 0}
                        >
                            {isLoading ? 'Submitting...' : 'Submit Rating'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductRating;
