import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { MessageCircle, Reply, Send, Heart, MoreVertical } from 'lucide-react';
import axios from 'axios';

const ProductComments = ({ productId, isAuthenticated }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState({});
    const [showReplyForm, setShowReplyForm] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    // Debug logging
    console.log('ProductComments: Component rendered with props:', { productId, isAuthenticated });
    console.log('ProductComments: Current comments state:', comments);
    console.log('ProductComments: Comments count:', comments.length);

    useEffect(() => {
        console.log('ProductComments: useEffect triggered, productId:', productId);
        fetchComments();
    }, [productId]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
    };

    const fetchComments = async () => {
        console.log('ProductComments: Fetching comments for product ID:', productId);
        try {
            const response = await axios.get(`/product/${productId}/comments`);
            console.log('ProductComments: Response received:', response);
            console.log('ProductComments: Response data:', response.data);
            if (response.data.success) {
                console.log('ProductComments: Setting comments:', response.data.comments);
                setComments(response.data.comments);
            } else {
                console.error('ProductComments: Response not successful:', response.data);
            }
        } catch (error) {
            console.error('ProductComments: Error fetching comments:', error);
            console.error('ProductComments: Error response:', error.response);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            showAlert('Please login to comment', 'warning');
            return;
        }

        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`/product/${productId}/comment`, {
                comment: newComment
            });

            if (response.data.success) {
                showAlert(response.data.message, 'success');
                setNewComment('');
                fetchComments(); // Refresh comments
            } else {
                showAlert(response.data.message, 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while posting comment', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReplySubmit = async (commentId) => {
        if (!isAuthenticated) {
            showAlert('Please login to reply', 'warning');
            return;
        }

        const reply = replyText[commentId];
        if (!reply?.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`/comment/${commentId}/reply`, {
                comment: reply
            });

            if (response.data.success) {
                showAlert(response.data.message, 'success');
                setReplyText({ ...replyText, [commentId]: '' });
                setShowReplyForm({ ...showReplyForm, [commentId]: false });
                fetchComments(); // Refresh comments
            } else {
                showAlert(response.data.message, 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while posting reply', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleReplyForm = (commentId) => {
        setShowReplyForm({
            ...showReplyForm,
            [commentId]: !showReplyForm[commentId]
        });
    };

    const handleReplyTextChange = (commentId, text) => {
        setReplyText({
            ...replyText,
            [commentId]: text
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    };

    const renderComment = (comment, isReply = false) => {
        return (
            <div key={comment.id} className={`${isReply ? 'ms-4 mt-3' : 'mb-4'}`}>
                <Card className={`border-0 ${isReply ? 'bg-light' : 'bg-white'}`}>
                    <Card.Body className="py-3">
                        <div className="d-flex align-items-start">
                            {/* User Avatar */}
                            <div className="me-3">
                                <div 
                                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                    style={{ width: '40px', height: '40px', fontSize: '14px' }}
                                >
                                    {comment.user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                            
                            <div className="flex-grow-1">
                                {/* Comment Header */}
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <strong className="me-2">{comment.user?.name || 'Anonymous'}</strong>
                                        {!isReply && (
                                            <Badge bg="secondary" className="me-2">Top Level</Badge>
                                        )}
                                        <span className="text-muted small">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <Button variant="link" size="sm" className="text-muted p-0">
                                        <MoreVertical size={16} />
                                    </Button>
                                </div>
                                
                                {/* Comment Content */}
                                <p className="mb-2 text-dark">{comment.comment}</p>
                                
                                {/* Comment Actions */}
                                {!isReply && (
                                    <div className="d-flex align-items-center gap-3">
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-muted p-0 d-flex align-items-center gap-1"
                                            onClick={() => toggleReplyForm(comment.id)}
                                        >
                                            <Reply size={14} />
                                            Reply
                                        </Button>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-muted p-0 d-flex align-items-center gap-1"
                                        >
                                            <Heart size={14} />
                                            Like
                                        </Button>
                                        {comment.replies && comment.replies.length > 0 && (
                                            <span className="text-muted small">
                                                {comment.replies.length} replies
                                            </span>
                                        )}
                                    </div>
                                )}
                                
                                {/* Reply Form */}
                                {showReplyForm[comment.id] && (
                                    <div className="mt-3">
                                        <Form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id); }}>
                                            <div className="d-flex gap-2">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Write a reply..."
                                                    value={replyText[comment.id] || ''}
                                                    onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
                                                    disabled={!isAuthenticated}
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    size="sm"
                                                    disabled={isLoading || !replyText[comment.id]?.trim()}
                                                    className="align-self-start"
                                                >
                                                    <Send size={14} />
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                
                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
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

            {/* Comment Form */}
            <Card className="mb-4">
                <Card.Body>
                    <h6 className="mb-3 d-flex align-items-center">
                        <MessageCircle size={20} className="me-2 text-primary" />
                        Leave a Comment
                    </h6>
                    
                    {isAuthenticated ? (
                        <Form onSubmit={handleCommentSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Share your thoughts about this product..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    maxLength={2000}
                                />
                                <Form.Text className="text-muted">
                                    {newComment.length}/2000 characters
                                </Form.Text>
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading || !newComment.trim()}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <Send size={16} />
                                    {isLoading ? 'Posting...' : 'Post Comment'}
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted mb-3">Please login to leave a comment</p>
                            <Button variant="outline-primary" href="/login">
                                Login to Comment
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Comments List */}
            <div>
                <h6 className="mb-3">
                    Comments ({comments.length})
                </h6>
                
                {/* Debug Info */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
                    <strong>Debug Info:</strong><br/>
                    Product ID: {productId}<br/>
                    Comments Array Length: {comments.length}<br/>
                    Comments Data: {JSON.stringify(comments, null, 2)}<br/>
                    Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}
                </div>
                
                {comments.length > 0 ? (
                    <div className="comments-list">
                        {comments.map(comment => renderComment(comment))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <MessageCircle size={48} className="text-muted mb-3" />
                        <h6 className="text-muted mb-2">No comments yet</h6>
                        <p className="text-muted">Be the first to share your thoughts about this product!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductComments;
