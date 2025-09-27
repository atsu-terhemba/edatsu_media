import { Fragment } from "react"
import GuestLayout from "@/Layouts/GuestLayout"
import Metadata from "@/Components/Metadata"
import FeedbackPanel from '@/Components/FeedbackInfo';
import { Container, Row, Col } from 'react-bootstrap';


export default function Feedback(){
    return(
      <Fragment>
      {/* Feedback Page Heading Section */}
      <Metadata
        title="Feedback | Share Your Thoughts with Edatsu"
        description="We value your feedback! Share your thoughts, suggestions, and experiences with Edatsu to help us improve our platform and services."
        keywords="Edatsu feedback, user feedback, suggestions, comments, platform improvement"
        canonicalUrl="https://www.edatsu.com/feedback"
        ogTitle="Feedback | Share Your Thoughts with Edatsu"
        ogDescription="We value your feedback! Share your thoughts, suggestions, and experiences with Edatsu to help us improve our platform and services."
        ogImage="/img/logo/feedback_banner.jpg"
        ogUrl="https://www.edatsu.com/feedback"
        twitterTitle="Feedback | Share Your Thoughts with Edatsu"
        twitterDescription="We value your feedback! Share your thoughts, suggestions, and experiences with Edatsu to help us improve our platform and services."
        twitterImage="/img/logo/feedback_banner.jpg"
      />
      <GuestLayout>
        <Container className="py-5">
          <Row>
            <Col md={8} className="mx-auto">
              <div className="text-center mb-5">
                <h1 className="display-4 mb-3">We Value Your Feedback</h1>
                <p className="lead text-muted">
                  Your thoughts and suggestions help us improve Edatsu for everyone. 
                  Share your experience with us!
                </p>
              </div>
              
              {/* Feedback Panel */}
              <FeedbackPanel />
            </Col>
          </Row>
        </Container>
      </GuestLayout>
      </Fragment>
    )
}