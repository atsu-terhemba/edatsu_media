import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import AdBanner from '@/Components/AdBanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import FixedMobileNav from '@/Components/FixedMobileNav';

/* ── Feed Card Skeleton ── */
const FeedCardSkeleton = () => (
    <div
        style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid #f0f0f0',
            padding: '24px',
            marginBottom: '16px',
        }}
    >
        <div className="d-flex align-items-center gap-3 mb-3">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0f0f0' }} />
            <div style={{ width: 140, height: 14, borderRadius: 6, background: '#f0f0f0' }} />
        </div>
        {[1, 2, 3].map((i) => (
            <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ width: '80%', height: 13, borderRadius: 6, background: '#f0f0f0', marginBottom: 8 }} />
                <div style={{ width: '50%', height: 11, borderRadius: 6, background: '#f5f5f7' }} />
            </div>
        ))}
    </div>
);

/* ── Feed Card ── */
const FeedCard = ({ feed, onRemove, isAuthenticated, savedArticleLinks, onToggleSaveArticle }) => {
    const [expanded, setExpanded] = useState(false);
    const isLoading = feed.articles === null;
    const visibleArticles = feed.articles ? (expanded ? feed.articles : feed.articles.slice(0, 5)) : [];
    const hasMore = feed.articles && feed.articles.length > 5;

    return (
        <div
            style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                padding: '24px',
                marginBottom: '16px',
                transition: 'box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={feed.favicon}
                        alt=""
                        width={20}
                        height={20}
                        style={{ borderRadius: '4px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>
                        {feed.title}
                    </span>
                </div>
                {onRemove && (
                    <button
                        onClick={() => onRemove(feed)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '8px',
                            transition: 'background 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        title="Remove feed"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#86868b' }}>
                            close
                        </span>
                    </button>
                )}
            </div>

            {/* Loading skeleton for articles */}
            {isLoading && (
                <div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ marginBottom: 16 }}>
                            <div style={{ width: '80%', height: 13, borderRadius: 6, background: '#f0f0f0', marginBottom: 8 }} />
                            <div style={{ width: '50%', height: 11, borderRadius: 6, background: '#f5f5f7' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Articles */}
            {!isLoading && visibleArticles.length > 0 ? (
                <div>
                    {visibleArticles.map((article, i) => {
                        const isSaved = savedArticleLinks.includes(article.link);
                        return (
                            <div
                                key={i}
                                style={{
                                    padding: '12px 0',
                                    borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        textDecoration: 'none',
                                        transition: 'opacity 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', lineHeight: 1.4, marginBottom: '4px' }}>
                                        {article.title}
                                    </div>
                                    {article.description && (
                                        <div style={{ fontSize: '13px', color: '#86868b', lineHeight: 1.5, marginBottom: '4px' }}>
                                            {article.description}
                                        </div>
                                    )}
                                    {article.published_at && (
                                        <div style={{ fontSize: '12px', color: '#b0b0b5' }}>
                                            {article.published_at}
                                        </div>
                                    )}
                                </a>
                                <button
                                    onClick={() => onToggleSaveArticle(article, feed)}
                                    title={isSaved ? 'Remove from saved' : 'Save for later'}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '8px',
                                        transition: 'background 0.15s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0,
                                        marginTop: '2px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: '20px',
                                            color: isSaved ? '#f97316' : '#b0b0b5',
                                            fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                                        }}
                                    >
                                        bookmark
                                    </span>
                                </button>
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#f97316',
                                padding: 0,
                                transition: 'opacity 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {expanded
                                ? 'Show less'
                                : `Show ${feed.articles.length - 5} more articles`}
                        </button>
                    )}
                </div>
            ) : !isLoading ? (
                <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                    No articles found
                </p>
            ) : null}
        </div>
    );
};

/* ── Region Pill ── */
const RegionPill = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '6px 16px',
            borderRadius: '9999px',
            border: isActive ? 'none' : '1px solid #e5e5e5',
            background: isActive ? '#000' : '#fff',
            color: isActive ? '#fff' : '#86868b',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
            if (!isActive) {
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.color = '#000';
            }
        }}
        onMouseLeave={(e) => {
            if (!isActive) {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.color = '#86868b';
            }
        }}
    >
        {label}
    </button>
);

/* ── Default Feed Toggle Row ── */
const DefaultFeedToggle = ({ feed, isVisible, onToggle }) => (
    <div
        className="d-flex align-items-center justify-content-between"
        style={{
            padding: '10px 0',
            borderBottom: '1px solid #f5f5f7',
        }}
    >
        <div className="d-flex align-items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
            <img
                src={feed.favicon}
                alt=""
                width={18}
                height={18}
                style={{ borderRadius: '4px', flexShrink: 0 }}
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {feed.title}
            </span>
        </div>
        <button
            onClick={() => onToggle(feed)}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
            }}
            title={isVisible ? 'Hide feed' : 'Show feed'}
        >
            <span
                className="material-symbols-outlined"
                style={{
                    fontSize: '20px',
                    color: isVisible ? '#f97316' : '#d1d1d6',
                    fontVariationSettings: isVisible ? "'FILL' 1" : "'FILL' 0",
                    transition: 'color 0.15s ease',
                }}
            >
                visibility
            </span>
        </button>
    </div>
);

/* ── Main News Page ── */
const News = () => {
    const { savedFeeds: initialFeeds = [], defaultFeedsByRegion = {}, regions = [], savedArticleLinks: initialSavedLinks = [], auth } = usePage().props;
    const authUser = useContext(AuthContext);
    const isAuthenticated = !!authUser || !!auth?.user;

    const [feeds, setFeeds] = useState(initialFeeds);
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [savedArticleLinks, setSavedArticleLinks] = useState(initialSavedLinks);

    // Default feeds state — mutable so we can populate articles
    const [defaultFeeds, setDefaultFeeds] = useState(defaultFeedsByRegion);

    // Region selection — default to first available region
    const availableRegions = regions.filter((r) => defaultFeeds[r]?.length > 0 || defaultFeedsByRegion[r]?.length > 0);
    const [activeRegion, setActiveRegion] = useState(availableRegions[0] || '');

    // Track which default feeds are visible (by feed_url) — all visible by default
    const [hiddenFeedUrls, setHiddenFeedUrls] = useState(new Set());

    // Lazy-load articles for a single feed
    const fetchFeedArticles = useCallback(async (feedUrl) => {
        try {
            const res = await axios.post('/api/news-feeds/fetch-articles', { url: feedUrl });
            return res.data;
        } catch {
            return null;
        }
    }, []);

    // Fetch articles for saved feeds on mount
    useEffect(() => {
        feeds.forEach((feed, index) => {
            if (feed.articles !== null) return;
            fetchFeedArticles(feed.feed_url).then((data) => {
                if (!data) return;
                setFeeds((prev) => prev.map((f, i) =>
                    i === index ? {
                        ...f,
                        title: data.title || f.title,
                        favicon: data.favicon || f.favicon,
                        articles: data.articles || [],
                    } : f
                ));
            });
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch articles for the active region's default feeds
    useEffect(() => {
        if (!activeRegion) return;
        const regionFeeds = defaultFeeds[activeRegion] || [];
        regionFeeds.forEach((feed, index) => {
            if (feed.articles !== null) return; // already loaded
            fetchFeedArticles(feed.feed_url).then((data) => {
                if (!data) return;
                setDefaultFeeds((prev) => {
                    const updated = { ...prev };
                    updated[activeRegion] = (updated[activeRegion] || []).map((f, i) =>
                        i === index ? {
                            ...f,
                            title: data.title || f.title,
                            favicon: data.favicon || f.favicon,
                            articles: data.articles || [],
                        } : f
                    );
                    return updated;
                });
            });
        });
    }, [activeRegion]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleDefaultFeedVisibility = (feed) => {
        setHiddenFeedUrls((prev) => {
            const next = new Set(prev);
            if (next.has(feed.feed_url)) {
                next.delete(feed.feed_url);
            } else {
                next.add(feed.feed_url);
            }
            return next;
        });
    };

    // Get current region's feeds
    const currentRegionFeeds = defaultFeeds[activeRegion] || [];
    const visibleRegionFeeds = currentRegionFeeds.filter((f) => !hiddenFeedUrls.has(f.feed_url));

    const handleToggleSaveArticle = async (article, feed) => {
        if (!isAuthenticated) {
            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <span class="material-symbols-outlined" style="font-size: 48px; color: #f97316; margin-bottom: 16px; display: block; font-variation-settings: 'FILL' 1;">bookmark</span>
                        <h3 style="font-weight: 600; margin-bottom: 8px; color: #000; font-size: 1.15rem; font-family: 'Poppins', sans-serif;">Save articles for later</h3>
                        <p style="color: #86868b; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                            Create a free account to bookmark articles and access them anytime.
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <a href="/login" style="padding: 10px 24px; border-radius: 9999px; border: 1px solid #e5e5e5; background: #fff; color: #000; font-size: 13px; font-weight: 500; text-decoration: none; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;">
                                Login
                            </a>
                            <a href="/sign-up" style="padding: 10px 24px; border-radius: 9999px; border: none; background: #000; color: #fff; font-size: 13px; font-weight: 500; text-decoration: none; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;">
                                Sign Up Free
                            </a>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                width: '420px',
                padding: '0',
                background: 'white',
                customClass: {
                    popup: 'auth-modal-popup',
                    closeButton: 'subscription-modal-close',
                },
            });
            return;
        }

        const isSaved = savedArticleLinks.includes(article.link);

        if (isSaved) {
            // Unsave
            setSavedArticleLinks((prev) => prev.filter((l) => l !== article.link));
            try {
                await axios.post('/api/news-feeds/unsave-article', { article_link: article.link });
            } catch (err) {
                console.error('Failed to unsave article:', err);
                setSavedArticleLinks((prev) => [...prev, article.link]);
            }
        } else {
            // Save
            setSavedArticleLinks((prev) => [...prev, article.link]);
            try {
                await axios.post('/api/news-feeds/save-article', {
                    article_title: article.title,
                    article_link: article.link,
                    article_description: article.description || '',
                    article_date: article.published_at || '',
                    feed_title: feed.title,
                    feed_favicon: feed.favicon,
                });
            } catch (err) {
                console.error('Failed to save article:', err);
                setSavedArticleLinks((prev) => prev.filter((l) => l !== article.link));
            }
        }
    };

    const handleAddFeed = async (e) => {
        e?.preventDefault();
        const url = inputUrl.trim();
        if (!url) return;

        // Basic URL validation
        if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(url)) {
            setError('Please enter a valid URL');
            return;
        }

        // Check for duplicates across user feeds and all default feeds
        const normalizedUrl = url.toLowerCase().replace(/\/$/, '');
        const allDefaultFeeds = Object.values(defaultFeeds).flat();
        const allFeeds = [...feeds, ...allDefaultFeeds];
        const isDuplicate = allFeeds.some(
            (f) =>
                f.feed_url?.toLowerCase().replace(/\/$/, '') === normalizedUrl ||
                f.site_url?.toLowerCase().replace(/\/$/, '') === normalizedUrl
        );
        if (isDuplicate) {
            setError('This feed is already added');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Ensure URL has protocol
            const fullUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;

            const response = await axios.post('/api/news-feeds/preview', { url: fullUrl });
            const feedData = response.data;

            // If authenticated, save to account immediately
            if (isAuthenticated) {
                try {
                    const saveResponse = await axios.post('/api/news-feeds', {
                        feed_url: feedData.feed_url,
                        site_url: feedData.site_url,
                        feed_title: feedData.title,
                        feed_favicon: feedData.favicon,
                    });
                    feedData.id = saveResponse.data.id;
                } catch (saveErr) {
                    console.error('Failed to save feed:', saveErr);
                }
            }

            setFeeds((prev) => [feedData, ...prev]);
            setInputUrl('');

            // Show save prompt for guests after 2 feeds
            if (!isAuthenticated && feeds.length >= 1) {
                setShowSavePrompt(true);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No RSS feed found for this URL. Try a different link.');
            } else if (err.response?.status === 422) {
                setError('Please enter a valid URL');
            } else if (err.response?.status === 429) {
                setError('Too many requests. Please wait a moment and try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFeed = async (feed) => {
        // If saved to account, delete from backend
        if (feed.id && isAuthenticated) {
            try {
                await axios.delete(`/api/news-feeds/${feed.id}`);
            } catch (err) {
                console.error('Failed to remove feed:', err);
            }
        }
        setFeeds((prev) => prev.filter((f) => f !== feed));
    };

    return (
        <GuestLayout>
            <Metadata
                title="News | Edatsu Media"
                description="Build your personalized news feed. Track updates from any source with Edatsu Media."
                keywords="business news, RSS feed, personalized news, startup news, entrepreneurship, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/news"
                ogTitle="News | Edatsu Media"
                ogDescription="Build your personalized news feed. Track updates from any source with Edatsu Media."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/news"
                twitterTitle="News | Edatsu Media"
                twitterDescription="Build your personalized news feed. Track updates from any source with Edatsu Media."
                twitterImage="/img/logo/default_logo.jpg"
            />

            {/* Page Header */}
            <section style={{ paddingTop: '96px', paddingBottom: '48px', background: '#fff' }}>
                <Container>
                    <div className="d-flex flex-column align-items-start">
                        <div className="d-flex flex-column align-items-start mb-3">
                            <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                Stay Informed
                            </span>
                            <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(30px, 5vw, 36px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginBottom: '12px',
                            }}
                        >
                            Feeds
                        </h1>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.625,
                                fontWeight: 400,
                                maxWidth: '480px',
                                margin: 0,
                            }}
                        >
                            Build your personalized news feed — paste any URL to start tracking updates
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '32px' }}>
                        {/* Sidebar */}
                        <Col xs={12} md={4} lg={3}>
                            <div
                                className="d-none d-md-block"
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '16px',
                                    position: 'sticky',
                                    top: '72px',
                                }}
                            >
                                <div className="p-4">
                                    {/* Subscribe box */}
                                    <div
                                        style={{
                                            padding: '24px',
                                            borderRadius: '12px',
                                            background: '#000',
                                            color: '#fff',
                                        }}
                                    >
                                        <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                                            Subscribe
                                        </h5>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '16px' }}>
                                            Get the latest news & insights delivered
                                        </p>
                                        <button
                                            onClick={showOpportunitiesSubscriptionModal}
                                            style={{
                                                width: '100%',
                                                padding: '10px 24px',
                                                borderRadius: '9999px',
                                                border: 'none',
                                                background: '#fff',
                                                color: '#000',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f1f1')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                                        >
                                            Subscribe
                                        </button>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="d-flex gap-3 mt-4" style={{ flexWrap: 'wrap' }}>
                                        {[
                                            { label: 'Advertise', href: '/advertise' },
                                            { label: 'Help', href: '/help' },
                                            { label: 'Terms', href: '/terms' },
                                        ].map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.href}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    color: '#86868b',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '#86868b')}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Ad: Sidebar */}
                                    <div style={{ marginTop: '16px' }}>
                                        <AdBanner slot="news_sidebar" page="news" position="sidebar-right" size="medium-rectangle" />
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Main Content */}
                        <Col xs={12} md={8} lg={9}>
                            {/* Ad: Top */}
                            <div style={{ marginBottom: 16 }}>
                                <AdBanner slot="feeds_top" page="feeds" position="top" size="leaderboard" />
                            </div>

                            {/* Feed Input */}
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #f0f0f0',
                                    padding: '24px',
                                    marginBottom: '16px',
                                }}
                            >
                                <form onSubmit={handleAddFeed}>
                                    <div className="d-flex gap-3 align-items-center">
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    position: 'absolute',
                                                    left: '14px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    fontSize: '18px',
                                                    color: '#b0b0b5',
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                link
                                            </span>
                                            <input
                                                type="text"
                                                value={inputUrl}
                                                onChange={(e) => {
                                                    setInputUrl(e.target.value);
                                                    if (error) setError('');
                                                }}
                                                placeholder="Paste a website or RSS feed URL..."
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px 12px 42px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e5e5e5',
                                                    fontSize: '14px',
                                                    color: '#000',
                                                    outline: 'none',
                                                    transition: 'border-color 0.15s ease',
                                                    background: '#f9f9f9',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#000';
                                                    e.target.style.background = '#fff';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e5e5e5';
                                                    e.target.style.background = '#f9f9f9';
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !inputUrl.trim()}
                                            style={{
                                                padding: '12px 24px',
                                                borderRadius: '9999px',
                                                border: 'none',
                                                background: isLoading || !inputUrl.trim() ? '#d1d1d6' : '#000',
                                                color: '#fff',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: isLoading || !inputUrl.trim() ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.15s ease',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        style={{ width: '14px', height: '14px', borderWidth: '2px' }}
                                                    />
                                                    Fetching...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                                        add
                                                    </span>
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <div style={{ marginTop: '10px', fontSize: '13px', color: '#ff3b30' }}>
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Save prompt for guests */}
                            {showSavePrompt && !isAuthenticated && (
                                <div
                                    style={{
                                        backgroundColor: '#000',
                                        borderRadius: '16px',
                                        padding: '20px 24px',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>
                                            Sign up to save your feeds
                                        </p>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0, marginTop: '4px' }}>
                                            Create an account to keep your news feed across sessions
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => setShowSavePrompt(false)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '9999px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'transparent',
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Dismiss
                                        </button>
                                        <Link
                                            href="/sign-up"
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '9999px',
                                                border: 'none',
                                                background: '#fff',
                                                color: '#000',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                textDecoration: 'none',
                                                transition: 'background 0.15s ease',
                                            }}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Loading skeleton */}
                            {isLoading && feeds.length === 0 && <FeedCardSkeleton />}

                            {/* User's Feed Cards */}
                            {feeds.length > 0 && (
                                <>
                                    <div style={{ marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Your Feeds
                                        </span>
                                    </div>
                                    {feeds.map((feed, index) => (
                                        <FeedCard
                                            key={feed.id || feed.feed_url || index}
                                            feed={feed}
                                            onRemove={handleRemoveFeed}
                                            isAuthenticated={isAuthenticated}
                                            savedArticleLinks={savedArticleLinks}
                                            onToggleSaveArticle={handleToggleSaveArticle}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Regional Default Feeds */}
                            {availableRegions.length > 0 && (
                                <>
                                    <div style={{ marginTop: feeds.length > 0 ? '24px' : '0', marginBottom: '16px' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Trending Sources
                                            </span>
                                        </div>

                                        {/* Region Pills */}
                                        <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                                            {availableRegions.map((region) => (
                                                <RegionPill
                                                    key={region}
                                                    label={region}
                                                    isActive={activeRegion === region}
                                                    onClick={() => setActiveRegion(region)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Feed Selector — toggle which feeds to show */}
                                    {currentRegionFeeds.length > 0 && (
                                        <div
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '16px',
                                                border: '1px solid #f0f0f0',
                                                padding: '16px 20px',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>
                                                    tune
                                                </span>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#000' }}>
                                                    Select feeds to display
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#86868b', marginLeft: 'auto' }}>
                                                    {visibleRegionFeeds.length}/{currentRegionFeeds.length} visible
                                                </span>
                                            </div>
                                            {currentRegionFeeds.map((feed, i) => (
                                                <DefaultFeedToggle
                                                    key={feed.feed_url || i}
                                                    feed={feed}
                                                    isVisible={!hiddenFeedUrls.has(feed.feed_url)}
                                                    onToggle={toggleDefaultFeedVisibility}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Visible Feed Cards */}
                                    {visibleRegionFeeds.map((feed, index) => (
                                        <FeedCard
                                            key={`default-${activeRegion}-${feed.feed_url || index}`}
                                            feed={feed}
                                            isAuthenticated={isAuthenticated}
                                            savedArticleLinks={savedArticleLinks}
                                            onToggleSaveArticle={handleToggleSaveArticle}
                                        />
                                    ))}

                                    {visibleRegionFeeds.length === 0 && currentRegionFeeds.length > 0 && (
                                        <div
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '16px',
                                                border: '1px solid #f0f0f0',
                                                padding: '40px 24px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                                All feeds hidden — toggle some on above to see articles
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Empty state - only if no feeds at all */}
                            {feeds.length === 0 && availableRegions.length === 0 && !isLoading && (
                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        border: '1px solid #f0f0f0',
                                        padding: '64px 24px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '16px', display: 'block' }}
                                    >
                                        rss_feed
                                    </span>
                                    <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                        Add a URL above to start building your news feed
                                    </p>
                                </div>
                            )}

                            {/* Ad: Bottom */}
                            <div style={{ marginTop: 24 }}>
                                <AdBanner slot="feeds_bottom" page="feeds" position="bottom" size="leaderboard" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <FixedMobileNav isAuthenticated={isAuthenticated} />
        </GuestLayout>
    );
};

export default News;
