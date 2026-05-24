import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import ReactionBar from '@/Components/ReactionBar';
import { AuthContext } from '@/Layouts/GuestLayout';
import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import AdBanner from '@/Components/AdBanner';
import ArticleReaderModal from '@/Components/ArticleReaderModal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { isQuotaError } from '@/utils/proUpgrade';
import { estimateReadMinutes, formatReadMinutes } from '@/utils/readTime';
import FixedMobileNav from '@/Components/FixedMobileNav';
import ScrollToTop from '@/Components/ScrollToTop';

/* ── Small read-time badge ── */
const ReadTimeBadge = ({ article }) => {
    const minutes = estimateReadMinutes(article?.description || article?.content);
    if (!minutes) return null;
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            color: '#b0b0b5',
            whiteSpace: 'nowrap',
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>schedule</span>
            {formatReadMinutes(minutes)}
        </span>
    );
};

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
const FeedCard = ({ feed, feedId, onRemove, onHide, isAuthenticated, savedArticleLinks, onToggleSaveArticle, onDiscussArticle, onReadArticle, reactionsByLink, onReact, searchQuery = '', markAllVersion = 0, focusedArticleLink = null }) => {
    const [expanded, setExpanded] = useState(false);
    const [seen, setSeen] = useState(false);
    const isLoading = feed.articles === null;
    const q = searchQuery.trim().toLowerCase();
    const filteredArticles = feed.articles
        ? (q
            ? feed.articles.filter((a) => `${a.title || ''} ${a.description || ''}`.toLowerCase().includes(q))
            : feed.articles)
        : [];
    const visibleArticles = expanded ? filteredArticles : filteredArticles.slice(0, 5);
    const hasMore = filteredArticles.length > 5;
    const newCount = !seen && feed.articles ? countNewArticles(feed.articles, feed.feed_url) : 0;

    // When searching with zero matches in this feed, hide the card entirely
    if (q && !isLoading && filteredArticles.length === 0) return null;

    // Mark feed as seen after articles load, with a short delay so user sees the badge
    useEffect(() => {
        if (!feed.articles || feed.articles.length === 0) return;
        const timer = setTimeout(() => {
            markFeedSeen(feed.feed_url);
            setSeen(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [feed.articles, feed.feed_url]);

    // Force-mark seen when the page-level "Mark all read" is clicked
    useEffect(() => {
        if (markAllVersion === 0) return;
        markFeedSeen(feed.feed_url);
        setSeen(true);
    }, [markAllVersion, feed.feed_url]);

    const markThisFeedRead = () => {
        markFeedSeen(feed.feed_url);
        setSeen(true);
    };

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
                overflow: 'hidden',
                minWidth: 0,
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3" style={{ gap: '12px' }}>
                <div className="d-flex align-items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
                    <img
                        src={feed.favicon}
                        alt=""
                        width={20}
                        height={20}
                        style={{ borderRadius: '4px', flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000',
                        minWidth: 0,
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                    }}>
                        {feed.title}
                    </span>
                    {newCount > 0 && (
                        <button
                            onClick={markThisFeedRead}
                            title="Mark these as read"
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#fff',
                                background: '#f97316',
                                borderRadius: '9999px',
                                padding: '2px 10px',
                                lineHeight: 1.4,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: "'Poppins', sans-serif",
                                transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#ea6c0e'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f97316'}
                        >
                            {newCount} new
                        </button>
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
                        const isFocused = focusedArticleLink === article.link;
                        return (
                            <div
                                key={i}
                                data-article-link={article.link}
                                style={{
                                    padding: '12px',
                                    margin: '0 -12px',
                                    borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-start',
                                    background: isFocused ? '#fff7ed' : 'transparent',
                                    borderLeft: isFocused ? '3px solid #f97316' : '3px solid transparent',
                                    borderRadius: '8px',
                                    transition: 'background 0.12s ease, border-color 0.12s ease',
                                }}
                            >
                                <div
                                    onClick={() => onReadArticle?.(article, feed)}
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    <div style={{
                                        fontSize: '14px', fontWeight: 500, color: '#000',
                                        lineHeight: 1.4, marginBottom: '4px',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        overflowWrap: 'anywhere', wordBreak: 'break-word',
                                    }}>
                                        <span style={{ minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                            {article.title}
                                        </span>
                                        {isNew && (
                                            <span style={{
                                                width: '7px', height: '7px', borderRadius: '50%',
                                                background: '#f97316', flexShrink: 0,
                                            }} />
                                        )}
                                    </div>
                                    {article.description && (
                                        <div style={{
                                            fontSize: '13px', color: '#86868b',
                                            lineHeight: 1.5, marginBottom: '4px',
                                            overflowWrap: 'anywhere', wordBreak: 'break-word',
                                        }}>
                                            {article.description}
                                        </div>
                                    )}
                                    {(article.published_at || estimateReadMinutes(article.description || article.content)) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            {article.published_at && (
                                                <span style={{ fontSize: '12px', color: '#b0b0b5' }}>
                                                    {article.published_at}
                                                </span>
                                            )}
                                            {article.published_at && estimateReadMinutes(article.description || article.content) && (
                                                <span style={{ fontSize: '12px', color: '#d1d1d6' }}>·</span>
                                            )}
                                            <ReadTimeBadge article={article} />
                                        </div>
                                    )}
                                    <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                                        <ReactionBar
                                            article={article}
                                            feed={feed}
                                            reactions={reactionsByLink?.[article.link]}
                                            isAuthenticated={isAuthenticated}
                                            onChange={onReact}
                                        />
                                    </div>
                                </div>
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
                                : `Show ${filteredArticles.length - 5} more articles`}
                        </button>
                    )}
                </div>
            ) : !isLoading ? (
                <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                    No articles found
                </p>
            ) : null}

            {/* Hide feed shortcut */}
            {!isLoading && onHide && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f5f5f7',
                }}>
                    <button
                        onClick={() => onHide(feed)}
                        title="Hide this feed"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '9999px',
                            border: '1px solid #e5e5e5',
                            background: '#fff',
                            color: '#86868b',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f5f7';
                            e.currentTarget.style.color = '#000';
                            e.currentTarget.style.borderColor = '#d1d1d6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '#86868b';
                            e.currentTarget.style.borderColor = '#e5e5e5';
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                            visibility_off
                        </span>
                        Hide feed
                    </button>
                </div>
            )}
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
    const [readerArticle, setReaderArticle] = useState(null);
    const [readerFeed, setReaderFeed] = useState(null);
    const [activeTab, setActiveTab] = useState('trending');
    const [hotArticles, setHotArticles] = useState([]);
    const [hotLoading, setHotLoading] = useState(false);
    const [hotWindow, setHotWindow] = useState('7d');
    const [hotSort, setHotSort] = useState('hot'); // 'hot' | 'recent' | 'reads' | 'saves'
    const [hotSourceFilter, setHotSourceFilter] = useState(() => new Set());
    const [hotSourceMenuOpen, setHotSourceMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [markAllVersion, setMarkAllVersion] = useState(0);
    const [focusedArticleLink, setFocusedArticleLink] = useState(null);
    const [showKbdHelp, setShowKbdHelp] = useState(false);
    const [readingStreak, setReadingStreak] = useState(null);
    const searchInputRef = useRef(null);

    // Fetch the user's reading streak on mount. Hidden for guests + cold accounts.
    useEffect(() => {
        if (!isAuthenticated) return;
        axios.get('/api/reading-streak')
            .then((res) => setReadingStreak(res.data))
            .catch(() => {});
    }, [isAuthenticated]);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = useCallback((article, extra = '') => {
        if (!normalizedQuery) return true;
        const haystack = `${article?.title || ''} ${article?.description || ''} ${extra}`.toLowerCase();
        return haystack.includes(normalizedQuery);
    }, [normalizedQuery]);

    // Reactions: { [articleLink]: { counts: {like, insightful, fire}, mine: [] } }
    const [reactionsByLink, setReactionsByLink] = useState({});
    const reactionsFetchedRef = useRef(new Set()); // links we've already requested

    const updateReactionForLink = useCallback((link, data) => {
        setReactionsByLink((prev) => ({ ...prev, [link]: data }));
    }, []);

    // Default feeds state — mutable so we can populate articles
    const [defaultFeeds, setDefaultFeeds] = useState(defaultFeedsByRegion);

    // Mark-all-read across user + default feeds. Declared AFTER defaultFeeds
    // so the dep array doesn't hit the TDZ on initial render (the const
    // declarations are evaluated top-to-bottom and React reads the dep
    // array at definition time).
    const handleMarkAllRead = useCallback(() => {
        const all = [...feeds, ...Object.values(defaultFeeds).flat()];
        all.forEach((f) => { if (f?.feed_url) markFeedSeen(f.feed_url); });
        setMarkAllVersion((v) => v + 1);
    }, [feeds, defaultFeeds]);

    // Region selection — default to first available region
    const availableRegions = regions.filter((r) => defaultFeeds[r]?.length > 0 || defaultFeedsByRegion[r]?.length > 0);
    const [activeRegion, setActiveRegion] = useState(availableRegions[0] || '');

    // Track which default feeds are visible (by feed_url) — all visible by default
    const [hiddenFeedUrls, setHiddenFeedUrls] = useState(new Set());

    // Track which user feeds are visible (by feed_url) — all visible by default
    const [hiddenUserFeedUrls, setHiddenUserFeedUrls] = useState(new Set());

    // Lazy-load articles for a single feed
    const fetchFeedArticles = useCallback(async (feedUrl) => {
        try {
            const res = await axios.post('/api/news-feeds/fetch-articles', { url: feedUrl });
            return res.data;
        } catch {
            return null;
        }
    }, []);

    // Fire-and-forget engagement tracking
    const trackArticleEngagement = useCallback((article, feed, eventType) => {
        if (!article?.link) return;
        axios.post('/api/news-feeds/track-engagement', {
            article_link: article.link,
            article_title: article.title || '(untitled)',
            article_description: article.description || '',
            article_date: article.published_at || '',
            feed_title: feed?.title || '',
            feed_favicon: feed?.favicon || '',
            feed_url: feed?.feed_url || '',
            event_type: eventType,
        }).then(() => {
            // First read of today should bump the streak immediately. Skip the
            // refetch once we already know today is active to avoid noise.
            if (eventType === 'read' && isAuthenticated && readingStreak && !readingStreak.today_active) {
                axios.get('/api/reading-streak')
                    .then((res) => setReadingStreak(res.data))
                    .catch(() => {});
            }
        }).catch(() => {});
    }, [isAuthenticated, readingStreak]);

    // Bulk-fetch reaction counts for any article links we haven't seen yet.
    // Runs whenever any of the three article sources change. We only request
    // links that aren't already in reactionsFetchedRef so we don't loop.
    useEffect(() => {
        const links = new Set();
        feeds.forEach((f) => (f.articles || []).forEach((a) => a.link && links.add(a.link)));
        Object.values(defaultFeeds).forEach((regionFeeds) =>
            (regionFeeds || []).forEach((f) =>
                (f.articles || []).forEach((a) => a.link && links.add(a.link))
            )
        );
        hotArticles.forEach((a) => a.link && links.add(a.link));

        const toFetch = [...links].filter((l) => !reactionsFetchedRef.current.has(l));
        if (toFetch.length === 0) return;

        toFetch.forEach((l) => reactionsFetchedRef.current.add(l));

        const batch = toFetch.slice(0, 300);
        axios.post('/api/news-feeds/reactions/bulk', { article_links: batch })
            .then((res) => {
                const map = res.data?.reactions || {};
                setReactionsByLink((prev) => ({ ...prev, ...map }));
            })
            .catch(() => {
                // Failed — let those links be retried on the next tick
                batch.forEach((l) => reactionsFetchedRef.current.delete(l));
            });
    }, [feeds, defaultFeeds, hotArticles]);

    // Fetch hot articles when Hot tab activates or window changes
    useEffect(() => {
        if (activeTab !== 'hot') return;
        setHotLoading(true);
        axios.get('/api/news-feeds/hot', { params: { window: hotWindow } })
            .then((res) => setHotArticles(res.data.articles || []))
            .catch(() => setHotArticles([]))
            .finally(() => setHotLoading(false));
    }, [activeTab, hotWindow]);

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

    // Fetch articles for the active region's default feeds.
    // Feeds that fail to fetch or return zero articles are dropped from the region
    // so we don't show empty/broken cards.
    useEffect(() => {
        if (!activeRegion) return;
        const regionFeeds = defaultFeeds[activeRegion] || [];
        regionFeeds.forEach((feed) => {
            if (feed.articles !== null) return; // already loaded
            fetchFeedArticles(feed.feed_url).then((data) => {
                const hasArticles = data && Array.isArray(data.articles) && data.articles.length > 0;
                if (!hasArticles) {
                    setDefaultFeeds((prev) => {
                        const updated = { ...prev };
                        updated[activeRegion] = (updated[activeRegion] || []).filter(
                            (f) => f.feed_url !== feed.feed_url
                        );
                        return updated;
                    });
                    return;
                }
                setDefaultFeeds((prev) => {
                    const updated = { ...prev };
                    updated[activeRegion] = (updated[activeRegion] || []).map((f) =>
                        f.feed_url === feed.feed_url ? {
                            ...f,
                            title: data.title || f.title,
                            favicon: data.favicon || f.favicon,
                            articles: data.articles,
                        } : f
                    );
                    return updated;
                });
            });
        });
    }, [activeRegion]); // eslint-disable-line react-hooks/exhaustive-deps

    // If the active region drains to zero feeds (all failed/empty), jump to the next available one
    useEffect(() => {
        if (!activeRegion) return;
        const current = defaultFeeds[activeRegion] || [];
        if (current.length > 0) return;
        const next = regions.find((r) => r !== activeRegion && (defaultFeeds[r] || []).length > 0);
        if (next) setActiveRegion(next);
        else setActiveRegion('');
    }, [defaultFeeds, activeRegion, regions]);

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

    const toggleUserFeedVisibility = (feed) => {
        const wasHidden = hiddenUserFeedUrls.has(feed.feed_url);
        setHiddenUserFeedUrls((prev) => {
            const next = new Set(prev);
            if (next.has(feed.feed_url)) {
                next.delete(feed.feed_url);
            } else {
                next.add(feed.feed_url);
            }
            return next;
        });
        if (wasHidden) {
            setTimeout(() => {
                const el = document.getElementById(getFeedId(feed.feed_url));
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const visibleUserFeeds = feeds.filter((f) => !hiddenUserFeedUrls.has(f.feed_url));

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
                setSavedArticleLinks((prev) => prev.filter((l) => l !== article.link));
                if (isQuotaError(err)) return;
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
                    // Quota hit — upgrade modal already shown; bail without adding to UI
                    if (isQuotaError(saveErr)) {
                        setIsLoading(false);
                        return;
                    }
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
            if (isQuotaError(err)) {
                // Upgrade modal already shown; clear any inline error
                setError('');
            } else if (err.response?.status === 404) {
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
        const result = await Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #f97316; margin-bottom: 16px; display: block; font-variation-settings: 'FILL' 1;">delete</span>
                    <h3 style="font-weight: 600; margin-bottom: 8px; color: #000; font-size: 1.15rem; font-family: 'Poppins', sans-serif;">Remove feed?</h3>
                    <p style="color: #86868b; font-size: 14px; line-height: 1.5; margin-bottom: 6px;">
                        This feed will be removed from your list:
                    </p>
                    <p style="color: #000; font-size: 14px; font-weight: 500; margin-bottom: 24px; font-family: 'Poppins', sans-serif;">
                        ${feed.title || feed.feed_url}
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="swal-cancel-btn" style="padding: 10px 24px; border-radius: 9999px; border: 1px solid #e5e5e5; background: #fff; color: #000; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;">
                            Cancel
                        </button>
                        <button id="swal-confirm-btn" style="padding: 10px 24px; border-radius: 9999px; border: none; background: #000; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;">
                            Remove
                        </button>
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
            didOpen: () => {
                document.getElementById('swal-confirm-btn').addEventListener('click', () => Swal.close({ isConfirmed: true }));
                document.getElementById('swal-cancel-btn').addEventListener('click', () => Swal.close({ isConfirmed: false }));
            },
        });
        if (!result.isConfirmed) return;

        // If saved to account, delete from backend
        if (feed.id && isAuthenticated) {
            try {
                await axios.delete(`/api/news-feeds/${feed.id}`);
            } catch (err) {
                console.error('Failed to remove feed:', err);
            }
        }
        setFeeds((prev) => prev.filter((f) => f !== feed));
        Toast.fire({ icon: 'success', title: 'Feed removed' });
    };

    // Single ref bag — keeps state + handlers accessible inside the keydown
    // listener without rebinding it on every render. The listener mounts once.
    const kbdRef = useRef({});
    kbdRef.current = {
        focusedArticleLink, feeds, defaultFeeds, hotArticles,
        readerArticle, discussModal, showKbdHelp,
        handleToggleSaveArticle, trackArticleEngagement,
    };

    useEffect(() => {
        const isTypingTarget = (el) => {
            if (!el) return false;
            const tag = el.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
        };

        const lookup = (link) => {
            if (!link) return null;
            const s = kbdRef.current;
            for (const f of s.feeds) {
                const a = f.articles?.find((a) => a.link === link);
                if (a) return { article: a, feed: f };
            }
            for (const regionFeeds of Object.values(s.defaultFeeds)) {
                for (const f of regionFeeds || []) {
                    const a = f.articles?.find((a) => a.link === link);
                    if (a) return { article: a, feed: f };
                }
            }
            const hot = s.hotArticles.find((a) => a.link === link);
            if (hot) {
                return {
                    article: hot,
                    feed: { title: hot.feed_title, favicon: hot.feed_favicon, feed_url: hot.feed_url },
                };
            }
            return null;
        };

        const handler = (e) => {
            const s = kbdRef.current;

            // '/' focuses search even when nothing else is typing
            if (e.key === '/' && !isTypingTarget(e.target)) {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            if (e.key === 'Escape') {
                if (s.showKbdHelp) { setShowKbdHelp(false); return; }
                if (s.focusedArticleLink) { setFocusedArticleLink(null); return; }
                return;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (isTypingTarget(e.target)) return;
            if (s.readerArticle || s.discussModal?.open) return;

            if (e.key === '?') {
                e.preventDefault();
                setShowKbdHelp((v) => !v);
                return;
            }

            if (e.key === 'j' || e.key === 'k') {
                e.preventDefault();
                const els = Array.from(document.querySelectorAll('[data-article-link]'));
                if (els.length === 0) return;
                const links = els.map((el) => el.dataset.articleLink);
                let idx = links.indexOf(s.focusedArticleLink);
                if (idx === -1) {
                    idx = e.key === 'j' ? 0 : links.length - 1;
                } else {
                    idx += e.key === 'j' ? 1 : -1;
                    idx = Math.max(0, Math.min(links.length - 1, idx));
                }
                const nextLink = links[idx];
                setFocusedArticleLink(nextLink);
                els[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            if (e.key === 's') {
                e.preventDefault();
                const found = lookup(s.focusedArticleLink);
                if (found) s.handleToggleSaveArticle(found.article, found.feed);
                return;
            }

            if (e.key === 'o' || e.key === 'Enter') {
                e.preventDefault();
                const found = lookup(s.focusedArticleLink);
                if (found) {
                    setReaderArticle(found.article);
                    setReaderFeed(found.feed);
                    s.trackArticleEngagement(found.article, found.feed, 'read');
                }
                return;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
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

                    {isAuthenticated && readingStreak && readingStreak.current > 0 && (
                        <div
                            title={readingStreak.today_active
                                ? `${readingStreak.current}-day reading streak — already active today`
                                : `Read an article today to keep your ${readingStreak.current}-day streak alive`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                borderRadius: '9999px',
                                background: readingStreak.today_active ? 'rgba(249,115,22,0.10)' : '#f5f5f7',
                                border: readingStreak.today_active ? '1px solid rgba(249,115,22,0.30)' : '1px solid #e5e5e5',
                                color: readingStreak.today_active ? '#f97316' : '#6e6e73',
                                fontFamily: "'Poppins', sans-serif",
                                marginTop: '4px',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '20px',
                                    color: readingStreak.today_active ? '#f97316' : '#b0b0b5',
                                    fontVariationSettings: readingStreak.today_active ? "'FILL' 1" : "'FILL' 0",
                                }}
                            >
                                local_fire_department
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: readingStreak.today_active ? '#f97316' : '#000' }}>
                                    {readingStreak.current}
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 500, color: '#86868b' }}>
                                    day{readingStreak.current === 1 ? '' : 's'}
                                </span>
                            </div>
                        </div>
                    )}
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

                            {/* Search bar */}
                            <div style={{
                                position: 'relative',
                                marginBottom: '16px',
                            }}>
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
                                    search
                                </span>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setSearchQuery('');
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    placeholder="Search your feeds... (press / to focus)"
                                    style={{
                                        width: '100%',
                                        padding: '10px 38px 10px 42px',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e5e5',
                                        fontSize: '14px',
                                        color: '#000',
                                        outline: 'none',
                                        background: '#fff',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#000'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        title="Clear search"
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: '#f5f5f7',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>close</span>
                                    </button>
                                )}
                            </div>

                            {/* Feed Tabs + global mark-all-read */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                flexWrap: 'wrap',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    display: 'inline-flex',
                                    background: '#e8e8ed',
                                    borderRadius: '9999px',
                                    padding: '4px',
                                }}>
                                    {[
                                        { key: 'your', label: 'Your Feeds', count: feeds.length },
                                        { key: 'hot', label: 'Hot' },
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

                                <button
                                    onClick={handleMarkAllRead}
                                    title="Mark every loaded feed as read"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '9999px',
                                        border: '1px solid #e5e5e5',
                                        background: '#fff',
                                        color: '#6e6e73',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#000';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e5e5';
                                        e.currentTarget.style.color = '#6e6e73';
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>done_all</span>
                                    Mark all read
                                </button>
                            </div>

                            {/* Your Feeds Tab */}
                            {activeTab === 'your' && (
                                <>
                                    {feeds.length > 0 ? (
                                        <>
                                            {/* Feed Selector — toggle which feeds to show */}
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
                                                        {visibleUserFeeds.length}/{feeds.length} visible
                                                    </span>
                                                </div>
                                                {feeds.map((feed, i) => (
                                                    <DefaultFeedToggle
                                                        key={feed.feed_url || i}
                                                        feed={feed}
                                                        isVisible={!hiddenUserFeedUrls.has(feed.feed_url)}
                                                        onToggle={toggleUserFeedVisibility}
                                                        onScrollTo={(f) => {
                                                            const el = document.getElementById(getFeedId(f.feed_url));
                                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            {/* Visible Feed Cards */}
                                            {visibleUserFeeds.map((feed, index) => (
                                                <FeedCard
                                                    key={feed.id || feed.feed_url || index}
                                                    feedId={getFeedId(feed.feed_url)}
                                                    feed={feed}
                                                    onRemove={handleRemoveFeed}
                                                    onHide={toggleUserFeedVisibility}
                                                    isAuthenticated={isAuthenticated}
                                                    savedArticleLinks={savedArticleLinks}
                                                    onToggleSaveArticle={handleToggleSaveArticle}
                                                    onDiscussArticle={handleDiscussArticle}
                                                    onReadArticle={(article, feed) => { setReaderArticle(article); setReaderFeed(feed); trackArticleEngagement(article, feed, 'read'); }}
                                                    reactionsByLink={reactionsByLink}
                                                    onReact={updateReactionForLink}
                                                    searchQuery={searchQuery}
                                                    markAllVersion={markAllVersion}
                                                    focusedArticleLink={focusedArticleLink}
                                                />
                                            ))}

                                            {visibleUserFeeds.length === 0 && feeds.length > 0 && (
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

                            {/* Hot Tab */}
                            {activeTab === 'hot' && (() => {
                                const sortOptions = [
                                    { key: 'hot', label: 'Hot' },
                                    { key: 'recent', label: 'Recent' },
                                    { key: 'reads', label: 'Most read' },
                                    { key: 'saves', label: 'Most saved' },
                                ];
                                const sourceList = Array.from(new Map(
                                    hotArticles
                                        .filter((a) => a.feed_title)
                                        .map((a) => [a.feed_title, { title: a.feed_title, favicon: a.feed_favicon }])
                                ).values());
                                const activeSources = hotSourceFilter;

                                const toggleSource = (title) => {
                                    setHotSourceFilter((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(title)) next.delete(title);
                                        else next.add(title);
                                        return next;
                                    });
                                };

                                return (
                                <>
                                    {/* Window selector */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {[
                                            { key: '24h', label: 'Today' },
                                            { key: '7d', label: 'This week' },
                                            { key: '30d', label: 'This month' },
                                        ].map((w) => {
                                            const active = hotWindow === w.key;
                                            return (
                                                <button
                                                    key={w.key}
                                                    onClick={() => { setHotWindow(w.key); setHotSourceFilter(new Set()); }}
                                                    style={{
                                                        padding: '6px 14px',
                                                        borderRadius: '9999px',
                                                        border: active ? '1px solid #000' : '1px solid #e5e5e7',
                                                        background: active ? '#000' : '#fff',
                                                        color: active ? '#fff' : '#6e6e73',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {w.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Sort + Source filter */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#86868b', marginRight: '4px' }}>Sort</span>
                                        {sortOptions.map((s) => {
                                            const active = hotSort === s.key;
                                            return (
                                                <button
                                                    key={s.key}
                                                    onClick={() => setHotSort(s.key)}
                                                    style={{
                                                        padding: '5px 12px',
                                                        borderRadius: '9999px',
                                                        border: active ? '1px solid #f97316' : '1px solid #e5e5e7',
                                                        background: active ? 'rgba(249,115,22,0.1)' : '#fff',
                                                        color: active ? '#f97316' : '#6e6e73',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {s.label}
                                                </button>
                                            );
                                        })}

                                        {sourceList.length > 0 && (
                                            <div style={{ position: 'relative', marginLeft: 'auto' }}>
                                                <button
                                                    onClick={() => setHotSourceMenuOpen((v) => !v)}
                                                    style={{
                                                        padding: '5px 12px',
                                                        borderRadius: '9999px',
                                                        border: activeSources.size > 0 ? '1px solid #000' : '1px solid #e5e5e7',
                                                        background: activeSources.size > 0 ? '#000' : '#fff',
                                                        color: activeSources.size > 0 ? '#fff' : '#6e6e73',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>filter_list</span>
                                                    {activeSources.size > 0 ? `${activeSources.size} source${activeSources.size === 1 ? '' : 's'}` : 'All sources'}
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px', transform: hotSourceMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>expand_more</span>
                                                </button>

                                                {hotSourceMenuOpen && (
                                                    <>
                                                        <div
                                                            onClick={() => setHotSourceMenuOpen(false)}
                                                            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                                                        />
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: 'calc(100% + 6px)',
                                                                right: 0,
                                                                background: '#fff',
                                                                border: '1px solid #e5e5e5',
                                                                borderRadius: '12px',
                                                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                                                minWidth: '240px',
                                                                maxHeight: '320px',
                                                                overflowY: 'auto',
                                                                padding: '6px',
                                                                zIndex: 51,
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px 8px' }}>
                                                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                    Filter by source
                                                                </span>
                                                                {activeSources.size > 0 && (
                                                                    <button
                                                                        onClick={() => setHotSourceFilter(new Set())}
                                                                        style={{
                                                                            background: 'transparent', border: 'none', cursor: 'pointer',
                                                                            fontSize: '11px', fontWeight: 500, color: '#f97316',
                                                                            padding: 0, fontFamily: "'Poppins', sans-serif",
                                                                        }}
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {sourceList.map((src) => {
                                                                const checked = activeSources.has(src.title);
                                                                return (
                                                                    <button
                                                                        key={src.title}
                                                                        onClick={() => toggleSource(src.title)}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px',
                                                                            width: '100%',
                                                                            padding: '8px 10px',
                                                                            background: checked ? '#f5f5f7' : 'transparent',
                                                                            border: 'none',
                                                                            borderRadius: '8px',
                                                                            cursor: 'pointer',
                                                                            textAlign: 'left',
                                                                            fontFamily: "'Poppins', sans-serif",
                                                                        }}
                                                                        onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = '#fafafa'; }}
                                                                        onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = 'transparent'; }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                width: '16px', height: '16px', borderRadius: '4px',
                                                                                border: checked ? 'none' : '1px solid #d1d1d6',
                                                                                background: checked ? '#f97316' : '#fff',
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                flexShrink: 0,
                                                                            }}
                                                                        >
                                                                            {checked && (
                                                                                <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#fff' }}>check</span>
                                                                            )}
                                                                        </span>
                                                                        {src.favicon && (
                                                                            <img src={src.favicon} alt="" width={14} height={14} style={{ borderRadius: '3px', flexShrink: 0 }} onError={(e) => e.target.style.display = 'none'} />
                                                                        )}
                                                                        <span style={{ fontSize: '13px', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                            {src.title}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {hotLoading && hotArticles.length === 0 && <FeedCardSkeleton />}

                                    {!hotLoading && hotArticles.length === 0 && (
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '16px',
                                            border: '1px solid #f0f0f0',
                                            padding: '48px 24px',
                                            textAlign: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#d1d1d6', marginBottom: '12px', display: 'block' }}>
                                                local_fire_department
                                            </span>
                                            <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                                No hot articles yet — open a few articles to start surfacing what people are reading
                                            </p>
                                        </div>
                                    )}

                                    {hotArticles.length > 0 && (() => {
                                        let filteredHot = hotArticles.filter((a) => matchesSearch(a, a.feed_title || ''));
                                        if (activeSources.size > 0) {
                                            filteredHot = filteredHot.filter((a) => a.feed_title && activeSources.has(a.feed_title));
                                        }
                                        if (hotSort !== 'hot') {
                                            const arr = [...filteredHot];
                                            if (hotSort === 'recent') {
                                                arr.sort((a, b) => {
                                                    const da = Date.parse(a.published_at || a.article_date || '');
                                                    const db = Date.parse(b.published_at || b.article_date || '');
                                                    return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
                                                });
                                            } else if (hotSort === 'reads') {
                                                arr.sort((a, b) => (b.engagement?.reads || 0) - (a.engagement?.reads || 0));
                                            } else if (hotSort === 'saves') {
                                                arr.sort((a, b) => (b.engagement?.saves || 0) - (a.engagement?.saves || 0));
                                            }
                                            filteredHot = arr;
                                        }
                                        if (normalizedQuery && filteredHot.length === 0) {
                                            return (
                                                <div style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: '16px',
                                                    border: '1px solid #f0f0f0',
                                                    padding: '40px 24px',
                                                    textAlign: 'center',
                                                }}>
                                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                                        No matches for "{searchQuery}" in Hot articles.
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return (
                                        <div style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '16px',
                                            border: '1px solid #f0f0f0',
                                            padding: '8px 20px',
                                        }}>
                                            {filteredHot.map((article, i) => {
                                                const isSaved = savedArticleLinks.includes(article.link);
                                                const totalEngagement = (article.engagement?.reads || 0) + (article.engagement?.clicks || 0) + (article.engagement?.saves || 0);
                                                const feed = {
                                                    title: article.feed_title,
                                                    favicon: article.feed_favicon,
                                                    feed_url: article.feed_url,
                                                };
                                                const isFocused = focusedArticleLink === article.link;
                                                return (
                                                    <div
                                                        key={article.link || i}
                                                        data-article-link={article.link}
                                                        style={{
                                                            padding: '14px 12px',
                                                            margin: '0 -12px',
                                                            borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                                            display: 'flex',
                                                            gap: '12px',
                                                            alignItems: 'flex-start',
                                                            background: isFocused ? '#fff7ed' : 'transparent',
                                                            borderLeft: isFocused ? '3px solid #f97316' : '3px solid transparent',
                                                            borderRadius: '8px',
                                                            transition: 'background 0.12s ease, border-color 0.12s ease',
                                                        }}
                                                    >
                                                        <span style={{
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            color: '#b0b0b5',
                                                            minWidth: '20px',
                                                            paddingTop: '2px',
                                                        }}>
                                                            {i + 1}
                                                        </span>
                                                        <div
                                                            onClick={() => {
                                                                setReaderArticle(article);
                                                                setReaderFeed(feed);
                                                                trackArticleEngagement(article, feed, 'read');
                                                            }}
                                                            style={{
                                                                flex: 1,
                                                                minWidth: 0,
                                                                cursor: 'pointer',
                                                                transition: 'opacity 0.15s ease',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                                        >
                                                            <div style={{
                                                                fontSize: '14px', fontWeight: 500, color: '#000',
                                                                lineHeight: 1.4, marginBottom: '4px',
                                                                overflowWrap: 'anywhere', wordBreak: 'break-word',
                                                            }}>
                                                                {article.title}
                                                            </div>
                                                            {article.description && (
                                                                <div style={{
                                                                    fontSize: '13px', color: '#86868b',
                                                                    lineHeight: 1.5, marginBottom: '6px',
                                                                    overflowWrap: 'anywhere', wordBreak: 'break-word',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                }}>
                                                                    {article.description}
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#b0b0b5', flexWrap: 'wrap' }}>
                                                                {article.feed_favicon && (
                                                                    <img src={article.feed_favicon} alt="" style={{ width: '14px', height: '14px', borderRadius: '3px' }} />
                                                                )}
                                                                {article.feed_title && <span>{article.feed_title}</span>}
                                                                <ReadTimeBadge article={article} />
                                                                {totalEngagement > 0 && (
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#f97316' }}>local_fire_department</span>
                                                                        {totalEngagement}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                                                                <ReactionBar
                                                                    article={article}
                                                                    feed={feed}
                                                                    reactions={reactionsByLink[article.link]}
                                                                    isAuthenticated={isAuthenticated}
                                                                    onChange={updateReactionForLink}
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleSaveArticle(article, feed)}
                                                            title={isSaved ? 'Remove from saved' : 'Save for later'}
                                                            style={{
                                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                                padding: '4px', borderRadius: '8px',
                                                                display: 'flex', alignItems: 'center', flexShrink: 0,
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
                                                            onClick={() => handleDiscussArticle(article, feed)}
                                                            title="Start a discussion"
                                                            style={{
                                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                                padding: '4px', borderRadius: '8px',
                                                                display: 'flex', alignItems: 'center', flexShrink: 0,
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#b0b0b5' }}>chat_bubble</span>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        );
                                    })()}
                                </>
                                );
                            })()}

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
                                            onHide={toggleDefaultFeedVisibility}
                                            isAuthenticated={isAuthenticated}
                                            savedArticleLinks={savedArticleLinks}
                                            onToggleSaveArticle={handleToggleSaveArticle}
                                            onDiscussArticle={handleDiscussArticle}
                                            onReadArticle={(article, feed) => { setReaderArticle(article); setReaderFeed(feed); }}
                                            reactionsByLink={reactionsByLink}
                                            onReact={updateReactionForLink}
                                            searchQuery={searchQuery}
                                            markAllVersion={markAllVersion}
                                            focusedArticleLink={focusedArticleLink}
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

            <ScrollToTop />
            <FixedMobileNav isAuthenticated={isAuthenticated} />

            <ArticleReaderModal
                article={readerArticle}
                feed={readerFeed}
                onClose={() => { setReaderArticle(null); setReaderFeed(null); }}
                isSaved={readerArticle ? savedArticleLinks.includes(readerArticle.link) : false}
                onToggleSave={(article) => handleToggleSaveArticle(article, readerFeed)}
                isAuthenticated={isAuthenticated}
                onDiscuss={(article) => {
                    setReaderArticle(null);
                    setReaderFeed(null);
                    handleDiscussArticle(article, readerFeed);
                }}
                reactions={readerArticle ? reactionsByLink[readerArticle.link] : null}
                onReact={updateReactionForLink}
            />

            <DiscussModal
                open={discussModal.open}
                onClose={() => setDiscussModal({ open: false, article: null, feed: null })}
                article={discussModal.article}
                feed={discussModal.feed}
                onCreated={handleDiscussionCreated}
            />

            {/* Keyboard shortcuts hint */}
            <button
                onClick={() => setShowKbdHelp(true)}
                title="Keyboard shortcuts (?)"
                className="d-none d-md-flex"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                    color: '#6e6e73',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Poppins', sans-serif",
                    zIndex: 100,
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#6e6e73'; }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>keyboard</span>
                Shortcuts
            </button>

            {/* Keyboard shortcuts help overlay */}
            {showKbdHelp && (
                <div
                    onClick={() => setShowKbdHelp(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10000, padding: '20px',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px',
                            padding: '28px', fontFamily: "'Poppins', sans-serif",
                            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Keyboard
                                </span>
                                <div style={{ width: '24px', height: '2px', background: '#f97316', margin: '6px 0 12px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>Shortcuts</h3>
                            </div>
                            <button
                                onClick={() => setShowKbdHelp(false)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#86868b' }}>close</span>
                            </button>
                        </div>

                        {[
                            { keys: ['j'], label: 'Next article' },
                            { keys: ['k'], label: 'Previous article' },
                            { keys: ['o', 'Enter'], label: 'Open in reader' },
                            { keys: ['s'], label: 'Save / unsave article' },
                            { keys: ['/'], label: 'Focus search' },
                            { keys: ['Esc'], label: 'Clear search / unfocus' },
                            { keys: ['?'], label: 'Toggle this help' },
                        ].map((row, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 0',
                                    borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '13px', color: '#000' }}>{row.label}</span>
                                <span style={{ display: 'inline-flex', gap: '4px' }}>
                                    {row.keys.map((k, j) => (
                                        <kbd
                                            key={j}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '24px',
                                                height: '24px',
                                                padding: '0 6px',
                                                background: '#f5f5f7',
                                                border: '1px solid #e5e5e5',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: '#000',
                                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                            }}
                                        >
                                            {k}
                                        </kbd>
                                    ))}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GuestLayout>
    );
};

export default News;
