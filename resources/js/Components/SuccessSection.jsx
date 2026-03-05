import { Container, Row, Col } from 'react-bootstrap';
import { Link } from '@inertiajs/react';

const features = [
    {
        icon: 'trending_up',
        title: 'Strategic Market Positioning',
        description:
            'Our bots scan 1,000+ data sources daily to surface hidden funding opportunities — delivering intelligence before it becomes public knowledge.',
        buttonText: 'Access Opportunities',
        href: '/opportunities',
    },
    {
        icon: 'build',
        title: 'Productivity Tools',
        description:
            'Navigate the modern age of AI with intelligence-driven business productivity. We evaluate, rank, and monitor 500+ tools for entrepreneurs.',
        buttonText: 'Find Tools',
        href: '/toolshed',
    },
    {
        icon: 'show_chart',
        title: 'FinTech & Investment News',
        description:
            'Stay ahead with cutting-edge fintech innovations, market analysis, and investment opportunities from emerging financial technologies.',
        buttonText: 'Coming Soon',
        href: '#',
        comingSoon: true,
    },
];

export default function SuccessSection() {
    return (
        <section style={{ padding: '96px 0', background: '#f5f5f7' }}>
            <Container>
                {/* Section header with eyebrow + orange bar */}
                <Row style={{ marginBottom: '48px' }}>
                    <Col xs={12} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                            <span
                                className="section-eyebrow"
                                style={{ color: '#86868b' }}
                            >
                                What we offer
                            </span>
                            <div className="eyebrow-bar" />
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(30px, 5vw, 36px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginTop: '16px',
                                marginBottom: '16px',
                            }}
                        >
                            Intelligence-Powered<br />Business Ecosystem.
                        </h2>
                        <p
                            className="mx-auto"
                            style={{
                                fontSize: '14px',
                                color: '#86868b',
                                maxWidth: '480px',
                                lineHeight: 1.625,
                                fontWeight: 400,
                            }}
                        >
                            Our algorithms analyze global data streams to deliver strategic intelligence for entrepreneurs.
                        </p>
                    </Col>
                </Row>

                {/* Feature cards - 3 column grid */}
                <Row className="g-4 justify-content-center">
                    {features.map((feature, i) => (
                        <Col xs={12} md={6} lg={4} key={i}>
                            <div
                                className="h-100 d-flex flex-column"
                                style={{
                                    padding: '32px',
                                    borderRadius: '16px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'visible',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e5e5';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    const icon = e.currentTarget.querySelector('.feature-icon');
                                    if (icon) icon.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#f0f0f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    const icon = e.currentTarget.querySelector('.feature-icon');
                                    if (icon) icon.style.transform = 'scale(1)';
                                }}
                            >
                                {/* Coming Soon Badge */}
                                {feature.comingSoon && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '16px',
                                            backgroundColor: '#000',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            zIndex: 10,
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        Coming Soon
                                    </div>
                                )}

                                {/* Icon - black circle with white icon */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div
                                        className="feature-icon d-inline-flex align-items-center justify-content-center"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#000',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: '#fff', fontSize: '20px' }}
                                        >
                                            {feature.icon}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#000',
                                        marginBottom: '8px',
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p
                                    className="flex-grow-1"
                                    style={{
                                        fontSize: '14px',
                                        color: '#86868b',
                                        lineHeight: 1.625,
                                        fontWeight: 400,
                                        marginBottom: '24px',
                                    }}
                                >
                                    {feature.description}
                                </p>

                                {/* Button */}
                                <div className="mt-auto">
                                    {feature.comingSoon ? (
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '12px 32px',
                                                borderRadius: '9999px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#86868b',
                                                border: '1px solid #e5e5e5',
                                                opacity: 0.5,
                                                cursor: 'not-allowed',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {feature.buttonText}
                                        </span>
                                    ) : (
                                        <Link
                                            href={feature.href}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '12px 32px',
                                                borderRadius: '9999px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#000',
                                                border: '1px solid #e5e5e5',
                                                textDecoration: 'none',
                                                transition: 'all 0.15s ease',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#000';
                                                e.currentTarget.style.backgroundColor = '#000';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#e5e5e5';
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#000';
                                            }}
                                        >
                                            {feature.buttonText}
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}
