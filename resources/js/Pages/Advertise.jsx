import { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import GuestLayout from "@/Layouts/GuestLayout";
import Metadata from "@/Components/Metadata";
import FixedMobileNav from '@/Components/FixedMobileNav';
import { usePage } from '@inertiajs/react';

export default function Advertise() {
    const { props } = usePage();

    const stats = [
        { number: '5,000+', label: 'Entrepreneurs', icon: 'groups' },
        { number: '50K+', label: 'Monthly Views', icon: 'visibility' },
        { number: '30+', label: 'Countries', icon: 'public' },
        { number: '85%', label: 'Engagement Rate', icon: 'trending_up' },
    ];

    const adFormats = [
        {
            icon: 'article',
            title: 'Sponsored Posts',
            description: 'Feature your brand story, product, or service in a dedicated post seen by our engaged audience of entrepreneurs and business leaders.',
        },
        {
            icon: 'ad_units',
            title: 'Display Ads',
            description: 'Place banner and sidebar ads across our platform. Multiple formats available including horizontal, square, and responsive units.',
        },
        {
            icon: 'mail',
            title: 'Newsletter Sponsorship',
            description: 'Reach our subscriber base directly in their inbox. Our weekly newsletter has high open rates and a highly targeted audience.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Get in Touch',
            description: 'Reach out to us via email or phone. Tell us about your brand, goals, and target audience.',
        },
        {
            number: '02',
            title: 'Choose Your Format',
            description: 'Select the ad format that best fits your campaign — sponsored posts, display ads, or newsletter placement.',
        },
        {
            number: '03',
            title: 'Go Live',
            description: 'We handle the rest. Your campaign goes live and reaches thousands of ambitious entrepreneurs.',
        },
    ];

    return (
        <Fragment>
            <Metadata
                title="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
                description="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media. Gain exposure through sponsored posts, display ads, and partnerships."
                keywords="advertise with Edatsu, business advertising opportunities, sponsored posts, display ads, entrepreneur audience, business marketing platform"
                canonicalUrl="https://www.edatsu.com/advertise"
                ogTitle="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
                ogDescription="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media."
                ogImage="/img/logo/ad_page_banner.jpg"
                ogUrl="https://www.edatsu.com/advertise"
                twitterTitle="Advertise with Edatsu | Reach Entrepreneurs & Business Leaders"
                twitterDescription="Promote your brand to entrepreneurs, investors, and business enthusiasts on Edatsu Media."
                twitterImage="/img/logo/ad_page_banner.jpg"
            />
            <GuestLayout>

                {/* Hero Banner */}
                <section className="position-relative" style={{
                    backgroundImage: "url('/img/defaults/advertise_banner.jpg')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                }}>
                    <div style={{
                        position: 'relative',
                        padding: '140px 0 80px',
                        textAlign: 'center',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.82) 100%)',
                    }}>
                        <Container>
                            <Row className="justify-content-center">
                                <Col xs={12} md={10} lg={7}>
                                    <div className="d-flex flex-column align-items-center">
                                        <div className="d-flex flex-column align-items-center mb-4">
                                            <span
                                                className="section-eyebrow"
                                                style={{ color: 'rgba(255,255,255,0.5)' }}
                                            >
                                                Advertise
                                            </span>
                                            <div className="eyebrow-bar" />
                                        </div>

                                        <h1 style={{
                                            fontSize: 'clamp(32px, 6vw, 48px)',
                                            fontWeight: 600,
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em',
                                            color: '#fff',
                                            marginBottom: '16px',
                                        }}>
                                            Reach the builders of{' '}
                                            <span style={{ color: '#f97316' }}>tomorrow</span>
                                        </h1>

                                        <p style={{
                                            fontSize: 'clamp(14px, 1.5vw, 16px)',
                                            lineHeight: 1.625,
                                            fontWeight: 400,
                                            color: 'rgba(255,255,255,0.6)',
                                            maxWidth: '520px',
                                            margin: '0 auto 32px',
                                        }}>
                                            Put your brand in front of thousands of ambitious entrepreneurs, investors, and business leaders across 30+ countries.
                                        </p>

                                        <a
                                            href="mailto:advertise@edatsu.com"
                                            style={{
                                                background: '#fff',
                                                color: '#000',
                                                fontWeight: 500,
                                                fontSize: '14px',
                                                padding: '12px 32px',
                                                borderRadius: '9999px',
                                                textDecoration: 'none',
                                                transition: 'all 0.15s ease',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f1f1f1';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            Get Started
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </section>

                {/* Stats Section */}
                <section style={{ padding: '96px 0', background: '#f5f5f7' }}>
                    <Container>
                        <div className="text-center">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                    Our Reach
                                </span>
                                <div className="eyebrow-bar" />
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(26px, 4vw, 32px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                marginBottom: '8px',
                            }}>
                                Why Advertise With Us?
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.6,
                                maxWidth: '480px',
                                margin: '0 auto 48px',
                            }}>
                                Your brand deserves an audience that's actively seeking growth.
                            </p>
                        </div>

                        <Row className="g-3 g-lg-4">
                            {stats.map((stat, i) => (
                                <Col xs={6} lg={3} key={i}>
                                    <div
                                        style={{
                                            background: '#fff',
                                            borderRadius: '20px',
                                            padding: '32px 24px',
                                            textAlign: 'center',
                                            height: '100%',
                                            border: '1px solid #f0f0f0',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e5e5';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#000',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '16px',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                                                {stat.icon}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: 'clamp(28px, 4vw, 36px)',
                                            fontWeight: 700,
                                            color: '#000',
                                            letterSpacing: '-0.03em',
                                            lineHeight: 1,
                                            marginBottom: '6px',
                                        }}>
                                            {stat.number}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#86868b',
                                            fontWeight: 500,
                                        }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Ad Formats Section */}
                <section style={{ padding: '96px 0', background: '#fff' }}>
                    <Container>
                        <div className="text-center">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                    Ad Formats
                                </span>
                                <div className="eyebrow-bar" />
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(26px, 4vw, 32px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                marginBottom: '8px',
                            }}>
                                Choose Your Format
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.6,
                                maxWidth: '480px',
                                margin: '0 auto 48px',
                            }}>
                                Multiple ways to connect with our audience, tailored to your campaign goals.
                            </p>
                        </div>

                        <Row className="g-4">
                            {adFormats.map((format, i) => (
                                <Col lg={4} md={6} key={i}>
                                    <div
                                        style={{
                                            background: '#f5f5f7',
                                            borderRadius: '20px',
                                            padding: '32px',
                                            height: '100%',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e5e5';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#000',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                            transition: 'transform 0.3s ease',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                                                {format.icon}
                                            </span>
                                        </div>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#000',
                                            marginBottom: '8px',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {format.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#86868b',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}>
                                            {format.description}
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* How It Works */}
                <section style={{ padding: '96px 0', background: '#f5f5f7' }}>
                    <Container>
                        <div className="text-center">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                    How It Works
                                </span>
                                <div className="eyebrow-bar" />
                            </div>
                            <h2 style={{
                                fontSize: 'clamp(26px, 4vw, 32px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                marginBottom: '48px',
                            }}>
                                Three Simple Steps
                            </h2>
                        </div>

                        <Row className="g-4 justify-content-center">
                            {steps.map((step, i) => (
                                <Col lg={4} md={6} key={i}>
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: '20px',
                                        padding: '32px',
                                        height: '100%',
                                        border: '1px solid #f0f0f0',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e5e5';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    >
                                        <div style={{
                                            fontSize: '40px',
                                            fontWeight: 700,
                                            color: '#f97316',
                                            letterSpacing: '-0.03em',
                                            lineHeight: 1,
                                            marginBottom: '16px',
                                        }}>
                                            {step.number}
                                        </div>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#000',
                                            marginBottom: '8px',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {step.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#86868b',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}>
                                            {step.description}
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* CTA / Contact Section */}
                <section style={{ padding: '96px 0', background: '#000', textAlign: 'center' }}>
                    <Container>
                        <div className="d-flex flex-column align-items-center mb-3">
                            <span
                                className="section-eyebrow"
                                style={{ color: 'rgba(255,255,255,0.4)' }}
                            >
                                Get Started
                            </span>
                            <div className="eyebrow-bar" />
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(26px, 4vw, 32px)',
                            fontWeight: 600,
                            color: '#fff',
                            letterSpacing: '-0.01em',
                            marginBottom: '12px',
                        }}>
                            Ready to Grow Your Brand?
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.4)',
                            maxWidth: '480px',
                            margin: '0 auto 32px',
                            lineHeight: 1.6,
                        }}>
                            Let's talk about how we can help you reach the right audience. Contact us today.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-4">
                            <a
                                href="mailto:advertise@edatsu.com"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    padding: '14px 32px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                                advertise@edatsu.com
                            </a>
                            <a
                                href="tel:+2349018355951"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'transparent',
                                    color: 'rgba(255,255,255,0.9)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '9999px',
                                    padding: '14px 32px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span>
                                +234 90183 55951
                            </a>
                        </div>
                    </Container>
                </section>

                <FixedMobileNav isAuthenticated={props.auth?.user ? true : false} />
            </GuestLayout>
        </Fragment>
    );
}
