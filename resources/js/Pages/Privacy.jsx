import { Fragment } from "react";
import { Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Container } from "react-bootstrap";
import Metadata from "@/Components/Metadata";

const sections = [
    {
        title: "Personal Data We Collect",
        body: (
            <>
                <p>We may collect the following types of personal data:</p>
                <ul>
                    <li>Identity Data: name, username, or similar identifier</li>
                    <li>Contact Data: email address, phone number, postal address</li>
                    <li>Technical Data: IP address, browser type and version, time zone setting, operating system</li>
                    <li>Usage Data: information about how you use our Services</li>
                    <li>Marketing and Communications Data: your preferences in receiving marketing from us and our third parties</li>
                </ul>
            </>
        ),
    },
    {
        title: "How We Collect Your Personal Data",
        body: (
            <>
                <p>We collect data through:</p>
                <ul>
                    <li>Direct interactions: when you create an account, subscribe to our service, or contact us</li>
                    <li>Automated technologies: as you interact with our Services, we may automatically collect Technical Data</li>
                    <li>Third parties: we may receive personal data about you from various third parties and public sources</li>
                </ul>
            </>
        ),
    },
    {
        title: "How We Use Your Personal Data",
        body: (
            <>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                    <li>To provide and maintain our Services</li>
                    <li>To notify you about changes to our Services</li>
                    <li>To allow you to participate in interactive features of our Services</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information so that we can improve our Services</li>
                    <li>To monitor the usage of our Services</li>
                    <li>To detect, prevent and address technical issues</li>
                    <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
                </ul>
            </>
        ),
    },
    {
        title: "Legal Basis for Processing Personal Data",
        body: (
            <>
                <p>We process your personal data on the following legal bases:</p>
                <ul>
                    <li>Consent: you have given clear consent for us to process your personal data for a specific purpose</li>
                    <li>Contract: the processing is necessary for a contract we have with you</li>
                    <li>Legal obligation: the processing is necessary for us to comply with the law</li>
                    <li>Legitimate interests: the processing is necessary for our legitimate interests or the legitimate interests of a third party</li>
                </ul>
            </>
        ),
    },
    {
        title: "Data Retention",
        body: (
            <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
        ),
    },
    {
        title: "Your Data Protection Rights",
        body: (
            <>
                <p>Under GDPR, you have the following rights:</p>
                <ul>
                    <li>The right to access your personal data</li>
                    <li>The right to rectification of your personal data</li>
                    <li>The right to erasure of your personal data</li>
                    <li>The right to restrict processing of your personal data</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing of your personal data</li>
                    <li>Rights in relation to automated decision making and profiling</li>
                </ul>
                <p>To exercise any of these rights, please contact us using the details in the Contact section below.</p>
            </>
        ),
    },
    {
        title: "Data Security",
        body: (
            <p>We have implemented appropriate technical and organizational measures to secure your personal data from accidental loss, unauthorized access, use, alteration, and disclosure.</p>
        ),
    },
    {
        title: "International Transfers",
        body: (
            <p>We may transfer your personal data to countries outside the European Economic Area (EEA). Whenever we transfer your personal data out of the EEA, we ensure a similar degree of protection is afforded to it by using specific contracts approved by the European Commission.</p>
        ),
    },
    {
        title: "Third-Party Links",
        body: (
            <p>Our Services may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</p>
        ),
    },
    {
        title: "Children's Privacy",
        body: (
            <p>Our Services are not intended for children under the age of 16. We do not knowingly collect personal data from children under 16. If you become aware that a child has provided us with personal data, please contact us.</p>
        ),
    },
    {
        title: "Changes to This Privacy Policy",
        body: (
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
        ),
    },
    {
        title: "Contact Us",
        body: (
            <>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <p style={{ marginBottom: 0 }}>
                    Edatsu Media<br />
                    <a href="mailto:info@edatsu.com" style={{ color: '#f97316', textDecoration: 'none', borderBottom: '1px solid rgba(249,115,22,0.3)' }}>info@edatsu.com</a>
                </p>
            </>
        ),
    },
];

export default function Privacy() {
    return (
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

            <GuestLayout>
                <style>{`
                    .privacy-prose { font-family: 'Poppins', sans-serif; color: #1d1d1f; font-size: 15px; line-height: 1.75; }
                    .privacy-prose p { margin: 0 0 1em; color: #424245; }
                    .privacy-prose ul { padding-left: 1.2em; margin: 0 0 1em; }
                    .privacy-prose li { margin-bottom: 0.5em; color: #424245; }
                    .privacy-prose a { color: #f97316; text-decoration: none; border-bottom: 1px solid rgba(249,115,22,0.3); }
                    .privacy-prose a:hover { border-bottom-color: #f97316; }
                `}</style>

                {/* Hero */}
                <section
                    style={{
                        background: '#000',
                        color: '#fff',
                        paddingTop: '160px',
                        paddingBottom: '96px',
                    }}
                >
                    <Container>
                        <div className="d-flex flex-column align-items-start">
                            <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                Legal
                            </span>
                            <div className="eyebrow-bar" style={{ marginLeft: 0 }} />
                        </div>
                        <h1
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 'clamp(36px, 6vw, 56px)',
                                fontWeight: 600,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.05,
                                color: '#d1d1d6',
                                marginTop: '16px',
                                marginBottom: '20px',
                            }}
                        >
                            Privacy Policy
                        </h1>
                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.7)',
                                maxWidth: '640px',
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            Edatsu Media (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting the privacy of our users. This policy explains how we collect, use, disclose, and safeguard your personal data when you use our services, website, and applications.
                        </p>
                        <div
                            style={{
                                marginTop: '32px',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.5)',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Last updated &middot; May 2026
                        </div>
                    </Container>
                </section>

                {/* Body */}
                <section style={{ background: '#fff', padding: '96px 0' }}>
                    <Container>
                        <div style={{ maxWidth: '720px', margin: '0 auto' }} className="privacy-prose">
                            {sections.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '32px 0',
                                        borderTop: i === 0 ? 'none' : '1px solid #f0f0f0',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#f97316',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                    <h2
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: '#000',
                                            letterSpacing: '-0.01em',
                                            marginTop: 0,
                                            marginBottom: '16px',
                                        }}
                                    >
                                        {s.title}
                                    </h2>
                                    {s.body}
                                </div>
                            ))}

                            <div style={{ marginTop: '64px', padding: '24px', background: '#f5f5f7', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                    Questions about your data?{' '}
                                    <a href="mailto:info@edatsu.com" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 500 }}>
                                        Get in touch
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </Container>
                </section>
            </GuestLayout>
        </Fragment>
    );
}
