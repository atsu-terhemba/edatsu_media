import { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import GuestLayout from "@/Layouts/GuestLayout";
import Metadata from "@/Components/Metadata";
import FixedMobileNav from '@/Components/FixedMobileNav';
import { usePage } from '@inertiajs/react';

export default function Sponsorship() {
    const { props } = usePage();

    const stats = [
        { number: '5,000+', label: 'Engaged Readers', icon: 'groups' },
        { number: '50K+', label: 'Monthly Views', icon: 'visibility' },
        { number: '30+', label: 'Countries', icon: 'public' },
        { number: '85%', label: 'Engagement Rate', icon: 'trending_up' },
    ];

    const channels = [
        {
            icon: 'mail',
            title: 'Newsletter Placements',
            description: 'Reach our subscribers directly with dedicated placements in our highly engaged email newsletters.',
        },
        {
            icon: 'web',
            title: 'Website Features',
            description: 'Showcase your brand through strategic placements across our site where active readers spend time.',
        },
        {
            icon: 'share',
            title: 'Social Amplification',
            description: 'Leverage our social presence to amplify your brand with followers who trust our content.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Tell Us Your Goals',
            description: 'Share your brand story, target audience, and what success looks like for your campaign.',
        },
        {
            number: '02',
            title: 'Build Your Package',
            description: 'We tailor a sponsorship mix across newsletter, site, and social to align with your goals.',
        },
        {
            number: '03',
            title: 'Launch & Measure',
            description: 'Your campaign goes live and we share performance insights so you see real value.',
        },
    ];

    return (
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

                {/* Hero Banner */}
                <section className="position-relative" style={{
                    backgroundImage: "url('/img/defaults/banner_business.jpg')",
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
                                                Sponsorship
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
                                            Partner with a community that{' '}
                                            <span style={{ color: '#f97316' }}>builds</span>
                                        </h1>

                                        <p style={{
                                            fontSize: 'clamp(14px, 1.5vw, 16px)',
                                            lineHeight: 1.625,
                                            fontWeight: 400,
                                            color: 'rgba(255,255,255,0.6)',
                                            maxWidth: '520px',
                                            margin: '0 auto 32px',
                                        }}>
                                            Sponsor Edatsu and connect your brand with thousands of entrepreneurs, investors, and business leaders who are actively seeking growth.
                                        </p>

                                        <a
                                            href="mailto:info@edatsu.com"
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
                                            Become a Sponsor
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
                                Why Sponsor With Us?
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

                {/* Sponsorship Channels Section */}
                <section style={{ padding: '96px 0', background: '#fff' }}>
                    <Container>
                        <div className="text-center">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                    Channels
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
                                Where Your Brand Shows Up
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.6,
                                maxWidth: '480px',
                                margin: '0 auto 48px',
                            }}>
                                A flexible mix of channels tailored to awareness, engagement, or conversions.
                            </p>
                        </div>

                        <Row className="g-4">
                            {channels.map((channel, i) => (
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
                                                {channel.icon}
                                            </span>
                                        </div>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#000',
                                            marginBottom: '8px',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {channel.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#86868b',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}>
                                            {channel.description}
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
                            Let's Build Something Together
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.4)',
                            maxWidth: '480px',
                            margin: '0 auto 32px',
                            lineHeight: 1.6,
                        }}>
                            Reach out today and we'll shape a sponsorship package that works for your brand.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-4">
                            <a
                                href="mailto:info@edatsu.com"
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
                                info@edatsu.com
                            </a>
                            <a
                                href="tel:+2349015121118"
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
                                +234 901 512 1118
                            </a>
                        </div>
                    </Container>
                </section>

                <FixedMobileNav isAuthenticated={props.auth?.user ? true : false} />
            </GuestLayout>
        </Fragment>
    );
}
