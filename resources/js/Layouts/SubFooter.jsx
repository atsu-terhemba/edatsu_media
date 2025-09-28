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
                   <h4 className="text-m-0 p-0 text-light fw-bold" style={{ fontSize: '2.5em' }}>
                    Network for Entrepreneurs
                    </h4>      
                  <p className="text-light poppins-light" style={{ fontSize: '0.95em', opacity: '0.8' }}>
                    Join over 5,000+ elite entrepreneurs in our community
                  </p>
                  
                  {!user &&
                  <Link
                    href="sign-up"
                    className="btn py-3 text-decoration-none shadow-sm btn-outline-light text-light poppins-semibold px-4 border-light mt-2"
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