import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, Form, Button } from 'react-bootstrap';
import { Head, Link, usePage } from '@inertiajs/react';

const FeedbackComponent = ({ onSubmitFeedback, postID}) => {
  const {props} = usePage(); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    setShowFeedbackForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await onSubmitFeedback({ rating, comment });
      
      setSuccessMessage('Thank you for your feedback!');
      setErrorMessage('');
      
      // Reset all states, including closing the form
      setRating(0);
      setComment('');
      setShowFeedbackForm(false);
    } catch (error) {
      setErrorMessage('Failed to submit feedback. Please try again.');
      setSuccessMessage('');
    }
  };

  const StarRating = () => {
    return (
      <div className="d-flex justify-content-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={32}
            fill={star <= rating ? 'gold' : 'none'}
            stroke={star <= rating ? 'gold' : 'gray'}
            className="mx-1"
            style={{cursor: 'pointer'}}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>
    );
  };

  if (!props?.auth?.user) {
    return (
      <Card className="text-center">
        <Card.Body className="py-3">
          <Card.Text className="text-secondary">
            <a href="/login" className="poppins-semibold">Login</a> to rate this content
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body className="p-4">
        <div className="text-center">
          <StarRating />
          
          {rating > 0 && showFeedbackForm && (
            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{height: '100px'}}
                />
              </Form.Group>
              
              <Button 
                type="submit" 
                variant="dark" 
                className="fs-9 poppins-semibold"
              >
                Submit Feedback
              </Button>
            </Form>
          )}
          
          {successMessage && (
            <p className="text-success poppins-semibold mt-3">
              {successMessage}
            </p>
          )}
          
          {errorMessage && (
            <p className="text-danger poppins-semibold mt-3">
              {errorMessage}
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FeedbackComponent;