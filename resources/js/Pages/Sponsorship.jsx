import { Container, Row, Col, Button } from 'react-bootstrap';
import { Fragment } from "react"
import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import { Head, Link } from '@inertiajs/react';



export default function Sponsorship(){
    return(
<Fragment>
<Metadata
    title="Sponsor Edatsu | Reach Business Leaders & Entrepreneurs"
    description="Partner with Edatsu Media to sponsor events, articles, and campaigns. Connect with entrepreneurs, investors, and business enthusiasts through impactful sponsorship opportunities."
    keywords="sponsor Edatsu, sponsorship opportunities, business sponsorship, event sponsorship, article sponsorship, brand promotion"
    canonicalUrl="https://www.edatsu.com/sponsorship"
    ogTitle="Sponsor Edatsu | Reach Business Leaders & Entrepreneurs"
    ogDescription="Partner with Edatsu Media to sponsor events, articles, and campaigns. Connect with entrepreneurs, investors, and business enthusiasts through impactful sponsorship opportunities."
    ogImage="/img/logo/sponsorship_banner.jpg"
    ogUrl="https://www.edatsu.com/sponsorship"
    twitterTitle="Sponsor Edatsu | Reach Business Leaders & Entrepreneurs"
    twitterDescription="Partner with Edatsu Media to sponsor events, articles, and campaigns. Connect with entrepreneurs, investors, and business enthusiasts through impactful sponsorship opportunities."
    twitterImage="/img/logo/sponsorship_banner.jpg"
/>
<GuestLayout>
<Container fluid={true}>
      {/* Header Section */}
      <Container>
        <Row>
          <Col sm={12}>
            <div className="pt-5">
              <h1 className="poppins-semibold text-center">Sponsorship</h1>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Main Content Section */}
      <Container fluid={true}>
        <Container>
          <Row>
            {/* Left Spacer Column */}
            <Col sm={3}>
              <div className="fs-9 text-center pt-3 pb-5">
                {/* Placeholder for additional content */}
              </div>
            </Col>

            {/* Main Content Column */}
            <Col sm={6}>
              <div className="fs-9 pt-3 pb-5">
                <h3 className="poppins-semibold">Become a Sponsor!</h3>
                <h2 style={{ color: '#2a5a7d', fontSize: '24px', marginBottom: '15px' }}>
                  Looking to reach a highly engaged audience and boost your brand’s visibility?
                </h2>
                <p>
                  At <strong>edatsu media</strong>, we offer targeted sponsorship opportunities designed to connect your brand with our growing community of loyal readers and followers. With our platform, you can:
                </p>
                <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginBottom: '20px' }}>
                  <li className='mb-2'>
                    <strong>Advertise in Our Newsletters:</strong> Reach our subscribers directly with impactful ad placements in our highly engaged email newsletters.
                  </li>
                  <li className='mb-2'>
                    <strong>Feature on Our Website:</strong> Showcase your brand through strategic ad placements on our site, where your message will be seen by our active audience.
                  </li>
                  <li>
                    <strong>Promote on Social Media:</strong> Leverage our social media presence to amplify your brand and connect with followers who trust our content.
                  </li>
                </ul>
                <p>
                  Our sponsorship packages are designed to deliver real value, ensuring your brand gets the attention it deserves. Whether you’re looking to drive awareness, engagement, or conversions, we’ll work with you to create a partnership that aligns with your goals.
                </p>
                <p className='poppins-semibold' style={{ fontSize: '18px', color: '#2a5a7d' }}>
                  Let’s collaborate to grow your brand and our platform together!
                </p>
                <p>
                  <a
                    href="mailto:info@edatsu.com"
                    style={{
                      backgroundColor: '#2a5a7d',
                      color: '#fff',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      display: 'inline-block',
                    }}
                  >
                    Reach out today
                  </a>{' '}
                  to discuss how we can create a sponsorship package that works for you.
                </p>
                <p>
                  <strong>Email Us:</strong> info@edatsu.com
                </p>
              </div>
            </Col>

            {/* Right Spacer Column */}
            <Col sm={3}>
              <div className="fs-9 text-center pt-3 pb-5">
                {/* Placeholder for additional content */}
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </Container>
    </GuestLayout>  
</Fragment>
    )
}