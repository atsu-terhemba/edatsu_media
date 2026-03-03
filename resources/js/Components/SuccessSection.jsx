import { Container, Row, Col, Card } from 'react-bootstrap';
import { TrendingUp, Wrench, LineChart, ArrowRight } from 'lucide-react';
import FlatButton from './FlatButton';

const features = [
    {
        icon: TrendingUp,
        title: 'Strategic Market Positioning',
        description:
            'Our bots scan 1,000+ data sources daily to surface hidden funding opportunities — delivering intelligence before it becomes public knowledge.',
        buttonText: 'Access Opportunities',
        href: '/opportunities',
        accent: '#dc2626',
    },
    {
        icon: Wrench,
        title: 'Productivity Tools',
        description:
            'Navigate the modern age of AI with intelligence-driven business productivity. We evaluate, rank, and monitor 500+ tools for entrepreneurs.',
        buttonText: 'Find Tools',
        href: '/toolshed',
        accent: '#1d1d1f',
    },
    {
        icon: LineChart,
        title: 'FinTech & Investment News',
        description:
            'Stay ahead with cutting-edge fintech innovations, market analysis, and investment opportunities from emerging financial technologies.',
        buttonText: 'Coming Soon',
        href: '#',
        accent: '#86868b',
        comingSoon: true,
    },
];

export default function SuccessSection() {
    return (
        <section style={{ padding: '72px 0', background: '#f5f5f7' }}>
            <Container>
                {/* Section header */}
                <Row className="mb-5">
                    <Col xs={12} className="text-center">
                        <p
                            style={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#86868b',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                            }}
                        >
                            What we offer
                        </p>
                        <h2
                            style={{
                                fontSize: '32px',
                                fontWeight: 600,
                                color: '#1d1d1f',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginBottom: '12px',
                            }}
                        >
                            Intelligence-Powered<br />Business Ecosystem.
                        </h2>
                        <p
                            className="mx-auto"
                            style={{
                                fontSize: '15px',
                                color: '#86868b',
                                maxWidth: '480px',
                                lineHeight: 1.5,
                                fontWeight: 400,
                            }}
                        >
                            Our algorithms analyze global data streams to deliver strategic intelligence for entrepreneurs.
                        </p>
                    </Col>
                </Row>

                {/* Feature cards */}
                <Row className="g-4 justify-content-center">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <Col xs={12} sm={6} md={4} key={i}>
                                <Card
                                    className="h-100 border-0 d-flex"
                                    style={{
                                        borderRadius: '18px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                        position: 'relative',
                                        overflow: 'visible',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {/* Coming Soon Badge */}
                                    {feature.comingSoon && (
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: '-10px',
                                                right: '16px',
                                                backgroundColor: '#dc2626',
                                                color: 'white',
                                                padding: '5px 14px',
                                                borderRadius: '980px',
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                zIndex: 10,
                                                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            Coming Soon
                                        </div>
                                    )}

                                    <Card.Body className="p-4 text-center d-flex flex-column">
                                        {/* Icon */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <div
                                                className="d-inline-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '12px',
                                                    backgroundColor: feature.accent,
                                                }}
                                            >
                                                <Icon size={22} color="#fff" />
                                            </div>
                                        </div>

                                        <h4
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                color: '#1d1d1f',
                                                marginBottom: '8px',
                                                letterSpacing: '-0.01em',
                                                lineHeight: 1.25,
                                            }}
                                        >
                                            {feature.title}
                                        </h4>
                                        <p
                                            className="flex-grow-1"
                                            style={{
                                                fontSize: '13px',
                                                color: '#86868b',
                                                lineHeight: 1.5,
                                                fontWeight: 400,
                                                marginBottom: '20px',
                                            }}
                                        >
                                            {feature.description}
                                        </p>

                                        <div className="mt-auto">
                                            <FlatButton
                                                href={feature.href}
                                                variant="secondary"
                                                disabled={feature.comingSoon}
                                                className="w-100 d-flex align-items-center justify-content-center gap-2"
                                                style={feature.comingSoon ? { opacity: 0.5, cursor: 'not-allowed', fontSize: '13px' } : { fontSize: '13px' }}
                                            >
                                                {feature.buttonText}
                                                <ArrowRight size={13} />
                                            </FlatButton>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
}
