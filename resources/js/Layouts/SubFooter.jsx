import { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { usePage, Link } from '@inertiajs/react';

export default function SubFooter() {
    const user = usePage().props.auth.user;

    return (
        <Fragment>
            <Container fluid={true}>
                <Row className="footer-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <Row className="justify-content-center">
                                <Col sm={12} md={8} lg={6}>
                                    <div className="text-center py-5 d-flex flex-column align-items-center">
                                        {/* Eyebrow with orange bar */}
                                        <div className="d-flex flex-column align-items-center mb-4">
                                            <span
                                                className="section-eyebrow"
                                                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                                            >
                                                Join the Community
                                            </span>
                                            <div className="eyebrow-bar" />
                                        </div>

                                        {/* Heading */}
                                        <h4
                                            className="text-white mb-4"
                                            style={{
                                                fontSize: 'clamp(30px, 5vw, 44px)',
                                                fontWeight: 600,
                                                letterSpacing: '-0.015em',
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            Network for{' '}
                                            <span style={{ color: '#f97316' }}>Entrepreneurs</span>
                                        </h4>

                                        {/* Description */}
                                        <p
                                            className="mb-4"
                                            style={{
                                                fontSize: '14px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                lineHeight: 1.625,
                                                fontWeight: 400,
                                                maxWidth: '420px',
                                            }}
                                        >
                                            Join over 5,000+ elite entrepreneurs in our community
                                        </p>

                                        {/* CTA Button */}
                                        {!user && (
                                            <Link
                                                href="/sign-up"
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
                                                Create Free Account
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                            </Link>
                                        )}
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
