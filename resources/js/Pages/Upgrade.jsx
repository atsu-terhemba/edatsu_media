import { useState } from "react";
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Upgrade = () => {
    const { props } = usePage();
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currency, setCurrency] = useState('NGN');
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: {
                monthly: { USD: 0, NGN: 0 },
                yearly: { USD: 0, NGN: 0 }
            },
            description: 'Perfect for getting started with opportunities',
            icon: 'star',
            features: [
                { text: 'Access to basic opportunities', icon: 'check_circle' },
                { text: 'Weekly newsletter', icon: 'mail' },
                { text: 'Community access', icon: 'groups' },
                { text: 'Basic search filters', icon: 'search' },
                { text: 'Save up to 10 opportunities', icon: 'bookmark' }
            ],
            limitations: [
                'Limited bookmarks (10 max)',
                'Ads displayed while browsing',
                'No calendar integration',
                'No AI assistant'
            ],
            buttonText: 'Current Plan',
            current: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: {
                monthly: { USD: 2.11, NGN: 3000 },
                yearly: { USD: 22.79, NGN: 32400 }
            },
            description: 'Unlock all features and supercharge your hunt',
            icon: 'workspace_premium',
            popular: true,
            features: [
                { text: 'Unlimited saved opportunities', highlight: true },
                { text: 'Smart reminders via push & email', highlight: true },
                { text: 'Google Calendar sync', highlight: true },
                { text: 'AI Assistant', highlight: true },
                { text: 'Ad-free browsing' },
                { text: 'Priority access to new opportunities' },
                { text: 'Export saved items (PDF / CSV)' }
            ],
            limitations: [],
            buttonText: 'Upgrade Now',
            current: false
        }
    ];

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
            console.log('Processing payment:', {
                plan: selectedPlan,
                method: paymentMethod,
                currency,
                billingPeriod
            });

            setTimeout(() => {
                setIsProcessing(false);
                alert('Payment feature coming soon!');
            }, 1500);
        } catch (error) {
            console.error('Payment error:', error);
            setIsProcessing(false);
        }
    };

    const paymentMethods = [
        { id: 'paystack', name: 'Paystack', icon: 'credit_card', description: 'Pay with card (Nigeria)' },
        { id: 'flutterwave', name: 'Flutterwave', icon: 'payments', description: 'Card, Bank Transfer, USSD' },
        { id: 'stripe', name: 'Stripe', icon: 'credit_score', description: 'International cards' }
    ];

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
                        Supercharge your opportunity hunting with smart reminders, AI, and unlimited saves.
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
                            onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
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
                    {/* Free Access Banner */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        padding: '28px 32px',
                        marginBottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        border: '1px solid #e5e5e7',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: '-40px', right: '-40px',
                            width: '160px', height: '160px',
                            background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }} />
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: 'rgba(249,115,22,0.1)', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#f97316' }}>
                                celebration
                            </span>
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{
                                fontSize: '17px', fontWeight: 600, color: '#000',
                                margin: '0 0 4px', letterSpacing: '-0.01em',
                            }}>
                                All features are free until March 1st!
                            </h3>
                            <p style={{
                                fontSize: '13px', color: '#86868b',
                                margin: 0, lineHeight: 1.5,
                            }}>
                                We're opening up every Pro feature at no cost while we build something amazing. Explore everything, save unlimited opportunities, and enjoy an ad-free experience — on us.
                            </p>
                        </div>
                    </div>

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
                onHide={() => setShowPayment(false)}
                placement="end"
                style={{ width: '380px' }}
            >
                <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #f3f4f6', padding: '20px 24px' }}>
                    <Offcanvas.Title style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>
                        Complete Payment
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ padding: '24px' }}>
                    {selectedPlan && (
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

                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="d-flex align-items-center"
                                    style={{
                                        gap: '12px',
                                        padding: '14px 16px',
                                        border: `1px solid ${paymentMethod === method.id ? '#000' : '#e5e7eb'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        marginBottom: '8px',
                                        background: paymentMethod === method.id ? '#fafafa' : '#fff',
                                    }}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#374151' }}>
                                        {method.icon}
                                    </span>
                                    <div className="flex-grow-1">
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{method.name}</div>
                                        <div style={{ fontSize: '12px', color: '#86868b' }}>{method.description}</div>
                                    </div>
                                    {paymentMethod === method.id && (
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                disabled={!paymentMethod || isProcessing}
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
                                    cursor: (!paymentMethod || isProcessing) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    marginTop: '24px',
                                    opacity: (!paymentMethod || isProcessing) ? 0.4 : 1,
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
                </Offcanvas.Body>
            </Offcanvas>
        </AuthenticatedLayout>
    );
};

export default Upgrade;
