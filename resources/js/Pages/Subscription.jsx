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
            buttonClass: 'btn-primary'
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
                { text: 'Ad-free browsing experience', icon: 'block', highlight: false },
                { text: 'Priority access to new opportunities', icon: 'bolt', highlight: false },
                { text: 'Export saved items (PDF / CSV)', icon: 'download', highlight: false }
            ],
            limitations: [],
            buttonText: 'Upgrade to Pro',
            buttonClass: 'btn-success'
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleSubscribe = async (plan) => {
        setIsProcessing(true);
        
        try {
            if (plan.id === 'free') {
                // Handle free plan signup - redirect to registration if not authenticated
                if (!props.auth.user) {
                    window.location.href = '/register';
                } else {
                    // User is already registered, just update their plan
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
                // Handle premium plan payment
                if (!props.auth.user) {
                    // Save selected plan and redirect to registration
                    localStorage.setItem('selectedPlan', JSON.stringify({ 
                        plan: plan, 
                        currency: currency,
                        billingPeriod: billingPeriod
                    }));
                    window.location.href = '/register';
                } else {
                    // Process premium subscription
                    const response = await axios.post('/process-subscription', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        price: plan.price[billingPeriod][currency],
                        currency: currency,
                        billing_period: billingPeriod
                    });
                    
                    if (response.data.success) {
                        // Redirect to payment gateway or show success message
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

    return (
        <GuestLayout>
            <style>{`
                .pricing-hero {
                    padding: 4rem 0 3rem;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }
                
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 1.25rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: white;
                }
                
                .billing-toggle {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .toggle-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.5rem;
                    border-radius: 50px;
                    border: none;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .toggle-btn.active {
                    background: white;
                    color: #374151;
                }
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .toggle-btn.active {
                    background: white;
                    color: #1f2937;
                    font-weight: 600;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .toggle-btn .save-badge {
                    background: #e9ecef;
                    color: #374151;
                    padding: 0.15rem 0.5rem;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 600;
                }
                
                .toggle-switch {
                    position: relative;
                    width: 52px;
                    height: 28px;
                    background: #e9ecef;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .toggle-switch.active {
                    background: #374151;
                }
                
                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 22px;
                    height: 22px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                
                .toggle-switch.active::after {
                    transform: translateX(24px);
                }
                
                .save-badge {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .currency-toggle {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-radius: 50px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .currency-toggle:hover {
                    background: rgba(255, 255, 255, 0.25);
                    color: white;
                }
                
                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    max-width: 420px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                
                .pricing-card:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                    transform: translateY(-4px);
                }
                
                .pricing-card.popular {
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                }
                
                .popular-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #dc2626;
                    color: white;
                    padding: 5px 14px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    white-space: nowrap;
                }
                
                .plan-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    font-size: 24px;
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .plan-icon.free {
                    background: #f3f4f6;
                    color: #6b7280;
                }
                
                .plan-icon.premium {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .price-display {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0.5rem 0;
                    line-height: 1;
                }
                
                .price-currency {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .price-period {
                    font-size: 0.9rem;
                    color: #6b7280;
                    font-weight: 400;
                }
                
                .pricing-note {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    margin-top: 0.25rem;
                }
                
                .feature-list {
                    flex-grow: 1;
                    margin: 1.5rem 0;
                }
                
                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.875rem;
                    font-size: 0.9rem;
                    color: #374151;
                }
                
                .feature-item.highlight-feature {
                    font-weight: 500;
                }
                
                .feature-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                    background: #f3f4f6;
                    color: #6b7280;
                }
                
                .feature-icon.check {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .feature-icon.premium-icon {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .limitation-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    font-size: 0.85rem;
                    color: #9ca3af;
                }
                
                .limitation-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    background: #f3f4f6;
                    color: #9ca3af;
                    flex-shrink: 0;
                }
                
                .btn-primary-dark {
                    background: #374151;
                    border: none;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .btn-primary-dark:hover {
                    background: #1f2937;
                    color: white;
                    transform: translateY(-1px);
                }
                
                .btn-outline-dark {
                    background: transparent;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-dark:hover {
                    background: #f8fafc;
                    border-color: #d1d5db;
                }
                
                .features-section {
                    background: #f8f9fa;
                    padding: 4rem 0;
                    margin-top: 3rem;
                }
                
                .feature-highlight {
                    background: white;
                    border-radius: 16px;
                    padding: 1.75rem;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                    height: 100%;
                    transition: all 0.3s ease;
                }
                
                .feature-highlight:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }
                
                .feature-highlight-icon {
                    background: #f3f4f6;
                    color: #374151;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    font-size: 22px;
                }
                
                .premium-badge-sm {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: #e9ecef;
                    color: #374151;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .pricing-hero {
                        padding: 2rem 0 1rem;
                    }
                    
                    .pricing-card {
                        padding: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    
                    .price-display {
                        font-size: 2.25rem;
                    }
                    
                    .billing-toggle {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
                
                @media (max-width: 576px) {
                    .pricing-card {
                        padding: 1.25rem;
                    }
                    
                    .price-display {
                        font-size: 2rem;
                    }
                    
                    .plan-icon {
                        width: 48px;
                        height: 48px;
                        font-size: 24px;
                    }
                }
            `}</style>

            <Metadata
                title="Subscription Plans - Edatsu Media"
                description="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support with Edatsu Media subscription plans."
                keywords="subscription plans, business opportunities, premium access, Edatsu Media pricing, exclusive opportunities, business growth"
                canonicalUrl={`${window.location.origin}/subscription`}
                ogTitle="Subscription Plans - Edatsu Media"
                ogDescription="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."
                twitterTitle="Subscription Plans - Edatsu Media"
                twitterDescription="Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."
            />

            {/* Hero Section - Same as Home Banner */}
            <Container fluid={true}>
                <Row className="footer-banner position-relative border-0">
                    <div className="overlay d-flex align-items-center">
                        <Container>
                            <Row className="justify-content-center">
                                <Col lg={8} className="text-center">
                                    <div className="hero-badge">
                                        Choose Your Plan
                                    </div>
                                    <h1 
                                        className="text-m-0 mb-3 p-0 text-light fw-bold" 
                                        style={{ 
                                            fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                                            lineHeight: '1.2'
                                        }}
                                    >
                                        Simple, Transparent Pricing
                                    </h1>
                                    <p 
                                        className="banner-subtitle text-light mb-4 px-2 px-sm-0"
                                        style={{
                                            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                                            lineHeight: '1.5',
                                            maxWidth: '600px',
                                            margin: '0 auto 1.5rem'
                                        }}
                                    >
                                        Start for free and upgrade when you're ready. No hidden fees, cancel anytime.
                                    </p>
                                    
                                    {/* Billing Toggle */}
                                    <div className="billing-toggle">
                                        <button 
                                            className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                                            onClick={() => setBillingPeriod('monthly')}
                                        >
                                            Monthly
                                        </button>
                                        <button 
                                            className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                                            onClick={() => setBillingPeriod('yearly')}
                                        >
                                            Yearly
                                            <span className="save-badge">Save 10%</span>
                                        </button>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <button 
                                            className="currency-toggle btn"
                                            onClick={toggleCurrency}
                                            style={{color: 'rgba(255, 255, 255, 0.9)'}}
                                        >
                                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>
                                                currency_exchange
                                            </span>
                                            Switch to {currency === 'USD' ? 'NGN (₦)' : 'USD ($)'}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Row>
            </Container>

            {/* Pricing Cards */}
            <Container className="py-5">
                <Row className="justify-content-center g-4">
                    {pricingPlans.map((plan) => (
                        <Col lg={4} md={6} key={plan.id}>
                            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && (
                                    <div className="popular-badge">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className={`plan-icon ${plan.id}`}>
                                    <span className="material-symbols-outlined">
                                        {plan.icon}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="fw-bold mb-2">{plan.name}</h3>
                                    <p className="text-muted mb-3">{plan.description}</p>
                                    
                                    <div className="price-display">
                                        <span className="price-currency">
                                            {currency === 'USD' ? '$' : '₦'}
                                        </span>
                                        {plan.price[billingPeriod][currency].toLocaleString()}
                                        <span className="price-period">
                                            {plan.price[billingPeriod][currency] > 0 ? ` /${billingPeriod === 'monthly' ? 'month' : 'year'}` : ''}
                                        </span>
                                    </div>
                                    {plan.id === 'premium' && (
                                        <p className="text-muted small mb-0">Cancel anytime • No hidden fees</p>
                                    )}
                                </div>
                                
                                <div className="feature-list">
                                    <h6 className="fw-semibold mb-3 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.05em', color: '#64748b'}}>
                                        {plan.id === 'premium' ? "Everything you need" : "What's included"}
                                    </h6>
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className={`feature-item ${feature.highlight ? 'highlight-feature' : ''}`}>
                                            <div className={`feature-icon ${plan.id === 'premium' && feature.highlight ? 'premium-icon' : 'check'}`}>
                                                <span className="material-symbols-outlined" style={{fontSize: '14px'}}>
                                                    {feature.icon || 'check'}
                                                </span>
                                            </div>
                                            <span style={{fontWeight: feature.highlight ? 600 : 400}}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                    
                                    {plan.limitations.length > 0 && (
                                        <>
                                            <h6 className="fw-semibold mb-3 mt-4 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.05em', color: '#94a3b8'}}>
                                                Limitations
                                            </h6>
                                            {plan.limitations.map((limitation, index) => (
                                                <div key={index} className="limitation-item">
                                                    <div className="limitation-icon">
                                                        <span className="material-symbols-outlined" style={{fontSize: '12px'}}>
                                                            close
                                                        </span>
                                                    </div>
                                                    <span>{limitation}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                
                                <button
                                    className={`btn ${plan.buttonClass} w-100 fw-bold py-3`}
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isProcessing}
                                    style={{marginTop: 'auto', borderRadius: '12px'}}
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

            {/* Feature Highlights */}
            <div className="features-section">
                <Container>
                    <Row className="text-center mb-5">
                        <Col lg={8} className="mx-auto">
                            <div className="premium-badge-sm mb-3">
                                <span className="material-symbols-outlined" style={{fontSize: '14px'}}>workspace_premium</span>
                                Pro Features
                            </div>
                            <h2 className="fw-bold mb-3">Why Go Pro?</h2>
                            <p className="lead text-muted">
                                Unlock powerful features designed to help you stay organized and never miss an opportunity.
                            </p>
                        </Col>
                    </Row>
                    
                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">all_inclusive</span>
                                </div>
                                <h5 className="fw-bold mb-3">Unlimited Saves</h5>
                                <p className="text-muted">
                                    Save as many opportunities and tools as you want. No limits, no restrictions. Build your personal database.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <h5 className="fw-bold mb-3">Smart Reminders</h5>
                                <p className="text-muted">
                                    Get push notifications and email alerts for deadlines and key dates. Never miss an application window again.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                </div>
                                <h5 className="fw-bold mb-3">Google Calendar Sync</h5>
                                <p className="text-muted">
                                    Automatically sync deadlines to your Google Calendar. Stay organized with all your dates in one place.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                </div>
                                <h5 className="fw-bold mb-3">Personalized AI Assistant</h5>
                                <p className="text-muted">
                                    Get AI-powered recommendations tailored to your profile. Ask questions, get insights, and discover opportunities matched to you.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">block</span>
                                </div>
                                <h5 className="fw-bold mb-3">Ad-Free Experience</h5>
                                <p className="text-muted">
                                    Browse and research opportunities without distractions. Enjoy a clean, focused browsing experience.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <h5 className="fw-bold mb-3">Priority Access</h5>
                                <p className="text-muted">
                                    Get early access to newly listed opportunities before they're available to free users. Apply first, win more.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">download</span>
                                </div>
                                <h5 className="fw-bold mb-3">Export Your Data</h5>
                                <p className="text-muted">
                                    Download your saved opportunities as PDF or CSV. Share with your team or keep offline records.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FAQ Section */}
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <h2 className="text-center fw-bold mb-5">Frequently Asked Questions</h2>
                        
                        <div className="accordion" id="faqAccordion">
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                        How do smart reminders work?
                                    </button>
                                </h3>
                                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        When you save an opportunity with a deadline, you can set custom reminders. We'll send you push notifications and email alerts before the deadline so you never miss an application window. You control when and how you want to be reminded.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                        How does Google Calendar sync work?
                                    </button>
                                </h3>
                                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Connect your Google Calendar once, and we'll automatically add opportunity deadlines as calendar events. You'll see all your important dates right in your calendar alongside your other commitments.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                        What export formats are available?
                                    </button>
                                </h3>
                                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Premium users can export their saved opportunities and tools as PDF (great for printing or sharing) or CSV (perfect for spreadsheets and data analysis). Export your entire list or select specific items.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                        What can the AI Assistant do?
                                    </button>
                                </h3>
                                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Your personalized AI assistant learns your preferences and goals to recommend the most relevant opportunities. Ask it questions like "Find grants for tech startups in Africa" or "What opportunities match my profile?" and get instant, tailored results.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                        What does priority access mean?
                                    </button>
                                </h3>
                                <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Premium members get early access to newly listed opportunities. When hot opportunities are added, you'll see them first—giving you a head start on applications before the crowd.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">
                                        Can I cancel my subscription anytime?
                                    </button>
                                </h3>
                                <div id="faq6" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Absolutely! Cancel anytime with no questions asked. You'll keep Premium access until the end of your billing period. Your saved opportunities will remain accessible on the free plan (up to 10 items).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* CTA Section */}
            <div style={{
                background: '#f3f4f6',
                padding: '4rem 0',
                marginTop: '2rem',
                textAlign: 'center'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <h2 className="fw-bold mb-3" style={{color: '#1f2937'}}>Ready to Never Miss an Opportunity?</h2>
                            <p className="lead mb-4" style={{color: '#6b7280'}}>
                                Join thousands of ambitious professionals who stay organized and ahead of deadlines.
                            </p>
                            <button 
                                className="btn btn-success btn-lg fw-bold px-5 py-3"
                                onClick={() => handleSubscribe(pricingPlans[1])}
                                disabled={isProcessing}
                                style={{borderRadius: '12px'}}
                            >
                                Start Pro for {currency === 'USD' ? '$' : '₦'}{pricingPlans[1].price[billingPeriod][currency].toLocaleString()}/{billingPeriod === 'monthly' ? 'month' : 'year'}
                            </button>
                            <p className="mt-3 small" style={{color: '#6b7280'}}>No credit card required - Cancel anytime</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <FixedMobileNav isAuthenticated={(props.auth.user) ? true : false} />
        </GuestLayout>
    );
};

export default Subscription;
