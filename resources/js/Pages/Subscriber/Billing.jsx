import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    const { activeSubscription, transactions, subscriptionHistory, currentPlan } = usePage().props;
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

    return (
        <AuthenticatedLayout>
            <Head title="Billing & Subscription" />

            <section style={{ paddingTop: '40px', paddingBottom: '80px', minHeight: '80vh', background: '#fafafa' }}>
                <Container>
                    <Row>
                        {/* Sidebar */}
                        <Col lg={3} className="d-none d-lg-block">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <SubscriberSideNav />
                            </div>
                        </Col>

                        {/* Main Content */}
                        <Col lg={9}>
                            <div style={{ maxWidth: '780px' }}>
                                {/* Page Header */}
                                <SectionEyebrow text="Billing & Subscription" />
                                <h2 style={{
                                    fontSize: 'clamp(22px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '32px',
                                }}>
                                    Manage your plan
                                </h2>

                                {/* Current Plan Card */}
                                <div style={{
                                    background: activeSubscription ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)' : '#fff',
                                    borderRadius: '20px',
                                    padding: '32px',
                                    marginBottom: '32px',
                                    border: activeSubscription ? 'none' : '1px solid #e5e5e7',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    {activeSubscription && (
                                        <div style={{
                                            position: 'absolute', top: '-60px', right: '-40px',
                                            width: '200px', height: '200px',
                                            background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
                                            pointerEvents: 'none',
                                        }} />
                                    )}

                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                        <div>
                                            <div style={{
                                                fontSize: '11px', fontWeight: 600,
                                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                                color: activeSubscription ? 'rgba(255,255,255,0.4)' : '#86868b',
                                                marginBottom: '8px',
                                            }}>
                                                Current Plan
                                            </div>
                                            <div style={{
                                                fontSize: '28px', fontWeight: 700,
                                                color: activeSubscription ? '#fff' : '#000',
                                                letterSpacing: '-0.02em',
                                                marginBottom: '6px',
                                                display: 'flex', alignItems: 'center', gap: '10px',
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
                                                        Active
                                                    </span>
                                                )}
                                            </div>

                                            {activeSubscription ? (
                                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                                                    <div>{formatCurrency(activeSubscription.amount, activeSubscription.currency)} / {activeSubscription.billing_period === 'yearly' ? 'year' : 'month'}</div>
                                                    <div>Renews on {formatDate(activeSubscription.ends_at)}</div>
                                                    {activeSubscription.status === 'cancelled' && (
                                                        <div style={{ color: '#f97316', marginTop: '4px' }}>
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

                                        <div className="d-flex gap-2">
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
                                            {activeSubscription && activeSubscription.status === 'active' && (
                                                <button
                                                    onClick={() => setShowCancelConfirm(true)}
                                                    style={{
                                                        padding: '10px 20px', borderRadius: '9999px',
                                                        background: 'rgba(255,255,255,0.08)',
                                                        border: '1px solid rgba(255,255,255,0.15)',
                                                        color: 'rgba(255,255,255,0.6)',
                                                        fontSize: '13px', fontWeight: 500,
                                                        cursor: 'pointer', transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    Cancel Plan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cancel Confirmation */}
                                {showCancelConfirm && (
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #fecaca',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        marginBottom: '32px',
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
                                                <div className="d-flex gap-2">
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
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    border: '1px solid #e5e5e7',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        padding: '24px 28px 16px',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}>
                                        <div style={{
                                            fontSize: '11px', fontWeight: 600,
                                            textTransform: 'uppercase', letterSpacing: '0.1em',
                                            color: '#86868b', marginBottom: '4px',
                                        }}>
                                            Payment History
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>
                                            Transactions
                                        </div>
                                    </div>

                                    {transactions && transactions.data && transactions.data.length > 0 ? (
                                        <div>
                                            {transactions.data.map((tx, index) => (
                                                <div
                                                    key={tx.id}
                                                    style={{
                                                        padding: '18px 28px',
                                                        borderBottom: index < transactions.data.length - 1 ? '1px solid #f5f5f7' : 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '16px',
                                                        transition: 'background 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <div className="d-flex align-items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
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
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{
                                                                fontSize: '14px', fontWeight: 500, color: '#000',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                            }}>
                                                                {tx.description || `${tx.type} payment`}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#86868b' }}>
                                                                {formatDate(tx.paid_at || tx.created_at)} · {tx.payment_provider}
                                                                {tx.payment_method && ` · ${tx.payment_method}`}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
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

                                            {/* Pagination */}
                                            {transactions.last_page > 1 && (
                                                <div style={{
                                                    padding: '16px 28px',
                                                    borderTop: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '8px',
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
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </AuthenticatedLayout>
    );
}
