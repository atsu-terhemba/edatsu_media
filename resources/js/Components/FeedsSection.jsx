import { Container, Row, Col } from 'react-bootstrap';
import { Link } from '@inertiajs/react';

const benefits = [
    {
        icon: 'rss_feed',
        title: 'One feed, every source you follow',
        description:
            'Add any RSS feed — TechCrunch, Stratechery, your favourite newsletter — and read it all in one minimal reader without jumping between tabs.',
    },
    {
        icon: 'bookmark',
        title: 'Bookmark what matters, return when you can',
        description:
            'Save articles for later with optional deadline reminders, so the piece you meant to act on never gets buried under tomorrow’s noise.',
    },
    {
        icon: 'forum',
        title: 'Start the conversation in the community',
        description:
            'Share an article straight into the Edatsu forum and trade takes with founders, operators, and investors who actually care.',
    },
];

export default function FeedsSection() {
    return (
        <section style={{ padding: '96px 0', background: '#fff' }}>
            <Container>
                <Row className="align-items-center g-5">
                    <Col xs={12} lg={6}>
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                aspectRatio: '4 / 3',
                                background: '#000',
                                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                                alt="Two people in conversation over what they’ve been reading"
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.05) 100%)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '24px',
                                    right: '24px',
                                    bottom: '24px',
                                    color: '#fff',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        background: 'rgba(255, 255, 255, 0.18)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        marginBottom: '14px',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                        rss_feed
                                    </span>
                                    My Feeds
                                </span>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        lineHeight: 1.5,
                                        color: 'rgba(255, 255, 255, 0.92)',
                                        margin: 0,
                                        maxWidth: '320px',
                                    }}
                                >
                                    Follow the sources you trust. Save what you’ll act on. Talk it through.
                                </p>
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} lg={6}>
                        <div className="d-flex flex-column align-items-start">
                            <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                My Feeds
                            </span>
                            {/* Default .eyebrow-bar uses margin: 8px auto 0 to center
                                under the centered SuccessSection heading. Here the
                                column is left-aligned, so override the auto margins. */}
                            <div className="eyebrow-bar" style={{ marginLeft: 0, marginRight: 0 }} />
                        </div>

                        <h2
                            style={{
                                fontSize: 'clamp(28px, 4.5vw, 36px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginTop: '16px',
                                marginBottom: '16px',
                            }}
                        >
                            Read, save, and discuss the<br />news that moves your business.
                        </h2>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.625,
                                fontWeight: 400,
                                marginBottom: '32px',
                                maxWidth: '480px',
                            }}
                        >
                            My Feeds turns Edatsu into your daily reading hub — pull in any RSS source, bookmark what you’ll come back to, and bring articles straight into the community forum where founders are already talking.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {benefits.map((b, i) => (
                                <li
                                    key={b.icon}
                                    style={{
                                        display: 'flex',
                                        gap: '14px',
                                        marginBottom: i === benefits.length - 1 ? 0 : '20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: '#000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: '#fff', fontSize: '18px' }}
                                        >
                                            {b.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                color: '#000',
                                                marginBottom: '4px',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {b.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: '13px',
                                                color: '#86868b',
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            {b.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '12px 28px',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#fff',
                                backgroundColor: '#000',
                                border: '1px solid #000',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1f2937';
                                e.currentTarget.style.borderColor = '#1f2937';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#000';
                                e.currentTarget.style.borderColor = '#000';
                            }}
                        >
                            Start your reading hub
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                arrow_forward
                            </span>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
