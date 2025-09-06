import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, usePage } from '@inertiajs/react';

export default function SubFooter({isDarkMode}){

  const user = usePage().props.auth.user;
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Here you would typically make an API call to subscribe the user
    // For now, we'll just simulate the process
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      // You could show a success message here
    }, 1000);
  };
  
    return (
<Fragment>
<Container fluid={true}>
      <Row className={`footer-banner position-relative border-0 ${isDarkMode ? 'dark-banner' : ''}`}>
        <div className="overlay d-flex align-items-center">
          <Container>
            <Row>
                            <Col sm={2}></Col>
              <Col sm={8}>
                <div className="text-center">
                  <h4 className="text-m-0 p-0 text-light poppins-semibold" style={{ fontSize: '2.5em' }}>
                    Join the Intelligence Network
                  </h4>
                  <p className="m-0 p-0 text-light poppins-light mb-4">
                    Get classified opportunity intelligence, strategic market analysis, and mission-critical business tools delivered weekly to your secure inbox.
                  </p>
                  
                  <Form onSubmit={handleSubscribe} className="mb-3">
                    <Row className="justify-content-center">
                      <Col md={8} lg={6}>
                        <InputGroup size="lg">
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '12px 0 0 12px'
                            }}
                            className="text-light"
                          />
                          <Button
                            type="submit"
                            disabled={isSubscribing}
                            style={{
                              backgroundColor: '#FF9800',
                              border: 'none',
                              borderRadius: '0 12px 12px 0',
                              fontWeight: '600',
                              padding: '0.75rem 2rem'
                            }}
                          >
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                          </Button>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form>
                  
                  <p className="text-light poppins-light" style={{ fontSize: '0.95em', opacity: '0.8' }}>
                    Join 50,000+ elite entrepreneurs in our intelligence network
                  </p>
                  
                  {!user &&
                  <Link
                    href="sign-up"
                    className="btn text-decoration-none shadow-sm btn-outline-light text-light poppins-semibold px-4 border-light py-2 mt-2"
                    style={{ borderRadius: '8px' }}
                  >
                    Create Free Account
                  </Link>
                  }
                </div>
              </Col>
              <Col sm={2}></Col>
            </Row>
          </Container>
        </div>
      </Row>
    </Container>
</Fragment>
    )
}