import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import DefaultPagination from '@/Components/DefaultPagination';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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

function TypePill({ type }) {
    if (!type) {
        return (
            <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#f5f5f7',
                color: '#86868b',
                fontSize: '11px',
                fontWeight: 600,
            }}>—</span>
        );
    }
    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: '#fff7ed',
            color: '#9a3412',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
            letterSpacing: '0.02em',
        }}>{type}</span>
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

export default function MailSubscribers({ subscribers, stats, types, filters }) {
    const [paginating, setPaginating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [typeFilter, setTypeFilter] = useState(filters?.type || '');
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
            type: overrides.type ?? typeFilter,
            q: overrides.q ?? searchInput,
        };
        const params = {};
        if (next.type) params.type = next.type;
        if (next.q) params.q = next.q;
        router.get(route('admin.mail_subscribers'), params, {
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

    const copyEmails = async () => {
        const emails = (subscribers?.data || []).map(s => s.email).join(', ');
        if (!emails) {
            Toast.fire({ icon: 'info', title: 'No emails on this page' });
            return;
        }
        try {
            await navigator.clipboard.writeText(emails);
            Toast.fire({ icon: 'success', title: `Copied ${subscribers.data.length} emails` });
        } catch {
            Toast.fire({ icon: 'error', title: 'Copy failed' });
        }
    };

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (typeFilter) params.set('type', typeFilter);
        if (searchInput) params.set('q', searchInput);
        const qs = params.toString();
        window.location.href = route('admin.mail_subscribers.export') + (qs ? `?${qs}` : '');
    };

    const removeSubscriber = async (sub) => {
        const result = await Swal.fire({
            title: 'Remove subscriber?',
            html: `<div style="font-size:13px;color:#6b7280">${sub.email}</div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Remove',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;

        setDeletingId(sub.id);
        try {
            await axios.delete(route('admin.mail_subscribers.destroy', sub.id));
            router.reload({ only: ['subscribers', 'stats'], preserveScroll: true });
            Toast.fire({ icon: 'success', title: 'Removed' });
        } catch {
            Toast.fire({ icon: 'error', title: 'Could not remove' });
        } finally {
            setDeletingId(null);
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

    const btnBase = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '38px',
        padding: '0 16px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 500,
        border: '1px solid #e5e5e7',
        background: '#fff',
        color: '#000',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mailing List — Admin" />

            <section style={{ paddingTop: '96px', paddingBottom: '80px', background: '#fafafa', minHeight: '80vh' }}>
                <Container>
                    <Row className="g-4">
                        <Col lg={3} className="d-none d-lg-block">
                            <AdminSideNav />
                        </Col>

                        <Col lg={9}>
                            {/* Header */}
                            <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
                                <div>
                                    <div style={{
                                        fontSize: '11px', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                        color: '#86868b', marginBottom: '6px',
                                    }}>
                                        Newsletter
                                    </div>
                                    <h2 style={{
                                        fontSize: 'clamp(22px, 4vw, 28px)',
                                        fontWeight: 600, color: '#000',
                                        letterSpacing: '-0.02em', margin: 0,
                                    }}>
                                        Mailing list subscribers
                                    </h2>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button onClick={copyEmails} style={btnBase}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                                        Copy page emails
                                    </button>
                                    <button onClick={exportCsv} style={{ ...btnBase, background: '#000', color: '#fff', borderColor: '#000' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <Row className="g-3 mb-4">
                                <Col xs={12} md={4}><StatCard label="Total subscribers" value={stats?.total ?? 0} /></Col>
                                <Col xs={6} md={4}><StatCard label="Last 30 days" value={stats?.last_30_days ?? 0} accent="#9a3412" /></Col>
                                <Col xs={6} md={4}><StatCard label="This week" value={stats?.this_week ?? 0} accent="#166534" /></Col>
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
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); applyFilters({ type: e.target.value }); }}
                                    style={{ ...inputBase, cursor: 'pointer', minWidth: '160px' }}
                                >
                                    <option value="">All subscription types</option>
                                    {(types || []).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>

                                <form
                                    onSubmit={(e) => { e.preventDefault(); applyFilters({ q: searchInput }); }}
                                    style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '8px' }}
                                >
                                    <input
                                        type="search"
                                        placeholder="Search by name or email..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{ ...inputBase, flex: 1 }}
                                    />
                                </form>
                            </div>

                            {/* Subscribers table */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #e5e5e7',
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}>
                                {subscribers?.data?.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead>
                                                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                                                    <th style={thStyle}>Name</th>
                                                    <th style={thStyle}>Email</th>
                                                    <th style={thStyle}>Type</th>
                                                    <th style={thStyle}>Subscribed</th>
                                                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subscribers.data.map((s, idx) => (
                                                    <tr key={s.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid #f5f5f7' }}>
                                                        <td style={tdStyle}>
                                                            <div style={{ fontWeight: 500, color: '#000' }}>
                                                                {(s.first_name || '') + ' ' + (s.last_name || '')}
                                                            </div>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <a href={`mailto:${s.email}`} style={{ color: '#000', textDecoration: 'none' }}>
                                                                {s.email}
                                                            </a>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <TypePill type={s.subscription_type} />
                                                        </td>
                                                        <td style={{ ...tdStyle, color: '#86868b' }}>
                                                            {formatDate(s.created_at)}
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                            <button
                                                                onClick={() => removeSubscriber(s)}
                                                                disabled={deletingId === s.id}
                                                                title="Remove subscriber"
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: '1px solid #e5e5e7',
                                                                    borderRadius: '9999px',
                                                                    padding: '6px 10px',
                                                                    cursor: deletingId === s.id ? 'wait' : 'pointer',
                                                                    color: '#ef4444',
                                                                    fontSize: '12px',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    opacity: deletingId === s.id ? 0.6 : 1,
                                                                }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ padding: '60px 28px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '16px',
                                            background: '#f5f5f7', margin: '0 auto 16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86868b' }}>mail</span>
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                                            No subscribers yet
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#86868b', margin: '0 auto', maxWidth: '320px', lineHeight: 1.5 }}>
                                            People who sign up to the newsletter will appear here.
                                        </p>
                                    </div>
                                )}

                                {subscribers?.last_page > 1 && (
                                    <div style={{ padding: '16px 22px', borderTop: '1px solid #f0f0f0' }}>
                                        <DefaultPagination
                                            pagination={subscribers.links}
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

const thStyle = {
    textAlign: 'left',
    padding: '12px 18px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
};

const tdStyle = {
    padding: '14px 18px',
    verticalAlign: 'middle',
    fontSize: '13px',
};
