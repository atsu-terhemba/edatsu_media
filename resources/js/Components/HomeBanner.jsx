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
                                        <h4 className="text-m-0 p-0 text-light fw-bold" style={{ fontSize: '2.5em' }}>
                                        Opportunity Intelligence for Entrepreneurs
                                        </h4>
                                        <p className="m-0 p-0 text-light">
                                            From funding and grants to software and market insights, we help entrepreneurs uncover strategic opportunities that fuel 10x growth
                                        </p>
                                        <div className="mt-4 mx-auto">
                                            <Link
                                                href="/opportunities"
                                                className="me-2 btn text-decoration-none fw-bold shadow-sm custom-bg-highlight text-light px-4 border-0"
                                            >
                                               Find Opportunities
                                            </Link>
                                            <Link
                                                href="/toolshed"
                                                className="ms-2 btn text-decoration-none fw-bold shadow-sm  btn-outline-light text-light px-4 border-light"
                                            >
                                                Explore Tools
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
