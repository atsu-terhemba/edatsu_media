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
    const [currency, setCurrency] = useState('USD');

    const pricingPlans = [
        {
            id: 'free',
            name: 'Free Explorer',
            price: { USD: 0, NGN: 0 },
            period: 'Forever',
            description: 'Perfect for getting started with opportunities',
            popular: false,
            features: [
                'Access to basic opportunities',
                'Weekly newsletter',
                'Community access',
                'Basic search filters',
                'Mobile app access',
                'Email notifications'
            ],
            limitations: [
                'Limited to 10 bookmarks',
                'Basic support only',
                'Standard search results',
                'No access to complete opportunity database',
                'Limited to featured opportunities only'
            ],
            buttonText: 'Get Started Free',
            buttonClass: 'btn-outline-primary'
        },
        {
            id: 'premium',
            name: 'Premium Pro',
            price: { USD: 0.99, NGN: 1300 },
            period: 'month',
            description: 'Unlock premium features and exclusive opportunities',
            popular: true,
            features: [
                'Everything in Free Explorer plus:',
                'Access to All Opportunities Posts',
                'Unlimited bookmarks',
                'Priority customer support',
                'Remove ads',
                'Export opportunities to PDF',
                'Real-time notifications'
            ],
            limitations: [],
            buttonText: 'Start Premium Trial',
            buttonClass: 'btn-primary'
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
                        price: plan.price[currency],
                        currency: currency
                    });
                    
                    if (response.data.success) {
                        alert('Welcome to the Free Explorer plan! You now have access to all basic features.');
                    }
                }
            } else {
                // Handle premium plan payment
                if (!props.auth.user) {
                    // Save selected plan and redirect to registration
                    localStorage.setItem('selectedPlan', JSON.stringify({ 
                        plan: plan, 
                        currency: currency 
                    }));
                    window.location.href = '/register';
                } else {
                    // Process premium subscription
                    const response = await axios.post('/process-subscription', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        price: plan.price[currency],
                        currency: currency
                    });
                    
                    if (response.data.success) {
                        // Redirect to payment gateway or show success message
                        if (response.data.payment_url) {
                            window.location.href = response.data.payment_url;
                        } else {
                            alert('Premium subscription activated! Welcome to Premium Pro.');
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
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 4rem 0;
                    margin-bottom: 3rem;
                }
                
                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .pricing-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                }
                
                .pricing-card.popular {
                    border-color: #3b82f6;
                    transform: scale(1.05);
                }
                
                .popular-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    padding: 8px 24px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                }
                
                .price-display {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #1f2937;
                    margin: 1rem 0;
                }
                
                .price-currency {
                    font-size: 1.5rem;
                    vertical-align: top;
                    margin-right: 0.5rem;
                }
                
                .price-period {
                    font-size: 1rem;
                    color: #6b7280;
                    font-weight: 400;
                }
                
                .feature-list {
                    flex-grow: 1;
                    margin: 2rem 0;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                }
                
                .highlight-feature {
                    background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    border-radius: 8px;
                    padding: 0.75rem;
                    margin-bottom: 1rem !important;
                    font-weight: 600;
                    position: relative;
                }
                
                .highlight-feature .feature-icon {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: white;
                }
                
                .feature-icon {
                    background: #dbeafe;
                    color: #3b82f6;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    font-size: 12px;
                }
                
                .limitation-icon {
                    background: #fef2f2;
                    color: #ef4444;
                }
                
                .currency-toggle {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 30px;
                    padding: 0.5rem 1.5rem;
                    color: white;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .currency-toggle:hover {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    transform: translateY(-2px);
                }
                
                .features-section {
                    background: #f8fafc;
                    padding: 4rem 0;
                    margin-top: 4rem;
                }
                
                .feature-highlight {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: 100%;
                }
                
                .feature-highlight-icon {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    font-size: 24px;
                }
                
                @media (max-width: 768px) {
                    .pricing-hero {
                        padding: 2rem 0;
                    }
                    
                    .pricing-card {
                        padding: 2rem;
                        margin-bottom: 2rem;
                    }
                    
                    .pricing-card.popular {
                        transform: none;
                    }
                    
                    .price-display {
                        font-size: 2.5rem;
                    }
                    
                    .currency-toggle {
                        width: 100%;
                        margin-bottom: 2rem;
                    }
                }
                
                @media (max-width: 576px) {
                    .pricing-card {
                        padding: 1.5rem;
                    }
                    
                    .price-display {
                        font-size: 2rem;
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

            {/* Hero Section */}
            <div className="pricing-hero">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h1 className="display-4 fw-bold mb-4">
                                Choose Your Growth Plan
                            </h1>
                            <p className="lead mb-4">
                                Unlock exclusive opportunities and premium features designed to accelerate your business growth journey.
                            </p>
                            <button 
                                className="currency-toggle btn"
                                onClick={toggleCurrency}
                            >
                                <span className="material-symbols-outlined me-2" style={{fontSize: '20px'}}>
                                    currency_exchange
                                </span>
                                Switch to {currency === 'USD' ? 'NGN (₦)' : 'USD ($)'}
                            </button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Pricing Cards */}
            <Container>
                <Row className="justify-content-center g-4">
                    {pricingPlans.map((plan) => (
                        <Col lg={5} md={6} key={plan.id}>
                            <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && (
                                    <div className="popular-badge">
                                        <span className="material-symbols-outlined me-1" style={{fontSize: '16px'}}>
                                            star
                                        </span>
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="text-center">
                                    <h3 className="fw-bold mb-2">{plan.name}</h3>
                                    <p className="text-muted mb-3">{plan.description}</p>
                                    
                                    <div className="price-display">
                                        <span className="price-currency">
                                            {currency === 'USD' ? '$' : '₦'}
                                        </span>
                                        {plan.price[currency].toLocaleString()}
                                        <span className="price-period">
                                            {plan.price[currency] > 0 ? ` /${plan.period}` : ''}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="feature-list">
                                    <h6 className="fw-semibold mb-3">What's included:</h6>
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className={`feature-item ${
                                            feature.includes('All Opportunities Posts') ? 'highlight-feature' : ''
                                        }`}>
                                            <div className="feature-icon">
                                                <span className="material-symbols-outlined" style={{fontSize: '12px'}}>
                                                    {feature.includes('All Opportunities Posts') ? 'stars' : 'check'}
                                                </span>
                                            </div>
                                            {feature}
                                            {feature.includes('All Opportunities Posts') && (
                                                <span className="badge bg-warning text-dark ms-2">New!</span>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {plan.limitations.length > 0 && (
                                        <>
                                            <h6 className="fw-semibold mb-3 mt-4 text-muted">Limitations:</h6>
                                            {plan.limitations.map((limitation, index) => (
                                                <div key={index} className="feature-item">
                                                    <div className="feature-icon limitation-icon">
                                                        <span className="material-symbols-outlined" style={{fontSize: '12px'}}>
                                                            close
                                                        </span>
                                                    </div>
                                                    <span className="text-muted">{limitation}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                
                                <button
                                    className={`btn ${plan.buttonClass} w-100 fw-bold py-3`}
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isProcessing}
                                    style={{marginTop: 'auto'}}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>
                                                {plan.id === 'free' ? 'rocket_launch' : 'workspace_premium'}
                                            </span>
                                            {plan.buttonText}
                                        </>
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
                            <h2 className="fw-bold mb-3">Why Choose Edatsu Media?</h2>
                            <p className="lead text-muted">
                                Join thousands of entrepreneurs who trust us to deliver the best business opportunities and insights.
                            </p>
                        </Col>
                    </Row>
                    
                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">database</span>
                                </div>
                                <h5 className="fw-bold mb-3">Complete Opportunity Database</h5>
                                <p className="text-muted">
                                    Premium subscribers get exclusive access to our complete database of all opportunities posts, 
                                    including historical data and comprehensive search capabilities.
                                </p>
                                <div className="text-center mt-3">
                                    <span className="badge bg-warning text-dark">Premium Feature</span>
                                </div>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <h5 className="fw-bold mb-3">Exclusive Opportunities</h5>
                                <p className="text-muted">
                                    Access premium business opportunities not available anywhere else, curated specifically for our subscribers.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <h5 className="fw-bold mb-3">Priority Support</h5>
                                <p className="text-muted">
                                    Get dedicated support from our team to help you make the most of every opportunity that comes your way.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                </div>
                                <h5 className="fw-bold mb-3">Real-time Alerts</h5>
                                <p className="text-muted">
                                    Never miss an opportunity with instant notifications delivered directly to your device as soon as they're available.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <h5 className="fw-bold mb-3">Analytics Dashboard</h5>
                                <p className="text-muted">
                                    Track your application success rate and get insights to improve your chances of winning opportunities.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">security</span>
                                </div>
                                <h5 className="fw-bold mb-3">Secure & Reliable</h5>
                                <p className="text-muted">
                                    Your data is protected with enterprise-grade security, and our platform maintains 99.9% uptime.
                                </p>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={6}>
                            <div className="feature-highlight">
                                <div className="feature-highlight-icon">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                                <h5 className="fw-bold mb-3">Community Access</h5>
                                <p className="text-muted">
                                    Connect with like-minded entrepreneurs and share insights in our exclusive subscriber community.
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
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                        Can I upgrade or downgrade my plan anytime?
                                    </button>
                                </h3>
                                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Yes! You can upgrade to Premium anytime to unlock additional features. If you're on Premium and want to downgrade, you'll retain access until your current billing cycle ends.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                        What payment methods do you accept?
                                    </button>
                                </h3>
                                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        We accept all major credit cards, PayPal, and local payment methods including bank transfers and mobile money for Nigerian users.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                        What does "All Opportunities Posts" include?
                                    </button>
                                </h3>
                                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Premium subscribers get access to our complete database of all opportunity posts, including archived opportunities, advanced search filters, bulk export features, and the ability to view detailed analytics and trends. This comprehensive access helps you discover opportunities you might have missed and track market patterns.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                        Is there a free trial for Premium?
                                    </button>
                                </h3>
                                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Yes! New users get a 7-day free trial of Premium features. No credit card required to start your trial.
                                    </div>
                                </div>
                            </div>
                            
                            <div className="accordion-item border-0 mb-3" style={{borderRadius: '12px', overflow: 'hidden'}}>
                                <h3 className="accordion-header">
                                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                        Can I cancel my subscription anytime?
                                    </button>
                                </h3>
                                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        Absolutely! You can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your current billing period.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <FixedMobileNav isAuthenticated={(props.auth.user) ? true : false} />
        </GuestLayout>
    );
};

export default Subscription;
