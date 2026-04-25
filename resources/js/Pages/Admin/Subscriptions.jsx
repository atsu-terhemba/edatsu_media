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

export default function Subscriptions({ stats, transactions, subscriptions, proUsers, currentTab, statusFilter, availablePlans }) {
    const [tab, setTab] = useState(currentTab || 'transactions');
    const [showCreateModal, setShowCreateModal] = useState(false);

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
                            <div style={{
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '16px',
                                flexWrap: 'wrap',
                            }}>
                                <div>
                                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 28px)', fontWeight: 600, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
                                        Subscriptions & Payments
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#86868b', marginTop: '6px', marginBottom: 0 }}>
                                        Live overview of every transaction and active Pro subscription.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 18px',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: '#000',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1f2937'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                                    Create subscription
                                </button>
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

            {showCreateModal && (
                <CreateSubscriptionModal
                    plans={availablePlans || []}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        router.reload({ only: ['subscriptions', 'transactions', 'stats', 'proUsers'] });
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}

function CreateSubscriptionModal({ plans, onClose, onCreated }) {
    const [step, setStep] = useState('user'); // 'user' | 'plan'
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [planId, setPlanId] = useState(plans[0]?.id || null);
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [currency, setCurrency] = useState('NGN');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank transfer');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Debounced user search.
    const runSearch = async (q) => {
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const { data } = await axios.get('/admin-subscriptions/users/search', { params: { q } });
            setResults(data.users || []);
        } catch (e) {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const onQueryChange = (v) => {
        setQuery(v);
        clearTimeout(window.__userSearchTimer);
        window.__userSearchTimer = setTimeout(() => runSearch(v), 250);
    };

    // Auto-fill amount when plan/period/currency changes — admin can override.
    const selectedPlan = plans.find((p) => p.id === planId) || null;
    const suggestedAmount = selectedPlan
        ? selectedPlan.prices[billingPeriod]?.[currency] ?? 0
        : 0;

    const fillSuggested = () => setAmount(String(suggestedAmount));

    const submit = async () => {
        setError('');
        if (!selectedUser) { setError('Pick a user first.'); return; }
        if (!planId) { setError('Pick a plan.'); return; }
        if (!amount || Number(amount) <= 0) { setError('Enter the paid amount.'); return; }
        if (note.trim().length < 6) { setError('Note must be at least 6 characters — cite proof of payment.'); return; }

        setSubmitting(true);
        try {
            const { data } = await axios.post('/admin-subscriptions/manual-create', {
                user_id: selectedUser.id,
                plan_id: planId,
                billing_period: billingPeriod,
                currency,
                amount: Number(amount),
                payment_method: paymentMethod,
                note: note.trim(),
            });
            await Swal.fire({
                icon: 'success',
                title: 'Subscription created',
                text: data.message,
                confirmButtonColor: '#000',
            });
            onCreated?.();
        } catch (err) {
            const msg = err?.response?.data?.message
                || (err?.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' '))
                || 'Could not create subscription. Please try again.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: '20px', padding: '28px',
                    width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>
                        Create manual subscription
                    </h3>
                    <button onClick={onClose} aria-label="Close" style={{
                        background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#86868b',
                    }}>×</button>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', marginBottom: '20px' }}>
                    For payments that landed off-platform (cash, off-app transfer). Marks the user Pro immediately.
                </p>

                {/* Step 1: pick user */}
                <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>User</label>
                    {selectedUser ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', border: '1px solid #e5e5e7', borderRadius: '10px',
                        }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{selectedUser.name}</div>
                                <div style={{ fontSize: '12px', color: '#86868b' }}>{selectedUser.email}{selectedUser.is_pro ? ' · already Pro' : ''}</div>
                            </div>
                            <button
                                onClick={() => { setSelectedUser(null); setQuery(''); setResults([]); }}
                                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => onQueryChange(e.target.value)}
                                placeholder="Search by name or email"
                                style={inputStyle}
                            />
                            {searching && <div style={{ fontSize: '12px', color: '#86868b', marginTop: '6px' }}>Searching…</div>}
                            {!searching && results.length > 0 && (
                                <div style={{ marginTop: '6px', border: '1px solid #e5e5e7', borderRadius: '10px', overflow: 'hidden' }}>
                                    {results.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => { setSelectedUser(u); setResults([]); setQuery(''); }}
                                            style={{
                                                display: 'block', width: '100%', textAlign: 'left',
                                                padding: '10px 14px', border: 'none', background: '#fff',
                                                cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                        >
                                            <div style={{ fontSize: '13px', fontWeight: 500, color: '#000' }}>{u.name}</div>
                                            <div style={{ fontSize: '11px', color: '#86868b' }}>
                                                {u.email}{u.is_pro ? ' · already Pro' : ''}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {!searching && query.length >= 2 && results.length === 0 && (
                                <div style={{ fontSize: '12px', color: '#86868b', marginTop: '6px' }}>No matches.</div>
                            )}
                        </>
                    )}
                </div>

                {/* Plan + period + currency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                        <label style={labelStyle}>Plan</label>
                        <select value={planId || ''} onChange={(e) => setPlanId(Number(e.target.value))} style={inputStyle}>
                            {plans.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Billing period</label>
                        <select value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value)} style={inputStyle}>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                        <label style={labelStyle}>Currency</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
                            <option value="NGN">NGN (₦)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>
                            Amount paid
                            {suggestedAmount > 0 && (
                                <button
                                    type="button"
                                    onClick={fillSuggested}
                                    style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '11px', cursor: 'pointer', marginLeft: '6px' }}
                                >
                                    use {currency === 'USD' ? '$' : '₦'}{suggestedAmount.toLocaleString()}
                                </button>
                            )}
                        </label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={String(suggestedAmount || '')}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Payment method (label)</label>
                    <input
                        type="text"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        placeholder="Bank transfer, USDT, Cash, etc."
                        maxLength={50}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Proof / note (required)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="e.g. GTBank credit alert ref TRF/240425/9001 received 14:32 WAT"
                        style={{ ...inputStyle, resize: 'vertical' }}
                    />
                    <div style={{ fontSize: '11px', color: '#86868b', marginTop: '4px' }}>
                        Cite a bank reference, USDT tx hash, or screenshot link. Logged for audit.
                    </div>
                </div>

                {error && (
                    <div style={{
                        padding: '10px 12px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        color: '#991b1b',
                        fontSize: '13px',
                        marginBottom: '14px',
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            padding: '10px 18px', borderRadius: '9999px',
                            border: '1px solid #e5e5e7', background: '#fff',
                            fontSize: '13px', fontWeight: 500, color: '#000',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={submitting || !selectedUser}
                        style={{
                            padding: '10px 22px', borderRadius: '9999px',
                            border: 'none',
                            background: submitting || !selectedUser ? '#9ca3af' : '#16a34a',
                            color: '#fff',
                            fontSize: '13px', fontWeight: 600,
                            cursor: submitting || !selectedUser ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {submitting ? 'Creating…' : 'Create & activate'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e5e7',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#000',
    background: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
};

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
