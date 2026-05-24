import { useContext } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout, { AuthContext } from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';

const CATEGORIES = [
    {
        key: 'bug',
        eyebrow: 'Bug report',
        title: 'Something broken?',
        body: 'Tell us what happened and what you expected. Screenshots help — we read every report.',
        icon: 'bug_report',
        color: '#ef4444',
    },
    {
        key: 'feature',
        eyebrow: 'Feature request',
        title: 'Idea you want to see?',
        body: 'Suggest a new capability or a tweak to an existing one. The best ideas come from people using the product.',
        icon: 'lightbulb',
        color: '#eab308',
    },
    {
        key: 'general',
        eyebrow: 'General',
        title: 'Just thoughts to share?',
        body: 'How does Edatsu feel to use? What works, what doesn\'t, what would you change?',
        icon: 'chat',
        color: '#3b82f6',
    },
];

const RECENT_SHIPS = [
    { title: 'Reading streaks & resume reading', date: 'May 2026' },
    { title: 'Public reading lists & profiles', date: 'May 2026' },
    { title: 'Article reactions & search', date: 'May 2026' },
    { title: 'Weekly personalized digest', date: 'May 2026' },
];

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScxI0lzMomnkHklK2Yi3i_9BsqK8BQcQ0Dt3JA-K6fruNsKSQ/viewform?usp=sf_link';

function CategoryCard({ category, ctaHref, ctaLabel }) {
    return (
        <Col md={4}>
            <div
                style={{
                    height: '100%',
                    padding: '32px',
                    borderRadius: '16px',
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${category.color}1a`,
                    border: `1px solid ${category.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                }}>
                    <span className="material-symbols-outlined" style={{
                        fontSize: '22px', color: category.color,
                        fontVariationSettings: "'FILL' 1",
                    }}>
                        {category.icon}
                    </span>
                </div>
                <span style={{
                    fontSize: '11px', fontWeight: 600,
                    color: category.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                }}>
                    {category.eyebrow}
                </span>
                <h3 style={{
                    fontSize: '20px', fontWeight: 600, color: '#000',
                    letterSpacing: '-0.01em',
                    margin: '0 0 12px',
                    lineHeight: 1.3,
                }}>
                    {category.title}
                </h3>
                <p style={{
                    fontSize: '14px', color: '#6e6e73',
                    lineHeight: 1.6,
                    margin: '0 0 24px',
                    flex: 1,
                }}>
                    {category.body}
                </p>
                <Link
                    href={ctaHref}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '13px', fontWeight: 600, color: '#000',
                        textDecoration: 'none', alignSelf: 'flex-start',
                    }}
                >
                    {ctaLabel}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </Link>
            </div>
        </Col>
    );
}

export default function Feedback() {
    const authUser = useContext(AuthContext);
    const { auth } = usePage().props;
    const isAuthenticated = !!authUser || !!auth?.user;

    const ctaFor = (categoryKey) => isAuthenticated
        ? `/subscriber-feedback?category=${categoryKey}`
        : `/login?intended=${encodeURIComponent('/subscriber-feedback?category=' + categoryKey)}`;

    const ctaLabel = isAuthenticated ? 'Open the form' : 'Sign in to submit';

    return (
        <GuestLayout>
            <Metadata
                title="Feedback | Edatsu Media"
                description="Share what's working, what's broken, and what you wish Edatsu Media did. We read every submission and ship from your ideas."
                keywords="feedback, bug report, feature request, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/feedback"
                ogTitle="Help us build Edatsu Media"
                ogDescription="Bugs, ideas, or just thoughts — drop them here. We ship from real user feedback."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/feedback"
                twitterTitle="Help us build Edatsu Media"
                twitterDescription="Bugs, ideas, or just thoughts — drop them here."
                twitterImage="/img/logo/default_logo.jpg"
            />

            {/* Hero */}
            <section style={{ paddingTop: '120px', paddingBottom: '64px', background: '#fff' }}>
                <Container>
                    <div className="d-flex flex-column align-items-start">
                        <span style={{
                            fontSize: '11px', fontWeight: 600,
                            color: '#86868b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                        }}>
                            Your voice matters
                        </span>
                        <div style={{ width: '24px', height: '2px', background: '#f97316', margin: '8px 0 16px' }} />
                        <h1 style={{
                            fontSize: 'clamp(32px, 5vw, 44px)',
                            fontWeight: 600,
                            color: '#000',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                            margin: '0 0 16px',
                            maxWidth: '720px',
                        }}>
                            We're building Edatsu Media with you
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#86868b',
                            lineHeight: 1.625,
                            maxWidth: '560px',
                            margin: 0,
                        }}>
                            Tell us what's working, what's broken, and what you wish we'd build next.
                            Every submission lands in our inbox and we ship from your ideas.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Category cards */}
            <section style={{ paddingTop: '32px', paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="g-4">
                        {CATEGORIES.map((c) => (
                            <CategoryCard
                                key={c.key}
                                category={c}
                                ctaHref={ctaFor(c.key)}
                                ctaLabel={ctaLabel}
                            />
                        ))}
                    </Row>

                    {/* Alternative paths */}
                    <div style={{
                        marginTop: '32px',
                        padding: '24px',
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #f0f0f0',
                    }}>
                        <Row className="g-3 align-items-center">
                            <Col md={8}>
                                <span style={{
                                    fontSize: '11px', fontWeight: 600, color: '#f97316',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                }}>
                                    Other ways to reach us
                                </span>
                                <p style={{ fontSize: '14px', color: '#000', margin: '8px 0 0', lineHeight: 1.55 }}>
                                    Prefer email? Send a note to{' '}
                                    <a href="mailto:feedback@edatsu.com" style={{ color: '#000', fontWeight: 500 }}>feedback@edatsu.com</a>.
                                    Or fill out our{' '}
                                    <a
                                        href={GOOGLE_FORM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#000', fontWeight: 500 }}
                                    >
                                        anonymous feedback form
                                    </a> — no account needed.
                                </p>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <a
                                    href={GOOGLE_FORM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 22px',
                                        borderRadius: '9999px',
                                        border: '1px solid #e5e5e5',
                                        background: '#fff',
                                        color: '#000',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#000';
                                        e.currentTarget.style.background = '#000';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e5e5';
                                        e.currentTarget.style.background = '#fff';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                >
                                    Open anonymous form
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                                </a>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>

            {/* Recent ships — social proof */}
            <section style={{ paddingTop: '64px', paddingBottom: '96px', background: '#fff' }}>
                <Container>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span style={{
                            fontSize: '11px', fontWeight: 600, color: '#86868b',
                            textTransform: 'uppercase', letterSpacing: '0.15em',
                        }}>
                            Shipped from your feedback
                        </span>
                        <div style={{ width: '24px', height: '2px', background: '#f97316', margin: '8px auto 16px' }} />
                        <h2 style={{
                            fontSize: 'clamp(24px, 4vw, 30px)',
                            fontWeight: 600, color: '#000',
                            letterSpacing: '-0.02em',
                            margin: '0 0 8px',
                        }}>
                            Recent improvements
                        </h2>
                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                            What real user input has turned into in the last release.
                        </p>
                    </div>

                    <Row className="g-3 justify-content-center">
                        {RECENT_SHIPS.map((ship, i) => (
                            <Col key={i} md={6} lg={5}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '16px 20px',
                                    background: '#fafafa',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '12px',
                                }}>
                                    <span style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: 'rgba(16,185,129,0.10)',
                                        border: '1px solid rgba(16,185,129,0.25)',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <span className="material-symbols-outlined" style={{
                                            fontSize: '16px', color: '#10b981',
                                            fontVariationSettings: "'FILL' 1",
                                        }}>
                                            check
                                        </span>
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '14px', fontWeight: 500, color: '#000',
                                            lineHeight: 1.4,
                                        }}>
                                            {ship.title}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#86868b', marginTop: '2px' }}>
                                            {ship.date}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                            See more at our{' '}
                            <a
                                href="https://github.com/edatsu-technology/edatsu_media/blob/main/CHANGELOG.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#000', fontWeight: 500 }}
                            >
                                public changelog
                            </a>
                            .
                        </p>
                    </div>
                </Container>
            </section>
        </GuestLayout>
    );
}
