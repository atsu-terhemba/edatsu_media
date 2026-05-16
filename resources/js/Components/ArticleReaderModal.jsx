import React, { useState, useEffect, useRef } from 'react';

const ArticleReaderModal = ({ article, onClose, isSaved, onToggleSave, isAuthenticated, onDiscuss }) => {
    const [view, setView] = useState('reader'); // 'reader' | 'original'
    const [readerLoading, setReaderLoading] = useState(true);
    const [readerData, setReaderData] = useState(null);
    const [readerError, setReaderError] = useState(null);
    const [iframeError, setIframeError] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showDiscussPrompt, setShowDiscussPrompt] = useState(false);
    const [extractAttempt, setExtractAttempt] = useState(0);
    const loadedRef = useRef(false);

    // Hold latest callbacks in refs so the data-fetching effect below can stay
    // keyed only to the article URL. Without this, parent re-renders that pass
    // new inline-arrow callbacks (onClose, onToggleSave, onDiscuss) would
    // re-run the effect and abort the in-flight extract-article fetch,
    // leaving the reader stuck on the loading spinner until a full refresh.
    const onCloseRef = useRef(onClose);
    const onToggleSaveRef = useRef(onToggleSave);
    const onDiscussRef = useRef(onDiscuss);
    useEffect(() => {
        onCloseRef.current = onClose;
        onToggleSaveRef.current = onToggleSave;
        onDiscussRef.current = onDiscuss;
    });

    const articleLink = article?.link || null;
    const hasToggleSave = !!onToggleSave;
    const hasDiscuss = !!onDiscuss;

    useEffect(() => {
        if (!articleLink) return;
        loadedRef.current = false;
        setView('reader');
        setReaderLoading(true);
        setReaderData(null);
        setReaderError(null);
        setIframeError(false);
        setIframeLoaded(false);
        setShowDiscussPrompt(false);
        document.body.style.overflow = 'hidden';
        const handleEsc = (e) => { if (e.key === 'Escape') onCloseRef.current?.(); };
        window.addEventListener('keydown', handleEsc);

        const extractCtrl = new AbortController();
        fetch(`/api/news-feeds/extract-article?url=${encodeURIComponent(articleLink)}`, {
            signal: extractCtrl.signal,
            headers: { Accept: 'application/json' },
        })
            .then((r) => r.json())
            .then((data) => {
                if (extractCtrl.signal.aborted) return;
                if (data?.success && data.content) {
                    setReaderData(data);
                } else {
                    setReaderError(data?.reason || 'no_content');
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') setReaderError('network');
            })
            .finally(() => {
                if (!extractCtrl.signal.aborted) setReaderLoading(false);
            });

        let tooltipTimer;
        if (hasToggleSave) {
            const dismissed = localStorage.getItem('edatsu_reader_tooltip_dismissed');
            if (!dismissed) {
                setShowTooltip(true);
                tooltipTimer = setTimeout(() => setShowTooltip(false), 5000);
            }
        }

        let discussTimer;
        if (hasDiscuss) {
            discussTimer = setTimeout(() => setShowDiscussPrompt(true), 15000);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
            extractCtrl.abort();
            if (tooltipTimer) clearTimeout(tooltipTimer);
            if (discussTimer) clearTimeout(discussTimer);
        };
    }, [articleLink, hasToggleSave, hasDiscuss, extractAttempt]);

    const retryExtract = () => setExtractAttempt((n) => n + 1);

    // Lazy-check framing only when user switches to Original view
    useEffect(() => {
        if (!article || view !== 'original') return;
        loadedRef.current = false;
        setIframeError(false);
        setIframeLoaded(false);

        const checkCtrl = new AbortController();
        fetch(`/api/news-feeds/check-frameable?url=${encodeURIComponent(article.link)}`, {
            signal: checkCtrl.signal,
            headers: { Accept: 'application/json' },
        })
            .then((r) => r.json())
            .then((data) => { if (!data?.frameable) setIframeError(true); })
            .catch(() => { });

        const loadTimer = setTimeout(() => {
            if (!loadedRef.current) setIframeError(true);
        }, 8000);

        return () => {
            checkCtrl.abort();
            clearTimeout(loadTimer);
        };
    }, [view, article]);

    if (!article) return null;

    const hostname = (() => {
        try { return new URL(article.link).hostname.replace(/^www\./, ''); }
        catch { return article.link; }
    })();

    return (
        <>
        <style>{`
            .article-reader-modal { height: 100vh; }
            @supports (height: 100dvh) {
                .article-reader-modal { height: 100dvh; }
            }
            @media (min-width: 768px) {
                .article-reader-backdrop { align-items: center !important; padding: 20px; }
                .article-reader-modal {
                    height: 90vh !important;
                    border-radius: 16px !important;
                    box-shadow: 0 24px 48px rgba(0,0,0,0.2) !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(100%); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes reader-spin { to { transform: rotate(360deg); } }
            .reader-prose { font-family: 'Georgia', 'Times New Roman', serif; color: #1d1d1f; font-size: 17px; line-height: 1.7; }
            .reader-prose p { margin: 0 0 1.1em; }
            .reader-prose h1, .reader-prose h2, .reader-prose h3 { font-family: 'Poppins', sans-serif; color: #000; margin: 1.6em 0 0.6em; line-height: 1.3; }
            .reader-prose h1 { font-size: 26px; font-weight: 600; }
            .reader-prose h2 { font-size: 21px; font-weight: 600; }
            .reader-prose h3 { font-size: 18px; font-weight: 600; }
            .reader-prose a { color: #f97316; text-decoration: none; border-bottom: 1px solid rgba(249,115,22,0.25); }
            .reader-prose a:hover { border-bottom-color: #f97316; }
            .reader-prose img { max-width: 100%; height: auto; border-radius: 10px; margin: 1.2em 0; display: block; }
            .reader-prose figure { margin: 1.2em 0; }
            .reader-prose figcaption { font-size: 13px; color: #86868b; margin-top: 6px; font-family: 'Poppins', sans-serif; }
            .reader-prose blockquote { border-left: 3px solid #f97316; padding: 4px 16px; margin: 1.2em 0; color: #555; font-style: italic; background: #fffaf5; border-radius: 0 8px 8px 0; }
            .reader-prose ul, .reader-prose ol { padding-left: 1.4em; margin: 0 0 1.1em; }
            .reader-prose li { margin-bottom: 0.4em; }
            .reader-prose pre, .reader-prose code { background: #f5f5f7; border-radius: 6px; font-family: ui-monospace, 'SF Mono', Consolas, monospace; font-size: 14px; }
            .reader-prose pre { padding: 14px; overflow-x: auto; margin: 1.2em 0; }
            .reader-prose code { padding: 2px 6px; }
            .reader-prose hr { border: none; border-top: 1px solid #e5e5e5; margin: 2em 0; }
        `}</style>
        <div
            onClick={onClose}
            className="article-reader-backdrop"
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="article-reader-modal"
                style={{
                    width: '100%', maxWidth: '960px', height: '100dvh',
                    background: '#fff', borderRadius: 0,
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 -4px 48px rgba(0,0,0,0.2)',
                    paddingTop: 'env(safe-area-inset-top)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {/* Header bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
                    background: '#fafafa', flexShrink: 0,
                }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                        <div style={{
                            fontSize: '13px', fontWeight: 600, color: '#000',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {article.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#86868b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {hostname}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, position: 'relative' }}>
                        {/* View toggle */}
                        <div style={{
                            display: 'flex', background: '#fff', borderRadius: '8px',
                            border: '1px solid #e5e5e5', overflow: 'hidden', padding: '2px',
                        }}>
                            <button
                                onClick={() => setView('reader')}
                                title="Reader view"
                                style={{
                                    padding: '5px 10px', border: 'none', background: view === 'reader' ? '#000' : 'transparent',
                                    color: view === 'reader' ? '#fff' : '#86868b', fontSize: '11px', fontWeight: 600,
                                    borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>menu_book</span>
                                Reader
                            </button>
                            <button
                                onClick={() => setView('original')}
                                title="Original page"
                                style={{
                                    padding: '5px 10px', border: 'none', background: view === 'original' ? '#000' : 'transparent',
                                    color: view === 'original' ? '#fff' : '#86868b', fontSize: '11px', fontWeight: 600,
                                    borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>public</span>
                                Original
                            </button>
                        </div>

                        {onToggleSave && (
                            <button
                                onClick={() => {
                                    onToggleSave(article);
                                    if (showTooltip) {
                                        setShowTooltip(false);
                                        localStorage.setItem('edatsu_reader_tooltip_dismissed', '1');
                                    }
                                }}
                                title={isSaved ? 'Remove from saved' : 'Save for later'}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    border: '1px solid #e5e5e5', background: '#fff',
                                    color: isSaved ? '#f97316' : '#86868b',
                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = isSaved ? '#f97316' : '#86868b'; }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                                    bookmark
                                </span>
                            </button>
                        )}

                        {showTooltip && (
                            <div style={{
                                position: 'absolute', top: '42px', right: '40px',
                                background: '#000', color: '#fff', fontSize: '12px',
                                padding: '8px 14px', borderRadius: '10px', whiteSpace: 'nowrap',
                                fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                animation: 'fadeInUp 0.3s ease',
                                zIndex: 10,
                            }}>
                                <div style={{
                                    position: 'absolute', top: '-6px', right: '68px',
                                    width: '12px', height: '12px', background: '#000',
                                    transform: 'rotate(45deg)', borderRadius: '2px',
                                }} />
                                Save this article to read later
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowTooltip(false);
                                        localStorage.setItem('edatsu_reader_tooltip_dismissed', '1');
                                    }}
                                    style={{
                                        background: 'transparent', border: 'none', color: '#86868b',
                                        cursor: 'pointer', marginLeft: '10px', padding: '0',
                                        fontSize: '12px', fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    Got it
                                </button>
                            </div>
                        )}

                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in new tab"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                border: '1px solid #e5e5e5', background: '#fff',
                                color: '#86868b', textDecoration: 'none',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#86868b'; }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
                        </a>
                        <button
                            onClick={onClose}
                            title="Close"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '50%',
                                border: 'none', background: '#dc2626', color: '#fff',
                                cursor: 'pointer', transition: 'all 0.15s ease',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    {view === 'reader' ? (
                        <div style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
                            {readerLoading ? (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', height: '100%', gap: '14px',
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        border: '3px solid #f0f0f0', borderTopColor: '#f97316',
                                        animation: 'reader-spin 0.8s linear infinite',
                                    }} />
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                                        Preparing reader view…
                                    </p>
                                </div>
                            ) : readerData ? (
                                <article style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
                                    <div style={{
                                        fontSize: '11px', fontWeight: 600, color: '#f97316',
                                        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}>
                                        {readerData.site_name || hostname}
                                    </div>
                                    <h1 style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '30px', fontWeight: 600, color: '#000',
                                        margin: '0 0 12px', lineHeight: 1.25,
                                    }}>
                                        {readerData.title || article.title}
                                    </h1>
                                    {readerData.author && (
                                        <div style={{ fontSize: '13px', color: '#86868b', marginBottom: '24px', fontFamily: "'Poppins', sans-serif" }}>
                                            By {readerData.author}
                                        </div>
                                    )}
                                    {readerData.image && (
                                        <img
                                            src={readerData.image}
                                            alt=""
                                            style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }}
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    )}
                                    <div
                                        className="reader-prose"
                                        dir={readerData.direction || 'ltr'}
                                        dangerouslySetInnerHTML={{ __html: readerData.content }}
                                    />
                                    <div style={{
                                        marginTop: '48px', paddingTop: '24px',
                                        borderTop: '1px solid #f0f0f0', display: 'flex',
                                        alignItems: 'center', justifyContent: 'space-between',
                                        flexWrap: 'wrap', gap: '12px',
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#86868b', fontFamily: "'Poppins', sans-serif" }}>
                                            Reader view of <strong>{hostname}</strong>
                                        </span>
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: '12px', color: '#f97316', textDecoration: 'none',
                                                fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            }}
                                        >
                                            View original
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                                        </a>
                                    </div>
                                </article>
                            ) : (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', height: '100%', padding: '40px 24px',
                                    textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '16px' }}>
                                        menu_book
                                    </span>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>
                                        Reader view unavailable
                                    </p>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 20px', lineHeight: 1.5, maxWidth: '360px' }}>
                                        We couldn't extract a clean article from this page. Try the original view or open it in a new tab.
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {(readerError === 'network' || readerError === 'unreachable' || readerError === 'bad_status') && (
                                            <button
                                                onClick={retryExtract}
                                                style={{
                                                    padding: '10px 20px', borderRadius: '9999px',
                                                    background: '#f97316', color: '#fff', border: 'none',
                                                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                                    fontFamily: "'Poppins', sans-serif",
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                                                Try again
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setView('original')}
                                            style={{
                                                padding: '10px 20px', borderRadius: '9999px',
                                                background: '#000', color: '#fff', border: 'none',
                                                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}
                                        >
                                            Try original
                                        </button>
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                padding: '10px 20px', borderRadius: '9999px',
                                                background: '#fff', color: '#000',
                                                border: '1px solid #e5e5e5', fontSize: '13px',
                                                fontWeight: 500, textDecoration: 'none',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}
                                        >
                                            Open in new tab
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : !iframeError ? (
                        <>
                            <iframe
                                src={article.link}
                                title={article.title}
                                onError={() => setIframeError(true)}
                                onLoad={() => {
                                    loadedRef.current = true;
                                    setIframeLoaded(true);
                                }}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                            />
                            {!iframeLoaded && (
                                <div style={{
                                    position: 'absolute', inset: 0, background: '#fff',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    gap: '14px', pointerEvents: 'none',
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        border: '3px solid #f0f0f0', borderTopColor: '#f97316',
                                        animation: 'reader-spin 0.8s linear infinite',
                                    }} />
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                                        Loading original page…
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', height: '100%', padding: '40px 24px',
                            textAlign: 'center',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '16px' }}>
                                public_off
                            </span>
                            <p style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>
                                This site can't be displayed here
                            </p>
                            <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 20px', lineHeight: 1.5, maxWidth: '360px' }}>
                                The site doesn't allow embedding. Try Reader view, or open it in a new tab.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setView('reader')}
                                    style={{
                                        padding: '10px 20px', borderRadius: '9999px',
                                        background: '#000', color: '#fff', border: 'none',
                                        fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    Use Reader view
                                </button>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '10px 20px', borderRadius: '9999px',
                                        background: '#fff', color: '#000',
                                        border: '1px solid #e5e5e5', fontSize: '13px',
                                        fontWeight: 500, textDecoration: 'none',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    Open in new tab
                                </a>
                            </div>
                        </div>
                    )}

                    {showDiscussPrompt && onDiscuss && (
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '14px 20px',
                            background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            animation: 'slideUp 0.4s ease',
                            zIndex: 5,
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '22px', color: '#f97316', flexShrink: 0,
                                fontVariationSettings: "'FILL' 1",
                            }}>
                                forum
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '13px', fontWeight: 600, color: '#fff', margin: '0 0 2px',
                                    fontFamily: "'Poppins', sans-serif",
                                }}>
                                    Have thoughts on this?
                                </p>
                                <p style={{ fontSize: '12px', color: '#b0b0b5', margin: 0 }}>
                                    Start a conversation in the forum and connect with others.
                                </p>
                            </div>
                            <button
                                onClick={() => onDiscuss(article)}
                                style={{
                                    padding: '8px 18px', borderRadius: '9999px',
                                    border: 'none', background: '#f97316', color: '#fff',
                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: "'Poppins', sans-serif",
                                    transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#ea6c0e'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f97316'}
                            >
                                Discuss
                            </button>
                            <button
                                onClick={() => setShowDiscussPrompt(false)}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: '#86868b', cursor: 'pointer', padding: '2px',
                                    display: 'flex', flexShrink: 0,
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ArticleReaderModal;
