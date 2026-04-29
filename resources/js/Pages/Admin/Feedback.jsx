import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import DefaultPagination from '@/Components/DefaultPagination';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'resolved', label: 'Resolved' },
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All types' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'general', label: 'General' },
    { value: 'other', label: 'Other' },
];

const STATUS_COLORS = {
    new:      { bg: '#fef3c7', fg: '#92400e' },
    reviewed: { bg: '#e0e7ff', fg: '#3730a3' },
    resolved: { bg: '#dcfce7', fg: '#166534' },
};

const CATEGORY_COLORS = {
    bug:     { bg: '#fee2e2', fg: '#991b1b', icon: 'bug_report' },
    feature: { bg: '#e0e7ff', fg: '#3730a3', icon: 'auto_awesome' },
    general: { bg: '#f5f5f7', fg: '#374151', icon: 'chat' },
    other:   { bg: '#f5f5f7', fg: '#374151', icon: 'help_outline' },
};

function StatCard({ label, value, accent }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e5e5e7',
            borderRadius: '14px',
            padding: '18px 20px',
            minWidth: 0,
        }}>
            <div style={{ fontSize: '11px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: accent || '#000', marginTop: '4px', letterSpacing: '-0.01em' }}>
                {value}
            </div>
        </div>
    );
}

function StatusPill({ status }) {
    const c = STATUS_COLORS[status] || { bg: '#f3f4f6', fg: '#374151' };
    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: c.bg,
            color: c.fg,
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
            letterSpacing: '0.02em',
        }}>{status}</span>
    );
}

function CategoryPill({ category }) {
    const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: c.bg,
            color: c.fg,
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{c.icon}</span>
            {category}
        </span>
    );
}

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function Feedback({ feedbacks, stats, filters }) {
    const [expanded, setExpanded] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [paginating, setPaginating] = useState(false);

    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [searchInput, setSearchInput] = useState(filters?.q || '');

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    const applyFilters = (overrides = {}) => {
        const next = {
            status: overrides.status ?? statusFilter,
            category: overrides.category ?? categoryFilter,
            q: overrides.q ?? searchInput,
        };
        const params = {};
        if (next.status) params.status = next.status;
        if (next.category) params.category = next.category;
        if (next.q) params.q = next.q;
        router.get(route('admin.feedback'), params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handlePaginate = (url) => {
        setPaginating(true);
        router.get(url, {}, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setPaginating(false),
        });
    };

    const updateStatus = async (id, nextStatus) => {
        setSavingId(id);
        try {
            await axios.post(route('admin.feedback.status', id), { status: nextStatus });
            router.reload({ only: ['feedbacks', 'stats'], preserveScroll: true });
            Toast.fire({ icon: 'success', title: `Marked as ${nextStatus}` });
        } catch (err) {
            Toast.fire({ icon: 'error', title: 'Could not update status' });
        } finally {
            setSavingId(null);
        }
    };

    const inputBase = {
        height: '38px',
        padding: '0 14px',
        borderRadius: '9999px',
        border: '1px solid #e5e5e7',
        fontSize: '13px',
        background: '#fff',
        color: '#000',
        outline: 'none',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feedback — Admin" />

            <section style={{ paddingTop: '96px', paddingBottom: '80px', background: '#fafafa', minHeight: '80vh' }}>
                <Container>
                    <Row className="g-4">
                        <Col lg={3} className="d-none d-lg-block">
                            <AdminSideNav />
                        </Col>

                        <Col lg={9}>
                            {/* Header */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    fontSize: '11px', fontWeight: 600,
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    color: '#86868b', marginBottom: '6px',
                                }}>
                                    Subscriber Feedback
                                </div>
                                <h2 style={{
                                    fontSize: 'clamp(22px, 4vw, 28px)',
                                    fontWeight: 600, color: '#000',
                                    letterSpacing: '-0.02em', margin: 0,
                                }}>
                                    Inbox
                                </h2>
                            </div>

                            {/* Stats */}
                            <Row className="g-3 mb-4">
                                <Col xs={6} md={3}><StatCard label="Total" value={stats?.total ?? 0} /></Col>
                                <Col xs={6} md={3}><StatCard label="New" value={stats?.new ?? 0} accent="#92400e" /></Col>
                                <Col xs={6} md={3}><StatCard label="Reviewed" value={stats?.reviewed ?? 0} accent="#3730a3" /></Col>
                                <Col xs={6} md={3}><StatCard label="Resolved" value={stats?.resolved ?? 0} accent="#166534" /></Col>
                            </Row>

                            {/* Filters */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #e5e5e7',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                marginBottom: '20px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                alignItems: 'center',
                            }}>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                                    style={{ ...inputBase, cursor: 'pointer', minWidth: '140px' }}
                                >
                                    {STATUS_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); applyFilters({ category: e.target.value }); }}
                                    style={{ ...inputBase, cursor: 'pointer', minWidth: '140px' }}
                                >
                                    {CATEGORY_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>

                                <form
                                    onSubmit={(e) => { e.preventDefault(); applyFilters({ q: searchInput }); }}
                                    style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '8px' }}
                                >
                                    <input
                                        type="search"
                                        placeholder="Search subject or message..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{ ...inputBase, flex: 1 }}
                                    />
                                </form>
                            </div>

                            {/* Feedback list */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #e5e5e7',
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}>
                                {feedbacks?.data?.length > 0 ? (
                                    feedbacks.data.map((f, idx) => {
                                        const isOpen = expanded === f.id;
                                        return (
                                            <div
                                                key={f.id}
                                                style={{
                                                    borderTop: idx === 0 ? 'none' : '1px solid #f0f0f0',
                                                    padding: '18px 22px',
                                                    transition: 'background 0.15s ease',
                                                    background: isOpen ? '#fafafa' : '#fff',
                                                }}
                                            >
                                                <div
                                                    onClick={() => setExpanded(isOpen ? null : f.id)}
                                                    style={{ cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}
                                                >
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                            <CategoryPill category={f.category} />
                                                            <StatusPill status={f.status} />
                                                            <span style={{ fontSize: '12px', color: '#86868b' }}>
                                                                {formatDate(f.created_at)}
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            fontSize: '14px', fontWeight: 600, color: '#000',
                                                            marginBottom: '4px',
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        }}>
                                                            {f.subject}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#86868b' }}>
                                                            {f.user ? `${f.user.name} · ${f.user.email}` : 'Unknown user'}
                                                        </div>
                                                    </div>

                                                    <span className="material-symbols-outlined" style={{
                                                        fontSize: '20px', color: '#86868b',
                                                        transition: 'transform 0.2s ease',
                                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                                        flexShrink: 0,
                                                    }}>
                                                        expand_more
                                                    </span>
                                                </div>

                                                {isOpen && (
                                                    <div style={{
                                                        marginTop: '14px',
                                                        paddingTop: '14px',
                                                        borderTop: '1px solid #f0f0f0',
                                                    }}>
                                                        <div style={{
                                                            background: '#fff',
                                                            border: '1px solid #f0f0f0',
                                                            borderRadius: '12px',
                                                            padding: '14px 16px',
                                                            fontSize: '13px',
                                                            color: '#1f2937',
                                                            lineHeight: 1.55,
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word',
                                                        }}>
                                                            {f.message}
                                                        </div>

                                                        {f.reviewer && (
                                                            <div style={{
                                                                fontSize: '12px',
                                                                color: '#86868b',
                                                                marginTop: '10px',
                                                            }}>
                                                                Last touched by <strong style={{ color: '#000' }}>{f.reviewer.name}</strong> · {formatDate(f.reviewed_at)}
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                                                            {['new', 'reviewed', 'resolved'].filter(s => s !== f.status).map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => updateStatus(f.id, s)}
                                                                    disabled={savingId === f.id}
                                                                    style={{
                                                                        padding: '7px 16px',
                                                                        borderRadius: '9999px',
                                                                        fontSize: '12px',
                                                                        fontWeight: 500,
                                                                        background: s === 'resolved' ? '#000' : '#f5f5f7',
                                                                        color: s === 'resolved' ? '#fff' : '#000',
                                                                        border: 'none',
                                                                        cursor: savingId === f.id ? 'wait' : 'pointer',
                                                                        opacity: savingId === f.id ? 0.6 : 1,
                                                                        textTransform: 'capitalize',
                                                                        transition: 'all 0.15s ease',
                                                                    }}
                                                                >
                                                                    Mark {s}
                                                                </button>
                                                            ))}
                                                            {f.user?.email && (
                                                                <a
                                                                    href={`mailto:${f.user.email}?subject=Re: ${encodeURIComponent(f.subject)}`}
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                        padding: '7px 16px',
                                                                        borderRadius: '9999px',
                                                                        fontSize: '12px',
                                                                        fontWeight: 500,
                                                                        background: 'transparent',
                                                                        color: '#000',
                                                                        border: '1px solid #e5e5e7',
                                                                        textDecoration: 'none',
                                                                        transition: 'all 0.15s ease',
                                                                    }}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>
                                                                    Reply by email
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: '60px 28px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '16px',
                                            background: '#f5f5f7', margin: '0 auto 16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86868b' }}>inbox</span>
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                                            No feedback yet
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#86868b', margin: '0 auto', maxWidth: '320px', lineHeight: 1.5 }}>
                                            New submissions from subscribers will appear here.
                                        </p>
                                    </div>
                                )}

                                {feedbacks?.last_page > 1 && (
                                    <div style={{ padding: '16px 22px', borderTop: '1px solid #f0f0f0' }}>
                                        <DefaultPagination
                                            pagination={feedbacks.links}
                                            triggerPagination={handlePaginate}
                                            isLoading={paginating}
                                        />
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </AuthenticatedLayout>
    );
}
