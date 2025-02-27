import { Fragment } from "react"
import { Container, Row, Col } from 'react-bootstrap';
import GuestLayout from "@/Layouts/GuestLayout";
import Metadata from "@/Components/Metadata";

export default function Advertise(){
    return(
        <Fragment>
            <Metadata
            title="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
            description="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media. Gain exposure through sponsored posts, display ads, and partnerships."
            keywords="advertise with Edatsu, business advertising opportunities, sponsored posts, display ads, entrepreneur audience, business marketing platform"
            canonicalUrl="https://www.edatsu.com/advertise"
            ogTitle="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
            ogDescription="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media. Gain exposure through sponsored posts, display ads, and partnerships."
            ogImage="/img/logo/ad_page_banner.jpg"
            ogUrl="https://www.edatsu.com/advertise"
            twitterTitle="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
            twitterDescription="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media. Gain exposure through sponsored posts, display ads, and partnerships."
            twitterImage="/img/logo/ad_page_banner.jpg"
        />
        <GuestLayout>
            <Container fluid={true}>
            <Container>
            <Row>
            <Col sm={12}>
                <div className="py-5 my-3 text-center">
                <h1 className="mb-3 poppins-semibold">Advertise with Us</h1>
                <p className="text-secondary">
                    Reach passionate visionaries building the businesses of the future
                </p>
                <p className="fs-9">
                <strong>Email:</strong> info@edatsu.com
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