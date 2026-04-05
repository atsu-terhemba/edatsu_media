import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import FixedMobileNav from '@/Components/FixedMobileNav';
import { usePage, Link } from '@inertiajs/react';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';

const ThreadCard = ({ thread }) => (
    <div
        style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid #f0f0f0',
            padding: '24px',
            marginBottom: '12px',
            transition: 'box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
        {thread.categories?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {thread.categories.map((c) => (
                    <span
                        key={c.id}
                        style={{
                            fontSize: '11px', fontWeight: 500, color: '#f97316',
                            background: '#fff7ed', border: '1px solid #fed7aa',
                            padding: '3px 10px', borderRadius: '9999px',
                        }}
                    >
                        {c.name}
                    </span>
                ))}
            </div>
        )}

        <Link href={`/forum/${thread.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 8px', lineHeight: 1.4 }}>
                {thread.title}
            </h3>
        </Link>

        {thread.body && (
            <p style={{ fontSize: '13px', color: '#86868b', lineHeight: 1.5, margin: '0 0 12px' }}>
                {thread.body.length > 180 ? thread.body.slice(0, 180) + '…' : thread.body}
            </p>
        )}

        {thread.article_link && (
            <a
                href={thread.article_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', color: '#86868b', textDecoration: 'none',
                    background: '#f5f5f7', padding: '6px 12px', borderRadius: '8px',
                    marginBottom: '12px',
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>link</span>
                {thread.article_source ? `${thread.article_source}: ` : ''}{thread.article_title || thread.article_link}
            </a>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#b0b0b5' }}>
            <span>{thread.user?.name || 'Anonymous'}</span>
            <span>·</span>
            <span>{thread.created_at}</span>
            <span>·</span>
            <span>{thread.posts_count} {thread.posts_count === 1 ? 'reply' : 'replies'}</span>
        </div>
    </div>
);

const Forum = () => {
    const { threads = [], auth } = usePage().props;
    const authUser = useContext(AuthContext);
    const isAuthenticated = !!authUser || !!auth?.user;

    return (
        <GuestLayout>
            <Metadata title="Forum" description="Community discussions from articles you read" />

            <section style={{ background: '#f5f5f7', minHeight: '90vh', padding: '96px 0 120px' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                    Community
                                </div>
                                <div style={{ width: '24px', height: '2px', background: '#f97316', marginBottom: '16px' }} />
                                <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#000', margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>
                                    Forum
                                </h1>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                                    Discussions sparked from articles. Start one from any feed.
                                </p>
                            </div>

                            {threads.length === 0 ? (
                                <div style={{
                                    background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                                    padding: '48px 24px', textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#b0b0b5', marginBottom: '12px', display: 'block' }}>
                                        chat_bubble
                                    </span>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 6px' }}>No discussions yet</h3>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                        Head to <a href="/feeds" style={{ color: '#f97316', textDecoration: 'none' }}>/feeds</a> and start one from an article.
                                    </p>
                                </div>
                            ) : (
                                threads.map((t) => <ThreadCard key={t.id} thread={t} />)
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>

            <FixedMobileNav isAuthenticated={isAuthenticated} />
        </GuestLayout>
    );
};

export default Forum;
