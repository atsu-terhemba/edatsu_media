import { Fragment } from "react"
import Metadata from "@/Components/Metadata"
import GuestLayout from "@/Layouts/GuestLayout"
import { Container, Row, Col } from 'react-bootstrap';

export default function Terms(){
    return(
        <Fragment>
        <Metadata
            title="Edatsu Terms of Use | User Agreement & Policies"
            description="Read the terms of use for Edatsu Media. Understand our user agreement, policies, and guidelines for accessing and using our platform and services."
            keywords="Edatsu terms of use, user agreement, platform policies, service guidelines, terms and conditions"
            canonicalUrl="https://www.edatsu.com/terms"
            ogTitle="Edatsu Terms of Use | User Agreement & Policies"
            ogDescription="Read the terms of use for Edatsu Media. Understand our user agreement, policies, and guidelines for accessing and using our platform and services."
            ogImage="/img/logo/terms_banner.jpg"
            ogUrl="https://www.edatsu.com/terms"
            twitterTitle="Edatsu Terms of Use | User Agreement & Policies"
            twitterDescription="Read the terms of use for Edatsu Media. Understand our user agreement, policies, and guidelines for accessing and using our platform and services."
            twitterImage="/img/logo/terms_banner.jpg"
        />

      {/* Terms of Use Heading Section */}
      <GuestLayout>
      <Container fluid>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-5 mb-3 text-center">
                <h1 className="poppins-semibold">Terms of Use</h1>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Content Section */}
      <Container fluid className="bg-white">
        <Container>
          <Row>
            <Col sm={4}>
            </Col>
            <Col sm={8}>
              <div className="mb-5">
                <p className="fs-9">
                  Welcome to Edatsu Media! These Terms of Use ("Terms") govern your use of our website, applications, and
                  services (collectively, the "Services"). By accessing or using our Services, you agree to comply with
                  and be bound by these Terms. If you do not agree with these Terms, please do not use our Services.
                </p>

                <p className="fw-bold mb-3">1. Acceptance of Terms</p>
                <p className="fs-9">
                  By accessing our Services, you agree to these Terms and any additional terms applicable to specific
                  services you use.
                </p>

                <p className="fw-bold mb-3">2. Intellectual Property</p>
                <p className="fs-9">
                  All content and materials on our Services, including text, graphics, logos, and software, are the
                  property of Edatsu Media or its licensors and are protected by copyright, trademark, and other
                  intellectual property laws. You may not use any content without our prior written consent.
                </p>

                <p className="fw-bold mb-3">3. Privacy</p>
                <p className="fs-9">
                  Your use of our Services is subject to our Privacy Policy, which explains how we collect, use, and
                  disclose your information. By using our Services, you agree to the collection and use of your
                  information as described in our Privacy Policy.
                </p>

                <p className="fw-bold mb-3">4. Disclaimers</p>
                <p className="fs-9">
                  Our Services are provided "as is" and "as available" without warranties of any kind, either express or
                  implied. We do not guarantee that the Services will be uninterrupted, secure, or error-free.
                </p>

                <p className="fw-bold mb-3">5. Limitation of Liability</p>
                <p className="fs-9">
                  To the fullest extent permitted by law, Edatsu Media shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                  directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul>
                  <li className="fs-9">Your use or inability to use the Services.</li>
                  <li className="fs-9">
                    Any unauthorized access to or use of our servers and/or any personal information stored therein.
                  </li>
                  <li className="fs-9">Any interruption or cessation of transmission to or from our Services.</li>
                  <li className="fs-9">
                    Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Services by
                    any third party.
                  </li>
                  <li className="fs-9">
                    Any errors or omissions in any content or for any loss or damage incurred as a result of the use of
                    any content posted, emailed, transmitted, or otherwise made available through the Services.
                  </li>
                </ul>

                <p className="fw-bold mb-3">6. Indemnification</p>
                <p className="fs-9">
                  You agree to indemnify, defend, and hold harmless Edatsu Media and its affiliates, officers, directors,
                  employees, and agents from and against any claims, liabilities, damages, losses, and expenses,
                  including reasonable attorney's fees, arising out of or in any way connected with your use of the
                  Services, your violation of these Terms, or your violation of any rights of another.
                </p>

                <p className="fw-bold mb-3">7. Changes to Terms</p>
                <p className="fs-9">
                  We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by
                  updating the date at the top of these Terms. Your continued use of the Services after the changes take
                  effect constitutes your acceptance of the revised Terms.
                </p>

                <p className="fw-bold mb-3">13. Contact Information</p>
                <p className="fs-9">
                  If you have any questions about these Terms, please contact us at: info@edatsu.com
                </p>

                <p className="fs-9">
                  By using our Services, you acknowledge that you have read, understood, and agree to be bound by these
                  Terms of Use.
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