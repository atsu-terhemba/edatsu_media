import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';
import Footer from '@/Components/Footer';

export default function BookmarkedTools({ tools: initialTools }) {
    const [tools, setTools] = useState(initialTools || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
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

    const removeBookmark = async (bookmarkId) => {
        try {
            const response = await axios.put('/remove-bookmark-feed', { id: bookmarkId });
            if (response.data.status === 'success') {
                setTools(prev => ({
                    ...prev,
                    data: prev.data.filter(b => b.id !== bookmarkId),
                    total: prev.total - 1
                }));
                Toast.fire({ icon: "success", title: "Bookmark removed" });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing bookmark" });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const visibleIds = filteredTools.map(b => b.id);
        setSelectedIds(selectedIds.length === visibleIds.length ? [] : visibleIds);
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelectedIds([]);
    };

    const bulkRemove = async () => {
        if (selectedIds.length === 0) return;
        try {
            const response = await axios.put('/remove-bookmarks-bulk', { ids: selectedIds });
            if (response.data.status === 'success') {
                setTools(prev => ({
                    ...prev,
                    data: prev.data.filter(b => !selectedIds.includes(b.id)),
                    total: prev.total - selectedIds.length
                }));
                Toast.fire({ icon: "success", title: response.data.message });
                exitSelectMode();
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Error removing bookmarks" });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const filteredTools = tools.data?.filter(bookmark => {
        if (!bookmark.product) return false;
        if (filter === 'all') return true;
        if (filter === 'rated') return bookmark.product?.ratings > 0;
        if (filter === 'unrated') return !bookmark.product?.ratings || bookmark.product.ratings === 0;
        return true;
    }) || [];

    const filters = [
        { key: 'all', label: 'All', icon: 'list' },
        { key: 'rated', label: 'Rated', icon: 'star' },
        { key: 'unrated', label: 'Unrated', icon: 'star_outline' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Saved Tools" />

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
                                            Saved Tools
                                        </h1>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0' }}>
                                            Track and manage your bookmarked tools
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {tools.data && tools.data.length > 0 && (
                                            <a
                                                href="/export-bookmarked-tools"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '7px 16px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    border: '1px solid #e0e0e0',
                                                    background: '#fff',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                                                Export
                                            </a>
                                        )}
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
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>handyman</span>
                                            {tools.total || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters + Select */}
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
                                                background: selectedIds.length === filteredTools.length && filteredTools.length > 0 ? '#000' : '#fff',
                                                color: selectedIds.length === filteredTools.length && filteredTools.length > 0 ? '#fff' : '#000',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                                                {selectedIds.length === filteredTools.length && filteredTools.length > 0 ? 'deselect' : 'select_all'}
                                            </span>
                                            {selectedIds.length === filteredTools.length && filteredTools.length > 0 ? 'Deselect All' : 'Select All'}
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
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {filters.map((f) => (
                                            <button
                                                key={f.key}
                                                onClick={() => setFilter(f.key)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                                    border: filter === f.key ? 'none' : '1px solid #e0e0e0',
                                                    background: filter === f.key ? '#000' : '#fff',
                                                    color: filter === f.key ? '#fff' : '#000',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{f.icon}</span>
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {tools.data && tools.data.length > 0 && (
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
                                )}
                            </div>

                            {/* Content */}
                            {loading ? (
                                <BookmarksSkeleton count={5} />
                            ) : tools.data && tools.data.length > 0 ? (
                                <div>
                                    {filteredTools.length > 0 ? (
                                        filteredTools.map((bookmark) => (
                                            <div
                                                key={bookmark.id}
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
                                                            onClick={() => toggleSelect(bookmark.id)}
                                                            style={{
                                                                width: '22px', height: '22px', borderRadius: '6px',
                                                                border: selectedIds.includes(bookmark.id) ? 'none' : '2px solid #d1d1d6',
                                                                background: selectedIds.includes(bookmark.id) ? '#000' : '#fff',
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                flexShrink: 0, marginTop: '2px', transition: 'all 0.15s ease', padding: 0,
                                                            }}
                                                        >
                                                            {selectedIds.includes(bookmark.id) && (
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fff' }}>check</span>
                                                            )}
                                                        </button>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <Link
                                                            href={`/product/${bookmark.product?.id}/${bookmark.product?.slug}`}
                                                            style={{
                                                                fontSize: '15px', fontWeight: 500, color: '#000',
                                                                textDecoration: 'none', display: 'block', marginBottom: '10px', lineHeight: 1.4,
                                                            }}
                                                        >
                                                            {bookmark.product?.product_name}
                                                        </Link>

                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                padding: '4px 10px', borderRadius: '9999px', background: '#f5f5f7',
                                                                fontSize: '12px', fontWeight: 500, color: '#000',
                                                            }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>handyman</span>
                                                                Tool
                                                            </span>
                                                            {bookmark.product?.ratings > 0 && (
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                    padding: '4px 10px', borderRadius: '9999px',
                                                                    fontSize: '12px', fontWeight: 500, color: '#f97316', background: 'rgba(249,115,22,0.08)',
                                                                }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>star</span>
                                                                    {bookmark.product.ratings}/5
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bookmark_added</span>
                                                            Saved {formatDate(bookmark.created_at)}
                                                        </span>
                                                    </div>

                                                    {/* Actions menu */}
                                                    <div style={{ position: 'relative' }} ref={openMenuId === bookmark.id ? menuRef : null}>
                                                        <button
                                                            onClick={() => setOpenMenuId(openMenuId === bookmark.id ? null : bookmark.id)}
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

                                                        {openMenuId === bookmark.id && (
                                                            <div style={{
                                                                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                                                                width: '200px', background: '#fff', borderRadius: '14px',
                                                                boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                                border: '1px solid #f0f0f0', zIndex: 100, overflow: 'hidden', padding: '6px',
                                                            }}>
                                                                <MenuLink
                                                                    href={`/product/${bookmark.product?.id}/${bookmark.product?.slug}`}
                                                                    icon="visibility"
                                                                    label="View Details"
                                                                    onClick={() => setOpenMenuId(null)}
                                                                />
                                                                {bookmark.product?.source_url && (
                                                                    <MenuExtLink
                                                                        href={bookmark.product.source_url}
                                                                        icon="open_in_new"
                                                                        label="Visit Website"
                                                                        onClick={() => setOpenMenuId(null)}
                                                                    />
                                                                )}
                                                                <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />
                                                                <MenuButton
                                                                    icon="delete"
                                                                    label="Remove"
                                                                    danger
                                                                    onClick={() => { removeBookmark(bookmark.id); setOpenMenuId(null); }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState
                                            icon="filter_list_off"
                                            title={`No ${filter === 'rated' ? 'Rated' : 'Unrated'} Tools`}
                                            description={`There are no ${filter === 'rated' ? 'rated' : 'unrated'} tools in your bookmarks.`}
                                            buttonLabel="Show All"
                                            onButtonClick={() => setFilter('all')}
                                        />
                                    )}

                                    {tools.last_page > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', marginBottom: '32px' }}>
                                            <PaginationButton
                                                label="Previous" icon="chevron_left"
                                                disabled={tools.current_page === 1}
                                                onClick={() => router.visit(`/bookmarked-tools?page=${tools.current_page - 1}`)}
                                            />
                                            <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '13px', fontWeight: 500, color: '#86868b' }}>
                                                {tools.current_page} of {tools.last_page}
                                            </span>
                                            <PaginationButton
                                                label="Next" icon="chevron_right" iconAfter
                                                disabled={tools.current_page === tools.last_page}
                                                onClick={() => router.visit(`/bookmarked-tools?page=${tools.current_page + 1}`)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="bookmark_remove"
                                    title="No Saved Tools Yet"
                                    description="Start exploring and saving tools to keep track of them here."
                                    buttonLabel="Explore Tools"
                                    buttonHref="/toolshed"
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
        </AuthenticatedLayout>
    );
}

// --- Sub-components ---

function MenuLink({ href, icon, label, onClick }) {
    return (
        <Link href={href} onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
            borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
            color: '#000', transition: 'background 0.15s ease',
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>{icon}</span>
            {label}
        </Link>
    );
}

function MenuExtLink({ href, icon, label, onClick }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
            borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
            color: '#000', transition: 'background 0.15s ease',
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>{icon}</span>
            {label}
        </a>
    );
}

function MenuButton({ icon, label, onClick, danger }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
            borderRadius: '10px', fontSize: '13px', fontWeight: 500,
            color: danger ? '#dc3545' : '#000', background: 'transparent', border: 'none',
            width: '100%', cursor: 'pointer', transition: 'background 0.15s ease', textAlign: 'left',
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = danger ? '#fef2f2' : '#f5f5f7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: danger ? '#dc3545' : '#86868b' }}>{icon}</span>
            {label}
        </button>
    );
}

function EmptyState({ icon, title, description, buttonLabel, onButtonClick, buttonHref }) {
    const btnStyle = {
        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px',
        borderRadius: '9999px', fontSize: '13px', fontWeight: 500, background: '#000',
        color: '#fff', border: 'none', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s ease',
    };
    return (
        <div style={{ textAlign: 'center', padding: '64px 24px', borderRadius: '16px', border: '1px solid #f0f0f0', marginBottom: '32px' }}>
            <span style={{
                width: '64px', height: '64px', borderRadius: '50%', background: '#f5f5f7',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#86868b' }}>{icon}</span>
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>{description}</p>
            {buttonHref ? (
                <Link href={buttonHref} style={btnStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    {buttonLabel}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </Link>
            ) : (
                <button onClick={onButtonClick} style={btnStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    {buttonLabel}
                </button>
            )}
        </div>
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
