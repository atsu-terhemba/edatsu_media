import { Fragment } from "react"
import { Link } from "@inertiajs/react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Image } from "react-bootstrap";
import { Images } from "@/utils/Images";



export default function Footer({auth}){

function handleCopyRSS(){

}

    return(
<Fragment>
    <Container fluid={true} className="footer pt-5 pb-3">
    <Container>
    <footer className="row pb-5">
        {/* Logo and Description */}
        <Col sm={3}>
        <div className="mb-3">
            <Image
            src={Images.app_logo_trans}
            width="80"
            className="img-fluid d-block"
            alt="logo"
            />
            <p className="m-0 p-0 fs-8">
            The site design and logo of Edatsu Media are copyrighted properties of <a
                href="https://www.edatsu.com"
                target="_blank"
                className="text-info text-decoration-none"
                > Edatsu Technology Limited
            </a>
            </p>
        </div>
        </Col>
        {/* Quick Links */}
        <Col sm={3} className="d-none d-sm-block">
        <h4 className="m-0 mb-2 p-0 poppins-semibold">Quick Links</h4>
        <div className="fs-8">
            <ul className="list-unstyled">
            <li>
                <Link className="text-light text-decoration-none mb-1 d-inline-block" href="advertise">
                Advertise
                </Link>
            </li>
            <li>
                <Link className="text-light text-decoration-none mb-1 d-inline-block" href="subscribe">
                Subscribe
                </Link>
            </li>
            <li>
                <Link className="text-light text-decoration-none mb-1 d-inline-block" href="/">
                Opportunities
                </Link>
            </li>
            <li>
                <Link className="text-light text-decoration-none mb-1 d-inline-block" href="toolshed">
                Toolshed
                </Link>
            </li>
            <li>
                <Link className="text-light text-decoration-none mb-1 d-inline-block" href="sponsorship">
                Sponsorship
                </Link>
            </li>
            </ul>
        </div>
        </Col>
    {/* Site Info */}
    <Col sm={3} className="d-none d-sm-block">
    <h4 className="m-0 mb-2 p-0 poppins-semibold">Site Info</h4>
    <div className="fs-8">
        <ul className="list-unstyled">
        <li>
            <Link className="text-light text-decoration-none mb-1 d-inline-block" href="about-us">
            About
            </Link>
        </li>
        <li>
            <Link className="text-light text-decoration-none mb-1 d-inline-block" href="terms">
            Terms Of Use
            </Link>
        </li>
        <li>
            <a target="_blank" className="text-light text-decoration-none mb-1 d-inline-block" href="sitemap.xml">
            Sitemap
            </a>
        </li>
        <li>
            <Link className="text-light text-decoration-none mb-1 d-inline-block" href="privacy-policy">
            Privacy Policy
            </Link>
        </li>
        <li>
            <Button
            variant="dark"
            className="fs-8 rounded mt-2"
            id="copy-rss-btn"
            style={{ border: '1px solid #495057' }}
            onClick={handleCopyRSS}
            >
            <span className="material-symbols-outlined align-middle text-warning">rss_feed</span>
            Copy RSS Feed
            </Button>
            <span id="copy-confirmation" style={{ display: 'none' }}>
            Copied!
            </span>
        </li>
        </ul>
    </div>
    </Col>

          {/* Support */}
          <Col sm={3} className="d-none d-sm-block">
            <h4 className="m-0 mb-2 p-0 poppins-semibold">Support</h4>
            <div className="fs-8">
              <ul className="list-unstyled">
                <li>
                  <Link className="text-light text-decoration-none mb-1 d-inline-block" href="help">
                    Help Center
                  </Link>
                </li>
                <li>
                  <a className="text-light text-decoration-none d-inline-block mb-1" href="mailto:info@edatsu.com">
                    info@edatsu.com
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </footer>

        {/* Copyright Section */}
        <footer className="row" style={{ borderTop: '1px dashed gray' }}>
          <Col sm={12}>
            <div className="py-3">
              <span className="fs-9">Edatsu Media &copy; {new Date().getFullYear()}</span>
            </div>
          </Col>
        </footer>
      </Container>
    </Container>
        </Fragment>
    )
}