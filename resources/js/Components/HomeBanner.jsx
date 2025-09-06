import { Fragment } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from '@inertiajs/react';

export default function HomeBanner() {
    return (
        <Fragment>
            <Container fluid={true}>
                <Row className="footer-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <Row>
                                <Col sm={2}></Col>
                                <Col sm={8}>
                                    <div className="text-center">
                                        <h4 className="text-m-0 p-0 text-light poppins-semibold" style={{ fontSize: '2.5em' }}>
                                            Intelligence-Driven Opportunity Discovery
                                        </h4>
                                        <p className="m-0 p-0 text-light poppins-light">
                                        Advanced intelligence platform that analyzes global funding ecosystems, startup trends, and market patterns to surface hidden opportunities before your competition discovers them.
                                        </p>
                                        <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                                            <div className="d-flex align-items-center text-white">
                                                <span className="badge  bg-success me-2">🎯</span>
                                                99.7% opportunity match accuracy
                                            </div>
                                            <div className="d-flex align-items-center text-white">
                                                <span className="badge  bg-success me-2">📊</span>
                                                Real-time market intelligence
                                            </div>
                                            <div className="d-flex align-items-center text-white">
                                                <span className="badge  bg-success me-2">🧠</span>
                                                Predictive analytics engine
                                            </div>
                                        </div>
                                        <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
                                            <Link
                                                href="/opportunities"
                                                className="btn text-decoration-none shadow-sm btn-lg custom-bg-highlight text-light poppins-semibold px-4 border-0 py-3"
                                            >
                                                Access Intelligence Platform
                                            </Link>
                                            <Link
                                                href="/toolshed"
                                                className="btn text-decoration-none shadow-sm btn-lg btn-outline-light text-light poppins-semibold px-4 border-light py-3"
                                            >
                                                Explore Arsenal
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={2}></Col>
                            </Row>
                        </Container>
                    </div>
                </Row>
            </Container>
        </Fragment>
    );
}
