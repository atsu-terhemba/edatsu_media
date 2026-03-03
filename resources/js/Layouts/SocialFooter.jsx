import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faInstagram,
    faLinkedinIn,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export default function SocialFooter() {
    return (
        <>
            <Container fluid={true}>
                <Container>
                    <Row className="social-footer">
                        <Col sm={12} className="text-center">
                            <div className="py-4 px-3">
                                <h5 className="mb-2" style={{ fontSize: '19px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
                                    Follow Us
                                </h5>
                                <p className="mb-3" style={{ color: '#86868b', fontSize: '14px', fontWeight: 400 }}>
                                    Stay connected on your favorite platform
                                </p>
                                <ul className="share-icons m-0 p-0 list-unstyled d-flex justify-content-center gap-3">
                                    <li>
                                        <a href="https://www.facebook.com/edatsu_media" target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faFacebook} style={{ color: '#86868b', transition: 'color 0.2s' }} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/edatsu_media/" target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faInstagram} style={{ color: '#86868b', transition: 'color 0.2s' }} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.youtube.com/channel/UCwIxkgCrdzsL3ApDjVgRLCQ" target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faYoutube} style={{ color: '#86868b', transition: 'color 0.2s' }} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/company/edatsu-media" target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faLinkedinIn} style={{ color: '#86868b', transition: 'color 0.2s' }} />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
}
