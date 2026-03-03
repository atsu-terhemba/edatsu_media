import { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { usePage } from '@inertiajs/react';
import FlatButton from '@/Components/FlatButton';

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
                                    <div className="text-center py-5">
                                        {/* Badge */}
                                        <span
                                            className="d-inline-block mb-3"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: 'rgba(255, 255, 255, 0.85)',
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                padding: '5px 14px',
                                                borderRadius: '980px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                            }}
                                        >
                                            Join the Community
                                        </span>

                                        <h4
                                            className="text-white mb-3"
                                            style={{
                                                fontSize: '44px',
                                                fontWeight: 600,
                                                letterSpacing: '-0.005em',
                                                lineHeight: 1.12,
                                            }}
                                        >
                                            Network for{' '}
                                            <span style={{ color: '#d97757' }}>Entrepreneurs</span>
                                        </h4>
                                        <p
                                            className="mb-4"
                                            style={{
                                                fontSize: '15px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                lineHeight: 1.5,
                                                fontWeight: 400,
                                            }}
                                        >
                                            Join over 5,000+ elite entrepreneurs in our community
                                        </p>

                                        {!user && (
                                            <FlatButton
                                                href="/sign-up"
                                                variant="light"
                                                size="lg"
                                            >
                                                Create Free Account
                                            </FlatButton>
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
