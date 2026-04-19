import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import FixedMobileNav from '@/Components/FixedMobileNav';
import { usePage, Link } from '@inertiajs/react';
import { useContext, useState } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import ArticleReaderModal from '@/Components/ArticleReaderModal';

const ThreadCard = ({ thread, onReadArticle }) => (
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
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onReadArticle?.({
                        title: thread.article_title || thread.article_link,
                        link: thread.article_link,
                    });
                }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', color: '#86868b', textDecoration: 'none',
                    background: '#f5f5f7', padding: '6px 12px', borderRadius: '8px',
                    marginBottom: '12px', border: 'none', cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ececf1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>link</span>
                {thread.article_source ? `${thread.article_source}: ` : ''}{thread.article_title || thread.article_link}
            </button>
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
    const currentUserId = auth?.user?.id ?? authUser?.id ?? null;
    const [readerArticle, setReaderArticle] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const myThreadCount = currentUserId
        ? threads.filter((t) => t.user?.id === currentUserId).length
        : 0;

    const visibleThreads = activeTab === 'mine' && currentUserId
        ? threads.filter((t) => t.user?.id === currentUserId)
        : activeTab === 'others' && currentUserId
            ? threads.filter((t) => t.user?.id !== currentUserId)
            : threads;

    const tabs = [
        { id: 'all', label: 'All discussions', count: threads.length },
        ...(isAuthenticated ? [
            { id: 'mine', label: 'My discussions', count: myThreadCount },
            { id: 'others', label: 'Others', count: threads.length - myThreadCount },
        ] : []),
    ];

    const emptyCopy = activeTab === 'mine'
        ? {
            title: "You haven't started any discussions yet",
            body: (
                <>Head to <a href="/feeds" style={{ color: '#f97316', textDecoration: 'none' }}>/feeds</a> and start one from an article.</>
            ),
        }
        : activeTab === 'others'
        ? {
            title: 'No other discussions yet',
            body: 'When others start discussions, they will appear here.',
        }
        : {
            title: 'No discussions yet',
            body: (
                <>Head to <a href="/feeds" style={{ color: '#f97316', textDecoration: 'none' }}>/feeds</a> and start one from an article.</>
            ),
        };

    return (
        <GuestLayout>
            <Metadata title="Forum" description="Community discussions from articles you read" />

            <section style={{ background: '#f5f5f7', minHeight: '90vh', padding: '96px 0 120px' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div style={{ marginBottom: '24px' }}>
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

                            {isAuthenticated && (
                                <div style={{
                                    display: 'flex', gap: '6px', flexWrap: 'wrap',
                                    marginBottom: '20px', padding: '4px',
                                    background: '#fff', border: '1px solid #f0f0f0',
                                    borderRadius: '9999px', width: 'fit-content', maxWidth: '100%',
                                    overflowX: 'auto',
                                }}>
                                    {tabs.map((tab) => {
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '7px 16px', borderRadius: '9999px',
                                                    fontSize: '13px', fontWeight: 500,
                                                    background: isActive ? '#000' : 'transparent',
                                                    color: isActive ? '#fff' : '#86868b',
                                                    border: 'none', cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    fontFamily: "'Poppins', sans-serif",
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {tab.label}
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 600,
                                                    padding: '1px 8px', borderRadius: '9999px',
                                                    background: isActive ? 'rgba(255,255,255,0.18)' : '#f5f5f7',
                                                    color: isActive ? '#fff' : '#86868b',
                                                }}>
                                                    {tab.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {visibleThreads.length === 0 ? (
                                <div style={{
                                    background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                                    padding: '48px 24px', textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#b0b0b5', marginBottom: '12px', display: 'block' }}>
                                        chat_bubble
                                    </span>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 6px' }}>{emptyCopy.title}</h3>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                        {emptyCopy.body}
                                    </p>
                                </div>
                            ) : (
                                visibleThreads.map((t) => (
                                    <ThreadCard
                                        key={t.id}
                                        thread={t}
                                        onReadArticle={setReaderArticle}
                                    />
                                ))
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>

            <ArticleReaderModal
                article={readerArticle}
                onClose={() => setReaderArticle(null)}
                isAuthenticated={isAuthenticated}
            />

            <FixedMobileNav isAuthenticated={isAuthenticated} />
        </GuestLayout>
    );
};

export default Forum;
