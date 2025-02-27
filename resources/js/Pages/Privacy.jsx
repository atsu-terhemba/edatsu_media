import { Fragment } from "react"
import GuestLayout from "@/Layouts/GuestLayout"
import { Container, Row, Col } from 'react-bootstrap';
import Metadata from "@/Components/Metadata";

export default function Privacy(){
    return(
        <Fragment>
            <Metadata
            title="Edatsu Privacy Policy | Data Protection & User Rights"
            description="Read Edatsu Media's privacy policy to understand how we collect, use, and protect your personal information while ensuring your data rights and security."
            keywords="Edatsu privacy policy, data protection, user rights, personal information security, data collection practices"
            canonicalUrl="https://www.edatsu.com/privacy"
            ogTitle="Edatsu Privacy Policy | Data Protection & User Rights"
            ogDescription="Read Edatsu Media's privacy policy to understand how we collect, use, and protect your personal information while ensuring your data rights and security."
            ogImage="/img/logo/privacy_banner.jpg"
            ogUrl="https://www.edatsu.com/privacy"
            twitterTitle="Edatsu Privacy Policy | Data Protection & User Rights"
            twitterDescription="Read Edatsu Media's privacy policy to understand how we collect, use, and protect your personal information while ensuring your data rights and security."
            twitterImage="/img/logo/privacy_banner.jpg"
        />

      {/* Privacy Policy Heading Section */}
      <GuestLayout>
      <Container fluid>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-5">
                <h1 className="fw-bold">Privacy Policy</h1>
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
              <div>
                <p className="fs-9">
                  Edatsu Media ("we", "us", or "our") is committed to protecting the privacy of our users ("you" or
                  "your"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data
                  when you use our services, website, and applications (collectively, the "Services"). By using our
                  Services, you consent to the data practices described in this policy.
                </p>

                {/* Section 3: Personal Data We Collect */}
                <p className="fw-bold mb-3">3. Personal Data We Collect</p>
                <p className="fs-9">We may collect the following types of personal data:</p>
                <ul>
                    <li className="fs-9">Identity Data: name, username, or similar identifier</li>
                    <li className="fs-9">Contact Data: email address, phone number, postal address</li>
                    <li className="fs-9">
                        Technical Data: IP address, browser type and version, time zone setting, operating system
                    </li>
                    <li className="fs-9">Usage Data: information about how you use our Services</li>
                    <li className="fs-9">
                        Marketing and Communications Data: your preferences in receiving marketing from us and our third
                        parties
                    </li>
                </ul>

                {/* Section 4: How We Collect Your Personal Data */}
                <p className="fw-bold mb-3">4. How We Collect Your Personal Data</p>
                <p className="fs-9">We collect data through:</p>
                <ul>
                  <li className="fs-9">
                    Direct interactions: when you create an account, subscribe to our service, or contact us
                  </li>
                  <li className="fs-9">
                    Automated technologies: as you interact with our Services, we may automatically collect Technical
                    Data
                  </li>
                  <li className="fs-9">
                    Third parties: we may receive personal data about you from various third parties and public sources
                  </li>
                </ul>

                {/* Section 5: How We Use Your Personal Data */}
                <p className="fw-bold mb-3">5. How We Use Your Personal Data</p>
                <p className="fs-9">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                  data in the following circumstances:
                </p>
                <ul>
                    <li className="fs-9">To provide and maintain our Services</li>
                    <li className="fs-9">To notify you about changes to our Services</li>
                    <li className="fs-9">To allow you to participate in interactive features of our Services</li>
                    <li className="fs-9">To provide customer support</li>
                    <li className="fs-9">
                        To gather analysis or valuable information so that we can improve our Services
                    </li>
                    <li className="fs-9">To monitor the usage of our Services</li>
                    <li className="fs-9">To detect, prevent and address technical issues</li>
                    <li className="fs-9">
                        To provide you with news, special offers and general information about other goods, services and
                        events which we offer
                    </li>
                </ul>

                {/* Section 6: Legal Basis for Processing Personal Data */}
                <p className="fw-bold mb-3">6. Legal Basis for Processing Personal Data</p>
                <p className="fs-9">We process your personal data on the following legal bases:</p>
                <ul>
                    <li className="fs-9">
                        Consent: You have given clear consent for us to process your personal data for a specific purpose
                    </li>
                    <li className="fs-9">Contract: The processing is necessary for a contract we have with you</li>
                    <li className="fs-9">Legal obligation: The processing is necessary for us to comply with the law</li>
                    <li className="fs-9">
                        Legitimate interests: The processing is necessary for our legitimate interests or the legitimate
                        interests of a third party
                    </li>
                </ul>

                {/* Section 7: Data Retention */}
                <p className="fw-bold mb-3">7. Data Retention</p>
                <p className="fs-9">
                    We will only retain your personal data for as long as necessary to fulfill the purposes we collected it
                    for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>

                {/* Section 8: Your Data Protection Rights */}
                <p className="fw-bold mb-3">8. Your Data Protection Rights</p>
                <p className="fs-9">Under GDPR, you have the following rights:</p>
                <ul>
                    <li className="fs-9">The right to access your personal data</li>
                    <li className="fs-9">The right to rectification of your personal data</li>
                    <li className="fs-9">The right to erasure of your personal data</li>
                    <li className="fs-9">The right to restrict processing of your personal data</li>
                    <li className="fs-9">The right to data portability</li>
                    <li className="fs-9">The right to object to processing of your personal data</li>
                    <li className="fs-9">Rights in relation to automated decision making and profiling</li>
                </ul>
                <p className="fs-9">
                    To exercise any of these rights, please contact us using the details provided in section 2.
                </p>

                {/* Section 9: Data Security */}
                <p className="fw-bold mb-3">9. Data Security</p>
                <p className="fs-9">
                    We have implemented appropriate technical and organizational measures to secure your personal data from
                    accidental loss, unauthorized access, use, alteration, and disclosure.
                </p>

                {/* Section 10: International Transfers */}
                <p className="fw-bold mb-3">10. International Transfers</p>
                <p className="fs-9">
                    We may transfer your personal data to countries outside the European Economic Area (EEA). Whenever we
                    transfer your personal data out of the EEA, we ensure a similar degree of protection is afforded to it
                    by using specific contracts approved by the European Commission.
                </p>

                {/* Section 11: Third-Party Links */}
                <p className="fw-bold mb-3">11. Third-Party Links</p>
                <p className="fs-9">
                    Our Services may include links to third-party websites, plug-ins, and applications. Clicking on those
                    links or enabling those connections may allow third parties to collect or share data about you. We do
                    not control these third-party websites and are not responsible for their privacy statements.
                </p>

                {/* Section 12: Children's Privacy */}
                <p className="fw-bold mb-3">12. Children's Privacy</p>
                <p className="fs-9">
                    Our Services are not intended for children under the age of 16. We do not knowingly collect personal data
                    from children under 16. If you become aware that a child has provided us with personal data, please
                    contact us.
                </p>

                {/* Section 13: Changes to This Privacy Policy */}
                <p className="fw-bold mb-3">13. Changes to This Privacy Policy</p>
                <p className="fs-9">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                    Privacy Policy on this page and updating the "Last updated" date.
                </p>

                {/* Section 14: Contact Us */}
                <p className="fw-bold mb-3">14. Contact Us</p>
                <p className="fs-9">If you have any questions about this Privacy Policy, please contact us:</p>
                <p className="fs-9">
                    Edatsu Media
                    <br />
                    info@edatsu.com
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