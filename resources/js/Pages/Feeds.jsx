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

/* ── Last-seen helpers (localStorage) ── */
const LAST_SEEN_KEY = 'edatsu_feeds_last_seen';

const getLastSeenMap = () => {
    try {
        return JSON.parse(localStorage.getItem(LAST_SEEN_KEY) || '{}');
    } catch { return {}; }
};

const getLastSeen = (feedUrl) => {
    const map = getLastSeenMap();
    return map[feedUrl] ? new Date(map[feedUrl]) : null;
};

const markFeedSeen = (feedUrl) => {
    const map = getLastSeenMap();
    map[feedUrl] = new Date().toISOString();
    localStorage.setItem(LAST_SEEN_KEY, JSON.stringify(map));
};

const countNewArticles = (articles, feedUrl) => {
    if (!articles || articles.length === 0) return 0;
    const lastSeen = getLastSeen(feedUrl);
    if (!lastSeen) return 0; // first visit — nothing is "new"
    return articles.filter((a) => {
        if (!a.published_at) return false;
        const pubDate = new Date(a.published_at);
        return !isNaN(pubDate.getTime()) && pubDate > lastSeen;
    }).length;
};

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
const FeedCard = ({ feed, feedId, onRemove, isAuthenticated, savedArticleLinks, onToggleSaveArticle, onDiscussArticle }) => {
    const [expanded, setExpanded] = useState(false);
    const [seen, setSeen] = useState(false);
    const isLoading = feed.articles === null;
    const visibleArticles = feed.articles ? (expanded ? feed.articles : feed.articles.slice(0, 5)) : [];
    const hasMore = feed.articles && feed.articles.length > 5;
    const newCount = !seen && feed.articles ? countNewArticles(feed.articles, feed.feed_url) : 0;

    // Mark feed as seen after articles load, with a short delay so user sees the badge
    useEffect(() => {
        if (!feed.articles || feed.articles.length === 0) return;
        const timer = setTimeout(() => {
            markFeedSeen(feed.feed_url);
            setSeen(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [feed.articles, feed.feed_url]);

    return (
        <div
            id={feedId}
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
                    {newCount > 0 && (
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#fff',
                            background: '#f97316',
                            borderRadius: '9999px',
                            padding: '2px 8px',
                            lineHeight: 1.4,
                        }}>
                            {newCount} new
                        </span>
                    )}
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
                        const lastSeen = getLastSeen(feed.feed_url);
                        const isNew = !seen && lastSeen && article.published_at && (() => {
                            const d = new Date(article.published_at);
                            return !isNaN(d.getTime()) && d > lastSeen;
                        })();
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
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', lineHeight: 1.4, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {article.title}
                                        {isNew && (
                                            <span style={{
                                                width: '7px', height: '7px', borderRadius: '50%',
                                                background: '#f97316', flexShrink: 0,
                                            }} />
                                        )}
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
                                <button
                                    onClick={() => onDiscussArticle(article, feed)}
                                    title="Start a discussion"
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
                                            color: '#b0b0b5',
                                        }}
                                    >
                                        chat_bubble
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
const DefaultFeedToggle = ({ feed, isVisible, onToggle, onScrollTo }) => (
    <div
        className="d-flex align-items-center justify-content-between"
        style={{
            padding: '10px 0',
            borderBottom: '1px solid #f5f5f7',
        }}
    >
        <div
            className="d-flex align-items-center gap-2"
            style={{ flex: 1, minWidth: 0, cursor: isVisible ? 'pointer' : 'default' }}
            onClick={() => { if (isVisible && onScrollTo) onScrollTo(feed); }}
        >
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

/* ── Discuss Modal ── */
const DiscussModal = ({ open, onClose, article, feed, onCreated }) => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (!open) return;
        setTitle(article?.title || '');
        setBody('');
        setSelected([]);
        setLoading(true);
        axios.get('/api/forum/categories')
            .then((res) => setCategories(res.data.categories || []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, [open, article]);

    if (!open) return null;

    const toggleCategory = (id) => {
        setSelected((prev) => {
            if (prev.includes(id)) return prev.filter((c) => c !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    const submit = async (force = false) => {
        setSubmitting(true);
        try {
            const res = await axios.post('/api/forum/threads', {
                title: title.trim(),
                body: body.trim() || null,
                article_link: article?.link || null,
                article_title: article?.title || null,
                article_source: feed?.title || null,
                category_ids: selected,
                force,
            });
            onCreated?.(res.data);
            onClose();
        } catch (err) {
            if (err.response?.status === 409 && err.response.data?.duplicate) {
                const existing = err.response.data.thread;
                const result = await Swal.fire({
                    title: 'Discussion exists',
                    html: `<p style="font-size:13px;color:#86868b;margin:0 0 8px;">A discussion for this article already exists:</p>
                           <p style="font-size:14px;font-weight:500;color:#000;margin:0;">${existing.title}</p>
                           <p style="font-size:12px;color:#86868b;margin-top:6px;">${existing.posts_count} replies</p>`,
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonText: 'Join existing',
                    denyButtonText: 'Create new',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#000',
                    denyButtonColor: '#f97316',
                });
                setSubmitting(false);
                if (result.isConfirmed) {
                    onClose();
                    window.location.href = `/forum/${existing.id}`;
                } else if (result.isDenied) {
                    await submit(true);
                }
                return;
            }
            console.error('Failed to create discussion:', err);
            onCreated?.({ error: true });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (!title.trim() || selected.length === 0 || submitting) return;
        submit(false);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: '20px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px',
                    maxHeight: '90vh', overflowY: 'auto', padding: '28px',
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Start a discussion
                        </div>
                        <div style={{ width: '24px', height: '2px', background: '#f97316', marginBottom: '12px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>Create a conversation</h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#86868b' }}>close</span>
                    </button>
                </div>

                {article && (
                    <div style={{ background: '#f5f5f7', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#86868b', marginBottom: '4px' }}>From {feed?.title}</div>
                        <div style={{ fontSize: '13px', color: '#000', fontWeight: 500, lineHeight: 1.4 }}>
                            {article.title}
                        </div>
                    </div>
                )}

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                    Discussion title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    style={{
                        width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5',
                        borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif",
                        marginBottom: '14px', outline: 'none',
                    }}
                />

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                    Your take (optional)
                </label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    maxLength={10000}
                    placeholder="What do you want to discuss about this article?"
                    style={{
                        width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5',
                        borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif",
                        marginBottom: '16px', outline: 'none', resize: 'vertical',
                    }}
                />

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                    Categories <span style={{ color: '#86868b', fontWeight: 400 }}>(pick up to 3)</span>
                </label>
                {loading ? (
                    <div style={{ fontSize: '13px', color: '#86868b', padding: '12px 0' }}>Loading…</div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {categories.map((cat) => {
                            const isSel = selected.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    style={{
                                        padding: '6px 14px', borderRadius: '9999px',
                                        border: isSel ? 'none' : '1px solid #e5e5e5',
                                        background: isSel ? '#000' : '#fff',
                                        color: isSel ? '#fff' : '#86868b',
                                        fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px', borderRadius: '9999px', border: '1px solid #e5e5e5',
                            background: '#fff', color: '#000', fontSize: '13px', fontWeight: 500,
                            cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || selected.length === 0 || submitting}
                        style={{
                            padding: '10px 20px', borderRadius: '9999px', border: 'none',
                            background: (!title.trim() || selected.length === 0 || submitting) ? '#b0b0b5' : '#000',
                            color: '#fff', fontSize: '13px', fontWeight: 500,
                            cursor: (!title.trim() || selected.length === 0 || submitting) ? 'not-allowed' : 'pointer',
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        {submitting ? 'Creating…' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
    const [inputFocused, setInputFocused] = useState(false);
    const [savedArticleLinks, setSavedArticleLinks] = useState(initialSavedLinks);
    const [discussModal, setDiscussModal] = useState({ open: false, article: null, feed: null });
    const [activeTab, setActiveTab] = useState(feeds.length > 0 ? 'your' : 'trending');

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

    const getFeedId = (feedUrl) => 'feed-' + feedUrl.replace(/[^a-zA-Z0-9]/g, '-');

    const toggleDefaultFeedVisibility = (feed) => {
        const wasHidden = hiddenFeedUrls.has(feed.feed_url);
        setHiddenFeedUrls((prev) => {
            const next = new Set(prev);
            if (next.has(feed.feed_url)) {
                next.delete(feed.feed_url);
            } else {
                next.add(feed.feed_url);
            }
            return next;
        });
        // Scroll to the feed card when making it visible
        if (wasHidden) {
            setTimeout(() => {
                const el = document.getElementById(getFeedId(feed.feed_url));
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    // Get current region's feeds
    const currentRegionFeeds = defaultFeeds[activeRegion] || [];
    const visibleRegionFeeds = currentRegionFeeds.filter((f) => !hiddenFeedUrls.has(f.feed_url));

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

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
                Toast.fire({ icon: 'success', title: 'Article removed' });
            } catch (err) {
                console.error('Failed to unsave article:', err);
                setSavedArticleLinks((prev) => [...prev, article.link]);
                Toast.fire({ icon: 'error', title: 'Failed to remove article' });
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
                Toast.fire({ icon: 'success', title: 'Article saved for later' });
            } catch (err) {
                console.error('Failed to save article:', err);
                setSavedArticleLinks((prev) => prev.filter((l) => l !== article.link));
                Toast.fire({ icon: 'error', title: 'Failed to save article' });
            }
        }
    };

    const handleDiscussArticle = (article, feed) => {
        if (!isAuthenticated) {
            Swal.fire({
                title: '',
                html: `
                    <div style="text-align: center; padding: 20px;">
                        <span class="material-symbols-outlined" style="font-size: 48px; color: #f97316; margin-bottom: 16px; display: block;">chat_bubble</span>
                        <h3 style="font-weight: 600; margin-bottom: 8px; color: #000; font-size: 1.15rem; font-family: 'Poppins', sans-serif;">Join the conversation</h3>
                        <p style="color: #86868b; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                            Create a free account to start discussions and connect with others.
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <a href="/login" style="padding: 10px 24px; border-radius: 9999px; border: 1px solid #e5e5e5; background: #fff; color: #000; font-size: 13px; font-weight: 500; text-decoration: none; font-family: 'Poppins', sans-serif;">Login</a>
                            <a href="/sign-up" style="padding: 10px 24px; border-radius: 9999px; border: none; background: #000; color: #fff; font-size: 13px; font-weight: 500; text-decoration: none; font-family: 'Poppins', sans-serif;">Sign Up Free</a>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                width: '420px',
                padding: '0',
                background: 'white',
            });
            return;
        }
        setDiscussModal({ open: true, article, feed });
    };

    const handleDiscussionCreated = (result) => {
        if (result?.error) {
            Toast.fire({ icon: 'error', title: 'Failed to create discussion' });
            return;
        }
        Toast.fire({ icon: 'success', title: 'Discussion started' });
        if (result?.thread?.id) {
            setTimeout(() => { window.location.href = `/forum/${result.thread.id}`; }, 600);
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
            setActiveTab('your');

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
                    <Row className="g-4">
                        {/* Sidebar */}
                        <Col xs={12} md={4} lg={3} className="d-none d-md-block">
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
                                                    setInputFocused(true);
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e5e5e5';
                                                    setInputFocused(false);
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

                            {/* How it works banner — shown when input is focused or has text */}
                            {(inputFocused || inputUrl.trim()) && (
                                <div
                                    style={{
                                        borderRadius: '16px',
                                        border: '1px solid #f0f0f0',
                                        background: '#fff',
                                        padding: '16px 24px',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <div className="d-flex flex-wrap gap-3 align-items-center" style={{ fontSize: '12px' }}>
                                        {[
                                            { icon: 'language', text: 'Paste any website URL' },
                                            { icon: 'rss_feed', text: 'We find the RSS feed' },
                                            { icon: 'bolt', text: 'Articles load instantly' },
                                        ].map((step, i) => (
                                            <div key={i} className="d-flex align-items-center gap-1">
                                                <span
                                                    className="material-symbols-outlined"
                                                    style={{ fontSize: '14px', color: '#f97316' }}
                                                >
                                                    {step.icon}
                                                </span>
                                                <span style={{ fontWeight: 500, color: '#6e6e73' }}>{step.text}</span>
                                                {i < 2 && (
                                                    <span
                                                        className="material-symbols-outlined d-none d-sm-inline"
                                                        style={{ fontSize: '14px', color: '#d1d1d6', marginLeft: '8px' }}
                                                    >
                                                        arrow_forward
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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

                            {/* Feed Tabs */}
                            {(feeds.length > 0 || availableRegions.length > 0) && (
                                <div style={{
                                    display: 'inline-flex',
                                    background: '#e8e8ed',
                                    borderRadius: '9999px',
                                    padding: '4px',
                                    marginBottom: '16px',
                                }}>
                                    {[
                                        { key: 'your', label: 'Your Feeds', count: feeds.length },
                                        { key: 'trending', label: 'Trending' },
                                    ].map((tab) => {
                                        const isActive = activeTab === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '9px 22px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                                                    background: isActive ? '#000' : 'transparent',
                                                    color: isActive ? '#fff' : '#6e6e73',
                                                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                                                }}
                                            >
                                                {tab.label}
                                                {tab.count !== undefined && tab.count > 0 && (
                                                    <span style={{
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                                                        color: isActive ? '#fff' : '#6e6e73',
                                                        borderRadius: '9999px',
                                                        padding: '0 7px',
                                                        lineHeight: '18px',
                                                        minWidth: '18px',
                                                        textAlign: 'center',
                                                        transition: 'all 0.25s ease',
                                                    }}>
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Your Feeds Tab */}
                            {activeTab === 'your' && (
                                <>
                                    {feeds.length > 0 ? (
                                        <>
                                            {feeds.map((feed, index) => (
                                                <FeedCard
                                                    key={feed.id || feed.feed_url || index}
                                                    feedId={getFeedId(feed.feed_url)}
                                                    feed={feed}
                                                    onRemove={handleRemoveFeed}
                                                    isAuthenticated={isAuthenticated}
                                                    savedArticleLinks={savedArticleLinks}
                                                    onToggleSaveArticle={handleToggleSaveArticle}
                                                    onDiscussArticle={handleDiscussArticle}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: '16px',
                                                border: '1px solid #f0f0f0',
                                                padding: '48px 24px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#d1d1d6', marginBottom: '12px', display: 'block' }}>
                                                rss_feed
                                            </span>
                                            <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                                No feeds yet — paste a URL above to add your first feed
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Trending Sources Tab */}
                            {activeTab === 'trending' && availableRegions.length > 0 && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
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
                                                    onScrollTo={(f) => {
                                                        const el = document.getElementById(getFeedId(f.feed_url));
                                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Visible Feed Cards */}
                                    {visibleRegionFeeds.map((feed, index) => (
                                        <FeedCard
                                            key={`default-${activeRegion}-${feed.feed_url || index}`}
                                            feedId={getFeedId(feed.feed_url)}
                                            feed={feed}
                                            isAuthenticated={isAuthenticated}
                                            savedArticleLinks={savedArticleLinks}
                                            onToggleSaveArticle={handleToggleSaveArticle}
                                            onDiscussArticle={handleDiscussArticle}
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

            <DiscussModal
                open={discussModal.open}
                onClose={() => setDiscussModal({ open: false, article: null, feed: null })}
                article={discussModal.article}
                feed={discussModal.feed}
                onCreated={handleDiscussionCreated}
            />
        </GuestLayout>
    );
};

export default News;
