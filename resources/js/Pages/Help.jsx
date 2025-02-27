import { Fragment } from "react"
import GuestLayout from "@/Layouts/GuestLayout"
import Metadata from "@/Components/Metadata"
import { Container, Row, Col } from 'react-bootstrap';


export default function Help(){
    return(
      <Fragment>
      {/* Help Centre Heading Section */}
      <Metadata
        title="Edatsu Help Center | Get Support & Find Answers"
        description="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        keywords="Edatsu help center, customer support, FAQs, troubleshooting, user assistance"
        canonicalUrl="https://www.edatsu.com/help"
        ogTitle="Edatsu Help Center | Get Support & Find Answers"
        ogDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        ogImage="/img/logo/help_banner.jpg"
        ogUrl="https://www.edatsu.com/help"
        twitterTitle="Edatsu Help Center | Get Support & Find Answers"
        twitterDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        twitterImage="/img/logo/help_banner.jpg"
      />

      <GuestLayout>
      <Container fluid>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-5">
                <h1 className="poppins-semibold text-center">Help Centre</h1>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Content Section */}
      <Container fluid className="bg-white">
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-3 pb-5 text-center">
                <p>Email: info@edatsu.com</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      </GuestLayout>
        </Fragment>
    )
}