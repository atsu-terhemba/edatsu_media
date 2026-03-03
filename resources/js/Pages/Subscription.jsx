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
                monthly: { USD: 2.11, NGN: 3000 },
                yearly: { USD: 22.79, NGN: 32400 }
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

    return (
        <GuestLayout>
            <style>{`
                /* Hero */
                .sub-hero {
                    padding: 80px 0 60px;
                    text-align: center;
                }
                .sub-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 13px;
                    font-weight: 400;
                    padding: 6px 16px;
                    border-radius: 980px;
                    margin-bottom: 20px;
                }
                .sub-hero h1 {
                    font-size: 44px;
                    font-weight: 600;
                    line-height: 1.12;
                    letter-spacing: -0.005em;
                    color: #fff;
                    margin-bottom: 12px;
                }
                .sub-hero p {
                    font-size: 17px;
                    line-height: 1.47;
                    font-weight: 400;
                    letter-spacing: -0.022em;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 520px;
                    margin: 0 auto 28px;
                }

                /* Toggle Controls */
                .sub-toggle-group {
                    display: inline-flex;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 980px;
                    padding: 3px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .sub-toggle-btn {
                    padding: 8px 20px;
                    border: none;
                    background: transparent;
                    border-radius: 980px;
                    font-size: 14px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.6);
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .sub-toggle-btn.active {
                    background: #fff;
                    color: #1d1d1f;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                }
                .sub-save-pill {
                    background: rgba(22, 163, 74, 0.15);
                    color: #4ade80;
                    padding: 2px 8px;
                    border-radius: 980px;
                    font-size: 11px;
                    font-weight: 600;
                }
                .sub-toggle-btn.active .sub-save-pill {
                    background: rgba(22, 163, 74, 0.1);
                    color: #16a34a;
                }
                .sub-currency-btn {
                    padding: 8px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 980px;
                    font-size: 13px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .sub-currency-btn:hover {
                    background: rgba(255, 255, 255, 0.12);
                    color: #fff;
                }

                /* Subscription Cards */
                .sub-cards-section {
                    padding: 64px 0 48px;
                    background: #f5f5f7;
                }
                .sub-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 40px 32px 32px;
                    border: 1px solid rgba(0, 0, 0, 0.04);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    max-width: 420px;
                    margin: 0 auto;
                    overflow: hidden;
                }
                .sub-card:hover {
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                }
                .sub-card.featured {
                    border: 2px solid #1d1d1f;
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
                }
                .sub-card.featured:hover {
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14);
                    transform: translateY(-4px);
                }
                .sub-card-badge {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #1d1d1f;
                    color: #fff;
                    text-align: center;
                    padding: 6px 0;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .sub-card.featured {
                    padding-top: 56px;
                }
                .sub-card-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                }
                .sub-card-icon.free {
                    background: #f5f5f7;
                    color: #86868b;
                }
                .sub-card-icon.pro {
                    background: #1d1d1f;
                    color: #fff;
                }
                .sub-card-name {
                    font-size: 22px;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin-bottom: 4px;
                    letter-spacing: -0.01em;
                }
                .sub-card-desc {
                    font-size: 15px;
                    color: #86868b;
                    margin-bottom: 24px;
                    line-height: 1.5;
                }
                .sub-card-price {
                    font-size: 48px;
                    font-weight: 600;
                    color: #1d1d1f;
                    line-height: 1;
                    letter-spacing: -0.025em;
                    margin-bottom: 4px;
                }
                .sub-card-price-unit {
                    font-size: 16px;
                    font-weight: 400;
                    color: #86868b;
                }
                .sub-card-price-note {
                    font-size: 13px;
                    color: #86868b;
                    margin-bottom: 28px;
                }
                .sub-card-divider {
                    height: 1px;
                    background: #f5f5f7;
                    margin: 0 -32px 24px;
                }
                .sub-card-features-title {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #86868b;
                    margin-bottom: 16px;
                }
                .sub-card-feature {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 7px 0;
                    font-size: 14px;
                    color: #1d1d1f;
                    line-height: 1.4;
                }
                .sub-card-feature.highlighted {
                    font-weight: 500;
                }
                .sub-card-feature-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                .sub-card-feature-icon.check {
                    background: #f5f5f7;
                    color: #1d1d1f;
                }
                .sub-card-feature-icon.pro-check {
                    background: #1d1d1f;
                    color: #fff;
                }
                .sub-card-limitation {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 5px 0;
                    font-size: 13px;
                    color: #86868b;
                }
                .sub-card-limitation-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: #f5f5f7;
                    color: #86868b;
                }
                .sub-card-btn {
                    display: block;
                    width: 100%;
                    padding: 14px;
                    border-radius: 980px;
                    font-size: 15px;
                    font-weight: 500;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    margin-top: auto;
                }
                .sub-card-btn.free-btn {
                    background: #f5f5f7;
                    color: #1d1d1f;
                }
                .sub-card-btn.free-btn:hover {
                    background: #e8e8ed;
                }
                .sub-card-btn.pro-btn {
                    background: #1d1d1f;
                    color: #fff;
                }
                .sub-card-btn.pro-btn:hover {
                    background: #000;
                }

                /* Why Pro Section */
                .sub-why-section {
                    padding: 80px 0;
                    background: #fff;
                }
                .sub-why-label {
                    font-size: 13px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: #86868b;
                    margin-bottom: 8px;
                }
                .sub-why-title {
                    font-size: 32px;
                    font-weight: 600;
                    color: #1d1d1f;
                    letter-spacing: -0.01em;
                    margin-bottom: 8px;
                }
                .sub-why-subtitle {
                    font-size: 17px;
                    color: #86868b;
                    line-height: 1.47;
                    max-width: 500px;
                    margin: 0 auto 48px;
                }
                .sub-feature-card {
                    background: #f5f5f7;
                    border-radius: 18px;
                    padding: 32px 24px;
                    text-align: center;
                    height: 100%;
                    transition: all 0.3s ease;
                }
                .sub-feature-card:hover {
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                }
                .sub-feature-card-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    font-size: 22px;
                    background: #1d1d1f;
                    color: #fff;
                }
                .sub-feature-card h5 {
                    font-size: 17px;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin-bottom: 8px;
                    letter-spacing: -0.01em;
                }
                .sub-feature-card p {
                    font-size: 14px;
                    color: #86868b;
                    line-height: 1.5;
                    margin: 0;
                }

                /* FAQ Section */
                .sub-faq-section {
                    padding: 80px 0;
                    background: #f5f5f7;
                }
                .sub-faq-item {
                    background: #fff;
                    border-radius: 14px;
                    margin-bottom: 12px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                .sub-faq-item:hover {
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                }
                .sub-faq-q {
                    padding: 20px 24px;
                    font-size: 15px;
                    font-weight: 600;
                    color: #1d1d1f;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                }
                .sub-faq-a {
                    padding: 0 24px 20px;
                    font-size: 14px;
                    color: #86868b;
                    line-height: 1.6;
                }

                /* CTA */
                .sub-cta-section {
                    padding: 80px 0;
                    background: #1d1d1f;
                    text-align: center;
                }
                .sub-cta-section h2 {
                    font-size: 32px;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: -0.01em;
                    margin-bottom: 12px;
                }
                .sub-cta-section p {
                    font-size: 17px;
                    color: rgba(255, 255, 255, 0.5);
                    max-width: 480px;
                    margin: 0 auto 32px;
                    line-height: 1.47;
                }
                .sub-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    color: #1d1d1f;
                    border: none;
                    border-radius: 980px;
                    padding: 14px 32px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .sub-cta-btn:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: scale(1.02);
                }
                .sub-cta-note {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.35);
                    margin-top: 16px;
                }

                @media (max-width: 768px) {
                    .sub-hero { padding: 56px 0 40px; }
                    .sub-hero h1 { font-size: 32px; }
                    .sub-hero p { font-size: 15px; }
                    .sub-cards-section { padding: 40px 0 32px; }
                    .sub-card { padding: 32px 24px 24px; }
                    .sub-card.featured { padding-top: 48px; }
                    .sub-card-price { font-size: 40px; }
                    .sub-card-divider { margin: 0 -24px 20px; }
                    .sub-why-section { padding: 56px 0; }
                    .sub-why-title { font-size: 26px; }
                    .sub-faq-section { padding: 56px 0; }
                    .sub-cta-section { padding: 56px 0; }
                    .sub-cta-section h2 { font-size: 26px; }
                }
            `}</style>

            <Metadata
                title="Subscription Plans - Edatsu Media"
                description="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support with Edatsu Media subscription plans."
                keywords="subscription plans, business opportunities, premium access, Edatsu Media pricing, exclusive opportunities, business growth"
                canonicalUrl={`${window.location.origin}/pricing`}
                ogTitle="Subscription Plans - Edatsu Media"
                ogDescription="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."
                twitterTitle="Subscription Plans - Edatsu Media"
                twitterDescription="Choose the perfect plan for your business growth journey."
            />

            {/* Hero Section */}
            <Container fluid={true}>
                <Row className="hero-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <div className="sub-hero">
                                <span className="sub-hero-badge">
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>workspace_premium</span>
                                    Choose Your Plan
                                </span>

                                <h1>
                                    Simple, transparent{' '}
                                    <span style={{ color: '#d97757' }}>pricing</span>
                                </h1>

                                <p>
                                    Start for free and upgrade when you're ready. No hidden fees, cancel anytime.
                                </p>

                                {/* Billing Toggle */}
                                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                                    <div className="sub-toggle-group">
                                        <button
                                            className={`sub-toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                                            onClick={() => setBillingPeriod('monthly')}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            className={`sub-toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                                            onClick={() => setBillingPeriod('yearly')}
                                        >
                                            Yearly
                                            <span className="sub-save-pill">Save 10%</span>
                                        </button>
                                    </div>

                                    <button className="sub-currency-btn" onClick={toggleCurrency}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>currency_exchange</span>
                                        {currency === 'USD' ? 'NGN (₦)' : 'USD ($)'}
                                    </button>
                                </div>
                            </div>
                        </Container>
                    </div>
                </Row>
            </Container>

            {/* Subscription Cards */}
            <div className="sub-cards-section">
                <Container>
                    <Row className="justify-content-center g-4">
                        {pricingPlans.map((plan) => (
                            <Col lg={4} md={6} key={plan.id}>
                                <div className={`sub-card ${plan.popular ? 'featured' : ''}`}>
                                    {plan.popular && (
                                        <div className="sub-card-badge">Most Popular</div>
                                    )}

                                    <div className={`sub-card-icon ${plan.id === 'premium' ? 'pro' : 'free'}`}>
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {plan.icon}
                                        </span>
                                    </div>

                                    <div className="sub-card-name">{plan.name}</div>
                                    <div className="sub-card-desc">{plan.description}</div>

                                    <div className="sub-card-price">
                                        {plan.price[billingPeriod][currency] === 0 ? (
                                            'Free'
                                        ) : (
                                            <>
                                                {currency === 'USD' ? '$' : '₦'}
                                                {plan.price[billingPeriod][currency].toLocaleString()}
                                            </>
                                        )}
                                        {plan.price[billingPeriod][currency] > 0 && (
                                            <span className="sub-card-price-unit">
                                                /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="sub-card-price-note">
                                        {plan.id === 'premium' ? 'Cancel anytime' : 'Forever free'}
                                    </div>

                                    <div className="sub-card-divider" />

                                    <div className="sub-card-features-title">
                                        {plan.id === 'premium' ? "Everything you need" : "What's included"}
                                    </div>

                                    <div style={{ flex: 1, marginBottom: '24px' }}>
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className={`sub-card-feature ${feature.highlight ? 'highlighted' : ''}`}>
                                                <div className={`sub-card-feature-icon ${plan.id === 'premium' ? 'pro-check' : 'check'}`}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span>
                                                </div>
                                                <span>{feature.text}</span>
                                            </div>
                                        ))}

                                        {plan.limitations.length > 0 && (
                                            <div style={{ marginTop: '16px' }}>
                                                {plan.limitations.map((limitation, index) => (
                                                    <div key={index} className="sub-card-limitation">
                                                        <div className="sub-card-limitation-icon">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>close</span>
                                                        </div>
                                                        <span>{limitation}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className={`sub-card-btn ${plan.id === 'premium' ? 'pro-btn' : 'free-btn'}`}
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            plan.buttonText
                                        )}
                                    </button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* Why Go Pro */}
            <div className="sub-why-section">
                <Container>
                    <div className="text-center">
                        <div className="sub-why-label">Pro Features</div>
                        <h2 className="sub-why-title">Why Go Pro?</h2>
                        <p className="sub-why-subtitle">
                            Powerful features designed to help you stay organized and never miss an opportunity.
                        </p>
                    </div>

                    <Row className="g-3">
                        {proFeatures.map((feat, i) => (
                            <Col lg={4} md={6} key={i}>
                                <div className="sub-feature-card">
                                    <div className="sub-feature-card-icon">
                                        <span className="material-symbols-outlined">{feat.icon}</span>
                                    </div>
                                    <h5>{feat.title}</h5>
                                    <p>{feat.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* FAQ */}
            <div className="sub-faq-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={7}>
                            <div className="text-center mb-5">
                                <h2 className="sub-why-title">Frequently Asked Questions</h2>
                            </div>

                            {faqs.map((faq, i) => (
                                <details key={i} className="sub-faq-item">
                                    <summary className="sub-faq-q">
                                        {faq.q}
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#86868b' }}>expand_more</span>
                                    </summary>
                                    <div className="sub-faq-a">{faq.a}</div>
                                </details>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* CTA */}
            <div className="sub-cta-section">
                <Container>
                    <h2>Ready to Never Miss an Opportunity?</h2>
                    <p>
                        Join thousands of ambitious professionals who stay organized and ahead of deadlines.
                    </p>
                    <button
                        className="sub-cta-btn"
                        onClick={() => handleSubscribe(pricingPlans[1])}
                        disabled={isProcessing}
                    >
                        Start Pro for {currency === 'USD' ? '$' : '₦'}{pricingPlans[1].price[billingPeriod][currency].toLocaleString()}/{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                    </button>
                    <div className="sub-cta-note">No credit card required</div>
                </Container>
            </div>

            <FixedMobileNav isAuthenticated={(props.auth.user) ? true : false} />
        </GuestLayout>
    );
};

export default Subscription;
