import { Fragment } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "@inertiajs/react";

export default function SubFooter(){
    return (
        <Fragment>
<Container fluid={true}>
      <Row className="footer-banner position-relative border-0">
        <div className="overlay d-flex align-items-center">
          <Container>
            <Row>
              <Col sm={3}></Col>
              <Col sm={6}>
                <div className="text-center">
                  <h4 className="text-m-0 p-0 text-light poppins-semibold" style={{ fontSize: '2.5em' }}>
                    Tailored for Entrepreneurs
                  </h4>
                  <p className="m-0 p-0 text-light">
                    Unlock exclusive content on technology, finance, and exciting opportunities. Don’t miss out—subscribe now!
                  </p>
                  <Link
                    href="subscribe"
                    className=" btn text-decoration-none shadow-sm btn-lg custom-bg-highlight text-light poppins-semibold px-5 border-0 py-3 mt-3"
                    >
                    Subscribe
                  </Link>
                </div>
              </Col>
              <Col sm={3}></Col>
            </Row>
          </Container>
        </div>
      </Row>
    </Container>
        </Fragment>
    )
}