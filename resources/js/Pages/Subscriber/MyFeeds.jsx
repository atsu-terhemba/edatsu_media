import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from '@/Components/Footer';

export default function MyFeeds({ feeds: initialFeeds }) {
    const [feeds, setFeeds] = useState(initialFeeds || []);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const removeFeed = async (id) => {
        try {
            await axios.delete(`/api/news-feeds/${id}`);
            setFeeds((prev) => prev.filter((f) => f.id !== id));
            Toast.fire({ icon: 'success', title: 'Feed removed' });
        } catch (err) {
            Toast.fire({ icon: 'error', title: 'Failed to remove feed' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Feeds" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>

                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ paddingBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <h1 style={{
                                            fontSize: '28px',
                                            fontWeight: 600,
                                            color: '#000',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                        }}>
                                            My Feeds
                                        </h1>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0' }}>
                                            RSS sources you've added to your news feed
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Link
                                            href="/feeds"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '7px 16px',
                                                borderRadius: '9999px',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: '#fff',
                                                border: 'none',
                                                background: '#000',
                                                textDecoration: 'none',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add</span>
                                            Add Feed
                                        </Link>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '9999px',
                                            background: '#f5f5f7',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#000',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rss_feed</span>
                                            {feeds.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Feed list */}
                            {feeds.length > 0 ? (
                                <div>
                                    {feeds.map((feed) => (
                                        <div
                                            key={feed.id}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '16px',
                                                border: '1px solid #f0f0f0',
                                                background: '#fff',
                                                marginBottom: '12px',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#e0e0e0';
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#f0f0f0';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        {feed.feed_favicon && (
                                                            <img
                                                                src={feed.feed_favicon}
                                                                alt=""
                                                                width={20}
                                                                height={20}
                                                                style={{ borderRadius: '4px', flexShrink: 0 }}
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        )}
                                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>
                                                            {feed.feed_title || feed.feed_url}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                                        <a
                                                            href={feed.site_url || feed.feed_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                fontSize: '12px',
                                                                color: '#86868b',
                                                                textDecoration: 'none',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: '300px',
                                                                display: 'inline-block',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                                                        >
                                                            {feed.feed_url}
                                                        </a>
                                                        <span style={{ fontSize: '12px', color: '#b0b0b5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                                                            Added {formatDate(feed.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div style={{ position: 'relative' }} ref={openMenuId === feed.id ? menuRef : null}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === feed.id ? null : feed.id)}
                                                        style={{
                                                            width: '36px', height: '36px', borderRadius: '10px',
                                                            background: '#f5f5f7', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'background 0.15s ease', flexShrink: 0,
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8ed'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>more_horiz</span>
                                                    </button>

                                                    {openMenuId === feed.id && (
                                                        <div style={{
                                                            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                                                            width: '200px', background: '#fff', borderRadius: '14px',
                                                            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                            border: '1px solid #f0f0f0', zIndex: 100, overflow: 'hidden', padding: '6px',
                                                        }}>
                                                            <a
                                                                href={feed.site_url || feed.feed_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => setOpenMenuId(null)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                                    borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                                                                    color: '#000', transition: 'background 0.15s ease',
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>open_in_new</span>
                                                                Visit Website
                                                            </a>
                                                            <Link
                                                                href="/feeds"
                                                                onClick={() => setOpenMenuId(null)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                                    borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                                                                    color: '#000', transition: 'background 0.15s ease',
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>rss_feed</span>
                                                                View in Feeds
                                                            </Link>
                                                            <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                            <button
                                                                onClick={() => { removeFeed(feed.id); setOpenMenuId(null); }}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                                    borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                                                                    color: '#dc3545', background: 'transparent', border: 'none',
                                                                    width: '100%', cursor: 'pointer', transition: 'background 0.15s ease', textAlign: 'left',
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#dc3545' }}>delete</span>
                                                                Remove Feed
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '64px 24px', borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '32px' }}>
                                    <span style={{
                                        width: '64px', height: '64px', borderRadius: '50%', background: '#f5f5f7',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#86868b' }}>rss_feed</span>
                                    </span>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>No Feeds Yet</h3>
                                    <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                                        Add RSS feeds from the feeds page to track your favourite sources here.
                                    </p>
                                    <Link
                                        href="/feeds"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px',
                                            borderRadius: '9999px', fontSize: '13px', fontWeight: 500, background: '#000',
                                            color: '#fff', border: 'none', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                    >
                                        Browse Feeds
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                                    </Link>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
        </AuthenticatedLayout>
    );
}
