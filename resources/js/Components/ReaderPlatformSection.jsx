import { Link } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Site convention (matches SuccessSection): 48px black circle, white icon.
// Eyebrow + accent colors give each card distinct identity without breaking
// the unified icon language.
const FEATURES = [
    {
        icon: 'rss_feed',
        eyebrow: 'Your reader',
        title: 'Build your own news feed',
        body: 'Paste any URL and we find the RSS. Save articles, write private notes, highlight passages. Reactions, search, and keyboard shortcuts built in.',
        cta: { label: 'Open Feeds', href: '/feeds' },
        accent: '#f97316',
    },
    {
        icon: 'share',
        eyebrow: 'Shareable lists',
        title: 'Curate public reading lists',
        body: 'Group articles into named collections. Flip the Public toggle and share a link like edatsu.com/u/your-name/ai-research — your curation, your audience.',
        cta: { label: 'See how it works', href: '/sign-up' },
        accent: '#3b82f6',
    },
    {
        icon: 'local_fire_department',
        eyebrow: 'Daily habit',
        title: 'Reading streaks & resume reading',
        body: 'Track consecutive days. Pick up long reads where you left off. Get a Sunday digest of what mattered in feeds you follow.',
        cta: { label: 'Start your streak', href: '/sign-up' },
        accent: '#10b981',
    },
];

export default function ReaderPlatformSection() {
    return (
        <section style={{ padding: '96px 0', background: '#fff' }}>
            <Container>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <span style={{
                        display: 'inline-block',
                        fontSize: '11px', fontWeight: 600,
                        color: '#86868b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '8px',
                    }}>
                        Built for readers
                    </span>
                    <div style={{ width: '24px', height: '2px', background: '#f97316', margin: '8px auto 16px' }} />
                    <h2 style={{
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        fontWeight: 600,
                        color: '#000',
                        letterSpacing: '-0.02em',
                        margin: '0 0 12px',
                        lineHeight: 1.2,
                    }}>
                        Discover, save, share — your way
                    </h2>
                    <p style={{
                        fontSize: '15px',
                        color: '#86868b',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                    }}>
                        Everything entrepreneurs and curious readers need to track the news, build a reading habit, and share what they're learning.
                    </p>
                </div>

                <Row className="g-4">
                    {FEATURES.map((f, i) => (
                        <Col key={i} md={4}>
                            <div
                                style={{
                                    height: '100%',
                                    padding: '32px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
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
                                <div
                                    className="d-inline-flex align-items-center justify-content-center"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#000',
                                        marginBottom: '20px',
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff' }}>
                                        {f.icon}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: '11px', fontWeight: 600,
                                    color: f.accent,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '6px',
                                }}>
                                    {f.eyebrow}
                                </span>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.01em',
                                    margin: '0 0 12px',
                                    lineHeight: 1.3,
                                }}>
                                    {f.title}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#6e6e73',
                                    lineHeight: 1.6,
                                    margin: '0 0 24px',
                                    flex: 1,
                                }}>
                                    {f.body}
                                </p>
                                <Link
                                    href={f.cta.href}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#000',
                                        textDecoration: 'none',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    {f.cta.label}
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                                </Link>
                            </div>
                        </Col>
                    ))}
                </Row>

                <div style={{
                    marginTop: '48px',
                    padding: '20px 24px',
                    background: '#f5f5f7',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: '#f97316', color: '#fff',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '14px',
                            flexShrink: 0,
                        }}>
                            ))
                        </span>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#000' }}>
                                Prefer RSS?
                            </div>
                            <div style={{ fontSize: '12px', color: '#86868b' }}>
                                Subscribe via your favourite reader. Updated every 30 minutes.
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/rss"
                        style={{
                            padding: '10px 22px',
                            borderRadius: '9999px',
                            background: '#000',
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 500,
                        }}
                    >
                        Browse RSS feeds
                    </Link>
                </div>
            </Container>
        </section>
    );
}
