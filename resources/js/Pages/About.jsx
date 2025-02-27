import Metadata from "@/Components/Metadata"
import { Container, Row, Col } from 'react-bootstrap';
import GuestLayout from "@/Layouts/GuestLayout";
import { Fragment } from "react";

export default function About(){
    return(
        <Fragment>
            <Metadata
                title="About Edatsu | Empowering Entrepreneurs with Opportunities"
                description="Learn more about Edatsu Media, our mission to empower entrepreneurs with global opportunities, funding resources, and valuable insights for business growth."
                keywords="about Edatsu, Edatsu Media, business opportunities platform, entrepreneurship support, global funding resources, business growth insights"
                canonicalUrl="https://www.edatsu.com/about"
                ogTitle="About Edatsu | Empowering Entrepreneurs with Opportunities"
                ogDescription="Learn more about Edatsu Media, our mission to empower entrepreneurs with global opportunities, funding resources, and valuable insights for business growth."
                ogImage="/img/logo/about_us_banner.jpg"
                ogUrl="https://www.edatsu.com/about"
                twitterTitle="About Edatsu | Empowering Entrepreneurs with Opportunities"
                twitterDescription="Learn more about Edatsu Media, our mission to empower entrepreneurs with global opportunities, funding resources, and valuable insights for business growth."
                twitterImage="/img/logo/about_us_banner.jpg"
            />
<GuestLayout>
            <Container fluid>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-5">
                <h1 className="poppins-semibold text-center">About Us</h1>
                <h3 className="">
                  Our platform is a comprehensive resource hub designed to empower entrepreneurs and businesses. Whether you're launching a startup or scaling an existing venture, we compile essential tools, insights, and opportunities to support your growth
                </h3>
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
              <div className="fs-9 pt-3 pb-5">
                <p>
                  At Edatsu Media, we are dedicated to empowering businesses on their growth journey. Our mission is to
                  provide valuable content that uncovers opportunities for expansion and equips you with the essential
                  tools needed for success.
                </p>
                <p>
                  We believe in the power of networking and connection. That’s why we strive to facilitate meaningful
                  relationships between customers, businesses, and venture capitalists, creating a bridge to funding and
                  exposure. With our insights and resources, we aim to be your partner in navigating the dynamic
                  landscape of business growth.
                </p>
                <p>
                  Join us as we explore the endless possibilities for your business!
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      </GuestLayout>
        </Fragment>
    )
}