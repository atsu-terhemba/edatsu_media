import { Fragment } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import FlatButton from './FlatButton';

export default function HomeBanner() {
    return (
        <Fragment>
            <Container fluid={true}>
                <Row className="footer-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <Row>
                                <Col sm={12}>
                                    <div className="text-center bg-red-500">
                                        <h1 
                                            className="text-m-0 mb-3 p-0 text-light fw-bold" 
                                            style={{ 
                                                fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                                                lineHeight: '1.2'
                                            }}
                                        >
                                        Opportunity for Entrepreneurs
                                        </h1 >  
                                        <p 
                                            className="banner-subtitle text-light mb-4 px-2 px-sm-0"
                                            style={{
                                                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                                                lineHeight: '1.5',
                                                maxWidth: '600px',
                                                margin: '0 auto 1.5rem'
                                            }}
                                        >
                                            From funding and grants to software and market insights, we help entrepreneurs uncover strategic opportunities that fuel 10x growth
                                        </p>
                                        <div className="banner-buttons d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                                            <FlatButton
                                                href="/opportunities"
                                                variant="primary"
                                                size="lg"
                                                className="banner-btn-primary"
                                            >
                                               Find Opportunities
                                            </FlatButton>
                                            <FlatButton
                                                href="/toolshed"
                                                variant="outline-primary"
                                                size="lg"
                                                className="banner-btn-secondary"
                                            >
                                                Explore Tools
                                            </FlatButton>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Row>
            </Container>
        </Fragment>
    );
}
