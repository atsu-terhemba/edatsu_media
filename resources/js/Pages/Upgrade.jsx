import { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Upgrade = () => {
    const { props } = usePage();
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currency, setCurrency] = useState('NGN');
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transferDetails, setTransferDetails] = useState(null);
    const [copied, setCopied] = useState(false);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!transferDetails?.tx_ref) return;
        const poll = setInterval(async () => {
            try {
                const { data } = await axios.get(`/subscription/status/${transferDetails.tx_ref}`);
                if (data.status === 'successful') {
                    clearInterval(poll);
                    window.location.href = '/billing';
                } else if (data.status === 'failed') {
                    clearInterval(poll);
                    setTransferDetails(null);
                    alert('Payment was not completed. Please try again.');
                }
            } catch (e) { /* transient */ }
        }, 5000);
        const tick = setInterval(() => setNow(Date.now()), 1000);
        return () => { clearInterval(poll); clearInterval(tick); };
    }, [transferDetails?.tx_ref]);

    const plansFromProps = props.plans || [];
    const currentPlanSlug = props.currentPlan || 'free';
    const plans = plansFromProps.map((p) => ({
        ...p,
        current: p.id === currentPlanSlug,
        buttonText: p.id === currentPlanSlug
            ? 'Current Plan'
            : p.popular ? 'Upgrade Now' : 'Get Started Free',
    }));

    const formatPrice = (price) => {
        if (price === 0) return 'Free';
        if (currency === 'NGN') {
            return `₦${price.toLocaleString()}`;
        }
        return `$${price.toFixed(2)}`;
    };

    const handleSelectPlan = (plan) => {
        if (plan.id === 'free') return;
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setIsProcessing(true);

        try {
            const isBankTransfer = paymentMethod === 'banktransfer' || paymentMethod === 'banktransfer_opay';
            if (isBankTransfer) {
                const bankProvider = paymentMethod === 'banktransfer_opay' ? 'opay' : 'girostack';
                const { data } = await axios.post('/subscription/initiate-transfer', {
                    plan_id: selectedPlan.id,
                    billing_period: billingPeriod,
                    currency,
                    bank_provider: bankProvider,
                });

                if (data?.success) {
                    setTransferDetails({
                        tx_ref: data.tx_ref,
                        account_number: data.account_number,
                        bank_name: data.bank_name,
                        amount: data.amount,
                        expires_at: data.expires_at,
                        bank_provider: data.bank_provider || bankProvider,
                    });
                    setIsProcessing(false);
                    return;
                }

                setIsProcessing(false);
                alert(data?.message || 'Could not generate virtual account. Please try again.');
                return;
            }

            const provider = paymentMethod === 'crypto' ? 'nowpayments' : 'flutterwave';
            const { data } = await axios.post('/subscription/initiate', {
                plan_id: selectedPlan.id,
                billing_period: billingPeriod,
                currency,
                payment_provider: provider,
                payment_method: paymentMethod,
            });

            if (data?.success && data?.payment_url) {
                window.location.href = data.payment_url;
                return;
            }

            setIsProcessing(false);
            alert(data?.message || 'Could not start payment. Please try again.');
        } catch (error) {
            setIsProcessing(false);
            const msg = error?.response?.data?.message || 'Payment failed. Please try again.';
            alert(msg);
            console.error('Payment error:', error);
        }
    };

    const copyAccount = () => {
        if (!transferDetails?.account_number) return;
        navigator.clipboard.writeText(transferDetails.account_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const formatExpiry = () => {
        if (!transferDetails?.expires_at) return '';
        const ms = new Date(transferDetails.expires_at).getTime() - now;
        if (ms <= 0) return 'Expired';
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    };

    const allPaymentMethods = [
        {
            id: 'card',
            name: 'Card',
            icon: 'credit_card',
            description: 'Debit or credit card',
            currencies: ['NGN', 'USD'],
        },
        {
            id: 'banktransfer',
            name: 'Bank Transfer',
            icon: 'account_balance',
            description: 'Pay with a bank transfer',
            currencies: ['NGN'],
            bankProvider: 'girostack',
        },
        {
            id: 'banktransfer_opay',
            name: 'Bank Transfer (Opay)',
            icon: 'account_balance_wallet',
            description: 'Temporarily unavailable',
            currencies: ['NGN'],
            bankProvider: 'opay',
            disabled: true,
        },
        {
            id: 'crypto',
            name: 'USDT (Stablecoin)',
            icon: 'currency_bitcoin',
            description: 'Pay with USDT on TRC-20, ERC-20 or other supported chains',
            currencies: ['USD'],
        },
    ];

    // Always show all payment methods — otherwise USDT is invisible to users
    // landing on the default NGN currency and they never discover it. If they
    // pick a method whose currency doesn't match the current toggle, we flip
    // the currency for them.
    const selectPaymentMethod = (method) => {
        if (!method.currencies.includes(currency)) {
            setCurrency(method.currencies[0]);
        }
        setPaymentMethod(method.id);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Upgrade to Pro" />

            {/* Header Section */}
            <section style={{
                paddingTop: '96px',
                paddingBottom: '48px',
                background: '#f5f5f7',
                textAlign: 'center',
            }}>
                <Container>
                    {/* Eyebrow */}
                    <div className="d-flex flex-column align-items-center mb-3">
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            color: '#86868b',
                        }}>
                            Upgrade Your Plan
                        </span>
                        <div style={{
                            width: '32px',
                            height: '2px',
                            background: '#f97316',
                            borderRadius: '9999px',
                            marginTop: '8px',
                        }} />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 40px)',
                        fontWeight: 600,
                        color: '#000',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        marginBottom: '12px',
                    }}>
                        Unlock the full{' '}
                        <span style={{ color: '#f97316' }}>experience</span>
                    </h1>

                    <p style={{
                        fontSize: '14px',
                        color: '#86868b',
                        fontWeight: 400,
                        lineHeight: 1.6,
                        maxWidth: '420px',
                        margin: '0 auto 32px',
                    }}>
                        Supercharge your opportunity hunting with unlimited saves, smart reminders, and an ad-free feed.
                    </p>

                    {/* Toggles */}
                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                        <div style={{
                            display: 'inline-flex',
                            background: '#e8e8ed',
                            borderRadius: '9999px',
                            padding: '3px',
                        }}>
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                style={{
                                    padding: '8px 20px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: billingPeriod === 'monthly' ? '#fff' : 'transparent',
                                    color: billingPeriod === 'monthly' ? '#000' : '#86868b',
                                    boxShadow: billingPeriod === 'monthly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                }}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingPeriod('yearly')}
                                style={{
                                    padding: '8px 20px',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: billingPeriod === 'yearly' ? '#fff' : 'transparent',
                                    color: billingPeriod === 'yearly' ? '#000' : '#86868b',
                                    boxShadow: billingPeriod === 'yearly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                }}
                            >
                                Yearly
                                <span style={{
                                    background: 'rgba(22,163,74,0.1)',
                                    color: '#16a34a',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                }}>
                                    Save 10%
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                const next = currency === 'NGN' ? 'USD' : 'NGN';
                                setCurrency(next);
                                // If the currently-selected method isn't valid for the new
                                // currency (e.g. banktransfer→USD or crypto→NGN), fall back to card.
                                const stillValid = allPaymentMethods
                                    .find(m => m.id === paymentMethod)?.currencies.includes(next);
                                if (!stillValid) setPaymentMethod('card');
                            }}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 400,
                                color: '#86868b',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>currency_exchange</span>
                            {currency === 'USD' ? 'NGN (₦)' : 'USD ($)'}
                        </button>
                    </div>
                </Container>
            </section>

            {/* Pricing Cards */}
            <section style={{ padding: '48px 0 64px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="justify-content-center align-items-stretch g-4">
                        {plans.map((plan) => {
                            const isPro = plan.popular;
                            return (
                                <Col lg={5} md={6} key={plan.id} style={{ maxWidth: '460px' }}>
                                    <div style={{
                                        background: isPro
                                            ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)'
                                            : '#fff',
                                        borderRadius: '28px',
                                        padding: '40px 36px 36px',
                                        border: isPro ? 'none' : '1px solid #e5e5e7',
                                        boxShadow: isPro
                                            ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset'
                                            : '0 2px 8px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = isPro
                                            ? '0 28px 72px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset'
                                            : '0 12px 40px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isPro
                                            ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset'
                                            : '0 2px 8px rgba(0,0,0,0.04)';
                                    }}
                                    >
                                        {/* Subtle gradient glow for Pro */}
                                        {isPro && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '-60%',
                                                right: '-30%',
                                                width: '300px',
                                                height: '300px',
                                                background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
                                                pointerEvents: 'none',
                                            }} />
                                        )}

                                        {/* Popular badge */}
                                        {isPro && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.08) 100%)',
                                                    border: '1px solid rgba(249,115,22,0.2)',
                                                    color: '#f97316',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    padding: '5px 14px',
                                                    borderRadius: '9999px',
                                                    letterSpacing: '0.04em',
                                                    textTransform: 'uppercase',
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                                    Recommended
                                                </div>
                                            </div>
                                        )}

                                        {/* Name + Desc */}
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: isPro ? '#fff' : '#000',
                                            marginBottom: '6px',
                                            letterSpacing: '-0.02em',
                                        }}>
                                            {plan.name}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: isPro ? 'rgba(255,255,255,0.45)' : '#86868b',
                                            marginBottom: '28px',
                                            lineHeight: 1.5,
                                        }}>
                                            {plan.description}
                                        </div>

                                        {/* Price */}
                                        <div style={{ marginBottom: '6px' }}>
                                            <span style={{
                                                fontSize: '52px',
                                                fontWeight: 700,
                                                color: isPro ? '#fff' : '#000',
                                                lineHeight: 1,
                                                letterSpacing: '-0.04em',
                                            }}>
                                                {plan.price[billingPeriod][currency] === 0 ? (
                                                    'Free'
                                                ) : (
                                                    <>
                                                        <span style={{ fontSize: '28px', fontWeight: 500, verticalAlign: 'top', position: 'relative', top: '6px' }}>
                                                            {currency === 'USD' ? '$' : '₦'}
                                                        </span>
                                                        {plan.price[billingPeriod][currency].toLocaleString()}
                                                    </>
                                                )}
                                            </span>
                                            {plan.price[billingPeriod][currency] > 0 && (
                                                <span style={{
                                                    fontSize: '15px',
                                                    fontWeight: 400,
                                                    color: isPro ? 'rgba(255,255,255,0.35)' : '#86868b',
                                                    marginLeft: '4px',
                                                }}>
                                                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: isPro ? 'rgba(255,255,255,0.35)' : '#86868b',
                                            marginBottom: '28px',
                                        }}>
                                            {isPro
                                                ? (billingPeriod === 'yearly'
                                                    ? `Save ${currency === 'USD' ? '$' : '₦'}${(plan.price.monthly[currency] * 12 - plan.price.yearly[currency]).toLocaleString()} per year`
                                                    : 'Cancel anytime')
                                                : 'Forever free'}
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={plan.current || isProcessing}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                width: '100%',
                                                padding: '15px 24px',
                                                borderRadius: '9999px',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                cursor: plan.current ? 'default' : 'pointer',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                border: isPro ? 'none' : '1.5px solid #e5e5e7',
                                                marginBottom: '28px',
                                                background: plan.current
                                                    ? '#f5f5f7'
                                                    : isPro
                                                        ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                                                        : '#fff',
                                                color: plan.current
                                                    ? '#86868b'
                                                    : isPro
                                                        ? '#fff'
                                                        : '#000',
                                                boxShadow: isPro ? '0 4px 16px rgba(249,115,22,0.3)' : 'none',
                                                letterSpacing: '-0.01em',
                                                opacity: plan.current ? 0.7 : 1,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (plan.current) return;
                                                if (isPro) {
                                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.4)';
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                } else {
                                                    e.currentTarget.style.background = '#f5f5f7';
                                                    e.currentTarget.style.borderColor = '#d1d1d6';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (plan.current) return;
                                                if (isPro) {
                                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.3)';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                } else {
                                                    e.currentTarget.style.background = '#fff';
                                                    e.currentTarget.style.borderColor = '#e5e5e7';
                                                }
                                            }}
                                        >
                                            {plan.current ? (
                                                <>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                                                    Current Plan
                                                </>
                                            ) : (
                                                <>
                                                    {plan.buttonText}
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div style={{
                                            height: '1px',
                                            background: isPro ? 'rgba(255,255,255,0.08)' : '#f0f0f0',
                                            margin: '0 0 24px',
                                        }} />

                                        {/* Features Title */}
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: isPro ? 'rgba(255,255,255,0.3)' : '#86868b',
                                            marginBottom: '16px',
                                        }}>
                                            {isPro ? "Everything in Free, plus" : "What's included"}
                                        </div>

                                        {/* Features List */}
                                        <div style={{ flex: 1 }}>
                                            {plan.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex align-items-start gap-3"
                                                    style={{
                                                        padding: '8px 0',
                                                        fontSize: '14px',
                                                        color: isPro ? 'rgba(255,255,255,0.85)' : '#1d1d1f',
                                                        lineHeight: 1.4,
                                                        fontWeight: feature.highlight ? 500 : 400,
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        marginTop: '1px',
                                                        background: isPro
                                                            ? (feature.highlight ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.08)')
                                                            : '#f5f5f7',
                                                        color: isPro
                                                            ? (feature.highlight ? '#f97316' : 'rgba(255,255,255,0.5)')
                                                            : '#000',
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check</span>
                                                    </div>
                                                    <span>{feature.text}</span>
                                                </div>
                                            ))}

                                            {plan.limitations.length > 0 && (
                                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                                                    {plan.limitations.map((limitation, index) => (
                                                        <div
                                                            key={index}
                                                            className="d-flex align-items-center gap-3"
                                                            style={{ padding: '5px 0', fontSize: '13px', color: '#b0b0b5' }}
                                                        >
                                                            <div style={{
                                                                width: '22px',
                                                                height: '22px',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0,
                                                                background: '#fafafa',
                                                                color: '#c5c5c8',
                                                            }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                                                            </div>
                                                            <span style={{ textDecoration: 'line-through', textDecorationColor: '#e0e0e0' }}>{limitation}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    {/* Trust badges */}
                    <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap" style={{ marginTop: '40px' }}>
                        {[
                            { icon: 'lock', text: 'Secure payment' },
                            { icon: 'refresh', text: 'Cancel anytime' },
                            { icon: 'verified', text: 'Money-back guarantee' },
                        ].map((item, i) => (
                            <div key={i} className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#86868b' }}>
                                <span style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: '#e8e8ed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#000' }}>{item.icon}</span>
                                </span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Payment Slide-in Panel */}
            <Offcanvas
                show={showPayment}
                onHide={() => { setShowPayment(false); setTransferDetails(null); }}
                placement="end"
                style={{ width: '380px' }}
            >
                <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #f3f4f6', padding: '20px 24px' }}>
                    <Offcanvas.Title style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>
                        Complete Payment
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ padding: '24px' }}>
                    {selectedPlan && !transferDetails && (
                        <>
                            {/* Order Summary */}
                            <div style={{
                                background: '#f5f5f7',
                                borderRadius: '16px',
                                padding: '20px',
                                marginBottom: '28px',
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#86868b',
                                    marginBottom: '16px',
                                }}>
                                    Order Summary
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ fontSize: '14px', color: '#86868b' }}>Plan</span>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{selectedPlan.name}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ fontSize: '14px', color: '#86868b' }}>Billing</span>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>{billingPeriod}</span>
                                </div>
                                <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>Total</span>
                                    <span style={{ fontSize: '20px', fontWeight: 600, color: '#000' }}>
                                        {formatPrice(selectedPlan.price[billingPeriod][currency])}
                                        <span style={{ fontSize: '13px', fontWeight: 400, color: '#86868b' }}>
                                            {' '}/{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>
                                Payment Method
                            </div>

                            {allPaymentMethods.map((method) => {
                                const currencyMismatch = !method.currencies.includes(currency);
                                const isDisabled = method.disabled;
                                return (
                                <div
                                    key={method.id}
                                    className="d-flex align-items-center"
                                    style={{
                                        gap: '12px',
                                        padding: '14px 16px',
                                        border: `1px solid ${paymentMethod === method.id ? '#000' : '#e5e7eb'}`,
                                        borderRadius: '12px',
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.15s ease',
                                        marginBottom: '8px',
                                        background: isDisabled ? '#f5f5f7' : paymentMethod === method.id ? '#fafafa' : '#fff',
                                        opacity: isDisabled ? 0.5 : 1,
                                    }}
                                    onClick={() => !isDisabled && selectPaymentMethod(method)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#374151' }}>
                                        {method.icon}
                                    </span>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="d-flex align-items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{method.name}</span>
                                            {!isDisabled && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.04em',
                                                    textTransform: 'uppercase',
                                                    color: currencyMismatch ? '#86868b' : '#16a34a',
                                                    background: currencyMismatch ? '#f5f5f7' : 'rgba(22,163,74,0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '9999px',
                                                }}>
                                                    {method.currencies.join(' / ')}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#86868b' }}>
                                            {method.description}
                                            {!isDisabled && currencyMismatch && (
                                                <span style={{ color: '#c2410c' }}>
                                                    {` · Switches to ${method.currencies[0]}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {paymentMethod === method.id && (
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                                );
                            })}

                            {/* Crypto minimum guardrail */}
                            {paymentMethod === 'crypto' && billingPeriod === 'monthly' && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '14px 16px',
                                    background: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    color: '#9a3412',
                                }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0 }}>info</span>
                                        <span>
                                            Crypto payments require a minimum of $10. Switch to the
                                            <strong> yearly plan</strong> to pay with USDT, or pick another method below.
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', paddingLeft: '28px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setBillingPeriod('yearly')}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                background: '#9a3412',
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#7c2d12'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#9a3412'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_month</span>
                                            Switch to yearly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => selectPaymentMethod(allPaymentMethods.find(m => m.id === 'card'))}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                background: '#fff',
                                                color: '#9a3412',
                                                border: '1px solid #fed7aa',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.borderColor = '#fdba74'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>credit_card</span>
                                            Use card instead
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Pay Button */}
                            {(() => {
                                const cryptoBlocked = paymentMethod === 'crypto' && billingPeriod === 'monthly';
                                const disabled = !paymentMethod || isProcessing || cryptoBlocked;
                                return (
                            <button
                                onClick={handlePayment}
                                disabled={disabled}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '14px 32px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    border: 'none',
                                    background: '#000',
                                    color: '#fff',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    marginTop: '24px',
                                    opacity: disabled ? 0.4 : 1,
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay {formatPrice(selectedPlan.price[billingPeriod][currency])}</>
                                )}
                            </button>
                                );
                            })()}
                            <div className="d-flex align-items-center justify-content-center gap-1" style={{
                                fontSize: '12px',
                                color: '#86868b',
                                marginTop: '16px',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                                Secure payment powered by trusted providers
                            </div>
                        </>
                    )}

                    {transferDetails && (
                        <>
                            <div style={{
                                background: '#f5f5f7',
                                borderRadius: '16px',
                                padding: '20px',
                                marginBottom: '20px',
                            }}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#86868b',
                                    marginBottom: '16px',
                                }}>
                                    Transfer details
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <div style={{ fontSize: '12px', color: '#86868b', marginBottom: '4px' }}>Bank</div>
                                    <div style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>{transferDetails.bank_name || '—'}</div>
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <div style={{ fontSize: '12px', color: '#86868b', marginBottom: '4px' }}>Account number</div>
                                    <div className="d-flex align-items-center justify-content-between" style={{ gap: '8px' }}>
                                        <span style={{ fontSize: '22px', fontWeight: 600, color: '#000', letterSpacing: '0.04em' }}>
                                            {transferDetails.account_number || '—'}
                                        </span>
                                        <button
                                            onClick={copyAccount}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '6px 12px',
                                                border: '1px solid #e5e7eb',
                                                background: '#fff',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: copied ? '#16a34a' : '#000',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                                {copied ? 'check' : 'content_copy'}
                                            </span>
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between" style={{ paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#86868b', marginBottom: '4px' }}>Amount</div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#000' }}>
                                            {currency === 'NGN' ? '₦' : '$'}{Number(transferDetails.amount).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '12px', color: '#86868b', marginBottom: '4px' }}>Expires in</div>
                                        <div style={{ fontSize: '15px', fontWeight: 500, color: '#000', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatExpiry()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center" style={{
                                gap: '12px',
                                padding: '14px 16px',
                                background: '#fff7ed',
                                border: '1px solid #fed7aa',
                                borderRadius: '12px',
                                marginBottom: '16px',
                            }}>
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: '20px',
                                        color: '#f97316',
                                        animation: 'spin 1.2s linear infinite',
                                        display: 'inline-block',
                                        lineHeight: 1,
                                    }}
                                >
                                    progress_activity
                                </span>
                                <div style={{ fontSize: '13px', color: '#7c2d12', lineHeight: 1.4 }}>
                                    Waiting for payment… Your Pro plan activates automatically once the transfer is received.
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: '#86868b', lineHeight: 1.5 }}>
                                Send the exact amount from your banking app to this account. Transfers usually confirm within 1–2 minutes.
                            </div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </AuthenticatedLayout>
    );
};

export default Upgrade;
