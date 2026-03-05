import { useEffect, useState } from "react";
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import FixedMobileNav from '@/Components/FixedMobileNav';
import axios from 'axios';

const Subscription = () => {
    const { props } = usePage();
    const [selectedPlan, setSelectedPlan] = useState('free');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currency, setCurrency] = useState('NGN');
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const pricingPlans = [
        {
            id: 'free',
            name: 'Free',
            price: {
                monthly: { USD: 0, NGN: 0 },
                yearly: { USD: 0, NGN: 0 }
            },
            period: 'Forever',
            description: 'Perfect for getting started with opportunities',
            popular: false,
            icon: 'star',
            features: [
                { text: 'Access to basic opportunities', icon: 'check_circle' },
                { text: 'Weekly newsletter', icon: 'mail' },
                { text: 'Community access', icon: 'groups' },
                { text: 'Basic search filters', icon: 'search' },
                { text: 'Mobile app access', icon: 'smartphone' },
                { text: 'Save up to 10 opportunities & tools', icon: 'bookmark' }
            ],
            limitations: [
                'Limited bookmarks (10 max)',
                'Ads displayed while browsing',
                'No calendar integration',
                'No push notifications',
                'No AI assistant',
                'No export features'
            ],
            buttonText: 'Get Started Free',
        },
        {
            id: 'premium',
            name: 'Pro',
            price: {
                monthly: { USD: 3.68, NGN: 5000 },
                yearly: { USD: 39.74, NGN: 54000 }
            },
            period: billingPeriod === 'monthly' ? 'month' : 'year',
            description: 'Supercharge your opportunity hunting',
            popular: true,
            icon: 'workspace_premium',
            features: [
                { text: 'Unlimited saved Opportunities & Tools', icon: 'all_inclusive', highlight: true },
                { text: 'Smart reminders via push & email', icon: 'notifications_active', highlight: true },
                { text: 'Google Calendar sync for deadlines', icon: 'calendar_month', highlight: true },
                { text: 'Personalized AI Assistant', icon: 'smart_toy', highlight: true },
                { text: 'Ad-free browsing experience', icon: 'block' },
                { text: 'Priority access to new opportunities', icon: 'bolt' },
                { text: 'Export saved items (PDF / CSV)', icon: 'download' }
            ],
            limitations: [],
            buttonText: 'Upgrade to Pro',
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleSubscribe = async (plan) => {
        setIsProcessing(true);

        try {
            if (plan.id === 'free') {
                if (!props.auth.user) {
                    window.location.href = '/register';
                } else {
                    const response = await axios.post('/process-subscription', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        price: plan.price[billingPeriod][currency],
                        currency: currency,
                        billing_period: billingPeriod
                    });

                    if (response.data.success) {
                        alert('Welcome to the Free plan! You now have access to all basic features.');
                    }
                }
            } else {
                if (!props.auth.user) {
                    localStorage.setItem('selectedPlan', JSON.stringify({
                        plan: plan,
                        currency: currency,
                        billingPeriod: billingPeriod
                    }));
                    window.location.href = '/register';
                } else {
                    const response = await axios.post('/process-subscription', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        price: plan.price[billingPeriod][currency],
                        currency: currency,
                        billing_period: billingPeriod
                    });

                    if (response.data.success) {
                        if (response.data.payment_url) {
                            window.location.href = response.data.payment_url;
                        } else {
                            alert('Pro subscription activated! Welcome to Pro.');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('There was an error processing your subscription. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleCurrency = () => {
        setCurrency(currency === 'USD' ? 'NGN' : 'USD');
    };

    const proFeatures = [
        { icon: 'all_inclusive', title: 'Unlimited Saves', desc: 'Save as many opportunities and tools as you want. No limits, no restrictions.' },
        { icon: 'notifications_active', title: 'Smart Reminders', desc: 'Push notifications and email alerts for deadlines. Never miss an application window.' },
        { icon: 'calendar_month', title: 'Calendar Sync', desc: 'Automatically sync deadlines to your Google Calendar. All your dates in one place.' },
        { icon: 'smart_toy', title: 'AI Assistant', desc: 'AI-powered recommendations tailored to your profile, goals, and interests.' },
        { icon: 'block', title: 'Ad-Free', desc: 'Browse and research opportunities without any distractions whatsoever.' },
        { icon: 'download', title: 'Export Data', desc: 'Download your saved opportunities as PDF or CSV. Share with your team.' },
    ];

    const faqs = [
        { q: 'How do smart reminders work?', a: 'When you save an opportunity with a deadline, you can set custom reminders. We\'ll send you push notifications and email alerts before the deadline so you never miss an application window.' },
        { q: 'How does Google Calendar sync work?', a: 'Connect your Google Calendar once, and we\'ll automatically add opportunity deadlines as calendar events alongside your other commitments.' },
        { q: 'What can the AI Assistant do?', a: 'Your personalized AI assistant learns your preferences and goals to recommend the most relevant opportunities. Ask it questions like "Find grants for tech startups in Africa" and get instant, tailored results.' },
        { q: 'Can I cancel my subscription anytime?', a: 'Absolutely! Cancel anytime with no questions asked. You\'ll keep Pro access until the end of your billing period.' },
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <GuestLayout>
            <Metadata
                title="Subscription Plans - Edatsu Media"
                description="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support with Edatsu Media subscription plans."
                keywords="subscription plans, business opportunities, premium access, Edatsu Media pricing, exclusive opportunities, business growth"
                canonicalUrl={`${window.location.origin}/subscription`}
                ogTitle="Subscription Plans - Edatsu Media"
                ogDescription="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."
                twitterTitle="Subscription Plans - Edatsu Media"
                twitterDescription="Choose the perfect plan for your business growth journey."
            />

            {/* Hero Section - with background image like landing page */}
            <section className="position-relative" style={{
                backgroundImage: "url('/img/defaults/pricing_banner.jpg')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
            }}>
                <div style={{
                    position: 'relative',
                    padding: '120px 0 72px',
                    textAlign: 'center',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.80) 100%)',
                }}>
                <Container>
                    {/* Eyebrow */}
                    <div className="d-flex flex-column align-items-center mb-4">
                        <span
                            className="section-eyebrow"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                            Choose Your Plan
                        </span>
                        <div className="eyebrow-bar" />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(32px, 6vw, 48px)',
                        fontWeight: 600,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        marginBottom: '16px',
                    }}>
                        Simple, transparent{' '}
                        <span style={{ color: '#f97316' }}>pricing</span>
                    </h1>

                    <p style={{
                        fontSize: '15px',
                        lineHeight: 1.6,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.5)',
                        maxWidth: '480px',
                        margin: '0 auto 32px',
                    }}>
                        Start for free and upgrade when you're ready. No hidden fees, cancel anytime.
                    </p>

                    {/* Billing Toggle + Currency */}
                    <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                        <div style={{
                            display: 'inline-flex',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '9999px',
                            padding: '3px',
                            border: '1px solid rgba(255,255,255,0.08)',
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
                                    color: billingPeriod === 'monthly' ? '#000' : 'rgba(255,255,255,0.5)',
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
                                    color: billingPeriod === 'yearly' ? '#000' : 'rgba(255,255,255,0.5)',
                                }}
                            >
                                Yearly
                                <span style={{
                                    background: billingPeriod === 'yearly' ? 'rgba(22,163,74,0.1)' : 'rgba(22,163,74,0.15)',
                                    color: billingPeriod === 'yearly' ? '#16a34a' : '#4ade80',
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
                            onClick={toggleCurrency}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.06)',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>currency_exchange</span>
                            {currency === 'USD' ? 'NGN (₦)' : 'USD ($)'}
                        </button>
                    </div>
                </Container>
                </div>
            </section>

            {/* Pricing Cards */}
            <section style={{ padding: '64px 0 48px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="justify-content-center align-items-stretch g-4">
                        {pricingPlans.map((plan) => {
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
                                                Most Popular
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
                                        {plan.id === 'premium'
                                            ? (billingPeriod === 'yearly'
                                                ? `Save ${currency === 'USD' ? '$' : '₦'}${(plan.price.monthly[currency] * 12 - plan.price.yearly[currency]).toLocaleString()} per year`
                                                : 'Cancel anytime')
                                            : 'Forever free'}
                                    </div>

                                    {/* CTA Button - placed before features for prominence */}
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={isProcessing}
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
                                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: isPro ? 'none' : '1.5px solid #e5e5e7',
                                            marginBottom: '28px',
                                            background: isPro
                                                ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                                                : '#fff',
                                            color: isPro ? '#fff' : '#000',
                                            boxShadow: isPro ? '0 4px 16px rgba(249,115,22,0.3)' : 'none',
                                            letterSpacing: '-0.01em',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (isPro) {
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.4)';
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                            } else {
                                                e.currentTarget.style.background = '#f5f5f7';
                                                e.currentTarget.style.borderColor = '#d1d1d6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (isPro) {
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.3)';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            } else {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.borderColor = '#e5e5e7';
                                            }
                                        }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Processing...
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

                    {/* Trust note */}
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

            {/* Why Go Pro */}
            <section style={{ padding: '96px 0', background: '#fff' }}>
                <Container>
                    <div className="text-center">
                        <div className="d-flex flex-column align-items-center mb-3">
                            <span
                                className="section-eyebrow"
                                style={{ color: '#86868b' }}
                            >
                                Pro Features
                            </span>
                            <div className="eyebrow-bar" />
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(26px, 4vw, 32px)',
                            fontWeight: 600,
                            color: '#000',
                            letterSpacing: '-0.01em',
                            marginBottom: '8px',
                        }}>
                            Why Go Pro?
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#86868b',
                            lineHeight: 1.6,
                            maxWidth: '480px',
                            margin: '0 auto 48px',
                        }}>
                            Powerful features designed to help you stay organized and never miss an opportunity.
                        </p>
                    </div>

                    <Row className="g-3">
                        {proFeatures.map((feat, i) => (
                            <Col lg={4} md={6} key={i}>
                                <div
                                    style={{
                                        background: '#f5f5f7',
                                        borderRadius: '20px',
                                        padding: '32px 24px',
                                        textAlign: 'center',
                                        height: '100%',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        background: '#e8e8ed',
                                        color: '#000',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{feat.icon}</span>
                                    </div>
                                    <h5 style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#000',
                                        marginBottom: '8px',
                                        letterSpacing: '-0.01em',
                                    }}>
                                        {feat.title}
                                    </h5>
                                    <p style={{
                                        fontSize: '13px',
                                        color: '#86868b',
                                        lineHeight: 1.5,
                                        margin: 0,
                                    }}>
                                        {feat.desc}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* FAQ */}
            <section style={{ padding: '96px 0', background: '#f5f5f7' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={7}>
                            <div className="text-center mb-5">
                                <div className="d-flex flex-column align-items-center mb-3">
                                    <span
                                        className="section-eyebrow"
                                        style={{ color: '#86868b' }}
                                    >
                                        FAQ
                                    </span>
                                    <div className="eyebrow-bar" />
                                </div>
                                <h2 style={{
                                    fontSize: 'clamp(26px, 4vw, 32px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.01em',
                                }}>
                                    Frequently Asked Questions
                                </h2>
                            </div>

                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '16px',
                                        marginBottom: '12px',
                                        overflow: 'hidden',
                                        transition: 'all 0.15s ease',
                                        border: '1px solid #f0f0f0',
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{
                                            width: '100%',
                                            padding: '20px 24px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#000',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'transparent',
                                            border: 'none',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {faq.q}
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: '20px',
                                                color: '#86868b',
                                                transition: 'transform 0.2s ease',
                                                transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                                                flexShrink: 0,
                                                marginLeft: '12px',
                                            }}
                                        >
                                            expand_more
                                        </span>
                                    </button>
                                    {openFaq === i && (
                                        <div style={{
                                            padding: '0 24px 20px',
                                            fontSize: '14px',
                                            color: '#86868b',
                                            lineHeight: 1.6,
                                        }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA */}
            <section style={{ padding: '96px 0', background: '#000', textAlign: 'center' }}>
                <Container>
                    <div className="d-flex flex-column align-items-center mb-3">
                        <span
                            className="section-eyebrow"
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                            Get Started
                        </span>
                        <div className="eyebrow-bar" />
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(26px, 4vw, 32px)',
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '-0.01em',
                        marginBottom: '12px',
                    }}>
                        Ready to Never Miss an Opportunity?
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.4)',
                        maxWidth: '480px',
                        margin: '0 auto 32px',
                        lineHeight: 1.6,
                    }}>
                        Join thousands of ambitious professionals who stay organized and ahead of deadlines.
                    </p>
                    <button
                        onClick={() => handleSubscribe(pricingPlans[1])}
                        disabled={isProcessing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '14px 32px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                        Start Pro for {currency === 'USD' ? '$' : '₦'}{pricingPlans[1].price[billingPeriod][currency].toLocaleString()}/{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                    </button>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px' }}>
                        No credit card required
                    </div>
                </Container>
            </section>

            <FixedMobileNav isAuthenticated={(props.auth.user) ? true : false} />
        </GuestLayout>
    );
};

export default Subscription;
