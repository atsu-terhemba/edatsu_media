import React, { useState } from 'react';
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
      <div className="d-flex justify-content-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="material-symbols-outlined mx-1"
            style={{
              fontSize: '32px',
              cursor: 'pointer',
              color: star <= rating ? 'gold' : 'gray',
              fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0'
            }}
            onClick={() => handleStarClick(star)}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  if (!props?.auth?.user) {
    return (
      <Card className="text-center">
        <Card.Body className="py-3">
          <Card.Text className="text-secondary">
            <Link href="/login" className="text-primary">Login</Link> to rate this content
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body className="p-3">
        <div className="text-center">
          <StarRating />
          
          {rating > 0 && showFeedbackForm && (
            <Form onSubmit={handleSubmit} className="mt-4">
              <p className='fs-8 m-0 p-0 my-2'>
                We’d love to hear your thoughts on this post! 📢 Let us know what you think—what you liked, what could be better, or any insights you’d like to share. Your feedback helps us improve and create better content for you.</p>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  className='border-0 outline-none shadow-none'
                  placeholder="Leave a comment..."
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{height: '100px'}}
                />
              </Form.Group>
              <Button 
                type="submit" 
                variant="danger" 
                className="fs-9 border-0 me-1 px-3"
              >
              Close
              </Button>
              <Button 
                type="submit" 
                variant="dark" 
                className="fs-9 border-0 px-3"
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