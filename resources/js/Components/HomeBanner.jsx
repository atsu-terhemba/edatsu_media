import { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import FlatButton from './FlatButton';

export default function HomeBanner() {
    return (
        <Fragment>
            <Container fluid={true}>
                <Row className="hero-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <Row className="justify-content-center">
                                <Col xs={12} md={10} lg={7}>
                                    <div className="text-center">
                                        {/* Badge */}
                                        <span
                                            className="d-inline-block mb-3"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: 'rgba(255, 255, 255, 0.85)',
                                                fontSize: '13px',
                                                fontWeight: 400,
                                                padding: '6px 16px',
                                                borderRadius: '980px',
                                            }}
                                        >
                                            Trusted by 5,000+ Entrepreneurs
                                        </span>

                                        <h1
                                            className="text-white mb-3"
                                            style={{
                                                fontSize: '44px',
                                                fontWeight: 600,
                                                lineHeight: 1.12,
                                                letterSpacing: '-0.005em',
                                            }}
                                        >
                                            Opportunity for{' '}
                                            <span style={{ color: '#d97757' }}>Entrepreneurs</span>
                                        </h1>

                                        <p
                                            className="mx-auto mb-4"
                                            style={{
                                                fontSize: '17px',
                                                lineHeight: 1.47059,
                                                fontWeight: 400,
                                                letterSpacing: '-0.022em',
                                                maxWidth: '520px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                            }}
                                        >
                                            From funding and grants to software and market insights, we help entrepreneurs uncover strategic opportunities that fuel growth.
                                        </p>

                                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-3">
                                            <FlatButton
                                                href="/opportunities"
                                                variant="light"
                                                size="lg"
                                                className="banner-btn-primary"
                                                style={{
                                                    background: '#fff',
                                                    borderColor: '#fff',
                                                    color: '#1d1d1f',
                                                    fontWeight: 400,
                                                    fontSize: '15px',
                                                    padding: '11px 24px',
                                                }}
                                            >
                                                Find Opportunities
                                            </FlatButton>
                                            <FlatButton
                                                href="/toolshed"
                                                variant="outline-light"
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
