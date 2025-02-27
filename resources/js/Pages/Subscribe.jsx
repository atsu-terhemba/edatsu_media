import { Fragment } from "react"
import GuestLayout from "@/Layouts/GuestLayout"
import Metadata from "@/Components/Metadata"
import { Container, Row, Col, Image } from 'react-bootstrap';
// import SendPulseForm from "@/Components/SendPulseForm";
import MailchimpSubscriptionForm from "@/Components/MailchimpSubscriptionForm";

export default function Subscribe(){
    return(
        <Fragment>
        <Metadata
            title="Subscribe to Edatsu | Get the Latest Opportunities & Insights"
            description="Join Edatsu Media's subscription service to receive exclusive business opportunities, funding alerts, event updates, and valuable insights directly to your inbox."
            keywords="subscribe to Edatsu, business insights, funding alerts, opportunity updates, entrepreneur newsletter, business news subscription"
            canonicalUrl="https://www.edatsu.com/subscribe"
            ogTitle="Subscribe to Edatsu | Get the Latest Opportunities & Insights"
            ogDescription="Join Edatsu Media's subscription service to receive exclusive business opportunities, funding alerts, event updates, and valuable insights directly to your inbox."
            ogImage="/img/logo/subscription_banner.jpg"
            ogUrl="https://www.edatsu.com/subscribe"
            twitterTitle="Subscribe to Edatsu | Get the Latest Opportunities & Insights"
            twitterDescription="Join Edatsu Media's subscription service to receive exclusive business opportunities, funding alerts, event updates, and valuable insights directly to your inbox."
            twitterImage="/img/logo/subscription_banner.jpg"
        />
<GuestLayout>
 <Container>
      <Row>
        <Col sm={12} className="text-center">
          <div className="pt-5 pb-3">
            {/* Logo */}
            <a href="./">
              <Image
                src='/img/logo/trans/logo_trans_1.png' // Update the path to your image
                width={90}
                fluid
                alt="logo"
              />
            </a>
            {/* Heading */}
            <h2 className="poppins-semibold mb-0 p-0">Never Miss Out</h2>
          </div>
        </Col>
      </Row>
      {/* Body Section */}
      <Row>
        {/* Left Aside (Empty for now) */}
        <Col sm={4} xs={12}>
          {/* Aside content can go here */}
        </Col>
        {/* Subscription Box Section */}
        <Col sm={4} xs={12}>
          <div className="">
            <MailchimpSubscriptionForm/>
          </div>
        </Col>
        {/* Right Aside (Empty for now) */}
        <Col sm={4} xs={12}>
          {/* Aside content can go here */}
        </Col>
      </Row>
    </Container>
    </GuestLayout>
</Fragment>
    )
}