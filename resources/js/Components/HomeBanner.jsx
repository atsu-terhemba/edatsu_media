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
                                    <div className="text-center d-flex flex-column align-items-center">
                                        {/* Eyebrow with orange underline */}
                                        <div className="d-flex flex-column align-items-center mb-4">
                                            <span
                                                className="section-eyebrow"
                                                style={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                }}
                                            >
                                                Trusted by 5,000+ Entrepreneurs
                                            </span>
                                            <div className="eyebrow-bar" />
                                        </div>

                                        {/* Hero H1 */}
                                        <h1
                                            className="text-white mb-4"
                                            style={{
                                                fontSize: 'clamp(36px, 8vw, 60px)',
                                                fontWeight: 600,
                                                lineHeight: 1.1,
                                                letterSpacing: '-0.015em',
                                            }}
                                        >
                                            Opportunity for{' '}
                                            <span style={{ color: '#f97316' }}>Entrepreneurs</span>
                                        </h1>

                                        {/* Subtitle */}
                                        <p
                                            className="mb-3"
                                            style={{
                                                fontSize: 'clamp(16px, 2vw, 18px)',
                                                fontWeight: 300,
                                                color: 'rgba(255, 255, 255, 0.90)',
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            Funding, Grants & Business Tools
                                        </p>

                                        {/* Description */}
                                        <p
                                            className="mx-auto mb-4"
                                            style={{
                                                fontSize: 'clamp(14px, 1.5vw, 16px)',
                                                lineHeight: 1.625,
                                                fontWeight: 400,
                                                maxWidth: '520px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                            }}
                                        >
                                            From funding and grants to software and market insights, we help entrepreneurs uncover strategic opportunities that fuel growth.
                                        </p>

                                        {/* Button group */}
                                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-3">
                                            <a
                                                href="/opportunities"
                                                style={{
                                                    background: '#fff',
                                                    color: '#000',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    padding: '12px 32px',
                                                    borderRadius: '9999px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f1f1f1';
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#fff';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                Find Opportunities
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                            </a>
                                            <a
                                                href="/toolshed"
                                                style={{
                                                    background: 'transparent',
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    padding: '12px 32px',
                                                    borderRadius: '9999px',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                Explore Tools
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>

                        {/* Scroll Indicator */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '32px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <div className="scroll-indicator">
                                <div className="scroll-indicator-dot" />
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </Fragment>
    );
}
