import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';
import Footer from '@/Components/Footer';
import ArticleReaderModal from '@/Components/ArticleReaderModal';
import PreferencesBanner from '@/Components/PreferencesBanner';

const COLLECTION_PALETTE = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#eab308', '#ef4444', '#06b6d4'];

export default function SavedArticles({ articles: initialArticles, collections: initialCollections = [], activeCollection = null }) {
    const [articles, setArticles] = useState(initialArticles || { data: [], total: 0 });
    const [collections, setCollections] = useState(initialCollections);
    const [collectionMenuArticleId, setCollectionMenuArticleId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [readerArticle, setReaderArticle] = useState(null);
    const menuRef = useRef(null);
    const collectionMenuRef = useRef(null);

    const activeCollectionId = activeCollection === 'uncategorized' ? 'uncategorized'
        : (activeCollection !== null && activeCollection !== undefined ? Number(activeCollection) : null);

    const filterTo = (val) => {
        const url = val === null ? '/saved-articles' : `/saved-articles?collection=${val}`;
        router.visit(url, { preserveScroll: false });
    };

    const createCollection = async () => {
        const { value: name } = await Swal.fire({
            title: 'New collection',
            input: 'text',
            inputPlaceholder: 'e.g. AI Research',
            inputAttributes: { maxlength: 80 },
            showCancelButton: true,
            confirmButtonText: 'Create',
            confirmButtonColor: '#000',
            cancelButtonColor: '#86868b',
        });
        if (!name || !name.trim()) return;
        const color = COLLECTION_PALETTE[collections.length % COLLECTION_PALETTE.length];
        try {
            const res = await axios.post('/api/article-collections', { name: name.trim(), color });
            setCollections((prev) => [...prev, res.data.collection].sort((a, b) => a.name.localeCompare(b.name)));
            Toast.fire({ icon: 'success', title: 'Collection created' });
        } catch (err) {
            if (err.response?.status === 409) {
                Toast.fire({ icon: 'warning', title: 'A collection with this name already exists' });
            } else {
                Toast.fire({ icon: 'error', title: 'Could not create collection' });
            }
        }
    };

    const renameOrDeleteCollection = async (collection) => {
        const escapeAttr = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        const shareUrlInitial = collection.share_url || '';
        const html = `
            <div style="text-align:left;font-family:'Poppins',sans-serif;">
                <label style="display:block;font-size:12px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Name</label>
                <input id="coll-name" type="text" value="${escapeAttr(collection.name)}" maxlength="80"
                    style="width:100%;padding:10px 12px;border:1px solid #e5e5e5;border-radius:10px;font-size:14px;color:#000;outline:none;font-family:inherit;" />

                <div style="margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:#f5f5f7;border-radius:10px;">
                    <div>
                        <div style="font-size:13px;font-weight:600;color:#000;">Public reading list</div>
                        <div style="font-size:11px;color:#86868b;">Anyone with the link can view this list</div>
                    </div>
                    <label style="position:relative;display:inline-block;width:42px;height:24px;cursor:pointer;">
                        <input id="coll-public" type="checkbox" ${collection.is_public ? 'checked' : ''}
                            style="opacity:0;width:0;height:0;" />
                        <span id="coll-public-slider" style="position:absolute;inset:0;background:${collection.is_public ? '#f97316' : '#d1d1d6'};border-radius:9999px;transition:background 0.2s;">
                            <span style="position:absolute;top:2px;left:${collection.is_public ? '20px' : '2px'};width:20px;height:20px;background:#fff;border-radius:50%;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></span>
                        </span>
                    </label>
                </div>

                <div id="coll-share" style="margin-top:14px;display:${collection.is_public ? 'flex' : 'none'};gap:6px;align-items:center;padding:10px 12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;">
                    <span class="material-symbols-outlined" style="font-size:16px;color:#f97316;">link</span>
                    <span id="coll-share-url" style="flex:1;font-size:12px;color:#9a3412;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,monospace;">${escapeAttr(shareUrlInitial || '(generating...)')}</span>
                    <button type="button" id="coll-copy" style="background:#f97316;color:#fff;border:none;border-radius:9999px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Copy</button>
                </div>
            </div>
        `;

        let didTogglePublic = false;
        let currentPublic = !!collection.is_public;

        const result = await Swal.fire({
            title: 'Collection settings',
            html,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: 'Delete',
            confirmButtonColor: '#000',
            denyButtonColor: '#dc3545',
            cancelButtonColor: '#86868b',
            width: '460px',
            didOpen: () => {
                const toggle = document.getElementById('coll-public');
                const slider = document.getElementById('coll-public-slider');
                const sliderKnob = slider?.querySelector('span');
                const shareBox = document.getElementById('coll-share');
                const copyBtn = document.getElementById('coll-copy');

                toggle?.addEventListener('change', (e) => {
                    currentPublic = e.target.checked;
                    didTogglePublic = currentPublic !== collection.is_public;
                    if (slider) slider.style.background = currentPublic ? '#f97316' : '#d1d1d6';
                    if (sliderKnob) sliderKnob.style.left = currentPublic ? '20px' : '2px';
                    if (shareBox) shareBox.style.display = currentPublic ? 'flex' : 'none';
                });

                copyBtn?.addEventListener('click', async () => {
                    const url = document.getElementById('coll-share-url')?.textContent || '';
                    if (!url || url === '(generating...)') return;
                    try {
                        await navigator.clipboard.writeText(url);
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
                    } catch {
                        copyBtn.textContent = 'Failed';
                    }
                });
            },
            preConfirm: () => {
                const name = (document.getElementById('coll-name')?.value || '').trim();
                return { name, is_public: currentPublic };
            },
        });

        if (result.isConfirmed) {
            const { name, is_public } = result.value || {};
            const patch = {};
            if (name && name !== collection.name) patch.name = name;
            if (is_public !== collection.is_public) patch.is_public = is_public;
            if (Object.keys(patch).length === 0) return;
            try {
                const res = await axios.patch(`/api/article-collections/${collection.id}`, patch);
                setCollections((prev) => prev.map((c) => c.id === collection.id ? { ...c, ...res.data.collection } : c).sort((a, b) => a.name.localeCompare(b.name)));
                Toast.fire({ icon: 'success', title: 'Collection updated' });
            } catch (err) {
                Toast.fire({ icon: 'error', title: err.response?.data?.message || 'Could not update' });
            }
        } else if (result.isDenied) {
            try {
                await axios.delete(`/api/article-collections/${collection.id}`);
                setCollections((prev) => prev.filter((c) => c.id !== collection.id));
                if (activeCollectionId === collection.id) filterTo(null);
                else {
                    setArticles((prev) => ({
                        ...prev,
                        data: (prev.data || []).map((a) => ({
                            ...a,
                            collection_ids: (a.collection_ids || []).filter((id) => id !== collection.id),
                        })),
                    }));
                }
                Toast.fire({ icon: 'success', title: 'Collection deleted' });
            } catch {
                Toast.fire({ icon: 'error', title: 'Could not delete' });
            }
        }
    };

    const toggleArticleInCollection = async (article, collection) => {
        const isIn = (article.collection_ids || []).includes(collection.id);
        // Optimistic update
        setArticles((prev) => ({
            ...prev,
            data: prev.data.map((a) => a.id === article.id ? {
                ...a,
                collection_ids: isIn
                    ? (a.collection_ids || []).filter((id) => id !== collection.id)
                    : [...(a.collection_ids || []), collection.id],
            } : a),
        }));
        setCollections((prev) => prev.map((c) => c.id === collection.id ? { ...c, item_count: Math.max(0, (c.item_count || 0) + (isIn ? -1 : 1)) } : c));

        try {
            if (isIn) {
                await axios.delete(`/api/article-collections/${collection.id}/items/${article.id}`);
            } else {
                await axios.post(`/api/article-collections/${collection.id}/items`, { saved_article_ids: [article.id] });
            }
        } catch (err) {
            // Revert
            setArticles((prev) => ({
                ...prev,
                data: prev.data.map((a) => a.id === article.id ? {
                    ...a,
                    collection_ids: isIn
                        ? [...(a.collection_ids || []), collection.id]
                        : (a.collection_ids || []).filter((id) => id !== collection.id),
                } : a),
            }));
            setCollections((prev) => prev.map((c) => c.id === collection.id ? { ...c, item_count: Math.max(0, (c.item_count || 0) + (isIn ? 1 : -1)) } : c));
            Toast.fire({ icon: 'error', title: 'Could not update' });
        }
    };

    const collectionById = (id) => collections.find((c) => c.id === id);

    const openReader = (article) => {
        setReaderArticle({
            id: article.id,
            link: article.article_link,
            title: article.article_title,
            description: article.article_description,
            date: article.article_date,
            note: article.note || '',
            highlights: article.highlights || [],
        });
    };

    const closeReader = () => setReaderArticle(null);

    const saveNoteFor = async (articleId, text) => {
        try {
            await axios.put(`/api/saved-articles/${articleId}/note`, { note: text });
            setArticles((prev) => ({
                ...prev,
                data: prev.data.map((a) => a.id === articleId ? { ...a, note: text || null } : a),
            }));
        } catch {
            Toast.fire({ icon: 'error', title: 'Could not save note' });
        }
    };

    const addHighlightFor = async (articleId, text) => {
        try {
            const res = await axios.post(`/api/saved-articles/${articleId}/highlights`, { text });
            const h = res.data.highlight;
            setArticles((prev) => ({
                ...prev,
                data: prev.data.map((a) => a.id === articleId ? { ...a, highlights: [h, ...(a.highlights || [])] } : a),
            }));
            return h;
        } catch {
            Toast.fire({ icon: 'error', title: 'Could not save highlight' });
            return null;
        }
    };

    const deleteHighlightFor = async (articleId, highlightId) => {
        try {
            await axios.delete(`/api/article-highlights/${highlightId}`);
            setArticles((prev) => ({
                ...prev,
                data: prev.data.map((a) => a.id === articleId
                    ? { ...a, highlights: (a.highlights || []).filter((h) => h.id !== highlightId) }
                    : a),
            }));
        } catch {
            Toast.fire({ icon: 'error', title: 'Could not delete highlight' });
            throw new Error('delete failed');
        }
    };

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
                            <PreferencesBanner section="forum" />

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

                            {/* Collections filter strip */}
                            <div style={{
                                display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center',
                                marginBottom: '16px',
                            }}>
                                {[
                                    { id: null, label: 'All', count: null },
                                    { id: 'uncategorized', label: 'Uncategorized', count: null },
                                ].map((tag) => {
                                    const active = activeCollectionId === tag.id;
                                    return (
                                        <button
                                            key={String(tag.id)}
                                            onClick={() => filterTo(tag.id)}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '9999px',
                                                border: active ? '1px solid #000' : '1px solid #e5e5e7',
                                                background: active ? '#000' : '#fff',
                                                color: active ? '#fff' : '#6e6e73',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}
                                        >
                                            {tag.label}
                                        </button>
                                    );
                                })}
                                {collections.map((c) => {
                                    const active = activeCollectionId === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => filterTo(c.id)}
                                            onContextMenu={(e) => { e.preventDefault(); renameOrDeleteCollection(c); }}
                                            title="Right-click to rename or delete"
                                            style={{
                                                padding: '6px 12px 6px 10px',
                                                borderRadius: '9999px',
                                                border: active ? '1px solid #000' : '1px solid #e5e5e7',
                                                background: active ? '#000' : '#fff',
                                                color: active ? '#fff' : '#6e6e73',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontFamily: "'Poppins', sans-serif",
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            }}
                                        >
                                            <span style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: c.color || '#86868b', flexShrink: 0,
                                            }} />
                                            {c.name}
                                            {c.is_public && (
                                                <span
                                                    className="material-symbols-outlined"
                                                    title={c.share_url ? `Public — ${c.share_url}` : 'Public list'}
                                                    style={{ fontSize: '13px', color: active ? '#fff' : '#f97316' }}
                                                >
                                                    public
                                                </span>
                                            )}
                                            {c.item_count > 0 && (
                                                <span style={{
                                                    fontSize: '11px', fontWeight: 700,
                                                    background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                                                    color: active ? '#fff' : '#6e6e73',
                                                    borderRadius: '9999px',
                                                    padding: '0 6px', lineHeight: '16px', minWidth: '16px',
                                                    textAlign: 'center',
                                                }}>{c.item_count}</span>
                                            )}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={createCollection}
                                    title="Create a new collection"
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '9999px',
                                        border: '1px dashed #d1d1d6',
                                        background: 'transparent',
                                        color: '#86868b',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        fontFamily: "'Poppins', sans-serif",
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d1d6'; e.currentTarget.style.color = '#86868b'; }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                                    New
                                </button>
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
                                                    <button
                                                        onClick={() => openReader(article)}
                                                        style={{
                                                            fontSize: '15px', fontWeight: 500, color: '#000',
                                                            background: 'transparent', border: 'none', padding: 0,
                                                            textAlign: 'left', cursor: 'pointer',
                                                            display: 'block', marginBottom: '8px', lineHeight: 1.4,
                                                            transition: 'opacity 0.15s ease', fontFamily: "'Poppins', sans-serif",
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                                    >
                                                        {article.article_title}
                                                    </button>

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
                                                        {article.note && (
                                                            <span
                                                                title={article.note}
                                                                style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                    padding: '3px 9px', borderRadius: '9999px',
                                                                    background: '#f5f5f7', fontSize: '11px', fontWeight: 600, color: '#000',
                                                                }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>edit_note</span>
                                                                Note
                                                            </span>
                                                        )}
                                                        {(article.highlights || []).length > 0 && (
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                padding: '3px 9px', borderRadius: '9999px',
                                                                background: '#fffceb', fontSize: '11px', fontWeight: 600, color: '#a16207',
                                                            }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>format_ink_highlighter</span>
                                                                {article.highlights.length}
                                                            </span>
                                                        )}
                                                        {(article.collection_ids || []).map((cid) => {
                                                            const c = collectionById(cid);
                                                            if (!c) return null;
                                                            return (
                                                                <span
                                                                    key={cid}
                                                                    onClick={() => filterTo(cid)}
                                                                    title={`In: ${c.name}`}
                                                                    style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                                        padding: '3px 9px', borderRadius: '9999px',
                                                                        background: `${c.color || '#86868b'}14`,
                                                                        border: `1px solid ${c.color || '#86868b'}40`,
                                                                        fontSize: '11px', fontWeight: 600, color: c.color || '#6e6e73',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color || '#86868b' }} />
                                                                    {c.name}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Add-to-collection */}
                                                <div style={{ position: 'relative' }} ref={collectionMenuArticleId === article.id ? collectionMenuRef : null}>
                                                    <button
                                                        onClick={() => setCollectionMenuArticleId(collectionMenuArticleId === article.id ? null : article.id)}
                                                        title="Add to collection"
                                                        style={{
                                                            width: '36px', height: '36px', borderRadius: '10px',
                                                            background: (article.collection_ids || []).length > 0 ? '#fff7ed' : '#f5f5f7',
                                                            border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'background 0.15s ease', flexShrink: 0,
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{
                                                            fontSize: '18px',
                                                            color: (article.collection_ids || []).length > 0 ? '#f97316' : '#000',
                                                            fontVariationSettings: (article.collection_ids || []).length > 0 ? "'FILL' 1" : "'FILL' 0",
                                                        }}>
                                                            folder
                                                        </span>
                                                    </button>

                                                    {collectionMenuArticleId === article.id && (
                                                        <>
                                                            <div onClick={() => setCollectionMenuArticleId(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                                                            <div style={{
                                                                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                                                                width: '240px', background: '#fff', borderRadius: '14px',
                                                                boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                                border: '1px solid #f0f0f0', zIndex: 51, overflow: 'hidden', padding: '6px',
                                                                maxHeight: '320px', overflowY: 'auto',
                                                            }}>
                                                                <div style={{ padding: '6px 10px 8px', fontSize: '11px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                    Collections
                                                                </div>
                                                                {collections.length === 0 && (
                                                                    <div style={{ padding: '8px 10px', fontSize: '12px', color: '#86868b' }}>No collections yet.</div>
                                                                )}
                                                                {collections.map((c) => {
                                                                    const isIn = (article.collection_ids || []).includes(c.id);
                                                                    return (
                                                                        <button
                                                                            key={c.id}
                                                                            onClick={() => toggleArticleInCollection(article, c)}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                                                width: '100%', padding: '8px 10px',
                                                                                background: isIn ? '#f5f5f7' : 'transparent',
                                                                                border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                                                textAlign: 'left', fontFamily: "'Poppins', sans-serif",
                                                                            }}
                                                                            onMouseEnter={(e) => { if (!isIn) e.currentTarget.style.background = '#fafafa'; }}
                                                                            onMouseLeave={(e) => { if (!isIn) e.currentTarget.style.background = 'transparent'; }}
                                                                        >
                                                                            <span style={{
                                                                                width: '16px', height: '16px', borderRadius: '4px',
                                                                                border: isIn ? 'none' : '1px solid #d1d1d6',
                                                                                background: isIn ? '#f97316' : '#fff',
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                                            }}>
                                                                                {isIn && <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#fff' }}>check</span>}
                                                                            </span>
                                                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color || '#86868b', flexShrink: 0 }} />
                                                                            <span style={{ fontSize: '13px', color: '#000', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {c.name}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                                <div style={{ height: '1px', background: '#f0f0f0', margin: '6px 4px' }} />
                                                                <button
                                                                    onClick={() => { setCollectionMenuArticleId(null); createCollection(); }}
                                                                    style={{
                                                                        display: 'flex', alignItems: 'center', gap: '8px',
                                                                        width: '100%', padding: '8px 10px',
                                                                        background: 'transparent', border: 'none', borderRadius: '8px',
                                                                        cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 500,
                                                                        color: '#f97316', fontFamily: "'Poppins', sans-serif",
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                                                                    New collection
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
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
                                                            <button
                                                                onClick={() => { openReader(article); setOpenMenuId(null); }}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                                    borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                                                                    color: '#000', background: 'transparent', border: 'none',
                                                                    width: '100%', cursor: 'pointer', transition: 'background 0.15s ease', textAlign: 'left',
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#86868b' }}>menu_book</span>
                                                                Read Article
                                                            </button>
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
                                                                Open original
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

            <ArticleReaderModal
                article={readerArticle}
                onClose={closeReader}
                isSaved={true}
                onToggleSave={(article) => {
                    if (readerArticle?.id) {
                        removeArticle(readerArticle.id);
                        closeReader();
                    }
                }}
                isAuthenticated={true}
                savedArticleId={readerArticle?.id || null}
                note={readerArticle?.note || ''}
                highlights={readerArticle?.highlights || []}
                onNoteChange={(text) => readerArticle?.id && saveNoteFor(readerArticle.id, text)}
                onAddHighlight={(text) => readerArticle?.id ? addHighlightFor(readerArticle.id, text) : null}
                onDeleteHighlight={(hid) => readerArticle?.id && deleteHighlightFor(readerArticle.id, hid)}
            />

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
