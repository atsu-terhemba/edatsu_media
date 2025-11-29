import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  
    faFacebook,
    faInstagram,
    faLinkedinIn,
    faTiktok,
    faXTwitter,
    faYoutube, } from '@fortawesome/free-brands-svg-icons';

export default function SocialFooter(){
    return(
    <>
<Container fluid={true}>
    <Container>
    <Row className="social-footer">
        <Col sm={12} className="text-center">
        <div className="py-3 px-3">
            <h5 className="poppins-semibold mb-3" style={{ fontSize: '2em' }}>
            Follow Us
            </h5>
            <p className="mb-2 p-0">
            Follow Us on Your Favorite Platform to Stay Connected
            </p>
            <ul className="share-icons m-0 p-0 list-unstyled d-flex justify-content-center gap-3">
            {/* Facebook */}
            <li>
                <a href="https://www.facebook.com/edatsu_media" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="text-info" />
                <span className="sr-only">Facebook</span>
                </a>
            </li>
            {/* Instagram */}
            <li>
                <a href="https://www.instagram.com/edatsu_media/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="text-info" />
                <span className="sr-only">Instagram</span>
                </a>
            </li>
            {/* YouTube */}
            <li>
                <a href="https://www.youtube.com/channel/UCwIxkgCrdzsL3ApDjVgRLCQ" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} className="text-info" />
                <span className="sr-only">YouTube</span>
                </a>
            </li>
            {/**linkedin */}
              <li>
                <a href="https://www.linkedin.com/company/edatsu-media" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-info" />
                <span className="sr-only">LinkedIn</span>
                </a>
            </li>
            </ul>
        </div>
        </Col>
    </Row>
    </Container>
</Container>
        </>
    )
}