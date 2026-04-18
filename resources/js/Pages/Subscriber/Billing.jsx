import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import SubscriberSideNav from './Components/SideNav';

function SectionEyebrow({ text }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <span style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#86868b',
            }}>
                {text}
            </span>
        </div>
    );
}

export default function Billing() {
    const { activeSubscription, transactions, subscriptionHistory, currentPlan, auth } = usePage().props;
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const handleCancelSubscription = async () => {
        setCancelling(true);
        try {
            const response = await fetch(route('subscription.cancel'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message || 'Could not cancel subscription.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            setCancelling(false);
            setShowCancelConfirm(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const formatCurrency = (amount, currency) => {
        if (currency === 'NGN') return `\u20A6${Number(amount).toLocaleString()}`;
        return `$${Number(amount).toFixed(2)}`;
    };

    const statusBadge = (status) => {
        const colors = {
            active: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
            successful: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
            pending: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
            cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
            expired: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
            failed: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
            refunded: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
        };
        const c = colors[status] || colors.pending;
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: c.bg,
                color: c.color,
            }}>
                {status}
            </span>
        );
    };

    const renewalInfo = useMemo(() => {
        if (!activeSubscription?.ends_at) return null;
        const endsAt = new Date(activeSubscription.ends_at);
        const now = new Date();
        const ms = endsAt.getTime() - now.getTime();
        const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
        return { days: Math.max(days, 0), endsAt };
    }, [activeSubscription?.ends_at]);

    return (
        <AuthenticatedLayout>
            <Head title="Billing & Subscription" />

            <style>{`
                .billing-section { padding-top: 96px; padding-bottom: 80px; min-height: 80vh; background: #fafafa; }
                .billing-wrap { max-width: 100%; }
                .billing-card { border-radius: 20px; }
                .billing-plan-card { padding: 32px; border-radius: 20px; }
                .billing-plan-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
                .billing-plan-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
                .billing-plan-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .billing-meta-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 20px; padding-top: 20px; }
                .billing-meta-item .billing-meta-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
                .billing-meta-item .billing-meta-value { font-size: 14px; font-weight: 600; }
                .billing-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px; }
                .billing-stat { background: #fff; border: 1px solid #e5e5e7; border-radius: 16px; padding: 16px 18px; }
                .billing-stat-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #86868b; margin-bottom: 6px; }
                .billing-stat-value { font-size: 18px; font-weight: 700; color: #000; letter-spacing: -0.01em; }
                .billing-section-head { padding: 22px 28px 14px; border-bottom: 1px solid #f0f0f0; }
                .billing-section-eyebrow { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #86868b; margin-bottom: 4px; }
                .billing-section-title { font-size: 16px; font-weight: 600; color: #000; }
                .billing-txn-row { padding: 16px 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; transition: background 0.15s ease; }
                .billing-txn-row + .billing-txn-row { border-top: 1px solid #f5f5f7; }
                .billing-txn-row:hover { background: #fafafa; }
                .billing-txn-main { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
                .billing-txn-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
                .billing-help { background: #fff; border: 1px solid #e5e5e7; border-radius: 20px; padding: 20px 24px; margin-top: 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

                @media (max-width: 767px) {
                    .billing-section { padding-top: 80px; padding-bottom: 48px; }
                    .billing-plan-card { padding: 22px 20px; border-radius: 18px; }
                    .billing-plan-title { font-size: 22px; }
                    .billing-plan-actions { width: 100%; }
                    .billing-plan-actions > a,
                    .billing-plan-actions > button { flex: 1 1 auto; justify-content: center; }
                    .billing-meta-grid { grid-template-columns: 1fr; gap: 10px; margin-top: 16px; padding-top: 16px; }
                    .billing-stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
                    .billing-stats-grid .billing-stat:nth-child(3) { grid-column: span 2; }
                    .billing-stat { padding: 14px 16px; border-radius: 14px; }
                    .billing-stat-value { font-size: 16px; }
                    .billing-section-head { padding: 18px 20px 12px; }
                    .billing-txn-row { padding: 14px 20px; gap: 10px; }
                    .billing-txn-main { width: 100%; }
                    .billing-txn-right { width: 100%; justify-content: space-between; padding-left: 50px; }
                    .billing-help { padding: 18px 20px; border-radius: 16px; }
                    .billing-wrap { max-width: 100%; }
                    .billing-card { border-radius: 18px; }
                }
            `}</style>

            <section className="billing-section">
                <Container>
                    <Row>
                        <Col lg={3} className="d-none d-lg-block">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <SubscriberSideNav />
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="billing-wrap">
                                <SectionEyebrow text="Billing & Subscription" />
                                <h2 style={{
                                    fontSize: 'clamp(22px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '8px',
                                }}>
                                    Manage your plan
                                </h2>
                                {auth?.user?.email && (
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 28px' }}>
                                        Billing email: <strong style={{ color: '#000', fontWeight: 500 }}>{auth.user.email}</strong>
                                    </p>
                                )}

                                {/* Current Plan Card */}
                                <div className="billing-plan-card" style={{
                                    background: activeSubscription ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)' : '#fff',
                                    border: activeSubscription ? 'none' : '1px solid #e5e5e7',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    marginBottom: '28px',
                                }}>
                                    {activeSubscription && (
                                        <div style={{
                                            position: 'absolute', top: '-60px', right: '-40px',
                                            width: '200px', height: '200px',
                                            background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
                                            pointerEvents: 'none',
                                        }} />
                                    )}

                                    <div className="billing-plan-head" style={{ position: 'relative' }}>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{
                                                fontSize: '11px', fontWeight: 600,
                                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                                color: activeSubscription ? 'rgba(255,255,255,0.4)' : '#86868b',
                                                marginBottom: '8px',
                                            }}>
                                                Current Plan
                                            </div>
                                            <div className="billing-plan-title" style={{
                                                color: activeSubscription ? '#fff' : '#000',
                                            }}>
                                                {currentPlan}
                                                {activeSubscription && (
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: 600,
                                                        background: 'rgba(22,163,74,0.15)',
                                                        color: '#4ade80',
                                                        padding: '4px 12px',
                                                        borderRadius: '9999px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                    }}>
                                                        {activeSubscription.cancelled_at ? 'Ending' : 'Active'}
                                                    </span>
                                                )}
                                            </div>

                                            {activeSubscription ? (
                                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                                    <div style={{ fontWeight: 500, color: '#fff' }}>
                                                        {formatCurrency(activeSubscription.amount, activeSubscription.currency)}
                                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
                                                            {' '}/ {activeSubscription.billing_period === 'yearly' ? 'year' : 'month'}
                                                        </span>
                                                    </div>
                                                    {activeSubscription.cancelled_at && (
                                                        <div style={{ color: '#f97316', marginTop: '4px', fontWeight: 500 }}>
                                                            Cancelled — access until {formatDate(activeSubscription.ends_at)}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '13px', color: '#86868b', margin: 0, lineHeight: 1.6 }}>
                                                    You're on the free plan. Upgrade to Pro for unlimited features.
                                                </p>
                                            )}
                                        </div>

                                        <div className="billing-plan-actions">
                                            {!activeSubscription && (
                                                <Link
                                                    href={route('subscription')}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '10px 24px', borderRadius: '9999px',
                                                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                                        color: '#fff', fontSize: '13px', fontWeight: 600,
                                                        textDecoration: 'none', border: 'none',
                                                        boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upgrade</span>
                                                    Upgrade to Pro
                                                </Link>
                                            )}
                                            {activeSubscription && activeSubscription.status === 'active' && !activeSubscription.cancelled_at && (
                                                <button
                                                    onClick={() => setShowCancelConfirm(true)}
                                                    style={{
                                                        padding: '10px 20px', borderRadius: '9999px',
                                                        background: 'rgba(255,255,255,0.08)',
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '13px', fontWeight: 500,
                                                        cursor: 'pointer', transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    Cancel Plan
                                                </button>
                                            )}
                                            {activeSubscription?.cancelled_at && (
                                                <Link
                                                    href={route('subscription')}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '10px 20px', borderRadius: '9999px',
                                                        background: '#f97316', color: '#fff',
                                                        fontSize: '13px', fontWeight: 600,
                                                        textDecoration: 'none', border: 'none',
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                                                    Resubscribe
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {activeSubscription && (
                                        <div className="billing-meta-grid" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                                            <div className="billing-meta-item">
                                                <div className="billing-meta-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Started</div>
                                                <div className="billing-meta-value" style={{ color: '#fff' }}>
                                                    {formatDate(activeSubscription.starts_at)}
                                                </div>
                                            </div>
                                            <div className="billing-meta-item">
                                                <div className="billing-meta-label" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                    {activeSubscription.cancelled_at ? 'Access ends' : 'Renews'}
                                                </div>
                                                <div className="billing-meta-value" style={{ color: '#fff' }}>
                                                    {formatDate(activeSubscription.ends_at)}
                                                    {renewalInfo && renewalInfo.days > 0 && (
                                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, marginLeft: '6px' }}>
                                                            · {renewalInfo.days}d
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="billing-meta-item">
                                                <div className="billing-meta-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Auto-renew</div>
                                                <div className="billing-meta-value" style={{
                                                    color: activeSubscription.auto_renew && !activeSubscription.cancelled_at ? '#4ade80' : 'rgba(255,255,255,0.5)',
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                                        {activeSubscription.auto_renew && !activeSubscription.cancelled_at ? 'autorenew' : 'pause_circle'}
                                                    </span>
                                                    {activeSubscription.auto_renew && !activeSubscription.cancelled_at ? 'On' : 'Off'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cancel Confirmation */}
                                {showCancelConfirm && (
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #fecaca',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        marginBottom: '28px',
                                    }}>
                                        <div className="d-flex align-items-start gap-3">
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#dc2626', marginTop: '2px' }}>warning</span>
                                            <div className="flex-grow-1">
                                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#000', marginBottom: '6px' }}>
                                                    Cancel your subscription?
                                                </div>
                                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.5 }}>
                                                    You'll retain access to Pro features until the end of your current billing period. After that, you'll be downgraded to the Free plan.
                                                </p>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={handleCancelSubscription}
                                                        disabled={cancelling}
                                                        style={{
                                                            padding: '8px 20px', borderRadius: '9999px',
                                                            background: '#dc2626', color: '#fff',
                                                            border: 'none', fontSize: '13px', fontWeight: 500,
                                                            cursor: cancelling ? 'not-allowed' : 'pointer',
                                                            opacity: cancelling ? 0.6 : 1,
                                                        }}
                                                    >
                                                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowCancelConfirm(false)}
                                                        style={{
                                                            padding: '8px 20px', borderRadius: '9999px',
                                                            background: '#f5f5f7', color: '#000',
                                                            border: 'none', fontSize: '13px', fontWeight: 500,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Keep Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transaction History */}
                                <div className="billing-card" style={{
                                    background: '#fff',
                                    border: '1px solid #e5e5e7',
                                    overflow: 'hidden',
                                    marginBottom: '24px',
                                }}>
                                    <div className="billing-section-head">
                                        <div className="billing-section-eyebrow">Payment History</div>
                                        <div className="billing-section-title">Transactions</div>
                                    </div>

                                    {transactions && transactions.data && transactions.data.length > 0 ? (
                                        <div>
                                            {transactions.data.map((tx) => (
                                                <div key={tx.id} className="billing-txn-row">
                                                    <div className="billing-txn-main">
                                                        <div style={{
                                                            width: '38px', height: '38px', borderRadius: '10px',
                                                            background: tx.status === 'successful' ? 'rgba(22,163,74,0.08)' : '#f5f5f7',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{
                                                                fontSize: '18px',
                                                                color: tx.status === 'successful' ? '#16a34a' : '#86868b',
                                                            }}>
                                                                {tx.status === 'successful' ? 'check_circle' : tx.status === 'pending' ? 'schedule' : 'cancel'}
                                                            </span>
                                                        </div>
                                                        <div style={{ minWidth: 0, flex: 1 }}>
                                                            <div style={{
                                                                fontSize: '14px', fontWeight: 500, color: '#000',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                            }}>
                                                                {tx.description || `${tx.type} payment`}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '12px', color: '#86868b',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                            }}>
                                                                {formatDate(tx.paid_at || tx.created_at)} · {tx.payment_provider}
                                                                {tx.payment_method && ` · ${tx.payment_method}`}
                                                            </div>
                                                            {tx.reference && (
                                                                <div style={{
                                                                    fontSize: '11px', color: '#b0b0b5',
                                                                    fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
                                                                    marginTop: '2px',
                                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                                }}>
                                                                    {tx.reference}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="billing-txn-right">
                                                        {statusBadge(tx.status)}
                                                        <div style={{
                                                            fontSize: '14px', fontWeight: 600, color: '#000',
                                                            textAlign: 'right', minWidth: '80px',
                                                        }}>
                                                            {formatCurrency(tx.amount, tx.currency)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {transactions.last_page > 1 && (
                                                <div style={{
                                                    padding: '16px 28px',
                                                    borderTop: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    flexWrap: 'wrap',
                                                }}>
                                                    {transactions.links && transactions.links.map((link, i) => {
                                                        if (!link.url) return null;
                                                        return (
                                                            <Link
                                                                key={i}
                                                                href={link.url}
                                                                style={{
                                                                    padding: '6px 14px',
                                                                    borderRadius: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: 500,
                                                                    textDecoration: 'none',
                                                                    background: link.active ? '#000' : '#f5f5f7',
                                                                    color: link.active ? '#fff' : '#6b7280',
                                                                    border: 'none',
                                                                }}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '60px 28px',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '16px',
                                                background: '#f5f5f7', margin: '0 auto 16px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86868b' }}>receipt_long</span>
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: 500, color: '#000', marginBottom: '6px' }}>
                                                No transactions yet
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#86868b', margin: '0 auto', maxWidth: '300px', lineHeight: 1.5 }}>
                                                When you subscribe to a plan, your payment history will show up here.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Subscription History */}
                                {subscriptionHistory && subscriptionHistory.length > 0 && (
                                    <div className="billing-card" style={{
                                        background: '#fff',
                                        border: '1px solid #e5e5e7',
                                        overflow: 'hidden',
                                        marginBottom: '24px',
                                    }}>
                                        <div className="billing-section-head">
                                            <div className="billing-section-eyebrow">Plan Timeline</div>
                                            <div className="billing-section-title">Subscription history</div>
                                        </div>
                                        <div>
                                            {subscriptionHistory.map((sub, index) => (
                                                <div key={sub.id} className="billing-txn-row">
                                                    <div className="billing-txn-main">
                                                        <div style={{
                                                            width: '38px', height: '38px', borderRadius: '10px',
                                                            background: sub.status === 'active' ? 'rgba(22,163,74,0.08)' : '#f5f5f7',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{
                                                                fontSize: '18px',
                                                                color: sub.status === 'active' ? '#16a34a' : '#86868b',
                                                            }}>
                                                                workspace_premium
                                                            </span>
                                                        </div>
                                                        <div style={{ minWidth: 0, flex: 1 }}>
                                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                                                                {sub.plan?.name || 'Plan'}
                                                                <span style={{ color: '#86868b', fontWeight: 400, marginLeft: '6px' }}>
                                                                    · {sub.billing_period === 'yearly' ? 'Yearly' : 'Monthly'}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#86868b' }}>
                                                                {formatDate(sub.starts_at)} → {formatDate(sub.ends_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="billing-txn-right">
                                                        {statusBadge(sub.status)}
                                                        <div style={{
                                                            fontSize: '14px', fontWeight: 600, color: '#000',
                                                            textAlign: 'right', minWidth: '80px',
                                                        }}>
                                                            {formatCurrency(sub.amount, sub.currency)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Billing Help */}
                                <div className="billing-help">
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: '#fff7ed', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#f97316' }}>support_agent</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '180px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '2px' }}>
                                            Need help with billing?
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
                                            Questions about a charge, refund, or receipt? We'll get back within one business day.
                                        </p>
                                    </div>
                                    <Link
                                        href="/help"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '9px 18px', borderRadius: '9999px',
                                            background: '#000', color: '#fff', fontSize: '13px',
                                            fontWeight: 500, textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Contact support
                                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </AuthenticatedLayout>
    );
}
