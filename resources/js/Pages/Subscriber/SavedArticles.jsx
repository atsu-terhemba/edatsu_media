import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';
import Footer from '@/Components/Footer';

export default function SavedArticles({ articles: initialArticles }) {
    const [articles, setArticles] = useState(initialArticles || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const menuRef = useRef(null);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
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

    const removeArticle = async (id) => {
        try {
            const response = await axios.delete(`/saved-articles/${id}`);
            if (response.data.status === 'success') {
                setArticles(prev => ({
                    ...prev,
                    data: prev.data.filter(a => a.id !== id),
                    total: prev.total - 1
                }));
                Toast.fire({ icon: "success", title: "Article removed" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing article" });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const visibleIds = articles.data.map(a => a.id);
        setSelectedIds(selectedIds.length === visibleIds.length ? [] : visibleIds);
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds([]);
    };

    const bulkRemove = async () => {
        if (selectedIds.length === 0) return;
        try {
            const response = await axios.post('/saved-articles/bulk-delete', { ids: selectedIds });
            if (response.data.status === 'success') {
                setArticles(prev => ({
                    ...prev,
                    data: prev.data.filter(a => !selectedIds.includes(a.id)),
                    total: prev.total - selectedIds.length
                }));
                Toast.fire({ icon: "success", title: response.data.message });
                exitSelectMode();
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing articles" });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Saved Articles" />

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
                                            Saved Articles
                                        </h1>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0' }}>
                                            Articles you've bookmarked from your feeds
                                        </p>
                                    </div>
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
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>article</span>
                                        {articles.total || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Select controls */}
                            {articles.data && articles.data.length > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                    {selectMode ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                            <button
                                                onClick={toggleSelectAll}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                                    border: '1px solid #e0e0e0',
                                                    background: selectedIds.length === articles.data.length && articles.data.length > 0 ? '#000' : '#fff',
                                                    color: selectedIds.length === articles.data.length && articles.data.length > 0 ? '#fff' : '#000',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                                    {selectedIds.length === articles.data.length && articles.data.length > 0 ? 'deselect' : 'select_all'}
                                                </span>
                                                {selectedIds.length === articles.data.length && articles.data.length > 0 ? 'Deselect All' : 'Select All'}
                                            </button>
                                            {selectedIds.length > 0 && (
                                                <button
                                                    onClick={bulkRemove}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                                                        cursor: 'pointer', border: 'none', background: '#dc3545', color: '#fff',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                                                    Remove ({selectedIds.length})
                                                </button>
                                            )}
                                            <span style={{ fontSize: '13px', color: '#86868b', marginLeft: '4px' }}>
                                                {selectedIds.length} selected
                                            </span>
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                    <button
                                        onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                                            cursor: 'pointer', transition: 'all 0.15s ease',
                                            border: selectMode ? 'none' : '1px solid #e0e0e0',
                                            background: selectMode ? '#000' : '#fff',
                                            color: selectMode ? '#fff' : '#000',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                            {selectMode ? 'close' : 'checklist'}
                                        </span>
                                        {selectMode ? 'Cancel' : 'Select'}
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            {loading ? (
                                <BookmarksSkeleton count={5} />
                            ) : articles.data && articles.data.length > 0 ? (
                                <div>
                                    {articles.data.map((article) => (
                                        <div
                                            key={article.id}
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
                                                {selectMode && (
                                                    <button
                                                        onClick={() => toggleSelect(article.id)}
                                                        style={{
                                                            width: '22px', height: '22px', borderRadius: '6px',
                                                            border: selectedIds.includes(article.id) ? 'none' : '2px solid #d1d1d6',
                                                            background: selectedIds.includes(article.id) ? '#000' : '#fff',
                                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0, marginTop: '2px', transition: 'all 0.15s ease', padding: 0,
                                                        }}
                                                    >
                                                        {selectedIds.includes(article.id) && (
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>check</span>
                                                        )}
                                                    </button>
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <a
                                                        href={article.article_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            fontSize: '15px', fontWeight: 500, color: '#000',
                                                            textDecoration: 'none', display: 'block', marginBottom: '8px', lineHeight: 1.4,
                                                            transition: 'opacity 0.15s ease',
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                                    >
                                                        {article.article_title}
                                                    </a>

                                                    {article.article_description && (
                                                        <p style={{
                                                            fontSize: '13px', color: '#86868b', lineHeight: 1.5,
                                                            margin: '0 0 10px', overflow: 'hidden',
                                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                        }}>
                                                            {article.article_description}
                                                        </p>
                                                    )}

                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                                        {article.feed_title && (
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                                padding: '4px 10px', borderRadius: '9999px', background: '#f5f5f7',
                                                                fontSize: '12px', fontWeight: 500, color: '#000',
                                                            }}>
                                                                {article.feed_favicon && (
                                                                    <img
                                                                        src={article.feed_favicon}
                                                                        alt=""
                                                                        width={14}
                                                                        height={14}
                                                                        style={{ borderRadius: '3px' }}
                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                    />
                                                                )}
                                                                {article.feed_title}
                                                            </span>
                                                        )}
                                                        {article.article_date && (
                                                            <span style={{ fontSize: '12px', color: '#b0b0b5' }}>
                                                                {article.article_date}
                                                            </span>
                                                        )}
                                                        <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bookmark_added</span>
                                                            Saved {formatDate(article.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions menu */}
                                                <div style={{ position: 'relative' }} ref={openMenuId === article.id ? menuRef : null}>
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
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

                                                    {openMenuId === article.id && (
                                                        <div style={{
                                                            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                                                            width: '200px', background: '#fff', borderRadius: '14px',
                                                            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                            border: '1px solid #f0f0f0', zIndex: 100, overflow: 'hidden', padding: '6px',
                                                        }}>
                                                            <a
                                                                href={article.article_link}
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
                                                                Read Article
                                                            </a>
                                                            <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                            <button
                                                                onClick={() => { removeArticle(article.id); setOpenMenuId(null); }}
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
                                                                Remove
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {articles.last_page > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', marginBottom: '32px' }}>
                                            <PaginationButton
                                                label="Previous" icon="chevron_left"
                                                disabled={articles.current_page === 1}
                                                onClick={() => router.visit(`/saved-articles?page=${articles.current_page - 1}`)}
                                            />
                                            <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '13px', fontWeight: 500, color: '#86868b' }}>
                                                {articles.current_page} of {articles.last_page}
                                            </span>
                                            <PaginationButton
                                                label="Next" icon="chevron_right" iconAfter
                                                disabled={articles.current_page === articles.last_page}
                                                onClick={() => router.visit(`/saved-articles?page=${articles.current_page + 1}`)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '64px 24px', borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '32px' }}>
                                    <span style={{
                                        width: '64px', height: '64px', borderRadius: '50%', background: '#f5f5f7',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#86868b' }}>bookmark_remove</span>
                                    </span>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>No Saved Articles Yet</h3>
                                    <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                                        Bookmark articles from your news feeds to save them here for later.
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

function PaginationButton({ label, icon, iconAfter, disabled, onClick }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 18px',
            borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
            background: disabled ? '#f5f5f7' : '#fff', color: disabled ? '#b0b0b5' : '#000',
            border: disabled ? 'none' : '1px solid #e0e0e0', cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
        }}
            onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; } }}
            onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e0e0e0'; } }}
        >
            {!iconAfter && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>}
            {label}
            {iconAfter && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>}
        </button>
    );
}
