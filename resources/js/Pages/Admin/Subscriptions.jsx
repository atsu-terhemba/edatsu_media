import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TABS = [
    { id: 'transactions', label: 'Payments' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'pro_users', label: 'Active Pro Users' },
];

const STATUS_COLORS = {
    successful: { bg: '#dcfce7', fg: '#166534' },
    active:     { bg: '#dcfce7', fg: '#166534' },
    pending:    { bg: '#fef3c7', fg: '#92400e' },
    failed:     { bg: '#fee2e2', fg: '#991b1b' },
    cancelled:  { bg: '#f3f4f6', fg: '#374151' },
    expired:    { bg: '#f3f4f6', fg: '#374151' },
    refunded:   { bg: '#e0e7ff', fg: '#3730a3' },
};

function StatusPill({ status }) {
    const c = STATUS_COLORS[status] || { bg: '#f3f4f6', fg: '#374151' };
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '9999px',
            background: c.bg,
            color: c.fg,
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'capitalize',
        }}>{status}</span>
    );
}

function StatCard({ label, value, sub }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e5e5e7',
            borderRadius: '14px',
            padding: '20px 22px',
            minWidth: 0,
        }}>
            <div style={{ fontSize: '12px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#000', marginTop: '6px', wordBreak: 'break-word' }}>{value}</div>
            {sub && <div style={{ fontSize: '12px', color: '#86868b', marginTop: '4px' }}>{sub}</div>}
        </div>
    );
}

function fmtDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return iso;
    }
}

function fmtMoney(amount, currency) {
    if (amount == null) return '—';
    const symbol = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : '';
    return `${symbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Pagination({ paginator, pageParam }) {
    if (!paginator || paginator.last_page <= 1) return null;
    return (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', padding: '16px 0', flexWrap: 'wrap' }}>
            {paginator.links.map((l, i) => (
                <button
                    key={i}
                    disabled={!l.url}
                    onClick={() => l.url && router.visit(l.url, { preserveScroll: true, preserveState: true })}
                    dangerouslySetInnerHTML={{ __html: l.label }}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid ' + (l.active ? '#000' : '#e5e5e7'),
                        background: l.active ? '#000' : '#fff',
                        color: l.active ? '#fff' : (l.url ? '#000' : '#9ca3af'),
                        fontSize: '13px',
                        cursor: l.url ? 'pointer' : 'not-allowed',
                    }}
                />
            ))}
        </div>
    );
}

export default function Subscriptions({ stats, transactions, subscriptions, proUsers, currentTab, statusFilter }) {
    const [tab, setTab] = useState(currentTab || 'transactions');

    const switchTab = (next) => {
        setTab(next);
        router.visit(route('admin.subscriptions') + '?tab=' + next, { preserveScroll: true });
    };

    const filterStatus = (status) => {
        const params = new URLSearchParams();
        params.set('tab', tab);
        if (status) params.set('status', status);
        router.visit(route('admin.subscriptions') + '?' + params.toString(), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Subscriptions & Payments" />
            <Container fluid>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ fontSize: 'clamp(24px, 4vw, 28px)', fontWeight: 600, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                    Subscriptions & Payments
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', marginTop: '6px' }}>
                                    Live overview of every transaction and active Pro subscription.
                                </p>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                                <StatCard label="Active Pro users" value={stats.total_pro_users} sub={`${stats.active_subscriptions} active subs`} />
                                <StatCard label="Pending payments" value={stats.pending_payments} />
                                <StatCard label="Successful payments" value={stats.successful_payments} />
                                <StatCard label="Revenue (USD)" value={fmtMoney(stats.revenue_usd, 'USD')} />
                                <StatCard label="Revenue (NGN)" value={fmtMoney(stats.revenue_ngn, 'NGN')} />
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e5e5e7', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {TABS.map(t => (
                                    <button key={t.id} onClick={() => switchTab(t.id)}
                                        style={{
                                            padding: '10px 16px',
                                            border: 'none',
                                            background: 'transparent',
                                            borderBottom: tab === t.id ? '2px solid #000' : '2px solid transparent',
                                            color: tab === t.id ? '#000' : '#86868b',
                                            fontSize: '14px',
                                            fontWeight: tab === t.id ? 600 : 500,
                                            cursor: 'pointer',
                                            marginBottom: '-1px',
                                        }}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Status filter (transactions + subscriptions only) */}
                            {(tab === 'transactions' || tab === 'subscriptions') && (
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    {[null, 'pending', 'successful', 'active', 'failed', 'cancelled', 'expired', 'refunded'].map((s, i) => {
                                        // Match status options to the active tab
                                        if (tab === 'transactions' && ['active', 'expired'].includes(s)) return null;
                                        if (tab === 'subscriptions' && ['successful', 'failed', 'refunded'].includes(s)) return null;
                                        const active = (statusFilter || null) === s;
                                        return (
                                            <button key={i} onClick={() => filterStatus(s)} style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                border: '1px solid ' + (active ? '#000' : '#e5e5e7'),
                                                background: active ? '#000' : '#fff',
                                                color: active ? '#fff' : '#374151',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize',
                                            }}>{s || 'All'}</button>
                                        );
                                    })}
                                </div>
                            )}

                            <div style={{ background: '#fff', border: '1px solid #e5e5e7', borderRadius: '14px', overflow: 'hidden' }}>
                                {tab === 'transactions' && (
                                    <TransactionsTable transactions={transactions} />
                                )}
                                {tab === 'subscriptions' && (
                                    <SubscriptionsTable subscriptions={subscriptions} />
                                )}
                                {tab === 'pro_users' && (
                                    <ProUsersTable users={proUsers} />
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}

function TableHead({ cols }) {
    return (
        <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e7' }}>
                {cols.map(c => (
                    <th key={c} style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                    }}>{c}</th>
                ))}
            </tr>
        </thead>
    );
}

const cellStyle = { padding: '12px 16px', fontSize: '13px', color: '#1f2937', verticalAlign: 'top', borderBottom: '1px solid #f3f4f6' };

function TransactionsTable({ transactions }) {
    if (!transactions?.data?.length) return <Empty label="No transactions" />;
    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <TableHead cols={['Reference', 'User', 'Amount', 'Provider', 'Method', 'Status', 'Created']} />
                    <tbody>
                        {transactions.data.map(t => (
                            <tr key={t.id}>
                                <td style={{ ...cellStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: '11px' }}>{t.reference}</td>
                                <td style={cellStyle}>
                                    <div style={{ fontWeight: 500 }}>{t.user?.name ?? '—'}</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{t.user?.email ?? ''}</div>
                                </td>
                                <td style={cellStyle}>{fmtMoney(t.amount, t.currency)}</td>
                                <td style={cellStyle}>{t.provider ?? '—'}</td>
                                <td style={cellStyle}>{t.method ?? '—'}</td>
                                <td style={cellStyle}><StatusPill status={t.status} /></td>
                                <td style={cellStyle}>{fmtDate(t.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination paginator={transactions} pageParam="tx_page" />
        </>
    );
}

function SubscriptionsTable({ subscriptions }) {
    if (!subscriptions?.data?.length) return <Empty label="No subscriptions" />;

    const activatePending = async (s) => {
        // Two-step prompt: first confirm the user/amount, then capture the
        // mandatory note. Splitting it makes accidental activations harder
        // and gives ops a clear "why" stamp on the audit row.
        const confirm = await Swal.fire({
            title: 'Activate this subscription?',
            html: `
                <div style="text-align:left;font-size:13px;line-height:1.6;">
                    <div><strong>${s.user?.name ?? '—'}</strong> &middot; ${s.user?.email ?? ''}</div>
                    <div>${s.plan?.name ?? '—'} &middot; ${s.billing_period} &middot; ${fmtMoney(s.amount, s.currency)}</div>
                    <div style="margin-top:8px;color:#86868b;">
                        Use this when payment landed but the webhook didn't fire.
                        It marks the linked transaction as successful and records you as the activator.
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#16a34a',
        });
        if (!confirm.isConfirmed) return;

        const note = await Swal.fire({
            title: 'Why are you activating this manually?',
            input: 'textarea',
            inputLabel: 'Required — at least 6 chars. Cite proof of payment (bank ref, USDT tx hash, screenshot link).',
            inputPlaceholder: 'e.g. GTBank credit alert ref TRF/240425/9001 received 14:32 WAT',
            inputValidator: (v) => (!v || v.trim().length < 6) && 'Please write a short reason (min 6 chars).',
            showCancelButton: true,
            confirmButtonText: 'Activate',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#16a34a',
        });
        if (!note.isConfirmed) return;

        try {
            const { data } = await axios.post(`/admin-subscriptions/${s.id}/activate`, {
                note: note.value.trim(),
            });
            await Swal.fire({
                icon: 'success',
                title: 'Activated',
                text: data.message,
                confirmButtonColor: '#000',
            });
            router.reload({ only: ['subscriptions', 'transactions', 'stats', 'proUsers'] });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Activation failed. Please try again.';
            Swal.fire({ icon: 'error', title: 'Could not activate', text: msg, confirmButtonColor: '#000' });
        }
    };

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
                    <TableHead cols={['User', 'Plan', 'Period', 'Amount', 'Status', 'Period ends', 'Provider', 'Action']} />
                    <tbody>
                        {subscriptions.data.map(s => (
                            <tr key={s.id}>
                                <td style={cellStyle}>
                                    <div style={{ fontWeight: 500 }}>{s.user?.name ?? '—'}</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{s.user?.email ?? ''}</div>
                                </td>
                                <td style={cellStyle}>{s.plan?.name ?? '—'}</td>
                                <td style={cellStyle}>{s.billing_period}</td>
                                <td style={cellStyle}>{fmtMoney(s.amount, s.currency)}</td>
                                <td style={cellStyle}><StatusPill status={s.status} /></td>
                                <td style={cellStyle}>{fmtDate(s.ends_at)}</td>
                                <td style={cellStyle}>{s.provider ?? '—'}</td>
                                <td style={cellStyle}>
                                    {s.status === 'pending' ? (
                                        <button
                                            onClick={() => activatePending(s)}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '9999px',
                                                border: '1px solid #16a34a',
                                                background: '#fff',
                                                color: '#16a34a',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#dcfce7'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                        >
                                            Activate
                                        </button>
                                    ) : (
                                        <span style={{ color: '#b0b0b5', fontSize: '12px' }}>—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination paginator={subscriptions} pageParam="sub_page" />
        </>
    );
}

function ProUsersTable({ users }) {
    if (!users?.data?.length) return <Empty label="No active Pro users yet" />;
    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <TableHead cols={['User', 'Email', 'Joined', 'Pro until']} />
                    <tbody>
                        {users.data.map(u => (
                            <tr key={u.id}>
                                <td style={{ ...cellStyle, fontWeight: 500 }}>{u.name}</td>
                                <td style={cellStyle}>{u.email}</td>
                                <td style={cellStyle}>{fmtDate(u.joined_at)}</td>
                                <td style={cellStyle}>{fmtDate(u.current_period_ends_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination paginator={users} pageParam="user_page" />
        </>
    );
}

function Empty({ label }) {
    return (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            {label}
        </div>
    );
}
